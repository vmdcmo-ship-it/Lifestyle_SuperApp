/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#FDB813", // gold - đồng bộ Mobile App
        "lifestyle-gold": "#FDB813",
        "lifestyle-purple": "#2E1A47",
        "lifestyle-red": "#DC143C",
      },
      fontFamily: {
        sans: ["-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
    },
  },
  plugins: [],
};
