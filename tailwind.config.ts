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
        // NOTE: These color values are user-customizable in the future
        // Current theme uses GitHub dark inspired palette with #2596be as primary
        
        // Background colors
        background: "#ffffff",
        surface: "#ffffff",
        "surface-alt": "#f6f8fa",
        // Primary colors (GitHub dark blue)
        primary: "#2596be",
        "primary-soft": "#58a8c7",
        // Accent colors
        accent: "#2596be",
        "accent-soft": "#58a8c7",
        // Semantic colors
        success: "#28a745",
        warning: "#ffc107",
        danger: "#dc3545",
        // Neutral colors
        muted: "#6c757d",
        border: "#e1e4e8",
      },
    },
  },
  plugins: [],
};

export default config;

