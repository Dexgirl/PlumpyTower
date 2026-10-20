#!/usr/bin/env python3
"""Portrait cover for phones: data/art/cover-tall.webp (1080 x 2160) + cover-tall-small.webp (the blurred backdrop).
Rebuilt from the landscape cover (data/art/cover-source.png): the characters and the logo are cut out (rembg),
the rest of the picture is painted over and softened into a tall backdrop, then everything is placed again for a
tall screen. 18:9, so 19.5:9 phones lose a little at the sides and 16:9 phones a little at the top and bottom;
anything that matters stays inside x 45-1035, y 120-2040.
Needs: pip install rembg onnxruntime pillow numpy scipy opencv-python   (u2net / isnet-anime models download once)
Run:   python3 scripts/cover-tall.py
"""
import os, tempfile
ROOT = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
ART = os.path.join(ROOT, 'data/art')
WORK = tempfile.mkdtemp(prefix='cover-tall-')
os.chdir(WORK)

# ======================= 1. cut-outs =======================
import numpy as np
from PIL import Image, ImageFilter
from rembg import new_session, remove
from scipy import ndimage
SRC = Image.open(os.path.join(ART, 'cover-source.png')).convert('RGB')
BOX = {   # x0, y0, x1, y1 in the source, a little margin around each
    'plumpy': (540, 228, 1090, 735), 'yellow': (400, 535, 670, 795), 'pink': (1100, 555, 1385, 812),
    'teal': (930, 635, 1150, 815), 'witch': (150, 535, 395, 785), 'purple': (1370, 555, 1605, 805),
    'logo': (425, 15, 1220, 290), 'cards': (95, 320, 245, 650),
}
sess = {m: new_session(m) for m in ('isnet-anime', 'u2net')}
for name, box in BOX.items():
    crop = SRC.crop(box)
    for m in ('isnet-anime', 'u2net'):
        a = np.array(remove(crop, session=sess[m], only_mask=True)).astype(np.float32) / 255
        lab, n = ndimage.label(a > 0.5)
        if n > 1 and name not in ('logo',):
            sizes = ndimage.sum(np.ones_like(a), lab, range(1, n + 1))
            keep = lab == (1 + int(np.argmax(sizes)))
            keep = ndimage.binary_dilation(keep, iterations=3)
            a = a * keep
        out = crop.copy(); out.putalpha(Image.fromarray((a * 255).astype(np.uint8)))
        out.save(f'cut_{name}_{m}.png')
    print(name, 'done')

# ======================= 2. the tall picture =======================
import math, numpy as np, cv2
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance
from scipy import ndimage
SRC = Image.open(os.path.join(ART, 'cover-source.png')).convert('RGB')
CW, CH = 1080, 2160
rng = np.random.default_rng(11)
BOX = {'plumpy': (540, 228, 1090, 735), 'yellow': (400, 535, 670, 795), 'pink': (1100, 555, 1385, 812),
       'teal': (930, 635, 1150, 815), 'witch': (150, 535, 395, 785), 'purple': (1370, 555, 1605, 805), 'logo': (425, 15, 1220, 290), 'cards': (95, 320, 245, 650)}
def cut(name, model): return Image.open(f'cut_{name}_{model}.png').convert('RGBA')

# ---------- backdrop: everything painted out, scaled to fill the height ----------
H0, W0 = SRC.height, SRC.width
mask = np.zeros((H0, W0), np.uint8)
for name, model in [('plumpy', 'isnet-anime'), ('yellow', 'u2net'), ('pink', 'u2net'), ('teal', 'u2net'), ('witch', 'u2net'), ('purple', 'u2net'), ('logo', 'u2net'), ('cards', 'u2net')]:
    a = np.array(cut(name, model).split()[3]) > 40
    x0, y0, x1, y1 = BOX[name]; mask[y0:y1, x0:x1] |= a.astype(np.uint8)
mask[790:910, 550:1115] = 1
mask = ndimage.binary_dilation(mask, iterations=10).astype(np.uint8) * 255
small = cv2.resize(np.array(SRC)[:, :, ::-1], (W0 // 2, H0 // 2), interpolation=cv2.INTER_AREA)
msmall = cv2.resize(mask, (W0 // 2, H0 // 2), interpolation=cv2.INTER_NEAREST)
paint = Image.fromarray(cv2.inpaint(small, msmall, 18, cv2.INPAINT_TELEA)[:, :, ::-1])
s = CH / paint.height
big = paint.resize((round(paint.width * s), CH), Image.BICUBIC)
cx = int(big.width * 0.50)
crop = big.crop((cx - CW // 2, 0, cx + CW // 2, CH))
bd = crop.filter(ImageFilter.GaussianBlur(13))
# the meadow a little crisper than the sky (depth): blend a lighter blur in from the horizon down
crisp = crop.filter(ImageFilter.GaussianBlur(5))
m = np.clip((np.arange(CH) - 1450) / 300.0, 0, 1)[:, None] * np.ones((1, CW))
bd = Image.composite(crisp, bd, Image.fromarray((m * 255).astype(np.uint8)))
bd = ImageEnhance.Brightness(bd).enhance(0.95).convert('RGBA')

def overlay_grad(img, color, a_top, a_bot, y0, y1):
    g = np.zeros((CH, CW, 4), np.uint8); g[..., :3] = color
    t = np.clip((np.arange(CH) - y0) / max(1, (y1 - y0)), 0, 1)[:, None]
    g[..., 3] = (a_top + (a_bot - a_top) * t).astype(np.uint8)
    img.alpha_composite(Image.fromarray(g))
overlay_grad(bd, (20, 10, 66), 175, 0, 0, 820)          # a deeper night at the top: the logo pops
overlay_grad(bd, (14, 8, 34), 0, 150, 1650, 2160)        # and darker at the bottom: the pill pops

d = ImageDraw.Draw(bd)
for _ in range(240):
    x = rng.uniform(0, CW); y = rng.uniform(0, 640) if rng.random() < 0.75 else rng.uniform(0, 1050)
    r = rng.choice([1, 1, 1.5, 2, 2.5]); a = int(rng.uniform(90, 255) * max(0.25, 1 - y / 1200))
    d.ellipse((x - r, y - r, x + r, y + r), fill=(255, 250, 255, a))
def sparkle(img, x, y, r, a=235):
    lay = Image.new('RGBA', img.size, (0, 0, 0, 0)); dl = ImageDraw.Draw(lay)
    k = 0.17
    dl.polygon([(x, y - r), (x + r * k, y - r * k), (x + r, y), (x + r * k, y + r * k), (x, y + r), (x - r * k, y + r * k), (x - r, y), (x - r * k, y - r * k)], fill=(255, 250, 255, a))
    img.alpha_composite(lay.filter(ImageFilter.GaussianBlur(r * 0.4))); img.alpha_composite(lay)
for (x, y, r) in [(110, 105, 24), (975, 80, 17), (95, 640, 16), (1000, 560, 13), (300, 560, 10), (940, 1240, 12)]:
    sparkle(bd, x, y, r)

def place(img, layer, x, ybottom, scale, shadow=None, top=False):
    L = layer.resize((round(layer.width * scale), round(layer.height * scale)), Image.LANCZOS)
    y = ybottom if top else ybottom - L.height
    if shadow:
        sw, sh, dy, sa = shadow
        sl = Image.new('RGBA', img.size, (0, 0, 0, 0)); ds = ImageDraw.Draw(sl)
        by = y + L.height + dy
        ds.ellipse((x - sw / 2, by - sh / 2, x + sw / 2, by + sh / 2), fill=(10, 6, 24, sa))
        img.alpha_composite(sl.filter(ImageFilter.GaussianBlur(sh * 0.4)))
    img.alpha_composite(L, (round(x - L.width / 2), round(y)))
    return L

# ---------- moon: the disc, its lower part faded into the backdrop (trees and a Chog sit there in the source) ----------
mc, mr = (1311, 420), 262
mcrop = SRC.crop((mc[0] - mr - 40, mc[1] - mr - 40, mc[0] + mr + 40, mc[1] + mr + 40)).convert('RGBA')
mm = Image.new('L', mcrop.size, 0); ImageDraw.Draw(mm).ellipse((40, 40, 40 + 2 * mr, 40 + 2 * mr), fill=255)
mm = np.array(mm.filter(ImageFilter.GaussianBlur(5))).astype(np.float32)
yy = np.arange(mcrop.height)[:, None] - (40 + mr)
mm *= np.clip(1 - (yy - 40) / 70.0, 0, 1)
mcrop.putalpha(Image.fromarray(mm.astype(np.uint8)))
MX, MY, MS = 790, 900, 1.38
R = mr * MS
glow = Image.new('RGBA', (CW, CH), (0, 0, 0, 0)); ImageDraw.Draw(glow).ellipse((MX - R * 1.3, MY - R * 1.3, MX + R * 1.3, MY + R * 1.3), fill=(205, 165, 255, 85))
bd.alpha_composite(glow.filter(ImageFilter.GaussianBlur(80)))
ml = mcrop.resize((round(mcrop.width * MS), round(mcrop.height * MS)), Image.LANCZOS)
bd.alpha_composite(ml, (round(MX - ml.width / 2), round(MY - ml.height / 2)))

# ---------- logo: colour mask (letters and their bevels), minus Plumpy's spike and the moon's rim ----------
logo = cut('logo', 'u2net'); a = np.array(logo).astype(np.float32)
mk = (a[..., 0] > 100) & (a[..., 3] > 20)
mk = ndimage.binary_closing(mk, iterations=2)
holes = ndimage.binary_fill_holes(mk) & ~mk                      # only the letters' own small holes get filled
hl, hn = ndimage.label(holes); hs = ndimage.sum(holes, hl, range(1, hn + 1))
mk |= np.isin(hl, 1 + np.where(hs < 2500)[0])
lab, n = ndimage.label(mk)
keep = []
for i, sl in enumerate(ndimage.find_objects(lab)):
    size = (lab[sl] == i + 1).sum()
    touches = sl[1].stop >= mk.shape[1] - 2 or sl[0].stop >= mk.shape[0] - 2
    if size > 400 and not touches: keep.append(i + 1)
mk = np.isin(lab, keep)
x0, y0 = BOX['logo'][:2]; Y, X = np.mgrid[0:mk.shape[0], 0:mk.shape[1]]
mk[(Y + y0 > 246) & (X + x0 > 732) & (X + x0 < 860)] = False
mk = ndimage.binary_dilation(mk, iterations=2)
logo.putalpha(Image.fromarray((mk * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.2)))
logo = logo.crop(logo.getbbox())
# a soft dark halo behind the logo so it reads on any sky
lw = 930 / logo.width
lg = logo.resize((round(logo.width * lw), round(logo.height * lw)), Image.LANCZOS)
halo = Image.new('RGBA', (CW, CH), (0, 0, 0, 0))
hm = Image.new('L', (CW, CH), 0); hm.paste(lg.split()[3], (round(CW / 2 - lg.width / 2), 160))
halo.putalpha(hm.filter(ImageFilter.GaussianBlur(22)).point(lambda v: int(v * 0.55)))
hl = Image.new('RGBA', (CW, CH), (16, 6, 48, 255)); hl.putalpha(halo.split()[3])
bd.alpha_composite(hl)
bd.alpha_composite(lg, (round(CW / 2 - lg.width / 2), 160))

plumpy = cut('plumpy', 'isnet-anime'); plumpy = plumpy.crop(plumpy.getbbox())
yellow = cut('yellow', 'u2net'); yellow = yellow.crop(yellow.getbbox())
pink = cut('pink', 'u2net'); pink = pink.crop(pink.getbbox())
teal = cut('teal', 'u2net'); teal = teal.crop(teal.getbbox())
purple = cut('purple', 'u2net'); purple = purple.crop(purple.getbbox())

out = bd
place(out, plumpy, 515, 640, 1.56, top=True)
place(out, purple, 905, 1600, 0.98, shadow=(220, 40, -10, 130))
place(out, yellow, 222, 1660, 1.16, shadow=(280, 46, -12, 160))
place(out, pink, 828, 1675, 1.16, shadow=(285, 46, -12, 160))
place(out, teal, 545, 1712, 1.2, shadow=(250, 40, -8, 170))
# Plumpy's shadow on the meadow, far below him (he's mid-jump)
sl = Image.new('RGBA', (CW, CH), (0, 0, 0, 0)); ImageDraw.Draw(sl).ellipse((330, 1590, 700, 1640), fill=(10, 6, 24, 70))
out.alpha_composite(sl.filter(ImageFilter.GaussianBlur(18)))

# ---------- foliage in the bottom corners ----------
def corner(box, scale, side):
    c = SRC.crop(box).convert('RGBA'); c = c.resize((round(c.width * scale), round(c.height * scale)), Image.LANCZOS)
    fx = np.linspace(0, 1, c.width)[None, :] if side == 'L' else np.linspace(1, 0, c.width)[None, :]
    fy = np.linspace(0, 1, c.height)[:, None]
    m = np.clip((1 - fx) * 2.0, 0, 1) * np.clip(fy * 2.2, 0, 1)
    c.putalpha(Image.fromarray((m * 255).astype(np.uint8))); return c
cl = corner((0, 700, 175, 941), 1.9, 'L'); out.alpha_composite(cl, (0, CH - cl.height))
cr = corner((1480, 790, 1671, 941), 1.9, 'R'); out.alpha_composite(cr, (CW - cr.width, CH - cr.height))

# ---------- the pill and the line under it ----------
def feathered(box, scale, fe):
    c = SRC.crop(box).convert('RGBA'); c = c.resize((round(c.width * scale), round(c.height * scale)), Image.LANCZOS)
    w, h = c.size
    fx = np.minimum(np.linspace(0, 1, w), np.linspace(1, 0, w)) / fe
    fy = np.minimum(np.linspace(0, 1, h), np.linspace(1, 0, h)) / fe
    c.putalpha(Image.fromarray((np.clip(fx[None, :], 0, 1) * np.clip(fy[:, None], 0, 1) * 255).astype(np.uint8))); return c
pill = feathered((590, 793, 1075, 876), 1.5, 0.12)
out.alpha_composite(pill, (round(CW / 2 - pill.width / 2), 1765))
line = feathered((552, 874, 1112, 906), 1.5, 0.06)
out.alpha_composite(line, (round(CW / 2 - line.width / 2), 1912))

out = out.convert('RGB')
out.save(os.path.join(ART, 'cover-tall.webp'), 'WEBP', quality=84, method=6)
out.resize((135, 270), Image.LANCZOS).save(os.path.join(ART, 'cover-tall-small.webp'), 'WEBP', quality=80)
print('wrote', os.path.join(ART, 'cover-tall.webp'), os.path.getsize(os.path.join(ART, 'cover-tall.webp')) // 1024, 'KB')
