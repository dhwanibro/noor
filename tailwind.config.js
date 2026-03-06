/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ivory:        '#FAF8F5',
        surface:      '#FFFFFF',
        border:       '#EDE8E0',
        charcoal:     '#1A1814',
        terra:        '#B85C38',
        'terra-light':'#F5EDE8',
        'terra-mid':  '#D4856A',
        gold:         '#C9A84C',
        'gold-light': '#F7F0DC',
        sage:         '#3A7D5C',
        'sage-light': '#EBF4EF',
        ink:          '#1C1917',
        sub:          '#57534E',
        muted:        '#A8A29E',
        stone:        '#EDE8E0',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        body:    ['"DM Sans"', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.25rem',
        '4xl': '1.5rem',
      },
      animation: {
        'fade-up': 'fadeUp 0.35s ease both',
        'fade-in': 'fadeIn 0.25s ease both',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
