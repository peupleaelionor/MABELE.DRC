// ─── MABELE Edge Middleware ────────────────────────────────────────────────────
// Runs on EVERY request before it reaches any page or API route.
// Edge-runtime compatible (no Node.js APIs).
// Responsibilities:
//   1. Guardian security check (honeypot, ban, injection, scanner UA)
//   2. Inject security headers on every response
//   3. Inject X-Request-Id for distributed tracing
//   4. Block permanently banned IPs before they touch any handler

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { guardRequest, applySecurityHeaders } from '@mabele/core-security'

// ─── Routes that bypass guardian (internal/static) ────────────────────────────
const BYPASS_PREFIXES = [
  '/_next/',
  '/favicon',
  '/public/',
  '/icons/',
  '/images/',
]

// ─── Routes that should be protected (require auth session cookie) ─────────────
const AUTH_PROTECTED_PREFIXES = [
  '/dashboard',
  '/immo',
  '/emploi',
  '/market',
  '/agri',
  '/logistique',
  '/finance',
  '/outils',
  '/data',
  '/messages',
  '/profile',
  '/publish',
  '/search',
  '/services',
  '/bima',
  '/checkout',
  '/orders',
]

function shouldBypass(pathname: string): boolean {
  return BYPASS_PREFIXES.some(p => pathname.startsWith(p))
}

function requiresAuth(pathname: string): boolean {
  return AUTH_PROTECTED_PREFIXES.some(p => pathname === p || pathname.startsWith(p + '/'))
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip security scan for static assets
  if (shouldBypass(pathname)) {
    return NextResponse.next()
  }

  // ── 1. Run Guardian (honeypot, injection, scanner, ban) ──────────────────────
  const guard = guardRequest(request.headers, pathname)

  if (guard.decision !== 'ALLOW') {
    const status = guard.status ?? 403
    const body = JSON.stringify({
      success: false,
      error: status === 400 ? 'Requête invalide' : 'Accès refusé',
      code: guard.decision,
    })
    const res = new NextResponse(body, {
      status,
      headers: { 'Content-Type': 'application/json' },
    })
    applySecurityHeaders(res.headers)
    res.headers.set('X-Request-Id', guard.requestId)
    return res
  }

  // ── 2. Auth protection for dashboard routes ────────────────────────────────
  if (requiresAuth(pathname)) {
    const sessionCookie = request.cookies.get('mabele-session')?.value
    if (!sessionCookie) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('next', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // ── 3. Build response with security headers ────────────────────────────────
  const response = NextResponse.next()
  applySecurityHeaders(response.headers)
  response.headers.set('X-Request-Id', guard.requestId)

  // Expose country info for analytics
  if (guard.fp.country !== 'XX') {
    response.headers.set('X-Client-Country', guard.fp.country)
  }

  return response
}

export const config = {
  // Run on all paths except static files handled by Next.js runtime
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
