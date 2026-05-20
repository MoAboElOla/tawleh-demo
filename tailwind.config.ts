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
        "card-hover": "0 8px 32px 0 rgba(139,30,63,0.14)",
      },
    },
  },
  plugins: [],
};
export default config;
