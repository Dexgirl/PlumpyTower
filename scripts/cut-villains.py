#!/usr/bin/env python3
"""Cut every NFT villain out of its picture background, for the crawling villains.

Needs: pip install rembg onnxruntime pillow numpy scipy   (downloads the u2net / isnet-anime models once)
Reads:  data/villain-pack.json   (the 50 villain pictures)
Writes: data/villain-cut.json    {key: {img: transparent webp data URI, w, h, body, dark}}
build.py bakes villain-cut.json into the game; a villain without a cut-out falls back to its round picture.
"""
import base64, io, json, os, sys
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage

HERE = os.path.dirname(os.path.abspath(__file__))
PACK = os.path.join(HERE, '../data/villain-pack.json')
OUT = os.path.join(HERE, '../data/villain-cut.json')
INK = (27, 16, 36)
MAX_SIDE = 150

# which cutter works best for each picture (checked by eye on a contact sheet)
ISNET = {'monafuku653', 'mayc66', 'molandak390', 'mayc6519', 'molandak3061'}
FLOOD = {'skrump2948': 46, 'sfpunk707': 34, 'argo3615': 34}
SKIP = {'skrump2643'}   # pixel flames on black: no clean cut, keeps the round picture


def load(v):
    b = base64.b64decode(v['img'].split(',', 1)[1])
    return Image.open(io.BytesIO(b)).convert('RGB')


def flood_alpha(im, tol):
    """background = pixels close to the border's common colours that connect to the border"""
    a = np.asarray(im).astype(int)
    h, w, _ = a.shape
    border = np.concatenate([a[0], a[-1], a[:, 0], a[:, -1]])
    q = (border // 24) * 24
    cols, counts = np.unique(q.reshape(-1, 3), axis=0, return_counts=True)
    keep = [i for i in np.argsort(-counts) if cols[i].sum() > 150][:4]   # dark outlines touching the edge are never background
    top = cols[keep] + 12
    d = np.min([np.sqrt(((a - c) ** 2).sum(-1)) for c in top], axis=0)
    near = d < tol
    lab, n = ndimage.label(near)
    edge = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
    bg = np.isin(lab, list(edge))
    return (~bg).astype(float)


def model_alpha(im, model, sessions):
    from rembg import new_session, remove
    if model not in sessions:
        sessions[model] = new_session(model)
    out = remove(im, session=sessions[model])
    return np.asarray(out.convert('RGBA'))[:, :, 3] / 255.0


def clean(alpha):
    a = np.clip((alpha - 0.3) / 0.4, 0, 1)            # crisp edges, drop ghosting
    solid = a > 0.5
    lab, n = ndimage.label(solid)
    if n > 1:
        sizes = ndimage.sum(solid, lab, range(1, n + 1))
        keep = [i + 1 for i, s in enumerate(sizes) if s >= sizes.max() * 0.06]
        a = a * np.isin(lab, keep)
    a = ndimage.binary_fill_holes(a > 0.5) * np.maximum(a, (a > 0.5) * 1.0)
    return a


def finish(im, a):
    ys, xs = np.where(a > 0.5)
    if len(xs) < 200:
        return None
    pad = 4
    x0, x1, y0, y1 = max(0, xs.min() - pad), min(im.width, xs.max() + pad + 1), max(0, ys.min() - pad), min(im.height, ys.max() + pad + 1)
    rgb = np.asarray(im)[y0:y1, x0:x1]
    al = a[y0:y1, x0:x1]
    # body colour: what the character wears along its bottom edge
    hh = al.shape[0]
    strip = rgb[int(hh * 0.85):][al[int(hh * 0.85):] > 0.5]
    body = np.median(strip, axis=0) if len(strip) > 20 else np.median(rgb[al > 0.5], axis=0)
    dark = body * 0.62
    # ink outline around the cut-out (sticker look, matches the game's outlines)
    outline = ndimage.binary_dilation(al > 0.5, iterations=2)
    canvas = np.zeros((hh, al.shape[1], 4), dtype=np.uint8)
    canvas[outline] = (*INK, 255)
    fg = Image.fromarray(np.dstack([rgb, (al * 255).astype(np.uint8)]), 'RGBA')
    out = Image.fromarray(canvas, 'RGBA')
    out.alpha_composite(fg)
    s = MAX_SIDE / max(out.size)
    if s < 1:
        out = out.resize((round(out.width * s), round(out.height * s)), Image.LANCZOS)
    buf = io.BytesIO()
    out.save(buf, 'WEBP', quality=84, method=6)
    hexc = lambda c: '#%02x%02x%02x' % tuple(int(max(0, min(255, x))) for x in c)
    return {'img': 'data:image/webp;base64,' + base64.b64encode(buf.getvalue()).decode(), 'w': out.width, 'h': out.height, 'body': hexc(body), 'dark': hexc(dark)}


def main():
    pack = json.load(open(PACK))
    only = set(sys.argv[1:])
    res = json.load(open(OUT)) if os.path.exists(OUT) and only else {}
    sessions = {}
    for k, v in pack.items():
        if only and k not in only:
            continue
        im = load(v)
        if k in SKIP:
            res.pop(k, None); print(k, 'skipped (keeps round picture)'); continue
        if k in FLOOD:
            a = flood_alpha(im, FLOOD[k])
        else:
            a = model_alpha(im, 'isnet-anime' if k in ISNET else 'u2net', sessions)
        r = finish(im, clean(a))
        if r:
            res[k] = r
        print(k, 'ok' if r else 'FAILED (keeps round picture)', flush=True)
    json.dump(res, open(OUT, 'w'), separators=(',', ':'))
    print(f'{len(res)} cut-outs, {os.path.getsize(OUT) // 1024} KB -> {OUT}')


if __name__ == '__main__':
    main()
