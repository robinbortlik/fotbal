import { useRef, useState } from "react";
import { BallIcon, PitchSVG, MascotSay } from "../components";

const PITCH_HOTSPOTS = [
  { id: 1, x: 50, y: 32, title: "Středový kruh", text: "Tady začíná každý zápas (výkop). Soupeři musí být mimo kruh. Má průměr 18,30 m." },
  { id: 2, x: 50, y: 1.5, title: "Středová čára", text: "Dělí hřiště na dvě poloviny. Tvůj brankář brání svou půlku." },
  { id: 3, x: 8, y: 32, title: "Pokutové území (vápno)", text: "Tady smí brankář chytat rukama. Když ti soupeř fauluje v jeho vápně — penalta!" },
  { id: 4, x: 10, y: 32.5, title: "Pokutová značka", text: "Z této tečky se kope penalta. 11 metrů od branky." },
  { id: 5, x: 4, y: 32, title: "Branková území (malé vápno)", text: "Šestka. Z ní kope brankář kop od branky." },
  { id: 6, x: 1.5, y: 1.5, title: "Roh", text: "Z rohové značky se kope roh, když obránce vykopne míč přes vlastní brankovou čáru." },
  { id: 7, x: 0.5, y: 32, title: "Branka", text: "7,32 m široká, 2,44 m vysoká. Sem chceš trefit míč!" },
  { id: 8, x: 1, y: 32, title: "Branková čára", text: "Když míč přejde CELÝ za brankovou čáru mezi tyčemi — gól!" },
];

/* SVG-unit → meter conversion. The schematic pitch is 100×64 units; the
   penalty area is drawn 14 units wide and is 16,5 m wide in real life.
   So 1 unit ≈ 16.5 / 14 ≈ 1.18 m. Calibrated against the penalty-mark
   distance (10 - 1 = 9 units × 1.18 ≈ 10.6 m, close to the official 11 m). */
const M_PER_UNIT = 16.5 / 14;
function distanceM(a, b) {
  const dx = (a.x - b.x) * M_PER_UNIT;
  const dy = (a.y - b.y) * M_PER_UNIT;
  return Math.sqrt(dx * dx + dy * dy);
}

function svgPoint(svg, e) {
  const pt = svg.createSVGPoint();
  pt.x = e.clientX;
  pt.y = e.clientY;
  const m = svg.getScreenCTM();
  if (!m) return null;
  return pt.matrixTransform(m.inverse());
}

export function PitchPage() {
  const [active, setActive] = useState(1);
  const [measureMode, setMeasureMode] = useState(false);
  const [points, setPoints] = useState([]); // up to 2 {x,y}
  const svgRef = useRef(null);
  const info = PITCH_HOTSPOTS.find(h => h.id === active);

  function onPitchClick(e) {
    if (!measureMode) return;
    const svg = svgRef.current;
    if (!svg) return;
    const p = svgPoint(svg, e);
    if (!p) return;
    const point = { x: p.x, y: p.y };
    if (points.length < 2) {
      setPoints([...points, point]);
    } else {
      // Third click starts a new measurement from this point
      setPoints([point]);
    }
  }

  function clearMeasurement() { setPoints([]); }
  function toggleMeasure() {
    setMeasureMode((m) => !m);
    setPoints([]);
  }

  const mDist = points.length === 2 ? distanceM(points[0], points[1]) : null;
  const mid = points.length === 2
    ? { x: (points[0].x + points[1].x) / 2, y: (points[0].y + points[1].y) / 2 }
    : null;

  return (
    <div className="page">
      <span className="eyebrow green"><BallIcon size={14}/> Kapitola 3</span>
      <h1>O hřišti</h1>
      <p className="lead">Co znamenají všechny ty čáry? Klikni na oranžová kolečka — Kopík ti je vysvětlí. Anebo si zapni pásmo a změř si vzdálenosti sám/sama.</p>

      <div className="divider"/>

      <div className="hero-grid grid gap-6" style={{ gridTemplateColumns: "1.5fr 1fr" }}>
        <div className="pitch-wrap relative">
          <div className="flex flex-wrap items-center gap-2.5 mb-3">
            <button
              type="button"
              className={"step-chip " + (measureMode ? "active" : "")}
              onClick={toggleMeasure}
              aria-pressed={measureMode}
            >
              📏 {measureMode ? "Pásmo zapnuto" : "Změř to"}
            </button>
            {measureMode && (
              <button type="button" className="step-chip" onClick={clearMeasurement}>
                Vynulovat
              </button>
            )}
            {measureMode && (
              <span className="text-[13px] text-navySoft">
                {points.length === 0 && "Klikni první bod"}
                {points.length === 1 && "Klikni druhý bod"}
                {points.length === 2 && <b>{mDist.toFixed(1)} m</b>}
              </span>
            )}
          </div>
          {measureMode && points.length === 0 && (
            <p className="text-[13px] text-navySoft mb-2">
              👆 Klikni dvakrát na zelené hřiště — nejdřív první bod, pak druhý. Změřím vzdálenost v metrech.
            </p>
          )}

          <div className="relative">
            <svg
              ref={svgRef}
              className="pitch-svg"
              viewBox="0 0 100 64"
              preserveAspectRatio="xMidYMid meet"
              onClick={onPitchClick}
              style={{ cursor: measureMode ? "crosshair" : "default" }}
            >
              <PitchSVG/>

              {/* Hotspots — disabled in measure mode */}
              {!measureMode && PITCH_HOTSPOTS.map(h => (
                <g key={h.id} style={{ cursor: "pointer" }}>
                  <circle cx={h.x} cy={h.y} r={active === h.id ? 2.6 : 2.2}
                          fill={active === h.id ? "#fff" : "#F2A007"}
                          stroke="#0B1F33" strokeWidth="0.5" pointerEvents="none"/>
                  <text x={h.x} y={h.y + 0.9} textAnchor="middle" fontSize="2.4" fontWeight="800"
                        fontFamily="Bricolage Grotesque, sans-serif" fill="#0B1F33" pointerEvents="none">
                    {h.id}
                  </text>
                  <circle cx={h.x} cy={h.y} r="6" fill="transparent" pointerEvents="all"
                          onClick={(e) => { e.stopPropagation(); setActive(h.id); }}
                          style={{ cursor: "pointer" }}/>
                </g>
              ))}

              {/* Measurement dots */}
              {measureMode && points.map((p, i) => (
                <g key={i}>
                  <circle cx={p.x} cy={p.y} r="1.6" fill="#F2A007" stroke="#0B1F33" strokeWidth="0.5"/>
                  <circle cx={p.x} cy={p.y} r="0.6" fill="#0B1F33"/>
                </g>
              ))}

              {/* Measurement line + label */}
              {measureMode && points.length === 2 && (
                <g>
                  <line x1={points[0].x} y1={points[0].y}
                        x2={points[1].x} y2={points[1].y}
                        stroke="#F2A007" strokeWidth="0.5"
                        strokeDasharray="1.2 0.8"/>
                  <g transform={`translate(${mid.x} ${mid.y - 2})`}>
                    <rect x={-7} y={-2.5} width="14" height="3.2" rx="1.4"
                          fill="#0B1F33" stroke="white" strokeWidth="0.25"/>
                    <text x={0} y={-0.2} fontSize="2" fontWeight="800"
                          fill="white" textAnchor="middle"
                          fontFamily="Bricolage Grotesque, sans-serif">
                      {mDist.toFixed(1)} m
                    </text>
                  </g>
                </g>
              )}
            </svg>
          </div>
        </div>
        <div className="flex flex-col gap-3.5">
          <MascotSay>
            {measureMode
              ? "Klikni dvě místa na hřišti — řeknu ti, kolik je to metrů. Zkus třeba puntík penalty (#4) k brance (#7) — vyjde to asi 11 m, jako penalta!"
              : "Hřiště má mraky čar a každá něco znamená. Klikni na číslo a já ti to vysvětlím!"}
          </MascotSay>
          {!measureMode && (
            <div className="card bg-orange text-navy" style={{ borderColor: "var(--navy)" }}>
              <div className="flex items-center gap-2.5">
                <div className="hotspot flex-shrink-0" style={{ position: "static", animation: "none" }}>{info.id}</div>
                <div className="display text-2xl">{info.title}</div>
              </div>
              <p className="mt-3 text-base">{info.text}</p>
            </div>
          )}
          <div className="card">
            <div className="display text-lg">Rozměry hřiště</div>
            <ul className="pl-[18px] mt-2 text-sm" style={{ lineHeight: 1.7 }}>
              <li>Délka: <b>90–120 m</b></li>
              <li>Šířka: <b>45–90 m</b></li>
              <li>Mezinárodní zápasy: <b>100–110 × 64–75 m</b></li>
              <li>Branka: <b>7,32 × 2,44 m</b></li>
              <li>Pokutové území: <b>16,5 m</b> od branky</li>
              <li>Penalta: <b>11 m</b> od brankové čáry</li>
              <li>Středový kruh: <b>9,15 m</b> poloměr</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PitchPage;
