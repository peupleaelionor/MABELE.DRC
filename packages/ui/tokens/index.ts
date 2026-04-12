// ─── MABELE Design Tokens ─────────────────────────────────────────────────────
// Derived from the MABELE logo: gold star, cobalt blue globe, dark background.
// These tokens are the single source of truth for colors, spacing, radius, etc.

export const brand = {
  // Primary — logo gold
  gold: '#D4A017',
  goldLight: '#E8B528',
  goldDark: '#B8860B',
  goldMuted: 'rgba(212, 160, 23, 0.15)',

  // Secondary — DRC flag cobalt blue
  blue: '#1565C0',
  blueLight: '#1E88E5',
  blueDark: '#0D47A1',
  blueMuted: 'rgba(21, 101, 192, 0.15)',

  // Neutrals (dark-first — mobile app)
  black: '#000000',
  bg: '#0A0A0F',
  bgCard: '#141419',
  bgElevated: '#1C1C24',
  border: 'rgba(255,255,255,0.08)',
  borderStrong: 'rgba(255,255,255,0.16)',

  // Text
  textPrimary: '#F5F5F0',
  textSecondary: '#A0A0B0',
  textMuted: '#606070',
  textInverse: '#0A0A0F',

  // Semantic
  success: '#00C853',
  successMuted: 'rgba(0, 200, 83, 0.15)',
  warning: '#FFB300',
  warningMuted: 'rgba(255, 179, 0, 0.15)',
  error: '#FF5252',
  errorMuted: 'rgba(255, 82, 82, 0.15)',
  info: '#40C4FF',
  infoMuted: 'rgba(64, 196, 255, 0.15)',

  // Module accents
  modules: {
    immo: '#D4A017',      // gold
    emploi: '#26C6DA',    // cyan
    market: '#FF5252',    // red
    agri: '#00C853',      // green
    nkisi: '#B388FF',     // purple
    data: '#448AFF',      // blue
    kangapay: '#FFB300',  // amber
    bima: '#FF4081',      // pink
  },
} as const

export const spacing = {
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
  16: '64px',
  20: '80px',
  24: '96px',
} as const

export const radius = {
  sm: '6px',
  md: '10px',
  lg: '14px',
  xl: '18px',
  '2xl': '24px',
  full: '9999px',
} as const

export const shadow = {
  sm: '0 1px 3px rgba(0,0,0,0.4)',
  md: '0 4px 12px rgba(0,0,0,0.5)',
  lg: '0 8px 32px rgba(0,0,0,0.6)',
  glow: '0 0 20px rgba(212, 160, 23, 0.25)',
  glowBlue: '0 0 20px rgba(21, 101, 192, 0.3)',
} as const

export const typography = {
  fontDisplay: "'Plus Jakarta Sans', 'Segoe UI', system-ui, sans-serif",
  fontBody: "'Inter', 'Segoe UI', system-ui, sans-serif",
  fontMono: "'JetBrains Mono', 'Fira Code', monospace",

  sizes: {
    xs: '11px',
    sm: '13px',
    base: '15px',
    md: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '30px',
    '4xl': '36px',
    '5xl': '48px',
    '6xl': '64px',
  },

  weights: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
} as const

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const
