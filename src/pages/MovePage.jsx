import { useState, useEffect, useRef } from "react";
import {
  Mascot,
  MascotSay,
  BallIcon,
  PitchSVG,
} from "../components";
import { PITCH_W, PITCH_H } from "../lib/pitchGeometry.js";

/* === Pohyb podle míče — interaktivní rozestavení podle pozice míče === */

/* Each player has:
 *  home: base position in 4-3-3 (our team attacks to the right)
 *  role: GK / CB / FB / CDM / CM / W / ST  — drives movement rules
 *  side: -1 (left half) / 0 (center) / +1 (right half) — for lateral shift
 *  push: 0..1 — how much they move forward when we attack (0=GK, 1=ST)
 *  drop: 0..1 — how much they drop back when defending
 *
 * Ball x,y is in pitch coords (0..100, 0..64).
 * Players follow: x = home.x + (ball.x - 50) * pushFactor  (clamped)
 *                 y = home.y + (ball.y - 32) * lateralFactor (clamped & role-specific)
 */

const SQUAD = [
  { id: "gk",  num: 1,  role: "GK",  short: "GK",  home: { x: 5,  y: 32 }, push: 0.05, lat: 0.15 },
  { id: "rb",  num: 2,  role: "FB",  short: "RB",  home: { x: 22, y: 12 }, push: 0.35, lat: 0.25 },
  { id: "rcb", num: 4,  role: "CB",  short: "CB",  home: { x: 18, y: 24 }, push: 0.20, lat: 0.30 },
  { id: "lcb", num: 5,  role: "CB",  short: "CB",  home: { x: 18, y: 40 }, push: 0.20, lat: 0.30 },
  { id: "lb",  num: 3,  role: "FB",  short: "LB",  home: { x: 22, y: 52 }, push: 0.35, lat: 0.25 },
  { id: "cdm", num: 6,  role: "CDM", short: "CDM", home: { x: 36, y: 32 }, push: 0.30, lat: 0.35 },
  { id: "rcm", num: 8,  role: "CM",  short: "CM",  home: { x: 46, y: 22 }, push: 0.45, lat: 0.40 },
  { id: "lcm", num: 10, role: "CM",  short: "CM",  home: { x: 46, y: 42 }, push: 0.45, lat: 0.40 },
  { id: "rw",  num: 7,  role: "W",   short: "RW",  home: { x: 68, y: 14 }, push: 0.55, lat: 0.25 },
  { id: "lw",  num: 11, role: "W",   short: "LW",  home: { x: 68, y: 50 }, push: 0.55, lat: 0.25 },
  { id: "st",  num: 9,  role: "ST",  short: "ST",  home: { x: 76, y: 32 }, push: 0.55, lat: 0.30 },
];

// Role-specific descriptions of HOW to move when ball is in various zones
function describeMove(role, ball, mode) {
  const sameSide = ball.y < 32 ? "pravé" : "levé";

  const ours = mode === "ours";

  switch (role) {
    case "GK":
      if (ours) return `Vyjdi až k hraně malého vápna a nabídni se na zpětnou přihrávku. Sleduj, kdo se uvolnil vzadu.`;
      return ball.x > 50 ? `Stůj v ose branky, dál od čáry. Komunikuj s obranou.` : `Připrav se na střelu nebo průnik — stůj blíž k čáře, ruce nahoru.`;
    case "CB":
      if (ours) return `Rozestup s druhým stoperem, posuň se k ose míče. Nabídni krátkou přihrávku ze zadu.`;
      return ball.x < 40 ? `Zaujmi blok před brankou, drž svého útočníka, sleduj odraz.` : `Posuň se vpřed s linií obrany, ale nedostaň se moc daleko od stoperského kolegy.`;
    case "FB":
      if (ours) {
        if (ball.x > 55 && (ball.y < 22 || ball.y > 42)) return `Sprintuj po své straně nahoru, čekej centr nebo přihrávku do nohy.`;
        return `Drž šířku, posuň se k polovině hřiště, nabízej se na bok.`;
      }
      return ball.y < 22 || ball.y > 42 ? `Drž svého krajního útočníka — pozor, ať tě neobejde uvnitř.` : `Stáhni se ke stoperům, zúžte střed.`;
    case "CDM":
      if (ours) return `Stůj přímo před stopery, vždy nabídni snadnou přihrávku. Kryj prostor pro zpětný míč.`;
      return ball.x < 50 ? `Stáhni se před vápno, blokuj střelu zdaleka.` : `Drž útočníka mezi řadami, který by tam vbíhal.`;
    case "CM":
      if (ours) {
        if (ball.x > 55) return `Naběhni do soupeřovy šestnáctky jako 'druhá vlna'. Buď připraven na odražený míč.`;
        return `Posuň se na ${sameSide} stranu k míči, vytvoř trojúhelník na přihrávku.`;
      }
      return `Stáhni se a presuj nejbližšího záložníka. Po ztrátě sprintni zpět.`;
    case "W":
      if (ours) {
        if (ball.y < 22 && role === "W" /* placeholder */) {}
        return `Drž šířku, postav se na své křídlo, ať se hra dá vytáhnout.`;
      }
      return ball.x > 50 ? `Sleduj soupeřova krajního beka — vrať se na svou půli.` : `Tlač se k záložníkům, presuj rozehrávku.`;
    case "ST":
      if (ours) {
        if (ball.x > 60) return `Naběhni za poslední obránce. Pozor na ofsajd! Trefuj prostor, ne hráče.`;
        return `Drž se mezi stopery soupeře, nabízej se na dlouhý balon.`;
      }
      return `Presuj brankáře a stopery při rozehrávce. Cloň přihrávku do středu.`;
    default:
      return "";
  }
}

function rolePush(role, mode) {
  // multiplier for forward push based on mode
  if (mode === "opp") {
    // when opponent has ball, players DROP back: invert push
    return { GK: 0, CB: -0.1, FB: -0.05, CDM: 0, CM: 0.05, W: 0.1, ST: 0.2 }[role] ?? 0;
  }
  return 1; // normal ours-have-ball: use player's push factor
}

function positionForBall(player, ball, mode) {
  // X push: shift toward ball.x
  const pushMul = rolePush(player.role, mode);
  const baseDx = (ball.x - 50) * player.push * (mode === "ours" ? 1 : 0.5);
  // Defense mode = move back relative to home
  const defenseDrop = mode === "opp" ? Math.max(0, (50 - ball.x) * 0.25) : 0;
  let x = player.home.x + baseDx * (mode === "ours" ? 1 : 0.4) - defenseDrop;

  // Lateral: shift toward ball.y (compactness)
  let y = player.home.y + (ball.y - 32) * player.lat;

  // Special: GK barely moves
  if (player.role === "GK") {
    x = Math.max(2.5, Math.min(11, 5 + (ball.x - 50) * 0.05));
    y = Math.max(28, Math.min(36, 32 + (ball.y - 32) * 0.18));
  }

  // Clamp to half/full pitch reasonably
  x = Math.max(2.5, Math.min(96, x));
  y = Math.max(4, Math.min(60, y));
  return { x, y };
}

export function MovePage() {
  const [ball, setBall] = useState({ x: 50, y: 32 });
  const [mode, setMode] = useState("ours"); // "ours" | "opp"
  const [selectedId, setSelectedId] = useState(null); // "your" position highlight
  const [dragging, setDragging] = useState(false);
  const svgRef = useRef();

  const startDrag = (e) => {
    e.preventDefault();
    setDragging(true);
    moveBall(e);
  };
  const moveBall = (e) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const cx = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const cy = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
    const x = Math.max(2, Math.min(98, (cx / rect.width) * PITCH_W));
    const y = Math.max(2, Math.min(62, (cy / rect.height) * PITCH_H));
    setBall({ x, y });
  };
  const endDrag = () => setDragging(false);

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e) => { e.preventDefault(); moveBall(e); };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", endDrag);
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("touchend", endDrag);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", endDrag);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", endDrag);
    };
  }, [dragging]);

  // Place ball on click anywhere on pitch
  const onPitchClick = (e) => {
    if (e.target.closest("[data-ball]")) return;
    moveBall(e);
  };

  const playerPositions = SQUAD.map(p => ({ ...p, ...positionForBall(p, ball, mode) }));
  const selected = selectedId ? playerPositions.find(p => p.id === selectedId) : null;
  const selectedHome = selectedId ? SQUAD.find(p => p.id === selectedId) : null;

  // preset ball positions
  const presets = [
    { label: "Naše vápno", x: 12, y: 32, mode: "opp" },
    { label: "Náš střed", x: 30, y: 32, mode: "ours" },
    { label: "Levé křídlo (naše)", x: 45, y: 52, mode: "ours" },
    { label: "Pravé křídlo (naše)", x: 45, y: 12, mode: "ours" },
    { label: "Soupeřův střed", x: 70, y: 32, mode: "ours" },
    { label: "Centr z křídla", x: 85, y: 10, mode: "ours" },
    { label: "Soupeřovo vápno", x: 88, y: 32, mode: "ours" },
    { label: "Roh (soupeřův)", x: 99, y: 1, mode: "ours" },
  ];

  return (
    <div className="page">
      <span className="eyebrow green"><BallIcon size={14}/> Kapitola 8</span>
      <h1>Pohyb podle míče</h1>
      <p className="lead">Přetáhni míč kamkoli na hřiště — celý tým se přerozestaví. Vyber si svou pozici a Kopík ti přesně řekne, kam se v tu chvíli máš pohybovat.</p>

      <div className="divider"/>

      <div className="hero-grid grid grid-cols-1 md:grid-cols-hero gap-5 md:gap-6">
        <div>
          <div className="pitch-wrap">
            <svg
              ref={svgRef}
              className="pitch-svg"
              viewBox={`0 0 ${PITCH_W} ${PITCH_H}`}
              preserveAspectRatio="xMidYMid meet"
              onClick={onPitchClick}
              style={{ cursor: dragging ? "grabbing" : "crosshair" }}
            >
              <PitchSVG/>

              {/* Highlight: which third of pitch the ball is in */}
              <rect
                x={ball.x < 33 ? 1 : ball.x < 66 ? 33.33 : 66.66}
                y={1}
                width={ball.x < 33 ? 32.33 : ball.x < 66 ? 33.33 : 32.33}
                height={PITCH_H - 2}
                fill="#F2A007"
                opacity="0.08"
                style={{ pointerEvents: "none" }}
              />

              {/* compactness shape: outline of outfield 10 */}
              <polygon
                points={
                  // ordered convex-ish hull around outfield players (skip GK)
                  [...playerPositions.filter(p => p.role !== "GK")]
                    .sort((a, b) => {
                      const cx = playerPositions.reduce((s, p) => s + p.x, 0) / playerPositions.length;
                      const cy = playerPositions.reduce((s, p) => s + p.y, 0) / playerPositions.length;
                      return Math.atan2(a.y - cy, a.x - cx) - Math.atan2(b.y - cy, b.x - cx);
                    })
                    .map(p => `${p.x},${p.y}`).join(" ")
                }
                fill={mode === "ours" ? "rgba(242,160,7,0.10)" : "rgba(11,31,51,0.18)"}
                stroke={mode === "ours" ? "rgba(242,160,7,0.5)" : "rgba(11,31,51,0.5)"}
                strokeWidth="0.3"
                strokeDasharray="0.8 0.6"
                style={{ pointerEvents: "none", transition: "all 0.25s" }}
              />

              {/* Selected player's "from → to" trail */}
              {selected && selectedHome && (
                <g style={{ pointerEvents: "none" }}>
                  <line
                    x1={selectedHome.home.x} y1={selectedHome.home.y}
                    x2={selected.x} y2={selected.y}
                    stroke="#F2A007" strokeWidth="0.5" strokeDasharray="1 0.6"
                  />
                  <circle cx={selectedHome.home.x} cy={selectedHome.home.y} r="2.4" fill="none" stroke="#F2A007" strokeWidth="0.4" strokeDasharray="0.6 0.4"/>
                  <text x={selectedHome.home.x} y={selectedHome.home.y - 3} textAnchor="middle" fontSize="1.8" fontWeight="700" fill="#F2A007">VÝCHOZÍ</text>
                </g>
              )}

              {/* Players */}
              {playerPositions.map(p => {
                const isSel = p.id === selectedId;
                return (
                  <g
                    key={p.id}
                    className="drag-player"
                    style={{ transition: "transform 0.35s cubic-bezier(.4,.0,.2,1)" }}
                    transform={`translate(${p.x}, ${p.y})`}
                  >
                    {isSel && <circle r="5.5" fill="rgba(242,160,7,0.25)" stroke="#F2A007" strokeWidth="0.5" pointerEvents="none">
                      <animate attributeName="r" values="5;6.5;5" dur="1.6s" repeatCount="indefinite"/>
                    </circle>}
                    <circle r={isSel ? 3.4 : 3} fill={p.role === "GK" ? "#7CD3A0" : isSel ? "#fff" : "#F2A007"} stroke="#0B1F33" strokeWidth="0.5" pointerEvents="none"/>
                    <text textAnchor="middle" y="1.2" fontSize={isSel ? 2.4 : 2.2} fontWeight="800" fill="#0B1F33" fontFamily="Bricolage Grotesque, sans-serif" pointerEvents="none">{p.num}</text>
                    <circle r="6" fill="transparent" pointerEvents="all" onClick={(e) => { e.stopPropagation(); setSelectedId(p.id === selectedId ? null : p.id); }} style={{ cursor: "pointer" }}/>
                  </g>
                );
              })}

              {/* Ball — draggable */}
              <g
                data-ball
                transform={`translate(${ball.x}, ${ball.y})`}
                style={{ cursor: dragging ? "grabbing" : "grab" }}
              >
                <circle r="3" fill="none" stroke="#F2A007" strokeWidth="0.4" strokeDasharray="0.6 0.4" pointerEvents="none">
                  <animate attributeName="r" values="3;4.5;3" dur="2s" repeatCount="indefinite"/>
                </circle>
                <circle r="2.2" fill="white" stroke="#0B1F33" strokeWidth="0.5" pointerEvents="none"/>
                <polygon points="0,-1.3 1.2,-0.4 0.75,1 -0.75,1 -1.2,-0.4" fill="#0B1F33" pointerEvents="none"/>
                <circle r="8" fill="transparent" pointerEvents="all" onMouseDown={startDrag} onTouchStart={startDrag} style={{ cursor: dragging ? "grabbing" : "grab", touchAction: "none" }}/>
              </g>

              {/* Drag hint */}
              {!dragging && (
                <text x={ball.x} y={ball.y - 5} textAnchor="middle" fontSize="2" fontWeight="800" fill="#F2A007" fontFamily="Bricolage Grotesque, sans-serif" style={{ pointerEvents: "none" }}>
                  ↑ Tukni nebo tahni
                </text>
              )}
            </svg>
          </div>

          <div className="between mt-4">
            <div className="pill-row">
              <button className={"step-chip " + (mode === "ours" ? "active" : "")} onClick={() => setMode("ours")}>⚽ Máme míč</button>
              <button className={"step-chip " + (mode === "opp" ? "active" : "")} onClick={() => setMode("opp")}>🛡️ Má soupeř</button>
            </div>
            <div className="text-[13px] text-navySoft">
              <b>Míč:</b> {ball.x < 33 ? "vlastní třetina" : ball.x < 66 ? "střed" : "útočná třetina"} · {ball.y < 22 ? "pravá" : ball.y < 42 ? "střed" : "levá"} strana
            </div>
          </div>

          <div className="mt-3.5">
            <div className="text-xs font-bold text-navySoft tracking-wider uppercase mb-2">
              Rychlé situace
            </div>
            <div className="pill-row steps stack-scroll">
              {presets.map((preset, i) => (
                <button key={i} className="step-chip" onClick={() => { setBall({ x: preset.x, y: preset.y }); setMode(preset.mode); }}>
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3.5">
          <MascotSay mood="wink">
            Přetáhni oranžový míč kamkoli — sleduj, jak se celý tým posune. Pak klikni na hráče (na sebe!) a já ti řeknu, co dělat.
          </MascotSay>

          {selected ? (
            <div className="card p-[22px]" style={{ background: "var(--orange)", color: "var(--navy)", borderColor: "var(--navy)" }}>
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-xs font-bold tracking-wider">HRAJEŠ #{selected.num}</div>
                  <div className="display text-[28px]">{selected.short}</div>
                </div>
                <button className="btn sm" onClick={() => setSelectedId(null)}>✕ Zrušit</button>
              </div>
              <div className="mt-3.5 p-3 rounded-[12px]" style={{ background: "rgba(11,31,51,0.08)" }}>
                <div className="text-xs font-bold tracking-wider mb-1">
                  {mode === "ours" ? "MÁME MÍČ" : "MÁ SOUPEŘ"}
                </div>
                <p className="text-[15px] leading-[1.5]">{describeMove(selected.role, ball, mode)}</p>
              </div>
              <div className="mt-2.5 text-[13px] opacity-85">
                Tečkovaný kruh ukazuje tvou výchozí pozici. Oranžová čára vede tam, kam bys teď měl být.
              </div>
            </div>
          ) : (
            <div className="card">
              <div className="display text-xl">Vyber svou pozici</div>
              <p className="mt-1.5 text-sm text-navySoft">Klikni na hráče na hřišti a Kopík ti dá osobní instrukci podle místa míče.</p>
              <div className="squad-grid no-collapse grid gap-2 mt-3.5" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
                {SQUAD.map(p => (
                  <button key={p.id} className="step-chip" onClick={() => setSelectedId(p.id)} style={{ padding: "6px 8px", fontSize: 13 }}>
                    <b>#{p.num}</b> {p.short}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="card">
            <div className="display text-lg">Jak to celé funguje?</div>
            <ul className="pl-[18px] leading-[1.7] mt-2 text-sm">
              <li><b>Tým drží tvar.</b> Když se míč posune doprava, celý tým se posune doprava. Vzdálenosti mezi hráči zůstávají.</li>
              <li><b>V útoku se roztáhneme</b> — víc prostoru, víc možností přihrávky.</li>
              <li><b>V obraně se stáhneme</b> — kompaktní blok, soupeř nemá kudy proběhnout.</li>
              <li><b>Hráč u míče</b> a jeho dva nejbližší spoluhráči tvoří trojúhelník.</li>
            </ul>
          </div>

          <div className="card green">
            <div className="flex items-center gap-3">
              <Mascot size={56} mood="wink"/>
              <div className="text-[15px]"><b>Tip:</b> Vyzkoušej preset „Centr z křídla". Vidíš, jak útočníci nabíhají do vápna a stopeři posouvají?</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovePage;
