/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Space Grotesk', 'sans-serif'],
      },
      colors: {
        'kryv-cyan': 'hsl(188, 100%, 50%)',
        'kryv-bg-dark': 'hsl(240, 10%, 3.9%)',
        'kryv-panel-dark': 'hsl(240, 6%, 10%)',
        'kryv-border': 'hsl(240, 5%, 18%)',
        'kryv-text-primary': 'hsl(0, 0%, 98%)',
        'kryv-text-secondary': 'hsl(240, 5%, 65%)',
      },
       animation: {
        shimmer: 'shimmer 2s linear infinite'
      },
      keyframes: {
        shimmer: {
          from: { backgroundPosition: '0 0' },
          to: { backgroundPosition: '-200% 0' },
        },
      },
    },
  },
  plugins: [],
}
