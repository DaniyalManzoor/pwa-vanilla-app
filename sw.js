//install services worker
self.addEventListener("install", (evt) => {
  console.log("services worker has been installed", evt);
});

//activate event
self.addEventListener("activate", (evt) => {
  console.log("service worker has been activate", evt);
});

//fetch event
self.addEventListener("fetch", (evt) => {
  console.log("fetch Event", evt);
});
