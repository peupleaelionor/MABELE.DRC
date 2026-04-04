import type { Config } from 'tailwindcss'

const sharedConfig: Partial<Config> = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#08080C',
        foreground: '#F0F0F0',
        primary: {
          DEFAULT: '#D4A017',
          foreground: '#08080C',
        },
        secondary: {
          DEFAULT: '#006400',
          foreground: '#F0F0F0',
        },
        muted: {
          DEFAULT: '#1A1A24',
          foreground: '#9090A0',
        },
        border: '#2A2A3A',
        card: '#12121C',
        // Module colors
        'color-immo': '#D4A017',
        'color-emploi': '#26C6DA',
        'color-marche': '#FF5252',
        'color-agri': '#00C853',
        'color-nkisi': '#B388FF',
        'color-congo': '#448AFF',
        'color-kanga': '#FFB300',
        'color-bima': '#FF4081',
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
