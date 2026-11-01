/**
 * Dados gerais do projeto: identificação, WhatsApp, navegação e mídias das seções.
 * Os arquivos de media/ são gerados por tools/preparar_midia.py.
 */
const sized = (base, full, small = 800) => ({
  src: `${base}.webp`,
  srcset: `${base}-sm.webp ${small}w, ${base}.webp ${full}w`,
});

const film = (folder, label, alt) => ({
  kind: "video", ratio: "16/9", src: `${folder}/video.mp4`, poster: `${folder}/poster.webp`,
  still: `${folder}/still.webp`, loop: true, path: `${folder}/video.mp4`, label, alt,
});

const still = (base, label, alt, sizes = "(min-width: 900px) 50vw, 100vw") => ({
  kind: "photo", ratio: "16/9", src: sized(base, 1600), sizes, path: `${base}.webp`, label, alt,
});

export const site = {
  name: "Ponto de Fusão",
  descriptor: "Campanha conceitual de portfólio",

  // Número e mensagem definidos no briefing: não alterar o texto codificado.
  whatsapp: "https://wa.me/5545991075234?text=%22Ol%C3%A1!%20Vim%20pelo%20seu%20site%20e%20gostaria%20de%20saber%20mais%20informa%C3%A7%C3%B5es%20sobre%20os%20seus%20servi%C3%A7os%20de%20cria%C3%A7%C3%A3o%20de%20sites.%22",

  ctaNote: "O WhatsApp é para quem quer um site como este. Aqui não vendemos chocolate.",

  disclaimer: "Projeto conceitual de portfólio, sem vínculo com The Hershey Company. Hershey's, Reese's e demais nomes de produtos são marcas de seus respectivos titulares e aparecem apenas como referência de mercado. Imagens e vídeos criados com inteligência artificial para esta demonstração. Nenhum produto é vendido neste site.",

  nav: [
    { id: "universo", label: "Universo" },
    { id: "vitrine", label: "Vitrine" },
    { id: "apresentacoes", label: "Apresentações" },
    { id: "experiencia", label: "Experiência" },
    { id: "contato", label: "Contato" },
  ],

  sources: [
    { label: "The Hershey Company: Milton Hershey", url: "https://www.thehersheycompany.com/en_us/home/about-us/milton-hershey.html" },
    { label: "Britannica: Milton Snavely Hershey", url: "https://www.britannica.com/biography/Milton-Snavely-Hershey" },
    { label: "Hersheyland: sobre Reese's", url: "https://www.hersheyland.com/reeses/about.html" },
  ],

  media: {
    "hero-video": film("media/secoes/hero", "Hero · vídeo de apresentação", "Blocos de chocolate flutuando sobre uma onda de chocolate derretido"),
    "hero-foto": still("media/secoes/hero/foto", "Hero · fotografia complementar", "Barra de chocolate quebrada em close, com migalhas e cacau ao fundo", "(min-width: 1000px) 30vw, 60vw"),
    "universo-video": film("media/secoes/universo", "Universo · vídeo", "Fita de chocolate derretido passando por blocos, cacau em pó e frutos de cacau abertos"),
    "universo-foto": still("media/secoes/universo/foto", "Universo · textura e detalhes", "Barra de chocolate partida entre raspas e pedaços", "(min-width: 900px) 30vw, 60vw"),
    "experiencia-calda": film("media/secoes/experiencia/calda", "Experiência · calda", "Calda de chocolate caindo sobre um bolo e escorrendo pelas laterais"),
    "experiencia-cookies": still("media/secoes/experiencia/cookies", "Experiência · sobremesa de biscoito", "Sobremesa em taça de vidro com creme claro e pedaços de biscoito de chocolate"),
    "experiencia-morango": still("media/secoes/experiencia/morango", "Experiência · sobremesa de morango", "Sobremesa em camadas com morangos, creme e raspas de chocolate"),
    "experiencia-cacau": film("media/secoes/experiencia/cacau", "Experiência · cacau peneirado", "Cacau em pó caindo de uma peneira e formando um monte sobre a mesa"),
    "encerramento": still("media/secoes/encerramento/encerramento", "Encerramento", "Pilha de chocolate escuro coberta por um fio de calda, com fundo escuro", "100vw"),
    "chamada": still("media/secoes/encerramento/chamada", "Chamada para ação", "Barras de chocolate empilhadas ao lado de uma tigela de cacau, com fundo escuro", "100vw"),
  },
};
