import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  // Bundle deps into the prerender build so CommonJS packages like
  // react-github-calendar resolve their default exports correctly in Node
  ssr: { noExternal: true },
  build: isSsrBuild ? { outDir: "dist-ssr", copyPublicDir: false } : {},
}));
