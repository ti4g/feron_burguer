import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        void: "#050505",
        onyx: "#0A0A0A",
        amber: {
          brand: "#E8A33D",
          deep: "#C8860A",
        },
      },
      fontFamily: {
        sans: ['"DM Sans"', "system-ui", "sans-serif"],
        display: ["Syne", "system-ui", "sans-serif"],
      },
      dropShadow: {
        legible: "0 2px 12px rgba(0,0,0,0.9)",
      },
    },
  },
  plugins: [],
};

export default config;
