// ─── Préchauffage de cache ───────────────────────────────────────────────────
// Préchauffage proactif, prédictif et par priorité
// ──────────────────────────────────────────────────────────────────────────────

// ─── Types ───────────────────────────────────────────────────────────────────

export interface WarmingJob {
  key: string
  fetcher: () => Promise<string>
  priority: number
  schedule?: CronLikeSchedule
  lastWarmedAt: number | null
  warmCount: number
  averageDurationMs: number
}

export interface CronLikeSchedule {
  intervalMs: number
  startAt?: number
}

export interface WarmingResult {
  key: string
  success: boolean
  durationMs: number
  error?: string
  warmedAt: number
}

export interface WarmingStats {
  totalJobs: number
  totalWarms: number
  successfulWarms: number
  failedWarms: number
  averageDurationMs: number
  lastWarmAt: number | null
}

export interface AccessPattern {
  key: string
  accessCount: number
  lastAccessedAt: number
  averageIntervalMs: number | null
}

export interface CacheWarmerConfig {
  maxConcurrent?: number
  defaultPriority?: number
  maxRetries?: number
  retryDelayMs?: number
}

// ─── CacheWarmer ─────────────────────────────────────────────────────────────

export class CacheWarmer {
  private jobs = new Map<string, WarmingJob>()
  private results: WarmingResult[] = []
  private accessPatterns = new Map<string, AccessPattern>()
  private scheduledTimers = new Map<string, ReturnType<typeof setInterval>>()
  private readonly config: Required<CacheWarmerConfig>

  constructor(config: CacheWarmerConfig = {}) {
    this.config = {
      maxConcurrent: config.maxConcurrent ?? 5,
      defaultPriority: config.defaultPriority ?? 5,
      maxRetries: config.maxRetries ?? 3,
      retryDelayMs: config.retryDelayMs ?? 1000,
    }
  }

  registerJob(
    key: string,
    fetcher: () => Promise<string>,
    options: { priority?: number; schedule?: CronLikeSchedule } = {},
  ): void {
    if (!key) {
      throw new Error('La clé du job de préchauffage ne peut pas être vide')
    }

    this.jobs.set(key, {
      key,
      fetcher,
      priority: options.priority ?? this.config.defaultPriority,
      schedule: options.schedule,
      lastWarmedAt: null,
      warmCount: 0,
      averageDurationMs: 0,
    })
  }

  unregisterJob(key: string): boolean {
    const timer = this.scheduledTimers.get(key)
    if (timer) {
      clearInterval(timer)
      this.scheduledTimers.delete(key)
    }
    return this.jobs.delete(key)
  }

  async warmKey(
    key: string,
    fetcher: () => Promise<string>,
  ): Promise<WarmingResult> {
    const startTime = Date.now()

    try {
      await fetcher()
      const durationMs = Date.now() - startTime

      const result: WarmingResult = {
        key,
        success: true,
        durationMs,
        warmedAt: Date.now(),
      }

      this.results.push(result)
      this.updateJobStats(key, durationMs)
      return result
    } catch (err) {
      const durationMs = Date.now() - startTime
      const result: WarmingResult = {
        key,
        success: false,
        durationMs,
        error: err instanceof Error ? err.message : 'Erreur inconnue',
        warmedAt: Date.now(),
      }

      this.results.push(result)
      return result
    }
  }

  async warmBatch(
    entries: Array<{ key: string; fetcher: () => Promise<string> }>,
  ): Promise<WarmingResult[]> {
    const results: WarmingResult[] = []
    const queue = [...entries]

    while (queue.length > 0) {
      const batch = queue.splice(0, this.config.maxConcurrent)
      const batchResults = await Promise.all(
        batch.map((entry) => this.warmKey(entry.key, entry.fetcher)),
      )
      results.push(...batchResults)
    }

    return results
  }

  async warmAllRegistered(): Promise<WarmingResult[]> {
    const sortedJobs = Array.from(this.jobs.values()).sort(
      (a, b) => b.priority - a.priority,
    )

    const entries = sortedJobs.map((job) => ({
      key: job.key,
      fetcher: job.fetcher,
    }))

    return this.warmBatch(entries)
  }

  startScheduledWarming(): void {
    for (const [key, job] of this.jobs) {
      if (!job.schedule) continue
      if (this.scheduledTimers.has(key)) continue

      const timer = setInterval(() => {
        void this.warmKey(key, job.fetcher)
      }, job.schedule.intervalMs)

      this.scheduledTimers.set(key, timer)
    }
  }

  stopScheduledWarming(): void {
    for (const [key, timer] of this.scheduledTimers) {
      clearInterval(timer)
      this.scheduledTimers.delete(key)
    }
  }

  // ─── Préchauffage prédictif ────────────────────────────────────────────

  recordAccess(key: string): void {
    const existing = this.accessPatterns.get(key)
    const now = Date.now()

    if (!existing) {
      this.accessPatterns.set(key, {
        key,
        accessCount: 1,
        lastAccessedAt: now,
        averageIntervalMs: null,
      })
      return
    }

    const interval = now - existing.lastAccessedAt
    const prevAvg = existing.averageIntervalMs
    existing.accessCount++
    existing.lastAccessedAt = now
    existing.averageIntervalMs = prevAvg
      ? (prevAvg * (existing.accessCount - 2) + interval) / (existing.accessCount - 1)
      : interval
    this.accessPatterns.set(key, existing)
  }

  getPredictedWarmKeys(windowMs: number = 60_000): string[] {
    const now = Date.now()
    const candidates: Array<{ key: string; score: number }> = []

    for (const [key, pattern] of this.accessPatterns) {
      if (!pattern.averageIntervalMs) continue

      const timeSinceLastAccess = now - pattern.lastAccessedAt
      const nextPredicted = pattern.lastAccessedAt + pattern.averageIntervalMs

      if (nextPredicted <= now + windowMs && timeSinceLastAccess > 0) {
        const score = pattern.accessCount / (timeSinceLastAccess / 1000)
        candidates.push({ key, score })
      }
    }

    return candidates
      .sort((a, b) => b.score - a.score)
      .map((c) => c.key)
  }

  // ─── Démarrage à froid ─────────────────────────────────────────────────

  async coldStartWarm(
    essentialKeys: Array<{ key: string; fetcher: () => Promise<string>; priority?: number }>,
  ): Promise<WarmingResult[]> {
    const sorted = [...essentialKeys].sort(
      (a, b) => (b.priority ?? this.config.defaultPriority) - (a.priority ?? this.config.defaultPriority),
    )

    return this.warmBatch(
      sorted.map((e) => ({ key: e.key, fetcher: e.fetcher })),
    )
  }

  // ─── Statistiques ──────────────────────────────────────────────────────

  getStats(): WarmingStats {
    const successful = this.results.filter((r) => r.success)
    const failed = this.results.filter((r) => !r.success)
    const totalDuration = this.results.reduce((sum, r) => sum + r.durationMs, 0)
    const lastResult = this.results[this.results.length - 1]

    return {
      totalJobs: this.jobs.size,
      totalWarms: this.results.length,
      successfulWarms: successful.length,
      failedWarms: failed.length,
      averageDurationMs: this.results.length > 0 ? totalDuration / this.results.length : 0,
      lastWarmAt: lastResult?.warmedAt ?? null,
    }
  }

  getAccessPatterns(): AccessPattern[] {
    return Array.from(this.accessPatterns.values())
  }

  clearResults(): void {
    this.results = []
  }

  private updateJobStats(key: string, durationMs: number): void {
    const job = this.jobs.get(key)
    if (!job) return

    const prevAvg = job.averageDurationMs
    job.warmCount++
    job.lastWarmedAt = Date.now()
    job.averageDurationMs = prevAvg
      ? (prevAvg * (job.warmCount - 1) + durationMs) / job.warmCount
      : durationMs
  }
}
