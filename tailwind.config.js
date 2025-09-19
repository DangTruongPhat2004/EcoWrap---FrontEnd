// tailwind.config.js
import { heroui } from "@heroui/react";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/**/*.{js,ts,jsx,tsx}", // ✅ quét toàn bộ HeroUI
  ],
  darkMode: "class",
  theme: { extend: {} },
  plugins: [
    heroui({
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
