window.populateCache = function() {
  caches.open('test').then((cache) => {
    return cache.put('key', new Response('hello world'));
  }).then(() => {
    console.log('cache populated');
  });
}

window.readCache = function () {
  caches.open('test').then((cache) => {
    if (cache) {
      return cache.keys().then((keys) => {
        console.log('cache keys', keys);
      });
    } else {
      console.log('Cache empty');
    }
  }).catch(() => {
    console.log('cache read failed');
  });
}

window.logSwReg = function () {
  navigator.serviceWorker.getRegistration().then((r) => {
    console.log(r);
  }).catch((e) => {
    console.error(e);
  });
}