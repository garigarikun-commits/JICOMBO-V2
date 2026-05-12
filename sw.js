const CACHE_NAME = "jicombo-v260";
const ASSETS = [
  "./",
  "./index.html",
  "./index.html?v=100",
  "./manifest.webmanifest",
  "./manifest.webmanifest?v=100",
  "./Assets/Jicombo-logo.png",
  "./Jicombo-icon.png",
  "./Assets/Sons/birthday.mp3"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  if (event.request.mode === "navigate") {
    event.respondWith(fetch(event.request).catch(() => caches.match("./index.html?v=100") || caches.match("./index.html")));
    return;
  }
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request).then((response) => {
      const clone = response.clone();
      caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
      return response;
    }).catch(() => caches.match("./index.html?v=100") || caches.match("./index.html")))
  );
});
