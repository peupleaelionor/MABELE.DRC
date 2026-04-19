// ─── Package Sécurité ────────────────────────────────────────────────────────
// Exports centralisés du module de sécurité
// ──────────────────────────────────────────────────────────────────────────────

export type {
  HashAlgorithm,
  HmacAlgorithm,
  ScryptOptions,
  HashedPassword,
  FingerprintInput,
} from './crypto'

export {
  secureRandom,
  sha256,
  sha512,
  hash,
  hmac,
  timingSafeCompare,
  hashPassword,
  verifyPassword,
  generateToken,
  generateUrlSafeToken,
  fingerprint,
  fingerprintMatch,
} from './crypto'

export type {
  EncryptionResult,
  EncryptedPayload,
  DeriveKeyOptions,
  KeyPair,
  RotationResult,
  MessageEnvelope,
} from './encryption'

export {
  generateKey,
  generateIV,
  generateSalt,
  deriveKey,
  deriveKeyFromPassword,
  encrypt,
  encryptBuffer,
  decrypt,
  decryptToBuffer,
  rotateKey,
  batchRotateKeys,
  encryptMessage,
  decryptMessage,
} from './encryption'

export type {
  TOTPConfig,
  TOTPResult,
  SmsOtp,
  BackupCodesResult,
  MfaAttempt,
  RateLimitState,
} from './mfa'

export {
  base32Encode,
  base32Decode,
  generateSecret,
  buildOtpauthUri,
  generateTOTP,
  verifyTOTP,
  generateSmsOtp,
  verifySmsOtp,
  generateBackupCodes,
  verifyBackupCode,
  checkMfaRateLimit,
  recordMfaAttempt,
  resetMfaRateLimit,
} from './mfa'

export type {
  LoginAttempt,
  GeoLocation,
  LockoutStatus,
  AnomalyResult,
  DeviceContext,
  BruteForceConfig,
  GeoBlockRule,
  IpReputationScore,
  SuspiciousActivityReport,
} from './intrusion'

export {
  LoginAttemptTracker,
  AnomalyDetector,
  BruteForceGuard,
  GeoBlocker,
  calculateIpReputation,
  createSuspiciousActivityReport,
  resolveReport,
  filterReports,
} from './intrusion'

export type {
  AuditEntry,
  AuditActor,
  AuditResource,
  AuditFilter,
  PaginatedAuditLog,
  ChainVerificationResult,
  ExportFormat,
  AnonymizationResult,
} from './audit'

export {
  createAuditEntry,
  appendToChain,
  verifyAuditChain,
  queryAuditLog,
  anonymizeUserAudit,
  exportAuditLog,
} from './audit'

export type {
  DeviceAttestation,
  DeviceInfo,
  TrustEvent,
  SessionContext,
  GeoInfo,
  SessionValidationResult,
  SensitivityLevel,
  ReauthRequirement,
  NetworkTrustResult,
  NetworkTrustFactor,
  TrustPolicy,
  PolicyEvaluationResult,
} from './zero-trust'

export {
  calculateDeviceTrust,
  validateSession,
  requireReauth,
  assessNetworkTrust,
  PolicyEngine,
} from './zero-trust'

export type {
  SecretMetadata,
  StoredSecret,
  SecretAccessLog,
  RotationSchedule,
  KeyShare,
  VaultStats,
} from './vault'

export {
  SecretVault,
  splitKey,
  reconstructKey,
} from './vault'
