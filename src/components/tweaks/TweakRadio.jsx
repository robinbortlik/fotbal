import { useRef, useState } from "react";
import { TweakRow } from "./TweakRow.jsx";
import { TweakSelect } from "./TweakSelect.jsx";

/* Segmented control. Falls back to <TweakSelect> when labels are too long to
   fit the segments side-by-side (see geometry comment below). */
export function TweakRadio({ label, value, options, onChange }) {
  const trackRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  // The active value is read by pointer-move handlers attached for the
  // lifetime of a drag — ref it so a stale closure doesn't fire onChange for
  // every move.
  const valueRef = useRef(value);
  valueRef.current = value;

  // Segments wrap mid-word once per-segment width runs out. The track is
  // ~248px (280 panel − 28 body pad − 4 seg pad), each button loses 12px to
  // its own padding, and 11.5px system-ui averages ~6.3px/char — so 2 options
  // fit ~16 chars each, 3 fit ~10. Past that (or >3 options), fall back to a
  // dropdown rather than wrap.
  const labelLen = (o) => String(typeof o === "object" ? o.label : o).length;
  const maxLen = options.reduce((m, o) => Math.max(m, labelLen(o)), 0);
  const fitsAsSegments = maxLen <= ({ 2: 16, 3: 10 }[options.length] ?? 0);
  if (!fitsAsSegments) {
    // <select> emits strings — map back to the original option value so the
    // fallback stays type-preserving (numbers, booleans) like the segment path.
    const resolve = (s) => {
      const m = options.find(
        (o) => String(typeof o === "object" ? o.value : o) === s
      );
      return m === undefined ? s : typeof m === "object" ? m.value : m;
    };
    return (
      <TweakSelect
        label={label}
        value={value}
        options={options}
        onChange={(s) => onChange(resolve(s))}
      />
    );
  }
  const opts = options.map((o) => (typeof o === "object" ? o : { value: o, label: o }));
  const idx = Math.max(0, opts.findIndex((o) => o.value === value));
  const n = opts.length;

  const segAt = (clientX) => {
    const r = trackRef.current.getBoundingClientRect();
    const inner = r.width - 4;
    const i = Math.floor(((clientX - r.left - 2) / inner) * n);
    return opts[Math.max(0, Math.min(n - 1, i))].value;
  };

  const onPointerDown = (e) => {
    setDragging(true);
    const v0 = segAt(e.clientX);
    if (v0 !== valueRef.current) onChange(v0);
    const move = (ev) => {
      if (!trackRef.current) return;
      const v = segAt(ev.clientX);
      if (v !== valueRef.current) onChange(v);
    };
    const up = () => {
      setDragging(false);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  return (
    <TweakRow label={label}>
      <div
        ref={trackRef}
        role="radiogroup"
        onPointerDown={onPointerDown}
        className={dragging ? "twk-seg dragging" : "twk-seg"}
      >
        <div
          className="twk-seg-thumb"
          style={{
            left: `calc(2px + ${idx} * (100% - 4px) / ${n})`,
            width: `calc((100% - 4px) / ${n})`,
          }}
        />
        {opts.map((o) => (
          <button key={o.value} type="button" role="radio" aria-checked={o.value === value}>
            {o.label}
          </button>
        ))}
      </div>
    </TweakRow>
  );
}

export default TweakRadio;
