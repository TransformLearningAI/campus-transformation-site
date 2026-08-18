/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0C1F3F',
          light:   '#1a3560',
          dark:    '#071429',
        },
        brand: {
          teal:    '#00A8A8',
          green:   '#4F8A5B',
          purple:  '#5A3E6B',
          coral:   '#FF6B4A',
          mist:    '#F4F7FB',
          soft:    '#F9FBFD',
          gray:    '#5F7691',
          border:  '#DDE5EF',
          text:    '#1A2B3C',
          ink:     '#1A2B3C',
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans:  ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s ease-out',
      },
    },
  },
  plugins: [],
}
