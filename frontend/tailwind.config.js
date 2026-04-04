/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#ecfdf3',
          100: '#d1fadf',
          200: '#a6f4c5',
          300: '#6ce9a6',
          400: '#32d583',
          500: '#12b76a', // Base accent
          600: '#039855',
          700: '#027a48',
          800: '#0f3d30', // Deep dashboard green (UI reference focal color)
          900: '#052e16',
        },
        dark: {
          50: '#f4f7f4', // Soft pale green-tinted white for the main app background
          100: '#eef2ee',
          200: '#d8e0d8',
          300: '#bbc5b9',
          400: '#94a192',
          500: '#738371',
          600: '#586757',
          700: '#465345',
          800: '#2d362b',
          900: '#151b14', 
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
