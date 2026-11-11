#!/usr/bin/env python3
"""Copia los recursos *públicos* de las páginas de Curiosidades del Canva original al repositorio.
Mantiene las fotos y los vídeos exactos, sin crear ni regenerar personas o escenarios.
"""
from __future__ import annotations
import io
import json
import re
from pathlib import Path
from urllib.parse import urljoin

import requests
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
manifest = json.loads((ROOT / "docs/curiosidades-canva-assets.json").read_text(encoding="utf-8"))
base = manifest["fuente"].rstrip("/") + "/"
session = requests.Session()
session.headers["User-Agent"] = "Mozilla/5.0 (compatible; PaloYCuchara-gallery-importer/1.0)"
html = session.get(manifest["fuente"], timeout=40)
html.raise_for_status()
source = html.text
target = ROOT / "imagenes" / "curiosidades"
target.mkdir(parents=True, exist_ok=True)

def records(asset_id, kind):
    # La exportación HTML contiene varias resoluciones para cada imagen.
    if kind == "image":
        pattern = r'"type":"RASTER","id":"' + re.escape(asset_id) + r'","version":\d+,"files":\[\{"url":"([^"]+)"[^}]*?"width":(\d+),"height":(\d+)'
        return [(m.group(1), int(m.group(2)), int(m.group(3))) for m in re.finditer(pattern,source)]
    # Los vídeos aparecen con un fichero MP4 y un póster público.
    pattern = r'"id":"' + re.escape(asset_id) + r'","files":\[\{"url":"([^"]+)"[^}]*?"width":(\d+),"height":(\d+)'
    return [(m.group(1),int(m.group(2)),int(m.group(3))) for m in re.finditer(pattern,source)]

def download(path):
    if not path.startswith("_assets/"):
        raise ValueError("Ruta Canva inesperada: " + path)
    response = session.get(urljoin(base, path), timeout=90)
    response.raise_for_status()
    if len(response.content)<1000:
        raise ValueError("Archivo Canva inesperadamente pequeño: " + path)
    return response.content

for item in manifest["items"]:
    number=item["orden"]
    asset=item["canvaAssetId"]
    kind=item["tipo"]
    candidates = records(asset,kind)
    if not candidates:
        raise RuntimeError(f"No se encontró el original de {number}: {item['titulo']} ({asset})")
    ranked = sorted(candidates,key=lambda a:(a[1]*a[2],a[1]),reverse=True)
    # Preferir 2X/3X para tener nitidez; verificar la descarga antes de seguir.
    path,width,height=ranked[0]
    if kind=="image":
        blob=download(path)
        picture=Image.open(io.BytesIO(blob))
        picture=ImageOps.exif_transpose(picture)
        if picture.mode not in ("RGB","RGBA"):
            picture=picture.convert("RGB")
        if picture.width>1800 or picture.height>1800:
            picture.thumbnail((1800,1800),Image.Resampling.LANCZOS)
        dest=ROOT/item["imagen"]
        picture.save(dest,format="WEBP",quality=88,method=6)
        print("FOTO",number,item["titulo"],f"{width}x{height}",f"{picture.width}x{picture.height}",dest.stat().st_size,flush=True)
    else:
        if not path.lower().endswith(".mp4"):
            raise ValueError("El recurso no es MP4: "+path)
        video=download(path)
        dest=ROOT/item["video"]
        dest.write_bytes(video)
        # Usar el póster del Canva original (no un fotograma generado).
        marker='"id":"'+asset+'","files":'
        at=source.find(marker)
        fragment=source[at:at+4500]
        post=re.search(r'"posterframes":\[\{"A":"([^"]+)"',fragment)
        if not post:
            post=re.search(r'"videoTimelines":\[\{[^}]*?"F":"([^"]+)"',fragment)
        if not post:
            raise RuntimeError(f"No se encontró póster para el vídeo {number}")
        poster=Image.open(io.BytesIO(download(post.group(1))))
        poster=ImageOps.exif_transpose(poster).convert("RGB")
        poster.save(ROOT/item["imagen"],format="JPEG",quality=90)
        print("VIDEO",number,item["titulo"],f"{width}x{height}",len(video),"poster",poster.size,flush=True)

print("OK, se han copiado",len(manifest["items"]),"recursos originales (imágenes o vídeo con póster)")
