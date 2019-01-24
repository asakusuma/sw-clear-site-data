const version = '{{VERSION}}';

/*
self.addEventListener('install', () => {
  return self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(self.clients.claim());
});
*/

function injectVersion(request) {
  return request.then((response) => {
    if (response && response.ok) {
      return response.text().then((text) => {
        return new Response(text.replace('From the server', `From service worker version ${version}`), {
          headers: {
            'Content-Type': 'text/html'
          }
        });
      });
    }
    return response;
  });
}

function handleRequest(pathname, req) {
  const fetched = fetch(req);
  if (pathname === '/') {
    return injectVersion(fetched);
  }
  return fetched;
}

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (url.pathname === '/sw-page') {
    e.respondWith(injectVersion(fetch('/')));
  } else {
    e.respondWith(handleRequest(url.pathname, e.request));
  }
});