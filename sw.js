const CACHE_NAME = "cat-health-app-ultimate-v30000";

const urlsToCache = [
"./",
"./index.html",
"./manifest.json",
"./sw.js"
];

self.addEventListener("install", event => {
event.waitUntil(
caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
);
self.skipWaiting();
});

self.addEventListener("activate", event => {
event.waitUntil(
caches.keys().then(keys =>
Promise.all(
keys.map(key => {
if (key !== CACHE_NAME) {
return caches.delete(key);
}
})
)
)
);
self.clients.claim();
});

self.addEventListener("fetch", event => {
event.respondWith(
fetch(event.request)
.then(response => {
const responseClone = response.clone();
caches.open(CACHE_NAME).then(cache => {
cache.put(event.request, responseClone);
});
return response;
})
.catch(() =>
caches.match(event.request).then(cached => cached || caches.match("./index.html"))
)
);
});
