const CACHE_NAME = 'subway-v2'; // Incremented version forces phones to discard the old cache
const ASSETS = [
  'index.html',
  'manifest.json',
  'map.svg',
  'icon.png',
  'https://jsdelivr.net',
  'https://cloudflare.com'
];

// Installs and locks in all required layout assets
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting()) // Forces immediate activation
  );
});

// Cleans up old caches (wipes out subway-v1 automatically)
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Network-first falling back to cache strategy to guarantee live updates work
self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request).catch(() => {
      return caches.match(e.request);
    })
  );
});
