// eslint-disable-next-line @typescript-eslint/no-var-requires
const colors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],

  content: [
    // NextJS
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",

    // Plasmo
    "./src/contents/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/popup/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    extend: {
      colors: {
        border: colors.gray[200],
        input: colors.indigo[600],
        ring: colors.indigo[600],
        background: colors.gray[100],
        foreground: colors.gray[800],
        primary: {
          DEFAULT: colors.indigo[600],
          foreground: colors.gray[100],
        },
        secondary: {
          DEFAULT: colors.indigo[100],
          foreground: colors.indigo[600],
        },
        destructive: {
          DEFAULT: colors.red[600],
          foreground: colors.gray[100],
        },
        muted: {
          DEFAULT: colors.gray[200],
          foreground: colors.gray[700],
        },
        accent: {
          DEFAULT: colors.indigo[100],
          foreground: colors.indigo[600],
        },
        popover: {
          DEFAULT: colors.white,
          foreground: colors.gray[700],
        },
        card: {
          DEFAULT: colors.white,
          foreground: colors.indigo[600],
        },
      },
      borderRadius: {
        lg: `0.8rem`,
        md: `calc(0.8rem - 2px)`,
        sm: "calc(0.8rem - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },

  // @ts-expect-error: missing types
  plugins: [require("tailwindcss-animate")],
};
