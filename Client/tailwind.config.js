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
        sans: ["Outfit", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["Fraunces", "ui-serif", "Georgia", "serif"],
      },
      maxWidth: {
        container: "1440px",
        prose: "720px",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(18,16,14,0.04)",
        card: "0 12px 32px -12px rgba(18,16,14,0.12)",
        "card-hover": "0 24px 48px -16px rgba(18,16,14,0.18)",
        elevated: "0 32px 64px -24px rgba(18,16,14,0.22)",
        glow: "0 0 0 1px rgb(var(--color-accent-rgb) / 0.14), 0 18px 44px -12px rgb(var(--color-accent-rgb) / 0.28)",
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
          "0%": { boxShadow: "0 0 0 0 rgba(37,211,102,0.4)" },
          "70%": { boxShadow: "0 0 0 12px rgba(37,211,102,0)" },
          "100%": { boxShadow: "0 0 0 0 rgba(37,211,102,0)" },
        },
        kenburns: {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(1.06)" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        shimmer: "shimmer 1.6s infinite",
        marquee: "marquee 28s linear infinite",
        "pulse-ring": "pulse-ring 2.6s cubic-bezier(0.4,0,0.6,1) infinite",
        kenburns: "kenburns 14s ease-out forwards",
        "fade-up": "fade-up 0.45s cubic-bezier(0.22,1,0.36,1) both",
      },
      letterSpacing: {
        micro: "0.22em",
        wider2: "0.2em",
      },
      transitionTimingFunction: {
        premium: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};
