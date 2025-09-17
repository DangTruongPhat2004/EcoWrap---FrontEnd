import { heroui } from "@heroui/react";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [
    heroui({
      themes: {
        light: {
          colors: {
            default: "#6b7280", // Màu xám nhạt
            primary: "#3b82f6", // Màu xanh dương
            secondary: "#8b5cf6", // Màu tím
            success: "#10b981", // Màu xanh lá
            warning: "#f59e0b", // Màu vàng/cam
            danger: "#ef4444", // Màu đỏ
          },
        },
        dark: {
          colors: {
            default: "#9ca3af", // Màu xám nhạt cho dark mode
            primary: "#60a5fa", // Màu xanh dương cho dark mode
            secondary: "#a78bfa", // Màu tím cho dark mode
            success: "#34d399", // Màu xanh lá cho dark mode
            warning: "#fbbf24", // Màu vàng/cam cho dark mode
            danger: "#f87171", // Màu đỏ cho dark mode
          },
        },
      },
    }),
  ],
};
