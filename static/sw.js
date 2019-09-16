
self.addEventListener('install', async () => {
  const cache = await caches.open('static');
  const page = await fetch('/');
  await cache.put('page', page);
  return await self.skipWaiting();
});

async function useCache(req) {
  const cache = await caches.open('static');
  const cached = await caches.match('page');
  if (cached) {
    return cached;
  }
  return fetch(req);
}

self.addEventListener('activate', (e) => {
  e.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', async (e) => {
  const url = new URL(e.request.url);
  if (url.pathname === '/sw-page' || url.pathname === '/') {
    e.respondWith(useCache(e.request));
  } else {
    if (url.pathname === '/unregister') {
      e.waitUntil(self.registration.unregister());
    }
    e.respondWith(fetch(e.request));
  }
});