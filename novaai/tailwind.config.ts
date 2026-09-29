import type { Config } from 'tailwindcss'

const inter = ['Inter', 'system-ui', 'sans-serif']

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: inter,
        mono: inter,
      },
    },
  },
  plugins: [],
} satisfies Config
