
self.addEventListener('install', () => {
  return self.skipWaiting();
});


self.addEventListener('activate', (e) => {
  e.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (url.pathname === '/sw-page') {
    e.respondWith(fetch('/'));
  } else {
    e.respondWith(fetch(e.request));
  }
});