import type { NextRequest, NextResponse } from 'next/server'
import type { UserRole, Permission } from './permissions'
import { hasPermission, hasAnyPermission } from './permissions'

// ─── Auth Context ─────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string
  role: UserRole
  phone: string
  name: string
  isVerified: boolean
  planTier?: string
}

export interface AuthContext {
  user: AuthUser | null
}

// ─── Guard Helpers ────────────────────────────────────────────────────────────

export function requireAuth(user: AuthUser | null): asserts user is AuthUser {
  if (!user) {
    throw new AuthError('Non authentifié', 'UNAUTHORIZED', 401)
  }
}

export function requirePermission(user: AuthUser | null, permission: Permission): void {
  requireAuth(user)
  if (!hasPermission(user.role, permission)) {
    throw new AuthError(
      `Permission refusée: ${permission}`,
      'FORBIDDEN',
      403,
    )
  }
}

export function requireAnyPermission(user: AuthUser | null, permissions: Permission[]): void {
  requireAuth(user)
  if (!hasAnyPermission(user.role, permissions)) {
    throw new AuthError('Accès refusé', 'FORBIDDEN', 403)
  }
}

export function requireOwnerOrPermission(
  user: AuthUser | null,
  resourceOwnerId: string,
  permission: Permission,
): void {
  requireAuth(user)
  if (user.id === resourceOwnerId) return
  if (!hasPermission(user.role, permission)) {
    throw new AuthError(
      "Vous n'êtes pas autorisé à effectuer cette action",
      'FORBIDDEN',
      403,
    )
  }
}

// ─── Auth Error ───────────────────────────────────────────────────────────────

export class AuthError extends Error {
  code: string
  statusCode: number

  constructor(message: string, code = 'UNAUTHORIZED', statusCode = 401) {
    super(message)
    this.name = 'AuthError'
    this.code = code
    this.statusCode = statusCode
  }
}

// ─── API Response Helpers ─────────────────────────────────────────────────────

export function apiSuccess<T>(data: T, status = 200) {
  return Response.json({ success: true, data }, { status })
}

export function apiError(message: string, code: string, status: number, details?: unknown) {
  return Response.json(
    { success: false, error: message, code, ...(details ? { details } : {}) },
    { status },
  )
}

export function handleApiError(error: unknown) {
  if (error instanceof AuthError) {
    return apiError(error.message, error.code, error.statusCode)
  }
  if (error instanceof ValidationError) {
    return apiError(error.message, 'VALIDATION_ERROR', 400, error.details)
  }
  if (error instanceof NotFoundError) {
    return apiError(error.message, 'NOT_FOUND', 404)
  }
  console.error('[API Error]', error)
  return apiError('Une erreur interne est survenue', 'INTERNAL_ERROR', 500)
}

// ─── Domain Errors ────────────────────────────────────────────────────────────

export class ValidationError extends Error {
  details?: unknown
  constructor(message: string, details?: unknown) {
    super(message)
    this.name = 'ValidationError'
    this.details = details
  }
}

export class NotFoundError extends Error {
  constructor(message = 'Ressource introuvable') {
    super(message)
    this.name = 'NotFoundError'
  }
}

export class ConflictError extends Error {
  code: string
  constructor(message: string, code = 'CONFLICT') {
    super(message)
    this.name = 'ConflictError'
    this.code = code
  }
}
