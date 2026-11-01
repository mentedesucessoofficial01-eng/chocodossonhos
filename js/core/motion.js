/**
 * Animações leves, sem bibliotecas: entrada dos blocos, parallax, letreiro,
 * escorrido entre seções e contadores. Com movimento reduzido, nada disso roda
 * e o conteúdo aparece direto (ver css/motion.css).
 */
import { reducedMotion } from "./utils.js";

export function initMotion() {
  initReveal();
  initCounters();
  if (!reducedMotion) initScrollEffects();
}

function initReveal() {
  const blocks = document.querySelectorAll("[data-reveal]");
  blocks.forEach((block) => {
    block.querySelectorAll("[data-item]").forEach((item, i) => item.style.setProperty("--i", i));
  });
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-in");
      io.unobserve(entry.target);
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
  blocks.forEach((block) => {
    // display: contents não tem caixa e nunca intersecta: revela de imediato.
    if (getComputedStyle(block).display === "contents") block.classList.add("is-in");
    else io.observe(block);
  });
}

function initCounters() {
  const counters = document.querySelectorAll("[data-count]");
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      io.unobserve(entry.target);
      if (!reducedMotion) countUp(entry.target);
    });
  }, { threshold: 0.6 });
  counters.forEach((el) => {
    el.textContent = el.dataset.count;
    io.observe(el);
  });
}

function countUp(el) {
  const to = Number(el.dataset.count);
  const from = Number(el.dataset.from || 0);
  if (from === to) return;
  const start = performance.now();
  const duration = 1400;
  const frame = (now) => {
    const t = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = String(Math.round(from + (to - from) * eased));
    if (t < 1) requestAnimationFrame(frame);
  };
  el.textContent = String(from);
  requestAnimationFrame(frame);
}

function initScrollEffects() {
  const parallax = [...document.querySelectorAll("[data-parallax]")];
  const marquees = [...document.querySelectorAll("[data-marquee]")];
  const drips = [...document.querySelectorAll("[data-drip]")];
  if (!parallax.length && !marquees.length && !drips.length) return;

  const wide = window.matchMedia("(min-width: 768px)");
  let queued = false;

  const update = () => {
    queued = false;
    const vh = window.innerHeight;
    const inView = (r) => r.bottom > -100 && r.top < vh + 100;

    if (wide.matches) {
      parallax.forEach((el) => {
        const r = el.parentElement.getBoundingClientRect();
        if (!inView(r)) return;
        const offset = (r.top + r.height / 2 - vh / 2) * Number(el.dataset.parallax);
        el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
      });
    }
    marquees.forEach((el) => {
      const r = el.parentElement.getBoundingClientRect();
      if (inView(r)) el.style.transform = `translate3d(${(-r.top * 0.35 - 200).toFixed(1)}px, 0, 0)`;
    });
    drips.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (!inView(r)) return;
      const p = Math.min(Math.max((vh - r.top) / vh, 0), 1);
      el.style.transform = `scaleY(${(0.4 + p * 0.9).toFixed(3)})`;
    });
  };

  const queue = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(update);
  };
  window.addEventListener("scroll", queue, { passive: true });
  window.addEventListener("resize", queue, { passive: true });
  update();
}
