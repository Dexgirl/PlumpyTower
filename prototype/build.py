# Assemble plumpy.html from the source + parts + the Chog pack.
import json, os
here = os.path.dirname(os.path.abspath(__file__))
src = open(os.path.join(here, 'plumpy.src.html')).read()
phys = open(os.path.join(here, 'parts/physics.js')).read()
levels = open(os.path.join(here, 'parts/levels.js')).read()
voices = open(os.path.join(here, 'parts/voicelines.js')).read()
villains = open(os.path.join(here, 'parts/villains.js')).read()
fight = open(os.path.join(here, 'parts/fight.js')).read()
mounts = open(os.path.join(here, 'parts/mounts.js')).read()
vpack_path = os.path.join(here, '../data/villain-pack.json')
vpack = json.load(open(vpack_path)) if os.path.exists(vpack_path) else {}
vpack_js = 'const VILLAIN_PACK = ' + json.dumps(vpack, separators=(',', ':')) + ';'
vcut_path = os.path.join(here, '../data/villain-cut.json')
vcut = json.load(open(vcut_path)) if os.path.exists(vcut_path) else {}
vpack_js += '\nconst VILLAIN_CUT = ' + json.dumps(vcut, separators=(',', ':')) + ';'
ccut_path = os.path.join(here, '../data/chog-cut.json')
ccut = json.load(open(ccut_path)) if os.path.exists(ccut_path) else {}
vpack_js += '\nconst CHOG_CUT = ' + json.dumps(ccut, separators=(',', ':')) + ';'
import base64
art = os.path.join(here, '../data/art')
def data_uri(name):
    f = os.path.join(art, name)
    return 'data:image/webp;base64,' + base64.b64encode(open(f, 'rb').read()).decode() if os.path.exists(f) else ''
vpack_js += '\nconst COVER_ART = ' + json.dumps(data_uri('cover.webp')) + ';\nconst COVER_SMALL = ' + json.dumps(data_uri('cover-small.webp')) + ';'
# recorded voices (mixed by scripts/mix-voices.py into ../build/voices/<id>.mp3):
# the story's clips go inside the page; the rest become voices/<bundle>.json next to it, loaded when needed
import re, shutil
vdir = os.path.join(here, '../build/voices')
out_dir = os.path.join(here, 'voices')
clips, bundles = {}, {}
STORY = re.compile(r'^(n_origin_|p_origin_)|^(bear_origin|p_hello)$')
def bundle_of(i):
    m = re.match(r'^[lvf](\d+)_', i)
    if m: return 'L' + m.group(1)
    m = re.match(r'^w(\d+)_', i)
    if m: return 'W' + m.group(1)
    return 'core'
if os.path.isdir(vdir):
    for f in sorted(os.listdir(vdir)):
        if not f.endswith('.mp3'): continue
        i = f[:-4]
        uri = 'data:audio/mpeg;base64,' + base64.b64encode(open(os.path.join(vdir, f), 'rb').read()).decode()
        if STORY.match(i): clips[i] = uri
        else: bundles.setdefault(bundle_of(i), {})[i] = uri
if os.path.isdir(out_dir): shutil.rmtree(out_dir)
if bundles:
    os.makedirs(out_dir)
    for name, m in bundles.items():
        json.dump(m, open(os.path.join(out_dir, name + '.json'), 'w'), separators=(',', ':'))
clips_js = 'const VOICE_CLIPS = ' + json.dumps(clips, separators=(',', ':')) + ';\nconst VOICE_RECORDED = ' + ('true' if bundles else 'false') + ';'
SITE_MARK = 'const SITE = {"pwa":false,"url":""};'   # the Claude artifact; build_site.py swaps this for the live web app
clips_js += '\n' + SITE_MARK
pack = json.load(open(os.path.join(here, '../data/plumpy-pack.json')))
slim = [{'token': c['token'], 'num': c['num'], 'name': c['name'], 'traits': {k: v for k, v in c['traits'].items() if v not in (None, '')}, 'img': c['img']} for c in pack['chogs']]
pack_js = 'const CHOG_PACK = ' + json.dumps(slim, separators=(',', ':')) + ';'
for ph in ('/*__PHYSICS__*/', '/*__LEVELS__*/', '/*__VILLAINS__*/', '/*__FIGHT__*/', '/*__MOUNTS__*/', '/*__VOICES__*/', '/*__PACK__*/', '/*__CLIPS__*/', '/*__VPACK__*/'):
    assert src.count(ph) == 1, ph
out = src.replace('/*__PHYSICS__*/', phys).replace('/*__LEVELS__*/', levels).replace('/*__VILLAINS__*/', villains).replace('/*__FIGHT__*/', fight).replace('/*__MOUNTS__*/', mounts).replace('/*__VPACK__*/', vpack_js).replace('/*__VOICES__*/', voices).replace('/*__CLIPS__*/', clips_js).replace('/*__PACK__*/', pack_js)
open(os.path.join(here, 'plumpy.html'), 'w').write(out)
vb = sum(os.path.getsize(os.path.join(out_dir, f)) for f in os.listdir(out_dir)) if bundles else 0
print('built plumpy.html', round(len(out) / 1024), 'KB ·', len(clips), 'story clips inside +', sum(len(m) for m in bundles.values()), 'in', len(bundles), 'voice bundles (', round(vb / 1048576, 1), 'MB ) ·', len(vpack), 'villain pictures ·', len(vcut), 'villain cut-outs ·', len(ccut), 'Chog cut-outs')
# the live web app (PWA) for the real domain: ../site/
import build_site
build_site.build(out, SITE_MARK, out_dir)
