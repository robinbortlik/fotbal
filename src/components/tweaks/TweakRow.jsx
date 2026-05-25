/* TweakRow — label + optional value-readout + child control.
   `inline` packs label and control horizontally (used by toggles). */
export function TweakRow({ label, value, children, inline = false }) {
  return (
    <div className={inline ? "twk-row twk-row-h" : "twk-row"}>
      <div className="twk-lbl">
        <span>{label}</span>
        {value != null && <span className="twk-val">{value}</span>}
      </div>
      {children}
    </div>
  );
}

export default TweakRow;
