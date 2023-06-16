const cacheFiles = ['../index.html', 'index.js'];
const cacheName = 'v1';
self.addEventListener('install', () => {
  caches.open(cacheName).then(cache => cache.addAll(cacheFiles));
});
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(function(resp) {
      return resp || fetch(event.request).then(function(response) {
        return response;
      });
    }).catch(function() {
      return caches.match('images/logo.png');
    }));
});
