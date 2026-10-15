/* Po buildu (npm run build), z dat webu:
   1) dist/<adresa>.html pro každou stránku a situaci (Cloudflare podá /utok/roztahni-se ze souboru utok/roztahni-se.html):
      vlastní titulek, popis, canonical a náhled pro sdílení + krátký text a odkazy v #root pro roboty bez JavaScriptu
      (aplikace ho po načtení nahradí; lidem ho schová CSS .seo). Úvod se zapíše do dist/index.html.
      Témata a situace dostanou drobečkovou navigaci pro Google (BreadcrumbList), neznámé adresy dist/404.html (noindex;
      Cloudflare ji podá se stavem 404, viz wrangler.jsonc).
   2) dist/sitemap.xml se všemi adresami.
   3) dist/llms.txt — obsah webu jako text pro jazykové modely (https://llmstxt.org).
   Skončí chybou, když se index.html změní tak, že v něm chybí co přepsat. */
import fs from "node:fs/promises";
import path from "node:path";
import { createServer } from "vite";

const SITE = "https://fotbalove-abc.cz";
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
const cut = (s, n = 155) => (s.length <= n ? s : s.slice(0, s.lastIndexOf(" ", n - 1)) + "…");
const breadcrumbs = (crumbs) =>
  JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [["Úvod", "/"], ...crumbs].map(([name, url], i) => ({ "@type": "ListItem", position: i + 1, name, item: SITE + url })),
  }).replace(/</g, "\\u003c");
const vite = await createServer({ server: { middlewareMode: true }, appType: "custom", logLevel: "error" });
const load = (p) => vite.ssrLoadModule(p);
try {
  const { NAV, PAGES, pageTitle, BOOK } = await load("/src/lib/nav.js");
  const { RULES, YOUNGER, SOURCES } = await load("/src/pages/ParentsPage.jsx");
  const topics = {};
  for (const f of (await fs.readdir("src/scenes")).filter((f) => f !== "videos.js"))
    for (const t of Object.values(await load(`/src/scenes/${f}`))) if (t?.scenes) topics[t.id] = t;
  const said = (beats) => beats.map((b) => b.say ?? b.text).join(" ");
  const spoken = (s) => (s.Component ? (s.Component.TEXTS || []).join(" ") : said(s.beats));

  // Stránky: { url, title, description, h1, text: [odstavce], links: [[url, název]] }
  const menu = [["/", "Úvod"], ...NAV.map((n) => [n.path, n.label]), ["/pro-rodice", "Pro rodiče a trenéry"]];
  const pages = Object.entries(PAGES).map(([url, p]) => ({
    url,
    ...p,
    h1: p.title.split(" – ")[0],
    text: [p.description, ...(url === "/pro-rodice" ? RULES.map(([k, v]) => `${k}: ${v}`) : [])],
    links: menu,
  }));
  for (const n of NAV) {
    const t = topics[n.id];
    if (!t) continue; // Kvíz je v PAGES
    const list = [...t.scenes.map((s) => [`/${t.id}/${s.id}`, s.title]), ...menu];
    const lead = `${t.lead} V animacích: ${t.scenes.map((s) => s.title).join(", ")}.`;
    const crumbs = [[t.title, n.path]];
    pages.push({ url: n.path, title: pageTitle(t.title), description: cut(lead), h1: t.title, text: [lead], links: list, crumbs });
    for (const s of t.scenes) {
      const text = [
        spoken(s),
        s.bad?.beats && `Takhle ne: ${said(s.bad.beats)}`,
        s.why && `Pro rodiče a trenéry: ${s.why}`,
        s.younger?.why && `Mladší přípravka (U8–U9): ${s.younger.why}`,
      ];
      const url = `/${t.id}/${s.id}`;
      pages.push({ url, title: pageTitle(s.title, t.title), description: cut(spoken(s)), h1: s.title, text: text.filter(Boolean), links: list, crumbs: [...crumbs, [s.title, url]] });
    }
  }
  pages.push({ url: "/404", title: pageTitle("Stránka nenalezena"), description: "Tahle stránka tu není.", h1: "Stránka nenalezena", text: ["Tahle stránka tu není. Vyberte si z menu."], links: menu, noindex: true });

  const template = await fs.readFile("dist/index.html", "utf8");
  const set = (html, re, value) => {
    if (!re.test(html)) throw new Error(`dist/index.html: nenašel jsem ${re}`);
    return html.replace(re, (_, a, b) => a + value + b);
  };
  for (const p of pages) {
    const url = SITE + p.url;
    let html = template;
    html = set(html, /(<title>)[^<]*(<\/title>)/, esc(p.title));
    html = set(html, /(<meta property="og:title" content=")[^"]*(")/, esc(p.title));
    html = set(html, /(<meta name="description" content=")[^"]*(")/, esc(p.description));
    html = set(html, /(<meta property="og:description" content=")[^"]*(")/, esc(p.description));
    html = set(html, /(<link rel="canonical" href=")[^"]*(")/, url);
    html = set(html, /(<meta property="og:url" content=")[^"]*(")/, url);
    if (p.crumbs) html = set(html, /()(<\/head>)/, `<script type="application/ld+json">${breadcrumbs(p.crumbs)}</script>\n`);
    if (p.noindex) html = set(html, /()(<\/head>)/, `<meta name="robots" content="noindex" />\n`);
    const body = [`<h1>${esc(p.h1)}</h1>`, ...p.text.map((t) => `<p>${esc(t)}</p>`), "<ul>", ...p.links.map(([u, t]) => `<li><a href="${u}">${esc(t)}</a></li>`), "</ul>"];
    html = set(html, /(<div id="root">)(<\/div>)/, `<main class="seo">${body.join("")}</main>`);
    const file = p.url === "/" ? "dist/index.html" : `dist${p.url}.html`;
    await fs.mkdir(path.dirname(file), { recursive: true });
    await fs.writeFile(file, html);
  }

  const urls = pages.filter((p) => !p.noindex).map((p) => `  <url><loc>${SITE}${p.url}</loc></url>`);
  await fs.writeFile("dist/sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`);

  const out = [
    "# Fotbalové ABC",
    "",
    "> Fotbal pro děti z přípravky (5–10 let), česky: pravidla malé kopané 5 + 1 podle FAČR („Pravidla fotbalu malých forem“, 2023) a herní situace (útok, obrana, brankář) v animacích na trenérské tabuli. Průvodce Kopík dětem titulky čte nahlas.",
    "",
    "Animace se kreslí v prohlížeči z dat. Tady je jejich obsah jako text: co u každé situace říká Kopík, jak to vypadá špatně („Takhle ne“) a vysvětlení pro rodiče a trenéry („Proč“).",
  ];
  for (const n of NAV) {
    const t = topics[n.id];
    if (!t) continue;
    out.push("", `## ${t.title}: ${t.lead}`, "");
    for (const s of t.scenes) {
      const bad = s.bad?.beats ? ` Takhle ne: ${said(s.bad.beats)}` : "";
      const why = s.why ? ` Proč: ${s.why}` : "";
      const young = s.younger?.why ? ` Mladší přípravka (U8–U9): ${s.younger.why}` : "";
      out.push(`- [${s.title}](${SITE}/${t.id}/${s.id}): ${spoken(s)}${bad}${why}${young}`);
    }
  }
  out.push("", "## Pravidla 5 + 1 v kostce", "", ...RULES.map(([k, v]) => `- ${k}: ${v}`));
  out.push("", "Mladší přípravka (U8–U9) hraje 4 + 1:", "", ...YOUNGER.map((v) => `- ${v}`));
  out.push(
    "",
    "## Optional",
    "",
    `- [Pro rodiče a trenéry](${SITE}/pro-rodice): pravidla, hesla na trénink a videa`,
    `- [Kniha k vytištění](${SITE}${BOOK.href}): všechny situace jako komiks, kvíz, pravidla a hesla (PDF, A4)`,
    ...SOURCES.map(([name, url]) => `- [${name}](${url})`),
  );
  await fs.writeFile("dist/llms.txt", out.join("\n") + "\n");
  console.log(`seo: ${pages.length} stránek (HTML + sitemap.xml), llms.txt ${out.length} řádků`);
} finally {
  await vite.close();
}
