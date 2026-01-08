// ChordFlow Service Worker v12.0 - Network First
const CACHE_NAME = 'chordflow-v120';

// Only cache external libraries, not our own HTML
const ASSETS_TO_CACHE = [
  'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/tone/14.8.49/Tone.js'
];

// Install - cache only external assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing v12.0...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

// Activate - delete ALL old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating v12.0, clearing old caches...');
  event.waitUntil(
    caches.keys()
      .then((names) => Promise.all(
        names.filter(n => n !== CACHE_NAME).map(n => caches.delete(n))
      ))
      .then(() => self.clients.claim())
  );
});

// Fetch - NETWORK FIRST for HTML, cache for libraries
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  
  // Always go to network for HTML and API
  const url = new URL(event.request.url);
  if (url.pathname === '/' || url.pathname.endsWith('.html') || url.pathname.includes('/api/')) {
    event.respondWith(
      fetch(event.request)
        .catch(() => caches.match(event.request))
    );
    return;
  }
  
  // Cache-first for external libraries only
  if (event.request.url.includes('cdnjs.cloudflare.com') || event.request.url.includes('fonts.googleapis.com')) {
    event.respondWith(
      caches.match(event.request)
        .then(cached => cached || fetch(event.request))
    );
    return;
  }
  
  // Network-first for everything else
  event.respondWith(fetch(event.request));
});
