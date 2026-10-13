import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    // PWA: manifest + service worker (offline). Ikony a screenshoty jsou v public/icons a public/screenshots.
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        id: "./",
        name: "Fotbalové ABC",
        short_name: "Fotbal ABC",
        description: "Fotbal pro přípravku: pravidla 5 + 1 a herní situace v animacích.",
        lang: "cs",
        start_url: "./",
        scope: "./",
        display: "standalone",
        background_color: "#eef3f8",
        theme_color: "#2e9b53",
        icons: [
          { src: "icons/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "icons/icon-512.png", sizes: "512x512", type: "image/png" },
          { src: "icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
        screenshots: [
          { src: "screenshots/wide.webp", sizes: "1280x800", type: "image/webp", form_factor: "wide", label: "Úvod: máme míč, nebo nemáme?" },
          { src: "screenshots/narrow.webp", sizes: "780x1688", type: "image/webp", form_factor: "narrow", label: "Situace na trenérské tabuli" },
        ],
      },
      workbox: {
        // Offline jede celý web; písma jen latinka (čeština). Screenshoty (dialog instalace) a og.png (náhled odkazu) offline netřeba.
        // Kopíkovy MP3 (13 MB) tu nejsou: stahuje si je jen nainstalovaná aplikace (src/lib/voice.js).
        // Navigace na jakoukoli adresu → index.html z offline úložiště; HTML ze scripts/seo.mjs je jen pro roboty a první návštěvu.
        globPatterns: ["**/*.{js,css,html,png,webp,svg}", "assets/*-latin-*.woff2"],
        globIgnores: ["screenshots/**", "og.png"],
        // Soubory s příponou (llms.txt, sitemap.xml, robots.txt…) ze sítě, ne úvodní stránku aplikace.
        navigateFallbackDenylist: [/\.[a-z]+$/],
      },
    }),
  ],
  // Skutečné adresy (/utok/roztahni-se) potřebují absolutní cesty k souborům → web běží v kořeni domény.
  base: "/",
  build: { outDir: "dist", sourcemap: false }
});
