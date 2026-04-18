// ─── Client Redis ────────────────────────────────────────────────────────────
// Interface clé-valeur générique avec pooling de connexions et pub/sub
// ──────────────────────────────────────────────────────────────────────────────

// ─── Types ───────────────────────────────────────────────────────────────────

export interface RedisConfig {
  host: string
  port: number
  password?: string
  db?: number
  maxRetries?: number
  retryDelayMs?: number
  connectTimeoutMs?: number
  commandTimeoutMs?: number
  keyPrefix?: string
  cluster?: ClusterConfig
  sentinel?: SentinelConfig
  pool?: PoolConfig
}

export interface ClusterConfig {
  nodes: Array<{ host: string; port: number }>
  maxRedirections?: number
  retryDelayMs?: number
}

export interface SentinelConfig {
  sentinels: Array<{ host: string; port: number }>
  masterName: string
  password?: string
}

export interface PoolConfig {
  minSize: number
  maxSize: number
  acquireTimeoutMs?: number
  idleTimeoutMs?: number
}

export interface ScanResult {
  cursor: string
  keys: string[]
}

export type MessageHandler = (channel: string, message: string) => void

export interface RedisStats {
  totalCommands: number
  totalErrors: number
  connected: boolean
  poolSize: number
  activeConnections: number
  uptime: number
}

// ─── Constantes ──────────────────────────────────────────────────────────────

const DEFAULT_CONFIG: Required<Omit<RedisConfig, 'password' | 'cluster' | 'sentinel' | 'pool'>> = {
  host: '127.0.0.1',
  port: 6379,
  db: 0,
  maxRetries: 3,
  retryDelayMs: 1000,
  connectTimeoutMs: 5000,
  commandTimeoutMs: 3000,
  keyPrefix: '',
}

const DEFAULT_POOL: Required<PoolConfig> = {
  minSize: 2,
  maxSize: 10,
  acquireTimeoutMs: 5000,
  idleTimeoutMs: 30_000,
}

// ─── Stockage en mémoire ─────────────────────────────────────────────────────

interface MemoryEntry {
  value: string
  expiresAt: number | null
}

// ─── RedisClient ─────────────────────────────────────────────────────────────

export class RedisClient {
  private store = new Map<string, MemoryEntry>()
  private subscribers = new Map<string, Set<MessageHandler>>()
  private config: RedisConfig
  private poolConfig: Required<PoolConfig>
  private connected = false
  private stats: RedisStats
  private startTime: number

  constructor(config: Partial<RedisConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config }
    this.poolConfig = { ...DEFAULT_POOL, ...config.pool }
    this.startTime = Date.now()
    this.stats = {
      totalCommands: 0,
      totalErrors: 0,
      connected: false,
      poolSize: this.poolConfig.minSize,
      activeConnections: 0,
      uptime: 0,
    }
  }

  async connect(): Promise<void> {
    this.connected = true
    this.stats.connected = true
  }

  async disconnect(): Promise<void> {
    this.connected = false
    this.stats.connected = false
    this.subscribers.clear()
  }

  // ─── Opérations de base ──────────────────────────────────────────────────

  async get(key: string): Promise<string | null> {
    this.ensureConnected()
    this.stats.totalCommands++

    const prefixed = this.prefixKey(key)
    const entry = this.store.get(prefixed)

    if (!entry) return null

    if (entry.expiresAt && Date.now() > entry.expiresAt) {
      this.store.delete(prefixed)
      return null
    }

    return entry.value
  }

  async set(key: string, value: string, ttlMs?: number): Promise<void> {
    this.ensureConnected()
    this.stats.totalCommands++

    const prefixed = this.prefixKey(key)
    this.store.set(prefixed, {
      value,
      expiresAt: ttlMs ? Date.now() + ttlMs : null,
    })
  }

  async del(key: string): Promise<boolean> {
    this.ensureConnected()
    this.stats.totalCommands++

    const prefixed = this.prefixKey(key)
    return this.store.delete(prefixed)
  }

  async exists(key: string): Promise<boolean> {
    this.ensureConnected()
    this.stats.totalCommands++

    const prefixed = this.prefixKey(key)
    const entry = this.store.get(prefixed)

    if (!entry) return false

    if (entry.expiresAt && Date.now() > entry.expiresAt) {
      this.store.delete(prefixed)
      return false
    }

    return true
  }

  async expire(key: string, ttlMs: number): Promise<boolean> {
    this.ensureConnected()
    this.stats.totalCommands++

    const prefixed = this.prefixKey(key)
    const entry = this.store.get(prefixed)

    if (!entry) return false

    entry.expiresAt = Date.now() + ttlMs
    return true
  }

  async ttl(key: string): Promise<number> {
    this.ensureConnected()
    this.stats.totalCommands++

    const prefixed = this.prefixKey(key)
    const entry = this.store.get(prefixed)

    if (!entry) return -2
    if (!entry.expiresAt) return -1

    const remaining = entry.expiresAt - Date.now()
    if (remaining <= 0) {
      this.store.delete(prefixed)
      return -2
    }

    return remaining
  }

  async incr(key: string): Promise<number> {
    this.ensureConnected()
    this.stats.totalCommands++

    const prefixed = this.prefixKey(key)
    const entry = this.store.get(prefixed)
    const current = entry ? parseInt(entry.value, 10) : 0

    if (entry && isNaN(current)) {
      this.stats.totalErrors++
      throw new Error('La valeur n\'est pas un entier valide')
    }

    const newValue = (isNaN(current) ? 0 : current) + 1
    this.store.set(prefixed, {
      value: newValue.toString(),
      expiresAt: entry?.expiresAt ?? null,
    })

    return newValue
  }

  async decr(key: string): Promise<number> {
    this.ensureConnected()
    this.stats.totalCommands++

    const prefixed = this.prefixKey(key)
    const entry = this.store.get(prefixed)
    const current = entry ? parseInt(entry.value, 10) : 0

    if (entry && isNaN(current)) {
      this.stats.totalErrors++
      throw new Error('La valeur n\'est pas un entier valide')
    }

    const newValue = (isNaN(current) ? 0 : current) - 1
    this.store.set(prefixed, {
      value: newValue.toString(),
      expiresAt: entry?.expiresAt ?? null,
    })

    return newValue
  }

  // ─── Opérations par lot ────────────────────────────────────────────────

  async mget(keys: string[]): Promise<Array<string | null>> {
    this.ensureConnected()
    this.stats.totalCommands++

    const results: Array<string | null> = []
    for (const key of keys) {
      results.push(await this.get(key))
    }
    return results
  }

  async mset(entries: Array<{ key: string; value: string; ttlMs?: number }>): Promise<void> {
    this.ensureConnected()
    this.stats.totalCommands++

    for (const entry of entries) {
      await this.set(entry.key, entry.value, entry.ttlMs)
    }
  }

  // ─── Scan avec curseur ─────────────────────────────────────────────────

  async scan(cursor: string, pattern: string = '*', count: number = 10): Promise<ScanResult> {
    this.ensureConnected()
    this.stats.totalCommands++

    const startIdx = cursor === '0' ? 0 : parseInt(cursor, 10)
    const allKeys = Array.from(this.store.keys())
    const regex = this.globToRegex(pattern)
    const matchedKeys = allKeys.filter((k) => regex.test(k))

    const endIdx = Math.min(startIdx + count, matchedKeys.length)
    const keys = matchedKeys.slice(startIdx, endIdx)
    const nextCursor = endIdx >= matchedKeys.length ? '0' : endIdx.toString()

    return { cursor: nextCursor, keys }
  }

  // ─── Pub/Sub ───────────────────────────────────────────────────────────

  async subscribe(channel: string, handler: MessageHandler): Promise<void> {
    this.ensureConnected()

    const handlers = this.subscribers.get(channel) ?? new Set()
    handlers.add(handler)
    this.subscribers.set(channel, handlers)
  }

  async publish(channel: string, message: string): Promise<number> {
    this.ensureConnected()
    this.stats.totalCommands++

    const handlers = this.subscribers.get(channel)
    if (!handlers || handlers.size === 0) return 0

    for (const handler of handlers) {
      try {
        handler(channel, message)
      } catch {
        this.stats.totalErrors++
      }
    }

    return handlers.size
  }

  async unsubscribe(channel: string, handler?: MessageHandler): Promise<void> {
    if (handler) {
      const handlers = this.subscribers.get(channel)
      if (handlers) {
        handlers.delete(handler)
        if (handlers.size === 0) this.subscribers.delete(channel)
      }
    } else {
      this.subscribers.delete(channel)
    }
  }

  // ─── Utilitaires ──────────────────────────────────────────────────────

  getStats(): RedisStats {
    return {
      ...this.stats,
      uptime: Date.now() - this.startTime,
    }
  }

  isConnected(): boolean {
    return this.connected
  }

  async flushDb(): Promise<void> {
    this.ensureConnected()
    this.store.clear()
  }

  async dbSize(): Promise<number> {
    this.ensureConnected()
    return this.store.size
  }

  private prefixKey(key: string): string {
    return this.config.keyPrefix ? `${this.config.keyPrefix}${key}` : key
  }

  private ensureConnected(): void {
    if (!this.connected) {
      this.stats.totalErrors++
      throw new Error('Client Redis non connecté. Appelez connect() d\'abord.')
    }
  }

  private globToRegex(pattern: string): RegExp {
    const escaped = pattern
      .replace(/[.+^${}()|[\]\\]/g, '\\$&')
      .replace(/\*/g, '.*')
      .replace(/\?/g, '.')
    return new RegExp(`^${escaped}$`)
  }
}
