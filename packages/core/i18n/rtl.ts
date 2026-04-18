// ─── RTL/LTR Direction Utilities ──────────────────────────────────────────────

import type { Locale } from './engine'

// ─── RTL Locales ──────────────────────────────────────────────────────────────

const RTL_LOCALES: ReadonlySet<string> = new Set([
  'ar', 'he', 'fa', 'ur', 'ps', 'sd', 'yi', 'ku',
])

// ─── Direction Detection ──────────────────────────────────────────────────────

export type TextDirection = 'ltr' | 'rtl'

export function getDirection(locale: Locale | string): TextDirection {
  const base = locale.split('-')[0]?.split('_')[0]?.toLowerCase() ?? ''
  return RTL_LOCALES.has(base) ? 'rtl' : 'ltr'
}

export function isRTL(locale: Locale | string): boolean {
  return getDirection(locale) === 'rtl'
}

export function isLTR(locale: Locale | string): boolean {
  return getDirection(locale) === 'ltr'
}

// ─── CSS Logical Property Helpers ─────────────────────────────────────────────

export interface LogicalProperties {
  marginInlineStart: string
  marginInlineEnd: string
  paddingInlineStart: string
  paddingInlineEnd: string
  insetInlineStart: string
  insetInlineEnd: string
  borderInlineStart: string
  borderInlineEnd: string
  textAlign: 'start' | 'end'
}

export function getLogicalStart(dir: TextDirection): 'left' | 'right' {
  return dir === 'rtl' ? 'right' : 'left'
}

export function getLogicalEnd(dir: TextDirection): 'left' | 'right' {
  return dir === 'rtl' ? 'left' : 'right'
}

export function getTextAlign(dir: TextDirection): 'left' | 'right' {
  return dir === 'rtl' ? 'right' : 'left'
}

// ─── Bidirectional Text Helpers ──────────────────────────────────────────────

const LTR_MARK = '\u200E'
const RTL_MARK = '\u200F'

export function wrapWithDirection(text: string, dir: TextDirection): string {
  const mark = dir === 'rtl' ? RTL_MARK : LTR_MARK
  return `${mark}${text}${mark}`
}

export function stripDirectionMarks(text: string): string {
  return text.replace(/[\u200E\u200F\u202A-\u202E\u2066-\u2069]/g, '')
}

// ─── HTML Attribute Helpers ──────────────────────────────────────────────────

export function getHtmlAttrs(locale: Locale | string): {
  dir: TextDirection
  lang: string
} {
  return {
    dir: getDirection(locale),
    lang: locale,
  }
}
