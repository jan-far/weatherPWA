importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`);

  workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);

    workbox.routing.registerRoute(
    /\//, new workbox.strategies.NetworkFirst({
      cacheName: "api-cache",
      plugins: [
      new workbox.expiration.CacheExpiration({
        maxEntries: 100,
      })
    ]
    })
  );

  const apiHandler = new workbox.strategies.NetworkFirst({
    cacheName: 'api-cache',
    plugins: [
      new workbox.expiration.CacheExpiration({
        maxEntries: 100,
      })
    ]
  });

  workbox.routing.registerRoute(/^(.*)api.openweathermap.org(.*)/, args => {
      return apiHandler.handle(args)
        .then(response => {
          if (!response) {
            console.log(response)
            return caches.match('pages/offline.html');
          }
          return response;
        })
        .catch(err => {
          if (err) {
            return caches.match('pages/404.html');
          }
        })
    }
  );

  workbox.routing.registerRoute(
    /src\/(.*)\.(html|js|json)$/,
    new workbox.strategies.CacheFirst({
      cacheName: 'pages-cache',
      plugins: [
        new workbox.expiration.CacheExpiration({
          maxEntries: 50,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
        })
      ]
    })
  );
} else {
  console.log(`Boo! Workbox didn't load 😬`);
}

self.addEventListener('message', function (event) {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});