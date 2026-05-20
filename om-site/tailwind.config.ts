import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy:   "#1A1A2E",
        purple: "#2D1060",
        violet: "#8B5CF6",
        orange: "#F97316",
        cream:  "#F0EDF8",
        muted:  "#E8E0F5",
      },
      fontFamily: {
        sans:  ["var(--font-sans)", "sans-serif"],
        mono:  ["var(--font-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
