// ─── API: Honeypot Trap ───────────────────────────────────────────────────────
// Any request reaching this route is from a scanner, bot, or attacker.
// Permanently bans the IP and returns a 404 (no information disclosure).
// Routes: /api/honeypot/* AND also /wp-admin, /.env etc. via middleware.

import { permanentBan } from '@mabele/core-security'
import { extractIp } from '@mabele/core-security'

export async function GET(request: Request) {
  const headers = new Headers(request.headers)
  const ip = extractIp(headers)
  permanentBan(ip, 'HONEYPOT_HIT')
  console.error(`[MABELE-SECURITY][HONEYPOT] ip=${ip} url=${request.url}`)
  // Return 404 — no information about why
  return new Response(null, { status: 404 })
}

export const POST  = GET
export const PUT   = GET
export const PATCH = GET
export const DELETE = GET
