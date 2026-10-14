# PLUMPY: the live web app. Turns the built game into a real site in ../site/ (served by GitHub Pages from /docs):
# a full HTML page with app icons and share previews, a web-app manifest, a service worker for offline play,
# the physics library served locally, and the per-level voice files.
#   PLUMPY_SITE_URL=https://plumpy.example   -> used for share previews (og:image needs a full address)
#   PLUMPY_DOMAIN=plumpy.example             -> writes the CNAME file GitHub Pages needs for a custom domain
import hashlib, json, os, shutil
from PIL import Image

here = os.path.dirname(os.path.abspath(__file__))
root = os.path.normpath(os.path.join(here, '..'))
SITE = os.path.join(root, 'site')
NAME = 'Plumpy and the Purple Moon'
SHORT = 'Plumpy'
DESC = 'Stack real Chog NFTs into a tower, knock 50 NFT villains off their perch and free 50 caged Chogs. A voiced story game on Monad. No wallet, no approvals. Ever.'
BG = '#22113f'
MATTER_TAG = '<script src="https://cdnjs.cloudflare.com/ajax/libs/matter-js/0.19.0/matter.min.js"></script>'


def icons(dst):
    os.makedirs(dst, exist_ok=True)
    src = Image.open(os.path.join(root, 'data/art/cover-source.png')).convert('RGB')
    face = src.crop((700, 255, 1040, 595))                     # Plumpy, from the cover art
    for size, name in ((512, 'icon-512.png'), (192, 'icon-192.png'), (180, 'apple-touch-icon.png'), (32, 'favicon-32.png')):
        face.resize((size, size), Image.LANCZOS).save(os.path.join(dst, name), optimize=True)
    wide = src.crop((870 - 212, 425 - 212, 870 + 213, 425 + 213))   # maskable: the face inside the safe middle 80%
    wide.resize((512, 512), Image.LANCZOS).save(os.path.join(dst, 'icon-maskable-512.png'), optimize=True)
    w, h = src.size                                             # share preview, 1200 x 630
    ch = round(w / 1.905)
    src.crop((0, (h - ch) // 2, w, (h - ch) // 2 + ch)).resize((1200, 630), Image.LANCZOS).save(os.path.join(SITE, 'og.jpg'), quality=86, optimize=True)


def build(page, site_mark, voices_dir):
    url = os.environ.get('PLUMPY_SITE_URL', '').rstrip('/')
    domain = os.environ.get('PLUMPY_DOMAIN', '').strip()
    if os.path.isdir(SITE):
        shutil.rmtree(SITE)
    os.makedirs(os.path.join(SITE, 'lib'))
    icons(os.path.join(SITE, 'icons'))
    # the physics library, served from the site itself (works offline, one less outside server)
    matter = None
    for c in ('/tmp/claude-0/-home-claude/679b8652-2fe1-593b-a6d4-52bc95c67d1f/scratchpad/phys/node_modules/matter-js/build/matter.min.js', os.path.join(root, 'vendor/matter.min.js')):
        if os.path.exists(c):
            matter = c
            break
    assert matter, 'matter.min.js 0.19.0 not found'
    os.makedirs(os.path.join(root, 'vendor'), exist_ok=True)
    if matter != os.path.join(root, 'vendor/matter.min.js'):
        shutil.copy(matter, os.path.join(root, 'vendor/matter.min.js'))
    shutil.copy(matter, os.path.join(SITE, 'lib/matter.min.js'))
    # voices
    vsum = hashlib.sha1()
    if os.path.isdir(voices_dir):
        shutil.copytree(voices_dir, os.path.join(SITE, 'voices'))
        for f in sorted(os.listdir(voices_dir)):
            vsum.update(open(os.path.join(voices_dir, f), 'rb').read())
    # the page
    assert page.count(site_mark) == 1 and page.count(MATTER_TAG) == 1
    assert page.count('<title>Plumpy Tower</title>') == 1
    page = page.replace('<title>Plumpy Tower</title>', '')
    body = page.replace(site_mark, 'const SITE = ' + json.dumps({'pwa': True, 'url': url}, separators=(',', ':')) + ';').replace(MATTER_TAG, '<script src="lib/matter.min.js"></script>')
    img = (url + '/og.jpg') if url else 'og.jpg'
    head = f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{NAME}</title>
<meta name="description" content="{DESC}">
<meta name="theme-color" content="{BG}">
<link rel="manifest" href="manifest.webmanifest">
<link rel="icon" type="image/png" sizes="32x32" href="icons/favicon-32.png">
<link rel="apple-touch-icon" href="icons/apple-touch-icon.png">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="{SHORT}">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta property="og:type" content="website">
<meta property="og:title" content="{NAME}">
<meta property="og:description" content="{DESC}">
<meta property="og:image" content="{img}">
{f'<meta property="og:url" content="{url}/">' if url else ''}
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{NAME}">
<meta name="twitter:description" content="{DESC}">
<meta name="twitter:image" content="{img}">
<style>html,body{{background:{BG}}}</style>
</head>
<body>
'''
    html = head + body + '\n</body>\n</html>\n'
    open(os.path.join(SITE, 'index.html'), 'w').write(html)
    ver = hashlib.sha1(html.encode()).hexdigest()[:10]
    manifest = {
        'name': NAME, 'short_name': SHORT, 'description': DESC, 'id': './', 'start_url': './', 'scope': './',
        'display': 'standalone', 'display_override': ['standalone', 'fullscreen'], 'orientation': 'any',
        'background_color': BG, 'theme_color': BG, 'categories': ['games', 'entertainment'],
        'icons': [
            {'src': 'icons/icon-192.png', 'sizes': '192x192', 'type': 'image/png', 'purpose': 'any'},
            {'src': 'icons/icon-512.png', 'sizes': '512x512', 'type': 'image/png', 'purpose': 'any'},
            {'src': 'icons/icon-maskable-512.png', 'sizes': '512x512', 'type': 'image/png', 'purpose': 'maskable'},
        ],
    }
    json.dump(manifest, open(os.path.join(SITE, 'manifest.webmanifest'), 'w'), indent=1)
    sw = open(os.path.join(here, 'sw.template.js')).read().replace('__VERSION__', ver).replace('__VOICES__', vsum.hexdigest()[:10])
    open(os.path.join(SITE, 'sw.js'), 'w').write(sw)
    open(os.path.join(SITE, '.nojekyll'), 'w').write('')
    if domain:
        open(os.path.join(SITE, 'CNAME'), 'w').write(domain + '\n')
    total = sum(os.path.getsize(os.path.join(d, f)) for d, _, fs in os.walk(SITE) for f in fs)
    print(f'built site/ ({round(total / 1048576, 1)} MB): web app {ver}, voices {vsum.hexdigest()[:10]}' + (f', domain {domain}' if domain else '') + (f', url {url}' if url else ''))
