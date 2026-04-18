// ─── MABELE Design Tokens ─────────────────────────────────────────────────────
// Derived from the MABELE logo identity sheet.
// The mark: a spiral/vortex in burnt orange — dynamic, rooted, Congolese.
// Three canonical contexts: dark (logo on #0E0E0E), light (on #EDE8DE), brand (on #C85C20).
// These tokens are the single source of truth for all visual decisions.

export const brand = {
  // ── Primary — logo burnt orange (the spiral mark color) ──
  orange: '#C85C20',
  orangeLight: '#E07838',
  orangeDark: '#A84810',
  orangeMuted: 'rgba(200, 92, 32, 0.15)',
  orangeGlow: 'rgba(200, 92, 32, 0.35)',

  // ── Secondary — warm gold accent ──
  gold: '#BB902A',
  goldLight: '#D4A840',
  goldDark: '#9A7418',
  goldMuted: 'rgba(187, 144, 42, 0.15)',

  // ── Light surface — warm cream (logo on light bg) ──
  cream: '#EDE8DE',
  creamDark: '#D8D0C0',
  creamMuted: 'rgba(237, 232, 222, 0.12)',

  // ── Backgrounds — near-black (logo on dark bg) ──
  bg: '#0E0E0E',
  bgCard: '#161612',
  bgElevated: '#1E1E1A',
  bgMuted: '#1A1A18',

  // ── Borders ──
  border: 'rgba(255, 255, 255, 0.07)',
  borderStrong: 'rgba(255, 255, 255, 0.14)',
  borderWarm: '#2A2A26',

  // ── Foreground ──
  textPrimary: '#F0EDE8',
  textSecondary: '#A09A90',
  textMuted: '#6A6A60',
  textInverse: '#0E0E0E',

  // ── Semantic ──
  success: '#00C853',
  successMuted: 'rgba(0, 200, 83, 0.15)',
  warning: '#FFB300',
  warningMuted: 'rgba(255, 179, 0, 0.15)',
  error: '#FF5252',
  errorMuted: 'rgba(255, 82, 82, 0.15)',
  info: '#40C4FF',
  infoMuted: 'rgba(64, 196, 255, 0.15)',

  // ── Module accent colors (each module has its own identity) ──
  modules: {
    immo: '#BB902A',      // warm gold — real estate, premium
    emploi: '#26C6DA',    // cyan — professional, opportunity
    market: '#FF5252',    // red — energy, commerce
    agri: '#00C853',      // green — growth, nature
    sink: '#B388FF',     // purple — tools, creation
    data: '#448AFF',      // blue — knowledge, data
    kangapay: '#FFB300',  // amber — money, warmth
    bima: '#FF4081',      // pink — health, care
  },
} as const

// ── Gradients ─────────────────────────────────────────────────────────────────

export const gradients = {
  // Primary brand gradient — burnt orange sweep
  brand: 'linear-gradient(135deg, #C85C20, #E07838, #C85C20)',
  brandHover: 'linear-gradient(135deg, #E07838, #C85C20, #E07838)',

  // Gold accent gradient
  gold: 'linear-gradient(135deg, #BB902A, #D4A840, #BB902A)',

  // Dark to brand overlay (hero sections)
  heroDark: 'linear-gradient(180deg, #0E0E0E 0%, rgba(14,14,14,0.85) 100%)',

  // Radial glow for hero background decoration
  heroGlow: 'radial-gradient(circle, rgba(200,92,32,0.08) 0%, transparent 70%)',

  // Card shimmer
  shimmer: 'linear-gradient(90deg, #1A1A18 25%, #2A2A26 50%, #1A1A18 75%)',
} as const

// ── Shadows ───────────────────────────────────────────────────────────────────

export const shadow = {
  sm: '0 1px 3px rgba(0,0,0,0.5)',
  md: '0 4px 12px rgba(0,0,0,0.6)',
  lg: '0 8px 32px rgba(0,0,0,0.7)',
  glow: '0 0 20px rgba(200, 92, 32, 0.35)',
  glowSoft: '0 0 40px rgba(200, 92, 32, 0.15)',
  glowGold: '0 0 20px rgba(187, 144, 42, 0.3)',
  card: '0 8px 32px rgba(200, 92, 32, 0.12)',
} as const

// ── Spacing ───────────────────────────────────────────────────────────────────

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

// ── Radius ────────────────────────────────────────────────────────────────────

export const radius = {
  sm: '6px',
  md: '10px',
  lg: '14px',
  xl: '18px',
  '2xl': '24px',
  full: '9999px',
} as const

// ── Typography ────────────────────────────────────────────────────────────────

export const typography = {
  // Display / headings — bold serif, matching the MABELE wordmark character
  fontDisplay: "'Playfair Display', Georgia, 'Times New Roman', serif",
  // Body — clean, legible, DM Sans matches the brand's modern-meets-local feel
  fontBody: "'DM Sans', system-ui, sans-serif",
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
    '7xl': '80px',
  },

  weights: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  },
} as const

// ── Breakpoints ───────────────────────────────────────────────────────────────

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const

// ── Logo contexts (for programmatic reference) ────────────────────────────────

export const logoContexts = {
  dark: {
    background: brand.bg,
    mark: brand.orange,
    wordmark: brand.cream,
  },
  light: {
    background: brand.cream,
    mark: brand.bg,
    wordmark: brand.bg,
  },
  brand: {
    background: brand.orange,
    mark: brand.cream,
    wordmark: brand.cream,
  },
} as const
