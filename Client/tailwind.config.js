/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      screens: {
        xs: "480px",
      },
      colors: {
        primary: "rgb(var(--color-primary-rgb) / <alpha-value>)",
        secondary: "rgb(var(--color-secondary-rgb) / <alpha-value>)",
        border: "rgb(var(--color-border-rgb) / <alpha-value>)",
        accent: "rgb(var(--color-accent-rgb) / <alpha-value>)",
        "accent-light": "rgb(var(--color-accent-light-rgb) / <alpha-value>)",
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
