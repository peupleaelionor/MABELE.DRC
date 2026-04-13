// ============================================================
// MABELE — Shared Constants
// ============================================================

export const PROVINCES: string[] = [
  'Kinshasa',
  'Kongo-Central',
  'Kwango',
  'Kwilu',
  'Mai-Ndombe',
  'Kasaï',
  'Kasaï-Central',
  'Kasaï-Oriental',
  'Lomami',
  'Sankuru',
  'Maniema',
  'Sud-Kivu',
  'Nord-Kivu',
  'Ituri',
  'Haut-Uélé',
  'Bas-Uélé',
  'Tshopo',
  'Mongala',
  'Nord-Ubangi',
  'Sud-Ubangi',
  'Équateur',
  'Tshuapa',
  'Tanganyika',
  'Haut-Lomami',
  'Lualaba',
  'Haut-Katanga',
]

export const VILLES: string[] = [
  'Kinshasa',
  'Lubumbashi',
  'Mbuji-Mayi',
  'Kananga',
  'Kisangani',
  'Bukavu',
  'Goma',
  'Butembo',
  'Boma',
  'Tshikapa',
  'Kolwezi',
  'Likasi',
  'Matadi',
  'Uvira',
  'Bunia',
  'Kikwit',
  'Mwene-Ditu',
  'Mbandaka',
  'Bandundu',
  'Kabinda',
]

export const CURRENCIES: string[] = ['USD', 'CDF']

export const MODULE_COLORS: Record<string, string> = {
  immo: '#BB902A',
  emploi: '#26C6DA',
  marche: '#FF5252',
  agri: '#00C853',
  nkisi: '#B388FF',
  congo: '#448AFF',
  kangapay: '#FFB300',
  bima: '#FF4081',
}

export const MODULE_NAMES: Record<string, string> = {
  immo: 'Immobilier',
  emploi: 'Emploi',
  marche: 'Marché',
  agri: 'AgriTech',
  nkisi: 'NKISI',
  congo: 'Congo Data',
  kangapay: 'KangaPay',
  bima: 'Bima Santé',
}

export const MODULE_EMOJIS: Record<string, string> = {
  immo: '🏠',
  emploi: '💼',
  marche: '🛒',
  agri: '🌾',
  nkisi: '🧾',
  congo: '📊',
  kangapay: '💰',
  bima: '🏥',
}

export const IMMO_TYPES = [
  { value: 'APPARTEMENT', label: 'Appartement' },
  { value: 'MAISON', label: 'Maison' },
  { value: 'VILLA', label: 'Villa' },
  { value: 'DUPLEX', label: 'Duplex' },
  { value: 'TERRAIN', label: 'Terrain' },
  { value: 'BUREAU', label: 'Bureau' },
  { value: 'LOCAL_COMMERCIAL', label: 'Local commercial' },
  { value: 'ENTREPOT', label: 'Entrepôt' },
] as const

export const JOB_TYPES = [
  { value: 'CDI', label: 'CDI' },
  { value: 'CDD', label: 'CDD' },
  { value: 'FREELANCE', label: 'Freelance' },
  { value: 'STAGE', label: 'Stage' },
  { value: 'INTERIM', label: 'Intérim' },
] as const

export const JOB_CATEGORIES = [
  'IT & Tech',
  'Finance & Comptabilité',
  'Santé & Médical',
  'Éducation & Formation',
  'BTP & Génie Civil',
  'Commerce & Vente',
  'Agriculture & Élevage',
  'Juridique & Droit',
  'Marketing & Communication',
  'Ressources Humaines',
  'Transport & Logistique',
  'Hôtellerie & Restauration',
  'Artisanat & Métiers',
  'Sécurité & Gardiennage',
  'Autre',
] as const

export const MARKET_CATEGORIES = [
  { id: 'electronique', label: 'Électronique', emoji: '📱' },
  { id: 'vehicules', label: 'Véhicules', emoji: '🚗' },
  { id: 'immobilier', label: 'Immobilier', emoji: '🏠' },
  { id: 'vetements', label: 'Vêtements & Mode', emoji: '👗' },
  { id: 'maison', label: 'Maison & Jardin', emoji: '🪴' },
  { id: 'agriculture', label: 'Agriculture', emoji: '🌾' },
  { id: 'beaute', label: 'Beauté & Santé', emoji: '💄' },
  { id: 'sport', label: 'Sport & Loisirs', emoji: '⚽' },
  { id: 'services', label: 'Services', emoji: '🛠' },
  { id: 'education', label: 'Livres & Formation', emoji: '📚' },
] as const

export const AGRI_UNITS = [
  'kg',
  'tonne',
  'sac (25kg)',
  'sac (50kg)',
  'litre',
  'régime',
  'caisse',
  'carton',
  'unité',
] as const

export const DRC_STATS = {
  population: '112.5M',
  provinces: 26,
  mobilePenetration: '67%',
  digitalPlan: '8.7 Md$',
  gdp2024: '66.5 Md$',
  exchangeRate: 2780, // CDF per USD (approximate)
} as const

// DRC mobile operator number prefixes (2-digit, after country code +243)
// Airtel: 081x–082x, Vodacom/M-Pesa: 082x–083x, Orange: 084x–085x, Africell: 089x–090x
export const MOBILE_MONEY_OPERATORS = [
  { id: 'airtel', name: 'Airtel Money', emoji: '🔴', color: '#FF5252', prefix: ['81', '82'] },
  { id: 'vodacom', name: 'M-Pesa (Vodacom)', emoji: '🟢', color: '#00C853', prefix: ['82', '83'] },
  { id: 'orange', name: 'Orange Money', emoji: '🟠', color: '#FFB300', prefix: ['84', '85'] },
  { id: 'africell', name: 'Africell', emoji: '🔵', color: '#448AFF', prefix: ['89', '90'] },
] as const

export const TONTINE_FREQUENCIES = [
  { value: 'HEBDOMADAIRE', label: 'Hebdomadaire', sublabel: 'Chaque semaine' },
  { value: 'BIMENSUEL', label: 'Bimensuel', sublabel: 'Toutes les 2 semaines' },
  { value: 'MENSUEL', label: 'Mensuel', sublabel: 'Chaque mois' },
] as const

export const USER_ROLES = [
  { value: 'USER', label: 'Particulier', emoji: '👤' },
  { value: 'AGENT_IMMO', label: 'Agent Immobilier', emoji: '🏠' },
  { value: 'EMPLOYER', label: 'Employeur', emoji: '💼' },
  { value: 'FARMER', label: 'Agriculteur', emoji: '🌾' },
] as const

export const APP_CONFIG = {
  name: 'MABELE',
  tagline: 'La plateforme digitale tout-en-un pour 112 millions de Congolais',
  company: 'TechFlow Solutions',
  country: 'RDC',
  countryCode: 'CD',
  phonePrefix: '+243',
  defaultDevise: 'USD' as const,
  defaultProvince: 'Kinshasa',
} as const
