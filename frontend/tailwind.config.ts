import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        bluePrimary: "var(--blue-primary)",
        blueLink: "var(--blue-link)",
        blueBackground: "var(--blue-background)",
        whiteAccent: "var(--white-accent)",
        white: "var(--white)",
        whiteBackground: "var(--white-background)",
        blackPrimary: "var(--black-primary)",
        blackSecondary: "var(--black-secondary)",
        blackMuted: "var(--black-muted)",
        blackAccent: "var(--black-accent)",
        blackAccentMuted: "var(--black-accent-muted)",
        border: "var(--border)",
        urgent: "var(--urgent)",
        medium: "var(--medium)",
        low: "var(--low)",
      },

      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
