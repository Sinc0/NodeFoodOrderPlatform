//variables
// const cacheName = 'site-cache-v1'
// const assetsToCache = [
//     '/mobile.css',
//     '/icon.png',
//     '/',
//     '/restaurants',
// ]

//register
if('serviceWorker' in navigator)
{
    navigator.serviceWorker
    .register('/service-worker.js')
    .then((reg) => {
    // registration worked
        console.log('Registration succeeded. Scope is ' + reg.scope);
    })
}

//activate
self.addEventListener('install', ( event ) => {
    self.skipWaiting();

    // event.waitUntil(  
    //     caches.open(cacheName).then((cache) => {
    //           return cache.addAll(assetsToCache);
    //     })
    //   );
});