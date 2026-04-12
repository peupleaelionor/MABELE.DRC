// ─── Billing Types ────────────────────────────────────────────────────────────

export type PlanTier = 'FREE' | 'STARTER' | 'BUSINESS' | 'ENTERPRISE'
export type BillingCycle = 'MONTHLY' | 'QUARTERLY' | 'YEARLY'
export type SubscriptionStatus = 'TRIALING' | 'ACTIVE' | 'PAST_DUE' | 'CANCELLED' | 'EXPIRED'

// ─── Plan Features & Limits ───────────────────────────────────────────────────

export interface PlanFeatures {
  listingBoost: boolean
  featuredPlacement: boolean
  advancedAnalytics: boolean
  merchantTools: boolean
  apiAccess: boolean
  verificationBadge: boolean
  teamAccounts: boolean
  invoicingTools: boolean
  prioritySupport: boolean
  customBranding: boolean
  bulkListings: boolean
  exportData: boolean
}

export interface PlanLimits {
  listingsPerMonth: number | null      // null = unlimited
  boostsPerMonth: number | null
  teamMembers: number | null
  apiRequestsPerDay: number | null
  storageGb: number | null
  smsPerMonth: number | null
}

export interface PlanDefinition {
  key: string
  name: string
  tier: PlanTier
  description: string
  priceMonthly: number
  priceYearly: number
  devise: string
  features: PlanFeatures
  limits: PlanLimits
  isPublic: boolean
  sortOrder: number
}

// ─── Subscription ─────────────────────────────────────────────────────────────

export interface CreateSubscriptionInput {
  userId: string
  planKey: string
  cycle: BillingCycle
  trialDays?: number
  providerRef?: string
  metadata?: Record<string, unknown>
}

export interface SubscriptionResult {
  id: string
  userId: string
  planKey: string
  planTier: PlanTier
  status: SubscriptionStatus
  cycle: BillingCycle
  currentPeriodStart: Date
  currentPeriodEnd: Date
  trialEnd?: Date | null
  features: PlanFeatures
  limits: PlanLimits
}

// ─── Entitlement Check ────────────────────────────────────────────────────────

export interface EntitlementCheck {
  allowed: boolean
  reason?: string
  limit?: number | null
  current?: number
  upgrade?: {
    planKey: string
    planName: string
  }
}
