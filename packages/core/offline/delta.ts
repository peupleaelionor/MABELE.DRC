// ─── Delta Sync: Transmit Only Changes ────────────────────────────────────────

// ─── Types ────────────────────────────────────────────────────────────────────

export type DeltaOperation = 'add' | 'remove' | 'replace' | 'move'

export interface DeltaPatch {
  operations: DeltaOp[]
  timestamp: number
  checksum: string
}

export interface DeltaOp {
  op: DeltaOperation
  path: string
  value?: unknown
  from?: string
}

// ─── Delta Encoder ────────────────────────────────────────────────────────────

export class DeltaEncoder {
  computeDelta(
    before: Record<string, unknown>,
    after: Record<string, unknown>,
  ): DeltaPatch {
    const operations: DeltaOp[] = []
    this.diffObjects('', before, after, operations)

    return {
      operations,
      timestamp: Date.now(),
      checksum: this.computeChecksum(after),
    }
  }

  private diffObjects(
    basePath: string,
    before: Record<string, unknown>,
    after: Record<string, unknown>,
    ops: DeltaOp[],
  ): void {
    const beforeKeys = new Set(Object.keys(before))
    const afterKeys = new Set(Object.keys(after))

    for (const key of afterKeys) {
      const path = basePath ? `${basePath}.${key}` : key
      const beforeVal = before[key]
      const afterVal = after[key]

      if (!beforeKeys.has(key)) {
        ops.push({ op: 'add', path, value: afterVal })
        continue
      }

      if (
        typeof beforeVal === 'object' &&
        beforeVal !== null &&
        typeof afterVal === 'object' &&
        afterVal !== null &&
        !Array.isArray(beforeVal) &&
        !Array.isArray(afterVal)
      ) {
        this.diffObjects(
          path,
          beforeVal as Record<string, unknown>,
          afterVal as Record<string, unknown>,
          ops,
        )
        continue
      }

      if (JSON.stringify(beforeVal) !== JSON.stringify(afterVal)) {
        ops.push({ op: 'replace', path, value: afterVal })
      }
    }

    for (const key of beforeKeys) {
      if (!afterKeys.has(key)) {
        const path = basePath ? `${basePath}.${key}` : key
        ops.push({ op: 'remove', path })
      }
    }
  }

  private computeChecksum(obj: unknown): string {
    const str = JSON.stringify(obj)
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash + char) & 0xffffffff
    }
    return (hash >>> 0).toString(16).padStart(8, '0')
  }
}

// ─── Apply Delta ──────────────────────────────────────────────────────────────

export function applyDelta(
  original: Record<string, unknown>,
  patch: DeltaPatch,
): Record<string, unknown> {
  let result = deepClone(original)

  for (const op of patch.operations) {
    result = applyOperation(result, op)
  }

  return result
}

function applyOperation(
  obj: Record<string, unknown>,
  op: DeltaOp,
): Record<string, unknown> {
  const parts = op.path.split('.')
  const result = deepClone(obj)

  switch (op.op) {
    case 'add':
    case 'replace':
      setNestedValue(result, parts, op.value)
      break
    case 'remove':
      removeNestedValue(result, parts)
      break
    case 'move': {
      if (!op.from) break
      const fromParts = op.from.split('.')
      const value = getNestedValue(result, fromParts)
      removeNestedValue(result, fromParts)
      setNestedValue(result, parts, value)
      break
    }
  }

  return result
}

function setNestedValue(
  obj: Record<string, unknown>,
  parts: string[],
  value: unknown,
): void {
  let current: Record<string, unknown> = obj
  for (let i = 0; i < parts.length - 1; i++) {
    const key = parts[i]!
    if (
      typeof current[key] !== 'object' ||
      current[key] === null
    ) {
      current[key] = {}
    }
    current = current[key] as Record<string, unknown>
  }
  const lastKey = parts[parts.length - 1]!
  current[lastKey] = value
}

function removeNestedValue(
  obj: Record<string, unknown>,
  parts: string[],
): void {
  let current: Record<string, unknown> = obj
  for (let i = 0; i < parts.length - 1; i++) {
    const key = parts[i]!
    if (typeof current[key] !== 'object' || current[key] === null) return
    current = current[key] as Record<string, unknown>
  }
  const lastKey = parts[parts.length - 1]!
  delete current[lastKey]
}

function getNestedValue(
  obj: Record<string, unknown>,
  parts: string[],
): unknown {
  let current: unknown = obj
  for (const key of parts) {
    if (typeof current !== 'object' || current === null) return undefined
    current = (current as Record<string, unknown>)[key]
  }
  return current
}

// ─── Delta Chain ──────────────────────────────────────────────────────────────

export function applyDeltaChain(
  original: Record<string, unknown>,
  patches: DeltaPatch[],
): Record<string, unknown> {
  let result = original
  for (const patch of patches) {
    result = applyDelta(result, patch)
  }
  return result
}

// ─── Compression ──────────────────────────────────────────────────────────────

export function compressDelta(patch: DeltaPatch): string {
  const simplified = patch.operations.map((op) => {
    const entry: [string, string, unknown?, string?] = [op.op[0]!, op.path]
    if (op.value !== undefined) entry[2] = op.value
    if (op.from) entry[3] = op.from
    return entry
  })

  return JSON.stringify({
    o: simplified,
    t: patch.timestamp,
    c: patch.checksum,
  })
}

export function decompressDelta(data: string): DeltaPatch {
  const parsed = JSON.parse(data) as {
    o: Array<[string, string, unknown?, string?]>
    t: number
    c: string
  }

  const opMap: Record<string, DeltaOperation> = {
    a: 'add',
    r: 'remove',
    p: 'replace',
    m: 'move',
  }

  const operations: DeltaOp[] = parsed.o.map(([opChar, path, value, from]) => {
    const op: DeltaOp = {
      op: opMap[opChar!] ?? 'replace',
      path,
    }
    if (value !== undefined) op.value = value
    if (from) op.from = from
    return op
  })

  return {
    operations,
    timestamp: parsed.t,
    checksum: parsed.c,
  }
}

// ─── Utilities ────────────────────────────────────────────────────────────────

function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj)) as T
}

export function isDeltaEmpty(patch: DeltaPatch): boolean {
  return patch.operations.length === 0
}

export function getDeltaSize(patch: DeltaPatch): number {
  return JSON.stringify(patch).length
}
