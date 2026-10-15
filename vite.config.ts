import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import netlify from "@netlify/vite-plugin-tanstack-start";

export default defineConfig(({ command }) => ({
 plugins: [
  tailwindcss(),
  tsConfigPaths({ projects: ["./tsconfig.json"] }),
  tanstackStart(),
  netlify(),
  react(),
],
  resolve: {
    dedupe: ["react", "react-dom", "@tanstack/react-router", "@tanstack/react-start"],
  },
}));
