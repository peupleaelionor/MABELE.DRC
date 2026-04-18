// ─── Locale-Aware Formatting ──────────────────────────────────────────────────

import type { Locale } from './engine'

// ─── Types ────────────────────────────────────────────────────────────────────

export type CurrencyCode = 'CDF' | 'USD' | 'EUR' | 'XAF'

export interface CurrencyInfo {
  code: CurrencyCode
  symbol: string
  name: string
  decimals: number
  symbolPosition: 'before' | 'after'
}

export interface DateFormatOptions {
  format?: 'short' | 'medium' | 'long' | 'full'
  includeTime?: boolean
}

// ─── Currency Data ────────────────────────────────────────────────────────────

const CURRENCIES: Record<CurrencyCode, CurrencyInfo> = {
  CDF: {
    code: 'CDF',
    symbol: 'FC',
    name: 'Franc Congolais',
    decimals: 2,
    symbolPosition: 'after',
  },
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'Dollar américain',
    decimals: 2,
    symbolPosition: 'before',
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    decimals: 2,
    symbolPosition: 'after',
  },
  XAF: {
    code: 'XAF',
    symbol: 'FCFA',
    name: 'Franc CFA',
    decimals: 0,
    symbolPosition: 'after',
  },
}

// ─── Locale-specific Config ──────────────────────────────────────────────────

interface LocaleConfig {
  decimalSeparator: string
  thousandsSeparator: string
  dateOrder: 'dmy' | 'mdy' | 'ymd'
  monthNames: string[]
  monthNamesShort: string[]
  dayNames: string[]
  dayNamesShort: string[]
  relativeTimeLabels: {
    now: string
    secondsAgo: string
    minuteAgo: string
    minutesAgo: string
    hourAgo: string
    hoursAgo: string
    dayAgo: string
    daysAgo: string
    weekAgo: string
    weeksAgo: string
    monthAgo: string
    monthsAgo: string
    yearAgo: string
    yearsAgo: string
  }
}

const LOCALE_CONFIGS: Record<Locale, LocaleConfig> = {
  fr: {
    decimalSeparator: ',',
    thousandsSeparator: ' ',
    dateOrder: 'dmy',
    monthNames: [
      'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
      'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre',
    ],
    monthNamesShort: [
      'janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin',
      'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.',
    ],
    dayNames: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
    dayNamesShort: ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'],
    relativeTimeLabels: {
      now: 'à l\'instant',
      secondsAgo: 'il y a {{n}} secondes',
      minuteAgo: 'il y a 1 minute',
      minutesAgo: 'il y a {{n}} minutes',
      hourAgo: 'il y a 1 heure',
      hoursAgo: 'il y a {{n}} heures',
      dayAgo: 'hier',
      daysAgo: 'il y a {{n}} jours',
      weekAgo: 'il y a 1 semaine',
      weeksAgo: 'il y a {{n}} semaines',
      monthAgo: 'il y a 1 mois',
      monthsAgo: 'il y a {{n}} mois',
      yearAgo: 'il y a 1 an',
      yearsAgo: 'il y a {{n}} ans',
    },
  },
  ln: {
    decimalSeparator: ',',
    thousandsSeparator: '.',
    dateOrder: 'dmy',
    monthNames: [
      'sánzá ya yambo', 'sánzá ya míbalé', 'sánzá ya mísáto', 'sánzá ya mínei',
      'sánzá ya mítáno', 'sánzá ya motóbá', 'sánzá ya nsambo', 'sánzá ya mwambe',
      'sánzá ya libwá', 'sánzá ya zómi', 'sánzá ya zómi na mɔ̌kɔ́', 'sánzá ya zómi na míbalé',
    ],
    monthNamesShort: [
      'yan', 'fbl', 'msi', 'apl', 'mai', 'yun',
      'yul', 'agt', 'stb', 'ɔtb', 'nvb', 'dsb',
    ],
    dayNames: ['eyenga', 'mokɔlɔ mwa yambo', 'mokɔlɔ mwa míbalé', 'mokɔlɔ mwa mísáto', 'mokɔlɔ mwa mínei', 'mokɔlɔ mwa mítáno', 'mpɔ́sɔ'],
    dayNamesShort: ['eye', 'ybo', 'mbl', 'mst', 'mni', 'mtn', 'mps'],
    relativeTimeLabels: {
      now: 'sikóyo',
      secondsAgo: 'segɔndɛ {{n}} eleki',
      minuteAgo: 'moniti 1 eleki',
      minutesAgo: 'miniti {{n}} eleki',
      hourAgo: 'ngonga 1 eleki',
      hoursAgo: 'ngonga {{n}} eleki',
      dayAgo: 'lóbi',
      daysAgo: 'mikolo {{n}} eleki',
      weekAgo: 'pɔsɔ 1 eleki',
      weeksAgo: 'bapɔsɔ {{n}} eleki',
      monthAgo: 'sánzá 1 eleki',
      monthsAgo: 'sánzá {{n}} eleki',
      yearAgo: 'mbúla 1 eleki',
      yearsAgo: 'mimbúla {{n}} eleki',
    },
  },
  sw: {
    decimalSeparator: ',',
    thousandsSeparator: '.',
    dateOrder: 'dmy',
    monthNames: [
      'Januari', 'Februari', 'Machi', 'Aprili', 'Mei', 'Juni',
      'Julai', 'Agosti', 'Septemba', 'Oktoba', 'Novemba', 'Desemba',
    ],
    monthNamesShort: [
      'Jan', 'Feb', 'Mac', 'Apr', 'Mei', 'Jun',
      'Jul', 'Ago', 'Sep', 'Okt', 'Nov', 'Des',
    ],
    dayNames: ['Jumapili', 'Jumatatu', 'Jumanne', 'Jumatano', 'Alhamisi', 'Ijumaa', 'Jumamosi'],
    dayNamesShort: ['Jpl', 'Jtt', 'Jnn', 'Jtn', 'Alh', 'Ijm', 'Jms'],
    relativeTimeLabels: {
      now: 'sasa hivi',
      secondsAgo: 'sekunde {{n}} zilizopita',
      minuteAgo: 'dakika 1 iliyopita',
      minutesAgo: 'dakika {{n}} zilizopita',
      hourAgo: 'saa 1 iliyopita',
      hoursAgo: 'masaa {{n}} yaliyopita',
      dayAgo: 'jana',
      daysAgo: 'siku {{n}} zilizopita',
      weekAgo: 'wiki 1 iliyopita',
      weeksAgo: 'wiki {{n}} zilizopita',
      monthAgo: 'mwezi 1 uliopita',
      monthsAgo: 'miezi {{n}} iliyopita',
      yearAgo: 'mwaka 1 uliopita',
      yearsAgo: 'miaka {{n}} iliyopita',
    },
  },
  kg: {
    decimalSeparator: ',',
    thousandsSeparator: '.',
    dateOrder: 'dmy',
    monthNames: [
      'Ngonda ya ntete', 'Ngonda ya zole', 'Ngonda ya tatu', 'Ngonda ya iya',
      'Ngonda ya tanu', 'Ngonda ya sambanu', 'Ngonda ya nsambwadi', 'Ngonda ya nana',
      'Ngonda ya divwa', 'Ngonda ya kumi', 'Ngonda ya kumi na mosi', 'Ngonda ya kumi na zole',
    ],
    monthNamesShort: [
      'Ntt', 'Nzl', 'Nta', 'Niy', 'Ntn', 'Nsm',
      'Nsw', 'Nna', 'Ndv', 'Nku', 'Nkm', 'Nkz',
    ],
    dayNames: ['Lumingu', 'Kimosi', 'Kizole', 'Kitatu', 'Kiya', 'Kitanu', 'Sabala'],
    dayNamesShort: ['Lmg', 'Kms', 'Kzl', 'Ktt', 'Kiy', 'Ktn', 'Sbl'],
    relativeTimeLabels: {
      now: 'bwabu',
      secondsAgo: 'segonde {{n}} ya nkufi',
      minuteAgo: 'miniti 1 ya nkufi',
      minutesAgo: 'miniti {{n}} ya nkufi',
      hourAgo: 'ngonga 1 ya nkufi',
      hoursAgo: 'ngonga {{n}} ya nkufi',
      dayAgo: 'zono',
      daysAgo: 'bilumbu {{n}} ya nkufi',
      weekAgo: 'mposo 1 ya nkufi',
      weeksAgo: 'mposo {{n}} ya nkufi',
      monthAgo: 'ngonda 1 ya nkufi',
      monthsAgo: 'ngonda {{n}} ya nkufi',
      yearAgo: 'mvula 1 ya nkufi',
      yearsAgo: 'mvula {{n}} ya nkufi',
    },
  },
}

// ─── Number Formatting ────────────────────────────────────────────────────────

export function formatNumber(
  value: number,
  locale: Locale = 'fr',
  decimals?: number,
): string {
  const config = LOCALE_CONFIGS[locale]
  const dec = decimals ?? (Number.isInteger(value) ? 0 : 2)

  const fixed = Math.abs(value).toFixed(dec)
  const [intPart, decPart] = fixed.split('.')

  const formatted = intPart!.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    config.thousandsSeparator,
  )

  const sign = value < 0 ? '-' : ''
  if (decPart && dec > 0) {
    return `${sign}${formatted}${config.decimalSeparator}${decPart}`
  }
  return `${sign}${formatted}`
}

export function formatPercentage(
  value: number,
  locale: Locale = 'fr',
  decimals = 1,
): string {
  return `${formatNumber(value, locale, decimals)} %`
}

// ─── Currency Formatting ──────────────────────────────────────────────────────

export function formatCurrency(
  amount: number,
  currency: CurrencyCode = 'CDF',
  locale: Locale = 'fr',
): string {
  const info = CURRENCIES[currency]
  const formatted = formatNumber(amount, locale, info.decimals)

  if (info.symbolPosition === 'before') {
    return `${info.symbol}${formatted}`
  }
  return `${formatted} ${info.symbol}`
}

export function getCurrencyInfo(code: CurrencyCode): CurrencyInfo {
  return CURRENCIES[code]
}

export function getAllCurrencies(): CurrencyInfo[] {
  return Object.values(CURRENCIES)
}

// ─── Date Formatting ──────────────────────────────────────────────────────────

export function formatDate(
  date: Date | number,
  locale: Locale = 'fr',
  options: DateFormatOptions = {},
): string {
  const d = typeof date === 'number' ? new Date(date) : date
  const config = LOCALE_CONFIGS[locale]
  const format = options.format ?? 'medium'

  const day = d.getDate()
  const month = d.getMonth()
  const year = d.getFullYear()

  let result: string

  switch (format) {
    case 'short':
      result = formatDateShort(day, month, year, config)
      break
    case 'medium':
      result = `${day} ${config.monthNamesShort[month]} ${year}`
      break
    case 'long':
      result = `${day} ${config.monthNames[month]} ${year}`
      break
    case 'full':
      result = `${config.dayNames[d.getDay()]}, ${day} ${config.monthNames[month]} ${year}`
      break
  }

  if (options.includeTime) {
    const hours = d.getHours().toString().padStart(2, '0')
    const minutes = d.getMinutes().toString().padStart(2, '0')
    result += ` ${hours}:${minutes}`
  }

  return result
}

function formatDateShort(
  day: number,
  month: number,
  year: number,
  config: LocaleConfig,
): string {
  const dd = day.toString().padStart(2, '0')
  const mm = (month + 1).toString().padStart(2, '0')

  switch (config.dateOrder) {
    case 'dmy':
      return `${dd}/${mm}/${year}`
    case 'mdy':
      return `${mm}/${dd}/${year}`
    case 'ymd':
      return `${year}/${mm}/${dd}`
  }
}

export function formatRelativeTime(
  date: Date | number,
  locale: Locale = 'fr',
): string {
  const d = typeof date === 'number' ? date : date.getTime()
  const now = Date.now()
  const diffMs = now - d
  const diffSec = Math.floor(diffMs / 1_000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHr = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHr / 24)
  const diffWeek = Math.floor(diffDay / 7)
  const diffMonth = Math.floor(diffDay / 30)
  const diffYear = Math.floor(diffDay / 365)

  const labels = LOCALE_CONFIGS[locale].relativeTimeLabels

  if (diffSec < 10) return labels.now
  if (diffSec < 60) return labels.secondsAgo.replace('{{n}}', String(diffSec))
  if (diffMin === 1) return labels.minuteAgo
  if (diffMin < 60) return labels.minutesAgo.replace('{{n}}', String(diffMin))
  if (diffHr === 1) return labels.hourAgo
  if (diffHr < 24) return labels.hoursAgo.replace('{{n}}', String(diffHr))
  if (diffDay === 1) return labels.dayAgo
  if (diffDay < 7) return labels.daysAgo.replace('{{n}}', String(diffDay))
  if (diffWeek === 1) return labels.weekAgo
  if (diffWeek < 4) return labels.weeksAgo.replace('{{n}}', String(diffWeek))
  if (diffMonth === 1) return labels.monthAgo
  if (diffMonth < 12) return labels.monthsAgo.replace('{{n}}', String(diffMonth))
  if (diffYear === 1) return labels.yearAgo
  return labels.yearsAgo.replace('{{n}}', String(diffYear))
}

// ─── Phone Formatting ─────────────────────────────────────────────────────────

export function formatPhoneDRC(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')

  if (cleaned.startsWith('243') && cleaned.length === 12) {
    const rest = cleaned.slice(3)
    return `+243 ${rest.slice(0, 2)} ${rest.slice(2, 5)} ${rest.slice(5)}`
  }

  if (cleaned.startsWith('0') && cleaned.length === 10) {
    return `+243 ${cleaned.slice(1, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`
  }

  if (cleaned.length === 9) {
    return `+243 ${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5)}`
  }

  return phone
}

// ─── Distance and Area Formatting ─────────────────────────────────────────────

export function formatDistance(
  meters: number,
  locale: Locale = 'fr',
): string {
  if (meters < 1_000) {
    return `${formatNumber(Math.round(meters), locale)} m`
  }
  return `${formatNumber(meters / 1_000, locale, 1)} km`
}

export function formatArea(
  sqMeters: number,
  locale: Locale = 'fr',
): string {
  if (sqMeters < 10_000) {
    return `${formatNumber(Math.round(sqMeters), locale)} m²`
  }
  return `${formatNumber(sqMeters / 10_000, locale, 2)} ha`
}

// ─── Weight and Volume ───────────────────────────────────────────────────────

export function formatWeight(
  grams: number,
  locale: Locale = 'fr',
): string {
  if (grams < 1_000) {
    return `${formatNumber(Math.round(grams), locale)} g`
  }
  if (grams < 1_000_000) {
    return `${formatNumber(grams / 1_000, locale, 1)} kg`
  }
  return `${formatNumber(grams / 1_000_000, locale, 2)} t`
}

export function formatVolume(
  milliliters: number,
  locale: Locale = 'fr',
): string {
  if (milliliters < 1_000) {
    return `${formatNumber(Math.round(milliliters), locale)} ml`
  }
  return `${formatNumber(milliliters / 1_000, locale, 1)} L`
}
