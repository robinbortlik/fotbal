/* --- Player marker on pitch (SVG-coord based) --- */
export function Player({
  x,
  y,
  team = "home",
  num = "",
  label = "",
  size = 3,
  dragHandlers = null,
  glow = false,
  captain = false,
}) {
  const fill =
    team === "home"
      ? "#F2A007"
      : team === "away"
      ? "#0B1F33"
      : team === "gk"
      ? "#7CD3A0"
      : team === "ball"
      ? "#fff"
      : team;
  const text = team === "away" ? "#fff" : "#0B1F33";
  return (
    <g
      transform={`translate(${x}, ${y})`}
      className={dragHandlers ? "drag-player" : ""}
      {...(dragHandlers || {})}
    >
      {glow && <circle r={size + 1.6} fill="rgba(242,160,7,0.35)" />}
      <circle r={size} fill={fill} stroke="#0B1F33" strokeWidth="0.5" />
      {num !== "" && (
        <text
          textAnchor="middle"
          y={size * 0.4}
          fontFamily="Bricolage Grotesque, sans-serif"
          fontWeight="800"
          fontSize={size * 1.1}
          fill={text}
        >
          {num}
        </text>
      )}
      {captain && (
        <circle cx={size * 0.8} cy={-size * 0.8} r={size * 0.5} fill="#fff" stroke="#0B1F33" strokeWidth="0.3" />
      )}
      {captain && (
        <text
          x={size * 0.8}
          y={-size * 0.55}
          textAnchor="middle"
          fontSize={size * 0.7}
          fontWeight="800"
          fill="#0B1F33"
        >
          C
        </text>
      )}
      {label && (
        <text textAnchor="middle" y={size + 2.4} fontSize="2" fontWeight="700" fill="#0B1F33">
          {label}
        </text>
      )}
    </g>
  );
}

export default Player;
