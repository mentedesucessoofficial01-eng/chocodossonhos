/** Montagem da home. A restauração do scroll vem antes das animações, para não disparar entradas fora de lugar. */
import { initMotion } from "../core/motion.js";
import { initHomeMemory, restoreHomeScroll } from "../core/navigation.js";
import { renderIndex, renderShowcase } from "../components/card.js";
import { initAccordions } from "../components/faq.js";
import { applyWhatsapp, renderFooter, renderHeader } from "../components/layout.js";
import { hydrateSlots, initVideos } from "../components/media.js";
import { site } from "../data/site.js";

renderHeader(document.querySelector("[data-header]"), { page: "home" });
renderFooter(document.querySelector("[data-footer]"), { page: "home" });
renderShowcase(document.querySelector("[data-showcase]"));
renderIndex(document.querySelector("[data-index]"));
hydrateSlots(site.media);
applyWhatsapp();

initHomeMemory();
restoreHomeScroll();
initAccordions();
initVideos();
initMotion();
