// ─── Package Cache ───────────────────────────────────────────────────────────
// Exports centralisés du module de cache distribué
// ──────────────────────────────────────────────────────────────────────────────

export type {
  RedisConfig,
  ClusterConfig,
  SentinelConfig,
  PoolConfig,
  ScanResult,
  MessageHandler,
  RedisStats,
} from './redis'

export { RedisClient } from './redis'

export type {
  CacheStrategy,
  CacheStore,
  DataSource,
  StrategyConfig,
  CacheMetrics,
  WriteBehindConfig,
} from './strategies'

export {
  CacheAside,
  WriteThrough,
  WriteBehind,
  ReadThrough,
} from './strategies'

export type {
  InvalidationEvent,
  CascadeRule,
  InvalidationStats,
} from './invalidation'

export {
  TagBasedInvalidation,
  PatternInvalidation,
  CascadeInvalidation,
  VersionedInvalidation,
  computeInvalidationStats,
} from './invalidation'

export type {
  CompressionAlgorithm,
  CompressedCacheEntry,
  CompressionConfig,
  CompressionStats,
  AlgorithmStats,
} from './compression'

export {
  compress,
  decompress,
  decompressToString,
  adaptiveCompress,
  CompressionTracker,
} from './compression'

export type {
  WarmingJob,
  CronLikeSchedule,
  WarmingResult,
  WarmingStats,
  AccessPattern,
  CacheWarmerConfig,
} from './warming'

export { CacheWarmer } from './warming'

export type {
  CacheNode,
  ShardConfig,
  ReplicationResult,
  NodeHealthStatus,
  DistributedStats,
} from './distributed'

export {
  HashRing,
  ShardManager,
  NodeHealthTracker,
} from './distributed'
