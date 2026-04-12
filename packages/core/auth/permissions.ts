// ─── Permission Model ────────────────────────────────────────────────────────
// Fine-grained permissions for all platform actions.

export type UserRole =
  | 'USER'
  | 'VERIFIED_USER'
  | 'MERCHANT'
  | 'AGENT_IMMO'
  | 'EMPLOYER'
  | 'FARMER'
  | 'AGENT'
  | 'MODERATOR'
  | 'ADMIN'
  | 'SUPER_ADMIN'

export type Permission =
  // Listings
  | 'listings:create'
  | 'listings:read'
  | 'listings:update_own'
  | 'listings:update_any'
  | 'listings:delete_own'
  | 'listings:delete_any'
  | 'listings:boost'
  | 'listings:feature'
  | 'listings:publish'
  | 'listings:moderate'
  // Jobs
  | 'jobs:post'
  | 'jobs:apply'
  | 'jobs:manage_applications'
  // Marketplace
  | 'market:sell'
  | 'market:buy'
  // Agri
  | 'agri:post'
  // Invoicing
  | 'invoices:create'
  | 'invoices:manage'
  | 'invoices:send'
  // Payments
  | 'payments:initiate'
  | 'payments:view_own'
  | 'payments:view_any'
  | 'payments:refund'
  // Users
  | 'users:view_own'
  | 'users:view_any'
  | 'users:manage'
  | 'users:ban'
  // Moderation
  | 'reports:submit'
  | 'reports:review'
  | 'reports:resolve'
  // Admin
  | 'admin:dashboard'
  | 'admin:analytics'
  | 'admin:feature_flags'
  | 'admin:billing'
  | 'admin:kyc_review'
  | 'admin:audit_logs'
  // Super admin
  | 'super:all'
  | 'super:impersonate'
  | 'super:delete_data'
  // API
  | 'api:access'
  | 'api:webhooks'
  // Wallet
  | 'wallet:read'
  | 'wallet:transfer'
  // Tontine
  | 'tontine:create'
  | 'tontine:join'
  | 'tontine:manage'
  // Analytics
  | 'analytics:view_own'
  | 'analytics:view_platform'

// ─── Role Permission Map ──────────────────────────────────────────────────────

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  USER: [
    'listings:read',
    'listings:create',
    'listings:update_own',
    'listings:delete_own',
    'listings:boost',
    'jobs:apply',
    'market:buy',
    'market:sell',
    'invoices:create',
    'payments:initiate',
    'payments:view_own',
    'users:view_own',
    'reports:submit',
    'wallet:read',
    'wallet:transfer',
    'tontine:join',
    'analytics:view_own',
  ],
  VERIFIED_USER: [
    'listings:read',
    'listings:create',
    'listings:update_own',
    'listings:delete_own',
    'listings:boost',
    'listings:publish',
    'jobs:apply',
    'market:buy',
    'market:sell',
    'invoices:create',
    'invoices:send',
    'payments:initiate',
    'payments:view_own',
    'users:view_own',
    'reports:submit',
    'wallet:read',
    'wallet:transfer',
    'tontine:create',
    'tontine:join',
    'analytics:view_own',
    'api:access',
  ],
  MERCHANT: [
    'listings:read',
    'listings:create',
    'listings:update_own',
    'listings:delete_own',
    'listings:boost',
    'listings:feature',
    'listings:publish',
    'market:buy',
    'market:sell',
    'invoices:create',
    'invoices:manage',
    'invoices:send',
    'payments:initiate',
    'payments:view_own',
    'users:view_own',
    'reports:submit',
    'wallet:read',
    'wallet:transfer',
    'tontine:create',
    'tontine:join',
    'tontine:manage',
    'analytics:view_own',
    'api:access',
    'api:webhooks',
  ],
  AGENT_IMMO: [
    'listings:read',
    'listings:create',
    'listings:update_own',
    'listings:delete_own',
    'listings:boost',
    'listings:feature',
    'listings:publish',
    'invoices:create',
    'invoices:manage',
    'invoices:send',
    'payments:initiate',
    'payments:view_own',
    'users:view_own',
    'reports:submit',
    'wallet:read',
    'wallet:transfer',
    'analytics:view_own',
  ],
  EMPLOYER: [
    'listings:read',
    'listings:create',
    'listings:update_own',
    'listings:delete_own',
    'listings:boost',
    'listings:publish',
    'jobs:post',
    'jobs:manage_applications',
    'invoices:create',
    'payments:initiate',
    'payments:view_own',
    'users:view_own',
    'reports:submit',
    'wallet:read',
    'analytics:view_own',
  ],
  FARMER: [
    'listings:read',
    'listings:create',
    'listings:update_own',
    'listings:delete_own',
    'listings:boost',
    'listings:publish',
    'agri:post',
    'market:sell',
    'invoices:create',
    'payments:initiate',
    'payments:view_own',
    'users:view_own',
    'reports:submit',
    'wallet:read',
    'wallet:transfer',
    'tontine:join',
    'analytics:view_own',
  ],
  AGENT: [
    'listings:read',
    'listings:create',
    'listings:update_own',
    'listings:delete_own',
    'listings:boost',
    'listings:publish',
    'jobs:apply',
    'market:buy',
    'market:sell',
    'invoices:create',
    'invoices:manage',
    'invoices:send',
    'payments:initiate',
    'payments:view_own',
    'users:view_own',
    'reports:submit',
    'wallet:read',
    'wallet:transfer',
    'tontine:create',
    'tontine:join',
    'tontine:manage',
    'analytics:view_own',
    'api:access',
    'api:webhooks',
  ],
  MODERATOR: [
    'listings:read',
    'listings:update_any',
    'listings:delete_any',
    'listings:moderate',
    'users:view_any',
    'reports:submit',
    'reports:review',
    'reports:resolve',
    'admin:dashboard',
    'admin:audit_logs',
    'payments:view_own',
    'wallet:read',
    'analytics:view_own',
    'analytics:view_platform',
  ],
  ADMIN: [
    'listings:read',
    'listings:create',
    'listings:update_own',
    'listings:update_any',
    'listings:delete_own',
    'listings:delete_any',
    'listings:boost',
    'listings:feature',
    'listings:publish',
    'listings:moderate',
    'jobs:post',
    'jobs:manage_applications',
    'market:sell',
    'market:buy',
    'agri:post',
    'invoices:create',
    'invoices:manage',
    'invoices:send',
    'payments:initiate',
    'payments:view_own',
    'payments:view_any',
    'payments:refund',
    'users:view_own',
    'users:view_any',
    'users:manage',
    'users:ban',
    'reports:submit',
    'reports:review',
    'reports:resolve',
    'admin:dashboard',
    'admin:analytics',
    'admin:feature_flags',
    'admin:billing',
    'admin:kyc_review',
    'admin:audit_logs',
    'wallet:read',
    'wallet:transfer',
    'tontine:create',
    'tontine:join',
    'tontine:manage',
    'analytics:view_own',
    'analytics:view_platform',
    'api:access',
    'api:webhooks',
  ],
  SUPER_ADMIN: [
    'super:all',
    'super:impersonate',
    'super:delete_data',
    'listings:read',
    'listings:create',
    'listings:update_own',
    'listings:update_any',
    'listings:delete_own',
    'listings:delete_any',
    'listings:boost',
    'listings:feature',
    'listings:publish',
    'listings:moderate',
    'payments:initiate',
    'payments:view_own',
    'payments:view_any',
    'payments:refund',
    'users:view_own',
    'users:view_any',
    'users:manage',
    'users:ban',
    'reports:submit',
    'reports:review',
    'reports:resolve',
    'admin:dashboard',
    'admin:analytics',
    'admin:feature_flags',
    'admin:billing',
    'admin:kyc_review',
    'admin:audit_logs',
    'wallet:read',
    'wallet:transfer',
    'analytics:view_own',
    'analytics:view_platform',
    'api:access',
    'api:webhooks',
  ],
}

// ─── Permission Checks ────────────────────────────────────────────────────────

export function hasPermission(role: UserRole, permission: Permission): boolean {
  if (role === 'SUPER_ADMIN') return true
  const perms = ROLE_PERMISSIONS[role] ?? []
  return perms.includes(permission)
}

export function hasAnyPermission(role: UserRole, permissions: Permission[]): boolean {
  return permissions.some((p) => hasPermission(role, p))
}

export function hasAllPermissions(role: UserRole, permissions: Permission[]): boolean {
  return permissions.every((p) => hasPermission(role, p))
}

export function getRolePermissions(role: UserRole): Permission[] {
  if (role === 'SUPER_ADMIN') return Object.values(ROLE_PERMISSIONS).flat()
  return ROLE_PERMISSIONS[role] ?? []
}

// ─── Role Hierarchy ──────────────────────────────────────────────────────────

const ROLE_WEIGHT: Record<UserRole, number> = {
  USER: 0,
  VERIFIED_USER: 1,
  FARMER: 1,
  AGENT_IMMO: 2,
  EMPLOYER: 2,
  MERCHANT: 3,
  AGENT: 3,
  MODERATOR: 7,
  ADMIN: 8,
  SUPER_ADMIN: 10,
}

export function isAtLeastRole(role: UserRole, minimum: UserRole): boolean {
  return (ROLE_WEIGHT[role] ?? 0) >= (ROLE_WEIGHT[minimum] ?? 0)
}

export function canManageRole(actorRole: UserRole, targetRole: UserRole): boolean {
  return (ROLE_WEIGHT[actorRole] ?? 0) > (ROLE_WEIGHT[targetRole] ?? 0)
}
