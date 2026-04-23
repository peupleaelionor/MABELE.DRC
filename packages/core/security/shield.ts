// ─── MABELE Security: Response Shield ─────────────────────────────────────────
// Injects security headers on every response.
// Based on OWASP best practices — tuned for MABELE's Next.js app.

/** Security headers to inject on every response. */
export const SECURITY_HEADERS: Record<string, string> = {
  // Prevent clickjacking
  'X-Frame-Options': 'DENY',
  // Prevent MIME-type sniffing
  'X-Content-Type-Options': 'nosniff',
  // Referrer policy
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  // XSS protection (legacy browsers)
  'X-XSS-Protection': '1; mode=block',
  // DNS prefetch control
  'X-DNS-Prefetch-Control': 'off',
  // Permissions policy (disable unnecessary browser APIs)
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(self), payment=(self)',
  // HSTS (1 year, include subdomains, preload)
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  // Remove server fingerprint
  'Server': 'MABELE',
  // Cache control for API responses (no store by default)
  'Cache-Control': 'no-store',
  // Content-Security-Policy — tight but functional for MABELE
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Next.js requires unsafe-inline for hydration
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data:",
    "connect-src 'self' https://api.mabele.cd wss://realtime.mabele.cd",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests",
  ].join('; '),
}

/** Apply security headers to a Response or Headers object. */
export function applySecurityHeaders(headers: Headers): void {
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    headers.set(key, value)
  }
}

/** Generate a short random request ID for tracing. */
export function generateRequestId(): string {
  const bytes = new Uint8Array(8)
  crypto.getRandomValues(bytes)
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('')
}
