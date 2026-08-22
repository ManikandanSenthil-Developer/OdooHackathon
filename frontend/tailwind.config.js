/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#E9F1FA",
          100: "#D0E4F7",
          200: "#A4CBF0",
          300: "#6CB0E8",
          400: "#2F95E0",
          500: "#00ABE4", // Dayflow Primary Blue
          600: "#008EC4",
          700: "#00709E",
          800: "#005476",
          900: "#003950",
        },
      },
      backgroundImage: {
        "dayflow-hero":
          "linear-gradient(135deg, #F8FAFC 0%, #E9F1FA 50%, #FFFFFF 100%)",
      },
    },
  },
  plugins: [],
};
