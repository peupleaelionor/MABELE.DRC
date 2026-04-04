// ============================================================
// MABELE — Shared Utilities
// ============================================================

/**
 * Formats a price with its currency for the DRC context.
 * USD amounts use "$ " prefix, CDF amounts use " FC" suffix.
 */
export const formatPrice = (amount: number, devise: string = 'USD'): string => {
  if (devise === 'CDF') {
    return `${amount.toLocaleString('fr-FR')} FC`
  }
  if (devise === 'USD') {
    return `${amount.toLocaleString('fr-FR')} $`
  }
  return `${amount.toLocaleString('fr-FR')} ${devise}`
}

/**
 * Formats a date in French locale (DRC).
 */
export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

/**
 * Formats a date with time in French locale.
 */
export const formatDateTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Returns a relative time string in French (e.g. "il y a 3 jours").
 */
export const formatRelativeTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)
  const diffMonths = Math.floor(diffDays / 30)

  if (diffSecs < 60) return "À l'instant"
  if (diffMins < 60) return `Il y a ${diffMins} min`
  if (diffHours < 24) return `Il y a ${diffHours}h`
  if (diffDays < 30) return `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`
  if (diffMonths < 12) return `Il y a ${diffMonths} mois`
  return formatDate(d)
}

/**
 * Formats a DRC phone number to display format.
 * Input: '+243812345678' or '0812345678'
 * Output: '+243 81 234 5678'
 */
export const formatPhone = (phone: string): string => {
  const digits = phone.replace(/\D/g, '')

  if (digits.startsWith('243') && digits.length === 12) {
    const local = digits.slice(3)
    return `+243 ${local.slice(0, 2)} ${local.slice(2, 5)} ${local.slice(5)}`
  }

  if (digits.startsWith('0') && digits.length === 10) {
    return `+243 ${digits.slice(1, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`
  }

  return phone
}

/**
 * Validates a DRC phone number.
 * Valid: +243XXXXXXXXX or 0XXXXXXXXX (Airtel 81/82, Vodacom 82/81, Orange 84, Africell 89)
 */
export const isValidDRCPhone = (phone: string): boolean => {
  const digits = phone.replace(/\D/g, '')
  if (digits.startsWith('243') && digits.length === 12) return true
  if (digits.startsWith('0') && digits.length === 10) return true
  return false
}

/**
 * Generates an invoice number with prefix FAC and year.
 */
export const generateInvoiceNumber = (sequence: number): string => {
  const year = new Date().getFullYear()
  const padded = String(sequence).padStart(3, '0')
  return `FAC-${year}-${padded}`
}

/**
 * Truncates text to a maximum length, adding ellipsis.
 */
export const truncate = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength - 3)}...`
}

/**
 * Converts USD to CDF using approximate exchange rate.
 */
export const usdToCDF = (usd: number, rate: number = 2780): number => {
  return Math.round(usd * rate)
}

/**
 * Converts CDF to USD using approximate exchange rate.
 */
export const cdfToUSD = (cdf: number, rate: number = 2780): number => {
  return Math.round((cdf / rate) * 100) / 100
}

/**
 * Returns initials from a full name (e.g. "Jean-Pierre Mutombo" → "JM")
 */
export const getInitials = (name: string): string => {
  return name
    .split(/\s+/)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .slice(0, 2)
    .join('')
}

/**
 * Slugifies a string for URL use.
 */
export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}
