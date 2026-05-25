import { useState } from "react";
import { PitchSVG, Player, Ball, Arrow, Scrubber } from "../../components";
import { useTimeline } from "../../hooks/useTimeline.js";
import { PITCH_H, interpAt } from "../../lib/pitchGeometry.js";
import { RuleShell } from "./RuleShell.jsx";

/* --- OFFSIDE --- */
export function RuleOffside() {
  const DUR = 6;
  const { time, setTime, playing, setPlaying } = useTimeline(DUR, false);

  // Scene: attacker (yellow #9) runs from x=40 to x=85. Passer #10 stays. Last defender #4 at x=72.
  // Ball is passed at t=2 from passer to attacker — at moment of pass, #9 is at x=63 (BEFORE last defender → onside? No, 63 < 72 means closer to own goal — onside)
  // We'll make TWO scenarios with toggle.
  const [scenario, setScenario] = useState("offside");

  const config = scenario === "offside" ? {
    passer: [{t:0,x:40,y:48},{t:DUR,x:40,y:48}],
    attacker: [{t:0,x:55,y:24},{t:2,x:76,y:22},{t:DUR,x:92,y:18}], // attacker beyond defender at pass time
    defender: [{t:0,x:72,y:30},{t:DUR,x:72,y:30}],
    ball: [{t:0,x:40,y:48},{t:2,x:40,y:48},{t:3.4,x:85,y:22},{t:DUR,x:85,y:22}],
    passT: 2,
  } : {
    passer: [{t:0,x:40,y:48},{t:DUR,x:40,y:48}],
    attacker: [{t:0,x:50,y:24},{t:2,x:60,y:22},{t:DUR,x:88,y:18}], // attacker behind defender at pass time
    defender: [{t:0,x:72,y:30},{t:DUR,x:72,y:30}],
    ball: [{t:0,x:40,y:48},{t:2,x:40,y:48},{t:3.4,x:85,y:22},{t:DUR,x:85,y:22}],
    passT: 2,
  };

  const passer = interpAt(config.passer, time);
  const attacker = interpAt(config.attacker, time);
  const defender = interpAt(config.defender, time);
  const ball = interpAt(config.ball, time);

  const isPassMoment = Math.abs(time - config.passT) < 0.15;
  // Determine ofside at moment of pass
  const attackerAtPass = interpAt(config.attacker, config.passT);
  const defenderAtPass = interpAt(config.defender, config.passT);
  const isOffside = attackerAtPass.x > defenderAtPass.x;

  const steps = ["Hráč drží míč", "Útočník se rozbíhá", "Přihrávka", "Pozice ofsajdu?", "Výsledek"];
  const currentStep = time < 1 ? 0 : time < 2 ? 1 : time < 2.2 ? 2 : time < 4 ? 3 : 4;

  return (
    <RuleShell
      kicker="02 / Ofsajd"
      title="Ofsajd — pravidlo, které matě nejvíc lidí"
      lead="Útočník nesmí stát blíž k bráně soupeře než předposlední soupeř, KDYŽ mu jde míč."
      mascotText={<>
        <b>Důležitá věta:</b> Ofsajd se posuzuje v okamžiku, kdy spoluhráč přihrává — ne když útočník míč přebírá. Klikni na <span className="pill orange">Přehrát</span> a sleduj zelenou čáru posledního obránce.
      </>}
      sideSlot={
        <div className="flex flex-col gap-3.5">
          <div className="card">
            <div className="display text-xl">Co sleduješ?</div>
            <ul className="pl-4.5 leading-relaxed mt-1.5 text-[15px]">
              <li><span className="pill orange" style={{ padding: "2px 8px" }}>9</span> útočník</li>
              <li><span className="pill orange" style={{ padding: "2px 8px" }}>10</span> přihrávající</li>
              <li><span className="pill navy" style={{ padding: "2px 8px" }}>4</span> poslední obránce</li>
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
                : "V okamžiku přihrávky byl útočník na úrovni nebo ZA posledním obráncem. Pokračuje se ve hře."}
            </p>
          </div>
          <div className="pill-row">
            <button className={"step-chip " + (scenario === "offside" ? "active" : "")} onClick={() => { setScenario("offside"); setTime(0); }}>Scénář A: Ofsajd</button>
            <button className={"step-chip " + (scenario === "onside" ? "active" : "")} onClick={() => { setScenario("onside"); setTime(0); }}>Scénář B: V pořádku</button>
          </div>
        </div>
      }
      pitchSlot={
        <div className="pitch-wrap">
          <PitchSVG>
            {/* Offside line at last defender x */}
            <line x1={defender.x} y1={1} x2={defender.x} y2={PITCH_H-1} stroke="#7CD3A0" strokeWidth="0.5" strokeDasharray="1.5 1"/>
            {/* Ball trajectory hint */}
            <Arrow x1={passer.x} y1={passer.y} x2={interpAt(config.ball, 3.4).x} y2={interpAt(config.ball, 3.4).y} dashed color="rgba(255,255,255,0.5)" width={0.4}/>
            {/* Players */}
            <Player x={passer.x} y={passer.y} team="home" num="10" size={3}/>
            <Player x={attacker.x} y={attacker.y} team="home" num="9" size={3} glow={isPassMoment}/>
            <Player x={defender.x} y={defender.y} team="away" num="4" size={3}/>
            <Player x={20} y={32} team="away" num="6" size={3}/>
            <Player x={97} y={32} team="gk" num="1" size={3}/>
            <Ball x={ball.x} y={ball.y}/>
            {isPassMoment && (
              <text x={defender.x + 1} y={6} fontSize="2.8" fontWeight="800" fill="#7CD3A0" fontFamily="Bricolage Grotesque, sans-serif">LINIE OFSAJDU</text>
            )}
          </PitchSVG>
          <Scrubber duration={DUR} value={time} onChange={setTime} playing={playing} onPlay={() => setPlaying(!playing)}
            steps={steps} currentStep={currentStep} onStepChange={(i) => setTime([0.5, 1.5, 2, 3, 4.5][i])}/>
        </div>
      }
    />
  );
}

export default RuleOffside;
