import type { FeatureFlag } from '@prisma/client'

// ─── Feature Flag Types ──────────────────────────────────────────────────────

export type ModuleKey =
  | 'immobilier'
  | 'emploi'
  | 'marketplace'
  | 'agritech'
  | 'nkisi'
  | 'congodata'
  | 'kangapay'
  | 'bima'

export interface FeatureFlagConfig {
  key: string
  name: string
  description?: string
  enabled: boolean
  modules?: string[]
  cities?: string[]
  countries?: string[]
  roles?: string[]
}

// ─── Context ─────────────────────────────────────────────────────────────────

export interface FeatureFlagContext {
  city?: string
  country?: string
  role?: string
}

// ─── Module Status ───────────────────────────────────────────────────────────

export type ModuleStatus = Record<ModuleKey, boolean>

export type { FeatureFlag }
