// H3xt0 PWA cache (teal build)
const CACHE_NAME = "h3xt0-pwa-v40";
const ASSETS = [
  "./",
  "./budget.html",
  "./manifest.webmanifest",
  "./sw.js",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/app-h3-cube-contrast-Hwhite.svg"
];

self.addEventListener("install", e=>{
  e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.map(k=>k!==CACHE_NAME?caches.delete(k):null))));
  self.clients.claim();
});

self.addEventListener("fetch", e=>{
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request).then(cached => cached ||
      fetch(e.request).then(r => {
        const copy = r.clone();
        caches.open(CACHE_NAME).then(c=>c.put(e.request, copy)).catch(()=>{});
        return r;
      }).catch(()=> cached)
    )
  );
});
