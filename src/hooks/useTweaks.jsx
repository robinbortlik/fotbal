import { createContext, useCallback, useContext, useState } from "react";

/* ── useTweaks ──────────────────────────────────────────────────────────────
   Single source of truth for tweak values.

   Two usage modes:
   1. Standalone (legacy contract): `const [t, setTweak] = useTweaks(defaults);`
      Creates local state, posts `__edit_mode_set_keys` to window.parent on
      change, dispatches `tweakchange` CustomEvent on window. This preserves
      the exact contract from tweaks-panel.jsx so prototypes that don't wrap
      in a provider continue to work.
   2. With provider: wrap the tree in <TweaksProvider defaults={...}>. Every
      `useTweaks()` call below the provider shares the same tuple — no state
      duplication, no prop-drilling. Pass `defaults` to the provider; calls to
      `useTweaks()` ignore the defaults arg when context is present (provider
      owns its own state).

   NB the postMessage protocol surface is split:
   - This hook handles the OUTBOUND `__edit_mode_set_keys` (set on each edit)
     and the same-window `tweakchange` CustomEvent.
   - TweaksPanel handles INBOUND `__activate_edit_mode` / `__deactivate_edit_mode`
     and OUTBOUND `__edit_mode_available` / `__edit_mode_dismissed`.
   Both surfaces must remain verbatim — host iframes depend on the contract. */

export const TweaksContext = createContext(null);

/* Legacy-compatible local-state implementation. Returned tuple is `[t, setTweak]`.
   `setTweak` accepts either ('key', value) or ({ key: value, ... }) so a
   useState-style call doesn't write "[object Object]" into the persisted JSON
   block. */
function useLocalTweaksState(defaults) {
  const [values, setValues] = useState(defaults);
  const setTweak = useCallback((keyOrEdits, val) => {
    const edits =
      typeof keyOrEdits === "object" && keyOrEdits !== null
        ? keyOrEdits
        : { [keyOrEdits]: val };
    setValues((prev) => ({ ...prev, ...edits }));
    // Persist via the host — it owns the on-disk EDITMODE block.
    window.parent.postMessage({ type: "__edit_mode_set_keys", edits }, "*");
    // Same-window signal so in-page peers can react — the parent message only
    // reaches the host, not other listeners in this window.
    window.dispatchEvent(new CustomEvent("tweakchange", { detail: edits }));
  }, []);
  return [values, setTweak];
}

/* Provider — installs the tuple in context so descendants share state. */
export function TweaksProvider({ defaults, children }) {
  const tuple = useLocalTweaksState(defaults);
  return (
    <TweaksContext.Provider value={tuple}>{children}</TweaksContext.Provider>
  );
}

/* Consumer — falls through to local state when no provider is mounted. The
   `defaults` arg is only consulted on the local-state path; when a provider
   is present its own defaults win. */
export function useTweaks(defaults) {
  const ctx = useContext(TweaksContext);
  const local = useLocalTweaksState(defaults);
  return ctx ?? local;
}

export default useTweaks;
