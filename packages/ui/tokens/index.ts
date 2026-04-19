// ─── MABELE Design Tokens — Dark Premium ──────────────────────────────────────
// Source of truth: MABELE Visual Kit · Dark palette · Orange accent #E05C1A

export const brand = {
  // ── Orange Accent — primary CTAs, active states, KangaPay ──
  accent:        '#E05C1A',
  accentLight:   '#F07A3A',
  accentDark:    '#C04A10',
  accentMuted:   'rgba(224, 92, 26, 0.12)',
  accentGlow:    'rgba(224, 92, 26, 0.30)',

  // ── Dark Backgrounds ──
  bg:            '#1A1A1A',
  surface:       '#242424',
  surfaceHigh:   '#2D2D2D',
  input:         '#2A2A2A',
  nav:           '#191919',

  // ── Text ──
  textPrimary:   '#FFFFFF',
  textSecondary: 'rgba(255, 255, 255, 0.60)',
  textMuted:     'rgba(255, 255, 255, 0.40)',
  textSubtle:    'rgba(255, 255, 255, 0.25)',

  // ── Borders ──
  border:        'rgba(255, 255, 255, 0.08)',
  borderLight:   'rgba(255, 255, 255, 0.06)',
  borderStrong:  'rgba(255, 255, 255, 0.12)',

  // ── Semantic ──
  success:       '#22C55E',
  successMuted:  'rgba(34, 197, 94, 0.12)',
  error:         '#EF4444',
  errorMuted:    'rgba(239, 68, 68, 0.12)',
  warning:       '#F59E0B',
  warningMuted:  'rgba(245, 158, 11, 0.12)',
  info:          '#38BDF8',
  infoMuted:     'rgba(56, 189, 248, 0.12)',

  // ── Module accents (preserved for contextual clarity) ──
  modules: {
    immo:       '#E05C1A',  // orange (primary accent)
    emploi:     '#0891B2',  // teal
    marche:     '#E02020',  // red
    agri:       '#16A34A',  // green
    nkisi:      '#7C3AED',  // purple
    data:       '#1B4FB3',  // blue
    kangapay:   '#E05C1A',  // orange
    bima:       '#0891B2',  // teal
    logistique: '#0891B2',  // teal
  },
} as const

export const shadow = {
  xs:     '0 1px 4px rgba(0, 0, 0, 0.20)',
  sm:     '0 2px 8px rgba(0, 0, 0, 0.25)',
  md:     '0 4px 16px rgba(0, 0, 0, 0.30)',
  lg:     '0 8px 32px rgba(0, 0, 0, 0.35)',
  xl:     '0 16px 48px rgba(0, 0, 0, 0.40)',
  card:   '0 2px 12px rgba(0, 0, 0, 0.28)',
  nav:    '0 -2px 16px rgba(0, 0, 0, 0.30)',
  accent: '0 4px 16px rgba(224, 92, 26, 0.35)',
  glow:   '0 0 24px rgba(224, 92, 26, 0.25)',
} as const

export const radius = {
  xs:   '4px',
  sm:   '8px',
  md:   '12px',
  lg:   '16px',
  xl:   '20px',
  '2xl':'24px',
  full: '9999px',
} as const

export const spacing = {
  1:  '4px',  2:  '8px',  3:  '12px', 4:  '16px',
  5:  '20px', 6:  '24px', 8:  '32px', 10: '40px',
  12: '48px', 16: '64px', 20: '80px', 24: '96px',
} as const

export const typography = {
  fontDisplay: "'Playfair Display', Georgia, 'Times New Roman', serif",
  fontBody:    "'DM Sans', system-ui, -apple-system, sans-serif",
  fontMono:    "'JetBrains Mono', 'Fira Code', monospace",

  sizes: {
    xs:   '11px', sm:   '13px', base: '15px',
    md:   '16px', lg:   '18px', xl:   '20px',
    '2xl':'24px', '3xl':'30px', '4xl':'36px',
    '5xl':'48px', '6xl':'56px',
  },

  weights: {
    normal:    400,
    medium:    500,
    semibold:  600,
    bold:      700,
    extrabold: 800,
    black:     900,
  },

  leading: {
    tight:   1.2,
    snug:    1.4,
    normal:  1.6,
    relaxed: 1.75,
  },
} as const

export const breakpoints = {
  sm:    '640px',
  md:    '768px',
  lg:    '1024px',
  xl:    '1280px',
  '2xl': '1536px',
} as const

export const logoContexts = {
  dark: {
    background: brand.nav,
    wordmark:   brand.textPrimary,
    accent:     brand.accent,
  },
  surface: {
    background: brand.surface,
    wordmark:   brand.textPrimary,
    accent:     brand.accent,
  },
} as const
