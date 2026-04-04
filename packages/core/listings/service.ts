import { PrismaClient, Prisma } from '@prisma/client'
import {
  listingCreateInputSchema,
  listingUpdateInputSchema,
  listingFiltersSchema,
  realEstateCreateInputSchema,
  jobCreateInputSchema,
  productCreateInputSchema,
  agriCreateInputSchema,
  ListingStatusEnum,
} from './schema'
import type {
  CreateListingInput,
  ListingFilters,
  ListingUpdateInput,
  ListingWithDetails,
  PaginatedListings,
  ListingStatus,
} from './types'

type TransactionClient = Prisma.TransactionClient

// ─── Include clause for fetching full listing details ────────────────────────

const listingInclude = {
  user: {
    select: { id: true, name: true, phone: true, avatar: true },
  },
  realEstateDetails: true,
  jobDetails: true,
  productDetails: true,
  agriDetails: true,
} as const

// ─── Create Listing ──────────────────────────────────────────────────────────

export async function createListing(
  prisma: PrismaClient,
  data: CreateListingInput,
): Promise<ListingWithDetails> {
  const { realEstate, job, product, agri, ...baseData } = data

  const validatedBase = listingCreateInputSchema.parse(baseData)

  if (realEstate) realEstateCreateInputSchema.parse(realEstate)
  if (job) jobCreateInputSchema.parse(job)
  if (product) productCreateInputSchema.parse(product)
  if (agri) agriCreateInputSchema.parse(agri)

  const listing = await prisma.$transaction(async (tx: TransactionClient) => {
    const created = await tx.listing.create({
      data: {
        ...validatedBase,
        ...(realEstate && {
          realEstateDetails: { create: realEstate },
        }),
        ...(job && {
          jobDetails: { create: job },
        }),
        ...(product && {
          productDetails: { create: product },
        }),
        ...(agri && {
          agriDetails: { create: agri },
        }),
      },
      include: listingInclude,
    })
    return created
  })

  return listing as ListingWithDetails
}

// ─── Update Listing ──────────────────────────────────────────────────────────

export async function updateListing(
  prisma: PrismaClient,
  id: string,
  data: ListingUpdateInput,
  userId: string,
): Promise<ListingWithDetails> {
  const existing = await prisma.listing.findUnique({ where: { id } })

  if (!existing) {
    throw new Error(`Annonce introuvable (id: ${id})`)
  }

  if (existing.userId !== userId) {
    throw new Error("Vous n'êtes pas autorisé à modifier cette annonce")
  }

  const validated = listingUpdateInputSchema.parse(data)

  const updated = await prisma.listing.update({
    where: { id },
    data: validated,
    include: listingInclude,
  })

  return updated as ListingWithDetails
}

// ─── Delete Listing ──────────────────────────────────────────────────────────

export async function deleteListing(
  prisma: PrismaClient,
  id: string,
  userId: string,
): Promise<ListingWithDetails> {
  const existing = await prisma.listing.findUnique({
    where: { id },
    include: listingInclude,
  })

  if (!existing) {
    throw new Error(`Annonce introuvable (id: ${id})`)
  }

  if (existing.userId !== userId) {
    throw new Error("Vous n'êtes pas autorisé à supprimer cette annonce")
  }

  await prisma.$transaction(async (tx: TransactionClient) => {
    if (existing.realEstateDetails) {
      await tx.realEstateDetails.delete({ where: { listingId: id } })
    }
    if (existing.jobDetails) {
      await tx.jobDetails.delete({ where: { listingId: id } })
    }
    if (existing.productDetails) {
      await tx.productDetails.delete({ where: { listingId: id } })
    }
    if (existing.agriDetails) {
      await tx.agriDetails.delete({ where: { listingId: id } })
    }
    await tx.listing.delete({ where: { id } })
  })

  return existing as ListingWithDetails
}

// ─── Get Listing By ID ──────────────────────────────────────────────────────

export async function getListingById(
  prisma: PrismaClient,
  id: string,
): Promise<ListingWithDetails | null> {
  const listing = await prisma.listing.findUnique({
    where: { id },
    include: listingInclude,
  })

  if (!listing) return null

  await prisma.listing.update({
    where: { id },
    data: { vues: { increment: 1 } },
  })

  return listing as ListingWithDetails
}

// ─── Get Listings (with filters & pagination) ────────────────────────────────

export async function getListings(
  prisma: PrismaClient,
  filters: ListingFilters,
  pagination: { page?: number; limit?: number } = {},
): Promise<PaginatedListings> {
  const validatedFilters = listingFiltersSchema.parse(filters)
  const page = Math.max(1, pagination.page ?? 1)
  const limit = Math.min(100, Math.max(1, pagination.limit ?? 20))
  const skip = (page - 1) * limit

  const where: Record<string, unknown> = {}

  if (validatedFilters.type) where.type = validatedFilters.type
  if (validatedFilters.status) where.status = validatedFilters.status
  if (validatedFilters.ville) where.ville = validatedFilters.ville
  if (validatedFilters.province) where.province = validatedFilters.province
  if (validatedFilters.userId) where.userId = validatedFilters.userId

  if (validatedFilters.prixMin !== undefined || validatedFilters.prixMax !== undefined) {
    const priceFilter: Record<string, number> = {}
    if (validatedFilters.prixMin !== undefined) priceFilter.gte = validatedFilters.prixMin
    if (validatedFilters.prixMax !== undefined) priceFilter.lte = validatedFilters.prixMax
    where.price = priceFilter
  }

  if (validatedFilters.q) {
    where.OR = [
      { title: { contains: validatedFilters.q, mode: 'insensitive' } },
      { description: { contains: validatedFilters.q, mode: 'insensitive' } },
    ]
  }

  const [data, total] = await Promise.all([
    prisma.listing.findMany({
      where,
      include: listingInclude,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.listing.count({ where }),
  ])

  return {
    data: data as ListingWithDetails[],
    total,
    page,
    limit,
  }
}

// ─── Update Listing Status ──────────────────────────────────────────────────

export async function updateListingStatus(
  prisma: PrismaClient,
  id: string,
  status: ListingStatus,
  userId: string,
): Promise<ListingWithDetails> {
  ListingStatusEnum.parse(status)

  const existing = await prisma.listing.findUnique({ where: { id } })

  if (!existing) {
    throw new Error(`Annonce introuvable (id: ${id})`)
  }

  if (existing.userId !== userId) {
    throw new Error("Vous n'êtes pas autorisé à modifier le statut de cette annonce")
  }

  const updated = await prisma.listing.update({
    where: { id },
    data: { status },
    include: listingInclude,
  })

  return updated as ListingWithDetails
}
