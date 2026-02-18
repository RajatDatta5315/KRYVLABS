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
        'kryv-bg-dark': 'hsl(240, 10%, 4%)',
        'kryv-panel-dark': 'hsl(240, 6%, 8%)',
        'kryv-border-dark': 'hsl(240, 5%, 15%)',
        'kryv-text-dark-primary': 'hsl(0, 0%, 95%)',
        'kryv-text-dark-secondary': 'hsl(0, 0%, 60%)',
      },
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [],
}
