import type { Config } from "tailwindcss";

/**
 * Aegus Digital — Tailwind config
 * Palette D Monochrome + Heat (LOCKED 2026-04-11 02:19 EDT).
 * Base #08090a, white mark, #f97316 orange on CTAs ONLY.
 * NO cyan/teal/green anywhere — status greens/reds only on data, never decorative.
 */
const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Canonical Palette D — Monochrome + Heat (locked 2026-04-11 02:19 EDT)
        // per project_aegus_palette_canonical.md memory file.
        canvas: "#08090a",   // --bg
        panel: "#0f1015",    // --bg-alt (was #0f1011 — corrected 2026-04-11 16:30)
        fg: {
          DEFAULT:  "#ffffff", // --fg — pure white, not off-white
          dim:      "#9ca3af", // --fg-dim
        },
        heat: {
          DEFAULT:  "#f97316", // --accent — ONLY on interactive elements
          hover:    "#fb923c", // --accent-hover (was #fb8b3c — corrected)
        },
        // Status colors — NEVER decorative, only data-widgets
        status: {
          success: "#10b981",
          warning: "#f59e0b",
          error:   "#ef4444",
        },
      },
      fontFamily: {
        sans: [
          "Inter Variable",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
        mono: [
          "Berkeley Mono",
          "IBM Plex Mono",
          "JetBrains Mono",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "monospace",
        ],
      },
      fontSize: {
        // Display sizes with aggressive negative letter-spacing (Linear-style)
        "display-hero":  ["72px", { letterSpacing: "-1.584px", lineHeight: "1.00", fontWeight: "510" }],
        "display-large": ["64px", { letterSpacing: "-1.408px", lineHeight: "1.00", fontWeight: "510" }],
        "display":       ["48px", { letterSpacing: "-1.056px", lineHeight: "1.00", fontWeight: "510" }],
        "h1":            ["32px", { letterSpacing: "-0.704px", lineHeight: "1.13", fontWeight: "400" }],
        "h2":            ["24px", { letterSpacing: "-0.288px", lineHeight: "1.33", fontWeight: "400" }],
        "h3":            ["20px", { letterSpacing: "-0.24px",  lineHeight: "1.33", fontWeight: "590" }],
        "body-lg":       ["18px", { lineHeight: "1.60", fontWeight: "400" }],
        "body":          ["16px", { lineHeight: "1.50", fontWeight: "400" }],
        "body-ui":       ["16px", { lineHeight: "1.50", fontWeight: "510" }],
        "small":         ["15px", { lineHeight: "1.60", fontWeight: "400" }],
        "caption":       ["13px", { lineHeight: "1.50", fontWeight: "510" }],
        "label":         ["12px", { lineHeight: "1.40", fontWeight: "510", letterSpacing: "0.15em" }],
      },
      boxShadow: {
        // Canonical --border 0.08 and --border-strong 0.16 per palette memory
        "border":          "0 0 0 1px rgba(255,255,255,0.08)",
        "border-strong":   "0 0 0 1px rgba(255,255,255,0.16)",
        "card-rest":       "0 0 0 1px rgba(255,255,255,0.08), 0 2px 2px rgba(0,0,0,0.4)",
        "card-hover":      "0 0 0 1px rgba(255,255,255,0.16), 0 2px 2px rgba(0,0,0,0.4), 0 8px 8px -8px rgba(0,0,0,0.5)",
      },
      backgroundColor: {
        // Card surfaces per canonical memory
        "card":       "rgba(255,255,255,0.03)",
        "card-hover": "rgba(255,255,255,0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
