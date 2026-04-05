import { PrismaClient, Prisma } from '@prisma/client'
import { parseQuery, detectIntent } from './parser'
import type {
  SearchFilters,
  SearchOptions,
  SearchResult,
  SearchResultListing,
  Suggestion,
  ListingTypeValue,
  SortOption,
} from './types'

// ─── Sort Mapping ────────────────────────────────────────────────────────────

function buildOrderBy(sort: SortOption): Prisma.ListingOrderByWithRelationInput {
  switch (sort) {
    case 'recent':
      return { createdAt: 'desc' }
    case 'price_asc':
      return { price: 'asc' }
    case 'price_desc':
      return { price: 'desc' }
    case 'relevance':
    default:
      return { createdAt: 'desc' }
  }
}

// ─── Search Listings ─────────────────────────────────────────────────────────

export async function searchListings(
  prisma: PrismaClient,
  query: string,
  filters?: SearchFilters,
  options?: SearchOptions,
): Promise<SearchResult> {
  const parsed = parseQuery(query)
  const intent = detectIntent(query)

  const page = Math.max(1, options?.page ?? 1)
  const limit = Math.min(100, Math.max(1, options?.limit ?? 20))
  const skip = (page - 1) * limit
  const sort: SortOption = options?.sort ?? filters?.sort ?? 'relevance'

  const where: Prisma.ListingWhereInput = {}

  // Status: default to ACTIVE
  where.status = (filters?.status as Prisma.EnumListingStatusFilter['equals']) ?? 'ACTIVE'

  // Type: explicit filter takes precedence over detected intent
  const resolvedType = filters?.type ?? intent
  if (resolvedType) {
    where.type = resolvedType as Prisma.EnumListingTypeFilter['equals']
  }

  // Location: explicit filter takes precedence over detected location
  if (filters?.ville ?? parsed.location) {
    where.ville = {
      equals: filters?.ville ?? parsed.location,
      mode: 'insensitive',
    }
  }

  if (filters?.province) {
    where.province = {
      equals: filters.province,
      mode: 'insensitive',
    }
  }

  // Price range: combine filters and parsed price
  const prixMin = filters?.prixMin ?? parsed.priceRange?.min
  const prixMax = filters?.prixMax ?? parsed.priceRange?.max

  if (prixMin !== undefined || prixMax !== undefined) {
    const priceFilter: Record<string, number> = {}
    if (prixMin !== undefined) priceFilter.gte = prixMin
    if (prixMax !== undefined) priceFilter.lte = prixMax
    where.price = priceFilter
  }

  // Text search: search keywords in title and description
  if (parsed.keywords.length > 0) {
    where.AND = parsed.keywords.map((keyword) => ({
      OR: [
        { title: { contains: keyword, mode: 'insensitive' as const } },
        { description: { contains: keyword, mode: 'insensitive' as const } },
      ],
    }))
  }

  const orderBy = buildOrderBy(sort)

  const [data, total] = await Promise.all([
    prisma.listing.findMany({
      where,
      orderBy,
      skip,
      take: limit,
    }),
    prisma.listing.count({ where }),
  ])

  return {
    results: data as SearchResultListing[],
    total,
    query: parsed,
    intent,
    page,
    limit,
  }
}

// ─── Get Suggestions ─────────────────────────────────────────────────────────

const DEFAULT_SUGGESTION_LIMIT = 8

export async function getSuggestions(
  prisma: PrismaClient,
  query: string,
  limit?: number,
): Promise<Suggestion[]> {
  const maxResults = Math.min(limit ?? DEFAULT_SUGGESTION_LIMIT, 50)
  const normalized = query.trim().toLowerCase()

  if (normalized.length === 0) {
    return []
  }

  const listings = await prisma.listing.findMany({
    where: {
      status: 'ACTIVE',
      title: { contains: normalized, mode: 'insensitive' },
    },
    select: {
      title: true,
      type: true,
    },
    take: maxResults * 3, // Fetch extra to handle deduplication
    orderBy: { vues: 'desc' },
  })

  const seen = new Map<string, { type: ListingTypeValue; count: number }>()

  for (const listing of listings) {
    const key = listing.title.toLowerCase().trim()
    const existing = seen.get(key)
    if (existing) {
      existing.count += 1
    } else {
      seen.set(key, {
        type: listing.type as ListingTypeValue,
        count: 1,
      })
    }
  }

  const suggestions: Suggestion[] = []

  const entries = Array.from(seen.entries())
  for (const [text, { type, count }] of entries) {
    if (suggestions.length >= maxResults) break
    // Use the original-cased title from the first match
    const original = listings.find((l: { title: string }) => l.title.toLowerCase().trim() === text)
    suggestions.push({
      text: original?.title ?? text,
      type,
      count,
    })
  }

  return suggestions
}

// ─── Get Popular Searches ────────────────────────────────────────────────────

const DEFAULT_POPULAR_LIMIT = 10

function isSearchProperties(props: unknown): props is { query: string } {
  return (
    typeof props === 'object' &&
    props !== null &&
    'query' in props &&
    typeof (props as Record<string, unknown>).query === 'string' &&
    (props as Record<string, unknown>).query !== ''
  )
}

export async function getPopularSearches(
  prisma: PrismaClient,
  limit?: number,
): Promise<string[]> {
  const maxResults = Math.min(limit ?? DEFAULT_POPULAR_LIMIT, 50)

  try {
    const events = await prisma.analyticsEvent.groupBy({
      by: ['properties'],
      where: { event: 'search' },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: maxResults,
    })

    const terms: string[] = []

    for (const event of events) {
      if (terms.length >= maxResults) break
      if (isSearchProperties(event.properties)) {
        terms.push(event.properties.query.trim())
      }
    }

    return terms
  } catch {
    return []
  }
}
