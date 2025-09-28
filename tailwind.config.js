// tailwind.config.js
import { nextui } from "@nextui-org/react";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  darkMode: "class",
  theme: {
    extend: {},
  },
  plugins: [
    nextui({
      themes: {
        light: {
          colors: {
            default: "#6b7280",
            primary: "#3b82f6", 
            secondary: "#8b5cf6",
            success: "#10b981",
            warning: "#f59e0b",
            danger: "#ef4444",
          },
        },
        dark: {
          colors: {
            default: "#9ca3af",
            primary: "#60a5fa",
            secondary: "#a78bfa", 
            success: "#34d399",
            warning: "#fbbf24",
            danger: "#f87171",
          },
        },
      },
    }),
  ],
};