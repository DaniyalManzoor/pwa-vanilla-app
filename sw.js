const staticCacheName = "site-static-v1";
const dynamicCacheName = "dynamic-site-v1";
const assets = [
  "/",
  "/index.html",
  "/main.js",
  "/style.css",
  "/fallback.html",
  //"logo.png"
  //"https://fonts.googlepis.com/icon?family=Material+Icon",
];

//install services worker
self.addEventListener("install", (evt) => {
  //console.log("services worker has been installed", evt);
  evt.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      cache.addAll(assets);
    })
  );
});

//activate event
self.addEventListener("activate", (evt) => {
  //console.log("service worker has been activate", evt);
  evt.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== staticCacheName && key !== dynamicCacheName)
          .map((key) => caches.delete(key))
      );
    })
  );
});

//fetch event
self.addEventListener("fetch", (evt) => {
  // console.log("fetch Event", evt);
  evt.respondWith(
    caches
      .match(evt.request)
      .then((cacheRes) => {
        return (
          cacheRes ||
          fetch(evt.request).then((fetchRes) => {
            return caches.open(dynamicCacheName).then((cache) => {
              cache.put(evt.request.url, fetchRes.clone());
              return fetchRes;
            });
          })
        );
      })
      .catch(() => caches.match("/fallback.html"))
  );
});
