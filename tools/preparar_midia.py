"""Gera as mídias do site a partir das pastas originais, sem alterar os originais.

Uso: python tools/preparar_midia.py "<pasta das imagens>" "<pasta dos vídeos>"

Fotos viram WebP no tamanho original e em uma versão leve, nunca ampliadas.
Vídeos perdem o áudio. Os que não mostram embalagem ganham uma transição de
repetição; os demais tocam uma vez, para não duplicar logotipos.
"""
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent / "media"
FADE = 1.0

PHOTOS = {
    "Hero_Complementar": ("secoes/hero/foto", 800),
    "Foto04_": ("secoes/universo/foto", 800),
    "Foto26_": ("secoes/experiencia/cookies", 800),
    "Foto27_": ("secoes/experiencia/morango", 800),
    "Foto29_": ("secoes/encerramento/encerramento", 800),
    "Foto30_": ("secoes/encerramento/chamada", 800),
}
PRODUCTS = {
    "milk-chocolate": (5, 15), "cookies-creme": (6, 16), "special-dark": (7, 17),
    "kisses": (8, 18), "reeses": (9, 19), "nuggets": (10, 20), "syrup": (11, 21),
    "cocoa": (12, 22), "chocobites": (13, 23), "strawberries-creme": (14, 24),
}
# número do vídeo: (destino, início do nome da imagem de referência, repetir)
VIDEOS = {
    1: ("secoes/hero", "Hero_Principal", True),
    2: ("secoes/universo", "Foto03", True),
    3: ("produtos/milk-chocolate", "Foto15_", False),
    4: ("produtos/special-dark", "Foto17_", False),
    5: ("produtos/kisses", "Foto18_", False),
    6: ("produtos/reeses", "Foto19_", False),
    7: ("produtos/syrup", "Foto21_", False),
    8: ("secoes/experiencia/calda", "Foto25_", True),
    9: ("secoes/experiencia/cacau", "imagem 28", True),
}


def ffmpeg(*args):
    subprocess.run(["ffmpeg", "-v", "error", "-y", *map(str, args)], check=True)


def find(folder, prefix):
    matches = list(Path(folder).glob(f"{prefix}*"))
    if len(matches) != 1:
        raise SystemExit(f"Esperava 1 arquivo para '{prefix}', achei {len(matches)}")
    return matches[0]


def webp(source, target, width=None):
    target.parent.mkdir(parents=True, exist_ok=True)
    scale = ["-vf", f"scale={width}:-2"] if width else []
    ffmpeg("-i", source, *scale, "-c:v", "libwebp", "-quality", 84, target)


def photo(source, base, small):
    target = ROOT / base
    webp(source, target.with_name(target.name + ".webp"))
    webp(source, target.with_name(target.name + "-sm.webp"), small)


def video(source, folder, looped):
    folder.mkdir(parents=True, exist_ok=True)
    target = folder / "video.mp4"
    if looped:
        length = float(subprocess.check_output([
            "ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", source,
        ]))
        graph = (
            f"[0:v]split[a][b];"
            f"[a]trim=start={FADE},setpts=PTS-STARTPTS[main];"
            f"[b]trim=end={FADE},setpts=PTS-STARTPTS,format=yuva420p,"
            f"fade=t=in:st=0:d={FADE}:alpha=1,setpts=PTS+{length - 2 * FADE}/TB[end];"
            f"[main][end]overlay=eof_action=pass,format=yuv420p"
        )
        ffmpeg("-i", source, "-filter_complex", graph, "-an", "-c:v", "libx264", "-crf", 20,
               "-preset", "slow", "-movflags", "+faststart", target)
    else:
        ffmpeg("-i", source, "-an", "-c:v", "copy", "-movflags", "+faststart", target)
    ffmpeg("-i", target, "-frames:v", 1, "-c:v", "libwebp", "-quality", 82, folder / "poster.webp")


def main(images, videos):
    for prefix, (base, small) in PHOTOS.items():
        photo(find(images, prefix), base, small)
    for product, (card, page) in PRODUCTS.items():
        photo(find(images, f"Foto{card:02d}_"), f"produtos/{product}/card", 640)
        source = find(images, f"Foto{page:02d}_")
        photo(source, f"produtos/{product}/hero", 640)
    for number, (folder, reference, looped) in VIDEOS.items():
        video(find(videos, f"video {number}.mp4"), ROOT / folder, looped)
        base = images if not reference.startswith("imagem") else videos
        webp(find(base, reference), ROOT / folder / "still.webp")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        raise SystemExit(__doc__)
    main(sys.argv[1], sys.argv[2])
