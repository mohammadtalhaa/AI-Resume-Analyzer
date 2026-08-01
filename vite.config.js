import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base: "./" makes the build use relative asset paths, so it works
// whether it's hosted at the root of a domain or in a GitHub Pages
// project subpath (https://username.github.io/repo-name/) without
// any extra configuration.
export default defineConfig({
  plugins: [react()],
  base: "./",
});
