import type { Config } from 'tailwindcss'

const sharedConfig: Partial<Config> = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // ── Brand palette — locked to the MABELE logo identity ──
        background: '#0E0E0E',
        foreground: '#F0EDE8',
        primary: {
          DEFAULT: '#C85C20',   // burnt orange — logo mark color
          foreground: '#EDE8DE',
        },
        secondary: {
          DEFAULT: '#BB902A',   // warm gold — secondary accent
          foreground: '#EDE8DE',
        },
        muted: {
          DEFAULT: '#1A1A18',
          foreground: '#8A8A80',
        },
        border: '#2A2A26',
        card: '#161612',
        cream: '#EDE8DE',       // warm cream — light surface

        // ── Module accent colors ──
        'color-immo': '#BB902A',    // gold — real estate, premium
        'color-emploi': '#26C6DA',  // cyan — opportunity
        'color-marche': '#FF5252',  // red — commerce
        'color-agri': '#00C853',    // green — agriculture
        'color-nkisi': '#B388FF',   // purple — tools
        'color-congo': '#448AFF',   // blue — data
        'color-kanga': '#FFB300',   // amber — money
        'color-bima': '#FF4081',    // pink — health
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
      },
      borderRadius: {
        card: '16px',
        sm: '10px',
        hero: '24px',
      },
    },
  },
}

export default sharedConfig
