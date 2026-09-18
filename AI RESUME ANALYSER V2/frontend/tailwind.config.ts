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
        background: "#06080F",
        surface: {
          50: "#1A2035",
          100: "#131828",
          200: "#0E1320",
          300: "#0A0E18",
          400: "#06080F",
        },
        aurora: {
          cyan: "#00F2FE",
          blue: "#4FACFE",
          indigo: "#6366F1",
          violet: "#8B5CF6",
          emerald: "#10B981",
          amber: "#F59E0B",
          rose: "#F43F5E",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.4)",
        "glass-inner": "inset 0 1px 0 0 rgba(255, 255, 255, 0.12)",
        "glow-cyan": "0 0 25px -5px rgba(0, 242, 254, 0.3)",
        "glow-indigo": "0 0 30px -5px rgba(99, 102, 241, 0.3)",
      },
      animation: {
        "aurora-pulse": "aurora-pulse 12s ease-in-out infinite alternate",
        "shimmer": "shimmer 2.5s infinite linear",
      },
      keyframes: {
        "aurora-pulse": {
          "0%": { opacity: "0.25", transform: "scale(1) translate(0px, 0px)" },
          "50%": { opacity: "0.45", transform: "scale(1.08) translate(15px, -10px)" },
          "100%": { opacity: "0.3", transform: "scale(0.95) translate(-10px, 15px)" },
        },
        "shimmer": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(200%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
