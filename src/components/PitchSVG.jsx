import { PITCH_W, PITCH_H } from "../lib/pitchGeometry.js";

/* --- Standard football pitch (vertical or horizontal) ---
   Coordinate system: 0..100 (x: width along touchline), 0..64 (y: along byline).
   Wrapped in <PitchSVG> which provides the SVG + lines and yields a viewBox.
   halfOnly: "left" or "right" — shows just that half but keeps full coordinates. */
export function PitchSVG({ children, half = false, stripes = true, halfOnly = null, style = {}, onClick }) {
  const vb =
    halfOnly === "left"
      ? `0 0 ${PITCH_W / 2} ${PITCH_H}`
      : halfOnly === "right"
      ? `${PITCH_W / 2} 0 ${PITCH_W / 2} ${PITCH_H}`
      : `0 0 ${PITCH_W} ${PITCH_H}`;
  return (
    <svg
      className="pitch-svg"
      viewBox={vb}
      preserveAspectRatio="xMidYMid meet"
      style={style}
      onClick={onClick}
    >
      {/* grass stripes */}
      {stripes &&
        Array.from({ length: 10 }).map((_, i) => (
          <rect
            key={i}
            x={i * 10}
            y={0}
            width={10}
            height={PITCH_H}
            className="pitch-grass-stripe"
            style={{ fill: i % 2 ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)" }}
          />
        ))}
      {/* outer lines */}
      <rect x={1} y={1} width={PITCH_W - 2} height={PITCH_H - 2} fill="none" stroke="white" strokeWidth="0.4" />
      {/* halfway line */}
      <line x1={PITCH_W / 2} y1={1} x2={PITCH_W / 2} y2={PITCH_H - 1} stroke="white" strokeWidth="0.4" />
      <circle cx={PITCH_W / 2} cy={PITCH_H / 2} r="7" fill="none" stroke="white" strokeWidth="0.4" />
      <circle cx={PITCH_W / 2} cy={PITCH_H / 2} r="0.6" fill="white" />
      {/* penalty areas */}
      <rect x={1} y={PITCH_H / 2 - 14} width={14} height={28} fill="none" stroke="white" strokeWidth="0.4" />
      <rect x={PITCH_W - 15} y={PITCH_H / 2 - 14} width={14} height={28} fill="none" stroke="white" strokeWidth="0.4" />
      {/* 6 yard */}
      <rect x={1} y={PITCH_H / 2 - 7} width={5} height={14} fill="none" stroke="white" strokeWidth="0.4" />
      <rect x={PITCH_W - 6} y={PITCH_H / 2 - 7} width={5} height={14} fill="none" stroke="white" strokeWidth="0.4" />
      {/* penalty spots */}
      <circle cx={10} cy={PITCH_H / 2} r="0.5" fill="white" />
      <circle cx={PITCH_W - 10} cy={PITCH_H / 2} r="0.5" fill="white" />
      {/* D arcs */}
      <path
        d={`M 14 ${PITCH_H / 2 - 5.5} A 7 7 0 0 1 14 ${PITCH_H / 2 + 5.5}`}
        fill="none"
        stroke="white"
        strokeWidth="0.4"
      />
      <path
        d={`M ${PITCH_W - 14} ${PITCH_H / 2 - 5.5} A 7 7 0 0 0 ${PITCH_W - 14} ${PITCH_H / 2 + 5.5}`}
        fill="none"
        stroke="white"
        strokeWidth="0.4"
      />
      {/* corner arcs */}
      {[
        [1, 1],
        [PITCH_W - 1, 1],
        [1, PITCH_H - 1],
        [PITCH_W - 1, PITCH_H - 1],
      ].map(([x, y], i) => (
        <path
          key={i}
          d={`M ${x + (x < 50 ? 1.5 : -1.5)} ${y} A 1.5 1.5 0 0 ${
            x < 50 ? (y < 32 ? 0 : 1) : y < 32 ? 1 : 0
          } ${x} ${y + (y < 32 ? 1.5 : -1.5)}`}
          fill="none"
          stroke="white"
          strokeWidth="0.4"
        />
      ))}
      {/* goals */}
      <rect x={-0.5} y={PITCH_H / 2 - 3} width={1.5} height={6} fill="white" opacity="0.85" stroke="#0B1F33" strokeWidth="0.15" />
      <rect x={PITCH_W - 1} y={PITCH_H / 2 - 3} width={1.5} height={6} fill="white" opacity="0.85" stroke="#0B1F33" strokeWidth="0.15" />
      {children}
    </svg>
  );
}

export default PitchSVG;
