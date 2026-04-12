import type { NextRequest } from 'next/server'
import { requireOwnerOrPermission, handleApiError, apiSuccess, NotFoundError } from '@mabele/core-auth'
import { emitEvent } from '@mabele/core-events'
import { getSessionUser } from '@/lib/auth'
import db from '@/lib/db'

const include = {
  user: { select: { id: true, name: true, avatar: true, phone: true } },
  realEstateDetails: true,
  jobDetails: true,
  productDetails: true,
  agriDetails: true,
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const listing = await db.listing.findUnique({ where: { id }, include })
    if (!listing) throw new NotFoundError('Annonce introuvable')

    // Async view increment
    db.listing.update({ where: { id }, data: { vues: { increment: 1 } } }).catch(() => null)

    await emitEvent('listing.viewed', { listingId: id }, {})

    return apiSuccess(listing)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const user = await getSessionUser()
    const listing = await db.listing.findUnique({ where: { id } })
    if (!listing) throw new NotFoundError('Annonce introuvable')

    requireOwnerOrPermission(user, listing.userId, 'listings:update_any')

    const body = await req.json()
    const updated = await db.listing.update({ where: { id }, data: body, include })

    await emitEvent(
      'listing.updated',
      { listingId: id, userId: user!.id },
      { userId: user!.id, aggregateId: id, aggregateType: 'listing' },
    )

    return apiSuccess(updated)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const user = await getSessionUser()
    const listing = await db.listing.findUnique({ where: { id } })
    if (!listing) throw new NotFoundError('Annonce introuvable')

    requireOwnerOrPermission(user, listing.userId, 'listings:delete_any')

    await db.listing.update({ where: { id }, data: { status: 'EXPIRED' } })

    await emitEvent(
      'listing.deleted',
      { listingId: id, userId: user!.id },
      { userId: user!.id, aggregateId: id, aggregateType: 'listing' },
    )

    return apiSuccess({ deleted: true })
  } catch (error) {
    return handleApiError(error)
  }
}
