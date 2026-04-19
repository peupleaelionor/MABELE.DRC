// ─── Gestion du délai d'expiration ───────────────────────────────────────────
// Timeout avec adaptation, propagation de deadline et timeout par route
// ──────────────────────────────────────────────────────────────────────────────

// ─── Types ───────────────────────────────────────────────────────────────────

export interface TimeoutConfig {
  defaultMs?: number
  routes?: Record<string, number>
}

export interface LatencyStats {
  p50: number
  p95: number
  p99: number
  min: number
  max: number
  count: number
  average: number
}

export interface Deadline {
  startedAt: number
  timeoutMs: number
  remainingMs: () => number
  isExpired: () => boolean
}

// ─── TimeoutError ────────────────────────────────────────────────────────────

export class TimeoutError extends Error {
  readonly timeoutMs: number
  readonly operation?: string

  constructor(timeoutMs: number, operation?: string) {
    const msg = operation
      ? `Opération « ${operation} » expirée après ${timeoutMs} ms`
      : `Opération expirée après ${timeoutMs} ms`
    super(msg)
    this.name = 'TimeoutError'
    this.timeoutMs = timeoutMs
    this.operation = operation
  }
}

// ─── Timeout de base ─────────────────────────────────────────────────────────

export async function withTimeout<T>(
  fn: () => Promise<T>,
  ms: number,
  operation?: string,
): Promise<T> {
  if (ms <= 0) {
    throw new Error('Le délai d\'expiration doit être supérieur à zéro')
  }

  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new TimeoutError(ms, operation))
    }, ms)

    fn()
      .then((result) => {
        clearTimeout(timer)
        resolve(result)
      })
      .catch((error) => {
        clearTimeout(timer)
        reject(error)
      })
  })
}

// ─── Timeout adaptatif ───────────────────────────────────────────────────────

export class AdaptiveTimeout {
  private latencies: number[] = []
  private readonly maxSamples: number
  private readonly multiplier: number
  private readonly minMs: number
  private readonly maxMs: number

  constructor(options: {
    maxSamples?: number
    multiplier?: number
    minMs?: number
    maxMs?: number
  } = {}) {
    this.maxSamples = options.maxSamples ?? 100
    this.multiplier = options.multiplier ?? 2
    this.minMs = options.minMs ?? 100
    this.maxMs = options.maxMs ?? 60_000
  }

  recordLatency(ms: number): void {
    this.latencies.push(ms)
    if (this.latencies.length > this.maxSamples) {
      this.latencies.shift()
    }
  }

  getTimeout(): number {
    if (this.latencies.length === 0) return this.maxMs

    const stats = this.getStats()
    const adaptive = Math.ceil(stats.p95 * this.multiplier)
    return Math.min(this.maxMs, Math.max(this.minMs, adaptive))
  }

  getStats(): LatencyStats {
    if (this.latencies.length === 0) {
      return { p50: 0, p95: 0, p99: 0, min: 0, max: 0, count: 0, average: 0 }
    }

    const sorted = [...this.latencies].sort((a, b) => a - b)
    const count = sorted.length
    const sum = sorted.reduce((a, b) => a + b, 0)

    return {
      p50: percentile(sorted, 50),
      p95: percentile(sorted, 95),
      p99: percentile(sorted, 99),
      min: sorted[0] ?? 0,
      max: sorted[count - 1] ?? 0,
      count,
      average: sum / count,
    }
  }

  async execute<T>(fn: () => Promise<T>, operation?: string): Promise<T> {
    const timeout = this.getTimeout()
    const start = Date.now()

    try {
      const result = await withTimeout(fn, timeout, operation)
      this.recordLatency(Date.now() - start)
      return result
    } catch (error) {
      this.recordLatency(Date.now() - start)
      throw error
    }
  }

  reset(): void {
    this.latencies = []
  }
}

// ─── Propagation de deadline ─────────────────────────────────────────────────

export function createDeadline(timeoutMs: number): Deadline {
  const startedAt = Date.now()

  return {
    startedAt,
    timeoutMs,
    remainingMs: () => Math.max(0, timeoutMs - (Date.now() - startedAt)),
    isExpired: () => Date.now() - startedAt >= timeoutMs,
  }
}

export function propagateDeadline(parent: Deadline, childTimeoutMs?: number): Deadline {
  const remaining = parent.remainingMs()

  if (remaining <= 0) {
    throw new TimeoutError(parent.timeoutMs, 'deadline parent expirée')
  }

  const effectiveTimeout = childTimeoutMs
    ? Math.min(remaining, childTimeoutMs)
    : remaining

  return createDeadline(effectiveTimeout)
}

export async function withDeadline<T>(
  deadline: Deadline,
  fn: () => Promise<T>,
  operation?: string,
): Promise<T> {
  const remaining = deadline.remainingMs()

  if (remaining <= 0) {
    throw new TimeoutError(deadline.timeoutMs, operation ?? 'deadline expirée')
  }

  return withTimeout(fn, remaining, operation)
}

// ─── Timeout par route ───────────────────────────────────────────────────────

export class RouteTimeoutManager {
  private readonly routes: Record<string, number>
  private readonly defaultMs: number

  constructor(config: TimeoutConfig = {}) {
    this.defaultMs = config.defaultMs ?? 5000
    this.routes = config.routes ?? {}
  }

  getTimeout(route: string): number {
    return this.routes[route] ?? this.defaultMs
  }

  setRouteTimeout(route: string, ms: number): void {
    if (ms <= 0) {
      throw new Error(`Le délai pour la route « ${route} » doit être supérieur à zéro`)
    }
    this.routes[route] = ms
  }

  removeRouteTimeout(route: string): void {
    delete this.routes[route]
  }

  async executeForRoute<T>(
    route: string,
    fn: () => Promise<T>,
  ): Promise<T> {
    const timeout = this.getTimeout(route)
    return withTimeout(fn, timeout, route)
  }

  listRoutes(): Record<string, number> {
    return { ...this.routes }
  }
}

// ─── Utilitaires ─────────────────────────────────────────────────────────────

function percentile(sorted: number[], p: number): number {
  if (sorted.length === 0) return 0
  const idx = Math.ceil((p / 100) * sorted.length) - 1
  return sorted[Math.max(0, idx)] ?? 0
}
