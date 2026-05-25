import { useRef, useState } from "react";
import { PitchSVG, Player, Ball, Arrow, Scrubber } from "../../components";
import { useTimeline } from "../../hooks/useTimeline.js";
import { PITCH_H, PITCH_W, interpAt } from "../../lib/pitchGeometry.js";
import { RuleShell } from "./RuleShell.jsx";

function svgPoint(svg, e) {
  const pt = svg.createSVGPoint();
  const touch = e.touches?.[0] || e.changedTouches?.[0];
  pt.x = touch ? touch.clientX : e.clientX;
  pt.y = touch ? touch.clientY : e.clientY;
  const m = svg.getScreenCTM();
  if (!m) return null;
  return pt.matrixTransform(m.inverse());
}

function clamp(n, lo, hi) {
  return Math.max(lo, Math.min(hi, n));
}

/* --- OFFSIDE --- */
export function RuleOffside() {
  const DUR = 6;
  const { time, setTime, playing, setPlaying } = useTimeline(DUR, false);

  // Two pre-recorded scenarios + an interactive "Hraj si" mode.
  const [scenario, setScenario] = useState("offside");
  const [playMode, setPlayMode] = useState(false);
  const [dragX, setDragX] = useState(72); // defender x in play mode
  const [draggingDef, setDraggingDef] = useState(false);
  const svgRef = useRef(null);

  const config = scenario === "offside" ? {
    passer: [{t:0,x:40,y:48},{t:DUR,x:40,y:48}],
    attacker: [{t:0,x:55,y:24},{t:2,x:76,y:22},{t:DUR,x:92,y:18}],
    defender: [{t:0,x:72,y:30},{t:DUR,x:72,y:30}],
    ball: [{t:0,x:40,y:48},{t:2,x:40,y:48},{t:3.4,x:85,y:22},{t:DUR,x:85,y:22}],
    passT: 2,
  } : {
    passer: [{t:0,x:40,y:48},{t:DUR,x:40,y:48}],
    attacker: [{t:0,x:50,y:24},{t:2,x:60,y:22},{t:DUR,x:88,y:18}],
    defender: [{t:0,x:72,y:30},{t:DUR,x:72,y:30}],
    ball: [{t:0,x:40,y:48},{t:2,x:40,y:48},{t:3.4,x:85,y:22},{t:DUR,x:85,y:22}],
    passT: 2,
  };

  // When play mode is active, freeze the scene at the moment of pass.
  const passer = interpAt(config.passer, playMode ? config.passT : time);
  const attacker = interpAt(config.attacker, playMode ? config.passT : time);
  const defenderAnim = interpAt(config.defender, playMode ? config.passT : time);
  const defender = playMode ? { x: dragX, y: defenderAnim.y } : defenderAnim;
  const ball = interpAt(config.ball, playMode ? config.passT : time);

  const isPassMoment = playMode || Math.abs(time - config.passT) < 0.15;
  const attackerAtPass = interpAt(config.attacker, config.passT);
  const defenderAtPass = playMode ? { x: dragX } : interpAt(config.defender, config.passT);
  const isOffside = attackerAtPass.x > defenderAtPass.x;

  const steps = ["Hráč drží míč", "Útočník se rozbíhá", "Přihrávka", "Pozice ofsajdu?", "Výsledek"];
  const currentStep = playMode ? 3 : (time < 1 ? 0 : time < 2 ? 1 : time < 2.2 ? 2 : time < 4 ? 3 : 4);

  function enterPlay() {
    setPlaying(false);
    setPlayMode(true);
    setDragX(interpAt(config.defender, config.passT).x);
  }
  function exitPlay() {
    setPlayMode(false);
    setDraggingDef(false);
  }

  function onSvgDown(e) {
    if (!playMode) return;
    const svg = svgRef.current;
    if (!svg) return;
    const p = svgPoint(svg, e);
    if (!p) return;
    // Pick up only if pointer is near the defender
    if (Math.abs(p.x - defender.x) < 5 && Math.abs(p.y - defender.y) < 6) {
      setDraggingDef(true);
      setDragX(clamp(p.x, 14, PITCH_W - 6));
      e.preventDefault();
    }
  }
  function onSvgMove(e) {
    if (!playMode || !draggingDef) return;
    const svg = svgRef.current;
    if (!svg) return;
    const p = svgPoint(svg, e);
    if (!p) return;
    setDragX(clamp(p.x, 14, PITCH_W - 6));
    e.preventDefault();
  }
  function onSvgUp() {
    if (draggingDef) setDraggingDef(false);
  }

  return (
    <RuleShell
      kicker="02 / Ofsajd"
      title="Ofsajd — pravidlo, které mate nejvíc lidí"
      lead="Útočník nesmí stát blíž k bráně soupeře než předposlední soupeř, KDYŽ mu jde míč."
      mascotText={<>
        <b>Důležitá věta:</b> Ofsajd se posuzuje v okamžiku, kdy spoluhráč přihrává — ne když útočník míč přebírá. {!playMode && <>Klikni na <span className="pill orange">Přehrát</span> a sleduj zelenou čáru posledního obránce.</>}
        {playMode && <>Teď ty! Posuň obránce (<b>#4</b>) doleva nebo doprava a koukni, jak se mění verdikt.</>}
      </>}
      sideSlot={
        <div className="flex flex-col gap-3.5">
          <div className="card">
            <div className="display text-xl">Co sleduješ?</div>
            <ul className="pl-4.5 leading-relaxed mt-1.5 text-[15px]">
              <li><span className="pill orange" style={{ padding: "2px 8px" }}>9</span> útočník</li>
              <li><span className="pill orange" style={{ padding: "2px 8px" }}>10</span> přihrávající</li>
              <li><span className="pill navy" style={{ padding: "2px 8px" }}>4</span> {playMode ? "obránce (přetáhni!)" : "poslední obránce"}</li>
              <li>Zelená čára = pomyslná linie ofsajdu</li>
            </ul>
          </div>
          <div className="card" style={{ background: isOffside ? "#ffe9d6" : "#dff5e6", borderColor: isOffside ? "#d18800" : "var(--pitch-dark)" }}>
            <div className="display text-[22px]" style={{ color: isOffside ? "#a85a00" : "#084d2c" }}>
              {isOffside ? "🚩 Ofsajd!" : "✓ V pořádku"}
            </div>
            <p className="mt-1.5 text-[15px]">
              {isOffside
                ? "V okamžiku přihrávky byl útočník BLÍŽ k bráně než předposlední soupeř. Sudí píská ofsajd a tým ztrácí míč."
                : "V okamžiku přihrávky byl útočník na úrovni nebo dál od brány než předposlední soupeř (typicky obránce). Pokračuje se ve hře."}
            </p>
          </div>
          <div className="pill-row">
            <button className={"step-chip " + (!playMode && scenario === "offside" ? "active" : "")}
                    onClick={() => { setScenario("offside"); setTime(0); exitPlay(); }}>Scénář A: Ofsajd</button>
            <button className={"step-chip " + (!playMode && scenario === "onside" ? "active" : "")}
                    onClick={() => { setScenario("onside"); setTime(0); exitPlay(); }}>Scénář B: V pořádku</button>
          </div>
          <div className="pill-row">
            <button className={"step-chip " + (playMode ? "active" : "")}
                    onClick={() => playMode ? exitPlay() : enterPlay()}>
              🎮 {playMode ? "Konec hry — zpět na scénáře" : "Hraj si — posouvej obránce"}
            </button>
          </div>
        </div>
      }
      pitchSlot={
        <div className="pitch-wrap">
          <svg
            ref={svgRef}
            className="pitch-svg"
            viewBox={`0 0 ${PITCH_W} ${PITCH_H}`}
            preserveAspectRatio="xMidYMid meet"
            onMouseDown={onSvgDown}
            onMouseMove={onSvgMove}
            onMouseUp={onSvgUp}
            onMouseLeave={onSvgUp}
            onTouchStart={onSvgDown}
            onTouchMove={onSvgMove}
            onTouchEnd={onSvgUp}
            style={{ touchAction: playMode ? "none" : "auto", cursor: playMode ? (draggingDef ? "grabbing" : "grab") : "default" }}
          >
            <PitchSVG/>
            {/* Offside line at defender x */}
            <line x1={defender.x} y1={1} x2={defender.x} y2={PITCH_H-1} stroke="#7CD3A0" strokeWidth="0.5" strokeDasharray="1.5 1"/>
            {/* Ball trajectory hint (scrub mode only — in play mode the moment is frozen at the pass) */}
            {!playMode && (
              <Arrow x1={passer.x} y1={passer.y} x2={interpAt(config.ball, 3.4).x} y2={interpAt(config.ball, 3.4).y} dashed color="rgba(255,255,255,0.5)" width={0.4}/>
            )}
            {/* Players */}
            <Player x={passer.x} y={passer.y} team="home" num="10" size={3}/>
            <Player x={attacker.x} y={attacker.y} team="home" num="9" size={3} glow={isPassMoment}/>
            <Player x={defender.x} y={defender.y} team="away" num="4" size={3} glow={playMode}/>
            <Player x={20} y={32} team="away" num="6" size={3}/>
            <Player x={97} y={32} team="gk" num="1" size={3}/>
            <Ball x={ball.x} y={ball.y}/>
            {isPassMoment && (
              <text x={clamp(defender.x + 1, 4, 80)} y={6} fontSize="2.8" fontWeight="800" fill="#7CD3A0" fontFamily="Bricolage Grotesque, sans-serif">LINIE OFSAJDU</text>
            )}
            {playMode && (
              <text x={defender.x} y={defender.y + 6.5} fontSize="2.2" fontWeight="800" fill="#F2A007" textAnchor="middle" fontFamily="Bricolage Grotesque, sans-serif">↔ přetáhni</text>
            )}
          </svg>
          {!playMode && (
            <Scrubber duration={DUR} value={time} onChange={setTime} playing={playing} onPlay={() => setPlaying(!playing)}
              steps={steps} currentStep={currentStep} onStepChange={(i) => setTime([0.5, 1.5, 2, 3, 4.5][i])}/>
          )}
        </div>
      }
    />
  );
}

export default RuleOffside;
