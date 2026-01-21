/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef2ff',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
        },
        secondary: {
          50: '#f9fafb',
          100: '#f3f4f6',
          500: '#6b7280',
          600: '#4b5563',
        }
      }
    },
  },
  plugins: [],
}