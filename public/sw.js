const CACHE_NAME = 'cleanslate-v1.0.0';

self.addEventListener('install', (event) => {
  console.log('CleanSlate SW: Installing...');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('CleanSlate SW: Activating...');
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Basic fetch handling - cache and network strategy
  if (event.request.method === 'GET') {
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          return response || fetch(event.request);
        })
        .catch(() => {
          // Return cached index for navigation requests when offline
          if (event.request.destination === 'document') {
            return caches.match('/');
          }
        })
    );
  }
});

console.log('CleanSlate SW: Service Worker loaded');
