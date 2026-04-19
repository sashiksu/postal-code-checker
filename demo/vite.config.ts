import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  // Deployed at https://sashiksu.github.io/postal-code-checker/ — the GitHub
  // Pages workflow sets VITE_BASE=/postal-code-checker/ at build time.
  // Dev server falls through to "/".
  base: process.env.VITE_BASE ?? "/",
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
});
