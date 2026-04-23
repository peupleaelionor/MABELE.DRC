// ─── MABELE Security: Request Fingerprinting ─────────────────────────────────
// Extracts a deterministic fingerprint from request headers to identify clients
// even when they rotate IPs (proxy chains, VPNs, mobile networks).
// Pure function — no side effects — Edge-runtime compatible.

export interface RequestFingerprint {
  /** Primary IP (trusted proxy chain or direct) */
  ip: string
  /** Hashed composite fingerprint (hex, 16 chars) */
  fingerprint: string
  /** Raw signals used for fingerprinting */
  signals: {
    userAgent: string
    acceptLanguage: string
    acceptEncoding: string
    ip: string
  }
  /** Likely country from CF-IPCountry header */
  country: string
}

/** Extract the real client IP from headers (Cloudflare, Vercel, Netlify, direct). */
export function extractIp(headers: Headers): string {
  return (
    headers.get('cf-connecting-ip') ??
    headers.get('x-real-ip') ??
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    '0.0.0.0'
  )
}

/** Build a fingerprint string (no async, deterministic). */
export function buildFingerprintRaw(headers: Headers): {
  ip: string
  raw: string
  signals: RequestFingerprint['signals']
  country: string
} {
  const ip = extractIp(headers)
  const ua = headers.get('user-agent') ?? ''
  const lang = headers.get('accept-language')?.slice(0, 20) ?? ''
  const enc = headers.get('accept-encoding')?.slice(0, 20) ?? ''
  const country = headers.get('cf-ipcountry') ?? 'XX'
  const raw = `${ip}|${ua}|${lang}|${enc}`
  return { ip, raw, signals: { userAgent: ua, acceptLanguage: lang, acceptEncoding: enc, ip }, country }
}

/**
 * Hash a string to a short hex using djb2.
 * Intentionally non-cryptographic — used for bucketing/fingerprinting,
 * not for security decisions. Fast and Edge-runtime compatible (no async).
 * Cryptographic decisions (HMAC, ban) are handled by sentinel.ts and hmac.ts.
 */
export function quickHash(s: string): string {
  let h = 5381
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) + h) ^ s.charCodeAt(i)
    h = h >>> 0
  }
  return h.toString(16).padStart(8, '0')
}

/** Build a full fingerprint (sync, Edge-safe). */
export function fingerprint(headers: Headers): RequestFingerprint {
  const { ip, raw, signals, country } = buildFingerprintRaw(headers)
  return { ip, fingerprint: quickHash(raw), signals, country }
}
