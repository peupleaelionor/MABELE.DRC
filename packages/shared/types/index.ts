// ============================================================
// MABELE — Shared TypeScript Types
// ============================================================

// --- Enums ---

export type Role = 'USER' | 'AGENT_IMMO' | 'EMPLOYER' | 'FARMER' | 'ADMIN'

export type ImmoType =
  | 'APPARTEMENT'
  | 'MAISON'
  | 'VILLA'
  | 'DUPLEX'
  | 'TERRAIN'
  | 'BUREAU'
  | 'LOCAL_COMMERCIAL'
  | 'ENTREPOT'

export type ImmoAction = 'LOCATION' | 'VENTE'

export type ListingStatus = 'ACTIVE' | 'PENDING' | 'SOLD' | 'RENTED' | 'EXPIRED' | 'FLAGGED'

export type JobType = 'CDI' | 'CDD' | 'FREELANCE' | 'STAGE' | 'INTERIM'

export type ApplicationStatus = 'PENDING' | 'REVIEWED' | 'SHORTLISTED' | 'REJECTED' | 'HIRED'

export type ItemCondition = 'NEUF' | 'OCCASION' | 'RECONDITIONNE'

export type InvoiceStatus = 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE' | 'CANCELLED'

export type TontineFrequency = 'HEBDOMADAIRE' | 'BIMENSUEL' | 'MENSUEL'

export type TontineRole = 'ADMIN' | 'MEMBER'

export type Devise = 'USD' | 'CDF'

// --- Models ---

export interface User {
  id: string
  phone: string
  email?: string | null
  name: string
  avatar?: string | null
  role: Role
  province?: string | null
  ville?: string | null
  isVerified: boolean
  createdAt: Date
  updatedAt: Date
}

export interface ImmoListing {
  id: string
  type: ImmoType
  action: ImmoAction
  titre: string
  description: string
  prix: number
  devise: Devise
  ville: string
  quartier: string
  province: string
  adresse?: string | null
  latitude?: number | null
  longitude?: number | null
  surface: number
  chambres: number
  sallesBain: number
  etage?: number | null
  meuble: boolean
  parking: boolean
  gardien: boolean
  electrogen: boolean
  eauChaude: boolean
  internet: boolean
  titreVerifie: boolean
  numFoncier?: string | null
  photos: string[]
  video360?: string | null
  status: ListingStatus
  vues: number
  userId: string
  createdAt: Date
  updatedAt: Date
  user?: User
}

export interface JobPosting {
  id: string
  titre: string
  description: string
  entreprise: string
  logo?: string | null
  ville: string
  province: string
  type: JobType
  categorie: string
  salaireMin?: number | null
  salaireMax?: number | null
  devise: Devise
  experience?: string | null
  competences: string[]
  urgent: boolean
  remote: boolean
  status: ListingStatus
  vues: number
  candidatures: number
  userId: string
  createdAt: Date
  expiresAt?: Date | null
  user?: User
}

export interface JobApplication {
  id: string
  jobId: string
  nom: string
  email: string
  phone: string
  cv?: string | null
  message?: string | null
  status: ApplicationStatus
  createdAt: Date
}

export interface MarketItem {
  id: string
  nom: string
  description: string
  categorie: string
  prix: number
  devise: Devise
  etat: ItemCondition
  ville: string
  province: string
  photos: string[]
  status: ListingStatus
  vues: number
  userId: string
  createdAt: Date
  user?: User
}

export interface AgriProduct {
  id: string
  produit: string
  description?: string | null
  quantite: number
  unite: string
  prixUnitaire: number
  devise: Devise
  ville: string
  province: string
  disponible: boolean
  bio: boolean
  certifie: boolean
  photos: string[]
  userId: string
  createdAt: Date
  user?: User
}

export interface InvoiceItem {
  description: string
  quantite: number
  prix: number
  total: number
}

export interface Invoice {
  id: string
  numero: string
  clientNom: string
  clientPhone?: string | null
  clientEmail?: string | null
  items: InvoiceItem[]
  sousTotal: number
  taxe: number
  total: number
  devise: Devise
  status: InvoiceStatus
  paidAt?: Date | null
  paidVia?: string | null
  userId: string
  createdAt: Date
  dueDate?: Date | null
  user?: User
}

export interface TontineGroup {
  id: string
  nom: string
  description?: string | null
  montant: number
  devise: Devise
  frequence: TontineFrequency
  maxMembres: number
  createdAt: Date
  members?: TontineGroupMember[]
}

export interface TontineGroupMember {
  id: string
  groupId: string
  userId: string
  role: TontineRole
  score: number
  group?: TontineGroup
  user?: User
}

export interface Notification {
  id: string
  userId: string
  type: string
  titre: string
  message: string
  read: boolean
  data?: Record<string, unknown> | null
  createdAt: Date
}

// --- DTO/Form Types ---

export interface ImmoListingCreateInput {
  type: ImmoType
  action: ImmoAction
  titre: string
  description: string
  prix: number
  devise: Devise
  ville: string
  quartier: string
  province: string
  adresse?: string
  surface: number
  chambres?: number
  sallesBain?: number
  meuble?: boolean
  parking?: boolean
  gardien?: boolean
  electrogen?: boolean
  eauChaude?: boolean
  internet?: boolean
  photos?: string[]
}

export interface JobPostingCreateInput {
  titre: string
  description: string
  entreprise: string
  logo?: string
  ville: string
  province: string
  type: JobType
  categorie: string
  salaireMin?: number
  salaireMax?: number
  devise?: Devise
  experience?: string
  competences?: string[]
  urgent?: boolean
  remote?: boolean
}

export interface PaginationParams {
  page?: number
  limit?: number
}

export interface SearchFilters {
  q?: string
  ville?: string
  province?: string
}

export interface ImmoFilters extends SearchFilters {
  type?: ImmoType
  action?: ImmoAction
  prixMin?: number
  prixMax?: number
  chambres?: number
}

export interface JobFilters extends SearchFilters {
  categorie?: string
  type?: JobType
  remote?: boolean
  salaireMin?: number
}

export type ApiResponse<T> = {
  success: true
  data: T
  meta?: {
    total: number
    page: number
    limit: number
  }
} | {
  success: false
  error: string
  code?: string
}
