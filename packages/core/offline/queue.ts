// ─── Offline Action Queue ─────────────────────────────────────────────────────

// ─── Types ────────────────────────────────────────────────────────────────────

export type QueuedActionStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'FAILED'
  | 'CANCELLED'

export type QueuePriority = 'LOW' | 'NORMAL' | 'HIGH' | 'CRITICAL'

export interface QueuedAction {
  id: string
  type: string
  payload: unknown
  timestamp: number
  retryCount: number
  maxRetries: number
  status: QueuedActionStatus
  priority: QueuePriority
  error?: string
  lastAttemptAt?: number
  deduplicationKey?: string
}

export interface QueueOptions {
  maxSize: number
  defaultMaxRetries: number
  evictionPolicy: 'LRU' | 'OLDEST' | 'LOWEST_PRIORITY'
  enableDeduplication: boolean
}

export type ActionExecutor = (action: QueuedAction) => Promise<boolean> | boolean

// ─── Default Options ──────────────────────────────────────────────────────────

const DEFAULT_OPTIONS: QueueOptions = {
  maxSize: 1_000,
  defaultMaxRetries: 3,
  evictionPolicy: 'LRU',
  enableDeduplication: true,
}

// ─── Priority Weights ─────────────────────────────────────────────────────────

const PRIORITY_WEIGHT: Record<QueuePriority, number> = {
  LOW: 0,
  NORMAL: 1,
  HIGH: 2,
  CRITICAL: 3,
}

// ─── ID Generation ────────────────────────────────────────────────────────────

let queueIdCounter = 0

function generateQueueId(): string {
  queueIdCounter += 1
  return `qa_${Date.now()}_${queueIdCounter}`
}

// ─── Offline Queue ────────────────────────────────────────────────────────────

export class OfflineQueue {
  private queue: QueuedAction[] = []
  private completedIds: Set<string> = new Set()
  private readonly options: QueueOptions

  constructor(options: Partial<QueueOptions> = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options }
  }

  // ─── Core Operations ─────────────────────────────────────────────────────

  enqueue(
    type: string,
    payload: unknown,
    opts?: {
      priority?: QueuePriority
      maxRetries?: number
      deduplicationKey?: string
    },
  ): QueuedAction {
    const deduplicationKey = opts?.deduplicationKey
    if (this.options.enableDeduplication && deduplicationKey) {
      const existing = this.queue.find(
        (a) =>
          a.deduplicationKey === deduplicationKey &&
          a.status === 'PENDING',
      )
      if (existing) {
        return existing
      }
    }

    if (this.queue.length >= this.options.maxSize) {
      this.evict()
    }

    const action: QueuedAction = {
      id: generateQueueId(),
      type,
      payload,
      timestamp: Date.now(),
      retryCount: 0,
      maxRetries: opts?.maxRetries ?? this.options.defaultMaxRetries,
      status: 'PENDING',
      priority: opts?.priority ?? 'NORMAL',
      deduplicationKey,
    }

    const insertIdx = this.findInsertIndex(action.priority)
    this.queue.splice(insertIdx, 0, action)

    return action
  }

  dequeue(): QueuedAction | undefined {
    const idx = this.queue.findIndex((a) => a.status === 'PENDING')
    if (idx === -1) return undefined

    const action = this.queue[idx]!
    action.status = 'PROCESSING'
    action.lastAttemptAt = Date.now()
    return action
  }

  peek(): QueuedAction | undefined {
    return this.queue.find((a) => a.status === 'PENDING')
  }

  // ─── Flush ────────────────────────────────────────────────────────────────

  async flush(executor: ActionExecutor): Promise<{
    succeeded: number
    failed: number
    remaining: number
  }> {
    let succeeded = 0
    let failed = 0

    while (true) {
      const action = this.dequeue()
      if (!action) break

      try {
        const result = await executor(action)
        if (result) {
          this.complete(action.id)
          succeeded++
        } else {
          this.fail(action.id, 'Exécution échouée')
          failed++
        }
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : 'Erreur inconnue'
        this.fail(action.id, msg)
        failed++
      }
    }

    return {
      succeeded,
      failed,
      remaining: this.getPendingCount(),
    }
  }

  // ─── Action Lifecycle ─────────────────────────────────────────────────────

  complete(actionId: string): boolean {
    const action = this.findById(actionId)
    if (!action) return false

    action.status = 'COMPLETED'
    this.completedIds.add(actionId)
    this.removeFromQueue(actionId)
    return true
  }

  fail(actionId: string, error: string): boolean {
    const action = this.findById(actionId)
    if (!action) return false

    action.retryCount += 1
    action.error = error
    action.lastAttemptAt = Date.now()

    if (action.retryCount >= action.maxRetries) {
      action.status = 'FAILED'
    } else {
      action.status = 'PENDING'
    }

    return true
  }

  cancel(actionId: string): boolean {
    const action = this.findById(actionId)
    if (!action) return false
    if (action.status === 'COMPLETED') return false

    action.status = 'CANCELLED'
    this.removeFromQueue(actionId)
    return true
  }

  retry(actionId: string): boolean {
    const action = this.findById(actionId)
    if (!action) return false
    if (action.status !== 'FAILED') return false

    action.status = 'PENDING'
    action.retryCount = 0
    action.error = undefined
    return true
  }

  // ─── Priority Insert ─────────────────────────────────────────────────────

  private findInsertIndex(priority: QueuePriority): number {
    const weight = PRIORITY_WEIGHT[priority]

    for (let i = 0; i < this.queue.length; i++) {
      const existing = this.queue[i]!
      if (
        existing.status === 'PENDING' &&
        PRIORITY_WEIGHT[existing.priority] < weight
      ) {
        return i
      }
    }

    return this.queue.length
  }

  // ─── Eviction ─────────────────────────────────────────────────────────────

  private evict(): void {
    switch (this.options.evictionPolicy) {
      case 'LRU':
        this.evictLRU()
        break
      case 'OLDEST':
        this.evictOldest()
        break
      case 'LOWEST_PRIORITY':
        this.evictLowestPriority()
        break
    }
  }

  private evictLRU(): void {
    let lruIdx = -1
    let lruTime = Infinity

    for (let i = this.queue.length - 1; i >= 0; i--) {
      const action = this.queue[i]!
      if (action.status === 'PENDING' && action.priority !== 'CRITICAL') {
        const accessTime = action.lastAttemptAt ?? action.timestamp
        if (accessTime < lruTime) {
          lruTime = accessTime
          lruIdx = i
        }
      }
    }

    if (lruIdx >= 0) {
      this.queue.splice(lruIdx, 1)
    }
  }

  private evictOldest(): void {
    for (let i = this.queue.length - 1; i >= 0; i--) {
      const action = this.queue[i]!
      if (action.status === 'PENDING' && action.priority !== 'CRITICAL') {
        this.queue.splice(i, 1)
        return
      }
    }
  }

  private evictLowestPriority(): void {
    let lowestIdx = -1
    let lowestWeight = Infinity

    for (let i = this.queue.length - 1; i >= 0; i--) {
      const action = this.queue[i]!
      if (action.status === 'PENDING') {
        const weight = PRIORITY_WEIGHT[action.priority]
        if (weight < lowestWeight) {
          lowestWeight = weight
          lowestIdx = i
        }
      }
    }

    if (lowestIdx >= 0) {
      this.queue.splice(lowestIdx, 1)
    }
  }

  // ─── Queries ──────────────────────────────────────────────────────────────

  findById(actionId: string): QueuedAction | undefined {
    return this.queue.find((a) => a.id === actionId)
  }

  getPending(): QueuedAction[] {
    return this.queue.filter((a) => a.status === 'PENDING')
  }

  getFailed(): QueuedAction[] {
    return this.queue.filter((a) => a.status === 'FAILED')
  }

  getPendingCount(): number {
    return this.queue.filter((a) => a.status === 'PENDING').length
  }

  size(): number {
    return this.queue.length
  }

  isEmpty(): boolean {
    return this.queue.length === 0
  }

  // ─── Serialization ───────────────────────────────────────────────────────

  serialize(): string {
    const serializable = this.queue.filter(
      (a) => a.status === 'PENDING' || a.status === 'FAILED',
    )
    return JSON.stringify(serializable)
  }

  deserialize(data: string): number {
    let parsed: unknown[]
    try {
      parsed = JSON.parse(data) as unknown[]
    } catch {
      throw new Error('Données de file invalides : format JSON incorrect')
    }

    if (!Array.isArray(parsed)) {
      throw new Error('Données de file invalides : tableau attendu')
    }

    let restored = 0
    for (const item of parsed) {
      if (isQueuedAction(item)) {
        item.status = 'PENDING'
        this.queue.push(item)
        restored++
      }
    }

    return restored
  }

  // ─── Cleanup ──────────────────────────────────────────────────────────────

  clear(): void {
    this.queue = []
    this.completedIds.clear()
  }

  removeCompleted(): number {
    const before = this.queue.length
    this.queue = this.queue.filter((a) => a.status !== 'COMPLETED')
    return before - this.queue.length
  }

  private removeFromQueue(actionId: string): void {
    const idx = this.queue.findIndex((a) => a.id === actionId)
    if (idx >= 0) {
      this.queue.splice(idx, 1)
    }
  }
}

// ─── Type Guard ───────────────────────────────────────────────────────────────

function isQueuedAction(value: unknown): value is QueuedAction {
  if (typeof value !== 'object' || value === null) return false
  const obj = value as Record<string, unknown>
  return (
    typeof obj['id'] === 'string' &&
    typeof obj['type'] === 'string' &&
    typeof obj['timestamp'] === 'number' &&
    typeof obj['retryCount'] === 'number' &&
    typeof obj['status'] === 'string'
  )
}
