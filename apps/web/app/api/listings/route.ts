import { z } from 'zod'
import type { NextRequest } from 'next/server'
import { requirePermission, handleApiError, apiSuccess, ValidationError } from '@mabele/core-auth'
import { rateLimit, RATE_LIMITS } from '@mabele/core-rate-limit'
import { emitEvent } from '@mabele/core-events'
import { getSessionUser } from '@/lib/auth'
import db from '@/lib/db'

const createSchema = z.object({
  type: z.enum(['IMMOBILIER', 'EMPLOI', 'PRODUIT', 'AGRI', 'SERVICE']),
  title: z.string().min(3).max(200),
  description: z.string().min(10).max(5000),
  price: z.number().positive().optional(),
  devise: z.string().default('USD'),
  ville: z.string().optional(),
  province: z.string().optional(),
  location: z.string().optional(),
  photos: z.array(z.string().url()).max(10).default([]),
  tags: z.array(z.string()).max(10).default([]),
  realEstate: z
    .object({
      action: z.enum(['LOCATION', 'VENTE']),
      surface: z.number().positive(),
      chambres: z.number().int().min(0).default(0),
      sallesBain: z.number().int().min(0).default(0),
      quartier: z.string(),
      meuble: z.boolean().default(false),
      parking: z.boolean().default(false),
      gardien: z.boolean().default(false),
    })
    .optional(),
  job: z
    .object({
      entreprise: z.string(),
      type: z.enum(['CDI', 'CDD', 'FREELANCE', 'STAGE', 'INTERIM']),
      categorie: z.string(),
      salaireMin: z.number().optional(),
      salaireMax: z.number().optional(),
      experience: z.string().optional(),
      competences: z.array(z.string()).default([]),
      urgent: z.boolean().default(false),
      remote: z.boolean().default(false),
    })
    .optional(),
  product: z
    .object({
      categorie: z.string(),
      etat: z.enum(['NEUF', 'OCCASION', 'RECONDITIONNE']),
    })
    .optional(),
  agri: z
    .object({
      produit: z.string(),
      quantite: z.number().positive(),
      unite: z.string(),
      prixUnitaire: z.number().positive(),
      bio: z.boolean().default(false),
    })
    .optional(),
})

const querySchema = z.object({
  type: z.enum(['IMMOBILIER', 'EMPLOI', 'PRODUIT', 'AGRI', 'SERVICE']).optional(),
  ville: z.string().optional(),
  province: z.string().optional(),
  q: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  prixMin: z.coerce.number().optional(),
  prixMax: z.coerce.number().optional(),
  boosted: z.coerce.boolean().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const ip = request.headers.get('x-real-ip') ?? '0.0.0.0'
    const rl = await rateLimit(`listings-read:${ip}`, RATE_LIMITS.publicRead)
    if (!rl.allowed) {
      return Response.json({ success: false, error: 'Rate limited', code: 'RATE_LIMITED' }, { status: 429 })
    }

    const { searchParams } = new URL(request.url)
    const params = querySchema.parse(Object.fromEntries(searchParams))
    const skip = (params.page - 1) * params.limit

    const where: Record<string, unknown> = { status: 'ACTIVE' }
    if (params.type) where.type = params.type
    if (params.ville) where.ville = params.ville
    if (params.province) where.province = params.province
    if (params.boosted) where.boosted = true
    if (params.prixMin !== undefined || params.prixMax !== undefined) {
      const price: Record<string, number> = {}
      if (params.prixMin !== undefined) price.gte = params.prixMin
      if (params.prixMax !== undefined) price.lte = params.prixMax
      where.price = price
    }
    if (params.q) {
      where.OR = [
        { title: { contains: params.q, mode: 'insensitive' } },
        { description: { contains: params.q, mode: 'insensitive' } },
      ]
    }

    const [listings, total] = await Promise.all([
      db.listing.findMany({
        where,
        include: {
          user: { select: { id: true, name: true, avatar: true } },
          realEstateDetails: true,
          jobDetails: true,
          productDetails: true,
          agriDetails: true,
        },
        orderBy: [{ boosted: 'desc' }, { createdAt: 'desc' }],
        skip,
        take: params.limit,
      }),
      db.listing.count({ where }),
    ])

    return apiSuccess({
      listings,
      total,
      page: params.page,
      limit: params.limit,
      pages: Math.ceil(total / params.limit),
    })
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser()
    requirePermission(user, 'listings:create')

    const rl = await rateLimit(`listing-create:${user!.id}`, RATE_LIMITS.listingCreate)
    if (!rl.allowed) {
      return Response.json({ success: false, error: 'Rate limited', code: 'RATE_LIMITED' }, { status: 429 })
    }

    const body = await request.json()
    const parsed = createSchema.safeParse(body)
    if (!parsed.success) {
      throw new ValidationError('Données invalides', parsed.error.flatten())
    }

    const { realEstate, job, product, agri, ...baseData } = parsed.data

    const listing = await db.listing.create({
      data: {
        ...baseData,
        userId: user!.id,
        status: 'ACTIVE',
        ...(realEstate && { realEstateDetails: { create: realEstate } }),
        ...(job && { jobDetails: { create: job } }),
        ...(product && { productDetails: { create: product } }),
        ...(agri && { agriDetails: { create: agri } }),
      },
      include: {
        user: { select: { id: true, name: true, avatar: true } },
        realEstateDetails: true,
        jobDetails: true,
        productDetails: true,
        agriDetails: true,
      },
    })

    await emitEvent(
      'listing.created',
      { listingId: listing.id, type: listing.type, userId: user!.id, ville: listing.ville ?? undefined, price: listing.price ?? undefined },
      { userId: user!.id, aggregateId: listing.id, aggregateType: 'listing' },
    )

    return apiSuccess(listing, 201)
  } catch (error) {
    return handleApiError(error)
  }
}
