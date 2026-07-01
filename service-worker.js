/* Service worker for offline caching (active only when served over http/https).
   The app also works fully offline from file:// because all assets are local. */
var CACHE = "iisc-exam-master-v2";
var ASSETS = [
  "index.html",
  "manifest.webmanifest",
  "assets/css/styles.css",
  "assets/js/app.js",
  "assets/js/srs.js",
  "assets/js/ai.js",
  "assets/js/palette.js",
  "assets/images/icon.svg",
  "data/exams.js",
  "data/content.js",
  "data/flashcards.js",
  "data/glossary.js",
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
/* Stale-while-revalidate: serve from cache instantly (offline-capable), but fetch a
   fresh copy in the background and update the cache — so content/question-bank updates
   propagate on the next load without needing a cache-version bump. */
self.addEventListener("fetch", function (e) {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.open(CACHE).then(function (cache) {
      return cache.match(e.request).then(function (cached) {
        var network = fetch(e.request).then(function (resp) {
          if (resp && resp.status === 200 && e.request.url.indexOf("http") === 0) cache.put(e.request, resp.clone());
          return resp;
        }).catch(function () { return cached; });
        return cached || network;
      });
    })
  );
});
