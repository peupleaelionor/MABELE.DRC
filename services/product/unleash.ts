// ─── Unleash Feature Flags ────────────────────────────────────────────────────
// Adapter for Unleash-compatible feature flag evaluation.
// Falls back to DB-backed FeatureFlag model if Unleash is not configured.
// This means flags work from day 1 without needing an Unleash server.

export interface FlagContext {
  userId?: string
  role?: string
  city?: string
  country?: string
  planTier?: string
  sessionId?: string
}

export interface FeatureFlagAdapter {
  isEnabled(flag: string, context?: FlagContext): Promise<boolean>
  getVariant(flag: string, context?: FlagContext): Promise<string | null>
}

// ─── DB-backed Adapter ────────────────────────────────────────────────────────

export class DbFeatureFlagAdapter implements FeatureFlagAdapter {
  constructor(
    private db: {
      featureFlag: {
        findUnique: (args: { where: { key: string } }) => Promise<{
          enabled: boolean
          roles: string[]
          cities: string[]
          countries: string[]
          planTiers: string[]
          rolloutPct: number
          modules: string[]
        } | null>
      }
    },
  ) {}

  async isEnabled(flag: string, context?: FlagContext): Promise<boolean> {
    const record = await this.db.featureFlag.findUnique({ where: { key: flag } })
    if (!record || !record.enabled) return false

    if (record.roles.length > 0 && context?.role && !record.roles.includes(context.role)) {
      return false
    }
    if (record.cities.length > 0 && context?.city && !record.cities.includes(context.city)) {
      return false
    }
    if (record.countries.length > 0 && context?.country && !record.countries.includes(context.country)) {
      return false
    }
    if (record.planTiers.length > 0 && context?.planTier && !record.planTiers.includes(context.planTier)) {
      return false
    }

    // Percentage rollout
    if (record.rolloutPct < 100 && context?.userId) {
      const hash = context.userId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
      const bucket = hash % 100
      if (bucket >= record.rolloutPct) return false
    }

    return true
  }

  async getVariant(_flag: string): Promise<string | null> {
    return null // variants not supported in DB adapter — use Unleash SDK for A/B
  }
}

// ─── Well-known flag keys ─────────────────────────────────────────────────────
// Define all flag keys centrally to avoid magic strings.

export const FLAGS = {
  KANGAPAY_ENABLED: 'kangapay_enabled',
  TONTINE_ENABLED: 'tontine_enabled',
  BIMA_ENABLED: 'bima_enabled',
  QR_PAYMENTS: 'qr_payments',
  PAYMENT_LINKS: 'payment_links',
  MERCHANT_TOOLS: 'merchant_tools',
  ADVANCED_ANALYTICS: 'advanced_analytics',
  AI_COPILOT: 'ai_copilot',
  OFFLINE_SYNC: 'offline_sync',
  REFERRAL_PROGRAM: 'referral_program',
  WHATSAPP_NOTIFICATIONS: 'whatsapp_notifications',
  PUSH_NOTIFICATIONS: 'push_notifications',
  ID_VERIFICATION: 'id_verification',
  ESCROW_PAYMENTS: 'escrow_payments',
} as const

export type FlagKey = (typeof FLAGS)[keyof typeof FLAGS]
