/** Vitrine e índice de apresentações: exatamente os produtos cadastrados, cada item leva à página individual. */
import { esc, productUrl } from "../core/utils.js";
import { products } from "../data/products.js";
import { cardPhoto } from "./productMedia.js";

function card(p, index) {
  const label = index % 2 === 0 ? "Explorar Sabor" : "Ver Campanha";
  return `<li class="card-cell" data-reveal="fade-up">
    <article class="card" data-card="${esc(p.id)}" style="--card-accent:${esc(p.theme.accent)}">
      <div class="card-photo">${cardPhoto(p)}</div>
      <div class="card-body">
        <p class="card-tag">${esc(p.tag)}</p>
        <h3 class="card-name">${esc(p.name)}</h3>
        <p class="card-text">${esc(p.short)}</p>
        <a class="card-link" href="${productUrl(p.id)}" aria-label="${esc(`${label}: ${p.name}`)}"><span>${label}</span><span class="card-arrow" aria-hidden="true">→</span></a>
      </div>
    </article>
  </li>`;
}

function indexRow(p, index) {
  return `<li data-row="${esc(p.id)}" data-reveal="fade-up">
    <a class="index-row" href="${productUrl(p.id)}">
      <span class="index-num" aria-hidden="true">${String(index + 1).padStart(2, "0")}</span>
      <span class="index-name">${esc(p.shortName)}</span>
      <span class="index-line">${esc(p.headline)}</span>
      <span class="index-kind">${p.media.video ? "Vídeo" : "Fotografia"} <span aria-hidden="true">→</span></span>
    </a>
  </li>`;
}

export function renderShowcase(target) {
  target.innerHTML = products.map(card).join("");
}

export function renderIndex(target) {
  target.innerHTML = products.map(indexRow).join("");
}
