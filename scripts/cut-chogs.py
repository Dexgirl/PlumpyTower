#!/usr/bin/env python3
"""Cut every Chog out of its picture background, so a freed Chog fights as itself (its own head, cap and face on the plump body).

Needs: pip install pillow numpy scipy
Reads:  data/plumpy-pack.json   (the Chog pictures)
Writes: data/chog-cut.json      {token: {img: transparent webp data URI, w, h, wear}}
Chog pictures are close-up busts on flat backgrounds: the background is flood-filled away from the corners and edges,
the bottom of the bust fades out (it blends into the plump body, which is drawn in the outfit colour 'wear'),
and an ink outline goes round the rest. build.py bakes chog-cut.json in; a Chog without a cut-out falls back to its framed picture.
"""
import base64, io, json, os, sys
import numpy as np
from PIL import Image
from scipy import ndimage

HERE = os.path.dirname(os.path.abspath(__file__))
PACK = os.path.join(HERE, '../data/plumpy-pack.json')
OUT = os.path.join(HERE, '../data/chog-cut.json')
INK = (27, 16, 36)
MAX_SIDE = 256   # full pack resolution (v20: was 140, looked soft on the cover and 3x screens)
TOL = {}   # per-token tolerance overrides (default 40)
MODEL = {'1881', '561', '900'}   # Legendaries with glowing art: the u2net cutter (pip install rembg onnxruntime) does better


def load(c):
    b = base64.b64decode(c['img'].split(',', 1)[1])
    return Image.open(io.BytesIO(b)).convert('RGB')


def wall_alpha(im, thr=95, it=2, side=0.35, tol=34, loose=False):
    """Chog art has thick dark outlines: flood the background from the top and upper sides of the picture, using the outline
    as a wall, so patterned or two-tone backgrounds go too and the Chog's own colours (even dark skin) stay."""
    a = np.asarray(im).astype(int)
    h, w, _ = a.shape
    lum = a[:, :, 0] * 0.3 + a[:, :, 1] * 0.59 + a[:, :, 2] * 0.11
    wall = ndimage.binary_dilation(lum < thr, iterations=it)
    p = max(4, w // 40)
    corners = [a[:p, :p], a[:p, -p:]] + ([a[h // 3:h // 3 + p, :p], a[h // 3:h // 3 + p, -p:]] if loose else [])
    cols = [np.median(c.reshape(-1, 3), axis=0) for c in corners if c.reshape(-1, 3).std(axis=0).mean() < 26 and (c.reshape(-1, 3) @ [0.3, 0.59, 0.11]).mean() >= thr]
    if not cols:
        return None
    border = np.zeros((h, w), bool); border[0, :] = True; border[:int(h * side), 0] = True; border[:int(h * side), -1] = True
    d = np.min([np.sqrt(((a - c) ** 2).sum(-1)) for c in cols], axis=0)
    seed = border & ~wall & (d < tol)
    lab, n = ndimage.label(~wall)
    ids = set(np.unique(lab[seed])) - {0}
    if not ids:
        return None
    bg = ndimage.binary_dilation(np.isin(lab, list(ids)), iterations=it) & ~(lum < thr)   # take back the band the thickened wall hid
    fg = ~bg
    lab2, n2 = ndimage.label(fg)
    if n2 > 1:
        sizes = ndimage.sum(fg, lab2, range(1, n2 + 1))
        fg = lab2 == (np.argmax(sizes) + 1)
    fg = ndimage.binary_fill_holes(fg)
    return ndimage.binary_opening(fg, iterations=1)


def colour_alpha(im, tol):
    """background = flat colours sampled at the corners/edges, flooded from those spots"""
    a = np.asarray(im).astype(int)
    h, w, _ = a.shape
    p = max(4, w // 32)
    spots = [(0, 0), (0, w - p), (h // 4, 0), (h // 4, w - p), (h // 2, 0), (h // 2, w - p), (0, w // 2 - p // 2)]
    seeds, cols = [], []
    for y, x in spots:
        patch = a[y:y + p, x:x + p].reshape(-1, 3)
        if patch.std(axis=0).mean() > 30:
            continue
        cols.append(np.median(patch, axis=0)); seeds.append((y + p // 2, x + p // 2))
    if not cols:
        return None
    d = np.min([np.sqrt(((a - c) ** 2).sum(-1)) for c in cols], axis=0)
    lab, n = ndimage.label(d < tol)
    ids = {lab[y, x] for y, x in seeds} - {0}
    fg = ~np.isin(lab, list(ids))
    lab2, n2 = ndimage.label(fg)
    if n2 > 1:
        sizes = ndimage.sum(fg, lab2, range(1, n2 + 1))
        fg = lab2 == (np.argmax(sizes) + 1)
    fg = ndimage.binary_fill_holes(fg)
    return ndimage.binary_opening(fg, iterations=1)


def bg_alpha(im, tol):
    """try both cutters; keep the one that keeps the face whole and removes the most background"""
    h, w = im.height, im.width
    best = None
    for f in (lambda im: wall_alpha(im), lambda im: wall_alpha(im, 62, 1, 0.7, 70, True), lambda im: colour_alpha(im, tol), lambda im: wall_alpha(im, 110, 2, 0.35, 50, True)):
        fg = f(im)
        if fg is None:
            continue
        frac, centre = fg.mean(), fg[int(h * 0.3):int(h * 0.75), int(w * 0.28):int(w * 0.72)].mean()
        if centre < 0.92 or frac < 0.3 or frac > 0.97:
            continue
        if best is None or frac < best[0]:
            best = (frac, fg)
    return best[1] if best else None


def model_fg(im):
    from rembg import new_session, remove
    global _SESSION
    try:
        _SESSION
    except NameError:
        _SESSION = new_session('u2net')
    a = np.asarray(remove(im, session=_SESSION).convert('RGBA'))[:, :, 3] / 255.0
    fg = a > 0.5
    lab, n = ndimage.label(fg)
    if n > 1:
        sizes = ndimage.sum(fg, lab, range(1, n + 1))
        fg = lab == (np.argmax(sizes) + 1)
    return ndimage.binary_fill_holes(fg)


def cut(c):
    im = load(c)
    fg = model_fg(im) if str(c['token']) in MODEL else bg_alpha(im, TOL.get(str(c['token']), 40))
    if fg is None or fg.mean() < 0.2 or fg.mean() > 0.97:
        return None
    rgb = np.asarray(im)
    h, w = fg.shape
    alpha = fg.astype(float)
    ys = np.arange(h)[:, None]
    fade0 = int(h * 0.8)
    alpha = alpha * np.clip((h - 1 - ys) / (h - 1 - fade0), 0, 1).repeat(w, 1) ** 0.8   # the bottom of the bust fades into the body
    wear_rows = rgb[int(h * 0.74):int(h * 0.86)][fg[int(h * 0.74):int(h * 0.86)]]
    wear = np.median(wear_rows, axis=0) if len(wear_rows) > 30 else np.median(rgb[fg], axis=0)
    # outline (pad first so edges cut by the picture frame get outlined too), not along the faded bottom
    pad = 4
    solid = np.pad(fg, pad)
    ring = ndimage.binary_dilation(solid, iterations=3) & ~solid
    ring[pad + fade0 - 6:, :] = False
    out = np.zeros((h + pad * 2, w + pad * 2, 4), dtype=np.uint8)
    out[ring] = (*INK, 255)
    body = np.zeros_like(out)
    body[pad:pad + h, pad:pad + w, :3] = rgb
    body[pad:pad + h, pad:pad + w, 3] = (alpha * 255).astype(np.uint8)
    o = Image.fromarray(out, 'RGBA'); o.alpha_composite(Image.fromarray(body, 'RGBA'))
    bb = o.getbbox()
    o = o.crop(bb)
    s = MAX_SIDE / max(o.size)
    if s < 1:
        o = o.resize((round(o.width * s), round(o.height * s)), Image.LANCZOS)
    buf = io.BytesIO(); o.save(buf, 'WEBP', quality=84, method=6)
    lum = wear[0] * 0.3 + wear[1] * 0.59 + wear[2] * 0.11
    if lum < 45:
        wear = wear + (255 - wear) * 0.22
    return {'img': 'data:image/webp;base64,' + base64.b64encode(buf.getvalue()).decode(), 'w': o.width, 'h': o.height,
            'wear': '#%02x%02x%02x' % tuple(int(max(0, min(255, x))) for x in wear)}


def main():
    pack = json.load(open(PACK))['chogs']
    only = set(sys.argv[1:])
    res = json.load(open(OUT)) if os.path.exists(OUT) and only else {}
    for c in pack:
        t = str(c['token'])
        if only and t not in only:
            continue
        r = cut(c)
        if r:
            res[t] = r
        else:
            res.pop(t, None)
        print(c['token'], c['name'], 'ok' if r else 'FAILED (keeps framed picture)', flush=True)
    json.dump(res, open(OUT, 'w'), separators=(',', ':'))
    print(f'{len(res)} cut-outs, {os.path.getsize(OUT) // 1024} KB -> {OUT}')


if __name__ == '__main__':
    main()
