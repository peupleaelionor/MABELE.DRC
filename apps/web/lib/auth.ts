import type { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import type { AuthUser } from '@mabele/core-auth'
import db from './db'

// Re-export so API routes use a single import
export type { AuthUser }

export async function getSessionUser(req?: NextRequest): Promise<AuthUser | null> {
  const session = await getServerSession()

  if (!session?.user) return null

  // NextAuth session only has basic info — hydrate from DB
  const user = await db.user.findUnique({
    where: { id: (session.user as { id?: string }).id ?? '' },
    select: {
      id: true,
      role: true,
      phone: true,
      name: true,
      isVerified: true,
      subscriptions: {
        where: { status: { in: ['ACTIVE', 'TRIALING'] } },
        select: { plan: { select: { tier: true } } },
        take: 1,
      },
    },
  })

  if (!user) return null

  return {
    id: user.id,
    role: user.role as AuthUser['role'],
    phone: user.phone,
    name: user.name,
    isVerified: user.isVerified,
    planTier: (user.subscriptions[0]?.plan as { tier?: string } | undefined)?.tier ?? 'FREE',
  }
}
