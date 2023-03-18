/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      keyframes: {
        slideDownAndFade: {
          from: { opacity: 0, transform: 'translateY(-2px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        slideLeftAndFade: {
          from: { opacity: 0, transform: 'translateX(2px)' },
          to: { opacity: 1, transform: 'translateX(0)' },
        },
        slideUpAndFade: {
          from: { opacity: 0, transform: 'translateY(2px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        slideRightAndFade: {
          from: { opacity: 0, transform: 'translateX(2px)' },
          to: { opacity: 1, transform: 'translateX(0)' },
        },
      },
      animation: {
        slideDownAndFade: 'slideDownAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
        slideLeftAndFade: 'slideLeftAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
        slideUpAndFade: 'slideUpAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
        slideRightAndFade: 'slideRightAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
      },
      colors: {
        gray: {
          '50': '#f7f7f8',
          '100': '#d9d9e3',
          '200': '#d9d9e3', // Replacing .bg-gray-200
          '300': '#c5c5d2',
          '400': '#acacb1',
          '500': '#8e8ea0',
          '600': '#565869',
          '700': '#40414f', // Replacing .dark .dark:bg-gray-700 and .dark .dark:hover:bg-gray-700:hover
          '800': '#343541', // Replacing .dark .dark:bg-gray-800, .bg-gray-800, and .dark .dark:hover:bg-gray-800\/90
          '900': '#202123' // Replacing .dark .dark:bg-gray-900, .bg-gray-900, and .dark .dark:hover:bg-gray-900:hover
        }
      }
    },
  },
  plugins: [],
}
