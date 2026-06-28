import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Plus Jakarta Sans", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 32px 0 #2D9CFF80",
        "glow-sm": "0 0 16px 0 #2D9CFF40",
        "glow-red": "0 0 24px 0 #E11B2280",
      },
      animation: {
        float: "float 4s ease-in-out infinite",
        "bubble-rise": "bubbleRise 6s ease-in infinite",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        bubbleRise: {
          "0%": { transform: "translateY(100%) scale(0.8)", opacity: "0" },
          "20%": { opacity: "1" },
          "100%": { transform: "translateY(-200%) scale(1.1)", opacity: "0" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 16px 0 #2D9CFF40" },
          "50%": { boxShadow: "0 0 32px 8px #2D9CFF80" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
