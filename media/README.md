# Mídias do site

Tudo nesta pasta é gerado a partir dos originais, que nunca são alterados:

```bash
python tools/preparar_midia.py "<pasta site hershey>" "<pasta hershey videos>"
```

## De onde vem cada arquivo

| Origem | Destino | Onde aparece |
|---|---|---|
| Vídeo 1 (ref. Hero Principal) | `secoes/hero/video.mp4` | Hero, área de vídeo |
| Hero Complementar | `secoes/hero/foto.webp` | Hero, área de foto |
| Vídeo 2 (ref. Foto03) | `secoes/universo/video.mp4` | Universo |
| Foto04 | `secoes/universo/foto.webp` | Universo, detalhe |
| Fotos 05 a 14 | `produtos/<id>/card.webp` | Cards da vitrine |
| Fotos 15 a 24 | `produtos/<id>/hero.webp` | Páginas de produto |
| Vídeos 3 a 7 (ref. Fotos 15, 17, 18, 19 e 21) | `produtos/<id>/video.mp4` | Páginas com vídeo |
| Vídeo 8 (ref. Foto25) | `secoes/experiencia/calda/video.mp4` | Experiência |
| Fotos 26 e 27 | `secoes/experiencia/cookies.webp`, `morango.webp` | Experiência |
| Vídeo 9 (ref. nova imagem 28) | `secoes/experiencia/cacau/video.mp4` | Experiência |
| Fotos 29 e 30 | `secoes/encerramento/encerramento.webp`, `chamada.webp` | Encerramento |

A imagem 28 antiga, da pasta `site hershey`, não é usada: foi substituída pela imagem enviada na pasta de vídeos.

## Regras

- **Sem recorte.** Cards ficam em 1:1 e as demais mídias em 16:9, as proporções dos originais, para preservar embalagens e logotipos.
- **Fotos:** `<nome>.webp` no tamanho original, sem ampliar, e `<nome>-sm.webp` para telas menores.
- **Vídeos:** sem áudio. `poster.webp` é o primeiro quadro; `still.webp` é a foto de referência, mostrada a quem prefere menos movimento.
- **Repetição:** vídeos sem embalagem (Hero, Universo, calda e cacau) repetem com uma transição de 1 segundo. Vídeos com embalagem tocam uma vez e param no último quadro, porque a transição duplicaria os logotipos.

## Trocar um vídeo

Substitua o arquivo original e rode o comando acima. Se a versão nova tiver resolução maior, nada mais precisa mudar.
