// ─── Architecture Zero Trust ─────────────────────────────────────────────────
// Scoring de confiance, validation de session, authentification continue
// ──────────────────────────────────────────────────────────────────────────────

// ─── Types ───────────────────────────────────────────────────────────────────

export interface DeviceAttestation {
  platform: string
  browser: string
  fingerprint: string
  screenResolution?: string
  language?: string
  timezone?: string
  webgl?: string
  installedPlugins?: string[]
}

export interface DeviceInfo {
  attestation: DeviceAttestation
  firstSeenAt: number
  lastSeenAt: number
  trustHistory: TrustEvent[]
  isVerified: boolean
}

export interface TrustEvent {
  timestamp: number
  score: number
  reason: string
}

export interface SessionContext {
  sessionId: string
  userId: string
  deviceFingerprint: string
  ip: string
  createdAt: number
  lastActivityAt: number
  mfaVerified: boolean
  geoLocation?: GeoInfo
}

export interface GeoInfo {
  country: string
  region?: string
  city?: string
  isVpn?: boolean
  isTor?: boolean
  isProxy?: boolean
}

export interface SessionValidationResult {
  valid: boolean
  requiresReauth: boolean
  trustScore: number
  reasons: string[]
}

export type SensitivityLevel = 'low' | 'medium' | 'high' | 'critical'

export interface ReauthRequirement {
  required: boolean
  reason?: string
  maxAgeMs: number
}

export interface NetworkTrustResult {
  score: number
  factors: NetworkTrustFactor[]
  recommendation: 'allow' | 'challenge' | 'deny'
}

export interface NetworkTrustFactor {
  name: string
  score: number
  description: string
}

export interface TrustPolicy {
  name: string
  minimumTrustScore: number
  requireMfa: boolean
  maxSessionAgeMs: number
  allowedCountries?: string[]
  blockedCountries?: string[]
  requireVerifiedDevice: boolean
  sensitivityLevel: SensitivityLevel
}

export interface PolicyEvaluationResult {
  allowed: boolean
  matchedPolicy: string | null
  trustScore: number
  violations: string[]
  recommendations: string[]
}

// ─── Constantes ──────────────────────────────────────────────────────────────

const SESSION_MAX_AGE: Record<SensitivityLevel, number> = {
  low: 24 * 60 * 60 * 1000,      // 24 heures
  medium: 8 * 60 * 60 * 1000,    // 8 heures
  high: 2 * 60 * 60 * 1000,      // 2 heures
  critical: 15 * 60 * 1000,       // 15 minutes
}

const INACTIVITY_THRESHOLD: Record<SensitivityLevel, number> = {
  low: 60 * 60 * 1000,           // 60 minutes
  medium: 30 * 60 * 1000,        // 30 minutes
  high: 15 * 60 * 1000,          // 15 minutes
  critical: 5 * 60 * 1000,       // 5 minutes
}

// ─── Scoring de confiance d'appareil ─────────────────────────────────────────

export function calculateDeviceTrust(device: DeviceInfo): number {
  let score = 0

  if (device.isVerified) score += 25

  const ageDays = (Date.now() - device.firstSeenAt) / (24 * 60 * 60 * 1000)
  if (ageDays > 90) score += 20
  else if (ageDays > 30) score += 15
  else if (ageDays > 7) score += 10
  else if (ageDays > 1) score += 5

  const recentEvents = device.trustHistory.filter(
    (e) => Date.now() - e.timestamp < 30 * 24 * 60 * 60 * 1000,
  )

  if (recentEvents.length > 0) {
    const avgScore = recentEvents.reduce((sum, e) => sum + e.score, 0) / recentEvents.length
    score += Math.min(25, Math.floor(avgScore / 4))
  }

  if (device.attestation.platform) score += 5
  if (device.attestation.browser) score += 5
  if (device.attestation.fingerprint) score += 10
  if (device.attestation.screenResolution) score += 3
  if (device.attestation.language) score += 2
  if (device.attestation.timezone) score += 2
  if (device.attestation.webgl) score += 3

  return Math.min(100, Math.max(0, score))
}

// ─── Validation de session ───────────────────────────────────────────────────

export function validateSession(
  session: SessionContext,
  sensitivityLevel: SensitivityLevel = 'medium',
): SessionValidationResult {
  const reasons: string[] = []
  let trustScore = 100
  let requiresReauth = false
  const now = Date.now()

  const maxAge = SESSION_MAX_AGE[sensitivityLevel]
  const sessionAge = now - session.createdAt
  if (sessionAge > maxAge) {
    trustScore -= 40
    requiresReauth = true
    reasons.push('Session expirée')
  }

  const inactivityThreshold = INACTIVITY_THRESHOLD[sensitivityLevel]
  const inactivity = now - session.lastActivityAt
  if (inactivity > inactivityThreshold) {
    trustScore -= 30
    requiresReauth = true
    reasons.push('Inactivité prolongée')
  }

  if (!session.mfaVerified && (sensitivityLevel === 'high' || sensitivityLevel === 'critical')) {
    trustScore -= 25
    requiresReauth = true
    reasons.push('Authentification MFA requise')
  }

  if (session.geoLocation?.isVpn) {
    trustScore -= 10
    reasons.push('Connexion via VPN détectée')
  }

  if (session.geoLocation?.isTor) {
    trustScore -= 20
    reasons.push('Connexion via Tor détectée')
  }

  if (session.geoLocation?.isProxy) {
    trustScore -= 10
    reasons.push('Connexion via proxy détectée')
  }

  trustScore = Math.max(0, Math.min(100, trustScore))

  return {
    valid: trustScore >= 40 && !requiresReauth,
    requiresReauth,
    trustScore,
    reasons,
  }
}

// ─── Réauthentification continue ─────────────────────────────────────────────

export function requireReauth(
  lastAuthAt: number,
  sensitivityLevel: SensitivityLevel,
): ReauthRequirement {
  const maxAge = SESSION_MAX_AGE[sensitivityLevel]
  const elapsed = Date.now() - lastAuthAt

  if (elapsed > maxAge) {
    return {
      required: true,
      reason: `Réauthentification requise pour le niveau de sensibilité « ${sensitivityLevel} » (dernière auth il y a ${Math.floor(elapsed / 60000)} minutes)`,
      maxAgeMs: maxAge,
    }
  }

  return {
    required: false,
    maxAgeMs: maxAge,
  }
}

// ─── Confiance réseau ────────────────────────────────────────────────────────

export function assessNetworkTrust(
  ip: string,
  geo?: GeoInfo,
  knownIps?: string[],
): NetworkTrustResult {
  const factors: NetworkTrustFactor[] = []
  let totalScore = 0

  if (knownIps && knownIps.includes(ip)) {
    factors.push({ name: 'ip_connue', score: 30, description: 'Adresse IP connue et fiable' })
    totalScore += 30
  } else {
    factors.push({ name: 'ip_inconnue', score: 10, description: 'Adresse IP non reconnue' })
    totalScore += 10
  }

  if (geo) {
    if (geo.isVpn) {
      factors.push({ name: 'vpn', score: -15, description: 'Connexion VPN détectée' })
      totalScore -= 15
    }

    if (geo.isTor) {
      factors.push({ name: 'tor', score: -30, description: 'Réseau Tor détecté' })
      totalScore -= 30
    }

    if (geo.isProxy) {
      factors.push({ name: 'proxy', score: -10, description: 'Proxy détecté' })
      totalScore -= 10
    }

    if (geo.country) {
      factors.push({ name: 'géolocalisation', score: 20, description: `Pays : ${geo.country}` })
      totalScore += 20
    }
  } else {
    factors.push({ name: 'pas_de_géo', score: 5, description: 'Informations de géolocalisation indisponibles' })
    totalScore += 5
  }

  const isPrivateIp = ip.startsWith('10.') || ip.startsWith('192.168.') || ip.startsWith('172.')
  if (isPrivateIp) {
    factors.push({ name: 'réseau_privé', score: 25, description: 'Réseau privé / interne' })
    totalScore += 25
  }

  const score = Math.max(0, Math.min(100, totalScore))
  let recommendation: NetworkTrustResult['recommendation']

  if (score >= 60) recommendation = 'allow'
  else if (score >= 30) recommendation = 'challenge'
  else recommendation = 'deny'

  return { score, factors, recommendation }
}

// ─── Moteur de politiques ────────────────────────────────────────────────────

export class PolicyEngine {
  private policies: TrustPolicy[] = []

  addPolicy(policy: TrustPolicy): void {
    const existing = this.policies.findIndex((p) => p.name === policy.name)
    if (existing !== -1) {
      this.policies[existing] = policy
    } else {
      this.policies.push(policy)
    }
  }

  removePolicy(name: string): boolean {
    const index = this.policies.findIndex((p) => p.name === name)
    if (index === -1) return false
    this.policies.splice(index, 1)
    return true
  }

  evaluate(
    trustScore: number,
    session: SessionContext,
    device?: DeviceInfo,
  ): PolicyEvaluationResult {
    const violations: string[] = []
    const recommendations: string[] = []
    let matchedPolicy: string | null = null
    let allowed = true

    const applicablePolicies = [...this.policies].sort(
      (a, b) => this.sensitivityOrder(b.sensitivityLevel) - this.sensitivityOrder(a.sensitivityLevel),
    )

    for (const policy of applicablePolicies) {
      const policyViolations = this.evaluatePolicy(policy, trustScore, session, device)

      if (policyViolations.length > 0) {
        matchedPolicy = policy.name
        violations.push(...policyViolations)
        allowed = false
        break
      }
    }

    if (!allowed) {
      if (trustScore < 50) {
        recommendations.push('Vérifier l\'identité de l\'utilisateur via MFA')
      }
      if (device && !device.isVerified) {
        recommendations.push('Enregistrer et vérifier l\'appareil')
      }
      if (!session.mfaVerified) {
        recommendations.push('Activer l\'authentification multi-facteurs')
      }
    }

    return { allowed, matchedPolicy, trustScore, violations, recommendations }
  }

  listPolicies(): TrustPolicy[] {
    return [...this.policies]
  }

  private evaluatePolicy(
    policy: TrustPolicy,
    trustScore: number,
    session: SessionContext,
    device?: DeviceInfo,
  ): string[] {
    const violations: string[] = []

    if (trustScore < policy.minimumTrustScore) {
      violations.push(
        `Score de confiance insuffisant : ${trustScore} < ${policy.minimumTrustScore} (politique : ${policy.name})`,
      )
    }

    if (policy.requireMfa && !session.mfaVerified) {
      violations.push(`MFA requis par la politique « ${policy.name} »`)
    }

    const sessionAge = Date.now() - session.createdAt
    if (sessionAge > policy.maxSessionAgeMs) {
      violations.push(`Session trop ancienne pour la politique « ${policy.name} »`)
    }

    if (policy.requireVerifiedDevice && device && !device.isVerified) {
      violations.push(`Appareil non vérifié requis par la politique « ${policy.name} »`)
    }

    const country = session.geoLocation?.country
    if (country) {
      if (policy.blockedCountries?.includes(country)) {
        violations.push(`Pays bloqué : ${country} (politique : ${policy.name})`)
      }
      if (policy.allowedCountries && !policy.allowedCountries.includes(country)) {
        violations.push(`Pays non autorisé : ${country} (politique : ${policy.name})`)
      }
    }

    return violations
  }

  private sensitivityOrder(level: SensitivityLevel): number {
    const order: Record<SensitivityLevel, number> = {
      low: 0,
      medium: 1,
      high: 2,
      critical: 3,
    }
    return order[level]
  }
}
