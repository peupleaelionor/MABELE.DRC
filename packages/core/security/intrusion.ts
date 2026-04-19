// ─── Détection d'intrusion ───────────────────────────────────────────────────
// Suivi des tentatives de connexion, détection d'anomalies, protection anti-brute-force
// ──────────────────────────────────────────────────────────────────────────────

// ─── Types ───────────────────────────────────────────────────────────────────

export interface LoginAttempt {
  ip: string
  userId?: string
  timestamp: number
  success: boolean
  userAgent?: string
  location?: GeoLocation
}

export interface GeoLocation {
  country: string
  region?: string
  city?: string
  latitude?: number
  longitude?: number
}

export interface LockoutStatus {
  locked: boolean
  attemptsRemaining: number
  lockedUntil: number | null
  totalAttempts: number
}

export interface AnomalyResult {
  isAnomalous: boolean
  score: number
  reasons: string[]
}

export interface DeviceContext {
  userAgent: string
  ip: string
  fingerprint?: string
  location?: GeoLocation
}

export interface BruteForceConfig {
  maxAttempts: number
  windowMs: number
  lockoutDurationMs: number
  progressiveDelay: boolean
  maxDelayMs: number
}

export interface GeoBlockRule {
  countries: string[]
  mode: 'allow' | 'deny'
}

export interface IpReputationScore {
  ip: string
  score: number
  factors: string[]
  lastUpdated: number
}

export interface SuspiciousActivityReport {
  id: string
  userId?: string
  ip: string
  type: 'brute_force' | 'anomaly' | 'geo_violation' | 'device_change' | 'rate_limit'
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
  context: Record<string, unknown>
  timestamp: number
  resolved: boolean
}

// ─── LoginAttemptTracker ─────────────────────────────────────────────────────

export class LoginAttemptTracker {
  private attempts = new Map<string, LoginAttempt[]>()
  private readonly maxAttempts: number
  private readonly windowMs: number
  private readonly lockoutDurationMs: number

  constructor(
    maxAttempts: number = 5,
    windowMs: number = 15 * 60 * 1000,
    lockoutDurationMs: number = 30 * 60 * 1000,
  ) {
    this.maxAttempts = maxAttempts
    this.windowMs = windowMs
    this.lockoutDurationMs = lockoutDurationMs
  }

  recordAttempt(attempt: LoginAttempt): LockoutStatus {
    const key = this.buildKey(attempt.ip, attempt.userId)
    const existing = this.attempts.get(key) ?? []
    const now = Date.now()

    const recentAttempts = existing.filter(
      (a) => now - a.timestamp < this.windowMs,
    )

    if (attempt.success) {
      this.attempts.delete(key)
      return { locked: false, attemptsRemaining: this.maxAttempts, lockedUntil: null, totalAttempts: 0 }
    }

    recentAttempts.push(attempt)
    this.attempts.set(key, recentAttempts)

    const failedAttempts = recentAttempts.filter((a) => !a.success)
    const isLocked = failedAttempts.length >= this.maxAttempts

    return {
      locked: isLocked,
      attemptsRemaining: Math.max(0, this.maxAttempts - failedAttempts.length),
      lockedUntil: isLocked ? now + this.lockoutDurationMs : null,
      totalAttempts: failedAttempts.length,
    }
  }

  getStatus(ip: string, userId?: string): LockoutStatus {
    const key = this.buildKey(ip, userId)
    const existing = this.attempts.get(key) ?? []
    const now = Date.now()

    const recentFailed = existing.filter(
      (a) => !a.success && now - a.timestamp < this.windowMs,
    )

    const isLocked = recentFailed.length >= this.maxAttempts
    const lastAttempt = recentFailed[recentFailed.length - 1]
    const lockedUntil = isLocked && lastAttempt
      ? lastAttempt.timestamp + this.lockoutDurationMs
      : null

    if (lockedUntil && now > lockedUntil) {
      this.attempts.delete(key)
      return { locked: false, attemptsRemaining: this.maxAttempts, lockedUntil: null, totalAttempts: 0 }
    }

    return {
      locked: isLocked,
      attemptsRemaining: Math.max(0, this.maxAttempts - recentFailed.length),
      lockedUntil,
      totalAttempts: recentFailed.length,
    }
  }

  reset(ip: string, userId?: string): void {
    const key = this.buildKey(ip, userId)
    this.attempts.delete(key)
  }

  clearAll(): void {
    this.attempts.clear()
  }

  private buildKey(ip: string, userId?: string): string {
    return userId ? `${ip}:${userId}` : ip
  }
}

// ─── AnomalyDetector ─────────────────────────────────────────────────────────

export class AnomalyDetector {
  private knownDevices = new Map<string, DeviceContext[]>()
  private loginTimes = new Map<string, number[]>()

  registerDevice(userId: string, device: DeviceContext): void {
    const devices = this.knownDevices.get(userId) ?? []
    const exists = devices.some(
      (d) => d.fingerprint === device.fingerprint && d.userAgent === device.userAgent,
    )
    if (!exists) {
      devices.push(device)
      this.knownDevices.set(userId, devices)
    }
  }

  registerLoginTime(userId: string, timestamp: number): void {
    const times = this.loginTimes.get(userId) ?? []
    times.push(timestamp)
    if (times.length > 100) times.shift()
    this.loginTimes.set(userId, times)
  }

  detect(userId: string, context: DeviceContext): AnomalyResult {
    const reasons: string[] = []
    let score = 0

    const newDeviceScore = this.checkNewDevice(userId, context)
    score += newDeviceScore.score
    reasons.push(...newDeviceScore.reasons)

    const locationScore = this.checkUnusualLocation(userId, context)
    score += locationScore.score
    reasons.push(...locationScore.reasons)

    const timeScore = this.checkUnusualTime(userId)
    score += timeScore.score
    reasons.push(...timeScore.reasons)

    return {
      isAnomalous: score >= 50,
      score: Math.min(100, score),
      reasons,
    }
  }

  private checkNewDevice(userId: string, context: DeviceContext): { score: number; reasons: string[] } {
    const devices = this.knownDevices.get(userId) ?? []
    if (devices.length === 0) return { score: 0, reasons: [] }

    const known = devices.some(
      (d) => d.fingerprint === context.fingerprint || d.userAgent === context.userAgent,
    )

    if (!known) {
      return { score: 30, reasons: ['Nouvel appareil détecté'] }
    }
    return { score: 0, reasons: [] }
  }

  private checkUnusualLocation(userId: string, context: DeviceContext): { score: number; reasons: string[] } {
    if (!context.location) return { score: 0, reasons: [] }

    const devices = this.knownDevices.get(userId) ?? []
    const knownCountries = new Set(
      devices
        .filter((d) => d.location)
        .map((d) => d.location?.country),
    )

    if (knownCountries.size > 0 && !knownCountries.has(context.location.country)) {
      return { score: 40, reasons: [`Connexion depuis un pays inhabituel : ${context.location.country}`] }
    }

    return { score: 0, reasons: [] }
  }

  private checkUnusualTime(userId: string): { score: number; reasons: string[] } {
    const times = this.loginTimes.get(userId) ?? []
    if (times.length < 5) return { score: 0, reasons: [] }

    const currentHour = new Date().getUTCHours()
    const historicalHours = times.map((t) => new Date(t).getUTCHours())
    const avgHour = historicalHours.reduce((a, b) => a + b, 0) / historicalHours.length
    const deviation = Math.abs(currentHour - avgHour)

    if (deviation > 8) {
      return { score: 20, reasons: ['Connexion à une heure inhabituelle'] }
    }

    return { score: 0, reasons: [] }
  }
}

// ─── BruteForceGuard ─────────────────────────────────────────────────────────

export class BruteForceGuard {
  private windows = new Map<string, number[]>()
  private delays = new Map<string, number>()
  private readonly config: BruteForceConfig

  constructor(config: Partial<BruteForceConfig> = {}) {
    this.config = {
      maxAttempts: config.maxAttempts ?? 10,
      windowMs: config.windowMs ?? 60 * 1000,
      lockoutDurationMs: config.lockoutDurationMs ?? 30 * 60 * 1000,
      progressiveDelay: config.progressiveDelay ?? true,
      maxDelayMs: config.maxDelayMs ?? 30_000,
    }
  }

  shouldBlock(identifier: string): { blocked: boolean; delayMs: number; retryAfterMs?: number } {
    const now = Date.now()
    const timestamps = this.windows.get(identifier) ?? []
    const recent = timestamps.filter((t) => now - t < this.config.windowMs)

    if (recent.length >= this.config.maxAttempts) {
      const oldestInWindow = recent[0] ?? now
      const retryAfterMs = this.config.windowMs - (now - oldestInWindow)
      return { blocked: true, delayMs: 0, retryAfterMs }
    }

    const delayMs = this.config.progressiveDelay
      ? this.calculateProgressiveDelay(identifier)
      : 0

    return { blocked: false, delayMs }
  }

  recordAttempt(identifier: string): void {
    const now = Date.now()
    const timestamps = this.windows.get(identifier) ?? []
    timestamps.push(now)
    this.windows.set(identifier, timestamps.filter((t) => now - t < this.config.windowMs))

    if (this.config.progressiveDelay) {
      const currentDelay = this.delays.get(identifier) ?? 0
      this.delays.set(identifier, Math.min(currentDelay * 2 + 1000, this.config.maxDelayMs))
    }
  }

  resetIdentifier(identifier: string): void {
    this.windows.delete(identifier)
    this.delays.delete(identifier)
  }

  private calculateProgressiveDelay(identifier: string): number {
    return this.delays.get(identifier) ?? 0
  }
}

// ─── GeoBlocker ──────────────────────────────────────────────────────────────

export class GeoBlocker {
  private rules: GeoBlockRule[] = []
  private ipBlocklist = new Set<string>()

  addRule(rule: GeoBlockRule): void {
    this.rules.push(rule)
  }

  blockIp(ip: string): void {
    this.ipBlocklist.add(ip)
  }

  unblockIp(ip: string): void {
    this.ipBlocklist.delete(ip)
  }

  isBlocked(ip: string, country?: string): { blocked: boolean; reason?: string } {
    if (this.ipBlocklist.has(ip)) {
      return { blocked: true, reason: `Adresse IP bloquée : ${ip}` }
    }

    if (!country) return { blocked: false }

    for (const rule of this.rules) {
      const countryInList = rule.countries.includes(country.toUpperCase())

      if (rule.mode === 'deny' && countryInList) {
        return { blocked: true, reason: `Pays bloqué : ${country}` }
      }

      if (rule.mode === 'allow' && !countryInList) {
        return { blocked: true, reason: `Pays non autorisé : ${country}` }
      }
    }

    return { blocked: false }
  }

  clearRules(): void {
    this.rules = []
  }
}

// ─── Scoring de réputation IP ────────────────────────────────────────────────

export function calculateIpReputation(
  ip: string,
  history: LoginAttempt[],
): IpReputationScore {
  let score = 100
  const factors: string[] = []

  const ipAttempts = history.filter((a) => a.ip === ip)
  const failedCount = ipAttempts.filter((a) => !a.success).length
  const totalCount = ipAttempts.length

  if (totalCount === 0) {
    return { ip, score: 50, factors: ['Aucun historique connu'], lastUpdated: Date.now() }
  }

  const failureRate = failedCount / totalCount
  if (failureRate > 0.8) {
    score -= 40
    factors.push('Taux d\'échec élevé')
  } else if (failureRate > 0.5) {
    score -= 20
    factors.push('Taux d\'échec modéré')
  }

  const uniqueUsers = new Set(ipAttempts.filter((a) => a.userId).map((a) => a.userId))
  if (uniqueUsers.size > 10) {
    score -= 30
    factors.push('Tentatives sur de nombreux comptes différents')
  }

  const recentWindow = 60 * 60 * 1000 // 1 heure
  const now = Date.now()
  const recentAttempts = ipAttempts.filter((a) => now - a.timestamp < recentWindow)
  if (recentAttempts.length > 50) {
    score -= 30
    factors.push('Volume élevé de tentatives récentes')
  }

  return {
    ip,
    score: Math.max(0, Math.min(100, score)),
    factors,
    lastUpdated: now,
  }
}

// ─── Rapports d'activité suspecte ────────────────────────────────────────────

let reportCounter = 0

export function createSuspiciousActivityReport(
  type: SuspiciousActivityReport['type'],
  severity: SuspiciousActivityReport['severity'],
  description: string,
  ip: string,
  context: Record<string, unknown> = {},
  userId?: string,
): SuspiciousActivityReport {
  reportCounter++
  return {
    id: `SAR-${Date.now()}-${reportCounter}`,
    userId,
    ip,
    type,
    severity,
    description,
    context,
    timestamp: Date.now(),
    resolved: false,
  }
}

export function resolveReport(report: SuspiciousActivityReport): SuspiciousActivityReport {
  return { ...report, resolved: true }
}

export function filterReports(
  reports: SuspiciousActivityReport[],
  filters: {
    type?: SuspiciousActivityReport['type']
    severity?: SuspiciousActivityReport['severity']
    resolved?: boolean
    userId?: string
    since?: number
  },
): SuspiciousActivityReport[] {
  return reports.filter((r) => {
    if (filters.type && r.type !== filters.type) return false
    if (filters.severity && r.severity !== filters.severity) return false
    if (filters.resolved !== undefined && r.resolved !== filters.resolved) return false
    if (filters.userId && r.userId !== filters.userId) return false
    if (filters.since && r.timestamp < filters.since) return false
    return true
  })
}
