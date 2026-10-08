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
      boxShadow: {
        soft: "0 2px 10px rgba(20,20,20,0.04)",
        card: "0 10px 30px -10px rgba(20,20,20,0.08)",
        "card-hover": "0 25px 50px -15px rgba(20,20,20,0.18)",
        elevated: "0 20px 60px -15px rgba(20,20,20,0.15)",
        glow: "0 0 0 1px rgb(var(--color-accent-rgb) / 0.12), 0 15px 40px -10px rgb(var(--color-accent-rgb) / 0.25)",
      },
      keyframes: {
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "pulse-ring": {
          "0%": { boxShadow: "0 0 0 0 rgba(37,211,102,0.45)" },
          "70%": { boxShadow: "0 0 0 14px rgba(37,211,102,0)" },
          "100%": { boxShadow: "0 0 0 0 rgba(37,211,102,0)" },
        },
      },
      animation: {
        shimmer: "shimmer 1.6s infinite",
        marquee: "marquee 22s linear infinite",
        "pulse-ring": "pulse-ring 2.2s cubic-bezier(0.4,0,0.6,1) infinite",
      },
      letterSpacing: {
        wider2: "0.2em",
      },
      transitionTimingFunction: {
        premium: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};
