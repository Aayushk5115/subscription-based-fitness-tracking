/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        fitness: {
          primary: '#10B981',
          secondary: '#059669',
          dark: '#1F2937',
        }
      }
    },
  },
  plugins: [],
}
