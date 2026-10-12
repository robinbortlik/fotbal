import { W, L, GOAL_W, BOX_D, PEN, PAD, sy } from "../lib/pitch.js";

/* Trenérská tabule: svislé hřiště 5+1. Děti (children) se kreslí v metrech,
   y = vzdálenost od NAŠÍ brankové čáry (dole). Viz src/lib/pitch.js. */
export function Pitch({ children, label, className = "", ...rest }) {
  const stripes = 10;
  const lw = 0.16;
  const goal = (y, dir) => (
    <g>
      <rect
        x={W / 2 - GOAL_W / 2}
        y={dir < 0 ? y - 1.3 : y}
        width={GOAL_W}
        height={1.3}
        fill="url(#net)"
        stroke="#fff"
        strokeWidth={0.26}
      />
    </g>
  );
  return (
    <svg
      viewBox={`${-PAD} ${-PAD} ${W + PAD * 2} ${L + PAD * 2}`}
      className={"pitch " + className}
      role="img"
      aria-label={label || "Hřiště pro přípravku 5+1"}
      {...rest}
    >
      <defs>
        <pattern id="hatch-bad" width="1.1" height="1.1" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="0.5" height="1.1" fill="rgba(255, 92, 82, 0.8)" />
        </pattern>
        <pattern id="net" width="0.5" height="0.5" patternUnits="userSpaceOnUse">
          <rect width="0.5" height="0.5" fill="rgba(255,255,255,0.12)" />
          <path d="M0 0H0.5M0 0V0.5" stroke="rgba(255,255,255,0.55)" strokeWidth="0.06" />
        </pattern>
      </defs>
      <rect x={-PAD} y={-PAD} width={W + PAD * 2} height={L + PAD * 2} fill="var(--grass-edge)" />
      {Array.from({ length: stripes }, (_, i) => (
        <rect
          key={i}
          x={0}
          y={(i * L) / stripes}
          width={W}
          height={L / stripes}
          fill={i % 2 ? "var(--grass)" : "var(--grass-2)"}
        />
      ))}
      <g fill="none" stroke="#fff" strokeWidth={lw}>
        <rect x={0} y={0} width={W} height={L} />
        <line x1={0} y1={L / 2} x2={W} y2={L / 2} />
        <line x1={0} y1={BOX_D} x2={W} y2={BOX_D} />
        <line x1={0} y1={L - BOX_D} x2={W} y2={L - BOX_D} />
        {[
          [0, 0, 1, 1],
          [W, 0, -1, 1],
          [0, L, 1, -1],
          [W, L, -1, -1],
        ].map(([x, y, dx, dy], i) => (
          <path key={i} d={`M${x + dx} ${y} A1 1 0 0 ${dx * dy > 0 ? 1 : 0} ${x} ${y + dy}`} />
        ))}
      </g>
      <g fill="#fff">
        <circle cx={W / 2} cy={L / 2} r={0.3} />
        <circle cx={W / 2} cy={sy(PEN)} r={0.3} />
        <circle cx={W / 2} cy={sy(L - PEN)} r={0.3} />
      </g>
      {goal(0, -1)}
      {goal(L, 1)}
      {children}
    </svg>
  );
}

const FILL = { us: "var(--us)", them: "var(--them)" };
const GK_FILL = { us: "var(--us-gk)", them: "var(--them-gk)" };
const DIM_FILL = { us: "#f3e4b5", them: "#bccdf4" }; // bledší, ale pořád „naši“ / „jejich“
const NUM_INK = { us: "var(--ink)", them: "#fff" };

/* Hráč = magnet na tabuli. tag = štítek („Ty“) na straně u vlastní branky (míč bývá před hráčem;
   u brankáře vedle něj, aby nezakryl bránu ani míč v rukou),
   hl = pulzující kruh, dim = bledý (pro situaci nedůležitý) hráč. */
export function Player({ x, y, team = "us", gk = false, n, tag, hl = false, dim = false }) {
  const R = 1.3;
  return (
    <g style={{ transform: `translate(${x}px, ${sy(y)}px)` }}>
      {hl && <circle r={R + 0.8} className="pl-ring" />}
      <circle r={R} cx={0.14} cy={0.26} fill="rgba(10,20,40,0.32)" />
      <circle r={R} fill={dim ? DIM_FILL[team] : gk ? GK_FILL[team] : FILL[team]} stroke="#fff" strokeWidth={0.24} />
      {gk && <circle r={R - 0.42} fill="none" stroke="#fff" strokeWidth={0.12} strokeDasharray="0.3 0.22" />}
      {n != null && (
        <text className="pl-num" y={0.5} fill={dim ? "var(--ink-soft)" : gk && team === "us" ? "var(--ink)" : NUM_INK[team]}>
          {n}
        </text>
      )}
      {tag && (gk ? <Tag x={R + 1.7} text={tag} /> : <Tag y={(team === "us" ? 1 : -1) * (R + 1.2)} text={tag} />)}
    </g>
  );
}

function Tag({ x = 0, y = 0, text, tone = "ink" }) {
  const w = Math.max(2.6, text.length * 0.78 + 1.2);
  return (
    <g transform={`translate(${x} ${y})`} className={"tag tag-" + tone}>
      <rect x={-w / 2} y={-1.05} width={w} height={2.1} rx={1.05} />
      <text y={0.42}>{text}</text>
    </g>
  );
}

export function Ball({ x, y }) {
  const r = 0.62;
  return (
    <g style={{ transform: `translate(${x}px, ${sy(y)}px)` }}>
      <circle r={r} cx={0.1} cy={0.18} fill="rgba(10,20,40,0.35)" />
      <circle r={r} fill="#fff" stroke="var(--ink)" strokeWidth={0.12} />
      <polygon points="0,-0.32 0.3,-0.1 0.19,0.25 -0.19,0.25 -0.3,-0.1" fill="var(--ink)" />
    </g>
  );
}

/* Značky trenéra. p = 0..1 jak daleko je čára nakreslená.
   pass = plná čára, run = čárkovaná (běh bez míče), dribble = vlnovka (vedení míče),
   shot = tlustá (střela), line = tečkovaná pomocná čára. */
export function Mark({ m, a, b, p = 1, layer }) {
  const k = m.kind;
  if (k === "zone") {
    const tone = m.tone || "good";
    const shape = m.circle ? (
      <circle cx={m.circle[0]} cy={sy(m.circle[1])} r={m.circle[2]} />
    ) : (
      <rect x={m.rect[0]} y={sy(m.rect[1] + m.rect[3])} width={m.rect[2]} height={m.rect[3]} rx={0.8} />
    );
    // štítek uprostřed zóny, nebo v at (když zónou někdo probíhá a štítek by ho zakryl)
    const lx = a?.x ?? (m.circle ? m.circle[0] : m.rect[0] + m.rect[2] / 2);
    const ly = a?.y ?? (m.circle ? m.circle[1] : m.rect[1] + m.rect[3] / 2);
    // layer "under" = jen plocha (pod hráči), "over" = jen štítek (nad hráči), jinak obojí
    return (
      <g className={"zone zone-" + tone} opacity={p}>
        {layer !== "over" && shape}
        {layer !== "under" && m.text && <Tag x={lx} y={sy(ly)} text={m.text} tone={tone} />}
      </g>
    );
  }
  if (k === "label") return <g opacity={p}><Tag x={a.x} y={sy(a.y)} text={m.text} tone={m.tone || "ink"} /></g>;
  if (k === "x" || k === "check") {
    return (
      <g transform={`translate(${a.x} ${sy(a.y)}) scale(${0.4 + 0.6 * p})`} className={"sign sign-" + k}>
        <circle r={1.5} />
        {k === "x" ? <path d="M-0.6 -0.6L0.6 0.6M0.6 -0.6L-0.6 0.6" /> : <path d="M-0.7 0L-0.15 0.6L0.75 -0.55" />}
      </g>
    );
  }

  // čárové značky: a → b
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const cur = len * p;
  const head = k === "line" ? 0 : Math.min(1, cur);
  const end = Math.max(0, cur - head * 0.9);
  let d;
  if (k === "dribble") {
    const pts = [];
    for (let s = 0; s <= end; s += 0.25) {
      const o = Math.sin((s / 1.6) * Math.PI * 2) * 0.38 * Math.min(1, s, end - s);
      pts.push(`${(a.x + ux * s - uy * o).toFixed(2)} ${sy(a.y + uy * s + ux * o).toFixed(2)}`);
    }
    d = pts.length > 1 ? "M" + pts.join("L") : "";
  } else {
    d = `M${a.x} ${sy(a.y)}L${a.x + ux * end} ${sy(a.y + uy * end)}`;
  }
  const tip = { x: a.x + ux * cur, y: a.y + uy * cur };
  const px = -uy;
  const py = ux;
  const hb = { x: tip.x - ux * head, y: tip.y - uy * head };
  const hw = head * 0.6;
  return (
    <g className={`mk mk-${k} mk-${m.team || "us"}`}>
      <path d={d} />
      {head > 0.05 && (
        <polygon
          points={`${tip.x},${sy(tip.y)} ${hb.x + px * hw},${sy(hb.y + py * hw)} ${hb.x - px * hw},${sy(hb.y - py * hw)}`}
        />
      )}
    </g>
  );
}
