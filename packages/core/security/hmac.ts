// ─── MABELE Security: HMAC Signing ────────────────────────────────────────────
// Signs and verifies internal service-to-service requests + webhook payloads.
// Uses Web Crypto API (Edge-runtime compatible).
// Secret: process.env.MABELE_INTERNAL_SECRET

const ALG = 'SHA-256'

async function importKey(secret: string): Promise<CryptoKey> {
  const enc = new TextEncoder()
  return crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: ALG },
    false,
    ['sign', 'verify'],
  )
}

function toHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

function fromHex(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2)
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16)
  }
  return bytes
}

/** Sign a payload string. Returns hex signature. */
export async function signHmac(payload: string, secret?: string): Promise<string> {
  const s = secret ?? process.env.MABELE_INTERNAL_SECRET ?? 'mabele-dev-secret'
  const key = await importKey(s)
  const enc = new TextEncoder()
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(payload))
  return toHex(sig)
}

/** Verify a hex signature against the payload. Constant-time. */
export async function verifyHmac(payload: string, signature: string, secret?: string): Promise<boolean> {
  try {
    const s = secret ?? process.env.MABELE_INTERNAL_SECRET ?? 'mabele-dev-secret'
    const key = await importKey(s)
    const enc = new TextEncoder()
    const sigBytes = fromHex(signature)
    return crypto.subtle.verify('HMAC', key, sigBytes, enc.encode(payload))
  } catch {
    return false
  }
}

/** Build a timestamped request signature: `${timestamp}.${body}` → sign. */
export async function signRequest(body: string, secret?: string): Promise<{ signature: string; timestamp: number }> {
  const timestamp = Date.now()
  const payload = `${timestamp}.${body}`
  const signature = await signHmac(payload, secret)
  return { signature, timestamp }
}

/** Verify a request signature. Rejects if older than 5 minutes or from the future. */
export async function verifyRequest(
  body: string,
  signature: string,
  timestamp: number,
  secret?: string,
  maxAgeMs = 5 * 60 * 1000,
): Promise<boolean> {
  const age = Date.now() - timestamp
  // Reject future timestamps (clock skew > 30s indicates replay attack or manipulation)
  if (age < -30_000) return false
  // Reject expired timestamps
  if (age > maxAgeMs) return false
  const payload = `${timestamp}.${body}`
  return verifyHmac(payload, signature, secret)
}

/** Sign a webhook payload (Orange/Airtel/Stripe callback verification). */
export async function signWebhook(body: string, secret: string): Promise<string> {
  return signHmac(body, secret)
}
