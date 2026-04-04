import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    '../../packages/shared/**/*.{ts,tsx}',
  ],
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
        immo: '#D4A017',
        emploi: '#26C6DA',
        marche: '#FF5252',
        agri: '#00C853',
        nkisi: '#B388FF',
        congo: '#448AFF',
        kanga: '#FFB300',
        bima: '#FF4081',
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
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        shimmer: 'shimmer 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [typography],
}

export default config
