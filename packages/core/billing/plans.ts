import type { PlanDefinition } from './types'

// ─── MABELE Plan Definitions ──────────────────────────────────────────────────
// Citizens: FREE forever
// Businesses: tiered paid plans
// Pricing in USD (adjustable per market)

export const PLANS: PlanDefinition[] = [
  {
    key: 'free',
    name: 'Gratuit',
    tier: 'FREE',
    description: 'Pour les citoyens congolais. Gratuit pour toujours.',
    priceMonthly: 0,
    priceYearly: 0,
    devise: 'USD',
    isPublic: true,
    sortOrder: 0,
    features: {
      listingBoost: false,
      featuredPlacement: false,
      advancedAnalytics: false,
      merchantTools: false,
      apiAccess: false,
      verificationBadge: false,
      teamAccounts: false,
      invoicingTools: true,
      prioritySupport: false,
      customBranding: false,
      bulkListings: false,
      exportData: false,
    },
    limits: {
      listingsPerMonth: 5,
      boostsPerMonth: 0,
      teamMembers: 1,
      apiRequestsPerDay: 0,
      storageGb: 1,
      smsPerMonth: 0,
    },
  },
  {
    key: 'starter',
    name: 'Starter Business',
    tier: 'STARTER',
    description: 'Pour les petits entrepreneurs et vendeurs indépendants.',
    priceMonthly: 9.99,
    priceYearly: 89.99,
    devise: 'USD',
    isPublic: true,
    sortOrder: 1,
    features: {
      listingBoost: true,
      featuredPlacement: false,
      advancedAnalytics: false,
      merchantTools: true,
      apiAccess: false,
      verificationBadge: true,
      teamAccounts: false,
      invoicingTools: true,
      prioritySupport: false,
      customBranding: false,
      bulkListings: false,
      exportData: true,
    },
    limits: {
      listingsPerMonth: 30,
      boostsPerMonth: 5,
      teamMembers: 1,
      apiRequestsPerDay: 0,
      storageGb: 5,
      smsPerMonth: 50,
    },
  },
  {
    key: 'business',
    name: 'Business',
    tier: 'BUSINESS',
    description: 'Pour les PME, agences, et marchands établis.',
    priceMonthly: 29.99,
    priceYearly: 269.99,
    devise: 'USD',
    isPublic: true,
    sortOrder: 2,
    features: {
      listingBoost: true,
      featuredPlacement: true,
      advancedAnalytics: true,
      merchantTools: true,
      apiAccess: true,
      verificationBadge: true,
      teamAccounts: true,
      invoicingTools: true,
      prioritySupport: true,
      customBranding: false,
      bulkListings: true,
      exportData: true,
    },
    limits: {
      listingsPerMonth: 200,
      boostsPerMonth: 20,
      teamMembers: 5,
      apiRequestsPerDay: 1000,
      storageGb: 20,
      smsPerMonth: 500,
    },
  },
  {
    key: 'enterprise',
    name: 'Enterprise',
    tier: 'ENTERPRISE',
    description: 'Pour les grandes entreprises, banques et institutions.',
    priceMonthly: 99.99,
    priceYearly: 899.99,
    devise: 'USD',
    isPublic: true,
    sortOrder: 3,
    features: {
      listingBoost: true,
      featuredPlacement: true,
      advancedAnalytics: true,
      merchantTools: true,
      apiAccess: true,
      verificationBadge: true,
      teamAccounts: true,
      invoicingTools: true,
      prioritySupport: true,
      customBranding: true,
      bulkListings: true,
      exportData: true,
    },
    limits: {
      listingsPerMonth: null,
      boostsPerMonth: null,
      teamMembers: null,
      apiRequestsPerDay: null,
      storageGb: null,
      smsPerMonth: 5000,
    },
  },
]

export const PLAN_BY_KEY = Object.fromEntries(PLANS.map((p) => [p.key, p])) as Record<
  string,
  PlanDefinition
>

export function getPlan(key: string): PlanDefinition | null {
  return PLAN_BY_KEY[key] ?? null
}

export function getPublicPlans(): PlanDefinition[] {
  return PLANS.filter((p) => p.isPublic)
}
