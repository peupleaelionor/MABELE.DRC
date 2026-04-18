// ─── Bidirectional Data Sync Engine ───────────────────────────────────────────

// ─── Types ────────────────────────────────────────────────────────────────────

export type SyncState = 'IDLE' | 'SYNCING' | 'CONFLICT' | 'ERROR'

export interface SyncStatus {
  state: SyncState
  lastSyncAt: number | null
  lastError: string | null
  pendingChanges: number
  conflicts: SyncConflict[]
  progress: number
}

export interface SyncConflict {
  entityId: string
  entityType: string
  field: string
  localValue: unknown
  remoteValue: unknown
  localClock: VectorClockData
  remoteClock: VectorClockData
  detectedAt: number
}

export interface SyncEntity {
  id: string
  type: string
  data: Record<string, unknown>
  clock: VectorClockData
  updatedAt: number
  deleted?: boolean
}

export interface SyncResult {
  merged: SyncEntity[]
  conflicts: SyncConflict[]
  applied: number
  skipped: number
}

export interface SyncOptions {
  batchSize: number
  maxRetries: number
  retryDelayMs: number
  conflictStrategy: 'LAST_WRITE_WINS' | 'REMOTE_WINS' | 'LOCAL_WINS' | 'MANUAL'
}

export type VectorClockData = Record<string, number>

// ─── Default Options ──────────────────────────────────────────────────────────

const DEFAULT_SYNC_OPTIONS: SyncOptions = {
  batchSize: 50,
  maxRetries: 3,
  retryDelayMs: 1_000,
  conflictStrategy: 'LAST_WRITE_WINS',
}

// ─── Vector Clock ─────────────────────────────────────────────────────────────

export class VectorClock {
  private clock: VectorClockData

  constructor(initial: VectorClockData = {}) {
    this.clock = { ...initial }
  }

  increment(nodeId: string): VectorClock {
    this.clock[nodeId] = (this.clock[nodeId] ?? 0) + 1
    return this
  }

  get(nodeId: string): number {
    return this.clock[nodeId] ?? 0
  }

  merge(other: VectorClock): VectorClock {
    const otherData = other.toJSON()
    const allKeys = new Set([
      ...Object.keys(this.clock),
      ...Object.keys(otherData),
    ])

    for (const key of allKeys) {
      this.clock[key] = Math.max(this.clock[key] ?? 0, otherData[key] ?? 0)
    }

    return this
  }

  compare(other: VectorClock): 'BEFORE' | 'AFTER' | 'CONCURRENT' | 'EQUAL' {
    const otherData = other.toJSON()
    const allKeys = new Set([
      ...Object.keys(this.clock),
      ...Object.keys(otherData),
    ])

    let thisGreater = false
    let otherGreater = false

    for (const key of allKeys) {
      const a = this.clock[key] ?? 0
      const b = otherData[key] ?? 0

      if (a > b) thisGreater = true
      if (b > a) otherGreater = true
    }

    if (!thisGreater && !otherGreater) return 'EQUAL'
    if (thisGreater && !otherGreater) return 'AFTER'
    if (!thisGreater && otherGreater) return 'BEFORE'
    return 'CONCURRENT'
  }

  toJSON(): VectorClockData {
    return { ...this.clock }
  }

  clone(): VectorClock {
    return new VectorClock({ ...this.clock })
  }
}

// ─── Sync Engine ──────────────────────────────────────────────────────────────

export class SyncEngine {
  private status: SyncStatus = {
    state: 'IDLE',
    lastSyncAt: null,
    lastError: null,
    pendingChanges: 0,
    conflicts: [],
    progress: 0,
  }
  private entityStatuses: Map<string, SyncState> = new Map()
  private interruptedBatch: SyncEntity[] | null = null
  private stateListeners: Array<(status: SyncStatus) => void> = []
  private readonly options: SyncOptions

  constructor(options: Partial<SyncOptions> = {}) {
    this.options = { ...DEFAULT_SYNC_OPTIONS, ...options }
  }

  // ─── Core Sync ────────────────────────────────────────────────────────────

  sync(localEntities: SyncEntity[], remoteEntities: SyncEntity[]): SyncResult {
    this.updateState('SYNCING')
    this.status.progress = 0
    this.status.conflicts = []

    const remoteMap = new Map<string, SyncEntity>()
    for (const entity of remoteEntities) {
      remoteMap.set(entity.id, entity)
    }

    const merged: SyncEntity[] = []
    const conflicts: SyncConflict[] = []
    let applied = 0
    let skipped = 0
    const total = localEntities.length + remoteEntities.length

    for (const local of localEntities) {
      const remote = remoteMap.get(local.id)
      remoteMap.delete(local.id)

      if (!remote) {
        merged.push(local)
        applied++
      } else {
        const result = this.mergeEntity(local, remote)
        if (result.conflict) {
          conflicts.push(result.conflict)
          const resolved = this.autoResolve(
            local,
            remote,
            result.conflict,
          )
          if (resolved) {
            merged.push(resolved)
            applied++
          } else {
            merged.push(local)
            skipped++
          }
        } else {
          merged.push(result.entity!)
          applied++
        }
      }
      this.status.progress = Math.round(
        (merged.length / Math.max(total, 1)) * 100,
      )
    }

    for (const remote of remoteMap.values()) {
      merged.push(remote)
      applied++
    }

    this.status.conflicts = conflicts
    this.status.progress = 100

    if (conflicts.length > 0 && this.options.conflictStrategy === 'MANUAL') {
      this.updateState('CONFLICT')
    } else {
      this.updateState('IDLE')
      this.status.lastSyncAt = Date.now()
    }

    return { merged, conflicts, applied, skipped }
  }

  private mergeEntity(
    local: SyncEntity,
    remote: SyncEntity,
  ): { entity?: SyncEntity; conflict?: SyncConflict } {
    const localClock = new VectorClock(local.clock)
    const remoteClock = new VectorClock(remote.clock)
    const comparison = localClock.compare(remoteClock)

    if (comparison === 'EQUAL') {
      return { entity: local }
    }

    if (comparison === 'BEFORE') {
      return { entity: remote }
    }

    if (comparison === 'AFTER') {
      return { entity: local }
    }

    const conflictFields = this.findConflictingFields(local.data, remote.data)
    if (conflictFields.length === 0) {
      const mergedData = { ...remote.data, ...local.data }
      const mergedClock = localClock.merge(remoteClock)
      return {
        entity: {
          ...local,
          data: mergedData,
          clock: mergedClock.toJSON(),
          updatedAt: Math.max(local.updatedAt, remote.updatedAt),
        },
      }
    }

    return {
      conflict: {
        entityId: local.id,
        entityType: local.type,
        field: conflictFields.join(', '),
        localValue: local.data,
        remoteValue: remote.data,
        localClock: local.clock,
        remoteClock: remote.clock,
        detectedAt: Date.now(),
      },
    }
  }

  private findConflictingFields(
    localData: Record<string, unknown>,
    remoteData: Record<string, unknown>,
  ): string[] {
    const conflicts: string[] = []
    const allKeys = new Set([
      ...Object.keys(localData),
      ...Object.keys(remoteData),
    ])

    for (const key of allKeys) {
      const localVal = localData[key]
      const remoteVal = remoteData[key]

      if (localVal === undefined || remoteVal === undefined) continue

      if (JSON.stringify(localVal) !== JSON.stringify(remoteVal)) {
        conflicts.push(key)
      }
    }

    return conflicts
  }

  private autoResolve(
    local: SyncEntity,
    remote: SyncEntity,
    _conflict: SyncConflict,
  ): SyncEntity | null {
    switch (this.options.conflictStrategy) {
      case 'LAST_WRITE_WINS':
        return local.updatedAt >= remote.updatedAt ? local : remote
      case 'REMOTE_WINS':
        return remote
      case 'LOCAL_WINS':
        return local
      case 'MANUAL':
        return null
    }
  }

  // ─── Pull-Push Sync ───────────────────────────────────────────────────────

  pullPushSync(
    localEntities: SyncEntity[],
    pullRemote: () => SyncEntity[],
    pushLocal: (entities: SyncEntity[]) => boolean,
  ): SyncResult {
    this.updateState('SYNCING')

    let remoteEntities: SyncEntity[]
    try {
      remoteEntities = pullRemote()
    } catch (err) {
      this.updateState('ERROR')
      this.status.lastError =
        `Échec de la récupération des données distantes : ${err instanceof Error ? err.message : String(err)}`
      return { merged: localEntities, conflicts: [], applied: 0, skipped: 0 }
    }

    const result = this.sync(localEntities, remoteEntities)

    try {
      const success = pushLocal(result.merged)
      if (!success) {
        this.updateState('ERROR')
        this.status.lastError = 'Échec de l\'envoi des données locales'
      }
    } catch (err) {
      this.updateState('ERROR')
      this.status.lastError =
        `Échec de l'envoi : ${err instanceof Error ? err.message : String(err)}`
    }

    return result
  }

  // ─── Batch Sync ───────────────────────────────────────────────────────────

  *syncBatches(
    localEntities: SyncEntity[],
    remoteEntities: SyncEntity[],
  ): Generator<SyncResult, void, undefined> {
    const batched = this.interruptedBatch
      ? [...this.interruptedBatch, ...localEntities]
      : localEntities

    this.interruptedBatch = null

    for (let i = 0; i < batched.length; i += this.options.batchSize) {
      const batch = batched.slice(i, i + this.options.batchSize)
      const remoteBatch = remoteEntities.filter((r) =>
        batch.some((l) => l.id === r.id),
      )

      const remainingRemote = remoteEntities.filter(
        (r) => !batch.some((l) => l.id === r.id),
      )

      const result = this.sync(batch, remoteBatch)

      if (i + this.options.batchSize < batched.length) {
        this.interruptedBatch = batched.slice(i + this.options.batchSize)
      }

      if (i + this.options.batchSize >= batched.length && remainingRemote.length > 0) {
        result.merged.push(...remainingRemote)
        result.applied += remainingRemote.length
      }

      yield result
    }
  }

  resumeInterruptedSync(remoteEntities: SyncEntity[]): SyncResult | null {
    if (!this.interruptedBatch) return null
    const batch = this.interruptedBatch
    this.interruptedBatch = null
    return this.sync(batch, remoteEntities)
  }

  // ─── Status ───────────────────────────────────────────────────────────────

  getStatus(): SyncStatus {
    return { ...this.status }
  }

  getEntityStatus(entityId: string): SyncState {
    return this.entityStatuses.get(entityId) ?? 'IDLE'
  }

  onStatusChange(listener: (status: SyncStatus) => void): () => void {
    this.stateListeners.push(listener)
    return () => {
      const idx = this.stateListeners.indexOf(listener)
      if (idx >= 0) this.stateListeners.splice(idx, 1)
    }
  }

  private updateState(state: SyncState): void {
    this.status.state = state
    for (const listener of this.stateListeners) {
      listener({ ...this.status })
    }
  }

  reset(): void {
    this.status = {
      state: 'IDLE',
      lastSyncAt: null,
      lastError: null,
      pendingChanges: 0,
      conflicts: [],
      progress: 0,
    }
    this.entityStatuses.clear()
    this.interruptedBatch = null
  }
}
