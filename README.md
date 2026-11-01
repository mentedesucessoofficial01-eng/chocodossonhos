# Ponto de Fusão

Site de portfólio em formato de campanha publicitária, usando dez produtos Hershey's como referência de mercado. O objetivo comercial é gerar contatos pelo WhatsApp de quem quer um site. Nenhum chocolate é vendido aqui.

## Como rodar

```bash
python tools/servir.py        # http://127.0.0.1:8000
```

Precisa de servidor HTTP: abrir o `index.html` direto pelo arquivo não carrega os módulos JavaScript. Não há build nem dependências.

## Conceito

"Ponto de Fusão" é o instante em que o chocolate deixa de ser sólido. Essa ideia aparece no site no escorrido que separa as seções e cresce com a rolagem. O título da abertura resume a tese: **"Antes da primeira mordida, já começou."**

### Cores

| Cor | Valor | Papel |
|---|---|---|
| Cacau | `#160a06` a `#6b3a22` | Intensidade, sabor e familiaridade. Base das seções escuras |
| Creme | `#f6ecdc` | Suavidade e respiro. Seções de leitura e cards |
| Vermelho | `#b3122a` | Desejo e decisão. Reservado às ações |
| Caramelo | `#d9a15f` | Calor nos detalhes: números, foco e títulos do rodapé |

Cada produto redefine essas cores em `theme`. O motivo de cada escolha está no próprio site, em "Por que esta página é assim".

Tipografia: **Gloock** nos títulos, com contraste alto e curvas que lembram chocolate derretido, e **Hanken Grotesk** no texto corrido.

### As seis sessões

1. **Hero:** área de vídeo e área de fotografia; desperta curiosidade e leva à vitrine.
2. **Universo:** os sentidos (olhar, abrir, provar), com vídeo e foto de textura.
3. **Vitrine:** os dez produtos ("Dez formas de ceder").
4. **Apresentações:** índice das dez páginas individuais.
5. **Experiência:** cenas sensoriais e as receitas, que só aparecem aqui.
6. **Encerramento:** dúvidas e a virada comercial ("Se deu vontade, o site funcionou").

## Estrutura

```
index.html, produto.html, 404.html
css/
  tokens.css        Cores, fontes, espaçamentos e zonas de cor
  base.css          Base e tipografia
  layout.css        Cabeçalho, menu e rodapé
  components.css    Botões, espaços de mídia e acordeão
  home.css          Sessões da home e cards
  product.css       Blocos de produto e as 10 composições (.pv-*)
  motion.css        Entradas e movimento reduzido
js/
  data/products.js  ÚNICA fonte dos 10 produtos
  data/site.js      Nome, WhatsApp, menu, avisos e mídias das sessões
  core/navigation.js  Retorno à posição da vitrine e histórico
  core/motion.js    Entradas, parallax, letreiro, escorrido e contadores
  components/       Cabeçalho e rodapé, cards, mídia, acordeão
  pages/            Montagem da home e da página de produto
media/              Fotos e vídeos gerados (ver media/README.md)
tools/
  preparar_midia.py Converte os originais para media/
  servir.py         Servidor local
```

**Para editar um produto**, altere só `js/data/products.js`:

- `layout`: composição da abertura.
- `blocks`: ordem das seções.

**O link do WhatsApp** fica só em `js/data/site.js`. Número e mensagem foram mantidos exatamente como no briefing, inclusive as aspas codificadas (`%22`) no início e no fim do texto.

## Retorno à vitrine

O endereço de cada produto é `produto.html?p=<id>`. Ao sair da home, o site guarda a posição do card ou da linha clicada em relação ao topo da tela. Na volta, reposiciona a página por esse elemento, então a posição continua certa mesmo se a altura da página mudar ou o celular girar.

Cada página registra no histórico a quantos passos está da vitrine. Assim, "Voltar à vitrine" funciona mesmo depois de passar por vários sabores, e o botão de voltar do navegador continua passando pelo sabor anterior.

## Decisões técnicas

- **Sem bibliotecas de animação.** O site roda só com CSS e cerca de 100 linhas de JS.
- **Rolagem nativa,** para não interferir na restauração de posição nem nos gestos do celular.
- **Carregamento de mídia:** imagens com `loading="lazy"` e vídeos com `preload="none"`, tocando só quando visíveis.
- **Largura da mídia limitada** nas páginas de produto e na Experiência, porque os vídeos têm 848×478.

## Conteúdo a confirmar antes de publicar

Foram usadas só informações fornecidas no briefing ou com fonte pública. Nenhum peso, preço ou ranking foi publicado nos textos.

| Item | Situação |
|---|---|
| **Hershey's ChocoBites** | Nome não localizado em fontes públicas. Mantido como no briefing, com texto genérico |
| **Strawberries 'n' Crème** | Fontes descrevem creme sabor morango com flocos. A embalagem criada por IA sugere pedaços, mas o texto fala só em "morango e creme" |
| **Datas do Universo** | 1894, 1900 e 1928, com fontes no rodapé do site |
| **Uso das marcas** | As imagens mostram marcas reais em embalagens criadas por IA. Há aviso de projeto conceitual no rodapé e nas Dúvidas. Avalie o risco de marca antes de publicar em domínio público |
