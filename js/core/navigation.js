/**
 * Continuidade de navegação entre a vitrine e as páginas de produto.
 *
 * Ao sair da home, guarda o scroll e, se houve clique em um card, a distância dele
 * ao topo da tela. Na volta, reposiciona pelo card: a posição continua certa mesmo
 * se o celular girou ou a altura da página mudou. Com bfcache o navegador já
 * restaura tudo sozinho, e este código não precisa agir.
 *
 * Cada página de produto registra no histórico a quantos passos está da vitrine
 * (pfDepth). Assim "Voltar à vitrine" funciona depois de passar por vários produtos,
 * sem acumular entradas no histórico.
 */
const HOME_KEY = "pf:home-scroll";
const DEPTH_KEY = "pf:pending-depth";

const isPlainClick = (e) => e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;

function readSaved() {
  try { return JSON.parse(sessionStorage.getItem(HOME_KEY)); } catch { return null; }
}

function write(key, value) {
  try { sessionStorage.setItem(key, value); } catch { /* sessão bloqueada: o navegador cuida do retorno */ }
}

// Mede a célula da grade: o card em si sobe no hover e distorceria a posição.
const anchorTop = (card) => (card.hasAttribute("data-row") ? card : card.parentElement).getBoundingClientRect().top;

/** Espera fontes e carregamento, que podem mudar a altura da página, e executa uma vez. */
function afterLayoutSettles(callback) {
  let userMoved = false;
  const moved = () => { userMoved = true; };
  ["wheel", "touchstart", "keydown"].forEach((ev) => window.addEventListener(ev, moved, { once: true, passive: true }));
  const fonts = document.fonts?.ready ?? Promise.resolve();
  const loaded = document.readyState === "complete" ? Promise.resolve() : new Promise((r) => window.addEventListener("load", r, { once: true }));
  Promise.all([fonts, loaded]).then(() => callback(userMoved));
}

/* ---------- Home ---------- */

export function initHomeMemory() {
  let clicked = null;
  document.addEventListener("click", (e) => {
    const card = e.target.closest?.("[data-card], [data-row]");
    if (!card || !isPlainClick(e) || !e.target.closest("a")) return;
    const attr = card.hasAttribute("data-card") ? "data-card" : "data-row";
    clicked = { selector: `[${attr}="${CSS.escape(card.getAttribute(attr))}"]`, top: anchorTop(card) };
    write(DEPTH_KEY, "1");
  });
  window.addEventListener("pagehide", () => {
    write(HOME_KEY, JSON.stringify({ y: window.scrollY, ...clicked }));
  });
  // Saindo do bfcache a página é a mesma: libera um novo clique.
  window.addEventListener("pageshow", (e) => { if (e.persisted) clicked = null; });
}

/** Reposiciona a home ao voltar do histórico. Retorna true se houve restauração. */
export function restoreHomeScroll() {
  const type = performance.getEntriesByType("navigation")[0]?.type;
  const saved = readSaved();
  if (type !== "back_forward" || !saved) {
    // Link direto para uma seção: a fonte pode chegar depois e deslocar o destino.
    if (type === "navigate" && location.hash) {
      afterLayoutSettles((userMoved) => {
        if (!userMoved) document.getElementById(location.hash.slice(1))?.scrollIntoView({ behavior: "instant" });
      });
    }
    return false;
  }

  const root = document.documentElement;
  root.classList.add("no-anim");
  const apply = () => {
    const card = saved.selector && document.querySelector(saved.selector);
    const top = card ? anchorTop(card) + window.scrollY - saved.top : saved.y;
    window.scrollTo({ top, behavior: "instant" });
  };
  apply();

  afterLayoutSettles((userMoved) => {
    if (!userMoved) apply();
    history.scrollRestoration = "auto";
    requestAnimationFrame(() => root.classList.remove("no-anim"));
  });
  return true;
}

/* ---------- Produto ---------- */

export function initProductHistory() {
  let depth = history.state?.pfDepth;
  if (depth == null) {
    let pending = null;
    try {
      pending = sessionStorage.getItem(DEPTH_KEY);
      sessionStorage.removeItem(DEPTH_KEY);
    } catch { /* sem sessão: trata como entrada direta */ }
    depth = pending ? Number(pending) : 0;
    history.replaceState({ ...history.state, pfDepth: depth }, "");
  }

  document.addEventListener("click", (e) => {
    if (!isPlainClick(e)) return;
    const link = e.target.closest?.("a");
    if (!link) return;
    if (link.hasAttribute("data-back")) {
      // Entrada direta (link compartilhado) não tem para onde voltar: segue o href até a vitrine.
      const current = history.state?.pfDepth ?? 0;
      if (current > 0) {
        e.preventDefault();
        history.go(-current);
      }
    } else if (link.hasAttribute("data-product-link")) {
      write(DEPTH_KEY, String((history.state?.pfDepth ?? 0) + 1));
    }
  });
}
