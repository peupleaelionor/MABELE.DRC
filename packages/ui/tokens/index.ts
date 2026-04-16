// ─── MABELE Design Tokens ─────────────────────────────────────────────────────
// Source of truth: MABELE Visual Kit Boards 1–4
// White-first · Royal Blue primary · Golden Yellow CTAs · Midnight Blue depth

export const brand = {
  // ── Royal Blue — navigation, headers, primary actions ──
  royalBlue:       '#1B4FB3',
  royalBlueLight:  '#2563EB',
  royalBlueDark:   '#0F3286',
  royalBlueMuted:  'rgba(27, 79, 179, 0.10)',

  // ── Midnight Blue — sidebar, deep backgrounds, strong text ──
  navy:            '#0C1E47',
  navyLight:       '#1A3260',
  navyMuted:       'rgba(12, 30, 71, 0.08)',

  // ── Golden Yellow — primary CTAs, active states, KangaPay accent ──
  gold:            '#F5A623',
  goldLight:       '#F8C060',
  goldDark:        '#D4881A',
  goldMuted:       'rgba(245, 166, 35, 0.15)',

  // ── Red — error, destructive, alert ──
  red:             '#E02020',
  redLight:        '#FEE2E2',
  redMuted:        'rgba(224, 32, 32, 0.10)',

  // ── Backgrounds ──
  white:           '#FFFFFF',
  gray50:          '#F5F8FC',
  gray100:         '#EBF0F7',
  gray200:         '#D4DEEb',

  // ── Borders ──
  border:          '#D0DBE8',
  borderLight:     '#E8EEF4',

  // ── Text ──
  textPrimary:     '#0C1E47',
  textSecondary:   '#3D526B',
  textMuted:       '#8FA4BA',
  textOnDark:      '#FFFFFF',
  textOnGold:      '#0C1E47',

  // ── Semantic ──
  success:         '#16A34A',
  successLight:    '#DCFCE7',
  warning:         '#F59E0B',
  warningLight:    '#FEF3C7',
  error:           '#DC2626',
  errorLight:      '#FEE2E2',
  info:            '#1B4FB3',
  infoLight:       '#EFF6FF',

  // ── Module accents (Board 2 service cards) ──
  modules: {
    immo:     '#1B4FB3',  // royal blue
    emploi:   '#0891B2',  // cyan
    marche:   '#E02020',  // red
    agri:     '#16A34A',  // green
    nkisi:    '#7C3AED',  // purple
    data:     '#0C1E47',  // navy
    kangapay: '#F5A623',  // gold
    bima:     '#DB2777',  // pink
    logistique: '#EA580C', // orange
  },
} as const

export const shadow = {
  xs:   '0 1px 2px rgba(12, 30, 71, 0.06)',
  sm:   '0 2px 6px rgba(12, 30, 71, 0.08)',
  md:   '0 4px 16px rgba(12, 30, 71, 0.10)',
  lg:   '0 8px 32px rgba(12, 30, 71, 0.12)',
  xl:   '0 16px 48px rgba(12, 30, 71, 0.14)',
  card: '0 2px 12px rgba(12, 30, 71, 0.08)',
  nav:  '0 -2px 16px rgba(12, 30, 71, 0.08)',
  gold: '0 4px 16px rgba(245, 166, 35, 0.30)',
  blue: '0 4px 16px rgba(27, 79, 179, 0.25)',
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
    tight:  1.2,
    snug:   1.4,
    normal: 1.6,
    relaxed:1.75,
  },
} as const

export const breakpoints = {
  sm:  '640px',
  md:  '768px',
  lg:  '1024px',
  xl:  '1280px',
  '2xl': '1536px',
} as const

// ── Logo context rules ────────────────────────────────────────────────────────

export const logoContexts = {
  light: {
    background: brand.white,
    wordmark:   brand.royalBlue,
  },
  dark: {
    background: brand.navy,
    wordmark:   brand.white,
  },
  sidebar: {
    background: brand.navy,
    wordmark:   brand.white,
  },
} as const
