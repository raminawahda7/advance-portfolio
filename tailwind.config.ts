import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Neo-Brutalist Gallery palette — driven by CSS vars for theming
        // (values defined in globals.css :root / html.dark).
        bg: "var(--bg)", // page background
        ink: "var(--line)", // borders, rules, hard shadows
        "text-primary": "var(--fg)", // main text
        "text-secondary": "var(--muted)", // body text
        accent: "var(--accent)", // vibrant neon pink/red
        // Legacy token aliases (kept so existing class refs still resolve).
        "accent-blue": "var(--line)",
        grid: "var(--line)",
      },
      fontFamily: {
        // Syne (extra bold) for headings; Space Grotesk for body + metadata.
        heading: ["var(--font-syne)", "system-ui", "sans-serif"],
        sans: ["var(--font-space-grotesk)", "system-ui", "sans-serif"],
        mono: ["var(--font-space-grotesk)", "ui-monospace", "monospace"],
      },
      borderRadius: {
        none: "0px",
        sm: "2px",
      },
      backgroundImage: {
        blueprint:
          "linear-gradient(to right, var(--blueprint) 1px, transparent 1px), linear-gradient(to bottom, var(--blueprint) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};

export default config;
