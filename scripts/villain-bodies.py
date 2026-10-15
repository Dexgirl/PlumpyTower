#!/usr/bin/env python3
"""Give every NFT villain a real body: the picture is a bust (cut off at the chest by the frame), so the torso
is continued below it in the NFT's own clothes / fur, and the game adds arms, legs and feet in matching colours.

Reads/writes data/villain-cut.json (made by scripts/cut-villains.py). For each bust villain it keeps the original
cut-out in `bust`, puts bust + torso in `img`, and adds where the body attaches and what colours it uses:
  bh        seam height (px): the bust's bottom edge, where the torso starts
  tb        torso bottom (px)
  sh        shoulders [left x, right x] (px) at the seam
  hip       hips [left x, right x] (px) near the torso bottom
  skin, sleeve, legs, shoe   colours for hands, arms, legs, feet
Villains that are already a whole thing (a puff, a ghost, lips, a bean) are left as they are.

usage: python3 -I scripts/villain-bodies.py [--sheet out.png] [keys...]
"""
import base64, io, json, os, sys
import numpy as np
from PIL import Image
from scipy import ndimage

HERE = os.path.dirname(os.path.abspath(__file__))
CUT = os.environ.get('VCUT') or os.path.join(HERE, '../data/villain-cut.json')
INK = np.array([27, 16, 36])

# whole creatures/objects: their body is already in the picture
WHOLE = {'r3t205', 'axie11935654', 'axie11426741', 'mouch806', 'r3t505', 'skrump2831', 'skrump2643',
         'blokyz16', 'argo3615', 'pudgy5678', 'betty19'}

# per-villain body notes (looked at every NFT). legs: 'pants' (trousers + belt), 'skin' (bare legs / fur), 'body'
# (same as the torso: fur, a sheet, a robe), or a colour. arms: 'sleeve' (torso colour) or 'skin'.
BODY = {
    'skrump2958':  dict(legs='body', arms='body', skin='#fcb259', shoe='#d9822b', ext=0.36, plain=True, taper=0.86),
    'chewy163':    dict(legs='#3b3a3f', skin='#c9a48a', shoe='#2a2030', arm='R'),
    'monafuku653': dict(legs='skin', skin='#f7e3dc', skirt='#f4b6c8', shoe='#ff7fae'),
    'skrump2948':  dict(legs='body', arms='body', skin='#7d5fc9', shoe='#4b3590', ext=0.34, shirt='#7d5fc9', taper=0.86),
    'bearish4744': dict(legs='body', arms='body', skin='#cf8e70', shoe='#8a5a44', pad='#f1c7a8'),
    'kapysh62':    dict(legs='#2b2026', skin='#c9905d', shoe='#1d1418'),
    'lilpudgy13790': dict(legs='body', arms='body', skin='#fff8ea', shoe='#ffa53b', ext=0.26, arm='R'),
    'pudgy7460':   dict(legs='#fff8ea', arms='#2f2f3a', skin='#fff8ea', shoe='#ffa53b', ext=0.26),
    'daks2948':    dict(legs='body', arms='body', skin='#5a8ad1', shoe='#ffa53b', ext=0.26),
    'chewy833':    dict(legs='#4a4136', skin='#c9a48a', shoe='#2a2030'),
    'mayc66':      dict(legs='#5b4a3d', skin='#e7b9c8', shoe='#2a2030'),
    'kapysh239':   dict(legs='#3c4350', skin='#2b3038', shoe='#f2f2f2'),
    'madlads5391': dict(legs='#3b3e46', skin='#d7b39a', shoe='#1f1b22'),
    'molandak390': dict(legs='#2e2a4a', skin='#7a4fd8', shoe='#ffffff'),
    'mayc6519':    dict(legs='#3c4a2a', skin='#c9a35a', shoe='#2a2030'),
    'bearish6399': dict(legs='skin', arms='skin', skin='#7fb6e8', shoe='#4f7fb5', pad='#cfe3f7'),
    'sfpunk707':   dict(legs='#2c2440', skin='#ff8fc8', shoe='#1d1428'),
    'azuki1748':   dict(legs='#2c4d4a', skin='#4b5d63', shoe='#f0efe8'),
    'mayc2151':    dict(legs='#3d2f28', skin='#b7c27a', shoe='#2a2030'),
    'milady6745':  dict(legs='skin', skin='#f6d9c9', skirt='#3a3a44', shoe='#2a2030', src='orig', grow=0.62, ext=0.36),
    'madlads6955': dict(legs='#232a37', skin='#e2b48f', shoe='#141018'),
    'mouch1151':   dict(legs='#3d2470', arms='body', skin='#63b6e8', shoe='#24163f'),
    'chewy1407':   dict(legs='#5c6270', skin='#c8cdd6', shoe='#2a2030'),
    'betty23':     dict(legs='#2a2a33', skin='#4ea86a', shoe='#c9a227'),
    'daks867':     dict(legs='skin', arms='body', skin='#7fb05a', shoe='#5d8f3c', arm='L'),
    'betty24':     dict(legs='#2a2a33', skin='#4ea86a', shoe='#c9a227'),
    'madlads723':  dict(legs='#2d2530', skin='#d7a68a', shoe='#141018', arm='L'),
    'molandak3061': dict(legs='#3a4f7a', skin='#8bd14e', shoe='#ffffff', arm='none'),
    'daks513':     dict(legs='body', arms='body', skin='#3a3d48', shoe='#ffa53b', ext=0.3, src='orig', grow=0.62),
    'r3t806':      dict(legs='#2a2a38', arms='sleeve', skin='#8b5a3c', shoe='#141018', shirt='#2d2438', grow=0.6, ext=0.36),
    'daks2609':    dict(legs='body', arms='body', skin='#5aa0d8', shoe='#ffa53b', ext=0.3, src='orig', grow=0.7),
    'argo8764':    dict(legs='#e8e4da', arms='#e8e4da', skin='#e8e4da', shoe='#5b5b5b', shirt='#cfd3da', ribs=True, grow=0.5, seam=0.97, ext=0.42, plain=True),
    'argo6511':    dict(legs='#e8e4da', arms='#e8e4da', skin='#e8e4da', shoe='#5b5b5b'),
    'daks1000':    dict(legs='#3a2a22', skin='#e0b08a', shoe='#2a2030', src='orig', grow=0.8, ext=0.34),
    'azuki9453':   dict(legs='#2a2830', skin='#d27a6a', shoe='#1d1418', arm='R'),
    'kapysh218':   dict(legs='body', arms='body', skin='#c9905d', shoe='#c9cfdb', ext=0.2, arm='none'),
    'madlads5176': dict(legs='#3a2a78', skin='#3b4fb8', shoe='#141018'),
    'mouch1320':   dict(legs='body', arms='body', skin='#ff8a2a', shoe='#c4441c'),
    'v1punk5103':  dict(legs='#2a2a38', skin='#a8693a', shoe='#141018', shirt='#34343f', grow=0.95, ext=0.34),
}


def load(u):
    return Image.open(io.BytesIO(base64.b64decode(u.split(',', 1)[1]))).convert('RGBA')


def uri(im):
    b = io.BytesIO(); im.save(b, 'WEBP', quality=86, method=6)
    return 'data:image/webp;base64,' + base64.b64encode(b.getvalue()).decode()


def hexc(c):
    return '#%02x%02x%02x' % tuple(int(max(0, min(255, round(x)))) for x in c[:3])


def rgb(h):
    h = h.lstrip('#'); return np.array([int(h[i:i + 2], 16) for i in (0, 2, 4)], float)


def shade(c, k):
    c = np.asarray(c, float)
    return c + (255 - c) * k if k > 0 else c * (1 + k)


def seam_row(a, o):
    """the lowest row where the bust is still wide: the frame cut the character off there (or the cutter lost the body)"""
    al = a[:, :, 3]; h, w = al.shape
    if 'seam' in o: return int(round(o['seam'] * h))
    for r in range(h - 2, int(h * 0.7), -1):
        if (al[r] > 128).sum() >= 0.3 * w: return r
    return None


def body(key, rec, pack):
    src = load(rec.get('bust') or rec['img'])
    a = np.asarray(src).astype(float)
    h, w, _ = a.shape
    al = a[:, :, 3]
    o = BODY.get(key, {})
    s = seam_row(a, o)
    xs = np.where(al[s] > 128)[0]
    x0, x1 = xs.min(), xs.max()
    ol = 2                                                # the cut-out's ink outline is about 2px
    xi0, xi1 = x0 + ol, x1 - ol
    cx = (xi0 + xi1) / 2 + o.get('dx', 0) * w
    hw_seam = (xi1 - xi0) / 2
    hw_sh = max(hw_seam, o['grow'] * w / 2) if o.get('grow') else hw_seam    # shoulders (wider than a neck)
    Ht = int(round(o.get('ext', 0.3) * h))
    taper = o.get('taper', 0.8)
    # the clothes / fur pattern: the bust's bottom band (or the original picture's, when the cutter lost the body)
    b = max(3, int(round(0.08 * h)))
    if o.get('src') == 'orig':
        org = load(pack[key]['img']).convert('RGB'); W0, H0 = org.size
        crop = org.crop((int(W0 * 0.3), int(H0 * 0.9), int(W0 * 0.7), H0)).resize((xi1 - xi0 + 1, b), Image.LANCZOS)
        band = np.zeros((b, w, 4)); band[:, xi0:xi1 + 1, :3] = np.asarray(crop); band[:, xi0:xi1 + 1, 3] = 255
    else:
        band = a[s - b + 1:s + 1].copy()
    solid = band[:, :, 3] > 128
    inner = band[:, xi0:xi1 + 1][solid[:, xi0:xi1 + 1]]
    med = np.median(inner[:, :3], axis=0) if len(inner) else rgb(rec.get('body', '#888888'))
    if o.get('shirt'): med = rgb(o['shirt'])
    bandc = band[:, :, :3].copy()
    for r in range(b):   # fill holes (gaps by the arms, parts the cutter took away) with the row's own colours
        ok = np.where(solid[r])[0]
        if len(ok) == 0: bandc[r] = med; continue
        for x in range(w):
            if not solid[r, x]:
                j = ok[np.argmin(np.abs(ok - x))]; bandc[r, x] = band[r, j, :3] * 0.5 + med * 0.5
    plain = o.get('plain') or o.get('shirt')
    legs_kind = o.get('legs', 'pants')
    pants = rgb('#2e3350') if legs_kind == 'pants' else rgb(legs_kind) if legs_kind.startswith('#') else None
    skirt = rgb(o['skirt']) if o.get('skirt') else None
    belt_rows = int(round(Ht * 0.24)) if (pants is not None or skirt is not None) else 0
    y0 = s - 1                                            # the torso starts just under the seam, behind the bust
    H2 = max(h, y0 + Ht) + ol + 2
    T = np.zeros((H2, w, 4)); tm = np.zeros((H2, w), bool)
    fl = max(2, int(Ht * 0.22)) if hw_sh > hw_seam + 1 else 0   # rows over which a neck flares out to the shoulders
    for j in range(Ht):
        t = j / max(1, Ht - 1)
        if fl and j < fl:
            q = j / fl; hw = hw_seam + (hw_sh - hw_seam) * np.sqrt(1 - (1 - q) ** 2)
        else:
            tt = (j - fl) / max(1, Ht - 1 - fl)
            hw = hw_sh * (1 - (1 - taper) * tt ** 1.4)
        rc = hw * 0.55
        dy = j - (Ht - rc)
        if dy > 0: hw = hw - (rc - np.sqrt(max(0.0, rc * rc - dy * dy)))
        if skirt is not None and j >= Ht - belt_rows: hw = hw + (j - (Ht - belt_rows)) * 0.35
        L, R = cx - hw, cx + hw
        if R - L < 2: continue
        k = j % (2 * b); sr = b - 1 - k if k < b else k - b   # mirror the band down, the seam row first
        y = y0 + j
        for x in range(int(np.ceil(L)), int(np.floor(R)) + 1):
            if x < 0 or x >= w: continue
            u = (x - L) / max(1e-6, R - L)
            sx = int(round(xi0 + u * (xi1 - xi0)))
            col = med.copy() if plain else bandc[sr, sx] * (1 - 0.3 * t) + med * 0.3 * t
            if o.get('ribs') and (j // 3) % 2 and abs(x - cx) > 1.5: col = shade(med, -0.35)
            e = abs(x - cx) / max(1.0, hw)
            col = col * (1 - 0.13 * t) * (1 - 0.16 * e ** 4)
            if belt_rows and j >= Ht - belt_rows:
                base = skirt if skirt is not None else pants
                col = shade(base, 0.08) * (1 - 0.16 * e ** 4)
                if j - (Ht - belt_rows) < 2: col = shade(base, -0.45)
            T[y, x, :3] = col; T[y, x, 3] = 255; tm[y, x] = True
    st = ndimage.generate_binary_structure(2, 1)
    edge = ndimage.binary_dilation(tm, structure=st, iterations=ol) & ~tm
    T[edge, :3] = INK; T[edge, 3] = 255
    im = Image.fromarray(T.astype(np.uint8), 'RGBA')
    bust = Image.new('RGBA', (w, H2), (0, 0, 0, 0)); bust.paste(src, (0, 0))
    im.alpha_composite(bust)                              # the bust goes over its body: collars, beards, hair overlap it
    skin = rgb(o['skin']) if o.get('skin') else med
    arms = o.get('arms', 'sleeve')
    sleeve = med if arms in ('sleeve', 'body') else skin if arms == 'skin' else rgb(arms)
    legs = med if legs_kind == 'body' else skin if legs_kind == 'skin' else pants
    shoe = rgb(o['shoe']) if o.get('shoe') else shade(legs, -0.45)
    hip_hw = hw_sh * taper
    rec2 = dict(rec)
    rec2['bust'] = rec.get('bust') or rec['img']
    rec2.update(img=uri(im), w=w, h=H2, bh=s, tb=y0 + Ht, sh=[round(cx - hw_sh, 1), round(cx + hw_sh, 1)], hip=[round(cx - hip_hw * 0.52, 1), round(cx + hip_hw * 0.52, 1)],
                body=hexc(med), dark=hexc(shade(med, -0.38)), skin=hexc(skin), sleeve=hexc(sleeve), legs=hexc(legs), shoe=hexc(shoe))
    if o.get('pad'): rec2['pad'] = o['pad']
    rec2['arm'] = o.get('arm', 'both')
    return rec2


def main():
    args = sys.argv[1:]
    sheet = None
    if '--sheet' in args:
        i = args.index('--sheet'); sheet = args[i + 1]; del args[i:i + 2]
    cut = json.load(open(CUT))
    pack = json.load(open(os.path.join(HERE, '../data/villain-pack.json')))
    done = []
    for k, rec in cut.items():
        if args and k not in args: continue
        if k in WHOLE:
            if 'bust' in rec:   # undo an earlier body
                for f in ('bh', 'tb', 'sh', 'hip', 'skin', 'sleeve', 'legs', 'shoe', 'pad', 'arm'): rec.pop(f, None)
                im = load(rec['bust']); rec.update(img=rec.pop('bust'), w=im.width, h=im.height)
            continue
        src = load(rec.get('bust') or rec['img'])
        if seam_row(np.asarray(src).astype(float), BODY.get(k, {})) is None:
            print(k, 'not cut off at the bottom: left as it is'); continue
        cut[k] = body(k, rec, pack); done.append(k)
    json.dump(cut, open(CUT, 'w'), separators=(',', ':'))
    print(f'bodies for {len(done)} villains -> {CUT} ({os.path.getsize(CUT) // 1024} KB)')
    if sheet:
        cols = 8; cell = 170
        keys = done or list(cut)
        S = Image.new('RGB', (cols * cell, ((len(keys) + cols - 1) // cols) * cell), (255, 179, 107))
        for i, k in enumerate(keys):
            im = load(cut[k]['img']); s = min((cell - 10) / im.width, (cell - 10) / im.height)
            im = im.resize((max(1, int(im.width * s)), max(1, int(im.height * s))), Image.LANCZOS)
            S.paste(im, ((i % cols) * cell + (cell - im.width) // 2, (i // cols) * cell + (cell - im.height) // 2), im)
        S.save(sheet); print('sheet ->', sheet)


if __name__ == '__main__':
    main()
