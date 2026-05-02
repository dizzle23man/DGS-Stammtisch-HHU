/* ===================================================
   DGS Stammtisch Hamburg – Service Worker
   =================================================== */

const CACHE_NAME = 'dgs-hh-v1';

const PRECACHE = [
  '/',
  '/index.html',
  '/style.css',
  '/app.js',
  '/manifest.json',
  '/icons/icon-192.svg',
  '/icons/icon-512.svg',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
  'https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap'
];

// Beim Installieren: alle statischen Assets cachen
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

// Alte Caches beim Aktivieren aufräumen
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch: Cache-first für eigene Assets, Network-first für Karten/Maps
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Google Maps & Tile-Server: immer vom Netz (kein Cache)
  if (
    url.hostname.includes('google.com') ||
    url.hostname.includes('tile.openstreetmap.org') ||
    url.hostname.includes('googleapis.com')
  ) {
    event.respondWith(fetch(event.request).catch(() => new Response('', { status: 503 })));
    return;
  }

  // Alles andere: Cache-first, Netz als Fallback
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (!response || response.status !== 200 || response.type === 'opaque') {
          return response;
        }
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      });
    })
  );
});
