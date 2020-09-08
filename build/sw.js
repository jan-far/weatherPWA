importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`);

  workbox.precaching.precacheAndRoute([{"revision":"96d8a4e935f8eb7426c1516473a6a384","url":"css/forecast.css"},{"revision":"64377f51f97e19a47ab083d8b5b1bc45","url":"css/offline.css"},{"revision":"c7290d128158008850f5ea5e4368e840","url":"css/pop.css"},{"revision":"b2652b46e8a462b119a9c168917942f1","url":"css/style.css"},{"revision":"a6156bece38d2ad6dfd4379e199c3531","url":"favicon.png"},{"revision":"7a7a17dbd1760fdaa30d7eff34bd7624","url":"icon/maskable_icon-192.png"},{"revision":"aa5c066882ca702f747824f2a6c2ebe9","url":"icon/maskable_icon-512.png"},{"revision":"bca56ac8940e4eac1ae003e3e002e6ae","url":"img/bk.jpg"},{"revision":"4f7c1bc7a5ef17130016be5b6964cdea","url":"img/clear.png"},{"revision":"4bf7c42cf50360b13ae514b1b00aadf5","url":"img/clouds.png"},{"revision":"8d5278930f098e36f8e9c351f732209f","url":"img/haze.png"},{"revision":"ae7ef1d8f209071bdaab1d8ab360d446","url":"img/offline.png"},{"revision":"d27a6c13c6adc76302b412905972c133","url":"img/rain.png"},{"revision":"3b6aede5a66a48a9824bc1e541649f12","url":"img/snow.png"},{"revision":"e44cc24fde43b603df14002340f21c18","url":"img/thunder storm.jpg"},{"revision":"3055bb33b9e5d7ddbcb3f368ccbd649e","url":"index.html"},{"revision":"437a95a8a6bf377c3008157ba35d040b","url":"js/forecast.js"},{"revision":"6eceb4092f137143f489f496334f3304","url":"js/main.js"},{"revision":"9f1bc67d5863c5173d2621a1e3660804","url":"js/network.js"},{"revision":"c0f8984a3f190a170534a5580ceb97f5","url":"js/pop.js"},{"revision":"f6b0487301cb813e16958f045c32c982","url":"pages/offline.html"},{"revision":"1a6cf0261a93d2c998c813d5588856bb","url":"pages/404.html"}]);

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
    "GET"
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