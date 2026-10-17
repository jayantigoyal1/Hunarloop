import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#193a3d",
        paper: "#f4faf8",
        teal: { 50: "#e9f7f4", 100: "#ccece5", 500: "#168a7e", 600: "#087568", 700: "#075d55" },
        sun: "#e8cd82",
        coral: "#c87860",
        clay: "#a85f49",
      },
      borderRadius: { card: "0.5rem" },
      fontFamily: { sans: ["var(--font-geist-sans)", "Noto Sans Devanagari", "sans-serif"] },
      boxShadow: { soft: "0 4px 16px rgba(25, 58, 61, 0.06)" },
    },
  },
  plugins: [],
};

export default config;
