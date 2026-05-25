/* NAV — single source of truth for top-nav items and the footer chapter list.
   Order matches the legacy `main.jsx` NAV so the visual rail is unchanged. The
   `path` values are react-router paths (Phase 5 migration from `#id` hashes to
   `createHashRouter` paths). The `cta` flag styles the "Kvíz" link as a
   call-to-action via the .cta class. */
export const NAV = [
  { id: "home", label: "Domů", path: "/" },
  { id: "rules", label: "Pravidla", path: "/pravidla" },
  { id: "strategy", label: "Strategie", path: "/strategie" },
  { id: "pitch", label: "Hřiště", path: "/hriste" },
  { id: "positions", label: "Pozice", path: "/pozice" },
  { id: "zones", label: "Zóny", path: "/zony" },
  { id: "move", label: "Pohyb dle míče", path: "/pohyb" },
  { id: "glossary", label: "Slovníček", path: "/slovnik" },
  { id: "quiz", label: "Kvíz", path: "/kviz", cta: true },
];

export default NAV;
