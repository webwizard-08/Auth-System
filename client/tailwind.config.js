/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["DM Serif Display", "serif"],
        body: ["Space Grotesk", "sans-serif"]
      },
      colors: {
        ink: "#151515",
        sand: "#f6f1e7",
        terracotta: "#f2703f",
        cobalt: "#2374ab"
      },
      boxShadow: {
        glass: "0 18px 50px rgba(16, 16, 16, 0.14)"
      },
      borderRadius: {
        xl: "24px"
      }
    }
  },
  plugins: []
};
