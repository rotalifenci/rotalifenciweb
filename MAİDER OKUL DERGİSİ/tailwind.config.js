/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        maider: {
          navy: '#0F172A',
          dark: '#1E293B',
          cream: '#FDFBF7',
          warmWhite: '#F8F6F0',
          turkuaz: '#0EA5E9',
          mor: '#8B5CF6',
          turuncu: '#EA580C',
          yesil: '#10B981',
          bordo: '#991B1B',
          altin: '#D97706',
        }
      },
      fontFamily: {
        editorial: ['"Playfair Display"', 'Merriweather', 'Georgia', 'serif'],
        serifDisplay: ['"DM Serif Display"', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        accent: ['Montserrat', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'editorial': '0 20px 40px -15px rgba(15, 23, 42, 0.15), 0 0 1px 1px rgba(15, 23, 42, 0.05)',
        'magazine': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      },
      aspectRatio: {
        'a4': '1 / 1.4142',
        'digital': '9 / 16',
      }
    },
  },
  plugins: [],
}
