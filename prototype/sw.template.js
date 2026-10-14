// PLUMPY service worker: the game opens offline, and every voice file you've heard stays on the device.
// The page itself is checked online first (so updates arrive), everything else comes from the cache first.
const APP = 'plumpy-app-__VERSION__';
const VOICES = 'plumpy-voices-__VOICES__';
const FONTS = 'plumpy-fonts';
const SHELL = ['./', './manifest.webmanifest', './lib/matter.min.js', './icons/icon-192.png', './icons/icon-512.png', './icons/apple-touch-icon.png', './voices/core.json'];

self.addEventListener('install', (e) => {
  e.waitUntil((async () => {
    const c = await caches.open(APP);
    await c.addAll(SHELL.filter((u) => !u.startsWith('./voices/')));
    try { const v = await caches.open(VOICES); if (!(await v.match('./voices/core.json'))) await v.add('./voices/core.json'); } catch (err) { /* voices come later */ }
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k.startsWith('plumpy-') && ![APP, VOICES, FONTS].includes(k)) await caches.delete(k);
    await self.clients.claim();
  })());
});

async function fromCache(cacheName, req) {
  const c = await caches.open(cacheName);
  const hit = await c.match(req, { ignoreSearch: true });
  if (hit) return hit;
  const res = await fetch(req);
  if (res && (res.ok || res.type === 'opaque')) c.put(req, res.clone());
  return res;
}

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin === self.location.origin) {
    if (req.mode === 'navigate' || url.pathname.endsWith('/') || url.pathname.endsWith('/index.html')) {
      e.respondWith((async () => {   // online first, so a new version shows up; the saved copy when offline
        const c = await caches.open(APP);
        try { const res = await fetch(req); if (res && res.ok) c.put('./', res.clone()); return res; }
        catch (err) { return (await c.match('./')) || (await c.match(req, { ignoreSearch: true })) || Response.error(); }
      })());
      return;
    }
    if (url.pathname.includes('/voices/')) { e.respondWith(fromCache(VOICES, req)); return; }
    e.respondWith(fromCache(APP, req));
    return;
  }
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    e.respondWith((async () => {   // fonts: saved copy now, refreshed in the background
      const c = await caches.open(FONTS);
      const hit = await c.match(req);
      const net = fetch(req).then((res) => { if (res && (res.ok || res.type === 'opaque')) c.put(req, res.clone()); return res; }).catch(() => hit);
      return hit || net;
    })());
  }
});
