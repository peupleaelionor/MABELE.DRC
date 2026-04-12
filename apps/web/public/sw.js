// ─── MABELE Service Worker ────────────────────────────────────────────────────
// Minimal offline-first service worker for PWA installability.
// Caches shell + static assets; falls back to network for API calls.

const CACHE_NAME = 'mabele-v1'
const STATIC_ASSETS = [
  '/',
  '/favicon.svg',
  '/logo.svg',
  '/manifest.json',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Never cache API or auth calls
  if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/auth/')) {
    return
  }

  // Network-first for navigation, cache-first for static
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => caches.match('/'))
    )
    return
  }

  event.respondWith(
    caches.match(request).then((cached) => cached ?? fetch(request))
  )
})
