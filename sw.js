const CACHE_NAME = 'wattwait-v1';
const ASSETS = [
    '/watt-wait/',
    '/watt-wait/index.html',
    '/watt-wait/manifest.json',
    '/watt-wait/icons/icon-192.png',
    '/watt-wait/icons/icon-512.png'
];

// Install - cache assets
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ASSETS))
            .then(() => self.skipWaiting())
    );
});

// Activate - clean old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch - serve from cache, fallback to network
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(cached => {
                if (cached) {
                    // Return cached but also update cache in background
                    event.waitUntil(
                        fetch(event.request)
                            .then(response => {
                                if (response.ok) {
                                    caches.open(CACHE_NAME)
                                        .then(cache => cache.put(event.request, response));
                                }
                            })
                            .catch(() => {})
                    );
                    return cached;
                }
                return fetch(event.request)
                    .then(response => {
                        if (response.ok && event.request.method === 'GET') {
                            const clone = response.clone();
                            caches.open(CACHE_NAME)
                                .then(cache => cache.put(event.request, clone));
                        }
                        return response;
                    });
            })
    );
});
