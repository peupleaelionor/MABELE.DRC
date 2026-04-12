// ─── Sliding-Window Rate Limiter ──────────────────────────────────────────────
// In-memory by default (for dev / single-instance).
// Swap store to Redis for production multi-instance deployment.

export interface RateLimitConfig {
  /** Max requests allowed in the window */
  max: number
  /** Window duration in milliseconds */
  windowMs: number
  /** Optional key prefix for namespacing */
  prefix?: string
}

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetAt: number
  limit: number
}

// ─── Store Interface ──────────────────────────────────────────────────────────

export interface RateLimitStore {
  increment(key: string, windowMs: number): Promise<{ count: number; resetAt: number }>
}

// ─── In-Memory Store ──────────────────────────────────────────────────────────

class MemoryStore implements RateLimitStore {
  private windows = new Map<string, { count: number; resetAt: number }>()

  async increment(key: string, windowMs: number): Promise<{ count: number; resetAt: number }> {
    const now = Date.now()
    const existing = this.windows.get(key)

    if (!existing || existing.resetAt < now) {
      const entry = { count: 1, resetAt: now + windowMs }
      this.windows.set(key, entry)
      return entry
    }

    existing.count++
    return existing
  }

  // Cleanup stale entries periodically
  cleanup(): void {
    const now = Date.now()
    for (const [key, entry] of this.windows.entries()) {
      if (entry.resetAt < now) this.windows.delete(key)
    }
  }
}

const defaultStore = new MemoryStore()
setInterval(() => defaultStore.cleanup(), 60_000)

// ─── Rate Limiter ─────────────────────────────────────────────────────────────

export async function rateLimit(
  identifier: string,
  config: RateLimitConfig,
  store: RateLimitStore = defaultStore,
): Promise<RateLimitResult> {
  const key = `${config.prefix ?? 'rl'}:${identifier}`
  const { count, resetAt } = await store.increment(key, config.windowMs)

  return {
    allowed: count <= config.max,
    remaining: Math.max(0, config.max - count),
    resetAt,
    limit: config.max,
  }
}

// ─── Preset Configs ───────────────────────────────────────────────────────────

export const RATE_LIMITS = {
  /** Public API reads */
  publicRead: { max: 60, windowMs: 60_000, prefix: 'pub' } satisfies RateLimitConfig,
  /** Authenticated API calls */
  authenticated: { max: 120, windowMs: 60_000, prefix: 'auth' } satisfies RateLimitConfig,
  /** Auth: OTP send */
  otpSend: { max: 5, windowMs: 60_000 * 10, prefix: 'otp' } satisfies RateLimitConfig,
  /** Auth: OTP verify */
  otpVerify: { max: 10, windowMs: 60_000 * 10, prefix: 'otp-v' } satisfies RateLimitConfig,
  /** Payment initiation */
  payment: { max: 10, windowMs: 60_000, prefix: 'pay' } satisfies RateLimitConfig,
  /** Listing creation */
  listingCreate: { max: 20, windowMs: 60_000 * 60, prefix: 'lst' } satisfies RateLimitConfig,
  /** Search */
  search: { max: 30, windowMs: 60_000, prefix: 'srch' } satisfies RateLimitConfig,
  /** Message send */
  messageSend: { max: 60, windowMs: 60_000, prefix: 'msg' } satisfies RateLimitConfig,
  /** Webhook callbacks */
  webhook: { max: 200, windowMs: 60_000, prefix: 'wh' } satisfies RateLimitConfig,
}
