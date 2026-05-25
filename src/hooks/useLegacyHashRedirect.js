import { useEffect } from "react";

/* ── useLegacyHashRedirect ──────────────────────────────────────────────────
   Backwards-compat adapter for pre-migration hash links.

   The legacy `main.jsx` navigated by setting `window.location.hash` to one of
   the NAV ids (e.g. `#rules`). After the move to react-router's HashRouter,
   the same routes live at `#/pravidla`, `#/strategie`, … Any old bookmark or
   inbound link pointing at `#rules` would land on the home page (because
   HashRouter sees an unmatched hash and falls back to `#/`).

   This hook runs once on mount and, BEFORE the router has a chance to do its
   first navigation, rewrites a legacy hash to the new canonical form via
   `location.replace()`. Using `replace` instead of assigning to `.hash`
   avoids polluting the browser history with the legacy URL. We only act on
   exact matches; anything else (including already-migrated `#/x` URLs and
   plain page loads with no hash) is left alone.

   Why a single mount-time effect with no deps: legacy hash references should
   only land on first navigation. Re-running on every render would risk
   clobbering deep links inside the new route table. */
const LEGACY_MAP = {
  "#home": "#/",
  "#rules": "#/pravidla",
  "#strategy": "#/strategie",
  "#pitch": "#/hriste",
  "#positions": "#/pozice",
  "#zones": "#/zony",
  "#move": "#/pohyb",
  "#glossary": "#/slovnik",
  "#quiz": "#/kviz",
};

export function useLegacyHashRedirect() {
  useEffect(() => {
    const hash = window.location.hash;
    const target = LEGACY_MAP[hash];
    if (!target) return;
    window.location.replace(
      window.location.pathname + window.location.search + target
    );
  }, []);
}

export default useLegacyHashRedirect;
