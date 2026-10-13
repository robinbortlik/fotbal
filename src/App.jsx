import { RouterProvider } from "react-router-dom";
import { TweaksProvider } from "./hooks/useTweaks.jsx";
import { router } from "./router.jsx";

/* ── App ────────────────────────────────────────────────────────────────────
   Top-level shell. Mounts the tweaks provider at the root so every consumer below
   (RootLayout's tweaks panel, individual pages reading `homeVariant`,
   etc.) shares one state cell rather than each rolling its own.
   The default values mirror the EDITMODE block in the original `main.jsx`
   (lines 3–7); the host's persisted overrides flow back in through the
   postMessage protocol owned by `useTweaks`. Old `#` links are rewritten in
   router.jsx before the router reads the URL. */

const TWEAK_DEFAULTS = {
  highContrast: false,
};

export default function App() {
  return (
    <TweaksProvider defaults={TWEAK_DEFAULTS}>
      <RouterProvider router={router} />
    </TweaksProvider>
  );
}
