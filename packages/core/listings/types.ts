import type { z } from 'zod'
import type {
  listingCreateInputSchema,
  listingUpdateInputSchema,
  realEstateCreateInputSchema,
  jobCreateInputSchema,
  productCreateInputSchema,
  agriCreateInputSchema,
  listingFiltersSchema,
  ListingTypeEnum,
  ListingStatusEnum,
} from './schema'

// ─── Inferred Input Types ────────────────────────────────────────────────────

export type ListingCreateInput = z.infer<typeof listingCreateInputSchema>
export type ListingUpdateInput = z.infer<typeof listingUpdateInputSchema>
export type RealEstateCreateInput = z.infer<typeof realEstateCreateInputSchema>
export type JobCreateInput = z.infer<typeof jobCreateInputSchema>
export type ProductCreateInput = z.infer<typeof productCreateInputSchema>
export type AgriCreateInput = z.infer<typeof agriCreateInputSchema>
export type ListingFilters = z.infer<typeof listingFiltersSchema>

// ─── Enum Types ──────────────────────────────────────────────────────────────

export type ListingType = z.infer<typeof ListingTypeEnum>
export type ListingStatus = z.infer<typeof ListingStatusEnum>

// ─── Composite Input ─────────────────────────────────────────────────────────

export interface CreateListingInput extends ListingCreateInput {
  realEstate?: RealEstateCreateInput
  job?: JobCreateInput
  product?: ProductCreateInput
  agri?: AgriCreateInput
}

// ─── Listing With Details ────────────────────────────────────────────────────

export interface ListingWithDetails {
  id: string
  type: ListingType
  title: string
  description: string
  price: number | null
  devise: string
  location: string | null
  ville: string | null
  province: string | null
  latitude: number | null
  longitude: number | null
  userId: string
  status: ListingStatus
  vues: number
  photos: string[]
  createdAt: Date
  updatedAt: Date
  user: {
    id: string
    name: string
    phone: string
    avatar: string | null
  }
  realEstateDetails: {
    id: string
    action: string
    surface: number
    chambres: number
    sallesBain: number
    quartier: string
    meuble: boolean
    parking: boolean
    gardien: boolean
    electrogen: boolean
    eauChaude: boolean
    internet: boolean
    titreVerifie: boolean
    numFoncier: string | null
  } | null
  jobDetails: {
    id: string
    entreprise: string
    type: string
    categorie: string
    salaireMin: number | null
    salaireMax: number | null
    experience: string | null
    competences: string[]
    urgent: boolean
    remote: boolean
    expiresAt: Date | null
  } | null
  productDetails: {
    id: string
    categorie: string
    etat: string
  } | null
  agriDetails: {
    id: string
    produit: string
    quantite: number
    unite: string
    prixUnitaire: number
    bio: boolean
    certifie: boolean
    disponible: boolean
  } | null
}

// ─── Paginated Response ──────────────────────────────────────────────────────

export interface PaginatedListings {
  data: ListingWithDetails[]
  total: number
  page: number
  limit: number
}
