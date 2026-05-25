/* --- Card link tile ---
   .tile / .tile-num / .tile-tag / .tile-title / .tile-desc live in
   src/styles/index.css. The `active` boolean prop swaps to the brutal
   navy/white toggled state (used by step-pickers and active route tiles).
   Per plan §6.9: active === true → bg-navy text-white. */
export function Tile({
  num,
  title,
  desc,
  tag,
  color,
  onClick,
  active = false,
  children,
}) {
  const activeClass = active ? " bg-navy text-white" : "";
  // When `active`, the navy override wins; per-tile `color` only applies in the
  // default (inactive) state.
  const style = color && !active ? { background: color } : null;
  return (
    <button className={"tile" + activeClass} onClick={onClick} style={style}>
      {num !== undefined && (
        <div className="tile-num">
          <span>{num}</span>
          {tag && <span className="tile-tag">{tag}</span>}
        </div>
      )}
      {title && <div className="tile-title">{title}</div>}
      {desc && <div className="tile-desc">{desc}</div>}
      {children}
      {(title || desc || num !== undefined) && (
        <div className="mt-auto flex items-center gap-1.5 font-bold text-orangeDeep">
          <span>Otevřít</span>
          <svg width="16" height="16" viewBox="0 0 16 16">
            <path
              d="M4 8h8M8 4l4 4-4 4"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}
    </button>
  );
}

export default Tile;
