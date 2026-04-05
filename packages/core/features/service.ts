import type { PrismaClient, FeatureFlag } from '@prisma/client'
import type { FeatureFlagConfig, FeatureFlagContext, ModuleKey, ModuleStatus } from './types'
import { DEFAULT_FEATURES } from './defaults'

// ─── Get All Feature Flags ───────────────────────────────────────────────────

export async function getFeatureFlags(
  prisma: PrismaClient,
): Promise<FeatureFlag[]> {
  const flags = await prisma.featureFlag.findMany({
    orderBy: { key: 'asc' },
  })

  return flags
}

// ─── Is Feature Enabled ──────────────────────────────────────────────────────

export async function isFeatureEnabled(
  prisma: PrismaClient,
  key: string,
  context?: FeatureFlagContext,
): Promise<boolean> {
  const flag = await prisma.featureFlag.findUnique({
    where: { key },
  })

  if (!flag || !flag.enabled) return false

  if (context?.city && flag.cities.length > 0) {
    const cityMatch = flag.cities.some(
      (c) => c.toLowerCase() === context.city!.toLowerCase(),
    )
    if (!cityMatch) return false
  }

  if (context?.country && flag.countries.length > 0) {
    const countryMatch = flag.countries.some(
      (c) => c.toLowerCase() === context.country!.toLowerCase(),
    )
    if (!countryMatch) return false
  }

  if (context?.role && flag.roles.length > 0) {
    const roleMatch = flag.roles.some(
      (r) => r.toLowerCase() === context.role!.toLowerCase(),
    )
    if (!roleMatch) return false
  }

  return true
}

// ─── Set Feature Flag ────────────────────────────────────────────────────────

export async function setFeatureFlag(
  prisma: PrismaClient,
  key: string,
  data: Partial<FeatureFlagConfig>,
): Promise<FeatureFlag> {
  const flag = await prisma.featureFlag.upsert({
    where: { key },
    create: {
      key,
      name: data.name ?? key,
      description: data.description ?? null,
      enabled: data.enabled ?? false,
      modules: data.modules ?? [],
      cities: data.cities ?? [],
      countries: data.countries ?? [],
      roles: data.roles ?? [],
    },
    update: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.enabled !== undefined && { enabled: data.enabled }),
      ...(data.modules !== undefined && { modules: data.modules }),
      ...(data.cities !== undefined && { cities: data.cities }),
      ...(data.countries !== undefined && { countries: data.countries }),
      ...(data.roles !== undefined && { roles: data.roles }),
    },
  })

  return flag
}

// ─── Get Module Status ───────────────────────────────────────────────────────

const MODULE_KEYS: ModuleKey[] = [
  'immobilier',
  'emploi',
  'marketplace',
  'agritech',
  'nkisi',
  'congodata',
  'kangapay',
  'bima',
]

export async function getModuleStatus(
  prisma: PrismaClient,
): Promise<ModuleStatus> {
  const flags = await prisma.featureFlag.findMany({
    where: { key: { in: MODULE_KEYS } },
    select: { key: true, enabled: true },
  })

  const flagMap = new Map(flags.map((f) => [f.key, f.enabled]))

  const status = {} as ModuleStatus
  for (const key of MODULE_KEYS) {
    status[key] = flagMap.get(key) ?? false
  }

  return status
}

// ─── Seed Feature Flags ──────────────────────────────────────────────────────

export async function seedFeatureFlags(
  prisma: PrismaClient,
): Promise<FeatureFlag[]> {
  const created: FeatureFlag[] = []

  for (const [key, config] of Object.entries(DEFAULT_FEATURES)) {
    const existing = await prisma.featureFlag.findUnique({
      where: { key },
    })

    if (!existing) {
      const flag = await prisma.featureFlag.create({
        data: {
          key,
          name: config.name,
          description: config.description,
          enabled: config.enabled,
          modules: [],
          cities: [],
          countries: [],
          roles: [],
        },
      })
      created.push(flag)
    }
  }

  return created
}
