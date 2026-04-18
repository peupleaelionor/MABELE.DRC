// ─── Journal d'audit ─────────────────────────────────────────────────────────
// Chaîne de hachage inviolable, conformité RGPD, export de données
// ──────────────────────────────────────────────────────────────────────────────

import { createHash, randomBytes } from 'crypto'

// ─── Types ───────────────────────────────────────────────────────────────────

export interface AuditEntry {
  id: string
  timestamp: number
  actor: AuditActor
  action: string
  resource: AuditResource
  metadata: Record<string, unknown>
  previousHash: string | null
  hash: string
  ip?: string
  userAgent?: string
}

export interface AuditActor {
  id: string
  type: 'user' | 'system' | 'admin' | 'service'
  name?: string
  email?: string
}

export interface AuditResource {
  type: string
  id: string
  name?: string
}

export interface AuditFilter {
  actorId?: string
  actorType?: AuditActor['type']
  action?: string
  resourceType?: string
  resourceId?: string
  startDate?: number
  endDate?: number
  ip?: string
  page?: number
  limit?: number
}

export interface PaginatedAuditLog {
  entries: AuditEntry[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

export interface ChainVerificationResult {
  valid: boolean
  brokenAtIndex: number | null
  totalEntries: number
  details: string
}

export type ExportFormat = 'json' | 'csv'

export interface AnonymizationResult {
  entriesModified: number
  chainValid: boolean
}

// ─── Constantes ──────────────────────────────────────────────────────────────

const GENESIS_HASH = '0'.repeat(64)
const ANONYMIZED_MARKER = '[ANONYMISÉ]'

// ─── Création d'entrées d'audit ──────────────────────────────────────────────

export function createAuditEntry(
  actor: AuditActor,
  action: string,
  resource: AuditResource,
  metadata: Record<string, unknown> = {},
  previousHash: string | null = null,
  options: { ip?: string; userAgent?: string } = {},
): AuditEntry {
  if (!action || action.length === 0) {
    throw new Error('L\'action de l\'audit ne peut pas être vide')
  }

  if (!actor.id) {
    throw new Error('L\'identifiant de l\'acteur est requis')
  }

  if (!resource.type || !resource.id) {
    throw new Error('Le type et l\'identifiant de la ressource sont requis')
  }

  const id = generateAuditId()
  const timestamp = Date.now()
  const prevHash = previousHash ?? GENESIS_HASH

  const entryWithoutHash: Omit<AuditEntry, 'hash'> = {
    id,
    timestamp,
    actor,
    action,
    resource,
    metadata,
    previousHash: prevHash,
    ip: options.ip,
    userAgent: options.userAgent,
  }

  const hash = computeEntryHash(entryWithoutHash, prevHash)

  return { ...entryWithoutHash, hash }
}

export function appendToChain(
  chain: AuditEntry[],
  actor: AuditActor,
  action: string,
  resource: AuditResource,
  metadata: Record<string, unknown> = {},
  options: { ip?: string; userAgent?: string } = {},
): AuditEntry {
  const lastEntry = chain[chain.length - 1]
  const previousHash = lastEntry?.hash ?? null

  const entry = createAuditEntry(actor, action, resource, metadata, previousHash, options)
  chain.push(entry)

  return entry
}

// ─── Vérification de la chaîne ───────────────────────────────────────────────

export function verifyAuditChain(entries: AuditEntry[]): ChainVerificationResult {
  if (entries.length === 0) {
    return {
      valid: true,
      brokenAtIndex: null,
      totalEntries: 0,
      details: 'Chaîne vide, rien à vérifier',
    }
  }

  const firstEntry = entries[0]
  if (!firstEntry) {
    return {
      valid: false,
      brokenAtIndex: 0,
      totalEntries: entries.length,
      details: 'Première entrée manquante',
    }
  }

  if (firstEntry.previousHash !== GENESIS_HASH) {
    return {
      valid: false,
      brokenAtIndex: 0,
      totalEntries: entries.length,
      details: 'La première entrée ne référence pas le hash de genèse',
    }
  }

  const firstComputedHash = recomputeEntryHash(firstEntry)
  if (firstComputedHash !== firstEntry.hash) {
    return {
      valid: false,
      brokenAtIndex: 0,
      totalEntries: entries.length,
      details: 'Le hash de la première entrée est invalide',
    }
  }

  for (let i = 1; i < entries.length; i++) {
    const current = entries[i]
    const previous = entries[i - 1]

    if (!current || !previous) {
      return {
        valid: false,
        brokenAtIndex: i,
        totalEntries: entries.length,
        details: `Entrée manquante à l'index ${i}`,
      }
    }

    if (current.previousHash !== previous.hash) {
      return {
        valid: false,
        brokenAtIndex: i,
        totalEntries: entries.length,
        details: `Rupture de chaîne à l'index ${i} : le hash précédent ne correspond pas`,
      }
    }

    const computedHash = recomputeEntryHash(current)
    if (computedHash !== current.hash) {
      return {
        valid: false,
        brokenAtIndex: i,
        totalEntries: entries.length,
        details: `Hash invalide à l'index ${i} : l'entrée a été modifiée`,
      }
    }
  }

  return {
    valid: true,
    brokenAtIndex: null,
    totalEntries: entries.length,
    details: `Chaîne valide avec ${entries.length} entrées`,
  }
}

// ─── Requêtes du journal ─────────────────────────────────────────────────────

export function queryAuditLog(
  entries: AuditEntry[],
  filters: AuditFilter = {},
): PaginatedAuditLog {
  let filtered = [...entries]

  if (filters.actorId) {
    filtered = filtered.filter((e) => e.actor.id === filters.actorId)
  }

  if (filters.actorType) {
    filtered = filtered.filter((e) => e.actor.type === filters.actorType)
  }

  if (filters.action) {
    filtered = filtered.filter((e) => e.action === filters.action)
  }

  if (filters.resourceType) {
    filtered = filtered.filter((e) => e.resource.type === filters.resourceType)
  }

  if (filters.resourceId) {
    filtered = filtered.filter((e) => e.resource.id === filters.resourceId)
  }

  if (filters.startDate) {
    filtered = filtered.filter((e) => e.timestamp >= (filters.startDate ?? 0))
  }

  if (filters.endDate) {
    filtered = filtered.filter((e) => e.timestamp <= (filters.endDate ?? Infinity))
  }

  if (filters.ip) {
    filtered = filtered.filter((e) => e.ip === filters.ip)
  }

  const page = Math.max(1, filters.page ?? 1)
  const limit = Math.min(100, Math.max(1, filters.limit ?? 20))
  const skip = (page - 1) * limit
  const total = filtered.length
  const paged = filtered.slice(skip, skip + limit)

  return {
    entries: paged,
    total,
    page,
    limit,
    hasMore: skip + limit < total,
  }
}

// ─── RGPD : Anonymisation ────────────────────────────────────────────────────

export function anonymizeUserAudit(
  entries: AuditEntry[],
  userId: string,
): AnonymizationResult {
  let modified = 0

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i]
    if (!entry) continue

    if (entry.actor.id === userId) {
      entry.actor = {
        id: ANONYMIZED_MARKER,
        type: entry.actor.type,
        name: ANONYMIZED_MARKER,
        email: ANONYMIZED_MARKER,
      }
      entry.ip = undefined
      entry.userAgent = undefined
      entry.metadata = anonymizeMetadata(entry.metadata)
      modified++
    }
  }

  // Recalcul des hashes pour maintenir la chaîne
  rebuildChainHashes(entries)

  const verification = verifyAuditChain(entries)

  return {
    entriesModified: modified,
    chainValid: verification.valid,
  }
}

function anonymizeMetadata(metadata: Record<string, unknown>): Record<string, unknown> {
  const piiFields = ['email', 'name', 'phone', 'address', 'ip', 'nom', 'téléphone', 'adresse']
  const result: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(metadata)) {
    if (piiFields.some((f) => key.toLowerCase().includes(f))) {
      result[key] = ANONYMIZED_MARKER
    } else {
      result[key] = value
    }
  }

  return result
}

function rebuildChainHashes(entries: AuditEntry[]): void {
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i]
    if (!entry) continue

    const previousEntry = i > 0 ? entries[i - 1] : undefined
    entry.previousHash = previousEntry?.hash ?? GENESIS_HASH
    entry.hash = recomputeEntryHash(entry)
  }
}

// ─── Export de conformité ────────────────────────────────────────────────────

export function exportAuditLog(
  entries: AuditEntry[],
  format: ExportFormat,
): string {
  if (format === 'json') {
    return JSON.stringify(entries, null, 2)
  }

  if (format === 'csv') {
    const headers = [
      'id', 'timestamp', 'actor_id', 'actor_type', 'actor_name',
      'action', 'resource_type', 'resource_id', 'resource_name',
      'ip', 'hash', 'previous_hash',
    ]

    const rows = entries.map((e) => [
      escapeCsv(e.id),
      new Date(e.timestamp).toISOString(),
      escapeCsv(e.actor.id),
      escapeCsv(e.actor.type),
      escapeCsv(e.actor.name ?? ''),
      escapeCsv(e.action),
      escapeCsv(e.resource.type),
      escapeCsv(e.resource.id),
      escapeCsv(e.resource.name ?? ''),
      escapeCsv(e.ip ?? ''),
      e.hash,
      e.previousHash ?? '',
    ].join(','))

    return [headers.join(','), ...rows].join('\n')
  }

  throw new Error(`Format d'export non supporté : ${format}`)
}

// ─── Utilitaires internes ────────────────────────────────────────────────────

function generateAuditId(): string {
  return `audit-${Date.now()}-${randomBytes(4).toString('hex')}`
}

function computeEntryHash(
  entry: Omit<AuditEntry, 'hash'>,
  previousHash: string,
): string {
  const payload = JSON.stringify({
    id: entry.id,
    timestamp: entry.timestamp,
    actor: entry.actor,
    action: entry.action,
    resource: entry.resource,
    metadata: entry.metadata,
    previousHash,
  })

  return createHash('sha256').update(payload).digest('hex')
}

function recomputeEntryHash(entry: AuditEntry): string {
  return computeEntryHash(entry, entry.previousHash ?? GENESIS_HASH)
}

function escapeCsv(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}
