/**
 * Espaços de mídia. Sem arquivo, mostram um espaço reservado com tipo, proporção e
 * caminho esperado. Com arquivo, viram foto responsiva ou vídeo otimizado, sem
 * mudança de layout, porque a proporção já está reservada.
 */
import { esc, reducedMotion } from "../core/utils.js";

const ratioText = (ratio) => ratio.replace("/", ":");

function placeholder(kind, { ratio, label, path }) {
  return `<div class="slot-ph" data-placeholder>
    <span class="slot-kind">${kind === "video" ? "▶ Vídeo" : "Foto"} · ${esc(ratioText(ratio))}</span>
    <strong class="slot-label">${esc(label)}</strong>
    <code class="slot-path">${esc(path)}</code>
  </div>`;
}

const normalize = (value) => (typeof value === "string" ? { src: value } : value ?? {});

/** @param {{value:any, ratio:string, label:string, path:string, alt?:string, eager?:boolean, sizes?:string, className?:string}} o */
export function photo(o) {
  const file = normalize(o.value);
  const cls = `slot slot--photo ${o.className ?? ""}`;
  const style = `style="--r:${esc(o.ratio)}"`;
  if (!file.src) {
    return `<figure class="${cls} is-empty" ${style} role="img" aria-label="${esc(`Espaço reservado para fotografia: ${o.label}`)}">${placeholder("photo", o)}</figure>`;
  }
  const srcset = file.srcset ? `srcset="${esc(file.srcset)}" sizes="${esc(file.sizes ?? o.sizes ?? "100vw")}"` : "";
  const loading = o.eager ? `fetchpriority="high"` : `loading="lazy"`;
  return `<figure class="${cls}" ${style}><img src="${esc(file.src)}" ${srcset} alt="${esc(file.alt ?? o.alt ?? "")}" ${loading} decoding="async"></figure>`;
}

/**
 * `still` é a foto de referência, mostrada a quem prefere menos movimento.
 * `loop` só vale para vídeos sem embalagem: os demais param no último quadro.
 * @param {{value:any, poster?:any, still?:any, loop?:boolean, alt?:string, ratio:string, label:string, path:string, className?:string}} o
 */
export function video(o) {
  const file = normalize(o.value);
  const cls = `slot slot--video ${o.className ?? ""}`;
  const style = `style="--r:${esc(o.ratio)}"`;
  if (!file.src) {
    return `<figure class="${cls} is-empty" ${style} role="img" aria-label="${esc(`Espaço reservado para vídeo: ${o.label}`)}">${placeholder("video", o)}</figure>`;
  }
  const poster = normalize(reducedMotion && o.still ? o.still : o.poster).src;
  return `<figure class="${cls}" ${style}>
    <video src="${esc(file.src)}" ${poster ? `poster="${esc(poster)}"` : ""} muted ${o.loop ? "loop" : ""} playsinline preload="none" aria-label="${esc(o.alt ?? file.alt ?? o.label)}"></video>
    <button type="button" class="video-toggle" aria-label="Reproduzir vídeo" aria-pressed="false"><span aria-hidden="true">▶</span></button>
  </figure>`;
}

/** Preenche os espaços estáticos do HTML (data-slot) com os dados de site.media. */
export function hydrateSlots(mediaMap, root = document) {
  root.querySelectorAll("[data-slot]").forEach((el) => {
    const m = mediaMap[el.dataset.slot];
    if (!m) return;
    const common = { value: m.src, ratio: m.ratio, label: m.label, path: m.path, alt: m.alt };
    el.innerHTML = m.kind === "video" ? video({ ...common, poster: m.poster, still: m.still, loop: m.loop }) : photo({ ...common, sizes: m.sizes, eager: el.hasAttribute("data-eager") });
  });
}

/** Vídeos só tocam visíveis, sem som e com botão de pausa. Com movimento reduzido, só por clique. */
export function initVideos(root = document) {
  const videos = [...root.querySelectorAll(".slot--video video")];
  if (!videos.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      if (isIntersecting && !target.dataset.userPaused && !reducedMotion) target.play().catch(() => {});
      else if (!isIntersecting) target.pause();
    });
  }, { threshold: 0.35 });

  videos.forEach((v) => {
    const button = v.parentElement.querySelector(".video-toggle");
    const sync = () => {
      const playing = !v.paused;
      button.setAttribute("aria-label", playing ? "Pausar vídeo" : v.ended ? "Repetir vídeo" : "Reproduzir vídeo");
      button.setAttribute("aria-pressed", String(playing));
      button.firstElementChild.textContent = playing ? "❚❚" : v.ended ? "↻" : "▶";
    };
    v.addEventListener("play", sync);
    v.addEventListener("pause", sync);
    v.addEventListener("ended", sync);
    button.addEventListener("click", () => {
      if (v.paused) {
        delete v.dataset.userPaused;
        v.play().catch(() => {});
      } else {
        v.dataset.userPaused = "1";
        v.pause();
      }
    });
    io.observe(v);
  });
}
