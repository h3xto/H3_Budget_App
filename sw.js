const CACHE_NAME = "h3xt0-pwa-v1";
const ASSETS = [
  "./budget.html",
  "./manifest.webmanifest",
  "./privacy.html",
  "./sw.js",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-180.png"
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
self.addEventListener("message", (e) => {
  if (e.data && e.data.type === "SKIP_WAITING") self.skipWaiting();
});
self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => {
      if (res) return res;
      return fetch(e.request)
        .then((net) => {
          const copy = net.clone();
          caches.open(CACHE_NAME).then((c) => c.put(e.request, copy)).catch(()=>{});
          return net;
        })
        .catch(() => {
          if (e.request.mode === "navigate") return caches.match("./budget.html");
        });
    })
  );
});
