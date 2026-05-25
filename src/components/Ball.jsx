/* --- Ball marker --- */
export function Ball({ x, y, size = 1.6 }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <circle r={size} fill="white" stroke="#0B1F33" strokeWidth="0.4" />
      <polygon
        points={`0,${-size * 0.55} ${size * 0.5},${-size * 0.15} ${size * 0.32},${size * 0.4} ${
          -size * 0.32
        },${size * 0.4} ${-size * 0.5},${-size * 0.15}`}
        fill="#0B1F33"
      />
    </g>
  );
}

export default Ball;
