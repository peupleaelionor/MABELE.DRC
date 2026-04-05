export type {
  ModuleKey,
  FeatureFlagConfig,
  FeatureFlagContext,
  ModuleStatus,
  FeatureFlag,
} from './types'

export { DEFAULT_FEATURES } from './defaults'

export {
  getFeatureFlags,
  isFeatureEnabled,
  setFeatureFlag,
  getModuleStatus,
  seedFeatureFlags,
} from './service'
