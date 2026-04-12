// ─── Search Agent ─────────────────────────────────────────────────────────────
// Enriches raw user queries with intent detection, category routing,
// and Meilisearch / Qdrant query building.

export type SearchIntent =
  | 'REAL_ESTATE'
  | 'JOBS'
  | 'MARKETPLACE'
  | 'AGRI'
  | 'SERVICES'
  | 'PAYMENT'
  | 'GENERAL'

export interface ParsedQuery {
  raw: string
  normalized: string
  intent: SearchIntent
  listingType?: string
  filters: {
    ville?: string
    province?: string
    prixMin?: number
    prixMax?: number
    action?: string
  }
  terms: string[]
  isQuestion: boolean
}

const PROVINCES_DRC = [
  'kinshasa', 'katanga', 'kasai', 'kasai oriental', 'kasai central',
  'equateur', 'nord-kivu', 'sud-kivu', 'maniema', 'orientale',
  'bas-congo', 'bandundu', 'lomami', 'sankuru', 'mongala', 'tshopo',
  'haut-katanga', 'lualaba', 'haut-lomami',
]

const CITIES_DRC = [
  'kinshasa', 'lubumbashi', 'mbuji-mayi', 'kananga', 'kisangani',
  'bukavu', 'goma', 'kolwezi', 'likasi', 'matadi', 'kikwit', 'mbandaka',
]

const INTENT_PATTERNS: Array<{ keywords: string[]; intent: SearchIntent; listingType?: string }> = [
  { keywords: ['maison', 'appartement', 'villa', 'studio', 'louer', 'acheter', 'terrain', 'immobilier'], intent: 'REAL_ESTATE', listingType: 'IMMOBILIER' },
  { keywords: ['emploi', 'travail', 'job', 'stage', 'recrutement', 'poste', 'ingénieur', 'développeur'], intent: 'JOBS', listingType: 'EMPLOI' },
  { keywords: ['vendre', 'acheter', 'téléphone', 'voiture', 'moto', 'meuble', 'électronique'], intent: 'MARKETPLACE', listingType: 'PRODUIT' },
  { keywords: ['maïs', 'manioc', 'riz', 'farine', 'légume', 'fruit', 'ferme', 'agricole', 'récolte'], intent: 'AGRI', listingType: 'AGRI' },
  { keywords: ['payer', 'envoyer', 'transfert', 'airtel', 'orange', 'mpesa'], intent: 'PAYMENT' },
]

export function parseSearchQuery(raw: string): ParsedQuery {
  const normalized = raw.toLowerCase().trim()
  const words = normalized.split(/\s+/)

  let intent: SearchIntent = 'GENERAL'
  let listingType: string | undefined

  for (const pattern of INTENT_PATTERNS) {
    if (pattern.keywords.some((kw) => normalized.includes(kw))) {
      intent = pattern.intent
      listingType = pattern.listingType
      break
    }
  }

  const filters: ParsedQuery['filters'] = {}

  // Extract ville
  for (const city of CITIES_DRC) {
    if (normalized.includes(city)) {
      filters.ville = city.charAt(0).toUpperCase() + city.slice(1)
      break
    }
  }

  // Extract province
  for (const prov of PROVINCES_DRC) {
    if (normalized.includes(prov)) {
      filters.province = prov.charAt(0).toUpperCase() + prov.slice(1)
      break
    }
  }

  // Extract price hints (e.g. "moins de 500", "500 dollars")
  const priceMatch = normalized.match(/(\d+)\s*(usd|dollars|\$|fc|cdf)?/)
  if (priceMatch) {
    const num = parseInt(priceMatch[1], 10)
    if (normalized.includes('moins') || normalized.includes('max')) {
      filters.prixMax = num
    } else if (normalized.includes('plus') || normalized.includes('min')) {
      filters.prixMin = num
    }
  }

  const isQuestion = raw.includes('?') || /^(comment|où|qui|quoi|que|est-ce|quel|quelle)/i.test(raw)

  const stopWords = new Set(['de', 'du', 'le', 'la', 'les', 'un', 'une', 'des', 'à', 'au', 'en', 'et', 'ou'])
  const terms = words.filter((w) => w.length > 2 && !stopWords.has(w))

  return { raw, normalized, intent, listingType, filters, terms, isQuestion }
}

export function buildMeilisearchQuery(parsed: ParsedQuery) {
  return {
    q: parsed.normalized,
    filter: [
      parsed.filters.ville ? `ville = "${parsed.filters.ville}"` : null,
      parsed.filters.province ? `province = "${parsed.filters.province}"` : null,
      parsed.listingType ? `type = "${parsed.listingType}"` : null,
      parsed.filters.prixMax ? `price <= ${parsed.filters.prixMax}` : null,
      parsed.filters.prixMin ? `price >= ${parsed.filters.prixMin}` : null,
    ].filter(Boolean).join(' AND ') || undefined,
    sort: ['boosted:desc', 'createdAt:desc'],
    attributesToHighlight: ['title', 'description'],
  }
}
