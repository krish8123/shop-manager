/* Simple service worker so the app is installable and loads fast.
   Network-first for API calls, cache-first for the app shell. */
const CACHE = 'shop-manager-v2';
const SHELL = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png'];

self.addEventListener('install', e=>{
  e.waitUntil(caches.open(CACHE).then(c=> c.addAll(SHELL)).catch(()=>{}));
  self.skipWaiting();
});
self.addEventListener('activate', e=>{
  e.waitUntil(caches.keys().then(keys=> Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e=>{
  const url = new URL(e.request.url);
  // never cache API or image endpoints — always go to network
  if(url.pathname.startsWith('/api/') || url.pathname.startsWith('/img/')){
    e.respondWith(fetch(e.request).catch(()=> new Response(JSON.stringify({error:'offline'}), {headers:{'Content-Type':'application/json'}})));
    return;
  }
  // app shell: cache first, fall back to network
  e.respondWith(
    caches.match(e.request).then(hit=> hit || fetch(e.request).then(resp=>{
      const copy = resp.clone();
      caches.open(CACHE).then(c=> c.put(e.request, copy)).catch(()=>{});
      return resp;
    }).catch(()=> caches.match('./index.html')))
  );
});
