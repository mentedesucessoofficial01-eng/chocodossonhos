/** Traduz os campos de media de um produto em espaços de foto e vídeo, com caminho e rótulo padronizados. */
import { photo, video } from "./media.js";

const dir = (p) => `media/produtos/${p.id}`;

export const cardPhoto = (p) => photo({
  value: p.media.card, ratio: "1/1",
  label: `${p.shortName} · card da vitrine`,
  path: `${dir(p)}/card.webp`,
  alt: `${p.name}: embalagem e pedaços do produto`,
  sizes: "(min-width: 1100px) 20vw, 50vw",
});

/** A abertura da página mostra o vídeo do produto ou, se ele não tiver um, a fotografia principal. */
export const heroMedia = (p) => (p.media.video
  ? video({
    value: p.media.video, poster: p.media.poster, still: p.media.hero, ratio: "16/9",
    label: `${p.shortName} · vídeo do produto`,
    path: `${dir(p)}/video.mp4`,
    alt: `${p.name}: vídeo do produto`,
  })
  : photo({
    value: p.media.hero, ratio: "16/9", eager: true,
    label: `${p.shortName} · fotografia principal`,
    path: `${dir(p)}/hero.webp`,
    alt: `${p.name}: fotografia principal do produto`,
    sizes: "(min-width: 900px) 60vw, 100vw",
  }));
