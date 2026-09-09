/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1a1a1a",
        secondary: "#efede9",
        border: "#d9cfbd",
        accent: "#142e25",
        "accent-light": "#1f4236",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        serif: ["Literata", "serif"],
      },
      maxWidth: {
        container: "1400px",
      },
    },
  },
  plugins: [],
};
