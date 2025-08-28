// H3xt0 service worker — clean, cache-first
const CACHE_NAME = "h3xt0-pwa-v15";
const ASSETS = [
  "./budget.html",
  "./manifest.webmanifest",
  "./privacy.html",
  "./sw.js",
  "./icons/icon-180.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then((c) => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  e.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req)
        .then((net) => {
          const copy = net.clone();
          caches.open(CACHE_NAME).then((c) => c.put(req, copy)).catch(() => {});
          return net;
        })
        .catch(() => {
          if (req.mode === "navigate") return caches.match("./budget.html");
        });
    })
  );
});





