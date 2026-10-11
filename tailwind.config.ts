import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        maroon: {
          50: "#FAF0F3",
          100: "#F5DFE6",
          200: "#ECC0CD",
          300: "#DE99AD",
          400: "#CA6A87",
          500: "#A9385C",
          600: "#912347",
          700: "#7A1735", // Deep Maroon
          800: "#65142D",
          900: "#4D1023",
          950: "#2B0612",
        },
        ivory: {
          DEFAULT: "#FFF9F2", // Warm Ivory
          50: "#FFFFFF",
          100: "#FFFDFB",
          200: "#FFF9F2",
          300: "#F7EFE4",
          400: "#EFE2D2",
        },
        gold: {
          DEFAULT: "#C8A45D", // Gold accent
          100: "#F6F1E3",
          200: "#ECDDBB",
          300: "#DEC48B",
          400: "#D3B26F",
          500: "#C8A45D",
          600: "#AB863E",
          700: "#89672E",
        },
        dark: {
          DEFAULT: "#29252A", // Dark text
          muted: "#6B626E",
          surface: "#1A171B",
        },
      },
      fontFamily: {
        inter: ["var(--font-inter)", "Inter", "sans-serif"],
        bengali: ["var(--font-hind)", "'Hind Siliguri'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
