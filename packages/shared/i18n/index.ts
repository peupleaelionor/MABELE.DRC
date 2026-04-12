export { fr } from './fr'
export { en } from './en'
export { ln } from './ln'
export { sw } from './sw'
export type { Messages } from './fr'

export type Locale = 'fr' | 'en' | 'ln' | 'sw'

export const SUPPORTED_LOCALES: Locale[] = ['fr', 'en', 'ln', 'sw']
export const DEFAULT_LOCALE: Locale = 'fr'

export const LOCALE_NAMES: Record<Locale, string> = {
  fr: 'Français',
  en: 'English',
  ln: 'Lingala',
  sw: 'Kiswahili',
}

export async function getMessages(locale: Locale) {
  switch (locale) {
    case 'en': return (await import('./en')).en
    case 'ln': return (await import('./ln')).ln
    case 'sw': return (await import('./sw')).sw
    default:   return (await import('./fr')).fr
  }
}
