import { useCallback, useEffect, useRef, useState } from "react";
import "./tweaks.css";

/* ── TweaksPanel ─────────────────────────────────────────────────────────────
   Floating shell. Registers the host-protocol message listener BEFORE
   announcing availability — if the announce ran first, the host's activate
   could land before our handler exists and the toolbar toggle would silently
   no-op.

   The close button posts __edit_mode_dismissed so the host's toolbar toggle
   flips off in lockstep; the host echoes __deactivate_edit_mode back, which
   is what actually hides the panel.

   PROTOCOL (do not change):
     inbound  message  __activate_edit_mode    → open
     inbound  message  __deactivate_edit_mode  → close
     outbound post     __edit_mode_available   (on mount)
     outbound post     __edit_mode_dismissed   (on close button)
   The outbound __edit_mode_set_keys lives in useTweaks. */
export function TweaksPanel({ title = "Tweaks", children }) {
  const [open, setOpen] = useState(false);
  const dragRef = useRef(null);
  const offsetRef = useRef({ x: 16, y: 16 });
  const PAD = 16;

  const clampToViewport = useCallback(() => {
    const panel = dragRef.current;
    if (!panel) return;
    // On narrow viewports the panel pins full-width via CSS (.twk-panel @ <=480);
    // skip JS positioning so it doesn't fight the mobile override.
    if (window.innerWidth <= 480) {
      panel.style.right = "";
      panel.style.bottom = "";
      return;
    }
    const w = panel.offsetWidth;
    const h = panel.offsetHeight;
    const pad = window.innerWidth <= 768 ? 8 : PAD;
    const maxRight = Math.max(pad, window.innerWidth - w - pad);
    const maxBottom = Math.max(pad, window.innerHeight - h - pad);
    offsetRef.current = {
      x: Math.min(maxRight, Math.max(pad, offsetRef.current.x)),
      y: Math.min(maxBottom, Math.max(pad, offsetRef.current.y)),
    };
    panel.style.right = offsetRef.current.x + "px";
    panel.style.bottom = offsetRef.current.y + "px";
  }, []);

  useEffect(() => {
    if (!open) return;
    clampToViewport();
    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", clampToViewport);
      return () => window.removeEventListener("resize", clampToViewport);
    }
    const ro = new ResizeObserver(clampToViewport);
    ro.observe(document.documentElement);
    return () => ro.disconnect();
  }, [open, clampToViewport]);

  useEffect(() => {
    const onMsg = (e) => {
      const t = e?.data?.type;
      if (t === "__activate_edit_mode") setOpen(true);
      else if (t === "__deactivate_edit_mode") setOpen(false);
    };
    window.addEventListener("message", onMsg);
    window.parent.postMessage({ type: "__edit_mode_available" }, "*");
    return () => window.removeEventListener("message", onMsg);
  }, []);

  const dismiss = () => {
    setOpen(false);
    window.parent.postMessage({ type: "__edit_mode_dismissed" }, "*");
  };

  const onDragStart = (e) => {
    const panel = dragRef.current;
    if (!panel) return;
    const r = panel.getBoundingClientRect();
    const sx = e.clientX;
    const sy = e.clientY;
    const startRight = window.innerWidth - r.right;
    const startBottom = window.innerHeight - r.bottom;
    const move = (ev) => {
      offsetRef.current = {
        x: startRight - (ev.clientX - sx),
        y: startBottom - (ev.clientY - sy),
      };
      clampToViewport();
    };
    const up = () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  };

  if (!open) return null;
  return (
    <div
      ref={dragRef}
      className="twk-panel"
      data-omelette-chrome=""
      style={{ right: offsetRef.current.x, bottom: offsetRef.current.y }}
    >
      <div className="twk-hd" onMouseDown={onDragStart}>
        <b>{title}</b>
        <button
          className="twk-x"
          aria-label="Close tweaks"
          onMouseDown={(e) => e.stopPropagation()}
          onClick={dismiss}
        >
          ✕
        </button>
      </div>
      <div className="twk-body">{children}</div>
    </div>
  );
}

export default TweaksPanel;
