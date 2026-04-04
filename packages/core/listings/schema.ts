import { z } from 'zod'

// ─── Enums ───────────────────────────────────────────────────────────────────

export const ListingTypeEnum = z.enum([
  'IMMOBILIER',
  'EMPLOI',
  'PRODUIT',
  'AGRI',
  'SERVICE',
])

export const ListingStatusEnum = z.enum([
  'ACTIVE',
  'PENDING',
  'SOLD',
  'RENTED',
  'EXPIRED',
  'FLAGGED',
])

export const ImmoActionEnum = z.enum(['LOCATION', 'VENTE'])

export const JobTypeEnum = z.enum(['CDI', 'CDD', 'FREELANCE', 'STAGE', 'INTERIM'])

export const ItemConditionEnum = z.enum(['NEUF', 'OCCASION', 'RECONDITIONNE'])

// ─── Base Listing Schemas ────────────────────────────────────────────────────

export const listingCreateInputSchema = z.object({
  type: ListingTypeEnum,
  title: z.string().min(1, 'Le titre est requis').max(200, 'Le titre ne peut pas dépasser 200 caractères'),
  description: z.string().min(1, 'La description est requise'),
  price: z.number().nonnegative('Le prix doit être positif').optional(),
  devise: z.string().optional(),
  location: z.string().optional(),
  ville: z.string().optional(),
  province: z.string().optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  userId: z.string().min(1, "L'identifiant utilisateur est requis"),
  photos: z.array(z.string().url('URL de photo invalide')).optional(),
})

export const listingUpdateInputSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().min(1).optional(),
  price: z.number().nonnegative().optional(),
  devise: z.string().optional(),
  location: z.string().optional(),
  ville: z.string().optional(),
  province: z.string().optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  photos: z.array(z.string().url()).optional(),
})

// ─── Extension Schemas ───────────────────────────────────────────────────────

export const realEstateCreateInputSchema = z.object({
  action: ImmoActionEnum,
  surface: z.number().int().positive('La surface doit être positive'),
  chambres: z.number().int().nonnegative().optional(),
  sallesBain: z.number().int().nonnegative().optional(),
  quartier: z.string().min(1, 'Le quartier est requis'),
  meuble: z.boolean().optional(),
  parking: z.boolean().optional(),
  gardien: z.boolean().optional(),
  electrogen: z.boolean().optional(),
  eauChaude: z.boolean().optional(),
  internet: z.boolean().optional(),
})

export const jobCreateInputSchema = z.object({
  entreprise: z.string().min(1, "Le nom de l'entreprise est requis"),
  type: JobTypeEnum,
  categorie: z.string().min(1, 'La catégorie est requise'),
  salaireMin: z.number().nonnegative().optional(),
  salaireMax: z.number().nonnegative().optional(),
  experience: z.string().optional(),
  competences: z.array(z.string()).optional(),
  urgent: z.boolean().optional(),
  remote: z.boolean().optional(),
  expiresAt: z.coerce.date().optional(),
})

export const productCreateInputSchema = z.object({
  categorie: z.string().min(1, 'La catégorie est requise'),
  etat: ItemConditionEnum,
})

export const agriCreateInputSchema = z.object({
  produit: z.string().min(1, 'Le nom du produit est requis'),
  quantite: z.number().positive('La quantité doit être positive'),
  unite: z.string().min(1, "L'unité est requise"),
  prixUnitaire: z.number().nonnegative('Le prix unitaire doit être positif'),
  bio: z.boolean().optional(),
  certifie: z.boolean().optional(),
  disponible: z.boolean().optional(),
})

// ─── Filters Schema ──────────────────────────────────────────────────────────

export const listingFiltersSchema = z.object({
  type: ListingTypeEnum.optional(),
  status: ListingStatusEnum.optional(),
  ville: z.string().optional(),
  province: z.string().optional(),
  prixMin: z.number().nonnegative().optional(),
  prixMax: z.number().nonnegative().optional(),
  q: z.string().optional(),
  userId: z.string().optional(),
})
