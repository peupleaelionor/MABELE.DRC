// ─── Conflict Detection and Resolution ────────────────────────────────────────

// ─── Types ────────────────────────────────────────────────────────────────────

export type ConflictType =
  | 'CONCURRENT_EDIT'
  | 'DELETE_UPDATE'
  | 'SCHEMA_MISMATCH'

export type ResolutionStrategy =
  | 'LAST_WRITE_WINS'
  | 'REMOTE_WINS'
  | 'LOCAL_WINS'
  | 'MANUAL'
  | 'MERGE'

export interface Conflict {
  id: string
  entityId: string
  entityType: string
  type: ConflictType
  field: string
  localValue: unknown
  remoteValue: unknown
  localTimestamp: number
  remoteTimestamp: number
  resolution?: ResolvedConflict
  detectedAt: number
}

export interface ResolvedConflict {
  strategy: ResolutionStrategy
  resolvedValue: unknown
  resolvedAt: number
  resolvedBy: 'AUTO' | 'USER'
}

export interface ConflictLogEntry {
  conflict: Conflict
  resolution: ResolvedConflict
  timestamp: number
}

// ─── ID Generation ────────────────────────────────────────────────────────────

let conflictIdCounter = 0

function generateConflictId(): string {
  conflictIdCounter += 1
  return `cnf_${Date.now()}_${conflictIdCounter}`
}

// ─── Conflict Detection ──────────────────────────────────────────────────────

export function detectConflicts(
  localEntity: Record<string, unknown>,
  remoteEntity: Record<string, unknown>,
  entityId: string,
  entityType: string,
  localTimestamp: number,
  remoteTimestamp: number,
): Conflict[] {
  const conflicts: Conflict[] = []
  const allKeys = new Set([
    ...Object.keys(localEntity),
    ...Object.keys(remoteEntity),
  ])

  for (const key of allKeys) {
    const localVal = localEntity[key]
    const remoteVal = remoteEntity[key]

    if (localVal === undefined && remoteVal !== undefined) {
      conflicts.push(
        createConflict(
          entityId,
          entityType,
          'DELETE_UPDATE',
          key,
          localVal,
          remoteVal,
          localTimestamp,
          remoteTimestamp,
        ),
      )
      continue
    }

    if (localVal !== undefined && remoteVal === undefined) {
      conflicts.push(
        createConflict(
          entityId,
          entityType,
          'DELETE_UPDATE',
          key,
          localVal,
          remoteVal,
          localTimestamp,
          remoteTimestamp,
        ),
      )
      continue
    }

    if (
      localVal !== undefined &&
      remoteVal !== undefined &&
      JSON.stringify(localVal) !== JSON.stringify(remoteVal)
    ) {
      const type = areSameType(localVal, remoteVal)
        ? 'CONCURRENT_EDIT'
        : 'SCHEMA_MISMATCH'

      conflicts.push(
        createConflict(
          entityId,
          entityType,
          type,
          key,
          localVal,
          remoteVal,
          localTimestamp,
          remoteTimestamp,
        ),
      )
    }
  }

  return conflicts
}

function createConflict(
  entityId: string,
  entityType: string,
  type: ConflictType,
  field: string,
  localValue: unknown,
  remoteValue: unknown,
  localTimestamp: number,
  remoteTimestamp: number,
): Conflict {
  return {
    id: generateConflictId(),
    entityId,
    entityType,
    type,
    field,
    localValue,
    remoteValue,
    localTimestamp,
    remoteTimestamp,
    detectedAt: Date.now(),
  }
}

function areSameType(a: unknown, b: unknown): boolean {
  return typeof a === typeof b
}

// ─── Conflict Resolution ─────────────────────────────────────────────────────

export function resolveConflict(
  conflict: Conflict,
  strategy: ResolutionStrategy,
  manualValue?: unknown,
): ResolvedConflict {
  let resolvedValue: unknown

  switch (strategy) {
    case 'LAST_WRITE_WINS':
      resolvedValue =
        conflict.localTimestamp >= conflict.remoteTimestamp
          ? conflict.localValue
          : conflict.remoteValue
      break

    case 'REMOTE_WINS':
      resolvedValue = conflict.remoteValue
      break

    case 'LOCAL_WINS':
      resolvedValue = conflict.localValue
      break

    case 'MERGE':
      resolvedValue = mergeValues(conflict.localValue, conflict.remoteValue)
      break

    case 'MANUAL':
      if (manualValue === undefined) {
        throw new Error(
          'Valeur manuelle requise pour la stratégie de résolution MANUAL',
        )
      }
      resolvedValue = manualValue
      break
  }

  const resolution: ResolvedConflict = {
    strategy,
    resolvedValue,
    resolvedAt: Date.now(),
    resolvedBy: strategy === 'MANUAL' ? 'USER' : 'AUTO',
  }

  conflict.resolution = resolution
  return resolution
}

function mergeValues(local: unknown, remote: unknown): unknown {
  if (
    typeof local === 'object' &&
    local !== null &&
    typeof remote === 'object' &&
    remote !== null &&
    !Array.isArray(local) &&
    !Array.isArray(remote)
  ) {
    return fieldLevelMerge(
      local as Record<string, unknown>,
      remote as Record<string, unknown>,
    )
  }

  if (Array.isArray(local) && Array.isArray(remote)) {
    return mergeArrays(local, remote)
  }

  return remote
}

// ─── Field-Level Merge ───────────────────────────────────────────────────────

export function fieldLevelMerge(
  local: Record<string, unknown>,
  remote: Record<string, unknown>,
): Record<string, unknown> {
  const result: Record<string, unknown> = {}
  const allKeys = new Set([
    ...Object.keys(local),
    ...Object.keys(remote),
  ])

  for (const key of allKeys) {
    const localVal = local[key]
    const remoteVal = remote[key]

    if (localVal === undefined) {
      result[key] = remoteVal
    } else if (remoteVal === undefined) {
      result[key] = localVal
    } else if (JSON.stringify(localVal) === JSON.stringify(remoteVal)) {
      result[key] = localVal
    } else {
      // En cas de conflit sur un champ, le distant l'emporte
      result[key] = remoteVal
    }
  }

  return result
}

function mergeArrays(local: unknown[], remote: unknown[]): unknown[] {
  const seen = new Set<string>()
  const result: unknown[] = []

  for (const item of [...local, ...remote]) {
    const key = JSON.stringify(item)
    if (!seen.has(key)) {
      seen.add(key)
      result.push(item)
    }
  }

  return result
}

// ─── Conflict Log ─────────────────────────────────────────────────────────────

export class ConflictLog {
  private log: ConflictLogEntry[] = []
  private readonly maxEntries: number

  constructor(maxEntries = 1_000) {
    this.maxEntries = maxEntries
  }

  record(conflict: Conflict, resolution: ResolvedConflict): void {
    this.log.push({
      conflict,
      resolution,
      timestamp: Date.now(),
    })

    if (this.log.length > this.maxEntries) {
      this.log.splice(0, this.log.length - this.maxEntries)
    }
  }

  getEntries(
    filter?: { entityType?: string; type?: ConflictType },
  ): ConflictLogEntry[] {
    if (!filter) return [...this.log]

    return this.log.filter((entry) => {
      if (filter.entityType && entry.conflict.entityType !== filter.entityType) {
        return false
      }
      if (filter.type && entry.conflict.type !== filter.type) {
        return false
      }
      return true
    })
  }

  getByEntity(entityId: string): ConflictLogEntry[] {
    return this.log.filter((entry) => entry.conflict.entityId === entityId)
  }

  getRecent(count: number): ConflictLogEntry[] {
    return this.log.slice(-count)
  }

  size(): number {
    return this.log.length
  }

  clear(): void {
    this.log = []
  }

  getStats(): {
    total: number
    byType: Record<ConflictType, number>
    byStrategy: Record<ResolutionStrategy, number>
    autoResolved: number
    manualResolved: number
  } {
    const byType: Record<string, number> = {}
    const byStrategy: Record<string, number> = {}
    let autoResolved = 0
    let manualResolved = 0

    for (const entry of this.log) {
      const ct = entry.conflict.type
      byType[ct] = (byType[ct] ?? 0) + 1

      const st = entry.resolution.strategy
      byStrategy[st] = (byStrategy[st] ?? 0) + 1

      if (entry.resolution.resolvedBy === 'AUTO') autoResolved++
      else manualResolved++
    }

    return {
      total: this.log.length,
      byType: byType as Record<ConflictType, number>,
      byStrategy: byStrategy as Record<ResolutionStrategy, number>,
      autoResolved,
      manualResolved,
    }
  }
}

// ─── Batch Resolution ─────────────────────────────────────────────────────────

export function resolveAllConflicts(
  conflicts: Conflict[],
  strategy: ResolutionStrategy,
  log?: ConflictLog,
): ResolvedConflict[] {
  return conflicts.map((conflict) => {
    const resolution = resolveConflict(conflict, strategy)
    log?.record(conflict, resolution)
    return resolution
  })
}

export function applyResolutions(
  entity: Record<string, unknown>,
  conflicts: Conflict[],
): Record<string, unknown> {
  const result = { ...entity }

  for (const conflict of conflicts) {
    if (conflict.resolution) {
      result[conflict.field] = conflict.resolution.resolvedValue
    }
  }

  return result
}
