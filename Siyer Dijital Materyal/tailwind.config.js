/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        desert: {
          50: '#fdfbf7',
          100: '#f7f1e5',
          200: '#eddcc5',
          300: '#dfc09c',
          400: '#cca072',
          500: '#ba8551',
          600: '#a36d41',
          700: '#835436',
          800: '#6d4532',
          900: '#5a3b2c',
        },
        islamic: {
          gold: '#d4af37',
          amber: '#f59e0b',
          emerald: '#10b981',
          navy: '#0f172a',
          sand: '#d7c49e',
          ruby: '#b91c1c',
          turquoise: '#0d9488'
        }
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      }
    },
  },
  plugins: [],
}
