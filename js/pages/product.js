/**
 * Página individual: `layout` define a composição da abertura e `blocks` a ordem das
 * seções. A mídia nunca é recortada, para preservar embalagens e logotipos.
 */
import { initMotion } from "../core/motion.js";
import { initProductHistory } from "../core/navigation.js";
import { esc, productUrl } from "../core/utils.js";
import { initAccordions } from "../components/faq.js";
import { applyWhatsapp, renderFooter, renderHeader } from "../components/layout.js";
import { initVideos } from "../components/media.js";
import { heroMedia } from "../components/productMedia.js";
import { productById, products } from "../data/products.js";
import { site } from "../data/site.js";

const main = document.querySelector("main");
const id = new URLSearchParams(location.search).get("p");
const product = productById.get(id);

renderHeader(document.querySelector("[data-header]"), { page: "product" });
renderFooter(document.querySelector("[data-footer]"), { page: "product" });
initProductHistory();

if (product) renderProduct(product);
else renderNotFound();

applyWhatsapp();
initAccordions();
initVideos();
initMotion();

function renderProduct(p) {
  document.title = `${p.name} · ${site.name}`;
  document.querySelector('meta[name="description"]').content = p.short;

  const t = p.theme;
  const style = document.body.style;
  [["--bg", t.bg], ["--surface", t.surface], ["--ink", t.ink], ["--muted", t.muted], ["--accent", t.accent], ["--accent-ink", t.accentInk]]
    .forEach(([name, value]) => style.setProperty(name, value));
  document.body.classList.add(`pv-${p.layout}`);

  const blocks = { story, traits };
  main.innerHTML = hero(p) + p.blocks.map((name) => blocks[name](p)).join("") + cta(p) + pager(p);
}

function hero(p) {
  const position = products.indexOf(p) + 1;
  return `<section class="ph" aria-labelledby="ph-title">
    <div class="ph-decor" aria-hidden="true"></div>
    <div class="ph-copy" data-reveal="fade-up">
      <nav class="crumb" aria-label="Você está aqui" data-item>
        <a href="index.html#vitrine" data-back>Vitrine</a><span aria-hidden="true">/</span><span>${position} de ${products.length}</span>
      </nav>
      <p class="ph-tag" data-item>${esc(p.tag)}</p>
      <h1 id="ph-title" class="ph-name" data-item>${esc(p.name)}</h1>
      <p class="ph-headline" data-item>${esc(p.headline)}</p>
      <p class="ph-lede" data-item>${esc(p.lede)}</p>
      <div class="cta-row" data-item>
        <a class="btn btn--action" href="#fazer-igual">${esc(p.ctaLabel)}</a>
        <a class="btn btn--ghost" href="index.html#vitrine" data-back>Voltar à vitrine</a>
      </div>
    </div>
    <div class="ph-media" data-reveal="scale-up">${heroMedia(p)}</div>
  </section>`;
}

function story(p) {
  return `<section class="pb pb-story" data-reveal="slide-left">
    <h2 class="pb-title" data-item>${esc(p.storyTitle)}</h2>
    <div class="pb-story-text" data-item>
      <p class="pb-text">${esc(p.story)}</p>
      <ul class="senses">${p.senses.map((s) => `<li>${esc(s)}</li>`).join("")}</ul>
    </div>
  </section>`;
}

function traits(p) {
  const group = `detalhes-${esc(p.id)}`;
  return `<section class="pb pb-traits" data-reveal="slide-right">
    <h2 class="pb-title" data-item>O que define este sabor</h2>
    <dl class="traits" data-item>${p.traits.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>
    <div class="accordion" data-item>
      <details name="${group}"><summary>Melhores momentos</summary><p>${esc(p.moments)}</p></details>
      <details name="${group}"><summary>Por que esta página é assim</summary><p>${esc(p.rationale)}</p></details>
    </div>
  </section>`;
}

function cta(p) {
  return `<section class="pb pb-cta" id="fazer-igual" data-reveal="fade-up">
    <p class="eyebrow" data-item>Agora, falando do seu negócio</p>
    <h2 class="pb-title" data-item>${esc(p.ctaTitle)}</h2>
    <div class="cta-row" data-item>
      <a class="btn btn--action btn--lg" data-wa>${esc(p.ctaLabel)}</a>
      <a class="btn btn--ghost btn--lg" href="index.html#vitrine" data-back>Voltar à vitrine</a>
    </div>
    <p class="cta-note" data-cta-note data-item></p>
  </section>`;
}

function pager(p) {
  const i = products.indexOf(p);
  const prev = products[(i - 1 + products.length) % products.length];
  const next = products[(i + 1) % products.length];
  const link = (item, label, cls) => `<a class="${cls}" href="${productUrl(item.id)}" data-product-link><span>${label}</span><strong>${esc(item.shortName)}</strong></a>`;
  return `<nav class="pager" aria-label="Outros sabores">${link(prev, "← Sabor anterior", "pager-prev")}${link(next, "Próximo sabor →", "pager-next")}</nav>`;
}

function renderNotFound() {
  document.title = `Sabor não encontrado · ${site.name}`;
  main.innerHTML = `<section class="not-found">
    <p class="eyebrow">Sabor não encontrado</p>
    <h1 class="pb-title">Este sabor saiu da vitrine.</h1>
    <p>O endereço pode estar incompleto. Os dez sabores continuam a um clique daqui.</p>
    <a class="btn btn--action" href="index.html#vitrine">Ver a vitrine</a>
  </section>`;
}
