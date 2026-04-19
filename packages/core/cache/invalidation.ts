// ─── Invalidation de cache ───────────────────────────────────────────────────
// Invalidation par tags, pattern, cascade et versionnement
// ──────────────────────────────────────────────────────────────────────────────

// ─── Types ───────────────────────────────────────────────────────────────────

export interface InvalidationEvent {
  id: string
  type: 'tag' | 'pattern' | 'cascade' | 'version'
  target: string
  keysInvalidated: string[]
  timestamp: number
  triggeredBy?: string
}

export interface CascadeRule {
  source: string
  dependents: string[]
}

export interface InvalidationStats {
  totalEvents: number
  byType: Record<InvalidationEvent['type'], number>
  totalKeysInvalidated: number
  lastEventAt: number | null
}

// ─── TagBasedInvalidation ────────────────────────────────────────────────────

export class TagBasedInvalidation {
  private keyToTags = new Map<string, Set<string>>()
  private tagToKeys = new Map<string, Set<string>>()
  private events: InvalidationEvent[] = []
  private eventCounter = 0

  tagEntry(key: string, tags: string[]): void {
    if (!key || tags.length === 0) {
      throw new Error('La clé et au moins un tag sont requis')
    }

    const existingTags = this.keyToTags.get(key) ?? new Set()
    for (const tag of tags) {
      existingTags.add(tag)

      const tagKeys = this.tagToKeys.get(tag) ?? new Set()
      tagKeys.add(key)
      this.tagToKeys.set(tag, tagKeys)
    }
    this.keyToTags.set(key, existingTags)
  }

  removeTag(key: string, tag: string): void {
    const tags = this.keyToTags.get(key)
    if (tags) {
      tags.delete(tag)
      if (tags.size === 0) this.keyToTags.delete(key)
    }

    const keys = this.tagToKeys.get(tag)
    if (keys) {
      keys.delete(key)
      if (keys.size === 0) this.tagToKeys.delete(tag)
    }
  }

  getTagsForKey(key: string): string[] {
    const tags = this.keyToTags.get(key)
    return tags ? Array.from(tags) : []
  }

  getKeysForTag(tag: string): string[] {
    const keys = this.tagToKeys.get(tag)
    return keys ? Array.from(keys) : []
  }

  invalidateByTag(tag: string, triggeredBy?: string): InvalidationEvent {
    const keys = this.tagToKeys.get(tag)
    const invalidatedKeys: string[] = []

    if (keys) {
      for (const key of keys) {
        invalidatedKeys.push(key)
        const keyTags = this.keyToTags.get(key)
        if (keyTags) {
          keyTags.delete(tag)
          if (keyTags.size === 0) this.keyToTags.delete(key)
        }
      }
      this.tagToKeys.delete(tag)
    }

    const event = this.createEvent('tag', tag, invalidatedKeys, triggeredBy)
    this.events.push(event)
    return event
  }

  invalidateByTags(tags: string[], triggeredBy?: string): InvalidationEvent[] {
    return tags.map((tag) => this.invalidateByTag(tag, triggeredBy))
  }

  clear(): void {
    this.keyToTags.clear()
    this.tagToKeys.clear()
  }

  private createEvent(
    type: InvalidationEvent['type'],
    target: string,
    keys: string[],
    triggeredBy?: string,
  ): InvalidationEvent {
    this.eventCounter++
    return {
      id: `inv-${Date.now()}-${this.eventCounter}`,
      type,
      target,
      keysInvalidated: keys,
      timestamp: Date.now(),
      triggeredBy,
    }
  }
}

// ─── PatternInvalidation ─────────────────────────────────────────────────────

export class PatternInvalidation {
  private keys = new Set<string>()
  private events: InvalidationEvent[] = []
  private eventCounter = 0

  registerKey(key: string): void {
    this.keys.add(key)
  }

  unregisterKey(key: string): void {
    this.keys.delete(key)
  }

  invalidateByPattern(pattern: string, triggeredBy?: string): InvalidationEvent {
    const regex = this.globToRegex(pattern)
    const invalidated: string[] = []

    for (const key of this.keys) {
      if (regex.test(key)) {
        invalidated.push(key)
        this.keys.delete(key)
      }
    }

    this.eventCounter++
    const event: InvalidationEvent = {
      id: `inv-pat-${Date.now()}-${this.eventCounter}`,
      type: 'pattern',
      target: pattern,
      keysInvalidated: invalidated,
      timestamp: Date.now(),
      triggeredBy,
    }

    this.events.push(event)
    return event
  }

  getRegisteredKeys(): string[] {
    return Array.from(this.keys)
  }

  getEvents(): InvalidationEvent[] {
    return [...this.events]
  }

  private globToRegex(pattern: string): RegExp {
    const escaped = pattern
      .replace(/[.+^${}()|[\]\\]/g, '\\$&')
      .replace(/\*/g, '.*')
      .replace(/\?/g, '.')
    return new RegExp(`^${escaped}$`)
  }
}

// ─── CascadeInvalidation ────────────────────────────────────────────────────

export class CascadeInvalidation {
  private rules: CascadeRule[] = []
  private events: InvalidationEvent[] = []
  private eventCounter = 0

  addRule(rule: CascadeRule): void {
    const existing = this.rules.findIndex((r) => r.source === rule.source)
    if (existing !== -1) {
      this.rules[existing] = rule
    } else {
      this.rules.push(rule)
    }
  }

  removeRule(source: string): boolean {
    const index = this.rules.findIndex((r) => r.source === source)
    if (index === -1) return false
    this.rules.splice(index, 1)
    return true
  }

  invalidate(sourceKey: string, triggeredBy?: string): InvalidationEvent {
    const allInvalidated = new Set<string>()
    this.collectDependents(sourceKey, allInvalidated)

    this.eventCounter++
    const event: InvalidationEvent = {
      id: `inv-cas-${Date.now()}-${this.eventCounter}`,
      type: 'cascade',
      target: sourceKey,
      keysInvalidated: Array.from(allInvalidated),
      timestamp: Date.now(),
      triggeredBy,
    }

    this.events.push(event)
    return event
  }

  getDependents(sourceKey: string): string[] {
    const result = new Set<string>()
    this.collectDependents(sourceKey, result)
    return Array.from(result)
  }

  getRules(): CascadeRule[] {
    return [...this.rules]
  }

  private collectDependents(key: string, visited: Set<string>): void {
    for (const rule of this.rules) {
      if (rule.source === key) {
        for (const dep of rule.dependents) {
          if (!visited.has(dep)) {
            visited.add(dep)
            this.collectDependents(dep, visited)
          }
        }
      }
    }
  }
}

// ─── VersionedInvalidation ───────────────────────────────────────────────────

export class VersionedInvalidation {
  private versions = new Map<string, number>()
  private events: InvalidationEvent[] = []
  private eventCounter = 0

  getVersion(namespace: string): number {
    return this.versions.get(namespace) ?? 0
  }

  incrementVersion(namespace: string, triggeredBy?: string): InvalidationEvent {
    const current = this.versions.get(namespace) ?? 0
    const next = current + 1
    this.versions.set(namespace, next)

    this.eventCounter++
    const event: InvalidationEvent = {
      id: `inv-ver-${Date.now()}-${this.eventCounter}`,
      type: 'version',
      target: `${namespace}@v${next}`,
      keysInvalidated: [`${namespace}@v${current}`],
      timestamp: Date.now(),
      triggeredBy,
    }

    this.events.push(event)
    return event
  }

  buildVersionedKey(namespace: string, key: string): string {
    const version = this.getVersion(namespace)
    return `${namespace}:v${version}:${key}`
  }

  isKeyValid(namespace: string, versionedKey: string): boolean {
    const currentVersion = this.getVersion(namespace)
    const prefix = `${namespace}:v${currentVersion}:`
    return versionedKey.startsWith(prefix)
  }

  getEvents(): InvalidationEvent[] {
    return [...this.events]
  }
}

// ─── Statistiques d'invalidation ─────────────────────────────────────────────

export function computeInvalidationStats(events: InvalidationEvent[]): InvalidationStats {
  const byType: Record<InvalidationEvent['type'], number> = {
    tag: 0,
    pattern: 0,
    cascade: 0,
    version: 0,
  }

  let totalKeys = 0
  let lastEventAt: number | null = null

  for (const event of events) {
    byType[event.type]++
    totalKeys += event.keysInvalidated.length

    if (!lastEventAt || event.timestamp > lastEventAt) {
      lastEventAt = event.timestamp
    }
  }

  return {
    totalEvents: events.length,
    byType,
    totalKeysInvalidated: totalKeys,
    lastEventAt,
  }
}
