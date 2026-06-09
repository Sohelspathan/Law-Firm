import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#07091A',
          900: '#0B0F1F',
          800: '#111527',
          700: '#1A1F35',
          600: '#252B47',
          500: '#323A5C',
          400: '#4A5480',
        },
        gold: {
          300: '#E2C97A',
          400: '#D4B96A',
          500: '#C9A55A',
          600: '#B8943E',
          700: '#9A7A28',
        },
        cream: {
          50: '#FDFBF8',
          100: '#F9F4EC',
          200: '#F4EFE6',
          300: '#EDE5D8',
        },
        warm: {
          400: '#9B98B0',
          500: '#8B8FA8',
          600: '#6B6F88',
        },
      },
      fontFamily: {
        display: ['var(--font-cormorant)', 'Georgia', 'serif'],
        body: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        '7xl': ['4.5rem', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        '8xl': ['6rem', { lineHeight: '1', letterSpacing: '-0.03em' }],
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.4s ease-out forwards',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #C9A55A 0%, #D4B96A 50%, #B8943E 100%)',
        'navy-gradient': 'linear-gradient(180deg, #0B0F1F 0%, #111527 100%)',
      },
    },
  },
  plugins: [],
}

export default config
