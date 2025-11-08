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
        // Current theme uses grayscale palette: #252525, #CFCFCF, #7D7D7D, #545454
        
        // Background colors
        background: "#ffffff",
        surface: "#ffffff",
        "surface-alt": "#CFCFCF",
        // Primary colors (using grayscale palette)
        primary: "#252525",
        "primary-soft": "#545454",
        // Accent colors
        accent: "#545454",
        "accent-soft": "#7D7D7D",
        // Semantic colors (grayscale variants)
        success: "#7D7D7D",
        warning: "#545454",
        danger: "#252525",
        // Neutral colors
        muted: "#7D7D7D",
        border: "#CFCFCF",
      },
    },
  },
  plugins: [],
};

export default config;

