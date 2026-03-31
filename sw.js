const CACHE_NAAM = 'skincontext-v21';

const PRECACHE_URLS = [
    '/',
    '/index.html',
    '/detail.html',
    '/offline.html',
    '/css/style.css',
    '/script/ui.js',
    '/script/script.js',
    '/script/viewer.js',
    '/script/wapen-info.js',
    '/script/worker-wikidata.js',
    '/script/webmention.js',
    '/script/skins.js',
    '/data/wapens.ttl',
    '/manifest.json',
    '/img/logo.png',
    '/img/slideshow_1.jpg',
    '/img/slideshow_2.jpg',
    '/img/slideshow_3.jpg',
    '/img/slideshow_4.jpg',
];

self.addEventListener('install', e => {
    console.log('Service Worker: Installed');
    e.waitUntil(
        caches.open(CACHE_NAAM)
            .then(cache => Promise.allSettled(PRECACHE_URLS.map(url => cache.add(url))))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', e => {
    console.log('Service Worker: Activated');
    e.waitUntil(
        caches.keys()
            .then(namen => Promise.all(namen.filter(n => n !== CACHE_NAAM).map(n => caches.delete(n))))
            .then(() => self.clients.claim())
    );
});

self.addEventListener('message', e => {
    if (e.data?.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', e => {
    if (e.request.method !== 'GET') return;
    if (!e.request.url.startsWith(self.location.origin)) return;
    console.log('Service Worker: Fetching');

    if (e.request.mode === 'navigate') {
        e.respondWith(
            caches.match(e.request)
                .then(cached => cached || fetch(e.request))
                .catch(() => caches.match('/offline.html'))
        );
        return;
    }

    e.respondWith(
        caches.match(e.request).then(cached => cached || fetch(e.request))
    );
});
