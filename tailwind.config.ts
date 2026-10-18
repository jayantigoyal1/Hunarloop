import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#173f32",
        paper: "#fbfaf2",
        teal: { 50: "#edf2e5", 100: "#dce7d3", 500: "#4f7b64", 600: "#386550", 700: "#285744", 800: "#1e4637" },
        sun: "#efd477",
        coral: "#c87860",
        clay: "#a85f49",
      },
      borderRadius: { card: "1.5rem" },
      fontFamily: { sans: ["var(--font-geist-sans)", "Noto Sans Devanagari", "sans-serif"] },
      boxShadow: { soft: "0 10px 32px rgba(23, 63, 50, 0.07)" },
    },
  },
  plugins: [],
};

export default config;
