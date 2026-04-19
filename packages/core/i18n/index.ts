// ─── i18n Package Barrel Export ────────────────────────────────────────────────

export * from './engine'
export * from './formats'
export * from './rtl'

import { I18nEngine } from './engine'
import fr from './translations/fr'
import ln from './translations/ln'
import sw from './translations/sw'
import kg from './translations/kg'

export { default as frTranslations } from './translations/fr'
export { default as lnTranslations } from './translations/ln'
export { default as swTranslations } from './translations/sw'
export { default as kgTranslations } from './translations/kg'

// ─── Singleton Instance ───────────────────────────────────────────────────────

const i18n = new I18nEngine({ defaultLocale: 'fr', fallbackLocale: 'fr' })

i18n.addDictionary('fr', fr)
i18n.addDictionary('ln', ln)
i18n.addDictionary('sw', sw)
i18n.addDictionary('kg', kg)

export { i18n }

export const t = i18n.t.bind(i18n)
export const tc = i18n.tc.bind(i18n)
