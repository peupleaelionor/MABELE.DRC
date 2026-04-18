// ─── Crypto Primitives ───────────────────────────────────────────────────────
// Wrappers sécurisés autour du module crypto de Node.js
// ──────────────────────────────────────────────────────────────────────────────

import { createHash, createHmac, randomBytes, scrypt, timingSafeEqual as tsEqual } from 'crypto'

// ─── Types ───────────────────────────────────────────────────────────────────

export type HashAlgorithm = 'sha256' | 'sha512' | 'sha384'

export type HmacAlgorithm = 'sha256' | 'sha512'

export interface ScryptOptions {
  keyLength?: number
  cost?: number
  blockSize?: number
  parallelization?: number
  saltLength?: number
}

export interface HashedPassword {
  hash: string
  salt: string
  algorithm: 'scrypt'
  keyLength: number
  cost: number
  blockSize: number
  parallelization: number
}

export interface FingerprintInput {
  userAgent?: string
  language?: string
  platform?: string
  screenResolution?: string
  timezone?: string
  [key: string]: unknown
}

// ─── Constantes ──────────────────────────────────────────────────────────────

const DEFAULT_SCRYPT_OPTIONS: Required<ScryptOptions> = {
  keyLength: 64,
  cost: 16384,
  blockSize: 8,
  parallelization: 1,
  saltLength: 32,
}

const TOKEN_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'

// ─── Fonctions de hachage ────────────────────────────────────────────────────

export function secureRandom(bytes: number): Buffer {
  if (bytes <= 0) {
    throw new Error('Le nombre d\'octets doit être supérieur à zéro')
  }
  return randomBytes(bytes)
}

export function sha256(data: string | Buffer): string {
  return createHash('sha256').update(data).digest('hex')
}

export function sha512(data: string | Buffer): string {
  return createHash('sha512').update(data).digest('hex')
}

export function hash(data: string | Buffer, algorithm: HashAlgorithm = 'sha256'): string {
  return createHash(algorithm).update(data).digest('hex')
}

// ─── HMAC ────────────────────────────────────────────────────────────────────

export function hmac(
  key: string | Buffer,
  data: string | Buffer,
  algorithm: HmacAlgorithm = 'sha256',
): string {
  return createHmac(algorithm, key).update(data).digest('hex')
}

// ─── Comparaison sécurisée ───────────────────────────────────────────────────

export function timingSafeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) {
    const dummy = Buffer.alloc(a.length)
    const bBuf = Buffer.alloc(a.length)
    tsEqual(dummy, bBuf)
    return false
  }
  const bufA = Buffer.from(a, 'utf8')
  const bufB = Buffer.from(b, 'utf8')
  return tsEqual(bufA, bufB)
}

// ─── Hachage de mot de passe (scrypt) ────────────────────────────────────────

export async function hashPassword(
  password: string,
  options: ScryptOptions = {},
): Promise<HashedPassword> {
  if (!password || password.length === 0) {
    throw new Error('Le mot de passe ne peut pas être vide')
  }

  const opts = { ...DEFAULT_SCRYPT_OPTIONS, ...options }
  const salt = randomBytes(opts.saltLength)

  const derivedKey = await new Promise<Buffer>((resolve, reject) => {
    scrypt(password, salt, opts.keyLength, {
      N: opts.cost,
      r: opts.blockSize,
      p: opts.parallelization,
    }, (err, key) => {
      if (err) reject(new Error(`Erreur lors du hachage du mot de passe : ${err.message}`))
      else resolve(key)
    })
  })

  return {
    hash: derivedKey.toString('hex'),
    salt: salt.toString('hex'),
    algorithm: 'scrypt',
    keyLength: opts.keyLength,
    cost: opts.cost,
    blockSize: opts.blockSize,
    parallelization: opts.parallelization,
  }
}

export async function verifyPassword(
  password: string,
  stored: HashedPassword,
): Promise<boolean> {
  if (!password || !stored.hash || !stored.salt) {
    return false
  }

  const salt = Buffer.from(stored.salt, 'hex')

  const derivedKey = await new Promise<Buffer>((resolve, reject) => {
    scrypt(password, salt, stored.keyLength, {
      N: stored.cost,
      r: stored.blockSize,
      p: stored.parallelization,
    }, (err, key) => {
      if (err) reject(new Error(`Erreur lors de la vérification du mot de passe : ${err.message}`))
      else resolve(key)
    })
  })

  return timingSafeCompare(derivedKey.toString('hex'), stored.hash)
}

// ─── Génération de jetons ────────────────────────────────────────────────────

export function generateToken(length: number = 32): string {
  if (length <= 0) {
    throw new Error('La longueur du jeton doit être supérieure à zéro')
  }

  const bytes = randomBytes(length)
  const chars: string[] = []

  for (let i = 0; i < length; i++) {
    const byte = bytes[i]
    if (byte !== undefined) {
      chars.push(TOKEN_CHARS[byte % TOKEN_CHARS.length] ?? 'A')
    }
  }

  return chars.join('')
}

export function generateUrlSafeToken(length: number = 32): string {
  return randomBytes(length)
    .toString('base64url')
    .slice(0, length)
}

// ─── Empreinte numérique ─────────────────────────────────────────────────────

export function fingerprint(data: FingerprintInput): string {
  const sorted = Object.keys(data)
    .sort()
    .reduce<Record<string, unknown>>((acc, key) => {
      const value = data[key]
      if (value !== undefined && value !== null) {
        acc[key] = value
      }
      return acc
    }, {})

  const raw = JSON.stringify(sorted)
  const fullHash = sha256(raw)
  return fullHash.slice(0, 16)
}

export function fingerprintMatch(
  a: FingerprintInput,
  b: FingerprintInput,
): boolean {
  return fingerprint(a) === fingerprint(b)
}
