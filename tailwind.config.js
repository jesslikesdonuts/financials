/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#0b0f14',
          900: '#10161d',
          800: '#161d26',
          700: '#1e2733',
          600: '#2a3644',
          500: '#3d4c5e',
        },
      },
    },
  },
  plugins: [],
}
