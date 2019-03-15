
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

  const simulateWork = new Promise(function(resolve) {
    const logging = setInterval(function() {
      console.log('Simluate SW work');
    }, 1000);
    setTimeout(() => {
      clearInterval(logging);
      resolve();
    }, 60 * 1000);
  });

  e.waitUntil(simulateWork);
});