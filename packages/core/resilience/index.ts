// ─── Package Résilience ──────────────────────────────────────────────────────
// Exports centralisés du module de haute disponibilité
// ──────────────────────────────────────────────────────────────────────────────

export type {
  CircuitState,
  CircuitBreakerConfig,
  CircuitBreakerMetrics,
  StateChange,
  CircuitEventType,
  CircuitEventHandler,
} from './circuit-breaker'

export {
  CircuitBreaker,
  getOrCreateBreaker,
  getBreaker,
  getAllBreakers,
  removeBreaker,
  clearRegistry,
} from './circuit-breaker'

export type {
  RetryStrategy,
  RetryOptions,
  RetryBudgetConfig,
  RetryResult,
  RetryMetrics,
} from './retry'

export {
  retry,
  calculateDelay,
  isRetryableError,
  isHttpRetryable,
  RetryBudget,
  RetryMetricsTracker,
} from './retry'

export type {
  BulkheadConfig,
  BulkheadMetrics,
} from './bulkhead'

export {
  Bulkhead,
  BulkheadTimeoutError,
} from './bulkhead'

export type {
  TimeoutConfig,
  LatencyStats,
  Deadline,
} from './timeout'

export {
  TimeoutError,
  withTimeout,
  AdaptiveTimeout,
  createDeadline,
  propagateDeadline,
  withDeadline,
  RouteTimeoutManager,
} from './timeout'

export type {
  FallbackResult,
  StaleEntry,
  FallbackMetrics,
  FallbackFn,
  FallbackStrategyConfig,
} from './fallback'

export {
  withFallback,
  FallbackChain,
  StaleWhileRevalidate,
  GracefulDegradation,
  withDefault,
} from './fallback'

export type {
  HealthStatusValue,
  HealthStatus,
  HealthCheck,
  AggregatedHealth,
  ProbeResult,
  HealthCheckRegistration,
} from './health'

export {
  HealthChecker,
  createSimpleCheck,
  createMemoryCheck,
} from './health'

export type {
  BalancingStrategy,
  Backend,
  LoadBalancerConfig,
  SelectionResult,
  LoadBalancerMetrics,
} from './load-balancer'

export { LoadBalancer } from './load-balancer'
