// ─── Disjoncteur (Circuit Breaker) ───────────────────────────────────────────
// Protège les services contre les pannes en cascade
// ──────────────────────────────────────────────────────────────────────────────

// ─── Types ───────────────────────────────────────────────────────────────────

export type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN'

export interface CircuitBreakerConfig {
  failureThreshold?: number
  recoveryTimeoutMs?: number
  halfOpenMaxAttempts?: number
  name?: string
  monitorIntervalMs?: number
}

export interface CircuitBreakerMetrics {
  state: CircuitState
  successCount: number
  failureCount: number
  consecutiveFailures: number
  lastFailureTime: number | null
  lastSuccessTime: number | null
  totalRequests: number
  halfOpenAttempts: number
  stateChanges: StateChange[]
}

export interface StateChange {
  from: CircuitState
  to: CircuitState
  timestamp: number
  reason: string
}

export type CircuitEventType = 'open' | 'close' | 'halfOpen' | 'success' | 'failure'
export type CircuitEventHandler = (event: { type: CircuitEventType; metrics: CircuitBreakerMetrics }) => void

// ─── Constantes ──────────────────────────────────────────────────────────────

const DEFAULT_CONFIG: Required<CircuitBreakerConfig> = {
  failureThreshold: 5,
  recoveryTimeoutMs: 30_000,
  halfOpenMaxAttempts: 3,
  name: 'default',
  monitorIntervalMs: 60_000,
}

// ─── CircuitBreaker ──────────────────────────────────────────────────────────

export class CircuitBreaker {
  private state: CircuitState = 'CLOSED'
  private successCount = 0
  private failureCount = 0
  private consecutiveFailures = 0
  private lastFailureTime: number | null = null
  private lastSuccessTime: number | null = null
  private totalRequests = 0
  private halfOpenAttempts = 0
  private openedAt: number | null = null
  private stateChanges: StateChange[] = []
  private handlers = new Map<CircuitEventType, Set<CircuitEventHandler>>()
  private readonly config: Required<CircuitBreakerConfig>

  constructor(config: CircuitBreakerConfig = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config }
  }

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (!this.canExecute()) {
      throw new Error(
        `Disjoncteur « ${this.config.name} » ouvert. Réessayez après ${this.getRemainingRecoveryMs()} ms`,
      )
    }

    this.totalRequests++

    if (this.state === 'HALF_OPEN') {
      this.halfOpenAttempts++
    }

    try {
      const result = await fn()
      this.onSuccess()
      return result
    } catch (error) {
      this.onFailure()
      throw error
    }
  }

  getState(): CircuitState {
    this.checkRecoveryTimeout()
    return this.state
  }

  getMetrics(): CircuitBreakerMetrics {
    return {
      state: this.getState(),
      successCount: this.successCount,
      failureCount: this.failureCount,
      consecutiveFailures: this.consecutiveFailures,
      lastFailureTime: this.lastFailureTime,
      lastSuccessTime: this.lastSuccessTime,
      totalRequests: this.totalRequests,
      halfOpenAttempts: this.halfOpenAttempts,
      stateChanges: [...this.stateChanges],
    }
  }

  getName(): string {
    return this.config.name
  }

  reset(): void {
    this.transitionTo('CLOSED', 'Réinitialisation manuelle')
    this.successCount = 0
    this.failureCount = 0
    this.consecutiveFailures = 0
    this.lastFailureTime = null
    this.lastSuccessTime = null
    this.totalRequests = 0
    this.halfOpenAttempts = 0
    this.openedAt = null
    this.stateChanges = []
  }

  forceOpen(): void {
    this.transitionTo('OPEN', 'Ouverture forcée')
    this.openedAt = Date.now()
  }

  forceClose(): void {
    this.transitionTo('CLOSED', 'Fermeture forcée')
    this.consecutiveFailures = 0
    this.openedAt = null
  }

  on(event: CircuitEventType, handler: CircuitEventHandler): void {
    const handlers = this.handlers.get(event) ?? new Set()
    handlers.add(handler)
    this.handlers.set(event, handlers)
  }

  off(event: CircuitEventType, handler: CircuitEventHandler): void {
    const handlers = this.handlers.get(event)
    if (handlers) {
      handlers.delete(handler)
    }
  }

  private canExecute(): boolean {
    this.checkRecoveryTimeout()

    switch (this.state) {
      case 'CLOSED':
        return true
      case 'OPEN':
        return false
      case 'HALF_OPEN':
        return this.halfOpenAttempts < this.config.halfOpenMaxAttempts
    }
  }

  private onSuccess(): void {
    this.successCount++
    this.consecutiveFailures = 0
    this.lastSuccessTime = Date.now()

    this.emit('success')

    if (this.state === 'HALF_OPEN') {
      this.transitionTo('CLOSED', 'Succès en mode semi-ouvert')
      this.openedAt = null
      this.halfOpenAttempts = 0
    }
  }

  private onFailure(): void {
    this.failureCount++
    this.consecutiveFailures++
    this.lastFailureTime = Date.now()

    this.emit('failure')

    if (this.state === 'HALF_OPEN') {
      this.transitionTo('OPEN', 'Échec en mode semi-ouvert')
      this.openedAt = Date.now()
      this.halfOpenAttempts = 0
    } else if (this.consecutiveFailures >= this.config.failureThreshold) {
      this.transitionTo('OPEN', `Seuil d'échecs atteint (${this.consecutiveFailures}/${this.config.failureThreshold})`)
      this.openedAt = Date.now()
    }
  }

  private checkRecoveryTimeout(): void {
    if (this.state === 'OPEN' && this.openedAt) {
      const elapsed = Date.now() - this.openedAt
      if (elapsed >= this.config.recoveryTimeoutMs) {
        this.transitionTo('HALF_OPEN', 'Délai de récupération écoulé')
        this.halfOpenAttempts = 0
      }
    }
  }

  private getRemainingRecoveryMs(): number {
    if (!this.openedAt) return 0
    const elapsed = Date.now() - this.openedAt
    return Math.max(0, this.config.recoveryTimeoutMs - elapsed)
  }

  private transitionTo(newState: CircuitState, reason: string): void {
    if (this.state === newState) return

    const change: StateChange = {
      from: this.state,
      to: newState,
      timestamp: Date.now(),
      reason,
    }

    this.stateChanges.push(change)
    this.state = newState

    const eventMap: Record<CircuitState, CircuitEventType> = {
      CLOSED: 'close',
      OPEN: 'open',
      HALF_OPEN: 'halfOpen',
    }

    this.emit(eventMap[newState])
  }

  private emit(type: CircuitEventType): void {
    const handlers = this.handlers.get(type)
    if (!handlers) return

    const metrics = this.getMetrics()
    for (const handler of handlers) {
      try {
        handler({ type, metrics })
      } catch {
        // Les erreurs de handlers ne doivent pas affecter le disjoncteur
      }
    }
  }
}

// ─── Registre de disjoncteurs ────────────────────────────────────────────────

const registry = new Map<string, CircuitBreaker>()

export function getOrCreateBreaker(name: string, config: CircuitBreakerConfig = {}): CircuitBreaker {
  const existing = registry.get(name)
  if (existing) return existing

  const breaker = new CircuitBreaker({ ...config, name })
  registry.set(name, breaker)
  return breaker
}

export function getBreaker(name: string): CircuitBreaker | undefined {
  return registry.get(name)
}

export function getAllBreakers(): Map<string, CircuitBreaker> {
  return new Map(registry)
}

export function removeBreaker(name: string): boolean {
  return registry.delete(name)
}

export function clearRegistry(): void {
  registry.clear()
}
