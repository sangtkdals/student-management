import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // '/api'로 시작하는 요청은 http://localhost:8080 으로 전달
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
});
