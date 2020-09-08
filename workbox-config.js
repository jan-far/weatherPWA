module.exports = {
  "globDirectory": "build/",
  "globPatterns": [
    "**/*.{jpg,css,png}",
    "index.html",
    "js/*",
    "pages/offline.html",
    "pages/404.html"
  ],
  "swDest": "build/sw.js",
  "swSrc": "src/sw.js",
  "globIgnores": [
    "../workbox-config.js"
  ]
};