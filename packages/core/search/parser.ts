import { VILLES, PROVINCES } from '@mabele/shared/constants'
import type { ParsedQuery, ListingTypeValue } from './types'

// ─── Keyword → ListingType mappings ──────────────────────────────────────────

const INTENT_KEYWORDS: Record<ListingTypeValue, string[]> = {
  IMMOBILIER: [
    'maison', 'appartement', 'villa', 'terrain', 'louer', 'acheter',
    'immo', 'bureau', 'location', 'vente', 'chambre', 'loyer',
    'duplex', 'entrepot', 'entrepôt',
  ],
  EMPLOI: [
    'emploi', 'job', 'travail', 'recrutement', 'stage', 'cdi', 'cdd',
    'freelance', 'poste', 'salaire', 'embauche', 'candidature',
  ],
  PRODUIT: [
    'acheter', 'vendre', 'produit', 'electronique', 'électronique',
    'telephone', 'téléphone', 'voiture', 'vehicule', 'véhicule',
    'occasion', 'neuf',
  ],
  AGRI: [
    'agriculture', 'fermier', 'café', 'cafe', 'maïs', 'mais',
    'récolte', 'recolte', 'bio', 'certifié', 'certifie',
    'produit agricole', 'élevage', 'elevage',
  ],
  SERVICE: [
    'service', 'réparation', 'reparation', 'plombier',
    'électricien', 'electricien', 'construction',
  ],
}

// ─── Price extraction patterns ───────────────────────────────────────────────

const PRICE_PATTERNS: RegExp[] = [
  /(\d(?:\d| \d)*)\s*\$/, // "500$" or "1 000$"
  /(\d(?:\d| \d)*)\s*(?:usd|dollars?)/i, // "1000 usd" or "500 dollars"
  /(\d(?:\d| \d)*)\s*(?:fc|cdf)/i, // "5000 fc" or "5000 cdf"
  /moins\s+de\s+(\d(?:\d| \d)*)/i, // "moins de 2000"
  /plus\s+de\s+(\d(?:\d| \d)*)/i, // "plus de 500"
  /entre\s+(\d(?:\d| \d)*)\s+et\s+(\d(?:\d| \d)*)/i, // "entre 500 et 1000"
]

function cleanNumber(str: string): number {
  return parseInt(str.replace(/\s/g, ''), 10)
}

// ─── Normalize ───────────────────────────────────────────────────────────────

function normalize(text: string): string {
  return text.trim().toLowerCase()
}

function extractKeywords(text: string): string[] {
  const stopWords = new Set([
    'le', 'la', 'les', 'un', 'une', 'des', 'de', 'du', 'au', 'aux',
    'et', 'ou', 'en', 'à', 'a', 'dans', 'pour', 'par', 'sur', 'avec',
    'je', 'tu', 'il', 'nous', 'vous', 'ils', 'mon', 'ma', 'mes',
    'ce', 'cette', 'ces', 'qui', 'que', 'est', 'sont',
  ])

  return text
    .split(/[\s,;.!?]+/)
    .map((w) => w.trim())
    .filter((w) => w.length > 1 && !stopWords.has(w))
}

// ─── Price Detection ─────────────────────────────────────────────────────────

function extractPriceRange(text: string): { min?: number; max?: number } | undefined {
  const normalized = normalize(text)

  // "entre X et Y"
  const entreMatch = normalized.match(/entre\s+(\d(?:\d| \d)*)\s+et\s+(\d(?:\d| \d)*)/i)
  if (entreMatch) {
    return { min: cleanNumber(entreMatch[1]), max: cleanNumber(entreMatch[2]) }
  }

  // "moins de X"
  const moinsMatch = normalized.match(/moins\s+de\s+(\d(?:\d| \d)*)/i)
  if (moinsMatch) {
    return { max: cleanNumber(moinsMatch[1]) }
  }

  // "plus de X"
  const plusMatch = normalized.match(/plus\s+de\s+(\d(?:\d| \d)*)/i)
  if (plusMatch) {
    return { min: cleanNumber(plusMatch[1]) }
  }

  // "500$", "1000 usd", "5000 fc"
  for (const pattern of PRICE_PATTERNS.slice(0, 3)) {
    const match = normalized.match(pattern)
    if (match) {
      const value = cleanNumber(match[1])
      return { min: value, max: value }
    }
  }

  return undefined
}

// ─── Location Detection ──────────────────────────────────────────────────────

function extractLocation(text: string): string | undefined {
  const normalized = normalize(text)

  for (const ville of VILLES) {
    if (normalized.includes(ville.toLowerCase())) {
      return ville
    }
  }

  for (const province of PROVINCES) {
    if (normalized.includes(province.toLowerCase())) {
      return province
    }
  }

  return undefined
}

// ─── Intent Detection ────────────────────────────────────────────────────────

export function detectIntent(query: string): ListingTypeValue | null {
  const normalized = normalize(query)
  const words = normalized.split(/[\s,;.!?]+/)

  let bestType: ListingTypeValue | null = null
  let bestScore = 0

  const types = Object.keys(INTENT_KEYWORDS) as ListingTypeValue[]

  for (const type of types) {
    const keywords = INTENT_KEYWORDS[type]
    let score = 0

    for (const keyword of keywords) {
      // Support multi-word keywords (e.g. "produit agricole")
      if (keyword.includes(' ')) {
        if (normalized.includes(keyword)) {
          score += 2 // Multi-word matches count more
        }
      } else if (words.includes(keyword)) {
        score += 1
      }
    }

    if (score > bestScore) {
      bestScore = score
      bestType = type
    }
  }

  return bestType
}

// ─── Parse Query ─────────────────────────────────────────────────────────────

export function parseQuery(query: string): ParsedQuery {
  const normalized = normalize(query)
  const keywords = extractKeywords(normalized)
  const priceRange = extractPriceRange(query)
  const location = extractLocation(query)
  const detectedType = detectIntent(query) || undefined

  return {
    raw: query,
    keywords,
    ...(priceRange && { priceRange }),
    ...(location && { location }),
    ...(detectedType && { detectedType }),
  }
}
