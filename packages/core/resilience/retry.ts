// ─── Mécanisme de réessai ────────────────────────────────────────────────────
// Backoff exponentiel, jitter, budgets de réessai et stratégies multiples
// ──────────────────────────────────────────────────────────────────────────────

// ─── Types ───────────────────────────────────────────────────────────────────

export type RetryStrategy = 'exponential' | 'linear' | 'fixed'

export interface RetryOptions {
  maxAttempts?: number
  baseDelayMs?: number
  maxDelayMs?: number
  jitterFactor?: number
  strategy?: RetryStrategy
  isRetryable?: (error: unknown) => boolean
  onRetry?: (attempt: number, error: unknown, delayMs: number) => void
}

export interface RetryBudgetConfig {
  maxRetriesPerWindow: number
  windowMs: number
}

export interface RetryResult<T> {
  result: T
  attempts: number
  totalDelayMs: number
}

export interface RetryMetrics {
  totalCalls: number
  totalRetries: number
  successOnFirstAttempt: number
  successAfterRetry: number
  exhaustedRetries: number
  averageAttempts: number
}

// ─── Constantes ──────────────────────────────────────────────────────────────

const DEFAULT_OPTIONS: Required<Omit<RetryOptions, 'isRetryable' | 'onRetry'>> = {
  maxAttempts: 3,
  baseDelayMs: 1000,
  maxDelayMs: 30_000,
  jitterFactor: 0.25,
  strategy: 'exponential',
}

// ─── Fonction de réessai ─────────────────────────────────────────────────────

export async function retry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {},
): Promise<RetryResult<T>> {
  const opts = { ...DEFAULT_OPTIONS, ...options }
  let lastError: unknown
  let totalDelay = 0

  for (let attempt = 1; attempt <= opts.maxAttempts; attempt++) {
    try {
      const result = await fn()
      return { result, attempts: attempt, totalDelayMs: totalDelay }
    } catch (error) {
      lastError = error

      if (attempt >= opts.maxAttempts) break

      if (opts.isRetryable && !opts.isRetryable(error)) {
        throw error
      }

      const delayMs = calculateDelay(attempt, opts.strategy, opts.baseDelayMs, opts.maxDelayMs, opts.jitterFactor)
      totalDelay += delayMs

      if (opts.onRetry) {
        opts.onRetry(attempt, error, delayMs)
      }

      await sleep(delayMs)
    }
  }

  throw lastError
}

// ─── Calcul du délai ─────────────────────────────────────────────────────────

export function calculateDelay(
  attempt: number,
  strategy: RetryStrategy,
  baseDelayMs: number,
  maxDelayMs: number,
  jitterFactor: number,
): number {
  let delay: number

  switch (strategy) {
    case 'exponential':
      delay = baseDelayMs * Math.pow(2, attempt - 1)
      break
    case 'linear':
      delay = baseDelayMs * attempt
      break
    case 'fixed':
      delay = baseDelayMs
      break
    default:
      delay = baseDelayMs
  }

  delay = Math.min(delay, maxDelayMs)

  if (jitterFactor > 0) {
    const jitter = delay * jitterFactor * (Math.random() * 2 - 1)
    delay = Math.max(0, delay + jitter)
  }

  return Math.floor(delay)
}

// ─── Prédicats de réessai ────────────────────────────────────────────────────

export function isRetryableError(error: unknown): boolean {
  if (error instanceof Error) {
    const message = error.message.toLowerCase()
    const retryablePatterns = [
      'timeout',
      'econnreset',
      'econnrefused',
      'epipe',
      'ehostunreach',
      'enetunreach',
      'service unavailable',
      'bad gateway',
      'gateway timeout',
      'temporaire',
      'délai dépassé',
    ]
    return retryablePatterns.some((p) => message.includes(p))
  }
  return false
}

export function isHttpRetryable(statusCode: number): boolean {
  return statusCode === 408 ||
    statusCode === 429 ||
    statusCode === 500 ||
    statusCode === 502 ||
    statusCode === 503 ||
    statusCode === 504
}

// ─── Budget de réessai ───────────────────────────────────────────────────────

export class RetryBudget {
  private timestamps: number[] = []
  private readonly config: RetryBudgetConfig

  constructor(config: RetryBudgetConfig) {
    this.config = config
  }

  canRetry(): boolean {
    this.pruneExpired()
    return this.timestamps.length < this.config.maxRetriesPerWindow
  }

  recordRetry(): void {
    this.pruneExpired()
    this.timestamps.push(Date.now())
  }

  getRemainingRetries(): number {
    this.pruneExpired()
    return Math.max(0, this.config.maxRetriesPerWindow - this.timestamps.length)
  }

  getUsage(): number {
    this.pruneExpired()
    return this.timestamps.length / this.config.maxRetriesPerWindow
  }

  reset(): void {
    this.timestamps = []
  }

  private pruneExpired(): void {
    const cutoff = Date.now() - this.config.windowMs
    this.timestamps = this.timestamps.filter((t) => t > cutoff)
  }
}

// ─── Suivi de métriques ──────────────────────────────────────────────────────

export class RetryMetricsTracker {
  private metrics: RetryMetrics = {
    totalCalls: 0,
    totalRetries: 0,
    successOnFirstAttempt: 0,
    successAfterRetry: 0,
    exhaustedRetries: 0,
    averageAttempts: 0,
  }

  private totalAttempts = 0

  recordSuccess(attempts: number): void {
    this.metrics.totalCalls++
    this.totalAttempts += attempts

    if (attempts === 1) {
      this.metrics.successOnFirstAttempt++
    } else {
      this.metrics.successAfterRetry++
      this.metrics.totalRetries += attempts - 1
    }

    this.metrics.averageAttempts = this.totalAttempts / this.metrics.totalCalls
  }

  recordExhausted(attempts: number): void {
    this.metrics.totalCalls++
    this.metrics.exhaustedRetries++
    this.metrics.totalRetries += attempts - 1
    this.totalAttempts += attempts
    this.metrics.averageAttempts = this.totalAttempts / this.metrics.totalCalls
  }

  getMetrics(): RetryMetrics {
    return { ...this.metrics }
  }

  reset(): void {
    this.metrics = {
      totalCalls: 0,
      totalRetries: 0,
      successOnFirstAttempt: 0,
      successAfterRetry: 0,
      exhaustedRetries: 0,
      averageAttempts: 0,
    }
    this.totalAttempts = 0
  }
}

// ─── Utilitaires ─────────────────────────────────────────────────────────────

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
