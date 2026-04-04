// ─── Parsed Query ────────────────────────────────────────────────────────────

export interface PriceRange {
  min?: number
  max?: number
}

export interface ParsedQuery {
  raw: string
  keywords: string[]
  priceRange?: PriceRange
  location?: string
  detectedType?: ListingTypeValue
}

// ─── Listing Type ────────────────────────────────────────────────────────────

export type ListingTypeValue = 'IMMOBILIER' | 'EMPLOI' | 'PRODUIT' | 'AGRI' | 'SERVICE'

// ─── Search Filters ──────────────────────────────────────────────────────────

export type SortOption = 'recent' | 'price_asc' | 'price_desc' | 'relevance'

export interface SearchFilters {
  type?: ListingTypeValue
  status?: string
  ville?: string
  province?: string
  prixMin?: number
  prixMax?: number
  sort?: SortOption
}

// ─── Search Options ──────────────────────────────────────────────────────────

export interface SearchOptions {
  page?: number
  limit?: number
  sort?: SortOption
}

// ─── Search Result ───────────────────────────────────────────────────────────

export interface SearchResult {
  results: SearchResultListing[]
  total: number
  query: ParsedQuery
  intent: ListingTypeValue | null
  page: number
  limit: number
}

export interface SearchResultListing {
  id: string
  type: string
  title: string
  description: string
  price: number | null
  devise: string
  location: string | null
  ville: string | null
  province: string | null
  userId: string
  status: string
  vues: number
  photos: string[]
  createdAt: Date
  updatedAt: Date
}

// ─── Suggestion ──────────────────────────────────────────────────────────────

export interface Suggestion {
  text: string
  type?: ListingTypeValue
  count?: number
}
