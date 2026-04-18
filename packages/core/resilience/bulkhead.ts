// ─── Cloison étanche (Bulkhead) ──────────────────────────────────────────────
// Limite les exécutions concurrentes pour isoler les ressources
// ──────────────────────────────────────────────────────────────────────────────

// ─── Types ───────────────────────────────────────────────────────────────────

export interface BulkheadConfig {
  maxConcurrent?: number
  maxWaitQueue?: number
  timeoutMs?: number
  name?: string
}

export interface BulkheadMetrics {
  name: string
  activeCount: number
  queuedCount: number
  rejectedCount: number
  completedCount: number
  timedOutCount: number
  maxConcurrent: number
  maxWaitQueue: number
  averageExecutionMs: number
}

interface QueuedTask<T> {
  fn: () => Promise<T>
  resolve: (value: T) => void
  reject: (error: Error) => void
  queuedAt: number
}

// ─── Constantes ──────────────────────────────────────────────────────────────

const DEFAULT_CONFIG: Required<BulkheadConfig> = {
  maxConcurrent: 10,
  maxWaitQueue: 50,
  timeoutMs: 30_000,
  name: 'default',
}

// ─── Bulkhead ────────────────────────────────────────────────────────────────

export class Bulkhead {
  private activeCount = 0
  private readonly queue: Array<QueuedTask<unknown>> = []
  private rejectedCount = 0
  private completedCount = 0
  private timedOutCount = 0
  private totalExecutionMs = 0
  private readonly config: Required<BulkheadConfig>

  constructor(config: BulkheadConfig = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config }
  }

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.activeCount < this.config.maxConcurrent) {
      return this.run(fn)
    }

    if (this.queue.length >= this.config.maxWaitQueue) {
      this.rejectedCount++
      throw new Error(
        `Cloison « ${this.config.name} » saturée : ${this.activeCount} exécutions actives, ${this.queue.length} en file d'attente`,
      )
    }

    return this.enqueue(fn)
  }

  getMetrics(): BulkheadMetrics {
    return {
      name: this.config.name,
      activeCount: this.activeCount,
      queuedCount: this.queue.length,
      rejectedCount: this.rejectedCount,
      completedCount: this.completedCount,
      timedOutCount: this.timedOutCount,
      maxConcurrent: this.config.maxConcurrent,
      maxWaitQueue: this.config.maxWaitQueue,
      averageExecutionMs: this.completedCount > 0
        ? this.totalExecutionMs / this.completedCount
        : 0,
    }
  }

  getActiveCount(): number {
    return this.activeCount
  }

  getQueuedCount(): number {
    return this.queue.length
  }

  getName(): string {
    return this.config.name
  }

  drain(): void {
    while (this.queue.length > 0) {
      const task = this.queue.shift()
      if (task) {
        task.reject(new Error(`Cloison « ${this.config.name} » vidée : tâche annulée`))
      }
    }
  }

  reset(): void {
    this.drain()
    this.activeCount = 0
    this.rejectedCount = 0
    this.completedCount = 0
    this.timedOutCount = 0
    this.totalExecutionMs = 0
  }

  private async run<T>(fn: () => Promise<T>): Promise<T> {
    this.activeCount++
    const startTime = Date.now()

    try {
      let result: T

      if (this.config.timeoutMs > 0) {
        result = await this.withTimeout(fn, this.config.timeoutMs)
      } else {
        result = await fn()
      }

      this.completedCount++
      this.totalExecutionMs += Date.now() - startTime
      return result
    } catch (error) {
      if (error instanceof BulkheadTimeoutError) {
        this.timedOutCount++
      }
      throw error
    } finally {
      this.activeCount--
      this.processQueue()
    }
  }

  private enqueue<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.queue.push({
        fn: fn as () => Promise<unknown>,
        resolve: resolve as (value: unknown) => void,
        reject,
        queuedAt: Date.now(),
      })
    })
  }

  private processQueue(): void {
    while (this.activeCount < this.config.maxConcurrent && this.queue.length > 0) {
      const task = this.queue.shift()
      if (!task) break

      const elapsed = Date.now() - task.queuedAt
      if (this.config.timeoutMs > 0 && elapsed >= this.config.timeoutMs) {
        this.timedOutCount++
        task.reject(
          new BulkheadTimeoutError(
            `Tâche expirée dans la file d'attente après ${elapsed} ms`,
          ),
        )
        continue
      }

      this.activeCount++
      const startTime = Date.now()

      const remainingTimeout = this.config.timeoutMs > 0
        ? Math.max(1, this.config.timeoutMs - elapsed)
        : 0

      const execute = remainingTimeout > 0
        ? this.withTimeout(task.fn, remainingTimeout)
        : task.fn()

      execute
        .then((result) => {
          this.completedCount++
          this.totalExecutionMs += Date.now() - startTime
          task.resolve(result)
        })
        .catch((error: Error) => {
          if (error instanceof BulkheadTimeoutError) {
            this.timedOutCount++
          }
          task.reject(error)
        })
        .finally(() => {
          this.activeCount--
          this.processQueue()
        })
    }
  }

  private withTimeout<T>(fn: () => Promise<T>, timeoutMs: number): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(
          new BulkheadTimeoutError(
            `Exécution expirée après ${timeoutMs} ms dans la cloison « ${this.config.name} »`,
          ),
        )
      }, timeoutMs)

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
}

// ─── Erreur de timeout ───────────────────────────────────────────────────────

export class BulkheadTimeoutError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'BulkheadTimeoutError'
  }
}
