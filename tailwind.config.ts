import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#173b3a",
        paper: "#fbfaf5",
        teal: { 50: "#e8f5f2", 100: "#d1ebe5", 500: "#168477", 600: "#116d63", 700: "#0d554e" },
        sun: "#f2c45d",
        coral: "#e57c62",
      },
      borderRadius: { card: "1rem" },
      fontFamily: { sans: ["var(--font-geist-sans)", "Noto Sans Devanagari", "sans-serif"] },
      boxShadow: { soft: "0 8px 28px rgba(23, 59, 58, 0.08)" },
    },
  },
  plugins: [],
};

export default config;