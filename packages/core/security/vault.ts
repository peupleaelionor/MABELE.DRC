// ─── Coffre-fort de secrets ──────────────────────────────────────────────────
// Stockage en mémoire avec TTL, contrôle d'accès, séparation de clé Shamir
// ──────────────────────────────────────────────────────────────────────────────

import { randomBytes } from 'crypto'

// ─── Types ───────────────────────────────────────────────────────────────────

export interface SecretMetadata {
  createdAt: number
  expiresAt: number | null
  accessCount: number
  lastAccessedAt: number | null
  lastAccessedBy: string | null
  allowedAccessors: string[]
  rotationSchedule: RotationSchedule | null
}

export interface StoredSecret {
  key: string
  value: string
  metadata: SecretMetadata
  revoked: boolean
}

export interface SecretAccessLog {
  key: string
  accessor: string
  timestamp: number
  action: 'read' | 'write' | 'revoke' | 'rotate'
  success: boolean
  reason?: string
}

export interface RotationSchedule {
  intervalMs: number
  lastRotatedAt: number
  nextRotationAt: number
}

export interface KeyShare {
  index: number
  value: string
  threshold: number
  totalShares: number
}

export interface VaultStats {
  totalSecrets: number
  activeSecrets: number
  revokedSecrets: number
  expiredSecrets: number
  totalAccessLogs: number
}

// ─── SecretVault ─────────────────────────────────────────────────────────────

export class SecretVault {
  private secrets = new Map<string, StoredSecret>()
  private accessLogs: SecretAccessLog[] = []

  store(
    key: string,
    value: string,
    options: {
      ttlMs?: number
      allowedAccessors?: string[]
      rotationIntervalMs?: number
    } = {},
  ): void {
    if (!key || key.length === 0) {
      throw new Error('La clé du secret ne peut pas être vide')
    }

    if (!value || value.length === 0) {
      throw new Error('La valeur du secret ne peut pas être vide')
    }

    const now = Date.now()
    const expiresAt = options.ttlMs ? now + options.ttlMs : null
    let rotationSchedule: RotationSchedule | null = null

    if (options.rotationIntervalMs) {
      rotationSchedule = {
        intervalMs: options.rotationIntervalMs,
        lastRotatedAt: now,
        nextRotationAt: now + options.rotationIntervalMs,
      }
    }

    this.secrets.set(key, {
      key,
      value,
      metadata: {
        createdAt: now,
        expiresAt,
        accessCount: 0,
        lastAccessedAt: null,
        lastAccessedBy: null,
        allowedAccessors: options.allowedAccessors ?? [],
        rotationSchedule,
      },
      revoked: false,
    })

    this.logAccess(key, 'system', 'write', true)
  }

  retrieve(key: string, accessor: string): string | null {
    const secret = this.secrets.get(key)

    if (!secret) {
      this.logAccess(key, accessor, 'read', false, 'Secret introuvable')
      return null
    }

    if (secret.revoked) {
      this.logAccess(key, accessor, 'read', false, 'Secret révoqué')
      return null
    }

    if (secret.metadata.expiresAt && Date.now() > secret.metadata.expiresAt) {
      this.logAccess(key, accessor, 'read', false, 'Secret expiré')
      return null
    }

    if (
      secret.metadata.allowedAccessors.length > 0 &&
      !secret.metadata.allowedAccessors.includes(accessor)
    ) {
      this.logAccess(key, accessor, 'read', false, 'Accès non autorisé')
      return null
    }

    secret.metadata.accessCount++
    secret.metadata.lastAccessedAt = Date.now()
    secret.metadata.lastAccessedBy = accessor
    this.logAccess(key, accessor, 'read', true)

    return secret.value
  }

  revoke(key: string): boolean {
    const secret = this.secrets.get(key)
    if (!secret) return false

    secret.revoked = true
    this.logAccess(key, 'system', 'revoke', true)
    return true
  }

  rotate(key: string, newValue: string): boolean {
    const secret = this.secrets.get(key)
    if (!secret || secret.revoked) return false

    secret.value = newValue
    const now = Date.now()

    if (secret.metadata.rotationSchedule) {
      secret.metadata.rotationSchedule.lastRotatedAt = now
      secret.metadata.rotationSchedule.nextRotationAt =
        now + secret.metadata.rotationSchedule.intervalMs
    }

    this.logAccess(key, 'system', 'rotate', true)
    return true
  }

  getMetadata(key: string): SecretMetadata | null {
    const secret = this.secrets.get(key)
    return secret ? { ...secret.metadata } : null
  }

  getSecretsNeedingRotation(): string[] {
    const now = Date.now()
    const keys: string[] = []

    for (const [key, secret] of this.secrets) {
      if (secret.revoked) continue
      if (
        secret.metadata.rotationSchedule &&
        now >= secret.metadata.rotationSchedule.nextRotationAt
      ) {
        keys.push(key)
      }
    }

    return keys
  }

  purgeExpired(): number {
    const now = Date.now()
    let purged = 0

    for (const [key, secret] of this.secrets) {
      if (secret.metadata.expiresAt && now > secret.metadata.expiresAt) {
        this.secrets.delete(key)
        purged++
      }
    }

    return purged
  }

  getAccessLogs(key?: string): SecretAccessLog[] {
    if (key) {
      return this.accessLogs.filter((log) => log.key === key)
    }
    return [...this.accessLogs]
  }

  getStats(): VaultStats {
    const now = Date.now()
    let active = 0
    let revoked = 0
    let expired = 0

    for (const secret of this.secrets.values()) {
      if (secret.revoked) {
        revoked++
      } else if (secret.metadata.expiresAt && now > secret.metadata.expiresAt) {
        expired++
      } else {
        active++
      }
    }

    return {
      totalSecrets: this.secrets.size,
      activeSecrets: active,
      revokedSecrets: revoked,
      expiredSecrets: expired,
      totalAccessLogs: this.accessLogs.length,
    }
  }

  clear(): void {
    this.secrets.clear()
    this.accessLogs = []
  }

  private logAccess(
    key: string,
    accessor: string,
    action: SecretAccessLog['action'],
    success: boolean,
    reason?: string,
  ): void {
    this.accessLogs.push({
      key,
      accessor,
      timestamp: Date.now(),
      action,
      success,
      reason,
    })
  }
}

// ─── Séparation de clé (Shamir simplifié) ────────────────────────────────────

export function splitKey(
  key: string,
  totalShares: number,
  threshold: number,
): KeyShare[] {
  if (threshold > totalShares) {
    throw new Error('Le seuil ne peut pas dépasser le nombre total de parts')
  }

  if (threshold < 2) {
    throw new Error('Le seuil doit être au minimum 2')
  }

  if (totalShares < 2 || totalShares > 255) {
    throw new Error('Le nombre de parts doit être entre 2 et 255')
  }

  const keyBuffer = Buffer.from(key, 'utf8')
  const shares: KeyShare[] = []

  const coefficients: Buffer[] = []
  for (let i = 0; i < threshold - 1; i++) {
    coefficients.push(randomBytes(keyBuffer.length))
  }

  for (let i = 1; i <= totalShares; i++) {
    const shareBuffer = Buffer.alloc(keyBuffer.length)

    for (let byteIdx = 0; byteIdx < keyBuffer.length; byteIdx++) {
      let value = keyBuffer[byteIdx] ?? 0

      for (let coeffIdx = 0; coeffIdx < coefficients.length; coeffIdx++) {
        const coeff = coefficients[coeffIdx]
        if (!coeff) continue
        const coeffByte = coeff[byteIdx] ?? 0
        value = (value + coeffByte * Math.pow(i, coeffIdx + 1)) & 0xff
      }

      shareBuffer[byteIdx] = value
    }

    shares.push({
      index: i,
      value: shareBuffer.toString('hex'),
      threshold,
      totalShares,
    })
  }

  return shares
}

export function reconstructKey(shares: KeyShare[]): string {
  if (shares.length === 0) {
    throw new Error('Aucune part fournie pour la reconstruction')
  }

  const firstShare = shares[0]
  if (!firstShare) {
    throw new Error('Part invalide')
  }

  if (shares.length < firstShare.threshold) {
    throw new Error(
      `Nombre insuffisant de parts : ${shares.length} fournies, ${firstShare.threshold} requises`,
    )
  }

  const shareLength = firstShare.value.length / 2
  const result = Buffer.alloc(shareLength)

  const selectedShares = shares.slice(0, firstShare.threshold)
  const indices = selectedShares.map((s) => s.index)

  for (let byteIdx = 0; byteIdx < shareLength; byteIdx++) {
    let value = 0

    for (let i = 0; i < selectedShares.length; i++) {
      const share = selectedShares[i]
      if (!share) continue
      const shareBuffer = Buffer.from(share.value, 'hex')
      const shareByte = shareBuffer[byteIdx] ?? 0

      let lagrange = 1
      const xi = indices[i] ?? 0

      for (let j = 0; j < indices.length; j++) {
        if (i === j) continue
        const xj = indices[j] ?? 0
        lagrange *= (0 - xj) / (xi - xj)
      }

      value += shareByte * lagrange
    }

    result[byteIdx] = Math.round(value) & 0xff
  }

  return result.toString('utf8')
}
