// eslint-disable-next-line @typescript-eslint/no-var-requires
const colors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
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
        background: colors.white,
        foreground: colors.slate[950],

        input: colors.slate[200],
        border: colors.slate[200],
        ring: colors.slate[400],

        primary: {
          DEFAULT: colors.indigo[600],
          foreground: colors.slate[50],
        },
        secondary: {
          DEFAULT: colors.slate[100],
          foreground: colors.slate[900],
        },

        accent: {
          DEFAULT: colors.slate[100],
          foreground: colors.slate[900],
        },
        muted: {
          DEFAULT: colors.slate[100],
          foreground: colors.slate[500],
        },
        destructive: {
          DEFAULT: colors.red[500],
          foreground: colors.slate[50],
        },

        card: {
          DEFAULT: colors.white,
          foreground: colors.slate[900],
        },
        popover: {
          DEFAULT: colors.white,
          foreground: colors.slate[900],
        },
      },
      borderRadius: {
        lg: "0.75rem",
        md: "calc(0.75rem - 2px)",
        sm: "calc(0.75rem - 4px)",
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
