/* --- Arrow on pitch --- */
export function Arrow({ x1, y1, x2, y2, color = "#F2A007", dashed = false, width = 0.6 }) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  const ux = dx / len;
  const uy = dy / len;
  const hx = x2 - ux * 1.8;
  const hy = y2 - uy * 1.8;
  const px = -uy;
  const py = ux;
  return (
    <g>
      <line
        x1={x1}
        y1={y1}
        x2={hx}
        y2={hy}
        stroke={color}
        strokeWidth={width}
        strokeDasharray={dashed ? "1.5 1" : null}
        strokeLinecap="round"
      />
      <polygon
        points={`${x2},${y2} ${hx + px * 1.2},${hy + py * 1.2} ${hx - px * 1.2},${hy - py * 1.2}`}
        fill={color}
      />
    </g>
  );
}

export default Arrow;
