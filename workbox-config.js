module.exports = {
  "globDirectory": "build/",
  "globPatterns": [
    "**/*.{jpg,css,png}",
    "index.html",
    "js/*",
    "pages/*"
  ],
  "swDest": "build/sw.js",
  "swSrc": "src/sw.js",
  "globIgnores": [
    "../workbox-config.js"
  ]
};