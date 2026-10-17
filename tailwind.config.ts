import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#30392a",
        paper: "#f7f8f1",
        teal: { 50: "#eef2e6", 100: "#dfe7d2", 500: "#809366", 600: "#62784d", 700: "#4b603b" },
        sun: "#e8cd82",
        coral: "#c87860",
        clay: "#a85f49",
      },
      borderRadius: { card: "0.5rem" },
      fontFamily: { sans: ["var(--font-geist-sans)", "Noto Sans Devanagari", "sans-serif"] },
      boxShadow: { soft: "0 4px 16px rgba(48, 57, 42, 0.06)" },
    },
  },
  plugins: [],
};

export default config;