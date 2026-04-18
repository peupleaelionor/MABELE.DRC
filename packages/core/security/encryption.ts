// ─── Chiffrement AES-256-GCM ─────────────────────────────────────────────────
// Chiffrement/déchiffrement de niveau militaire avec dérivation de clé PBKDF2
// ──────────────────────────────────────────────────────────────────────────────

import {
  createCipheriv,
  createDecipheriv,
  pbkdf2,
  randomBytes,
} from 'crypto'

// ─── Types ───────────────────────────────────────────────────────────────────

export interface EncryptionResult {
  ciphertext: string
  iv: string
  authTag: string
  algorithm: 'aes-256-gcm'
}

export interface EncryptedPayload {
  /** Format: iv:authTag:ciphertext (tout en hex) */
  data: string
  algorithm: 'aes-256-gcm'
  version: number
}

export interface DeriveKeyOptions {
  iterations?: number
  keyLength?: number
  digest?: 'sha256' | 'sha512'
}

export interface KeyPair {
  key: Buffer
  salt: Buffer
}

export interface RotationResult {
  payload: EncryptedPayload
  rotatedAt: number
}

export interface MessageEnvelope {
  senderId: string
  recipientId: string
  payload: EncryptedPayload
  timestamp: number
  messageId: string
}

// ─── Constantes ──────────────────────────────────────────────────────────────

const ALGORITHM = 'aes-256-gcm' as const
const IV_LENGTH = 12
const KEY_LENGTH = 32
const AUTH_TAG_LENGTH = 16
const SALT_LENGTH = 32
const DEFAULT_ITERATIONS = 100_000
const DEFAULT_DIGEST = 'sha512'
const CURRENT_VERSION = 1

// ─── Génération de clé et IV ─────────────────────────────────────────────────

export function generateKey(): Buffer {
  return randomBytes(KEY_LENGTH)
}

export function generateIV(): Buffer {
  return randomBytes(IV_LENGTH)
}

export function generateSalt(length: number = SALT_LENGTH): Buffer {
  if (length <= 0) {
    throw new Error('La longueur du sel doit être supérieure à zéro')
  }
  return randomBytes(length)
}

// ─── Dérivation de clé PBKDF2 ────────────────────────────────────────────────

export async function deriveKey(
  password: string,
  salt: Buffer | string,
  options: DeriveKeyOptions = {},
): Promise<KeyPair> {
  if (!password || password.length === 0) {
    throw new Error('Le mot de passe ne peut pas être vide pour la dérivation de clé')
  }

  const iterations = options.iterations ?? DEFAULT_ITERATIONS
  const keyLength = options.keyLength ?? KEY_LENGTH
  const digest = options.digest ?? DEFAULT_DIGEST

  if (iterations < 10_000) {
    throw new Error('Le nombre d\'itérations doit être au minimum 10 000 pour la sécurité')
  }

  const saltBuffer = typeof salt === 'string' ? Buffer.from(salt, 'hex') : salt

  const key = await new Promise<Buffer>((resolve, reject) => {
    pbkdf2(password, saltBuffer, iterations, keyLength, digest, (err, derivedKey) => {
      if (err) {
        reject(new Error(`Erreur lors de la dérivation de clé : ${err.message}`))
      } else {
        resolve(derivedKey)
      }
    })
  })

  return { key, salt: saltBuffer }
}

export async function deriveKeyFromPassword(
  password: string,
  options: DeriveKeyOptions = {},
): Promise<KeyPair> {
  const salt = generateSalt()
  return deriveKey(password, salt, options)
}

// ─── Chiffrement ─────────────────────────────────────────────────────────────

export function encrypt(plaintext: string, key: Buffer): EncryptedPayload {
  if (!plaintext) {
    throw new Error('Le texte en clair ne peut pas être vide')
  }

  validateKey(key)

  const iv = generateIV()
  const cipher = createCipheriv(ALGORITHM, key, iv, { authTagLength: AUTH_TAG_LENGTH })

  const encrypted = Buffer.concat([
    cipher.update(plaintext, 'utf8'),
    cipher.final(),
  ])

  const authTag = cipher.getAuthTag()

  const data = [
    iv.toString('hex'),
    authTag.toString('hex'),
    encrypted.toString('hex'),
  ].join(':')

  return {
    data,
    algorithm: ALGORITHM,
    version: CURRENT_VERSION,
  }
}

export function encryptBuffer(data: Buffer, key: Buffer): EncryptedPayload {
  if (!data || data.length === 0) {
    throw new Error('Les données ne peuvent pas être vides')
  }

  validateKey(key)

  const iv = generateIV()
  const cipher = createCipheriv(ALGORITHM, key, iv, { authTagLength: AUTH_TAG_LENGTH })

  const encrypted = Buffer.concat([
    cipher.update(data),
    cipher.final(),
  ])

  const authTag = cipher.getAuthTag()

  const encoded = [
    iv.toString('hex'),
    authTag.toString('hex'),
    encrypted.toString('hex'),
  ].join(':')

  return {
    data: encoded,
    algorithm: ALGORITHM,
    version: CURRENT_VERSION,
  }
}

// ─── Déchiffrement ───────────────────────────────────────────────────────────

export function decrypt(payload: EncryptedPayload, key: Buffer): string {
  validateKey(key)

  if (payload.version !== CURRENT_VERSION) {
    throw new Error(`Version de chiffrement non supportée : ${payload.version}`)
  }

  const parts = payload.data.split(':')
  if (parts.length !== 3) {
    throw new Error('Format de données chiffrées invalide')
  }

  const [ivHex, authTagHex, ciphertextHex] = parts
  if (!ivHex || !authTagHex || !ciphertextHex) {
    throw new Error('Composants de chiffrement manquants')
  }

  const iv = Buffer.from(ivHex, 'hex')
  const authTag = Buffer.from(authTagHex, 'hex')
  const ciphertext = Buffer.from(ciphertextHex, 'hex')

  if (iv.length !== IV_LENGTH) {
    throw new Error(`Longueur du vecteur d'initialisation invalide : attendu ${IV_LENGTH}, reçu ${iv.length}`)
  }

  const decipher = createDecipheriv(ALGORITHM, key, iv, { authTagLength: AUTH_TAG_LENGTH })
  decipher.setAuthTag(authTag)

  try {
    const decrypted = Buffer.concat([
      decipher.update(ciphertext),
      decipher.final(),
    ])
    return decrypted.toString('utf8')
  } catch {
    throw new Error('Échec du déchiffrement : clé incorrecte ou données corrompues')
  }
}

export function decryptToBuffer(payload: EncryptedPayload, key: Buffer): Buffer {
  validateKey(key)

  if (payload.version !== CURRENT_VERSION) {
    throw new Error(`Version de chiffrement non supportée : ${payload.version}`)
  }

  const parts = payload.data.split(':')
  if (parts.length !== 3) {
    throw new Error('Format de données chiffrées invalide')
  }

  const [ivHex, authTagHex, ciphertextHex] = parts
  if (!ivHex || !authTagHex || !ciphertextHex) {
    throw new Error('Composants de chiffrement manquants')
  }

  const iv = Buffer.from(ivHex, 'hex')
  const authTag = Buffer.from(authTagHex, 'hex')
  const ciphertext = Buffer.from(ciphertextHex, 'hex')

  const decipher = createDecipheriv(ALGORITHM, key, iv, { authTagLength: AUTH_TAG_LENGTH })
  decipher.setAuthTag(authTag)

  try {
    return Buffer.concat([
      decipher.update(ciphertext),
      decipher.final(),
    ])
  } catch {
    throw new Error('Échec du déchiffrement : clé incorrecte ou données corrompues')
  }
}

// ─── Rotation de clé ─────────────────────────────────────────────────────────

export function rotateKey(
  payload: EncryptedPayload,
  oldKey: Buffer,
  newKey: Buffer,
): RotationResult {
  validateKey(oldKey)
  validateKey(newKey)

  const plaintext = decrypt(payload, oldKey)
  const newPayload = encrypt(plaintext, newKey)

  return {
    payload: newPayload,
    rotatedAt: Date.now(),
  }
}

export function batchRotateKeys(
  payloads: EncryptedPayload[],
  oldKey: Buffer,
  newKey: Buffer,
): RotationResult[] {
  return payloads.map((payload) => rotateKey(payload, oldKey, newKey))
}

// ─── Chiffrement de messages E2E ─────────────────────────────────────────────

export function encryptMessage(
  senderId: string,
  recipientId: string,
  content: string,
  key: Buffer,
): MessageEnvelope {
  if (!senderId || !recipientId) {
    throw new Error('Les identifiants de l\'expéditeur et du destinataire sont requis')
  }

  if (!content || content.length === 0) {
    throw new Error('Le contenu du message ne peut pas être vide')
  }

  const payload = encrypt(content, key)
  const messageId = randomBytes(16).toString('hex')

  return {
    senderId,
    recipientId,
    payload,
    timestamp: Date.now(),
    messageId,
  }
}

export function decryptMessage(
  envelope: MessageEnvelope,
  key: Buffer,
): string {
  if (!envelope.payload) {
    throw new Error('L\'enveloppe du message ne contient pas de données chiffrées')
  }

  return decrypt(envelope.payload, key)
}

// ─── Validation ──────────────────────────────────────────────────────────────

function validateKey(key: Buffer): void {
  if (!key || !Buffer.isBuffer(key)) {
    throw new Error('La clé de chiffrement doit être un Buffer valide')
  }
  if (key.length !== KEY_LENGTH) {
    throw new Error(
      `La clé doit faire ${KEY_LENGTH} octets, reçu ${key.length} octets`,
    )
  }
}
