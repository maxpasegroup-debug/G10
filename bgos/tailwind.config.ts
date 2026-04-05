import type { Config } from "tailwindcss";

export default {
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
      },
      boxShadow: {
        glow: "0 0 40px -8px rgba(239, 68, 68, 0.35), 0 0 60px -12px rgba(250, 204, 21, 0.2)",
        "glow-lg":
          "0 0 50px -10px rgba(239, 68, 68, 0.45), 0 0 80px -16px rgba(250, 204, 21, 0.25)",
      },
    },
  },
  plugins: [],
} satisfies Config;
