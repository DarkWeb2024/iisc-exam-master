/* Service worker for offline caching (active only when served over http/https).
   The app also works fully offline from file:// because all assets are local. */
var CACHE = "iisc-exam-master-v1";
var ASSETS = [
  "index.html",
  "manifest.webmanifest",
  "assets/css/styles.css",
  "assets/js/app.js",
  "assets/images/icon.svg",
  "data/content.js",
  "data/questions/computer.js",
  "data/questions/general_awareness.js",
  "data/questions/quantitative.js",
  "data/questions/reasoning.js",
  "data/questions/verbal.js"
];
self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(ASSETS); }).then(function(){ return self.skipWaiting(); }));
});
self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.map(function (k) { if (k !== CACHE) return caches.delete(k); }));
  }).then(function(){ return self.clients.claim(); }));
});
self.addEventListener("fetch", function (e) {
  e.respondWith(caches.match(e.request).then(function (r) { return r || fetch(e.request); }));
});
