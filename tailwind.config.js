/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        // Map standard Tailwind keys to our Dynamic CSS Variables
        sans: ["var(--body-font)", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["var(--title-font)", "ui-serif", "Georgia", "serif"],
        display: ["var(--title-font)", "ui-serif", "Georgia", "serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      colors: {
        // Marketing Palette
        marketing: {
          primary: "var(--marketing-color-primary)",
          "primary-hover": "var(--marketing-color-primary-hover)",
          accent: "var(--marketing-color-accent)",
        },
        // Builder Palette
        builder: {
          primary: "var(--builder-color-primary)",
          surface: "var(--builder-color-surface)",
          border: "var(--builder-color-border)",
          text: "var(--builder-color-text)",
        },
      },
    },
  },
  plugins: [],
};
