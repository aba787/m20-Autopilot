import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Tajawal', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#eef5ff',
          100: '#d9e8ff',
          200: '#bcd7ff',
          300: '#8ebeff',
          400: '#599bff',
          500: '#3374ff',
          600: '#1b53f5',
          700: '#143ee1',
          800: '#1733b6',
          900: '#19308f',
          950: '#141f57',
        }
      }
    },
  },
  plugins: [],
}
export default config
