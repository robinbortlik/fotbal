import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Relativní cesty: HashRouter má jen jednu stránku, takže web funguje v kořeni domény
  // (Cloudflare, fotbalove-abc.cz) i v podadresáři (GitHub Pages /fotbal/).
  base: "./",
  build: { outDir: "dist", sourcemap: false }
});
