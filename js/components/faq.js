/** Acordeão exclusivo por categoria. O atributo name já resolve em navegadores novos; o JS cobre os demais. */
export function initAccordions(root = document) {
  root.querySelectorAll("details[name]").forEach((item) => {
    item.addEventListener("toggle", () => {
      if (!item.open) return;
      root.querySelectorAll(`details[name="${CSS.escape(item.name)}"][open]`).forEach((other) => {
        if (other !== item) other.open = false;
      });
    });
  });
}
