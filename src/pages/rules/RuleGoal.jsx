import { useRef, useState } from "react";
import { Mascot } from "../../components";
import { RuleShell } from "./RuleShell.jsx";

/* === Geometry ===
   View 0..100 (x) × 0..40 (y).
   Goal line at x=GOAL_X. Anything to the right is the goal cage.
   Ball radius = R. "Whole ball past line" iff ball.x - R > GOAL_X.
   We start the ball just inside the field of play. */
const GOAL_X = 18;
const R = 3;
const Y_CENTER = 20;
const POSTS = { top: 9, bottom: 31 };
const CROSSBAR_Y = POSTS.top;
const BALL_START = { x: 8, y: Y_CENTER };

function isGoal(x, r = R) {
  return x - r > GOAL_X;
}

function clamp(n, lo, hi) {
  return Math.max(lo, Math.min(hi, n));
}

function svgPointFromEvent(svg, e) {
  const pt = svg.createSVGPoint();
  const touch = e.touches?.[0] || e.changedTouches?.[0];
  pt.x = touch ? touch.clientX : e.clientX;
  pt.y = touch ? touch.clientY : e.clientY;
  const m = svg.getScreenCTM();
  if (!m) return null;
  const local = pt.matrixTransform(m.inverse());
  return { x: local.x, y: local.y };
}

function InteractiveGoal() {
  const [ball, setBall] = useState(BALL_START);
  const [dragging, setDragging] = useState(false);
  const svgRef = useRef(null);

  const goal = isGoal(ball.x);

  function update(e) {
    const svg = svgRef.current;
    if (!svg) return;
    const p = svgPointFromEvent(svg, e);
    if (!p) return;
    // Allow the ball anywhere in the field + goal cage, but stop at extremes
    const x = clamp(p.x, R, 32);
    const y = clamp(p.y, R + 1, 40 - R - 1);
    setBall({ x, y });
  }

  function onDown(e) {
    e.preventDefault();
    setDragging(true);
    update(e);
  }
  function onMove(e) {
    if (!dragging) return;
    e.preventDefault();
    update(e);
  }
  function onUp() { setDragging(false); }
  function reset() { setBall(BALL_START); setDragging(false); }

  return (
    <div className="card p-5" style={{ borderColor: "var(--navy)" }}>
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="display text-xl">Přetáhni míč přes brankovou čáru</div>
        <button type="button" onClick={reset} className="step-chip">Reset</button>
      </div>
      <p className="mt-1.5 text-[14px] text-navySoft">Vidíš, kdy je to gól a kdy ne? Musí přejít celý míč.</p>

      <div className="mt-3 relative">
        <svg
          ref={svgRef}
          viewBox="0 0 36 40"
          preserveAspectRatio="xMidYMid meet"
          className="w-full"
          style={{
            background: "#0E8A4F",
            borderRadius: 12,
            cursor: dragging ? "grabbing" : "grab",
            touchAction: "none",
            userSelect: "none",
            maxHeight: 360,
            display: "block",
          }}
          onMouseDown={onDown}
          onMouseMove={onMove}
          onMouseUp={onUp}
          onMouseLeave={onUp}
          onTouchStart={onDown}
          onTouchMove={onMove}
          onTouchEnd={onUp}
        >
          {/* Goal line — thick white line */}
          <line x1={GOAL_X} y1={2} x2={GOAL_X} y2={38} stroke="white" strokeWidth="0.55"/>

          {/* Penalty area outline (just for context) */}
          <rect x="2" y="10" width="14" height="20" fill="none" stroke="white" strokeWidth="0.4" opacity="0.7"/>

          {/* Goal cage: net behind goal line */}
          <rect x={GOAL_X} y={POSTS.top} width={36 - GOAL_X - 0.5} height={POSTS.bottom - POSTS.top}
                fill="rgba(255,255,255,0.07)" stroke="white" strokeWidth="0.4"/>
          {/* Posts */}
          <line x1={GOAL_X} y1={POSTS.top} x2={GOAL_X} y2={POSTS.bottom} stroke="white" strokeWidth="0.8"/>
          {/* Net hatch */}
          {Array.from({ length: 8 }).map((_, i) => (
            <line key={"nv"+i}
                  x1={GOAL_X + 0.5 + i * 2.1} y1={POSTS.top}
                  x2={GOAL_X + 0.5 + i * 2.1} y2={POSTS.bottom}
                  stroke="rgba(255,255,255,0.35)" strokeWidth="0.18"/>
          ))}
          {Array.from({ length: 6 }).map((_, i) => (
            <line key={"nh"+i}
                  x1={GOAL_X + 0.3} y1={POSTS.top + 0.5 + i * 3.6}
                  x2={35.5} y2={POSTS.top + 0.5 + i * 3.6}
                  stroke="rgba(255,255,255,0.35)" strokeWidth="0.18"/>
          ))}

          {/* Crossbar shadow line (top of goal) */}
          <line x1={GOAL_X} y1={CROSSBAR_Y} x2={35.5} y2={CROSSBAR_Y} stroke="white" strokeWidth="0.4" opacity="0.6"/>

          {/* "GOAL" label inside cage when goal */}
          {goal && (
            <text x={GOAL_X + 8} y={Y_CENTER + 1.5}
                  fontSize="3.5" fontWeight="900" fill="white"
                  textAnchor="middle"
                  fontFamily="Bricolage Grotesque, sans-serif"
                  opacity="0.9">
              GÓL!
            </text>
          )}

          {/* Ball drop shadow */}
          <ellipse cx={ball.x + 0.3} cy={ball.y + 0.5} rx={R * 0.85} ry={R * 0.35}
                   fill="black" opacity="0.18"/>
          {/* Ball */}
          <circle cx={ball.x} cy={ball.y} r={R}
                  fill="white" stroke="#0B1F33" strokeWidth="0.45"/>
          {/* Ball pentagon hint */}
          <polygon points={`${ball.x},${ball.y - R*0.55} ${ball.x + R*0.5},${ball.y - R*0.18} ${ball.x + R*0.32},${ball.y + R*0.45} ${ball.x - R*0.32},${ball.y + R*0.45} ${ball.x - R*0.5},${ball.y - R*0.18}`}
                   fill="#0B1F33"/>

          {/* Verdict pill follows the ball */}
          <g transform={`translate(${clamp(ball.x, 4, 30)} ${Math.max(R + 1, ball.y - R - 3)})`}>
            <rect x={-7} y={-3.2} width={14} height={3.4} rx={1.6}
                  fill={goal ? "#0E8A4F" : "#0B1F33"}
                  stroke="white" strokeWidth="0.3"/>
            <text x={0} y={-0.7} fontSize="2"
                  fontWeight="800" fill="white"
                  textAnchor="middle"
                  fontFamily="Bricolage Grotesque, sans-serif">
              {goal ? "GÓL! ⚽" : "Není gól"}
            </text>
          </g>
        </svg>

        <div className="mt-3 flex items-center gap-3">
          <Mascot size={56} mood={goal ? "wink" : "default"}/>
          <div className="flex-1">
            <div className={"display text-[18px] " + (goal ? "text-pitch" : "")} style={{ color: goal ? "#0E8A4F" : "var(--navy)" }}>
              {goal ? "✓ Gól! Celý míč přešel za čáru." : "Ještě to není gól"}
            </div>
            <p className="text-[14px] opacity-90 mt-1">
              {goal
                ? "Vidíš? Až teď je CELÝ míč za čárou — i poslední milimetr. Takhle to musí být."
                : "Část míče se ještě dotýká nebo je před čárou. Posuň ho dál vpravo!"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* --- GOAL --- */
export function RuleGoal() {
  return (
    <RuleShell
      kicker="06 / Branka"
      title="Co znamená vstřelit branku?"
      lead="Míč musí přejít CELÝ za brankovou čáru, mezi tyčemi a pod břevnem. Ani milimetr méně."
      mascotText="Pozor! Když je míč na čáře, ještě to není gól. Musí být CELÝ za ní. Sudí to dnes ve velkých zápasech kontroluje i pomocí kamer (gólová technologie)."
      pitchSlot={
        <div className="flex flex-col gap-4">
          <InteractiveGoal/>

          <div className="card">
            <div className="display text-xl">Tři situace na čáře</div>
            <div className="responsive-grid hero-grid grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
              {[
                { ok: false, label: "Míč na čáře", caption: "Není gól. Část míče je ještě na hřišti." },
                { ok: false, label: "Půl na, půl za", caption: "Pořád není gól. Musí celý." },
                { ok: true, label: "Celý za čárou", caption: "GÓL! ⚽" },
              ].map((c, i) => (
                <div key={i} className="text-center p-3 rounded-[14px] border-2 border-navy" style={{ background: c.ok ? "#dff5e6" : "var(--cream)" }}>
                  <svg viewBox="0 0 60 40" className="w-full h-[100px]">
                    <rect x="0" y="5" width="60" height="30" fill="#0E8A4F"/>
                    <line x1="10" y1="5" x2="10" y2="35" stroke="white" strokeWidth="0.6"/>
                    <rect x="2" y="10" width="8" height="20" fill="none" stroke="white" strokeWidth="0.5"/>
                    <circle cx={i === 0 ? 11 : i === 1 ? 9 : 6} cy={22} r="2.5" fill="white" stroke="#0B1F33" strokeWidth="0.5"/>
                  </svg>
                  <div className="font-display font-extrabold mt-2" style={{ color: c.ok ? "#084d2c" : "var(--navy)" }}>{c.label}</div>
                  <div className="text-[13px] text-navySoft mt-1">{c.caption}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      }
    />
  );
}

export default RuleGoal;
