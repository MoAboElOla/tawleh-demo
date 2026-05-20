import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "#8B1E3F",
          dark: "#5E1028",
          foreground: "#FFFFFF",
        },
        saffron: {
          DEFAULT: "#E8A33D",
          dark: "#B47A1F",
          light: "#FFF4DE",
        },
        "bg-light": "#FAF3F5",
        "accent-blush": "#FDEBED",
        "warm-white": "#FFF8F6",
        "text-main": "#1F1A1B",
        "text-muted": "#7A6C6E",
        success: "#2E9E5B",
        "border-soft": "#EDE0E3",
      },
      fontFamily: {
        jakarta: ["Plus Jakarta Sans", "sans-serif"],
        sans: ["Plus Jakarta Sans", "sans-serif"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      boxShadow: {
        soft: "0 2px 16px 0 rgba(139,30,63,0.07)",
        card: "0 4px 24px 0 rgba(139,30,63,0.09)",
        "card-hover": "0 12px 40px 0 rgba(139,30,63,0.18)",
        glow: "0 0 0 4px rgba(139,30,63,0.10), 0 8px 32px 0 rgba(139,30,63,0.14)",
        "saffron-glow": "0 0 0 4px rgba(232,163,61,0.12)",
      },
      keyframes: {
        "blob-drift-1": {
          "0%, 100%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(40px, -60px) scale(1.1)" },
          "66%": { transform: "translate(-30px, 30px) scale(0.95)" },
        },
        "blob-drift-2": {
          "0%, 100%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(-40px, 40px) scale(1.05)" },
          "66%": { transform: "translate(50px, -30px) scale(0.9)" },
        },
        "blob-drift-3": {
          "0%, 100%": { transform: "translate(0px, 0px) scale(1)" },
          "50%": { transform: "translate(-20px, -40px) scale(1.08)" },
        },
        "pulse-dot": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.5", transform: "scale(1.3)" },
        },
      },
      animation: {
        "blob-1": "blob-drift-1 18s ease-in-out infinite",
        "blob-2": "blob-drift-2 22s ease-in-out infinite",
        "blob-3": "blob-drift-3 16s ease-in-out infinite",
        "pulse-dot": "pulse-dot 1.6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
