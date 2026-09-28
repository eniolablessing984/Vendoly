/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '1rem',
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1f6feb',
          600: '#1e56d6',
          700: '#173bb0'
        },
        accent: '#ff7a59',
        neutral: {
          100: '#f7fafc',
          300: '#cbd5e1',
          700: '#334155'
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', ' -apple-system', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial'],
      }
    },
  },
  plugins: [],
}
