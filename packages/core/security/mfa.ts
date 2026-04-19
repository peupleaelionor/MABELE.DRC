// ─── Authentification multi-facteurs ─────────────────────────────────────────
// TOTP (RFC 6238), OTP par SMS, et codes de secours
// ──────────────────────────────────────────────────────────────────────────────

import { createHmac, randomBytes, timingSafeEqual } from 'crypto'

// ─── Types ───────────────────────────────────────────────────────────────────

export interface TOTPConfig {
  digits?: number
  period?: number
  algorithm?: 'sha1' | 'sha256' | 'sha512'
  window?: number
}

export interface TOTPResult {
  code: string
  expiresAt: number
  period: number
}

export interface SmsOtp {
  code: string
  expiresAt: number
  createdAt: number
}

export interface BackupCodesResult {
  codes: string[]
  hashedCodes: string[]
  createdAt: number
}

export interface MfaAttempt {
  userId: string
  method: 'totp' | 'sms' | 'backup'
  timestamp: number
  success: boolean
  ip?: string
}

export interface RateLimitState {
  attempts: number
  firstAttemptAt: number
  lockedUntil: number | null
}

// ─── Constantes ──────────────────────────────────────────────────────────────

const DEFAULT_TOTP_CONFIG: Required<TOTPConfig> = {
  digits: 6,
  period: 30,
  algorithm: 'sha1',
  window: 1,
}

const SMS_OTP_LENGTH = 6
const SMS_OTP_EXPIRY_MS = 5 * 60 * 1000 // 5 minutes
const BACKUP_CODE_LENGTH = 8
const MAX_MFA_ATTEMPTS = 5
const MFA_LOCKOUT_DURATION_MS = 15 * 60 * 1000 // 15 minutes
const MFA_WINDOW_MS = 10 * 60 * 1000 // 10 minutes

const BASE32_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'

// ─── Encodage Base32 ─────────────────────────────────────────────────────────

export function base32Encode(buffer: Buffer): string {
  let bits = 0
  let value = 0
  let result = ''

  for (let i = 0; i < buffer.length; i++) {
    const byte = buffer[i]
    if (byte === undefined) continue
    value = (value << 8) | byte
    bits += 8

    while (bits >= 5) {
      bits -= 5
      result += BASE32_CHARS[(value >>> bits) & 0x1f] ?? 'A'
    }
  }

  if (bits > 0) {
    result += BASE32_CHARS[(value << (5 - bits)) & 0x1f] ?? 'A'
  }

  return result
}

export function base32Decode(encoded: string): Buffer {
  const cleaned = encoded.replace(/=+$/, '').toUpperCase()
  const bytes: number[] = []
  let bits = 0
  let value = 0

  for (let i = 0; i < cleaned.length; i++) {
    const char = cleaned[i]
    if (!char) continue
    const idx = BASE32_CHARS.indexOf(char)
    if (idx === -1) {
      throw new Error(`Caractère Base32 invalide : ${char}`)
    }

    value = (value << 5) | idx
    bits += 5

    if (bits >= 8) {
      bits -= 8
      bytes.push((value >>> bits) & 0xff)
    }
  }

  return Buffer.from(bytes)
}

// ─── Génération de secret ────────────────────────────────────────────────────

export function generateSecret(length: number = 20): string {
  if (length < 16) {
    throw new Error('La longueur du secret doit être au minimum 16 octets')
  }
  const buffer = randomBytes(length)
  return base32Encode(buffer)
}

export function buildOtpauthUri(
  secret: string,
  accountName: string,
  issuer: string = 'MABELE',
  config: TOTPConfig = {},
): string {
  const opts = { ...DEFAULT_TOTP_CONFIG, ...config }
  const encodedAccount = encodeURIComponent(accountName)
  const encodedIssuer = encodeURIComponent(issuer)

  return (
    `otpauth://totp/${encodedIssuer}:${encodedAccount}` +
    `?secret=${secret}` +
    `&issuer=${encodedIssuer}` +
    `&algorithm=${opts.algorithm.toUpperCase()}` +
    `&digits=${opts.digits}` +
    `&period=${opts.period}`
  )
}

// ─── TOTP (RFC 6238) ─────────────────────────────────────────────────────────

export function generateTOTP(
  secret: string,
  timestamp?: number,
  config: TOTPConfig = {},
): TOTPResult {
  if (!secret || secret.length === 0) {
    throw new Error('Le secret TOTP ne peut pas être vide')
  }

  const opts = { ...DEFAULT_TOTP_CONFIG, ...config }
  const time = timestamp ?? Math.floor(Date.now() / 1000)
  const counter = Math.floor(time / opts.period)
  const code = computeHOTP(secret, counter, opts.digits, opts.algorithm)

  const currentPeriodStart = counter * opts.period
  const expiresAt = (currentPeriodStart + opts.period) * 1000

  return {
    code,
    expiresAt,
    period: opts.period,
  }
}

export function verifyTOTP(
  secret: string,
  code: string,
  config: TOTPConfig = {},
): boolean {
  if (!secret || !code) return false

  const opts = { ...DEFAULT_TOTP_CONFIG, ...config }
  const time = Math.floor(Date.now() / 1000)
  const counter = Math.floor(time / opts.period)

  for (let i = -opts.window; i <= opts.window; i++) {
    const candidateCode = computeHOTP(secret, counter + i, opts.digits, opts.algorithm)
    if (timingSafeCompareStrings(candidateCode, code)) {
      return true
    }
  }

  return false
}

function computeHOTP(
  secret: string,
  counter: number,
  digits: number,
  algorithm: 'sha1' | 'sha256' | 'sha512',
): string {
  const key = base32Decode(secret)
  const buffer = Buffer.alloc(8)
  let tmp = counter
  for (let i = 7; i >= 0; i--) {
    buffer[i] = tmp & 0xff
    tmp = tmp >>> 8
  }

  const hmacResult = createHmac(algorithm, key).update(buffer).digest()
  const offset = (hmacResult[hmacResult.length - 1] ?? 0) & 0x0f

  const binary =
    (((hmacResult[offset] ?? 0) & 0x7f) << 24) |
    (((hmacResult[offset + 1] ?? 0) & 0xff) << 16) |
    (((hmacResult[offset + 2] ?? 0) & 0xff) << 8) |
    ((hmacResult[offset + 3] ?? 0) & 0xff)

  const otp = binary % Math.pow(10, digits)
  return otp.toString().padStart(digits, '0')
}

// ─── OTP par SMS ─────────────────────────────────────────────────────────────

export function generateSmsOtp(expiryMs: number = SMS_OTP_EXPIRY_MS): SmsOtp {
  // Rejection sampling to avoid modulo bias
  const maxUnbiased = Math.floor(0xFFFFFFFF / 1_000_000) * 1_000_000
  let numeric: number
  do {
    const bytes = randomBytes(4)
    numeric = bytes.readUInt32BE(0)
  } while (numeric >= maxUnbiased)
  numeric = numeric % 1_000_000
  const code = numeric.toString().padStart(SMS_OTP_LENGTH, '0')
  const now = Date.now()

  return {
    code,
    expiresAt: now + expiryMs,
    createdAt: now,
  }
}

export function verifySmsOtp(
  stored: SmsOtp,
  input: string,
): { valid: boolean; reason?: string } {
  if (!stored || !input) {
    return { valid: false, reason: 'Données OTP manquantes' }
  }

  if (Date.now() > stored.expiresAt) {
    return { valid: false, reason: 'Le code OTP a expiré' }
  }

  if (!timingSafeCompareStrings(stored.code, input)) {
    return { valid: false, reason: 'Code OTP invalide' }
  }

  return { valid: true }
}

// ─── Codes de secours ────────────────────────────────────────────────────────

export function generateBackupCodes(count: number = 10): BackupCodesResult {
  if (count < 1 || count > 50) {
    throw new Error('Le nombre de codes de secours doit être entre 1 et 50')
  }

  const codes: string[] = []
  const hashedCodes: string[] = []

  for (let i = 0; i < count; i++) {
    const raw = randomBytes(BACKUP_CODE_LENGTH / 2).toString('hex').toUpperCase()
    const formatted = `${raw.slice(0, 4)}-${raw.slice(4)}`
    codes.push(formatted)
    hashedCodes.push(hashBackupCode(formatted))
  }

  return {
    codes,
    hashedCodes,
    createdAt: Date.now(),
  }
}

export function verifyBackupCode(
  hashedCodes: string[],
  input: string,
): { valid: boolean; remainingCodes: string[] } {
  const inputHash = hashBackupCode(input)
  const index = hashedCodes.findIndex((h) => timingSafeCompareStrings(h, inputHash))

  if (index === -1) {
    return { valid: false, remainingCodes: hashedCodes }
  }

  const remainingCodes = [...hashedCodes]
  remainingCodes.splice(index, 1)

  return { valid: true, remainingCodes }
}

function hashBackupCode(code: string): string {
  const normalized = code.replace(/[-\s]/g, '').toUpperCase()
  return createHmac('sha256', 'mabele-backup-code-salt')
    .update(normalized)
    .digest('hex')
}

// ─── Limitation de débit MFA ─────────────────────────────────────────────────

const rateLimitStore = new Map<string, RateLimitState>()

export function checkMfaRateLimit(userId: string): {
  allowed: boolean
  retryAfterMs?: number
} {
  const state = rateLimitStore.get(userId)
  const now = Date.now()

  if (!state) {
    return { allowed: true }
  }

  if (state.lockedUntil && now < state.lockedUntil) {
    return {
      allowed: false,
      retryAfterMs: state.lockedUntil - now,
    }
  }

  if (state.lockedUntil && now >= state.lockedUntil) {
    rateLimitStore.delete(userId)
    return { allowed: true }
  }

  if (now - state.firstAttemptAt > MFA_WINDOW_MS) {
    rateLimitStore.delete(userId)
    return { allowed: true }
  }

  if (state.attempts >= MAX_MFA_ATTEMPTS) {
    state.lockedUntil = now + MFA_LOCKOUT_DURATION_MS
    return {
      allowed: false,
      retryAfterMs: MFA_LOCKOUT_DURATION_MS,
    }
  }

  return { allowed: true }
}

export function recordMfaAttempt(userId: string, success: boolean): void {
  if (success) {
    rateLimitStore.delete(userId)
    return
  }

  const now = Date.now()
  const state = rateLimitStore.get(userId)

  if (!state || now - state.firstAttemptAt > MFA_WINDOW_MS) {
    rateLimitStore.set(userId, {
      attempts: 1,
      firstAttemptAt: now,
      lockedUntil: null,
    })
    return
  }

  state.attempts++
}

export function resetMfaRateLimit(userId: string): void {
  rateLimitStore.delete(userId)
}

// ─── Utilitaires ─────────────────────────────────────────────────────────────

function timingSafeCompareStrings(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  const bufA = Buffer.from(a, 'utf8')
  const bufB = Buffer.from(b, 'utf8')
  return timingSafeEqual(bufA, bufB)
}
