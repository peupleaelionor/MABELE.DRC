import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'
import sharedConfig from '../../packages/config/tailwind'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    '../../packages/shared/constants/**/*.ts',
    '../../packages/shared/utils/**/*.ts',
  ],
  presets: [sharedConfig as Config],
  theme: {
    extend: {
      // Web-only additions: animations/keyframes not needed in shared config
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
