// ─── Mécanismes de repli (Fallback) ──────────────────────────────────────────
// Chaînes de repli, stale-while-revalidate, dégradation gracieuse
// ──────────────────────────────────────────────────────────────────────────────

// ─── Types ───────────────────────────────────────────────────────────────────

export interface FallbackResult<T> {
  value: T
  source: string
  attempts: number
  usedFallback: boolean
}

export interface StaleEntry<T> {
  value: T
  cachedAt: number
  staleTtlMs: number
}

export interface FallbackMetrics {
  primarySuccesses: number
  fallbackSuccesses: number
  totalFailures: number
  defaultsUsed: number
}

export type FallbackFn<T> = () => Promise<T>

export interface FallbackStrategyConfig<T> {
  name: string
  fn: FallbackFn<T>
  priority?: number
}

// ─── Fonction de repli simple ────────────────────────────────────────────────

export async function withFallback<T>(
  primary: FallbackFn<T>,
  ...fallbacks: FallbackFn<T>[]
): Promise<FallbackResult<T>> {
  let attempts = 0

  try {
    attempts++
    const value = await primary()
    return { value, source: 'primary', attempts, usedFallback: false }
  } catch {
    // Le primaire a échoué, on tente les replis
  }

  for (let i = 0; i < fallbacks.length; i++) {
    const fallback = fallbacks[i]
    if (!fallback) continue

    try {
      attempts++
      const value = await fallback()
      return { value, source: `fallback-${i + 1}`, attempts, usedFallback: true }
    } catch {
      // Ce repli a aussi échoué, on passe au suivant
    }
  }

  throw new Error(
    `Tous les mécanismes de repli ont échoué après ${attempts} tentatives`,
  )
}

// ─── Chaîne de repli ─────────────────────────────────────────────────────────

export class FallbackChain<T> {
  private strategies: Array<FallbackStrategyConfig<T>> = []
  private metrics: FallbackMetrics = {
    primarySuccesses: 0,
    fallbackSuccesses: 0,
    totalFailures: 0,
    defaultsUsed: 0,
  }

  addStrategy(config: FallbackStrategyConfig<T>): void {
    this.strategies.push(config)
    this.strategies.sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0))
  }

  removeStrategy(name: string): boolean {
    const index = this.strategies.findIndex((s) => s.name === name)
    if (index === -1) return false
    this.strategies.splice(index, 1)
    return true
  }

  async execute(defaultValue?: T): Promise<FallbackResult<T>> {
    let attempts = 0

    for (let i = 0; i < this.strategies.length; i++) {
      const strategy = this.strategies[i]
      if (!strategy) continue

      try {
        attempts++
        const value = await strategy.fn()

        if (i === 0) {
          this.metrics.primarySuccesses++
        } else {
          this.metrics.fallbackSuccesses++
        }

        return {
          value,
          source: strategy.name,
          attempts,
          usedFallback: i > 0,
        }
      } catch {
        // Stratégie échouée, on continue
      }
    }

    if (defaultValue !== undefined) {
      this.metrics.defaultsUsed++
      return {
        value: defaultValue,
        source: 'default',
        attempts,
        usedFallback: true,
      }
    }

    this.metrics.totalFailures++
    throw new Error(
      `Toutes les stratégies de la chaîne de repli ont échoué après ${attempts} tentatives`,
    )
  }

  getStrategies(): string[] {
    return this.strategies.map((s) => s.name)
  }

  getMetrics(): FallbackMetrics {
    return { ...this.metrics }
  }

  resetMetrics(): void {
    this.metrics = {
      primarySuccesses: 0,
      fallbackSuccesses: 0,
      totalFailures: 0,
      defaultsUsed: 0,
    }
  }
}

// ─── Stale-While-Revalidate ──────────────────────────────────────────────────

export class StaleWhileRevalidate<T> {
  private cache = new Map<string, StaleEntry<T>>()
  private revalidating = new Set<string>()

  constructor(private readonly defaultStaleTtlMs: number = 60_000) {}

  async get(
    key: string,
    fetcher: () => Promise<T>,
    staleTtlMs?: number,
  ): Promise<FallbackResult<T>> {
    const cached = this.cache.get(key)
    const ttl = staleTtlMs ?? this.defaultStaleTtlMs

    if (cached) {
      const age = Date.now() - cached.cachedAt
      const isStale = age > cached.staleTtlMs

      if (!isStale) {
        return { value: cached.value, source: 'cache', attempts: 0, usedFallback: false }
      }

      // Données périmées : les retourner mais revalider en arrière-plan
      if (!this.revalidating.has(key)) {
        this.revalidateInBackground(key, fetcher, ttl)
      }

      return { value: cached.value, source: 'stale-cache', attempts: 0, usedFallback: true }
    }

    // Pas de cache : récupérer de manière synchrone
    try {
      const value = await fetcher()
      this.cache.set(key, {
        value,
        cachedAt: Date.now(),
        staleTtlMs: ttl,
      })
      return { value, source: 'fetcher', attempts: 1, usedFallback: false }
    } catch {
      throw new Error(`Impossible de récupérer la valeur pour la clé « ${key} »`)
    }
  }

  invalidate(key: string): void {
    this.cache.delete(key)
  }

  clear(): void {
    this.cache.clear()
    this.revalidating.clear()
  }

  private revalidateInBackground(
    key: string,
    fetcher: () => Promise<T>,
    staleTtlMs: number,
  ): void {
    this.revalidating.add(key)

    void fetcher()
      .then((value) => {
        this.cache.set(key, {
          value,
          cachedAt: Date.now(),
          staleTtlMs,
        })
      })
      .finally(() => {
        this.revalidating.delete(key)
      })
  }
}

// ─── Dégradation gracieuse ───────────────────────────────────────────────────

export class GracefulDegradation<T> {
  private readonly full: FallbackFn<T>
  private readonly reduced: FallbackFn<T>
  private readonly minimal: FallbackFn<T>
  private degraded = false

  constructor(options: {
    full: FallbackFn<T>
    reduced: FallbackFn<T>
    minimal: FallbackFn<T>
  }) {
    this.full = options.full
    this.reduced = options.reduced
    this.minimal = options.minimal
  }

  async execute(): Promise<FallbackResult<T>> {
    if (!this.degraded) {
      try {
        const value = await this.full()
        return { value, source: 'full', attempts: 1, usedFallback: false }
      } catch {
        this.degraded = true
      }
    }

    try {
      const value = await this.reduced()
      return { value, source: 'reduced', attempts: 2, usedFallback: true }
    } catch {
      // Mode réduit échoué, on passe au minimal
    }

    try {
      const value = await this.minimal()
      return { value, source: 'minimal', attempts: 3, usedFallback: true }
    } catch {
      throw new Error('Tous les niveaux de dégradation ont échoué')
    }
  }

  isDegraded(): boolean {
    return this.degraded
  }

  recover(): void {
    this.degraded = false
  }
}

// ─── Valeur par défaut ───────────────────────────────────────────────────────

export async function withDefault<T>(
  fn: FallbackFn<T>,
  defaultValue: T,
): Promise<FallbackResult<T>> {
  try {
    const value = await fn()
    return { value, source: 'primary', attempts: 1, usedFallback: false }
  } catch {
    return { value: defaultValue, source: 'default', attempts: 1, usedFallback: true }
  }
}
