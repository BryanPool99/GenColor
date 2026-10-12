/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          light: '#ffffff',
          dark: '#1e293b',
        },
        background: {
          light: '#f8fafc',
          dark: '#0f172a',
        },
      },
    },
  },
  plugins: [],
}