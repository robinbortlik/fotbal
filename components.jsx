/* === Shared components === */
const { useState, useEffect, useRef, useMemo, useCallback } = React;

/* --- Mascot: a friendly soccer ball "Kopík" --- */
function Mascot({ size = 80, mood = "happy", spin = false, bounce = false }) {
  const eyeY = mood === "wink" ? 36 : 34;
  return (
    <div className={"mascot " + (bounce ? "bouncy" : "")} style={{ width: size, height: size }}>
      <svg viewBox="0 0 80 80" width={size} height={size} style={{ animation: spin ? "spin 1.8s linear infinite" : "none" }}>
        <defs>
          <radialGradient id="ballShade" cx="35%" cy="32%" r="70%">
            <stop offset="0%" stopColor="#ffffff"/>
            <stop offset="55%" stopColor="#f3ede0"/>
            <stop offset="100%" stopColor="#d4cbb4"/>
          </radialGradient>
        </defs>
        <circle cx="40" cy="40" r="36" fill="url(#ballShade)" stroke="#0B1F33" strokeWidth="3"/>
        {/* pentagon center */}
        <polygon points="40,24 49,30 46,40 34,40 31,30" fill="#0B1F33"/>
        {/* surrounding seams */}
        <path d="M40 6 L40 24" stroke="#0B1F33" strokeWidth="2.5" fill="none"/>
        <path d="M14 24 L31 30" stroke="#0B1F33" strokeWidth="2.5" fill="none"/>
        <path d="M66 24 L49 30" stroke="#0B1F33" strokeWidth="2.5" fill="none"/>
        <path d="M22 56 L34 40" stroke="#0B1F33" strokeWidth="2.5" fill="none"/>
        <path d="M58 56 L46 40" stroke="#0B1F33" strokeWidth="2.5" fill="none"/>
        {/* face on pentagon */}
        <circle cx="36" cy={eyeY} r="1.6" fill="#F7F2E6"/>
        <circle cx="44" cy={eyeY} r="1.6" fill="#F7F2E6"/>
        {mood === "wink" && <path d="M43 34 L46 34" stroke="#F7F2E6" strokeWidth="1.5" fill="none" strokeLinecap="round"/>}
        <path d="M36 38 Q40 41 44 38" stroke="#F7F2E6" strokeWidth="1.6" fill="none" strokeLinecap="round"/>
      </svg>
    </div>
  );
}

/* --- Speech bubble row --- */
function MascotSay({ children, mood = "happy", size = 72 }) {
  return (
    <div className="mascot-row">
      <Mascot size={size} mood={mood} bounce />
      <div className="bubble">{children}</div>
    </div>
  );
}

/* --- Bouncing ball icon for inline use --- */
function BallIcon({ size = 24 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size}>
      <circle cx="12" cy="12" r="10" fill="#fff" stroke="#0B1F33" strokeWidth="2"/>
      <polygon points="12,7 15,9.5 14,13 10,13 9,9.5" fill="#0B1F33"/>
    </svg>
  );
}

/* --- Standard football pitch (vertical or horizontal) ---
   Coordinate system: 0..100 (x: width along touchline), 0..64 (y: along byline).
   Wrapped in <Pitch> which provides the SVG + lines and yields a viewBox.
*/
const PITCH_W = 100;
const PITCH_H = 64;
function PitchSVG({ children, half = false, stripes = true, halfOnly = null, style = {}, onClick }) {
  // halfOnly: "left" or "right" — shows just that half but keeps full coordinates
  const vb = halfOnly === "left" ? `0 0 ${PITCH_W/2} ${PITCH_H}`
           : halfOnly === "right" ? `${PITCH_W/2} 0 ${PITCH_W/2} ${PITCH_H}`
           : `0 0 ${PITCH_W} ${PITCH_H}`;
  return (
    <svg className="pitch-svg" viewBox={vb} preserveAspectRatio="xMidYMid meet" style={style} onClick={onClick}>
      {/* grass stripes */}
      {stripes && Array.from({ length: 10 }).map((_, i) => (
        <rect key={i} x={i * 10} y={0} width={10} height={PITCH_H} className="pitch-grass-stripe" style={{ fill: i % 2 ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)" }}/>
      ))}
      {/* outer lines */}
      <rect x={1} y={1} width={PITCH_W - 2} height={PITCH_H - 2} fill="none" stroke="white" strokeWidth="0.4"/>
      {/* halfway line */}
      <line x1={PITCH_W/2} y1={1} x2={PITCH_W/2} y2={PITCH_H - 1} stroke="white" strokeWidth="0.4"/>
      <circle cx={PITCH_W/2} cy={PITCH_H/2} r="7" fill="none" stroke="white" strokeWidth="0.4"/>
      <circle cx={PITCH_W/2} cy={PITCH_H/2} r="0.6" fill="white"/>
      {/* penalty areas */}
      <rect x={1} y={PITCH_H/2 - 14} width={14} height={28} fill="none" stroke="white" strokeWidth="0.4"/>
      <rect x={PITCH_W - 15} y={PITCH_H/2 - 14} width={14} height={28} fill="none" stroke="white" strokeWidth="0.4"/>
      {/* 6 yard */}
      <rect x={1} y={PITCH_H/2 - 7} width={5} height={14} fill="none" stroke="white" strokeWidth="0.4"/>
      <rect x={PITCH_W - 6} y={PITCH_H/2 - 7} width={5} height={14} fill="none" stroke="white" strokeWidth="0.4"/>
      {/* penalty spots */}
      <circle cx={10} cy={PITCH_H/2} r="0.5" fill="white"/>
      <circle cx={PITCH_W - 10} cy={PITCH_H/2} r="0.5" fill="white"/>
      {/* D arcs */}
      <path d={`M 14 ${PITCH_H/2 - 5.5} A 7 7 0 0 1 14 ${PITCH_H/2 + 5.5}`} fill="none" stroke="white" strokeWidth="0.4"/>
      <path d={`M ${PITCH_W - 14} ${PITCH_H/2 - 5.5} A 7 7 0 0 0 ${PITCH_W - 14} ${PITCH_H/2 + 5.5}`} fill="none" stroke="white" strokeWidth="0.4"/>
      {/* corner arcs */}
      {[[1,1],[PITCH_W-1,1],[1,PITCH_H-1],[PITCH_W-1,PITCH_H-1]].map(([x,y], i) => (
        <path key={i} d={`M ${x + (x<50?1.5:-1.5)} ${y} A 1.5 1.5 0 0 ${x<50?(y<32?0:1):(y<32?1:0)} ${x} ${y + (y<32?1.5:-1.5)}`} fill="none" stroke="white" strokeWidth="0.4"/>
      ))}
      {/* goals */}
      <rect x={-0.5} y={PITCH_H/2 - 3} width={1.5} height={6} fill="white" opacity="0.85" stroke="#0B1F33" strokeWidth="0.15"/>
      <rect x={PITCH_W - 1} y={PITCH_H/2 - 3} width={1.5} height={6} fill="white" opacity="0.85" stroke="#0B1F33" strokeWidth="0.15"/>
      {children}
    </svg>
  );
}

/* --- Player marker on pitch (SVG-coord based) --- */
function Player({ x, y, team = "home", num = "", label = "", size = 3, dragHandlers = null, glow = false, captain = false }) {
  const fill = team === "home" ? "#F2A007" : team === "away" ? "#0B1F33" : team === "gk" ? "#7CD3A0" : team === "ball" ? "#fff" : team;
  const text = team === "away" ? "#fff" : "#0B1F33";
  return (
    <g transform={`translate(${x}, ${y})`} className={dragHandlers ? "drag-player" : ""} {...(dragHandlers || {})}>
      {glow && <circle r={size + 1.6} fill="rgba(242,160,7,0.35)"/>}
      <circle r={size} fill={fill} stroke="#0B1F33" strokeWidth="0.5"/>
      {num !== "" && <text textAnchor="middle" y={size * 0.4} fontFamily="Bricolage Grotesque, sans-serif" fontWeight="800" fontSize={size * 1.1} fill={text}>{num}</text>}
      {captain && <circle cx={size * 0.8} cy={-size * 0.8} r={size * 0.5} fill="#fff" stroke="#0B1F33" strokeWidth="0.3"/>}
      {captain && <text x={size * 0.8} y={-size * 0.55} textAnchor="middle" fontSize={size * 0.7} fontWeight="800" fill="#0B1F33">C</text>}
      {label && <text textAnchor="middle" y={size + 2.4} fontSize="2" fontWeight="700" fill="#0B1F33">{label}</text>}
    </g>
  );
}

/* --- Ball marker --- */
function Ball({ x, y, size = 1.6 }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <circle r={size} fill="white" stroke="#0B1F33" strokeWidth="0.4"/>
      <polygon points={`0,${-size*0.55} ${size*0.5},${-size*0.15} ${size*0.32},${size*0.4} ${-size*0.32},${size*0.4} ${-size*0.5},${-size*0.15}`} fill="#0B1F33"/>
    </g>
  );
}

/* --- Arrow on pitch --- */
function Arrow({ x1, y1, x2, y2, color = "#F2A007", dashed = false, width = 0.6 }) {
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.sqrt(dx*dx + dy*dy);
  const ux = dx/len, uy = dy/len;
  const hx = x2 - ux * 1.8, hy = y2 - uy * 1.8;
  const px = -uy, py = ux;
  return (
    <g>
      <line x1={x1} y1={y1} x2={hx} y2={hy} stroke={color} strokeWidth={width} strokeDasharray={dashed ? "1.5 1" : null} strokeLinecap="round"/>
      <polygon points={`${x2},${y2} ${hx + px*1.2},${hy + py*1.2} ${hx - px*1.2},${hy - py*1.2}`} fill={color}/>
    </g>
  );
}

/* --- Scrubber (play/pause + draggable timeline + steps) --- */
function Scrubber({ duration, value, onChange, playing, onPlay, steps = null, onStepChange = null, currentStep = 0 }) {
  const trackRef = useRef(null);
  const dragging = useRef(false);

  const handlePoint = (e) => {
    const rect = trackRef.current.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const ratio = Math.max(0, Math.min(1, x / rect.width));
    onChange(ratio * duration);
  };
  const onDown = (e) => { dragging.current = true; handlePoint(e); };
  const onMove = (e) => { if (dragging.current) { e.preventDefault(); handlePoint(e); } };
  const onUp = () => { dragging.current = false; };

  useEffect(() => {
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
    };
  }, []);

  const ratio = Math.max(0, Math.min(1, value / duration));

  return (
    <div>
      <div className="scrubber">
        <button className="scrubber-btn" onClick={onPlay} aria-label={playing ? "Pauza" : "Přehrát"}>
          {playing ? (
            <svg width="14" height="14" viewBox="0 0 14 14"><rect x="2" y="1" width="3.5" height="12" fill="#0B1F33"/><rect x="8.5" y="1" width="3.5" height="12" fill="#0B1F33"/></svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 14 14"><polygon points="2,1 13,7 2,13" fill="#0B1F33"/></svg>
          )}
        </button>
        <div className="scrubber-track" ref={trackRef} onMouseDown={onDown} onTouchStart={onDown}>
          <div className="scrubber-fill" style={{ width: (ratio * 100) + "%" }}/>
          <div className="scrubber-thumb" style={{ left: (ratio * 100) + "%" }}/>
        </div>
        <div className="scrubber-time">{value.toFixed(1)}s / {duration.toFixed(0)}s</div>
      </div>
      {steps && (
        <div className="steps">
          {steps.map((s, i) => (
            <button
              key={i}
              className={"step-chip " + (i === currentStep ? "active" : i < currentStep ? "done" : "")}
              onClick={() => onStepChange && onStepChange(i)}
            >
              {i + 1}. {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* --- Animator hook: returns time in seconds, looping, with playing state --- */
function useTimeline(duration, autoplay = false) {
  const [time, setTime] = useState(0);
  const [playing, setPlaying] = useState(autoplay);
  const raf = useRef();
  const last = useRef();
  useEffect(() => {
    if (!playing) return;
    last.current = performance.now();
    const tick = (now) => {
      const dt = (now - last.current) / 1000;
      last.current = now;
      setTime(t => {
        const nt = t + dt;
        if (nt >= duration) return 0;
        return nt;
      });
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [playing, duration]);
  return { time, setTime, playing, setPlaying };
}

/* --- Interpolation helper: positions[] = [{t, x, y}, ...] returns {x, y} at time t --- */
function interpAt(track, t) {
  if (!track || track.length === 0) return { x: 0, y: 0 };
  if (t <= track[0].t) return track[0];
  if (t >= track[track.length - 1].t) return track[track.length - 1];
  for (let i = 0; i < track.length - 1; i++) {
    const a = track[i], b = track[i + 1];
    if (t >= a.t && t <= b.t) {
      const f = (t - a.t) / (b.t - a.t);
      const e = f < 0.5 ? 2 * f * f : 1 - Math.pow(-2 * f + 2, 2) / 2; // easeInOut
      return { x: a.x + (b.x - a.x) * e, y: a.y + (b.y - a.y) * e };
    }
  }
  return track[track.length - 1];
}

/* --- Section heading --- */
function SectionHead({ index, title, kicker }) {
  return (
    <div className="section-head">
      {index && <span className="index">{index}</span>}
      <div>
        <h2>{title}</h2>
        {kicker && <p style={{ marginTop: 6, color: "var(--navy-soft)" }}>{kicker}</p>}
      </div>
    </div>
  );
}

/* --- Card link tile --- */
function Tile({ num, title, desc, tag, color, onClick }) {
  return (
    <button className="tile" onClick={onClick} style={color ? { background: color } : null}>
      <div className="tile-num">
        <span>{num}</span>
        {tag && <span className="tile-tag">{tag}</span>}
      </div>
      <div className="tile-title">{title}</div>
      <div className="tile-desc">{desc}</div>
      <div style={{ marginTop: "auto", display: "flex", alignItems: "center", gap: 6, fontWeight: 700, color: "var(--orange-deep)" }}>
        <span>Otevřít</span>
        <svg width="16" height="16" viewBox="0 0 16 16"><path d="M4 8h8M8 4l4 4-4 4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </div>
    </button>
  );
}

/* expose to other scripts */
Object.assign(window, {
  Mascot, MascotSay, BallIcon,
  PitchSVG, Player, Ball, Arrow,
  Scrubber, useTimeline, interpAt,
  SectionHead, Tile,
  PITCH_W, PITCH_H,
});
