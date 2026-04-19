// ─── Stratégies de cache ─────────────────────────────────────────────────────
// Cache-aside, write-through, write-behind, read-through
// ──────────────────────────────────────────────────────────────────────────────

// ─── Types ───────────────────────────────────────────────────────────────────

export interface CacheStrategy<T = string> {
  get(key: string): Promise<T | null>
  set(key: string, value: T): Promise<void>
  invalidate(key: string): Promise<void>
}

export interface CacheStore<T = string> {
  get(key: string): Promise<T | null>
  set(key: string, value: T, ttlMs?: number): Promise<void>
  del(key: string): Promise<boolean>
  exists(key: string): Promise<boolean>
}

export type DataSource<T> = {
  fetch(key: string): Promise<T | null>
  write(key: string, value: T): Promise<void>
  delete(key: string): Promise<void>
}

export interface StrategyConfig {
  ttlMs?: number
  name?: string
}

export interface CacheMetrics {
  hits: number
  misses: number
  writes: number
  invalidations: number
  errors: number
  hitRate: number
  lastResetAt: number
}

// ─── Suivi des métriques ─────────────────────────────────────────────────────

class MetricsTracker {
  private hits = 0
  private misses = 0
  private writes = 0
  private invalidations = 0
  private errors = 0
  private startedAt = Date.now()

  recordHit(): void {
    this.hits++
  }

  recordMiss(): void {
    this.misses++
  }

  recordWrite(): void {
    this.writes++
  }

  recordInvalidation(): void {
    this.invalidations++
  }

  recordError(): void {
    this.errors++
  }

  getMetrics(): CacheMetrics {
    const total = this.hits + this.misses
    return {
      hits: this.hits,
      misses: this.misses,
      writes: this.writes,
      invalidations: this.invalidations,
      errors: this.errors,
      hitRate: total > 0 ? this.hits / total : 0,
      lastResetAt: this.startedAt,
    }
  }

  reset(): void {
    this.hits = 0
    this.misses = 0
    this.writes = 0
    this.invalidations = 0
    this.errors = 0
    this.startedAt = Date.now()
  }
}

// ─── Cache-Aside ─────────────────────────────────────────────────────────────

export class CacheAside<T = string> implements CacheStrategy<T> {
  private readonly store: CacheStore<T>
  private readonly source: DataSource<T>
  private readonly ttlMs: number | undefined
  private readonly metrics = new MetricsTracker()

  constructor(store: CacheStore<T>, source: DataSource<T>, config: StrategyConfig = {}) {
    this.store = store
    this.source = source
    this.ttlMs = config.ttlMs
  }

  async get(key: string): Promise<T | null> {
    try {
      const cached = await this.store.get(key)
      if (cached !== null) {
        this.metrics.recordHit()
        return cached
      }

      this.metrics.recordMiss()

      const value = await this.source.fetch(key)
      if (value !== null) {
        await this.store.set(key, value, this.ttlMs)
        this.metrics.recordWrite()
      }

      return value
    } catch {
      this.metrics.recordError()
      return this.source.fetch(key)
    }
  }

  async set(key: string, value: T): Promise<void> {
    await this.source.write(key, value)
    await this.store.set(key, value, this.ttlMs)
    this.metrics.recordWrite()
  }

  async invalidate(key: string): Promise<void> {
    await this.store.del(key)
    this.metrics.recordInvalidation()
  }

  getMetrics(): CacheMetrics {
    return this.metrics.getMetrics()
  }

  resetMetrics(): void {
    this.metrics.reset()
  }
}

// ─── Write-Through ───────────────────────────────────────────────────────────

export class WriteThrough<T = string> implements CacheStrategy<T> {
  private readonly store: CacheStore<T>
  private readonly source: DataSource<T>
  private readonly ttlMs: number | undefined
  private readonly metrics = new MetricsTracker()

  constructor(store: CacheStore<T>, source: DataSource<T>, config: StrategyConfig = {}) {
    this.store = store
    this.source = source
    this.ttlMs = config.ttlMs
  }

  async get(key: string): Promise<T | null> {
    const cached = await this.store.get(key)
    if (cached !== null) {
      this.metrics.recordHit()
      return cached
    }

    this.metrics.recordMiss()
    const value = await this.source.fetch(key)

    if (value !== null) {
      await this.store.set(key, value, this.ttlMs)
    }

    return value
  }

  async set(key: string, value: T): Promise<void> {
    await this.source.write(key, value)
    await this.store.set(key, value, this.ttlMs)
    this.metrics.recordWrite()
  }

  async invalidate(key: string): Promise<void> {
    await this.source.delete(key)
    await this.store.del(key)
    this.metrics.recordInvalidation()
  }

  getMetrics(): CacheMetrics {
    return this.metrics.getMetrics()
  }
}

// ─── Write-Behind ────────────────────────────────────────────────────────────

export interface WriteBehindConfig extends StrategyConfig {
  flushIntervalMs?: number
  maxBatchSize?: number
}

export class WriteBehind<T = string> implements CacheStrategy<T> {
  private readonly store: CacheStore<T>
  private readonly source: DataSource<T>
  private readonly ttlMs: number | undefined
  private readonly metrics = new MetricsTracker()
  private pendingWrites = new Map<string, T>()
  private flushTimer: ReturnType<typeof setInterval> | null = null
  private readonly flushIntervalMs: number
  private readonly maxBatchSize: number

  constructor(store: CacheStore<T>, source: DataSource<T>, config: WriteBehindConfig = {}) {
    this.store = store
    this.source = source
    this.ttlMs = config.ttlMs
    this.flushIntervalMs = config.flushIntervalMs ?? 5000
    this.maxBatchSize = config.maxBatchSize ?? 100
  }

  async get(key: string): Promise<T | null> {
    const pending = this.pendingWrites.get(key)
    if (pending !== undefined) {
      this.metrics.recordHit()
      return pending
    }

    const cached = await this.store.get(key)
    if (cached !== null) {
      this.metrics.recordHit()
      return cached
    }

    this.metrics.recordMiss()
    return this.source.fetch(key)
  }

  async set(key: string, value: T): Promise<void> {
    await this.store.set(key, value, this.ttlMs)
    this.pendingWrites.set(key, value)
    this.metrics.recordWrite()

    if (this.pendingWrites.size >= this.maxBatchSize) {
      await this.flush()
    }
  }

  async invalidate(key: string): Promise<void> {
    this.pendingWrites.delete(key)
    await this.store.del(key)
    this.metrics.recordInvalidation()
  }

  async flush(): Promise<number> {
    const entries = Array.from(this.pendingWrites.entries())
    this.pendingWrites.clear()

    let flushed = 0
    for (const [key, value] of entries) {
      try {
        await this.source.write(key, value)
        flushed++
      } catch {
        this.metrics.recordError()
        this.pendingWrites.set(key, value)
      }
    }

    return flushed
  }

  startAutoFlush(): void {
    if (this.flushTimer) return
    this.flushTimer = setInterval(() => {
      void this.flush()
    }, this.flushIntervalMs)
  }

  stopAutoFlush(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer)
      this.flushTimer = null
    }
  }

  getPendingCount(): number {
    return this.pendingWrites.size
  }

  getMetrics(): CacheMetrics {
    return this.metrics.getMetrics()
  }
}

// ─── Read-Through ────────────────────────────────────────────────────────────

export class ReadThrough<T = string> implements CacheStrategy<T> {
  private readonly store: CacheStore<T>
  private readonly source: DataSource<T>
  private readonly ttlMs: number | undefined
  private readonly metrics = new MetricsTracker()
  private inflightRequests = new Map<string, Promise<T | null>>()

  constructor(store: CacheStore<T>, source: DataSource<T>, config: StrategyConfig = {}) {
    this.store = store
    this.source = source
    this.ttlMs = config.ttlMs
  }

  async get(key: string): Promise<T | null> {
    const cached = await this.store.get(key)
    if (cached !== null) {
      this.metrics.recordHit()
      return cached
    }

    this.metrics.recordMiss()

    // Déduplication des requêtes en vol
    const inflight = this.inflightRequests.get(key)
    if (inflight) return inflight

    const fetchPromise = this.fetchAndCache(key)
    this.inflightRequests.set(key, fetchPromise)

    try {
      return await fetchPromise
    } finally {
      this.inflightRequests.delete(key)
    }
  }

  async set(key: string, value: T): Promise<void> {
    await this.store.set(key, value, this.ttlMs)
    await this.source.write(key, value)
    this.metrics.recordWrite()
  }

  async invalidate(key: string): Promise<void> {
    await this.store.del(key)
    this.metrics.recordInvalidation()
  }

  getMetrics(): CacheMetrics {
    return this.metrics.getMetrics()
  }

  private async fetchAndCache(key: string): Promise<T | null> {
    const value = await this.source.fetch(key)

    if (value !== null) {
      await this.store.set(key, value, this.ttlMs)
      this.metrics.recordWrite()
    }

    return value
  }
}
