importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

self.skipWaiting()

if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`);

  workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);

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
    },
    "GET", "POST"
  );

  workbox.routing.registerRoute(
    new RegExp('img\/(.*)'),
    new workbox.strategies.CacheFirst({
      cacheName: 'images-cache',
      plugins: [
        new workbox.expiration.CacheExpiration({
          maxEntries: 50,
          maxAgeSeconds: 15 * 24 * 60 * 60, // 15 Days
        })
      ]
    })
  );

  workbox.routing.registerRoute(
    /src\/(.*)\.(html|js)$/,
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

// self.addEventListener("fetch", (e)=>{
//   e.re
// })