// Service Worker for TeachBid PWA

const CACHE_NAME = 'teachbid-v1'
const STATIC_CACHE_URLS = [
  '/',
  '/login',
  '/register',
  '/categories',
  '/how-it-works',
  '/pricing',
  '/manifest.json',
  '/favicon.ico',
]

const DYNAMIC_CACHE_URLS = [
  '/dashboard',
  '/search',
  '/teachers',
  '/notifications',
]

// Install event - cache static assets
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...')
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching static assets')
        return cache.addAll(STATIC_CACHE_URLS)
      })
      .then(() => {
        console.log('Service Worker: Installation complete')
        return self.skipWaiting()
      })
      .catch(error => {
        console.error('Service Worker: Installation failed', error)
      })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker: Activating...')
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME) {
              console.log('Service Worker: Deleting old cache', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      })
      .then(() => {
        console.log('Service Worker: Activation complete')
        return self.clients.claim()
      })
  )
})

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  const { request } = event
  const url = new URL(request.url)
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return
  }
  
  // Skip external requests
  if (url.origin !== location.origin) {
    return
  }
  
  // Skip API requests (except for offline fallback)
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .catch(() => {
          // Return offline fallback for failed API requests
          return new Response(
            JSON.stringify({ error: 'Offline', message: 'インターネット接続を確認してください' }),
            {
              status: 503,
              statusText: 'Service Unavailable',
              headers: { 'Content-Type': 'application/json' }
            }
          )
        })
    )
    return
  }
  
  event.respondWith(
    caches.match(request)
      .then(response => {
        // Return cached version if available
        if (response) {
          console.log('Service Worker: Serving from cache', request.url)
          return response
        }
        
        // Otherwise fetch from network
        console.log('Service Worker: Fetching from network', request.url)
        return fetch(request)
          .then(response => {
            // Don't cache if not successful
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response
            }
            
            // Clone the response
            const responseToCache = response.clone()
            
            // Cache dynamic content
            if (shouldCacheDynamically(url.pathname)) {
              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(request, responseToCache)
                })
            }
            
            return response
          })
          .catch(error => {
            console.error('Service Worker: Fetch failed', error)
            
            // Return offline fallback page
            if (request.headers.get('accept').includes('text/html')) {
              return caches.match('/offline.html') || 
                     new Response('オフラインです。インターネット接続を確認してください。', {
                       status: 503,
                       statusText: 'Service Unavailable',
                       headers: { 'Content-Type': 'text/html; charset=utf-8' }
                     })
            }
            
            throw error
          })
      })
  )
})

// Background sync for offline actions
self.addEventListener('sync', event => {
  console.log('Service Worker: Background sync', event.tag)
  
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync())
  }
})

// Push notifications
self.addEventListener('push', event => {
  console.log('Service Worker: Push received')
  
  let data = {}
  try {
    data = event.data ? event.data.json() : {}
  } catch (e) {
    console.error('Service Worker: Push data parsing failed', e)
  }
  
  const options = {
    body: data.message || '新しい通知があります',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    data: {
      url: data.url || '/',
      timestamp: Date.now()
    },
    actions: [
      {
        action: 'open',
        title: '開く',
        icon: '/icon-192.png'
      },
      {
        action: 'close',
        title: '閉じる'
      }
    ],
    tag: data.tag || 'default',
    renotify: true,
    requireInteraction: false
  }
  
  event.waitUntil(
    self.registration.showNotification(data.title || 'TeachBid', options)
  )
})

// Notification click handler
self.addEventListener('notificationclick', event => {
  console.log('Service Worker: Notification clicked', event.action)
  
  event.notification.close()
  
  if (event.action === 'close') {
    return
  }
  
  const urlToOpen = event.notification.data?.url || '/'
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(clientList => {
        // Check if there's already a window/tab open with the target URL
        for (const client of clientList) {
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus()
          }
        }
        
        // If no existing window, open a new one
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen)
        }
      })
  )
})

// Helper functions
function shouldCacheDynamically(pathname) {
  return DYNAMIC_CACHE_URLS.some(url => pathname.startsWith(url))
}

async function doBackgroundSync() {
  try {
    // Sync offline actions (e.g., failed requests, cached form submissions)
    console.log('Service Worker: Performing background sync')
    
    // Get cached offline actions
    const cache = await caches.open('offline-actions')
    const requests = await cache.keys()
    
    for (const request of requests) {
      try {
        // Retry the request
        const response = await fetch(request)
        if (response.ok) {
          // Remove from offline cache if successful
          await cache.delete(request)
          console.log('Service Worker: Offline action synced', request.url)
        }
      } catch (error) {
        console.error('Service Worker: Sync failed for', request.url, error)
      }
    }
  } catch (error) {
    console.error('Service Worker: Background sync failed', error)
  }
}

// Message handler for communication with main thread
self.addEventListener('message', event => {
  console.log('Service Worker: Message received', event.data)
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME })
  }
})