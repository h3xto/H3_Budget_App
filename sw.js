/* H³ Budget Tool — Service Worker (v23)
   Notes:
   • In budget.html register with: navigator.serviceWorker.register('sw.js?v=23')
   • We NEVER cache manifest or icons to avoid sticky icons on PWA/TWA.
*/
const CACHE_NAME = 'h3xt0-pwa-v23';

// Keep offline bundle tiny. (budget.html pulls inline CSS/JS.)
const CORE_ASSETS = [
  '/H3_Budget_App/budget.html'
];

// Anything here always goes to the network (no cache).
const NEVER_CACHE = [
  /\/manifest\.webmanifest(\?.*)?$/i,
  /\/icons\/.*\.(png|svg|ico)$/i,
  /apple-touch-icon.*\.png$/i
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(CORE_ASSETS))
      .catch(() => {})
  );
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // Never-cache list: always hit network
  if (NEVER_CACHE.some(rx => rx.test(url.pathname))) {
    event.respondWith(fetch(req));
    return;
  }

  // HTML navigations: network-first, fallback to cached budget.html
  const wantsHTML = req.mode === 'navigate' ||
                    (req.headers.get('accept') || '').includes('text/html');

  if (wantsHTML) {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(new Request(req, { cache: 'no-store' }));
        // Keep a fresh offline copy of budget.html if this is that page
        if (url.pathname.endsWith('/budget.html')) {
          const cache = await caches.open(CACHE_NAME);
          cache.put('/H3_Budget_App/budget.html', fresh.clone());
        }
        return fresh;
      } catch {
        const cache = await caches.open(CACHE_NAME);
        const cached = await cache.match('/H3_Budget_App/budget.html');
        return cached || new Response('Offline', { status: 503, headers: { 'Content-Type': 'text/plain' }});
      }
    })());
    return;
  }

  // Other GET requests: cache-first with network fallback (same-origin)
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const hit = await cache.match(req);
    if (hit) return hit;
    try {
      const resp = await fetch(req);
      if (resp.ok && url.origin === location.origin) {
        cache.put(req, resp.clone());
      }
      return resp;
    } catch {
      return new Response('', { status: 504 });
    }
  })());
});
