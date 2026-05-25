/* --- StepChips: horizontal toggle bar of numbered step buttons (plan §6.5) ---
   Items can be either { id, label } objects or plain strings. The `.step-chip`
   class (with `.active` / `.done` modifiers) is defined in @layer components in
   src/styles/index.css and carries the brutal orange/pitch fill design. */
export function StepChips({ items, active, onChange, done = false }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {items.map((item, i) => {
        const isObj = item && typeof item === "object";
        const id = isObj ? item.id ?? i : i;
        const label = isObj ? item.label : item;
        const cls =
          "step-chip" +
          (i === active ? " active" : done && i < active ? " done" : "");
        return (
          <button
            key={id}
            type="button"
            className={cls}
            onClick={() => onChange && onChange(i)}
          >
            {i + 1}. {label}
          </button>
        );
      })}
    </div>
  );
}

export default StepChips;
