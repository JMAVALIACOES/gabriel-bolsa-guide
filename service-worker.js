const CACHE_NAME = 'gabriel-bolsa-v2';
const ASSETS_TO_CACHE = [
  '/gabriel-bolsa-guide/',
  '/gabriel-bolsa-guide/index.html',
  '/gabriel-bolsa-guide/manifest.json'
];

// Instalação do Service Worker
self.addEventListener('install', event => {
  console.log('Service Worker instalado');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Cache aberto, adicionando assets');
      return cache.addAll(ASSETS_TO_CACHE);
    }).catch(err => {
      console.error('Erro ao cachear assets:', err);
    })
  );
  self.skipWaiting();
});

// Ativação do Service Worker
self.addEventListener('activate', event => {
  console.log('Service Worker ativado');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deletando cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Estratégia de fetch: Network First, com fallback para Cache
self.addEventListener('fetch', event => {
  const { request } = event;

  // Ignorar requisições não-GET
  if (request.method !== 'GET') {
    return;
  }

  event.respondWith(
    fetch(request).then(response => {
      // Não cachear respostas inválidas
      if (!response || response.status !== 200 || response.type === 'error') {
        return response;
      }

      // Clonar e atualizar cache
      const responseToCache = response.clone();
      caches.open(CACHE_NAME).then(cache => {
        cache.put(request, responseToCache);
      });

      return response;
    }).catch(err => {
      console.error('Erro de fetch, servindo do cache:', err);
      return caches.match(request).then(cachedResponse => {
        return cachedResponse || caches.match('/gabriel-bolsa-guide/index.html');
      });
    })
  );
});

// Sincronização em background (opcional)
self.addEventListener('sync', event => {
  if (event.tag === 'sync-guia') {
    console.log('Sincronizando guia...');
  }
});

// Notificações push (opcional)
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : 'Nova atualização disponível!',
    icon: '/gabriel-bolsa-guide/data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"><rect fill="%230a0e17" width="192" height="192"/><text x="50%" y="50%" font-size="80" font-weight="bold" fill="%2310b981" text-anchor="middle" dy=".3em">G</text></svg>',
    badge: '/gabriel-bolsa-guide/data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><text x="48" y="60" font-size="60" text-anchor="middle">📈</text></svg>',
    tag: 'gabriel-bolsa-notification',
    requireInteraction: false
  };

  event.waitUntil(
    self.registration.showNotification('Gabriel - Bolsa de Valores', options)
  );
});

// Clique em notificação
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(clientList => {
      for (let client of clientList) {
        if (client.url === '/gabriel-bolsa-guide/' && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/gabriel-bolsa-guide/');
      }
    })
  );
});
