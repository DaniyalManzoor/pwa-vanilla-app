const staticCacheName = "site-static";
const assets = [
  "/",
  "/index.html",
  "/main.js",
  "style.css",
  //"logo.png"
  "https://fonts.googlepis.com/icon?family=Material+Icon",
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
  console.log("service worker has been activate", evt);
});

//fetch event
self.addEventListener("fetch", (evt) => {
  console.log("fetch Event", evt);
});
