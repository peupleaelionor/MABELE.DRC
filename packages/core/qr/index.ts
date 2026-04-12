// ─── QR Payment Primitives ────────────────────────────────────────────────────
// Two QR modes:
//   STATIC  — merchant QR linked to a merchant profile, valid forever
//   DYNAMIC — per-transaction QR, tied to a PaymentIntent, expires in 30 min

import { createId } from '@paralleldrive/cuid2'

export type QRMode = 'STATIC' | 'DYNAMIC'

export interface QRPayload {
  version: '1'
  mode: QRMode
  /** Merchant or user ID */
  recipientId: string
  /** Merchant display name */
  recipientName: string
  /** Payment intent ID — only for DYNAMIC */
  intentId?: string
  amount?: number
  currency?: string
  description?: string
  reference: string
  expiresAt?: string
}

// ─── Generate QR Payload ──────────────────────────────────────────────────────

export function buildStaticQRPayload(
  merchantId: string,
  merchantName: string,
): QRPayload {
  return {
    version: '1',
    mode: 'STATIC',
    recipientId: merchantId,
    recipientName: merchantName,
    reference: `QR-${merchantId}`,
  }
}

export function buildDynamicQRPayload(opts: {
  recipientId: string
  recipientName: string
  intentId: string
  amount: number
  currency: string
  description?: string
  ttlSeconds?: number
}): QRPayload {
  const ttl = opts.ttlSeconds ?? 1800 // 30 min default
  const expiresAt = new Date(Date.now() + ttl * 1000).toISOString()

  return {
    version: '1',
    mode: 'DYNAMIC',
    recipientId: opts.recipientId,
    recipientName: opts.recipientName,
    intentId: opts.intentId,
    amount: opts.amount,
    currency: opts.currency,
    description: opts.description,
    reference: `QR-${opts.intentId}`,
    expiresAt,
  }
}

// ─── QR URL ───────────────────────────────────────────────────────────────────
// The QR code encodes a MABELE deep-link / web URL.
// App resolves it → payment flow.

export function buildQRUrl(payload: QRPayload): string {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? 'https://mabele.cd'
  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url')
  return `${base}/pay/${encoded}`
}

export function parseQRUrl(encoded: string): QRPayload | null {
  try {
    const json = Buffer.from(encoded, 'base64url').toString('utf-8')
    const payload = JSON.parse(json) as QRPayload
    if (payload.version !== '1') return null

    // Check expiry for dynamic QR
    if (payload.mode === 'DYNAMIC' && payload.expiresAt) {
      if (new Date(payload.expiresAt) < new Date()) return null
    }
    return payload
  } catch {
    return null
  }
}

// ─── Payment Link ─────────────────────────────────────────────────────────────

export interface PaymentLink {
  id: string
  url: string
  createdAt: string
  expiresAt?: string
}

export function buildPaymentLink(opts: {
  merchantId: string
  merchantName: string
  amount?: number
  currency?: string
  description?: string
  ttlSeconds?: number
}): PaymentLink {
  const id = createId()
  const payload: QRPayload = {
    version: '1',
    mode: opts.amount ? 'DYNAMIC' : 'STATIC',
    recipientId: opts.merchantId,
    recipientName: opts.merchantName,
    amount: opts.amount,
    currency: opts.currency ?? 'USD',
    description: opts.description,
    reference: `LINK-${id}`,
    expiresAt: opts.ttlSeconds
      ? new Date(Date.now() + opts.ttlSeconds * 1000).toISOString()
      : undefined,
  }

  return {
    id,
    url: buildQRUrl(payload),
    createdAt: new Date().toISOString(),
    expiresAt: payload.expiresAt,
  }
}
