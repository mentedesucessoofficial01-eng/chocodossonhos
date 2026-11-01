/** Utilidades compartilhadas. */
export const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const ESCAPES = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
export const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (c) => ESCAPES[c]);

export const productUrl = (id) => `produto.html?p=${encodeURIComponent(id)}`;
