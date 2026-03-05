/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        lab: {
          bg:       '#020408',
          panel:    '#070C12',
          border:   'rgba(0, 210, 180, 0.1)',
          glow:     'rgba(0, 210, 180, 0.06)',
          cyan:     '#00D2B4',
          'cyan-dim': 'rgba(0, 210, 180, 0.15)',
          green:    '#39FF84',
          amber:    '#FFAA00',
          red:      '#FF4444',
          text:     '#C8D8E8',
          muted:    '#4A6070',
          grid:     'rgba(0, 210, 180, 0.04)',
        },
      },
      fontFamily: {
        mono:    ['JetBrains Mono', 'Fira Code', 'monospace'],
        display: ['Syne', 'system-ui', 'sans-serif'],
        body:    ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scan':       'scan 4s linear infinite',
        'blink':      'blink 1.2s step-end infinite',
        'fade-in':    'fadeIn 0.4s ease forwards',
      },
      keyframes: {
        scan: {
          '0%':   { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        blink: {
          '0%, 100%': { opacity: 1 },
          '50%':      { opacity: 0 },
        },
        fadeIn: {
          from: { opacity: 0, transform: 'translateY(8px)' },
          to:   { opacity: 1, transform: 'translateY(0)' },
        },
      },
      backgroundImage: {
        'grid-pattern': `
          linear-gradient(rgba(0,210,180,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,210,180,0.04) 1px, transparent 1px)
        `,
      },
      backgroundSize: {
        'grid': '40px 40px',
      },
    },
  },
  plugins: [],
};
