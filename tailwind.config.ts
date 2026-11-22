import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        night: {
          950: "#05070c",
          900: "#080c14",
          800: "#0d1320",
          700: "#121a2b",
          600: "#1a2438",
          500: "#243049",
        },
        accent: {
          DEFAULT: "#22d3ee",
          dim: "#0891b2",
          glow: "rgba(34, 211, 238, 0.18)",
        },
        mint: {
          DEFAULT: "#34d399",
          dim: "#059669",
        },
        background: "rgb(var(--ds-color-bg) / <alpha-value>)",
        surface: {
          DEFAULT: "rgb(var(--ds-color-surface) / <alpha-value>)",
          raised: "rgb(var(--ds-color-raised) / <alpha-value>)",
          overlay: "rgb(var(--ds-color-overlay) / <alpha-value>)",
        },
        foreground: "rgb(var(--ds-color-fg) / <alpha-value>)",
        muted: "rgb(var(--ds-color-muted) / <alpha-value>)",
        subtle: "rgb(var(--ds-color-subtle) / <alpha-value>)",
        primary: {
          DEFAULT: "rgb(var(--ds-color-primary) / <alpha-value>)",
          hover: "rgb(var(--ds-color-primary-hover) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "rgb(var(--ds-color-secondary) / <alpha-value>)",
          hover: "rgb(var(--ds-color-secondary-hover) / <alpha-value>)",
        },
        success: "rgb(var(--ds-color-success) / <alpha-value>)",
        danger: "rgb(var(--ds-color-danger) / <alpha-value>)",
        warning: "rgb(var(--ds-color-warning) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["var(--ds-font-sans)"],
        mono: ["var(--ds-font-mono)"],
      },
      fontSize: {
        caption: ["var(--ds-text-caption)", { lineHeight: "1rem", letterSpacing: "0.01em" }],
        footnote: ["var(--ds-text-footnote)", { lineHeight: "1.125rem" }],
        body: ["var(--ds-text-body)", { lineHeight: "1.35rem", letterSpacing: "-0.01em" }],
        callout: ["var(--ds-text-callout)", { lineHeight: "1.375rem" }],
        headline: [
          "var(--ds-text-headline)",
          { lineHeight: "1.375rem", letterSpacing: "-0.022em", fontWeight: "600" },
        ],
        "title-3": [
          "var(--ds-text-title-3)",
          { lineHeight: "1.55rem", letterSpacing: "-0.022em", fontWeight: "600" },
        ],
        "title-2": [
          "var(--ds-text-title-2)",
          { lineHeight: "1.75rem", letterSpacing: "-0.022em", fontWeight: "600" },
        ],
        "title-1": [
          "var(--ds-text-title-1)",
          { lineHeight: "2.125rem", letterSpacing: "-0.022em", fontWeight: "700" },
        ],
        large: [
          "var(--ds-text-large)",
          { lineHeight: "2.5rem", letterSpacing: "-0.025em", fontWeight: "700" },
        ],
      },
      fontWeight: {
        regular: "var(--ds-weight-regular)",
        medium: "var(--ds-weight-medium)",
        semibold: "var(--ds-weight-semibold)",
        bold: "var(--ds-weight-bold)",
      },
      spacing: {
        "ds-1": "var(--ds-space-1)",
        "ds-2": "var(--ds-space-2)",
        "ds-3": "var(--ds-space-3)",
        "ds-4": "var(--ds-space-4)",
        "ds-5": "var(--ds-space-5)",
        "ds-6": "var(--ds-space-6)",
        "ds-8": "var(--ds-space-8)",
        "ds-10": "var(--ds-space-10)",
        "ds-12": "var(--ds-space-12)",
      },
      borderRadius: {
        "ds-sm": "var(--ds-radius-sm)",
        "ds-md": "var(--ds-radius-md)",
        "ds-lg": "var(--ds-radius-lg)",
        "ds-xl": "var(--ds-radius-xl)",
      },
      borderWidth: {
        ds: "var(--ds-stroke)",
      },
      boxShadow: {
        glow: "0 0 40px rgba(34, 211, 238, 0.08)",
        card: "0 18px 40px rgba(0, 0, 0, 0.35)",
        "ds-sm": "var(--ds-shadow-sm)",
        "ds-md": "var(--ds-shadow-md)",
        "ds-lg": "var(--ds-shadow-lg)",
        "ds-focus": "var(--ds-shadow-focus)",
      },
      transitionTimingFunction: {
        ds: "var(--ds-ease)",
      },
      transitionDuration: {
        ds: "var(--ds-duration)",
      },
    },
  },
  plugins: [],
};

export default config;
