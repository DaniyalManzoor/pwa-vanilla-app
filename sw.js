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

//cache size limit fucntion
const limitCacheSize = (cacheName, size) => {
  caches.open(cacheName).then((cache) => {
    cache.keys().then((keys) => {
      if (keys.length > size) {
        cache.delete(key[0]).then(limitCacheSize(name, size));
      }
    });
  });
};

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
              limitCacheSize(dynamicCacheName, 15);
              return fetchRes;
            });
          })
        );
      })
      .catch(() => {
        if (evt.request.url.indexOf(".html") > -1) {
          return caches.match("/fallback.html");
        }
      })
  );
});
