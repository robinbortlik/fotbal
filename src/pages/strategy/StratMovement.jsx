import { PitchSVG, Player, Ball, Arrow, Scrubber, MascotSay } from "../../components";
import { useTimeline } from "../../hooks/useTimeline.js";
import { interpAt } from "../../lib/pitchGeometry.js";

/* --- Movement without ball --- */
export function StratMovement() {
  const DUR = 5;
  const { time, setTime, playing, setPlaying } = useTimeline(DUR, false);
  // Player without ball makes a run to receive
  const ballHolder = [{t:0,x:35,y:36},{t:1.5,x:35,y:36},{t:2.5,x:65,y:18},{t:DUR,x:65,y:18}];
  const runner = [{t:0,x:50,y:32},{t:2.5,x:65,y:18},{t:DUR,x:80,y:18}];
  const ball = [{t:0,x:35,y:36},{t:1.5,x:35,y:36},{t:2.5,x:65,y:18},{t:DUR,x:80,y:18}];
  const def = [{t:0,x:60,y:32},{t:DUR,x:62,y:30}];
  const holder = interpAt(ballHolder, time);
  const run = interpAt(runner, time);
  const b = interpAt(ball, time);
  const d = interpAt(def, time);
  return (
    <div className="hero-grid grid grid-cols-1 md:grid-cols-hero gap-5 md:gap-6">
      <div className="pitch-wrap">
        <PitchSVG>
          <Arrow x1={50} y1={32} x2={65} y2={18} dashed color="#F2A007" width={0.4}/>
          <Arrow x1={35} y1={36} x2={65} y2={18} dashed color="#fff" width={0.4}/>
          <Player x={holder.x} y={holder.y} team="home" num="10" size={3}/>
          <Player x={run.x} y={run.y} team="home" num="9" size={3} glow={time > 1 && time < 3}/>
          <Player x={d.x} y={d.y} team="away" num="4" size={3}/>
          <Ball x={b.x} y={b.y}/>
          <text x={75} y={14} fontSize="2.4" fontWeight="800" fill="#F2A007" fontFamily="Bricolage Grotesque, sans-serif">VOLNÝ PROSTOR ↗</text>
        </PitchSVG>
        <Scrubber duration={DUR} value={time} onChange={setTime} playing={playing} onPlay={() => setPlaying(!playing)}/>
      </div>
      <div className="flex flex-col gap-3.5">
        <MascotSay mood="wink">Pohyb je půlka fotbalu. Když nemáš míč, NEHÝBEŠ se? Tak nehraješ — jen koukáš!</MascotSay>
        <div className="card">
          <div className="display text-[22px]">Tři pravidla pohybu</div>
          <ol className="pl-[22px] leading-loose mt-2">
            <li><b>Hledej prostor.</b> Tam, kde nikdo není, je tvoje šance.</li>
            <li><b>Běž do volného místa,</b> ne tam, kde už spoluhráč je.</li>
            <li><b>Komunikuj!</b> Kývni, mávej, křič — ať tě spoluhráč vidí.</li>
          </ol>
        </div>
        <div className="card orange">
          <b>Tip Kopíka:</b> "Před přihrávkou se zastav, naznač, kam chceš jít, pak změň směr a vyběhni. Obránce tě nestihne!"
        </div>
      </div>
    </div>
  );
}

export default StratMovement;
