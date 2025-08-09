// CleanSlate PWA Service Worker
const CACHE_NAME = 'cleanslate-v1.0.0';
const urlsToCache = [
  '/',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  // Add other static assets as needed
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  console.log('CleanSlate SW: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('CleanSlate SW: Caching app shell');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('CleanSlate SW: Installation complete');
        // Skip waiting to activate immediately
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('CleanSlate SW: Installation failed', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('CleanSlate SW: Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('CleanSlate SW: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('CleanSlate SW: Activation complete');
      // Take control of all clients immediately
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip external requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Return cached version if available
        if (cachedResponse) {
          console.log('CleanSlate SW: Serving from cache:', event.request.url);
          return cachedResponse;
        }

        // Otherwise fetch from network
        console.log('CleanSlate SW: Fetching from network:', event.request.url);
        return fetch(event.request).then((response) => {
          // Don't cache non-successful responses
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response
          const responseToCache = response.clone();

          // Add to cache for future use
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });

          return response;
        }).catch((error) => {
          console.error('CleanSlate SW: Fetch failed:', error);
          
          // Return offline page for navigation requests
          if (event.request.destination === 'document') {
            return caches.match('/');
          }
          
          // For other requests, just let them fail
          throw error;
        });
      })
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('CleanSlate SW: Background sync triggered');
    event.waitUntil(
      // Sync any pending subscription changes, email unsubscribes, etc.
      syncPendingActions()
    );
  }
});

// Push notifications
self.addEventListener('push', (event) => {
  console.log('CleanSlate SW: Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'You have new savings opportunities!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Dashboard',
        icon: '/icons/action-view.png'
      },
      {
        action: 'close',
        title: 'Dismiss',
        icon: '/icons/action-close.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('CleanSlate', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('CleanSlate SW: Notification clicked');
  event.notification.close();

  if (event.action === 'explore') {
    // Open the app to dashboard
    event.waitUntil(
      clients.openWindow('/?tab=dashboard&source=notification')
    );
  } else if (event.action === 'close') {
    // Just close the notification
    return;
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Helper function to sync pending actions
async function syncPendingActions() {
  try {
    // This would sync any offline actions when back online
    // For now, just log that sync is happening
    console.log('CleanSlate SW: Syncing pending actions...');
    
    // In a real app, you'd:
    // 1. Get pe
