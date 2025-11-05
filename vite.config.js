import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy all API routes to backend during development
      "/api": {
        target: "http://14.225.205.215",
        changeOrigin: true,
        secure: false, // dev cert tự ký → để false
      },
      "/chats": {
        target: "http://14.225.205.215",
        changeOrigin: true,
        secure: false,
      },
      // Routes without /api prefix (Dashboard, Feedback, etc.)
      "/Dashboard": {
        target: "https://localhost:7077",
        changeOrigin: true,
        secure: false,
      },
      "/Feedback": {
        target: "https://localhost:7077",
        changeOrigin: true,
        secure: false,
      },
      // mọi request bắt đầu bằng /ai sẽ được forward sang backend
      "/ai": {
        target: "https://localhost:7077", // đổi đúng port HTTPS backend của bạn
        changeOrigin: true,
        secure: false, // dev cert tự ký → để false
      },
      "/messages": {
        target: "http://14.225.205.215",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
