// Design tokens for ScanPay following the design brief
export const designTokens = {
  colors: {
    primary: {
      50: "#fdf2f8",
      500: "#be123c", // Primary rose color
      600: "#a21caf",
      900: "#881337",
    },
    accent: {
      500: "#ec4899", // Bright pink accent
      600: "#db2777",
    },
    neutral: {
      50: "#ffffff",
      100: "#fdf2f8", // Light pink
      500: "#475569", // Dark slate
      900: "#0f172a",
    },
  },
  typography: {
    fontFamily: {
      sans: ["DM Sans", "system-ui", "sans-serif"],
    },
    fontSize: {
      xs: "0.75rem",
      sm: "0.875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem",
      "5xl": "3rem",
      "6xl": "3.75rem",
    },
  },
  spacing: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    "2xl": "3rem",
  },
  borderRadius: {
    sm: "0.25rem",
    md: "0.5rem",
    lg: "0.75rem",
    xl: "1rem",
  },
} as const

export type DesignTokens = typeof designTokens
