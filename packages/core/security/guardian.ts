// ─── MABELE Security: Guardian Orchestrator ───────────────────────────────────
// The single entry point for all security checks.
// Run this at the Edge (middleware) on every request.
// Deterministic — no AI dependency — self-contained.
//
// Decision tree:
//   1. IP permanently banned?          → BLOCK (403)
//   2. Honeypot path hit?              → permanent ban → BLOCK (403)
//   3. Scanner user-agent?             → SUSPECT, increment score → BLOCK if critical
//   4. Injection pattern in URL?       → BLOCK (400)
//   5. Threat score ≥ BLOCKED?         → BLOCK (429 or 403)
//   6. All clear                       → ALLOW, inject headers

import { fingerprint, type RequestFingerprint } from './fingerprint'
import { isHoneypotPath, isScannerUA, detectInjection } from './honeypot'
import { recordThreat, isBlocked, permanentBan, type ThreatSignal } from './sentinel'
import { applySecurityHeaders, generateRequestId } from './shield'

export type GuardDecision = 'ALLOW' | 'BLOCK' | 'RATE_LIMITED' | 'BANNED'

export interface GuardResult {
  decision: GuardDecision
  requestId: string
  fp: RequestFingerprint
  /** HTTP status to return on block */
  status?: number
  /** Human-readable reason (internal only, never sent to client) */
  reason?: string
  /** Signals detected this request */
  signals: ThreatSignal[]
}

export interface GuardOptions {
  /** Skip honeypot check (for internal routes) */
  skipHoneypot?: boolean
  /** Skip scanner UA check (for public API clients) */
  skipScannerCheck?: boolean
}

/** Main guardian check — call from Next.js middleware. */
export function guardRequest(
  headers: Headers,
  pathname: string,
  opts: GuardOptions = {},
): GuardResult {
  const fp = fingerprint(headers)
  const requestId = generateRequestId()
  const signals: ThreatSignal[] = []

  // 1. Already banned?
  if (isBlocked(fp.ip)) {
    return { decision: 'BANNED', requestId, fp, status: 403, reason: 'IP banned', signals }
  }

  // 2. Honeypot hit?
  if (!opts.skipHoneypot && isHoneypotPath(pathname)) {
    permanentBan(fp.ip, 'HONEYPOT_HIT')
    signals.push('HONEYPOT_HIT')
    return { decision: 'BANNED', requestId, fp, status: 403, reason: 'Honeypot', signals }
  }

  // 3. Scanner user-agent?
  const ua = headers.get('user-agent') ?? ''
  if (!opts.skipScannerCheck && isScannerUA(ua)) {
    const t = recordThreat(fp.ip, 'SCANNER_UA')
    signals.push('SCANNER_UA')
    if (t.level === 'BLOCKED') {
      return { decision: 'BANNED', requestId, fp, status: 403, reason: 'Scanner UA', signals }
    }
  }

  // 4. Missing user-agent (raw bot)?
  if (!ua || ua.trim() === '') {
    recordThreat(fp.ip, 'MISSING_UA')
    signals.push('MISSING_UA')
  }

  // 5. Injection in URL?
  const injectionSignal = detectInjection(pathname)
  if (injectionSignal) {
    recordThreat(fp.ip, injectionSignal)
    signals.push(injectionSignal)
    return { decision: 'BLOCK', requestId, fp, status: 400, reason: 'Injection attempt', signals }
  }

  // 6. Re-check ban after signal accumulation
  if (isBlocked(fp.ip)) {
    return { decision: 'BANNED', requestId, fp, status: 403, reason: 'Threat score critical', signals }
  }

  // All clear
  return { decision: 'ALLOW', requestId, fp, signals }
}

/** Apply security headers to an outgoing response. */
export { applySecurityHeaders, generateRequestId } from './shield'
export { recordThreat, isBlocked, permanentBan, liftBan, getThreat } from './sentinel'
export { verifyHmac, verifyRequest, signHmac, signRequest, signWebhook } from './hmac'
export { fingerprint, extractIp } from './fingerprint'
export { isHoneypotPath, isScannerUA, detectInjection } from './honeypot'
