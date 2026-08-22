/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#F0F9FF',
          100: '#E0F2FE',
          200: '#BAE6FD',
          300: '#7DD3FC',
          400: '#38BDF8',
          500: '#00ABE4', // Dayflow Primary Blue
          600: '#0284C7',
          700: '#0369A1',
          800: '#075985',
          900: '#0C4A6E',
          light: '#E9F1FA',
          card: '#F5FAFD',
          dark: '#1F2937',
        }
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          '"Segoe UI"',
          'Roboto',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
      },
      boxShadow: {
        'soft': '0 2px 10px rgba(0, 171, 228, 0.06), 0 1px 3px rgba(0, 0, 0, 0.04)',
        'soft-lg': '0 10px 25px -5px rgba(0, 171, 228, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
        'card': '0 4px 20px -2px rgba(15, 23, 42, 0.05)',
      }
    },
  },
  plugins: [],
}
