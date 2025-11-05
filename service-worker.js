// Service Worker para PWA - NGT Server
const CACHE_NAME = 'ngt-server-v2';
const urlsToCache = [
  './index.html',
  './styles.css',
  './language.js',
  './favicon.png',
  './logo.png',
  './discord.png',
  './waypoint.png',
  './players-icon.png',
  './fractals.html',
  './strikes.html',
  './raids.html',
  './meta-events.html',
  './meta-events-advanced.js',
  './gw2-timer-raw.json',
  './languages/pt.json',
  './languages/en.json',
  './languages/es.json',
  './footer.html'
];

// Instalação do Service Worker
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching essential files');
        // Cache arquivos um por um para evitar falha total
        return Promise.allSettled(
          urlsToCache.map(url => 
            cache.add(url).catch(err => console.log('[Service Worker] Failed to cache:', url))
          )
        );
      })
      .then(() => self.skipWaiting())
  );
});

// Ativação do Service Worker
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Interceptação de requisições - Network First, Cache Fallback
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Se conseguiu buscar da rede, atualiza o cache
        if (response && response.status === 200) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        // Se falhou na rede, tenta o cache
        return caches.match(event.request).then((response) => {
          if (response) {
            return response;
          }
          // Se não está no cache, retorna página offline customizada ou erro
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
        });
      })
  );
});
