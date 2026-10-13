/* Hlavní menu — jediný zdroj pro horní lištu, spodní lištu na mobilu i dlaždice na úvodu.
   Při přidání stránky uprav i children v src/router.jsx (a PAGES níž). */
export const NAV = [
  { id: "hriste", label: "Hřiště", path: "/hriste", icon: "pitch", hint: "Kde a kolik nás hraje" },
  { id: "pravidla", label: "Pravidla", path: "/pravidla", icon: "whistle", hint: "Co se smí a co ne" },
  { id: "utok", label: "Útok", path: "/utok", icon: "attack", hint: "Máme míč. Jdeme na bránu!" },
  { id: "obrana", label: "Obrana", path: "/obrana", icon: "shield", hint: "Nemáme míč. Chráníme bránu!" },
  { id: "brankar", label: "Brankář", path: "/brankar", icon: "glove", hint: "Chytá, brání a rozehrává" },
  { id: "kviz", label: "Kvíz", path: "/kviz", icon: "quiz", hint: "Co uděláš ty?" },
];

/* Titulek stránky: „Situace – Téma – Fotbalové ABC“. Stejný v prohlížeči (document.title)
   i v HTML pro vyhledávače, které po buildu vyrábí scripts/seo.mjs. */
export const pageTitle = (...parts) => [...parts, "Fotbalové ABC"].filter(Boolean).join(" – ");

/* Stránky mimo témata (témata a situace bere scripts/seo.mjs ze src/scenes). */
export const PAGES = {
  "/": {
    title: "Fotbalové ABC – fotbal pro přípravku",
    description: "Fotbal pro děti z přípravky (5–10 let): pravidla 5 + 1, útok, obrana a brankář v animacích na trenérské tabuli. Pro děti, rodiče i trenéry.",
  },
  "/kviz": {
    title: pageTitle("Kvíz"),
    description: "Fotbalový kvíz pro děti z přípravky: co uděláš ty? Otázky z pravidel 5 + 1, útoku, obrany i brankáře.",
  },
  "/pro-rodice": {
    title: pageTitle("Pro rodiče a trenéry"),
    description: "Pravidla fotbalu 5 + 1 pro přípravku v kostce (FAČR 2023), rozdíly u 4 + 1, hesla na trénink, videa a zdroje. Jak web používat s dětmi.",
  },
  "/ochrana-soukromi": {
    title: pageTitle("Ochrana osobních údajů"),
    description: "Bez vašeho souhlasu nic neměříme. Se souhlasem počítáme návštěvy přes Google Analytics. Registrace ani reklamy tu nejsou.",
  },
};

/* Staré odkazy za # → nové adresy: #/utok?s=roztahni-se (verze do 10/2026) → /utok/roztahni-se,
   ještě starší #rules → /pravidla. Jiný # (kotva na stránce) → null. */
const OLD = { home: "", rules: "pravidla", strategy: "utok", pitch: "hriste", positions: "hriste", zones: "obrana", move: "utok", glossary: "", quiz: "kviz" };
export function fromHash(hash) {
  const m = hash.match(/^#\/([^?]*)\??(.*)$/);
  if (m) return "/" + [m[1], new URLSearchParams(m[2]).get("s")].filter(Boolean).join("/");
  const k = hash.slice(1);
  return Object.hasOwn(OLD, k) ? "/" + OLD[k] : null;
}

export default NAV;
