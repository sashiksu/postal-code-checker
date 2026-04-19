import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Import the library source directly — HMR on lib changes without a rebuild.
      // Replaces the old dev/ playground's webpack setup.
      "postal-code-checker": path.resolve(root, "../src/index.ts"),
    },
  },
  server: {
    port: 5173,
    open: true,
  },
  css: {
    preprocessorOptions: {
      scss: {
        // Silence "legacy-js-api" spam — opts into the modern Sass JS API.
        api: "modern-compiler",
      },
    },
  },
});
