import { useState } from "react";
import { PitchSVG, Player, Ball, Arrow, Scrubber } from "../../components";
import { useTimeline } from "../../hooks/useTimeline.js";
import { interpAt } from "../../lib/pitchGeometry.js";
import { RuleShell } from "./RuleShell.jsx";

/* --- PENALTY ---
   Preserves the SVG createSVGPoint + getScreenCTM().inverse() coordinate
   transform verbatim (plan §11 risk #5). */
export function RulePenalty() {
  const DUR = 3;
  const { time, setTime, playing, setPlaying } = useTimeline(DUR, false);
  const [target, setTarget] = useState({ x: 99, y: 28 }); // user-selectable shot target
  const ballTrack = [{t:0,x:90,y:32},{t:1.2,x:90,y:32},{t:2.4,x:target.x,y:target.y},{t:DUR,x:target.x,y:target.y}];
  const ball = interpAt(ballTrack, time);
  const gkTrack = [{t:0,x:99,y:32},{t:1.2,x:99,y:32},{t:2.4,x:99,y:32 + (target.y > 32 ? -3 : 3)}]; // gk dives wrong way
  const gk = interpAt(gkTrack, time);
  const shooter = interpAt([{t:0,x:88,y:32},{t:1.2,x:90,y:32},{t:1.6,x:90,y:32},{t:DUR,x:88,y:32}], time);
  return (
    <RuleShell
      kicker="05 / Penalta"
      title="Penalta — souboj jeden na jednoho"
      lead="Když nastane faul v pokutovém území, druhý tým kope penaltu z 11 metrů. Branka a brankář. Nic jiného."
      mascotText="Klikni do branky a vyber, kam chceš kopnout! Pak zmáčkni Přehrát."
      sideSlot={
        <div className="card">
          <div className="display text-xl">Pravidla penalty</div>
          <ul className="pl-4.5 leading-relaxed text-[15px] mt-2">
            <li>Z 11 metrů od branky</li>
            <li>Jen <b>brankář vs. střelec</b></li>
            <li>Ostatní stojí mimo vápno</li>
            <li>Brankář se nesmí pohnout dopředu před výstřelem</li>
            <li>Střelec střelí jen jednou</li>
          </ul>
        </div>
      }
      pitchSlot={
        <div className="pitch-wrap">
          <PitchSVG halfOnly="right">
            <Player x={shooter.x} y={shooter.y} team="home" num="9" size={3.5}/>
            <Player x={gk.x} y={gk.y} team="gk" num="1" size={3.5}/>
            <Ball x={ball.x} y={ball.y} size={2}/>
            <Arrow x1={90} y1={32} x2={target.x} y2={target.y} dashed color="#F2A007" width={0.5}/>
            {/* target click area: goal mouth — visible */}
            <rect x={98} y={28} width={3} height={8} fill="rgba(242,160,7,0.15)" stroke="#F2A007" strokeWidth="0.3" strokeDasharray="0.6 0.6"
              style={{ pointerEvents: "none" }}/>
            {/* invisible hit overlay inflated +4 SVG units per side, painted AFTER so it wins pointer events */}
            <rect x={94} y={24} width={11} height={16} fill="transparent" pointerEvents="all"
              onClick={(e) => {
                const svg = e.currentTarget.ownerSVGElement;
                const pt = svg.createSVGPoint();
                pt.x = e.clientX; pt.y = e.clientY;
                const c = pt.matrixTransform(svg.getScreenCTM().inverse());
                setTarget({ x: Math.max(98.5, Math.min(99.8, c.x)), y: Math.max(28.5, Math.min(35.5, c.y)) });
                setTime(0);
              }}
              style={{ cursor: "crosshair" }}/>
            <text x={88} y={26} fontSize="2" fontWeight="700" fill="#F2A007" fontFamily="Bricolage Grotesque, sans-serif">↑ Klikni do branky</text>
          </PitchSVG>
          <Scrubber duration={DUR} value={time} onChange={setTime} playing={playing} onPlay={() => setPlaying(!playing)}/>
        </div>
      }
    />
  );
}

export default RulePenalty;
