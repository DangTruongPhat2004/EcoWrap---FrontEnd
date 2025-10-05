import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // mọi request bắt đầu bằng /ai sẽ được forward sang backend
      "/ai": {
        target: "https://localhost:7077", // đổi đúng port HTTPS backend của bạn
        changeOrigin: true,
        secure: false, // dev cert tự ký → để false
      },
    },
  },
});
