// ─── Service Worker Cache Manifest ────────────────────────────────────────────

// ─── Types ────────────────────────────────────────────────────────────────────

export type CacheStrategy =
  | 'CACHE_FIRST'
  | 'NETWORK_FIRST'
  | 'STALE_WHILE_REVALIDATE'
  | 'NETWORK_ONLY'
  | 'CACHE_ONLY'

export interface CacheRoute {
  pattern: string
  strategy: CacheStrategy
  cacheName?: string
  maxAge?: number
  maxEntries?: number
}

export interface PrecacheEntry {
  url: string
  revision: string
}

export interface CacheManifest {
  version: string
  precache: PrecacheEntry[]
  routes: CacheRoute[]
  runtimeCaching: RuntimeCacheRule[]
  generatedAt: number
}

export interface RuntimeCacheRule {
  urlPattern: string
  handler: CacheStrategy
  cacheName: string
  options: {
    maxEntries?: number
    maxAgeSeconds?: number
    networkTimeoutSeconds?: number
  }
}

export interface ManifestOptions {
  version: string
  defaultStrategy: CacheStrategy
  defaultMaxAge: number
  defaultMaxEntries: number
}

// ─── Default Options ──────────────────────────────────────────────────────────

const DEFAULT_MANIFEST_OPTIONS: ManifestOptions = {
  version: '1.0.0',
  defaultStrategy: 'NETWORK_FIRST',
  defaultMaxAge: 24 * 60 * 60,
  defaultMaxEntries: 50,
}

// ─── Precache Lists ──────────────────────────────────────────────────────────

export const CRITICAL_ASSETS: PrecacheEntry[] = [
  { url: '/', revision: '' },
  { url: '/offline', revision: '' },
  { url: '/manifest.json', revision: '' },
]

// ─── Manifest Generator ──────────────────────────────────────────────────────

export function generateManifest(
  routes: CacheRoute[],
  options: Partial<ManifestOptions> = {},
): CacheManifest {
  const opts = { ...DEFAULT_MANIFEST_OPTIONS, ...options }

  const runtimeCaching = routes.map((route) =>
    createRuntimeRule(route, opts),
  )

  const precache = CRITICAL_ASSETS.map((entry) => ({
    ...entry,
    revision: entry.revision || opts.version,
  }))

  return {
    version: opts.version,
    precache,
    routes,
    runtimeCaching,
    generatedAt: Date.now(),
  }
}

function createRuntimeRule(
  route: CacheRoute,
  opts: ManifestOptions,
): RuntimeCacheRule {
  return {
    urlPattern: route.pattern,
    handler: route.strategy,
    cacheName: route.cacheName ?? `mabele-${route.strategy.toLowerCase()}`,
    options: {
      maxEntries: route.maxEntries ?? opts.defaultMaxEntries,
      maxAgeSeconds: route.maxAge ?? opts.defaultMaxAge,
      networkTimeoutSeconds: route.strategy === 'NETWORK_FIRST' ? 5 : undefined,
    },
  }
}

// ─── Predefined Routes ───────────────────────────────────────────────────────

export const API_ROUTES: CacheRoute[] = [
  {
    pattern: '/api/listings/*',
    strategy: 'NETWORK_FIRST',
    cacheName: 'api-listings',
    maxAge: 300,
  },
  {
    pattern: '/api/auth/*',
    strategy: 'NETWORK_ONLY',
    cacheName: 'api-auth',
  },
  {
    pattern: '/api/search/*',
    strategy: 'NETWORK_FIRST',
    cacheName: 'api-search',
    maxAge: 60,
  },
]

export const STATIC_ROUTES: CacheRoute[] = [
  {
    pattern: '/_next/static/*',
    strategy: 'CACHE_FIRST',
    cacheName: 'static-assets',
    maxAge: 365 * 24 * 60 * 60,
  },
  {
    pattern: '/images/*',
    strategy: 'CACHE_FIRST',
    cacheName: 'images',
    maxAge: 30 * 24 * 60 * 60,
    maxEntries: 100,
  },
  {
    pattern: '/fonts/*',
    strategy: 'CACHE_FIRST',
    cacheName: 'fonts',
    maxAge: 365 * 24 * 60 * 60,
  },
]

export const PAGE_ROUTES: CacheRoute[] = [
  {
    pattern: '/dashboard/*',
    strategy: 'NETWORK_FIRST',
    cacheName: 'pages',
    maxAge: 3600,
  },
  {
    pattern: '/immo/*',
    strategy: 'STALE_WHILE_REVALIDATE',
    cacheName: 'pages-immo',
    maxAge: 600,
  },
  {
    pattern: '/market/*',
    strategy: 'STALE_WHILE_REVALIDATE',
    cacheName: 'pages-market',
    maxAge: 600,
  },
]

// ─── Version Management ──────────────────────────────────────────────────────

export function shouldInvalidateCache(
  currentVersion: string,
  newVersion: string,
): boolean {
  if (currentVersion === newVersion) return false

  const current = parseVersion(currentVersion)
  const next = parseVersion(newVersion)

  if (!current || !next) return true

  return next.major > current.major || next.minor > current.minor
}

function parseVersion(
  version: string,
): { major: number; minor: number; patch: number } | null {
  const parts = version.split('.')
  if (parts.length !== 3) return null

  const major = parseInt(parts[0]!, 10)
  const minor = parseInt(parts[1]!, 10)
  const patch = parseInt(parts[2]!, 10)

  if (isNaN(major) || isNaN(minor) || isNaN(patch)) return null

  return { major, minor, patch }
}

// ─── Pattern Matching ─────────────────────────────────────────────────────────

export function matchRoute(url: string, routes: CacheRoute[]): CacheRoute | undefined {
  for (const route of routes) {
    if (matchUrlPattern(url, route.pattern)) {
      return route
    }
  }
  return undefined
}

function matchUrlPattern(url: string, pattern: string): boolean {
  const regexStr = pattern
    .replace(/\./g, '\\.')
    .replace(/\*\*/g, '{{GLOB}}')
    .replace(/\*/g, '[^/]*')
    .replace(/\{\{GLOB\}\}/g, '.*')

  const regex = new RegExp(`^${regexStr}$`)
  return regex.test(url)
}

export function getStrategyForUrl(
  url: string,
  manifest: CacheManifest,
): CacheStrategy {
  const route = matchRoute(url, manifest.routes)
  return route?.strategy ?? 'NETWORK_FIRST'
}
