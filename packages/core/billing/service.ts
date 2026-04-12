import type { PrismaClient } from '@prisma/client'
import type {
  CreateSubscriptionInput,
  SubscriptionResult,
  EntitlementCheck,
  PlanFeatures,
  PlanLimits,
} from './types'
import { getPlan, PLAN_BY_KEY } from './plans'
import { logger } from '../logger/index'

// ─── Subscription Service ─────────────────────────────────────────────────────

export async function createSubscription(
  prisma: PrismaClient,
  input: CreateSubscriptionInput,
): Promise<SubscriptionResult> {
  const plan = getPlan(input.planKey)
  if (!plan) {
    throw new Error(`Plan introuvable: ${input.planKey}`)
  }

  const now = new Date()
  const periodStart = now
  const periodEnd = computePeriodEnd(now, input.cycle)
  const trialEnd = input.trialDays
    ? new Date(now.getTime() + input.trialDays * 86_400_000)
    : undefined

  // Cancel any existing active subscription
  await prisma.subscription.updateMany({
    where: { userId: input.userId, status: { in: ['ACTIVE', 'TRIALING'] } },
    data: { status: 'CANCELLED', cancelledAt: now, cancelAtPeriodEnd: false },
  })

  // Ensure plan exists in DB
  const dbPlan = await upsertPlan(prisma, input.planKey)

  const subscription = await prisma.subscription.create({
    data: {
      userId: input.userId,
      planId: dbPlan.id,
      status: trialEnd ? 'TRIALING' : 'ACTIVE',
      cycle: input.cycle,
      currentPeriodStart: periodStart,
      currentPeriodEnd: periodEnd,
      trialEnd: trialEnd ?? null,
      providerRef: input.providerRef ?? null,
      metadata: (input.metadata ?? null) as never,
    },
    include: { plan: true },
  })

  await prisma.billingEvent.create({
    data: {
      subscriptionId: subscription.id,
      type: trialEnd ? 'TRIAL_STARTED' : 'SUBSCRIPTION_CREATED',
      metadata: { planKey: input.planKey, cycle: input.cycle } as never,
    },
  })

  logger.info('Subscription created', {
    module: 'billing',
    action: 'subscription.created',
    userId: input.userId,
  })

  return toSubscriptionResult(subscription, plan.features, plan.limits)
}

export async function getUserSubscription(
  prisma: PrismaClient,
  userId: string,
): Promise<SubscriptionResult | null> {
  const subscription = await prisma.subscription.findFirst({
    where: { userId, status: { in: ['ACTIVE', 'TRIALING'] } },
    include: { plan: true },
    orderBy: { createdAt: 'desc' },
  })

  if (!subscription) return null

  const plan = getPlan((subscription.plan as { key: string }).key)
  if (!plan) return null

  return toSubscriptionResult(subscription, plan.features, plan.limits)
}

export async function cancelSubscription(
  prisma: PrismaClient,
  userId: string,
  atPeriodEnd = true,
): Promise<void> {
  const subscription = await prisma.subscription.findFirst({
    where: { userId, status: { in: ['ACTIVE', 'TRIALING'] } },
  })

  if (!subscription) {
    throw new Error('Aucun abonnement actif trouvé')
  }

  await prisma.subscription.update({
    where: { id: subscription.id },
    data: {
      cancelAtPeriodEnd: atPeriodEnd,
      cancelledAt: atPeriodEnd ? null : new Date(),
      status: atPeriodEnd ? 'ACTIVE' : 'CANCELLED',
    },
  })

  await prisma.billingEvent.create({
    data: {
      subscriptionId: subscription.id,
      type: 'SUBSCRIPTION_CANCELLED',
      metadata: { atPeriodEnd } as never,
    },
  })
}

// ─── Entitlement Checks ───────────────────────────────────────────────────────

export async function checkEntitlement(
  prisma: PrismaClient,
  userId: string,
  feature: keyof PlanFeatures,
): Promise<EntitlementCheck> {
  const sub = await getUserSubscription(prisma, userId)
  const features = sub?.features ?? getFreePlanFeatures()

  if (!features[feature]) {
    const upgradePlan = PLAN_BY_KEY['starter']
    return {
      allowed: false,
      reason: `Cette fonctionnalité nécessite un abonnement payant`,
      upgrade: { planKey: upgradePlan.key, planName: upgradePlan.name },
    }
  }

  return { allowed: true }
}

export async function checkLimit(
  prisma: PrismaClient,
  userId: string,
  limitKey: keyof PlanLimits,
  currentUsage: number,
): Promise<EntitlementCheck> {
  const sub = await getUserSubscription(prisma, userId)
  const limits = sub?.limits ?? getFreePlanLimits()

  const limit = limits[limitKey]

  if (limit === null) {
    return { allowed: true, limit: null }
  }

  if (currentUsage >= limit) {
    const upgradePlan = PLAN_BY_KEY['business']
    return {
      allowed: false,
      reason: `Limite atteinte: ${currentUsage}/${limit}`,
      limit,
      current: currentUsage,
      upgrade: { planKey: upgradePlan.key, planName: upgradePlan.name },
    }
  }

  return { allowed: true, limit, current: currentUsage }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function computePeriodEnd(from: Date, cycle: string): Date {
  const d = new Date(from)
  if (cycle === 'MONTHLY') d.setMonth(d.getMonth() + 1)
  else if (cycle === 'QUARTERLY') d.setMonth(d.getMonth() + 3)
  else if (cycle === 'YEARLY') d.setFullYear(d.getFullYear() + 1)
  return d
}

async function upsertPlan(prisma: PrismaClient, key: string) {
  const planDef = getPlan(key)!

  return prisma.plan.upsert({
    where: { key },
    create: {
      key,
      name: planDef.name,
      tier: planDef.tier,
      description: planDef.description,
      priceMonthly: planDef.priceMonthly,
      priceYearly: planDef.priceYearly,
      devise: planDef.devise,
      features: planDef.features as never,
      limits: planDef.limits as never,
      isPublic: planDef.isPublic,
      sortOrder: planDef.sortOrder,
    },
    update: {
      name: planDef.name,
      priceMonthly: planDef.priceMonthly,
      priceYearly: planDef.priceYearly,
      features: planDef.features as never,
      limits: planDef.limits as never,
    },
  })
}

function getFreePlanFeatures(): PlanFeatures {
  return getPlan('free')!.features
}

function getFreePlanLimits(): PlanLimits {
  return getPlan('free')!.limits
}

function toSubscriptionResult(
  subscription: {
    id: string
    userId: string
    status: string
    cycle: string
    currentPeriodStart: Date
    currentPeriodEnd: Date
    trialEnd?: Date | null
    plan: { key: string; tier: string }
  },
  features: PlanFeatures,
  limits: PlanLimits,
): SubscriptionResult {
  return {
    id: subscription.id,
    userId: subscription.userId,
    planKey: (subscription.plan as { key: string }).key,
    planTier: (subscription.plan as { tier: string }).tier as never,
    status: subscription.status as never,
    cycle: subscription.cycle as never,
    currentPeriodStart: subscription.currentPeriodStart,
    currentPeriodEnd: subscription.currentPeriodEnd,
    trialEnd: subscription.trialEnd,
    features,
    limits,
  }
}
