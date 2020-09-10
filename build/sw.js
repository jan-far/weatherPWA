importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

self.skipWaiting()

if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`);

  workbox.precaching.precacheAndRoute([{"revision":"23879637a29cad4e1ea8a14cecdb9b07","url":"css/forecast.css"},{"revision":"64377f51f97e19a47ab083d8b5b1bc45","url":"css/offline.css"},{"revision":"c7290d128158008850f5ea5e4368e840","url":"css/pop.css"},{"revision":"582f699a8debe38b728c2863ba79a545","url":"css/style.css"},{"revision":"a6156bece38d2ad6dfd4379e199c3531","url":"favicon.png"},{"revision":"7a7a17dbd1760fdaa30d7eff34bd7624","url":"icon/maskable_icon-192.png"},{"revision":"aa5c066882ca702f747824f2a6c2ebe9","url":"icon/maskable_icon-512.png"},{"revision":"6301a73f2aa8ff002b1f85c02111a126","url":"img/bg3d.jpg"},{"revision":"4f7c1bc7a5ef17130016be5b6964cdea","url":"img/clear.png"},{"revision":"4bf7c42cf50360b13ae514b1b00aadf5","url":"img/clouds.png"},{"revision":"8d5278930f098e36f8e9c351f732209f","url":"img/haze.png"},{"revision":"ae7ef1d8f209071bdaab1d8ab360d446","url":"img/offline.png"},{"revision":"d27a6c13c6adc76302b412905972c133","url":"img/rain.png"},{"revision":"3b6aede5a66a48a9824bc1e541649f12","url":"img/snow.png"},{"revision":"e44cc24fde43b603df14002340f21c18","url":"img/thunder storm.jpg"},{"revision":"cd158fd28ac1f610fdbd083710dabd84","url":"index.html"},{"revision":"58f89233e1e4ab14cf576787af19b7b4","url":"js/app.js"},{"revision":"06313ff79f5fd506f610c6ccd708a74f","url":"js/forecast.js"},{"revision":"82549c0c0488b71769cbd7d530b4c1a9","url":"js/main.js"},{"revision":"9f1bc67d5863c5173d2621a1e3660804","url":"js/network.js"},{"revision":"f10f10368bb1407fe7a0b392952ee5ab","url":"js/particles.js"},{"revision":"c0f8984a3f190a170534a5580ceb97f5","url":"js/pop.js"},{"revision":"1a6cf0261a93d2c998c813d5588856bb","url":"pages/404.html"},{"revision":"c8325e47f4f4f461fc2bc42c9ba0a5ca","url":"pages/forecast.html"},{"revision":"f6b0487301cb813e16958f045c32c982","url":"pages/offline.html"}]);

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