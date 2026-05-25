import { PitchSVG, Player, Ball, Arrow, Scrubber } from "../../components";
import { useTimeline } from "../../hooks/useTimeline.js";
import { interpAt } from "../../lib/pitchGeometry.js";

export function AttackAnim({ highlight }) {
  const DUR = 5;
  const { time, setTime, playing, setPlaying } = useTimeline(DUR, false);
  const p10 = interpAt([{t:0,x:30,y:32},{t:1.5,x:30,y:32},{t:DUR,x:30,y:32}], time);
  const p7  = interpAt([{t:0,x:45,y:14},{t:2,x:60,y:12},{t:DUR,x:75,y:14}], time);
  const p9  = interpAt([{t:0,x:55,y:32},{t:1.5,x:70,y:30},{t:DUR,x:85,y:28}], time);
  const p11 = interpAt([{t:0,x:45,y:50},{t:2,x:60,y:52},{t:DUR,x:75,y:50}], time);
  const ball = interpAt([{t:0,x:30,y:32},{t:1.5,x:30,y:32},{t:2.7,x:70,y:30},{t:DUR,x:85,y:28}], time);

  return (
    <div>
      <PitchSVG>
        <Arrow x1={30} y1={32} x2={70} y2={30} dashed color="#F2A007"/>

        {/* Highlight rings */}
        {highlight === "fast" && (
          <g>
            <circle cx={p10.x} cy={p10.y} r="5.5" fill="none" stroke="#F2A007" strokeWidth="0.7" strokeDasharray="1 0.6"/>
            <text x={p10.x} y={p10.y - 6.5} textAnchor="middle" fontSize="2.4" fontWeight="800" fill="#F2A007" fontFamily="Bricolage Grotesque, sans-serif">Rychle vpřed →</text>
          </g>
        )}
        {highlight === "overview" && (
          <g>
            {[p10, p7, p9, p11].map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r="5" fill="none" stroke="#F2A007" strokeWidth="0.5" strokeDasharray="0.8 0.6"/>
            ))}
            <text x={50} y={6} textAnchor="middle" fontSize="2.4" fontWeight="800" fill="#F2A007" fontFamily="Bricolage Grotesque, sans-serif">Vidíš všechny spoluhráče?</text>
          </g>
        )}
        {highlight === "run" && (
          <g>
            <circle cx={p7.x} cy={p7.y} r="5.5" fill="none" stroke="#F2A007" strokeWidth="0.7" strokeDasharray="1 0.6"/>
            <circle cx={p11.x} cy={p11.y} r="5.5" fill="none" stroke="#F2A007" strokeWidth="0.7" strokeDasharray="1 0.6"/>
            <text x={75} y={8} textAnchor="middle" fontSize="2.4" fontWeight="800" fill="#F2A007" fontFamily="Bricolage Grotesque, sans-serif">Náběh z křídla</text>
          </g>
        )}
        {highlight === "shoot" && (
          <g>
            <circle cx={p9.x} cy={p9.y} r="5.5" fill="none" stroke="#F2A007" strokeWidth="0.7" strokeDasharray="1 0.6"/>
            <Arrow x1={p9.x} y1={p9.y} x2={98} y2={32} color="#F2A007" width={0.5}/>
            <text x={p9.x} y={p9.y - 6.5} textAnchor="middle" fontSize="2.4" fontWeight="800" fill="#F2A007" fontFamily="Bricolage Grotesque, sans-serif">Střela!</text>
          </g>
        )}

        <Player x={p10.x} y={p10.y} team="home" num="10" size={3}/>
        <Player x={p9.x} y={p9.y} team="home" num="9" size={3}/>
        <Player x={p7.x} y={p7.y} team="home" num="7" size={3}/>
        <Player x={p11.x} y={p11.y} team="home" num="11" size={3}/>
        <Player x={75} y={32} team="away" num="" size={3}/>
        <Player x={80} y={20} team="away" num="" size={3}/>
        <Player x={80} y={44} team="away" num="" size={3}/>
        <Ball x={ball.x} y={ball.y}/>
      </PitchSVG>
      <Scrubber duration={DUR} value={time} onChange={setTime} playing={playing} onPlay={() => setPlaying(!playing)}/>
    </div>
  );
}

export default AttackAnim;
