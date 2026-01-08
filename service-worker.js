const CACHE = "dubai-back-again-safe-v11-tools-pages";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => (k === CACHE ? null : caches.delete(k))))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  event.respondWith(
    caches.match(req).then((cached) => {
      return cached || fetch(req).then((resp) => {
        // cache same-origin GET
        try{
          const url = new URL(req.url);
          if (req.method === "GET" && url.origin === self.location.origin){
            const copy = resp.clone();
            caches.open(CACHE).then(cache => cache.put(req, copy));
          }
        }catch(e){}
        return resp;
      }).catch(() => cached);
    })
  );
});
