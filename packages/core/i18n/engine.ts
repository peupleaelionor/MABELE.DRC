// ─── Internationalization Engine ──────────────────────────────────────────────

// ─── Types ────────────────────────────────────────────────────────────────────

export type Locale = 'fr' | 'ln' | 'sw' | 'kg'

export type TranslationDictionary = Record<string, string | TranslationDictionary>

export interface I18nOptions {
  defaultLocale: Locale
  fallbackLocale: Locale
  enableMissingWarnings: boolean
  interpolationPrefix: string
  interpolationSuffix: string
}

export interface PluralRule {
  zero?: string
  one: string
  other: string
}

export type MissingKeyHandler = (locale: Locale, key: string) => void

// ─── Default Options ──────────────────────────────────────────────────────────

const DEFAULT_OPTIONS: I18nOptions = {
  defaultLocale: 'fr',
  fallbackLocale: 'fr',
  enableMissingWarnings: true,
  interpolationPrefix: '{{',
  interpolationSuffix: '}}',
}

// ─── Pluralization Rules ──────────────────────────────────────────────────────

function getFrenchPluralIndex(count: number): 'zero' | 'one' | 'other' {
  if (count === 0) return 'zero'
  if (count === 1 || count === 0) return 'one'
  return 'other'
}

function getLingalaPluralIndex(count: number): 'zero' | 'one' | 'other' {
  if (count === 0) return 'zero'
  if (count === 1) return 'one'
  return 'other'
}

function getSwahiliPluralIndex(count: number): 'zero' | 'one' | 'other' {
  if (count === 0) return 'zero'
  if (count === 1) return 'one'
  return 'other'
}

const PLURAL_RULES: Record<
  Locale,
  (count: number) => 'zero' | 'one' | 'other'
> = {
  fr: getFrenchPluralIndex,
  ln: getLingalaPluralIndex,
  sw: getSwahiliPluralIndex,
  kg: getLingalaPluralIndex,
}

// ─── I18n Engine ──────────────────────────────────────────────────────────────

export class I18nEngine {
  private dictionaries: Map<Locale, TranslationDictionary> = new Map()
  private currentLocale: Locale
  private missingKeys: Set<string> = new Set()
  private missingKeyHandlers: MissingKeyHandler[] = []
  private localeChangeListeners: Array<(locale: Locale) => void> = []
  private readonly options: I18nOptions

  constructor(options: Partial<I18nOptions> = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options }
    this.currentLocale = this.options.defaultLocale
  }

  // ─── Dictionary Management ────────────────────────────────────────────────

  addDictionary(locale: Locale, dictionary: TranslationDictionary): void {
    const existing = this.dictionaries.get(locale)
    if (existing) {
      this.dictionaries.set(locale, this.mergeDictionaries(existing, dictionary))
    } else {
      this.dictionaries.set(locale, dictionary)
    }
  }

  private mergeDictionaries(
    base: TranslationDictionary,
    override: TranslationDictionary,
  ): TranslationDictionary {
    const result: TranslationDictionary = { ...base }

    for (const [key, value] of Object.entries(override)) {
      if (
        typeof value === 'object' &&
        typeof result[key] === 'object' &&
        result[key] !== null
      ) {
        result[key] = this.mergeDictionaries(
          result[key] as TranslationDictionary,
          value,
        )
      } else {
        result[key] = value
      }
    }

    return result
  }

  // ─── Locale Management ────────────────────────────────────────────────────

  setLocale(locale: Locale): void {
    if (this.currentLocale === locale) return
    this.currentLocale = locale
    for (const listener of this.localeChangeListeners) {
      listener(locale)
    }
  }

  getLocale(): Locale {
    return this.currentLocale
  }

  getAvailableLocales(): Locale[] {
    return Array.from(this.dictionaries.keys())
  }

  onLocaleChange(listener: (locale: Locale) => void): () => void {
    this.localeChangeListeners.push(listener)
    return () => {
      const idx = this.localeChangeListeners.indexOf(listener)
      if (idx >= 0) this.localeChangeListeners.splice(idx, 1)
    }
  }

  // ─── Translation ─────────────────────────────────────────────────────────

  t(key: string, params?: Record<string, string | number>): string {
    const value = this.resolveKey(key, this.currentLocale)

    if (value === undefined) {
      const fallbackValue = this.resolveKey(key, this.options.fallbackLocale)
      if (fallbackValue !== undefined) {
        return this.interpolate(fallbackValue, params)
      }

      this.reportMissing(this.currentLocale, key)
      return key
    }

    return this.interpolate(value, params)
  }

  tc(key: string, count: number, params?: Record<string, string | number>): string {
    const pluralFn = PLURAL_RULES[this.currentLocale]
    const pluralKey = pluralFn(count)

    const fullKey = `${key}.${pluralKey}`
    let value = this.resolveKey(fullKey, this.currentLocale)

    if (value === undefined && pluralKey !== 'other') {
      const otherKey = `${key}.other`
      value = this.resolveKey(otherKey, this.currentLocale)
    }

    if (value === undefined) {
      value = this.resolveKey(fullKey, this.options.fallbackLocale)
    }

    if (value === undefined) {
      this.reportMissing(this.currentLocale, fullKey)
      return key
    }

    const allParams = { ...params, count: count.toString(), n: count.toString() }
    return this.interpolate(value, allParams)
  }

  // ─── Key Resolution ───────────────────────────────────────────────────────

  private resolveKey(key: string, locale: Locale): string | undefined {
    const dict = this.dictionaries.get(locale)
    if (!dict) return undefined

    const parts = key.split('.')
    let current: TranslationDictionary | string | undefined = dict

    for (const part of parts) {
      if (typeof current !== 'object' || current === null) return undefined
      current = (current as TranslationDictionary)[part]
    }

    return typeof current === 'string' ? current : undefined
  }

  hasKey(key: string, locale?: Locale): boolean {
    return this.resolveKey(key, locale ?? this.currentLocale) !== undefined
  }

  // ─── Interpolation ───────────────────────────────────────────────────────

  private interpolate(
    template: string,
    params?: Record<string, string | number>,
  ): string {
    if (!params) return template

    const { interpolationPrefix, interpolationSuffix } = this.options
    let result = template

    for (const [key, value] of Object.entries(params)) {
      const placeholder = `${interpolationPrefix}${key}${interpolationSuffix}`
      result = result.split(placeholder).join(String(value))
    }

    return result
  }

  // ─── Missing Key Tracking ────────────────────────────────────────────────

  private reportMissing(locale: Locale, key: string): void {
    const compositeKey = `${locale}:${key}`
    if (this.missingKeys.has(compositeKey)) return
    this.missingKeys.add(compositeKey)

    if (this.options.enableMissingWarnings) {
      for (const handler of this.missingKeyHandlers) {
        handler(locale, key)
      }
    }
  }

  onMissingKey(handler: MissingKeyHandler): () => void {
    this.missingKeyHandlers.push(handler)
    return () => {
      const idx = this.missingKeyHandlers.indexOf(handler)
      if (idx >= 0) this.missingKeyHandlers.splice(idx, 1)
    }
  }

  getMissingKeys(): string[] {
    return Array.from(this.missingKeys)
  }

  clearMissingKeys(): void {
    this.missingKeys.clear()
  }

  // ─── Locale Detection ────────────────────────────────────────────────────

  detectLocale(
    browserLanguages?: readonly string[],
    userPreference?: string,
  ): Locale {
    if (userPreference) {
      const parsed = this.parseLocale(userPreference)
      if (parsed) return parsed
    }

    if (browserLanguages) {
      for (const lang of browserLanguages) {
        const parsed = this.parseLocale(lang)
        if (parsed) return parsed
      }
    }

    return this.options.defaultLocale
  }

  private parseLocale(input: string): Locale | undefined {
    const normalized = input.toLowerCase().split('-')[0]?.split('_')[0]

    const localeMap: Record<string, Locale> = {
      fr: 'fr',
      ln: 'ln',
      sw: 'sw',
      kg: 'kg',
      french: 'fr',
      lingala: 'ln',
      swahili: 'sw',
      kikongo: 'kg',
    }

    return normalized ? localeMap[normalized] : undefined
  }

  // ─── Utilities ────────────────────────────────────────────────────────────

  getAllKeys(locale?: Locale): string[] {
    const dict = this.dictionaries.get(locale ?? this.currentLocale)
    if (!dict) return []
    return this.flattenKeys(dict)
  }

  private flattenKeys(
    dict: TranslationDictionary,
    prefix = '',
  ): string[] {
    const keys: string[] = []
    for (const [key, value] of Object.entries(dict)) {
      const fullKey = prefix ? `${prefix}.${key}` : key
      if (typeof value === 'string') {
        keys.push(fullKey)
      } else {
        keys.push(...this.flattenKeys(value, fullKey))
      }
    }
    return keys
  }

  getKeyCount(locale?: Locale): number {
    return this.getAllKeys(locale).length
  }

  clear(): void {
    this.dictionaries.clear()
    this.missingKeys.clear()
    this.currentLocale = this.options.defaultLocale
  }
}
