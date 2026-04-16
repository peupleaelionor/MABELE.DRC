import type { Config } from 'tailwindcss'

// ─── MABELE Shared Tailwind Config ────────────────────────────────────────────
// Source of truth: MABELE Visual Kit Boards 1–4
// White-first · Royal Blue · Golden Yellow CTAs · Midnight Blue depth

const sharedConfig: Partial<Config> = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // ── Brand palette ──
        background:    '#FFFFFF',
        'bg-subtle':   '#F5F8FC',
        foreground:    '#0C1E47',

        primary: {
          DEFAULT:     '#1B4FB3',   // Royal Blue
          light:       '#2563EB',
          dark:        '#0F3286',
          foreground:  '#FFFFFF',
          muted:       'rgba(27,79,179,0.10)',
        },

        navy: {
          DEFAULT:     '#0C1E47',   // Midnight Blue — sidebar, depth
          light:       '#1A3260',
          foreground:  '#FFFFFF',
        },

        gold: {
          DEFAULT:     '#F5A623',   // Golden Yellow — CTA, active states
          light:       '#F8C060',
          dark:        '#D4881A',
          foreground:  '#0C1E47',
          muted:       'rgba(245,166,35,0.15)',
        },

        // ── Neutrals ──
        muted: {
          DEFAULT:     '#F5F8FC',
          foreground:  '#8FA4BA',
        },
        border:        '#D0DBE8',
        'border-light':'#E8EEF4',
        card:          '#FFFFFF',
        'card-hover':  '#F5F8FC',

        // ── Semantic ──
        success:       '#16A34A',
        'success-bg':  '#DCFCE7',
        warning:       '#F59E0B',
        'warning-bg':  '#FEF3C7',
        error:         '#DC2626',
        'error-bg':    '#FEE2E2',

        // ── Text ──
        'text-primary':   '#0C1E47',
        'text-secondary': '#3D526B',
        'text-muted':     '#8FA4BA',

        // ── Module colors ──
        'mod-immo':     '#1B4FB3',
        'mod-emploi':   '#0891B2',
        'mod-marche':   '#E02020',
        'mod-agri':     '#16A34A',
        'mod-nkisi':    '#7C3AED',
        'mod-data':     '#0C1E47',
        'mod-kangapay': '#F5A623',
        'mod-bima':     '#DB2777',
        'mod-logistique':'#EA580C',
      },

      fontFamily: {
        sans:    ['DM Sans', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
        mono:    ['JetBrains Mono', 'Fira Code', 'monospace'],
      },

      borderRadius: {
        xs:   '4px',
        sm:   '8px',
        md:   '12px',
        lg:   '16px',
        xl:   '20px',
        '2xl':'24px',
      },

      boxShadow: {
        xs:   '0 1px 2px rgba(12,30,71,0.06)',
        sm:   '0 2px 6px rgba(12,30,71,0.08)',
        card: '0 2px 12px rgba(12,30,71,0.08)',
        md:   '0 4px 16px rgba(12,30,71,0.10)',
        lg:   '0 8px 32px rgba(12,30,71,0.12)',
        gold: '0 4px 16px rgba(245,166,35,0.30)',
        blue: '0 4px 16px rgba(27,79,179,0.25)',
        nav:  '0 -2px 16px rgba(12,30,71,0.08)',
      },
    },
  },
}

export default sharedConfig
