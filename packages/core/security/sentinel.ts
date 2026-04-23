// ─── MABELE Security: Threat Sentinel ─────────────────────────────────────────
// In-memory threat scoring per IP and per user.
// Accumulates signals from different attack vectors.
// Designed for Edge runtime (no Node.js APIs).
// For multi-instance production: replace MemoryThreatStore with a Redis store.

export type ThreatSignal =
  | 'HONEYPOT_HIT'        // Hit a trap route → instant critical
  | 'BRUTE_FORCE'         // Too many auth failures
  | 'RATE_EXCEEDED'       // Exceeded rate limit
  | 'INVALID_SIGNATURE'   // Bad HMAC on internal call
  | 'SCANNER_UA'          // Known scanner user-agent
  | 'MISSING_UA'          // No user-agent (bot)
  | 'ANOMALOUS_PAYLOAD'   // Malformed/oversized payload
  | 'SQLI_PATTERN'        // SQL injection pattern in input
  | 'XSS_PATTERN'         // XSS pattern in input
  | 'PATH_TRAVERSAL'      // ../ in path
  | 'REPEATED_ERRORS'     // Many 4xx/5xx responses
  | 'NON_DRC_PAYMENT'     // Payment from suspicious region

export interface ThreatScore {
  ip: string
  userId?: string
  score: number
  level: 'SAFE' | 'WATCH' | 'SUSPECT' | 'BLOCKED'
  signals: ThreatSignal[]
  bannedAt?: number
  bannedUntil?: number
}

export interface ThreatStore {
  get(key: string): ThreatScore | undefined
  set(key: string, score: ThreatScore): void
  delete(key: string): void
  entries(): IterableIterator<[string, ThreatScore]>
}

// ─── Signal Weights ────────────────────────────────────────────────────────────

const SIGNAL_WEIGHT: Record<ThreatSignal, number> = {
  HONEYPOT_HIT:      100, // instant block
  BRUTE_FORCE:        40,
  RATE_EXCEEDED:      15,
  INVALID_SIGNATURE:  50,
  SCANNER_UA:         35,
  MISSING_UA:         10,
  ANOMALOUS_PAYLOAD:  20,
  SQLI_PATTERN:       60,
  XSS_PATTERN:        50,
  PATH_TRAVERSAL:     45,
  REPEATED_ERRORS:    10,
  NON_DRC_PAYMENT:    15,
}

// ─── In-memory store (swap to Redis in prod) ───────────────────────────────────

class MemoryThreatStore implements ThreatStore {
  private map = new Map<string, ThreatScore>()

  get(key: string): ThreatScore | undefined { return this.map.get(key) }
  set(key: string, score: ThreatScore): void { this.map.set(key, score) }
  delete(key: string): void { this.map.delete(key) }
  entries(): IterableIterator<[string, ThreatScore]> { return this.map.entries() }

  /** Remove expired bans and stale entries */
  cleanup(): void {
    const now = Date.now()
    for (const [key, entry] of this.map.entries()) {
      if (entry.bannedUntil && entry.bannedUntil < now) {
        // Lift temporary ban, reset score
        this.map.set(key, { ...entry, score: 0, level: 'SAFE', signals: [], bannedAt: undefined, bannedUntil: undefined })
      }
    }
  }
}

export const threatStore: ThreatStore = new MemoryThreatStore()

// Cleanup every minute in Node.js runtime
if (typeof setInterval !== 'undefined') {
  setInterval(() => (threatStore as MemoryThreatStore).cleanup?.(), 60_000)
}

// ─── Compute Level ─────────────────────────────────────────────────────────────

function computeLevel(score: number): ThreatScore['level'] {
  if (score >= 80) return 'BLOCKED'
  if (score >= 50) return 'SUSPECT'
  if (score >= 20) return 'WATCH'
  return 'SAFE'
}

// ─── Public API ────────────────────────────────────────────────────────────────

/** Record a threat signal for an IP (and optionally a userId). */
export function recordThreat(
  ip: string,
  signal: ThreatSignal,
  userId?: string,
  banDurationMs?: number,
): ThreatScore {
  const key = `ip:${ip}`
  const existing = threatStore.get(key) ?? { ip, score: 0, level: 'SAFE' as const, signals: [] }
  const addedScore = SIGNAL_WEIGHT[signal] ?? 0
  const newScore = Math.min(100, existing.score + addedScore)
  const signals = existing.signals.includes(signal) ? existing.signals : [...existing.signals, signal]
  const level = computeLevel(newScore)

  const bannedAt    = level === 'BLOCKED' ? Date.now() : existing.bannedAt
  const bannedUntil = level === 'BLOCKED'
    ? Date.now() + (banDurationMs ?? 24 * 60 * 60 * 1000) // default 24h
    : existing.bannedUntil

  const updated: ThreatScore = { ip, userId: userId ?? existing.userId, score: newScore, level, signals, bannedAt, bannedUntil }
  threatStore.set(key, updated)

  // Also track by userId
  if (userId) {
    const ukey = `user:${userId}`
    const uexisting = threatStore.get(ukey) ?? { ip, score: 0, level: 'SAFE' as const, signals: [] }
    const uscore = Math.min(100, uexisting.score + Math.floor(addedScore * 0.5))
    threatStore.set(ukey, { ...uexisting, userId, score: uscore, level: computeLevel(uscore), signals })
  }

  return updated
}

/** Check if an IP or user is currently blocked. */
export function isBlocked(ip: string, userId?: string): boolean {
  const ipScore = threatStore.get(`ip:${ip}`)
  if (ipScore && ipScore.level === 'BLOCKED') {
    const now = Date.now()
    if (!ipScore.bannedUntil || ipScore.bannedUntil > now) return true
  }
  if (userId) {
    const uScore = threatStore.get(`user:${userId}`)
    if (uScore && uScore.level === 'BLOCKED') {
      if (!uScore.bannedUntil || uScore.bannedUntil > now) return true
    }
  }
  return false
}

/** Get current threat score for an IP. */
export function getThreat(ip: string, userId?: string): ThreatScore | null {
  return threatStore.get(`ip:${ip}`) ?? (userId ? threatStore.get(`user:${userId}`) : null) ?? null
}

/** Permanently ban an IP (no expiry). */
export function permanentBan(ip: string, reason: ThreatSignal = 'HONEYPOT_HIT'): void {
  const key = `ip:${ip}`
  const existing = threatStore.get(key) ?? { ip, score: 0, level: 'SAFE' as const, signals: [] }
  threatStore.set(key, {
    ...existing,
    score: 100,
    level: 'BLOCKED',
    signals: [...new Set([...existing.signals, reason])],
    bannedAt: Date.now(),
    bannedUntil: undefined, // no expiry = permanent
  })
}

/** Lift a ban (admin action). */
export function liftBan(ip: string): void {
  const key = `ip:${ip}`
  const existing = threatStore.get(key)
  if (existing) {
    threatStore.set(key, { ...existing, score: 0, level: 'SAFE', signals: [], bannedAt: undefined, bannedUntil: undefined })
  }
}
