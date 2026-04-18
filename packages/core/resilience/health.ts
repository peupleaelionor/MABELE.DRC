// ─── Vérification de santé ───────────────────────────────────────────────────
// Contrôles de santé, agrégation, sondes liveness/readiness
// ──────────────────────────────────────────────────────────────────────────────

// ─── Types ───────────────────────────────────────────────────────────────────

export type HealthStatusValue = 'UP' | 'DOWN' | 'DEGRADED'

export interface HealthStatus {
  status: HealthStatusValue
  name: string
  details?: Record<string, unknown>
  duration?: number
  timestamp: number
  error?: string
}

export interface HealthCheck {
  name: string
  check: () => Promise<HealthStatus>
  critical?: boolean
  timeoutMs?: number
}

export interface AggregatedHealth {
  status: HealthStatusValue
  checks: HealthStatus[]
  timestamp: number
  totalDurationMs: number
  summary: {
    total: number
    up: number
    down: number
    degraded: number
  }
}

export interface ProbeResult {
  alive: boolean
  ready: boolean
  details?: AggregatedHealth
}

export interface HealthCheckRegistration {
  check: HealthCheck
  group: 'liveness' | 'readiness' | 'both'
}

// ─── HealthChecker ───────────────────────────────────────────────────────────

export class HealthChecker {
  private checks = new Map<string, HealthCheckRegistration>()
  private lastResults = new Map<string, HealthStatus>()
  private readonly defaultTimeoutMs: number

  constructor(defaultTimeoutMs: number = 5000) {
    this.defaultTimeoutMs = defaultTimeoutMs
  }

  register(
    check: HealthCheck,
    group: HealthCheckRegistration['group'] = 'both',
  ): void {
    if (!check.name) {
      throw new Error('Le nom du contrôle de santé est requis')
    }

    this.checks.set(check.name, { check, group })
  }

  unregister(name: string): boolean {
    this.lastResults.delete(name)
    return this.checks.delete(name)
  }

  async checkAll(): Promise<AggregatedHealth> {
    const startTime = Date.now()
    const results: HealthStatus[] = []

    const registrations = Array.from(this.checks.values())
    const promises = registrations.map((reg) => this.executeCheck(reg.check))
    const settledResults = await Promise.allSettled(promises)

    for (let i = 0; i < settledResults.length; i++) {
      const settled = settledResults[i]
      const reg = registrations[i]

      if (!settled || !reg) continue

      if (settled.status === 'fulfilled') {
        results.push(settled.value)
        this.lastResults.set(reg.check.name, settled.value)
      } else {
        const errorStatus = createErrorStatus(reg.check.name, settled.reason)
        results.push(errorStatus)
        this.lastResults.set(reg.check.name, errorStatus)
      }
    }

    return this.aggregateResults(results, startTime)
  }

  async checkByName(name: string): Promise<HealthStatus> {
    const registration = this.checks.get(name)
    if (!registration) {
      throw new Error(`Contrôle de santé « ${name} » non trouvé`)
    }

    const result = await this.executeCheck(registration.check)
    this.lastResults.set(name, result)
    return result
  }

  async checkGroup(group: HealthCheckRegistration['group']): Promise<AggregatedHealth> {
    const startTime = Date.now()
    const results: HealthStatus[] = []

    const registrations = Array.from(this.checks.values()).filter(
      (reg) => reg.group === group || reg.group === 'both',
    )

    const promises = registrations.map((reg) => this.executeCheck(reg.check))
    const settledResults = await Promise.allSettled(promises)

    for (let i = 0; i < settledResults.length; i++) {
      const settled = settledResults[i]
      const reg = registrations[i]

      if (!settled || !reg) continue

      if (settled.status === 'fulfilled') {
        results.push(settled.value)
      } else {
        results.push(createErrorStatus(reg.check.name, settled.reason))
      }
    }

    return this.aggregateResults(results, startTime)
  }

  // ─── Sondes ────────────────────────────────────────────────────────────

  async liveness(): Promise<ProbeResult> {
    const health = await this.checkGroup('liveness')
    return {
      alive: health.status !== 'DOWN',
      ready: false,
      details: health,
    }
  }

  async readiness(): Promise<ProbeResult> {
    const health = await this.checkGroup('readiness')
    return {
      alive: true,
      ready: health.status === 'UP',
      details: health,
    }
  }

  async probe(): Promise<ProbeResult> {
    const health = await this.checkAll()
    return {
      alive: health.status !== 'DOWN',
      ready: health.status === 'UP',
      details: health,
    }
  }

  // ─── Réponse HTTP ──────────────────────────────────────────────────────

  formatHttpResponse(health: AggregatedHealth): {
    statusCode: number
    body: Record<string, unknown>
  } {
    const statusCode = health.status === 'UP' ? 200
      : health.status === 'DEGRADED' ? 200
      : 503

    return {
      statusCode,
      body: {
        status: health.status,
        timestamp: new Date(health.timestamp).toISOString(),
        duration: `${health.totalDurationMs}ms`,
        checks: health.checks.map((c) => ({
          name: c.name,
          status: c.status,
          duration: c.duration ? `${c.duration}ms` : undefined,
          details: c.details,
          error: c.error,
        })),
        summary: health.summary,
      },
    }
  }

  // ─── Utilitaires ──────────────────────────────────────────────────────

  getLastResult(name: string): HealthStatus | null {
    return this.lastResults.get(name) ?? null
  }

  getRegisteredChecks(): string[] {
    return Array.from(this.checks.keys())
  }

  clear(): void {
    this.checks.clear()
    this.lastResults.clear()
  }

  private async executeCheck(check: HealthCheck): Promise<HealthStatus> {
    const timeoutMs = check.timeoutMs ?? this.defaultTimeoutMs
    const startTime = Date.now()

    try {
      const result = await withCheckTimeout(check.check(), timeoutMs)
      return {
        ...result,
        duration: Date.now() - startTime,
        timestamp: Date.now(),
      }
    } catch (error) {
      return {
        status: 'DOWN',
        name: check.name,
        duration: Date.now() - startTime,
        timestamp: Date.now(),
        error: error instanceof Error ? error.message : 'Erreur inconnue',
      }
    }
  }

  private aggregateResults(results: HealthStatus[], startTime: number): AggregatedHealth {
    let up = 0
    let down = 0
    let degraded = 0

    for (const result of results) {
      switch (result.status) {
        case 'UP': up++; break
        case 'DOWN': down++; break
        case 'DEGRADED': degraded++; break
      }
    }

    const criticalDown = Array.from(this.checks.values()).some((reg) => {
      if (!reg.check.critical) return false
      const lastResult = this.lastResults.get(reg.check.name)
      return lastResult?.status === 'DOWN'
    })

    let status: HealthStatusValue
    if (down > 0 && criticalDown) {
      status = 'DOWN'
    } else if (down > 0 || degraded > 0) {
      status = 'DEGRADED'
    } else {
      status = 'UP'
    }

    return {
      status,
      checks: results,
      timestamp: Date.now(),
      totalDurationMs: Date.now() - startTime,
      summary: { total: results.length, up, down, degraded },
    }
  }
}

// ─── Contrôles de santé prédéfinis ───────────────────────────────────────────

export function createSimpleCheck(name: string, fn: () => Promise<boolean>): HealthCheck {
  return {
    name,
    check: async () => {
      const healthy = await fn()
      return {
        status: healthy ? 'UP' : 'DOWN',
        name,
        timestamp: Date.now(),
      }
    },
  }
}

export function createMemoryCheck(maxHeapMb: number = 512): HealthCheck {
  return {
    name: 'memory',
    check: async () => {
      const used = process.memoryUsage()
      const heapMb = Math.round(used.heapUsed / 1024 / 1024)
      const status: HealthStatusValue = heapMb > maxHeapMb ? 'DEGRADED' : 'UP'

      return {
        status,
        name: 'memory',
        timestamp: Date.now(),
        details: {
          heapUsedMb: heapMb,
          heapTotalMb: Math.round(used.heapTotal / 1024 / 1024),
          rssMb: Math.round(used.rss / 1024 / 1024),
          maxHeapMb,
        },
      }
    },
  }
}

// ─── Utilitaires internes ────────────────────────────────────────────────────

function createErrorStatus(name: string, error: unknown): HealthStatus {
  return {
    status: 'DOWN',
    name,
    timestamp: Date.now(),
    error: error instanceof Error ? error.message : 'Erreur inconnue du contrôle de santé',
  }
}

function withCheckTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Contrôle de santé expiré après ${timeoutMs} ms`))
    }, timeoutMs)

    promise
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
