// ─── Local Storage Abstraction ────────────────────────────────────────────────

// ─── Types ────────────────────────────────────────────────────────────────────

export interface StorageEntry<T = unknown> {
  key: string
  value: T
  createdAt: number
  updatedAt: number
  accessedAt: number
  ttl?: number
  size: number
}

export interface StorageStats {
  totalEntries: number
  totalSize: number
  quotaUsed: number
  quotaLimit: number
}

export interface StorageOptions {
  quotaBytes: number
  warningThreshold: number
  defaultTtlMs?: number
  onQuotaWarning?: (stats: StorageStats) => void
}

// ─── LocalStore Interface ─────────────────────────────────────────────────────

export interface LocalStore {
  get<T>(key: string): T | undefined
  set<T>(key: string, value: T, ttlMs?: number): void
  delete(key: string): boolean
  clear(): void
  keys(): string[]
  size(): number
  has(key: string): boolean
}

// ─── Default Options ──────────────────────────────────────────────────────────

const DEFAULT_STORAGE_OPTIONS: StorageOptions = {
  quotaBytes: 50 * 1024 * 1024,
  warningThreshold: 0.8,
}

// ─── Memory Store ─────────────────────────────────────────────────────────────

export class MemoryStore implements LocalStore {
  private store: Map<string, StorageEntry> = new Map()
  private totalSize = 0
  private readonly options: StorageOptions

  constructor(options: Partial<StorageOptions> = {}) {
    this.options = { ...DEFAULT_STORAGE_OPTIONS, ...options }
  }

  get<T>(key: string): T | undefined {
    const entry = this.store.get(key)
    if (!entry) return undefined

    if (this.isExpired(entry)) {
      this.delete(key)
      return undefined
    }

    entry.accessedAt = Date.now()
    return entry.value as T
  }

  set<T>(key: string, value: T, ttlMs?: number): void {
    const serialized = JSON.stringify(value)
    const entrySize = serialized.length * 2

    const existing = this.store.get(key)
    if (existing) {
      this.totalSize -= existing.size
    }

    while (
      this.totalSize + entrySize > this.options.quotaBytes &&
      this.store.size > 0
    ) {
      this.evictLRU()
    }

    if (this.totalSize + entrySize > this.options.quotaBytes) {
      throw new Error(
        `Quota de stockage dépassé : impossible de stocker ${entrySize} octets`,
      )
    }

    const now = Date.now()
    const entry: StorageEntry<T> = {
      key,
      value,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
      accessedAt: now,
      ttl: ttlMs ?? this.options.defaultTtlMs,
      size: entrySize,
    }

    this.store.set(key, entry as StorageEntry)
    this.totalSize += entrySize
    this.checkQuotaWarning()
  }

  delete(key: string): boolean {
    const entry = this.store.get(key)
    if (!entry) return false

    this.totalSize -= entry.size
    this.store.delete(key)
    return true
  }

  clear(): void {
    this.store.clear()
    this.totalSize = 0
  }

  keys(): string[] {
    this.cleanupExpired()
    return Array.from(this.store.keys())
  }

  size(): number {
    this.cleanupExpired()
    return this.store.size
  }

  has(key: string): boolean {
    const entry = this.store.get(key)
    if (!entry) return false
    if (this.isExpired(entry)) {
      this.delete(key)
      return false
    }
    return true
  }

  getStats(): StorageStats {
    return {
      totalEntries: this.store.size,
      totalSize: this.totalSize,
      quotaUsed: this.totalSize / this.options.quotaBytes,
      quotaLimit: this.options.quotaBytes,
    }
  }

  private isExpired(entry: StorageEntry): boolean {
    if (!entry.ttl) return false
    return Date.now() - entry.updatedAt > entry.ttl
  }

  private cleanupExpired(): void {
    for (const [key, entry] of this.store) {
      if (this.isExpired(entry)) {
        this.totalSize -= entry.size
        this.store.delete(key)
      }
    }
  }

  private evictLRU(): void {
    let lruKey: string | null = null
    let lruTime = Infinity

    for (const [key, entry] of this.store) {
      if (entry.accessedAt < lruTime) {
        lruTime = entry.accessedAt
        lruKey = key
      }
    }

    if (lruKey) {
      this.delete(lruKey)
    }
  }

  private checkQuotaWarning(): void {
    const ratio = this.totalSize / this.options.quotaBytes
    if (ratio >= this.options.warningThreshold) {
      this.options.onQuotaWarning?.(this.getStats())
    }
  }
}

// ─── Persistent Store ─────────────────────────────────────────────────────────

export interface StorageBackend {
  read(): string | null
  write(data: string): void
  clear(): void
}

export class PersistentStore implements LocalStore {
  private cache: MemoryStore
  private readonly backend: StorageBackend
  private dirty = false

  constructor(backend: StorageBackend, options: Partial<StorageOptions> = {}) {
    this.backend = backend
    this.cache = new MemoryStore(options)
    this.loadFromBackend()
  }

  get<T>(key: string): T | undefined {
    return this.cache.get<T>(key)
  }

  set<T>(key: string, value: T, ttlMs?: number): void {
    this.cache.set(key, value, ttlMs)
    this.dirty = true
    this.persist()
  }

  delete(key: string): boolean {
    const result = this.cache.delete(key)
    if (result) {
      this.dirty = true
      this.persist()
    }
    return result
  }

  clear(): void {
    this.cache.clear()
    this.backend.clear()
    this.dirty = false
  }

  keys(): string[] {
    return this.cache.keys()
  }

  size(): number {
    return this.cache.size()
  }

  has(key: string): boolean {
    return this.cache.has(key)
  }

  private loadFromBackend(): void {
    const data = this.backend.read()
    if (!data) return

    try {
      const entries = JSON.parse(data) as Array<{
        key: string
        value: unknown
        ttl?: number
      }>
      for (const entry of entries) {
        this.cache.set(entry.key, entry.value, entry.ttl)
      }
    } catch {
      // Données corrompues, on repart à zéro
    }
  }

  private persist(): void {
    if (!this.dirty) return
    const keys = this.cache.keys()
    const entries = keys.map((key) => ({
      key,
      value: this.cache.get(key),
    }))
    this.backend.write(JSON.stringify(entries))
    this.dirty = false
  }
}

// ─── Encrypted Store ──────────────────────────────────────────────────────────

export interface EncryptionProvider {
  encrypt(data: string): string
  decrypt(data: string): string
}

export class EncryptedStore implements LocalStore {
  private inner: LocalStore
  private crypto: EncryptionProvider

  constructor(inner: LocalStore, crypto: EncryptionProvider) {
    this.inner = inner
    this.crypto = crypto
  }

  get<T>(key: string): T | undefined {
    const encrypted = this.inner.get<string>(key)
    if (encrypted === undefined) return undefined

    try {
      const decrypted = this.crypto.decrypt(encrypted)
      return JSON.parse(decrypted) as T
    } catch {
      return undefined
    }
  }

  set<T>(key: string, value: T, ttlMs?: number): void {
    const serialized = JSON.stringify(value)
    const encrypted = this.crypto.encrypt(serialized)
    this.inner.set(key, encrypted, ttlMs)
  }

  delete(key: string): boolean {
    return this.inner.delete(key)
  }

  clear(): void {
    this.inner.clear()
  }

  keys(): string[] {
    return this.inner.keys()
  }

  size(): number {
    return this.inner.size()
  }

  has(key: string): boolean {
    return this.inner.has(key)
  }
}

// ─── Namespace Isolation ──────────────────────────────────────────────────────

export class NamespacedStore implements LocalStore {
  private readonly store: LocalStore
  private readonly prefix: string

  constructor(store: LocalStore, namespace: string) {
    this.store = store
    this.prefix = `${namespace}:`
  }

  get<T>(key: string): T | undefined {
    return this.store.get<T>(this.prefix + key)
  }

  set<T>(key: string, value: T, ttlMs?: number): void {
    this.store.set(key.startsWith(this.prefix) ? key : this.prefix + key, value, ttlMs)
  }

  delete(key: string): boolean {
    return this.store.delete(this.prefix + key)
  }

  clear(): void {
    const keys = this.store.keys()
    for (const key of keys) {
      if (key.startsWith(this.prefix)) {
        this.store.delete(key)
      }
    }
  }

  keys(): string[] {
    return this.store
      .keys()
      .filter((k) => k.startsWith(this.prefix))
      .map((k) => k.slice(this.prefix.length))
  }

  size(): number {
    return this.keys().length
  }

  has(key: string): boolean {
    return this.store.has(this.prefix + key)
  }
}

export function createNamespace(
  store: LocalStore,
  namespace: string,
): NamespacedStore {
  return new NamespacedStore(store, namespace)
}

// ─── Batch Operations ─────────────────────────────────────────────────────────

export function batchGet<T>(
  store: LocalStore,
  keys: string[],
): Map<string, T | undefined> {
  const result = new Map<string, T | undefined>()
  for (const key of keys) {
    result.set(key, store.get<T>(key))
  }
  return result
}

export function batchSet<T>(
  store: LocalStore,
  entries: Array<{ key: string; value: T; ttlMs?: number }>,
): void {
  for (const entry of entries) {
    store.set(entry.key, entry.value, entry.ttlMs)
  }
}

export function batchDelete(store: LocalStore, keys: string[]): number {
  let deleted = 0
  for (const key of keys) {
    if (store.delete(key)) deleted++
  }
  return deleted
}
