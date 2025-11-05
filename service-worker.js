// Service Worker para PWA - NGT Server
const CACHE_NAME = 'ngt-server-v1';
const urlsToCache = [
  '/index.html',
  '/styles.css',
  '/language.js',
  '/favicon.png',
  '/logo.png',
  '/discord.png',
  '/waypoint.png',
  '/players-icon.png',
  '/fractals.html',
  '/strikes.html',
  '/raids.html',
  '/meta-events.html',
  '/meta-events-advanced.js',
  '/gw2-timer-raw.json',
  '/languages/pt.json',
  '/languages/en.json',
  '/languages/es.json'
];

// Instalação do Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache aberto');
        return cache.addAll(urlsToCache);
      })
  );
});

// Ativação do Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Removendo cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Interceptação de requisições
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Retorna do cache se disponível, senão faz fetch
        if (response) {
          return response;
        }
        return fetch(event.request).then(
          (response) => {
            // Verifica se é uma resposta válida
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clona a resposta
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
  );
});
