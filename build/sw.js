importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`);

  workbox.precaching.precacheAndRoute([{"revision":"caddc2340a051a47b618d4dbfefd78c6","url":"css/forecast.css"},{"revision":"7e6b3c55d1d330ff85cb83283b6b8477","url":"css/offline.css"},{"revision":"c7290d128158008850f5ea5e4368e840","url":"css/pop.css"},{"revision":"17027bf04b511c3e32ac9c8f6e9c617d","url":"css/style.css"},{"revision":"a6156bece38d2ad6dfd4379e199c3531","url":"favicon.png"},{"revision":"d97dc6d8672b4da93b8b7743a1942fde","url":"icon/maskable_icon-144.png"},{"revision":"7a7a17dbd1760fdaa30d7eff34bd7624","url":"icon/maskable_icon-192.png"},{"revision":"aa5c066882ca702f747824f2a6c2ebe9","url":"icon/maskable_icon-512.png"},{"revision":"6301a73f2aa8ff002b1f85c02111a126","url":"img/bg3d.jpg"},{"revision":"4f7c1bc7a5ef17130016be5b6964cdea","url":"img/clear.png"},{"revision":"4bf7c42cf50360b13ae514b1b00aadf5","url":"img/clouds.png"},{"revision":"8d5278930f098e36f8e9c351f732209f","url":"img/haze.png"},{"revision":"ae7ef1d8f209071bdaab1d8ab360d446","url":"img/offline.png"},{"revision":"d27a6c13c6adc76302b412905972c133","url":"img/rain.png"},{"revision":"3b6aede5a66a48a9824bc1e541649f12","url":"img/snow.png"},{"revision":"e44cc24fde43b603df14002340f21c18","url":"img/thunder storm.jpg"},{"revision":"a8822b5e9b5eb4e53657ace618966ca6","url":"index.html"},{"revision":"58f89233e1e4ab14cf576787af19b7b4","url":"js/app.js"},{"revision":"7078ee2b0a124555862e803b7dcbda47","url":"js/forecast.js"},{"revision":"6a20ee3046ee6739774c1f652590273a","url":"js/getforecast.js"},{"revision":"8b1c6bb88f827bf587d9209510c58a74","url":"js/main.js"},{"revision":"7eef3e9dc5066a0cdb7d6d2dcb150929","url":"js/network.js"},{"revision":"f10f10368bb1407fe7a0b392952ee5ab","url":"js/particles.js"},{"revision":"c0f8984a3f190a170534a5580ceb97f5","url":"js/pop.js"},{"revision":"de3c63f289920356fdd118a9d74543bc","url":"js/app/app.js"},{"revision":"f10f10368bb1407fe7a0b392952ee5ab","url":"js/app/particles.js"},{"revision":"1a6cf0261a93d2c998c813d5588856bb","url":"pages/404.html"},{"revision":"06d571334fbcabe4deb183784f000ede","url":"pages/forecast.html"},{"revision":"f6b0487301cb813e16958f045c32c982","url":"pages/offline.html"}]);

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