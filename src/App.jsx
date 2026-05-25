import { RouterProvider } from "react-router-dom";
import { TweaksProvider } from "./hooks/useTweaks.jsx";
import { useLegacyHashRedirect } from "./hooks/useLegacyHashRedirect.js";
import { router } from "./router.jsx";

/* ── App ────────────────────────────────────────────────────────────────────
   Top-level shell. Two responsibilities:
   1. Run the legacy-hash adapter once on mount so a hit on `#rules` is
      rewritten to `#/pravidla` BEFORE the router resolves its first match.
      `useLegacyHashRedirect` calls `location.replace`, which fires a fresh
      load, so the router never sees the stale hash.
   2. Mount the tweaks provider at the root so every consumer below
      (RootLayout's tweaks panel, individual pages reading `homeVariant`,
      etc.) shares one state cell rather than each rolling its own.
   The default values mirror the EDITMODE block in the original `main.jsx`
   (lines 3–7); the host's persisted overrides flow back in through the
   postMessage protocol owned by `useTweaks`. */

const TWEAK_DEFAULTS = {
  homeVariant: "A",
  showMascot: true,
  highContrast: false,
};

export default function App() {
  useLegacyHashRedirect();
  return (
    <TweaksProvider defaults={TWEAK_DEFAULTS}>
      <RouterProvider router={router} />
    </TweaksProvider>
  );
}
