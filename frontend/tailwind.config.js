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
          DEFAULT: '#001F3F', // Deep Blue
          light: '#003366',
          dark: '#001429',
        },
        secondary: {
          DEFAULT: '#F5F7FA', // Light Grayish Blue
          light: '#F8FAFC',
          dark: '#E2E8F0',
        },
        accent: {
          DEFAULT: '#3B82F6', // Blue
        }
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
