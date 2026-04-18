// ─── Répartiteur de charge ───────────────────────────────────────────────────
// Round-robin, pondéré, least-connections, consistent hashing
// ──────────────────────────────────────────────────────────────────────────────

import { createHash } from 'crypto'

// ─── Types ───────────────────────────────────────────────────────────────────

export type BalancingStrategy = 'round-robin' | 'weighted-round-robin' | 'least-connections' | 'random' | 'consistent-hash'

export interface Backend {
  id: string
  host: string
  port: number
  weight: number
  healthy: boolean
  activeConnections: number
  totalRequests: number
  totalErrors: number
  metadata?: Record<string, unknown>
}

export interface LoadBalancerConfig {
  strategy?: BalancingStrategy
  healthCheckIntervalMs?: number
  drainTimeoutMs?: number
  stickySessionKey?: string
}

export interface SelectionResult {
  backend: Backend
  strategy: BalancingStrategy
}

export interface LoadBalancerMetrics {
  strategy: BalancingStrategy
  totalBackends: number
  healthyBackends: number
  totalRequests: number
  requestsPerBackend: Record<string, number>
}

// ─── LoadBalancer ────────────────────────────────────────────────────────────

export class LoadBalancer {
  private backends: Backend[] = []
  private currentIndex = 0
  private weightedIndex = 0
  private currentWeight = 0
  private readonly config: Required<LoadBalancerConfig>
  private drainingBackends = new Set<string>()

  constructor(config: LoadBalancerConfig = {}) {
    this.config = {
      strategy: config.strategy ?? 'round-robin',
      healthCheckIntervalMs: config.healthCheckIntervalMs ?? 10_000,
      drainTimeoutMs: config.drainTimeoutMs ?? 30_000,
      stickySessionKey: config.stickySessionKey ?? '',
    }
  }

  addBackend(backend: Omit<Backend, 'activeConnections' | 'totalRequests' | 'totalErrors'>): void {
    if (this.backends.some((b) => b.id === backend.id)) {
      throw new Error(`Le backend « ${backend.id} » existe déjà`)
    }

    this.backends.push({
      ...backend,
      activeConnections: 0,
      totalRequests: 0,
      totalErrors: 0,
    })
  }

  removeBackend(id: string, drain: boolean = true): void {
    const index = this.backends.findIndex((b) => b.id === id)
    if (index === -1) {
      throw new Error(`Backend « ${id} » non trouvé`)
    }

    if (drain) {
      this.drainingBackends.add(id)
      const backend = this.backends[index]
      if (backend) {
        backend.healthy = false
      }
    } else {
      this.backends.splice(index, 1)
    }
  }

  completeDrain(id: string): void {
    this.drainingBackends.delete(id)
    const index = this.backends.findIndex((b) => b.id === id)
    if (index !== -1) {
      this.backends.splice(index, 1)
    }
  }

  select(key?: string): SelectionResult {
    const healthy = this.getHealthyBackends()

    if (healthy.length === 0) {
      throw new Error('Aucun backend sain disponible')
    }

    let backend: Backend

    switch (this.config.strategy) {
      case 'round-robin':
        backend = this.selectRoundRobin(healthy)
        break
      case 'weighted-round-robin':
        backend = this.selectWeightedRoundRobin(healthy)
        break
      case 'least-connections':
        backend = this.selectLeastConnections(healthy)
        break
      case 'random':
        backend = this.selectRandom(healthy)
        break
      case 'consistent-hash':
        if (!key) {
          throw new Error('Une clé est requise pour la stratégie de hachage cohérent')
        }
        backend = this.selectConsistentHash(healthy, key)
        break
      default:
        backend = this.selectRoundRobin(healthy)
    }

    backend.totalRequests++
    backend.activeConnections++

    return { backend, strategy: this.config.strategy }
  }

  release(backendId: string, error: boolean = false): void {
    const backend = this.backends.find((b) => b.id === backendId)
    if (!backend) return

    backend.activeConnections = Math.max(0, backend.activeConnections - 1)
    if (error) {
      backend.totalErrors++
    }
  }

  markHealthy(id: string): void {
    const backend = this.backends.find((b) => b.id === id)
    if (backend && !this.drainingBackends.has(id)) {
      backend.healthy = true
    }
  }

  markUnhealthy(id: string): void {
    const backend = this.backends.find((b) => b.id === id)
    if (backend) {
      backend.healthy = false
    }
  }

  getBackend(id: string): Backend | null {
    const backend = this.backends.find((b) => b.id === id)
    return backend ? { ...backend } : null
  }

  getAllBackends(): Backend[] {
    return this.backends.map((b) => ({ ...b }))
  }

  getHealthyBackends(): Backend[] {
    return this.backends.filter(
      (b) => b.healthy && !this.drainingBackends.has(b.id),
    )
  }

  getMetrics(): LoadBalancerMetrics {
    const requestsPerBackend: Record<string, number> = {}
    for (const b of this.backends) {
      requestsPerBackend[b.id] = b.totalRequests
    }

    return {
      strategy: this.config.strategy,
      totalBackends: this.backends.length,
      healthyBackends: this.getHealthyBackends().length,
      totalRequests: this.backends.reduce((sum, b) => sum + b.totalRequests, 0),
      requestsPerBackend,
    }
  }

  setStrategy(strategy: BalancingStrategy): void {
    this.config.strategy = strategy
    this.currentIndex = 0
    this.weightedIndex = 0
    this.currentWeight = 0
  }

  // ─── Stratégies de sélection ───────────────────────────────────────────

  private selectRoundRobin(backends: Backend[]): Backend {
    this.currentIndex = this.currentIndex % backends.length
    const backend = backends[this.currentIndex]
    this.currentIndex++

    if (!backend) {
      throw new Error('Erreur interne : aucun backend sélectionné')
    }

    return backend
  }

  private selectWeightedRoundRobin(backends: Backend[]): Backend {
    const maxWeight = Math.max(...backends.map((b) => b.weight))
    const gcdWeight = this.gcd(backends.map((b) => b.weight))

    while (true) {
      this.weightedIndex = (this.weightedIndex + 1) % backends.length

      if (this.weightedIndex === 0) {
        this.currentWeight -= gcdWeight
        if (this.currentWeight <= 0) {
          this.currentWeight = maxWeight
        }
      }

      const backend = backends[this.weightedIndex]
      if (backend && backend.weight >= this.currentWeight) {
        return backend
      }
    }
  }

  private selectLeastConnections(backends: Backend[]): Backend {
    let selected = backends[0]
    if (!selected) {
      throw new Error('Aucun backend disponible')
    }

    for (let i = 1; i < backends.length; i++) {
      const candidate = backends[i]
      if (candidate && candidate.activeConnections < selected.activeConnections) {
        selected = candidate
      }
    }

    return selected
  }

  private selectRandom(backends: Backend[]): Backend {
    const index = Math.floor(Math.random() * backends.length)
    const backend = backends[index]

    if (!backend) {
      throw new Error('Erreur interne : aucun backend sélectionné')
    }

    return backend
  }

  private selectConsistentHash(backends: Backend[], key: string): Backend {
    const hashes = backends.map((b) => ({
      backend: b,
      hash: this.hashKey(`${b.id}:${key}`),
    }))

    hashes.sort((a, b) => a.hash - b.hash)
    const keyHash = this.hashKey(key)

    for (const entry of hashes) {
      if (entry.hash >= keyHash) {
        return entry.backend
      }
    }

    const first = hashes[0]
    if (!first) {
      throw new Error('Aucun backend disponible pour le hachage cohérent')
    }

    return first.backend
  }

  // ─── Utilitaires ──────────────────────────────────────────────────────

  private hashKey(key: string): number {
    const digest = createHash('md5').update(key).digest()
    return ((digest[0] ?? 0) << 24) |
      ((digest[1] ?? 0) << 16) |
      ((digest[2] ?? 0) << 8) |
      (digest[3] ?? 0)
  }

  private gcd(values: number[]): number {
    if (values.length === 0) return 1

    let result = values[0] ?? 1
    for (let i = 1; i < values.length; i++) {
      const val = values[i] ?? 1
      result = this.gcdTwo(result, val)
    }
    return result
  }

  private gcdTwo(a: number, b: number): number {
    while (b > 0) {
      const temp = b
      b = a % b
      a = temp
    }
    return a
  }
}
