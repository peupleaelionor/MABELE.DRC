// ─── Fraud Detection Agent ────────────────────────────────────────────────────
// Rule-based fraud scoring, LLM-ready for future enrichment.
// Returns a risk score (0–100) and recommended action.

export interface FraudCheckInput {
  userId?: string
  listingId?: string
  paymentId?: string
  amount?: number
  phone?: string
  ipAddress?: string
  userAgent?: string
  action: 'listing_create' | 'payment_initiate' | 'account_create' | 'message_send'
}

export interface FraudCheckResult {
  riskScore: number
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  flags: string[]
  recommendation: 'ALLOW' | 'REVIEW' | 'BLOCK'
  reasons: string[]
}

export function checkFraud(input: FraudCheckInput): FraudCheckResult {
  const flags: string[] = []
  let score = 0

  // Amount checks
  if (input.amount !== undefined) {
    if (input.amount > 10_000) { flags.push('HIGH_AMOUNT'); score += 15 }
    if (input.amount > 50_000) { flags.push('VERY_HIGH_AMOUNT'); score += 20 }
    if (input.amount === 0)    { flags.push('ZERO_AMOUNT'); score += 30 }
  }

  // Phone checks (DRC)
  if (input.phone) {
    const drcPrefixes = ['+243', '243', '08', '09']
    const hasDrcPrefix = drcPrefixes.some((p) => input.phone!.startsWith(p))
    if (!hasDrcPrefix) { flags.push('NON_LOCAL_PHONE'); score += 10 }
  }

  // IP checks
  if (!input.ipAddress || input.ipAddress === '0.0.0.0') {
    flags.push('MISSING_IP'); score += 5
  }

  // User agent
  if (!input.userAgent) {
    flags.push('MISSING_USER_AGENT'); score += 5
  }

  // Compute level and recommendation
  const riskLevel: FraudCheckResult['riskLevel'] =
    score >= 60 ? 'CRITICAL' : score >= 40 ? 'HIGH' : score >= 20 ? 'MEDIUM' : 'LOW'

  const recommendation: FraudCheckResult['recommendation'] =
    riskLevel === 'CRITICAL' ? 'BLOCK' :
    riskLevel === 'HIGH' ? 'REVIEW' : 'ALLOW'

  return {
    riskScore: Math.min(100, score),
    riskLevel,
    flags,
    recommendation,
    reasons: flags,
  }
}

export function requiresFraudReview(score: number): boolean {
  return score >= 40
}
