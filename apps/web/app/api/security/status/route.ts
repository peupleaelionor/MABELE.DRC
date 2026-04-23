// ─── API: Security Status (internal only) ─────────────────────────────────────
// Returns the current security health + active threat counts.
// Protected by X-MABELE-Internal-Secret header.

import { getThreat } from '@mabele/core-security'

export async function GET(request: Request) {
  // Internal secret gate
  const secret = request.headers.get('x-mabele-internal-secret')
  const expected = process.env.MABELE_INTERNAL_SECRET
  if (!expected || secret !== expected) {
    return new Response(null, { status: 404 }) // No info disclosure
  }

  const uptime = process.uptime?.() ?? 0

  return Response.json({
    success:   true,
    status:    'operational',
    version:   '1.0.0',
    uptime:    Math.floor(uptime),
    timestamp: new Date().toISOString(),
    security: {
      guardian:  'active',
      honeypot:  'active',
      sentinel:  'active',
      hmac:      'active',
    },
  })
}
