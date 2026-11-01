/** Cabeçalho, menu compacto, rodapé e aplicação do link de WhatsApp. */
import { esc } from "../core/utils.js";
import { site } from "../data/site.js";

const sectionHref = (id, onHome) => (onHome ? `#${id}` : `index.html#${id}`);

const navLink = (item, onHome) => {
  // Fora da home, "Vitrine" volta pelo histórico, mantendo a posição anterior.
  const back = !onHome && item.id === "vitrine" ? "data-back" : "";
  return `<a href="${sectionHref(item.id, onHome)}" data-section="${esc(item.id)}" ${back}>${esc(item.label)}</a>`;
};

export function renderHeader(target, { page }) {
  const onHome = page === "home";
  const links = site.nav.map((item) => navLink(item, onHome)).join("");
  const inlineLinks = site.nav.filter((item) => onHome || item.id !== "vitrine").map((item) => navLink(item, onHome)).join("");
  target.innerHTML = `<header class="site-header">
    <a class="brand" href="index.html" aria-label="${esc(site.name)}: início"><span class="brand-mark" aria-hidden="true"></span><span class="brand-name">${esc(site.name)}</span></a>
    ${onHome ? "" : `<a class="head-back" href="index.html#vitrine" data-back><span aria-hidden="true">←</span> Vitrine</a>`}
    <nav class="nav-inline" aria-label="Seções">${inlineLinks}</nav>
    <a class="btn btn--action btn--sm head-cta" data-wa>Quero um site assim</a>
    <div class="menu">
      <button type="button" class="menu-btn" aria-expanded="false" aria-controls="menu-panel" aria-label="Abrir menu">
        <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg>
      </button>
      <nav id="menu-panel" class="menu-panel" aria-label="Menu" hidden>
        ${links}
        <a class="menu-wa" data-wa>Falar no WhatsApp <span aria-hidden="true">↗</span></a>
      </nav>
    </div>
  </header>`;
  initMenu(target);
  if (onHome) initScrollSpy(target);
}

function initMenu(root) {
  const button = root.querySelector(".menu-btn");
  const panel = root.querySelector(".menu-panel");
  const setOpen = (open) => {
    panel.hidden = !open;
    button.setAttribute("aria-expanded", String(open));
    button.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  };
  button.addEventListener("click", () => setOpen(panel.hidden));
  panel.addEventListener("click", (e) => { if (e.target.closest("a")) setOpen(false); });
  document.addEventListener("click", (e) => { if (!panel.hidden && !e.target.closest(".menu")) setOpen(false); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !panel.hidden) {
      setOpen(false);
      button.focus();
    }
  });
}

/** Marca no menu a seção visível. */
function initScrollSpy(root) {
  const links = [...root.querySelectorAll("[data-section]")];
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((link) => {
        if (link.dataset.section === entry.target.id) link.setAttribute("aria-current", "true");
        else link.removeAttribute("aria-current");
      });
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  site.nav.forEach(({ id }) => {
    const section = document.getElementById(id);
    if (section) io.observe(section);
  });
}

export function renderFooter(target, { page }) {
  const onHome = page === "home";
  target.innerHTML = `<footer class="site-footer">
    <div class="footer-grid">
      <div>
        <p class="footer-brand">${esc(site.name)}</p>
        <p class="footer-desc">${esc(site.descriptor)} que mostra o que um site pode fazer pela vontade de comprar.</p>
      </div>
      <nav aria-label="Rodapé">
        <p class="footer-h">Navegar</p>
        ${site.nav.map((item) => navLink(item, onHome)).join("")}
      </nav>
      <div>
        <p class="footer-h">Contato</p>
        <a data-wa>WhatsApp: criação de sites</a>
      </div>
      <div>
        <p class="footer-h">Fontes das datas citadas</p>
        ${site.sources.map((s) => `<a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.label)}</a>`).join("")}
      </div>
    </div>
    <p class="footer-legal">${esc(site.disclaimer)}</p>
  </footer>`;
}

export function applyWhatsapp(root = document) {
  root.querySelectorAll("[data-wa]").forEach((a) => {
    a.href = site.whatsapp;
    a.target = "_blank";
    a.rel = "noopener";
  });
  root.querySelectorAll("[data-cta-note]").forEach((el) => { el.textContent = site.ctaNote; });
}
