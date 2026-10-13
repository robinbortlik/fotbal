/* Kniha k tisku → public/fotbalove-abc.pdf:  npm run book
   Vite sestaví book.html (src/book/Book.jsx) a Chrome ho vytiskne do PDF (A4 na šířku).
   Spusťte po každé změně scén nebo textů. Chrome jinde: CHROME=/cesta/k/chrome npm run book */
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { build, preview } from "vite";
import react from "@vitejs/plugin-react";

const OUT = "public/fotbalove-abc.pdf";
const CHROME = process.env.CHROME || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const outDir = "node_modules/.book"; // dočasné, ne do dist (na web jde jen PDF)

// Bez vite.config.js: kniha nepotřebuje PWA ani public/ (hlasy).
const config = { configFile: false, logLevel: "error", build: { outDir, emptyOutDir: true } };
await build({
  ...config,
  plugins: [react()],
  publicDir: false,
  // Chrome dává webp do PDF bezztrátově (fotky brankáře = 7 MB) → v knize jejich JPEG kopie ze src/book/img.
  resolve: { alias: [{ find: /^.*\/assets\/brankar\/(.+)\.webp$/, replacement: path.resolve("src/book/img/brankar-$1.jpg") }] },
  build: { ...config.build, rollupOptions: { input: "book.html" } },
});
const server = await preview({ ...config, preview: { port: 5188 } });
const profile = fs.mkdtempSync(path.join(os.tmpdir(), "book-")); // vlastní profil, ať se nepere s běžícím Chromem
try {
  // asynchronně: synchronní volání by zablokovalo preview server ve stejném procesu
  await promisify(execFile)(CHROME, [
    "--headless",
    `--user-data-dir=${profile}`,
    "--no-pdf-header-footer",
    `--print-to-pdf=${OUT}`,
    new URL("book.html", server.resolvedUrls.local[0]).href,
  ]);
} finally {
  server.httpServer.close();
  fs.rmSync(profile, { recursive: true, force: true });
}
console.log(`${OUT}: ${(fs.statSync(OUT).size / 1e6).toFixed(1)} MB`);
