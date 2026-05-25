import { PitchSVG, Player, Ball, Scrubber } from "../../components";
import { useTimeline } from "../../hooks/useTimeline.js";
import { interpAt } from "../../lib/pitchGeometry.js";

export function DefenseAnim({ highlight }) {
  const DUR = 5;
  const { time, setTime, playing, setPlaying } = useTimeline(DUR, false);
  const attacker = interpAt([{t:0,x:75,y:30},{t:DUR,x:35,y:30}], time);
  const def = interpAt([{t:0,x:60,y:30},{t:DUR,x:25,y:30}], time);
  const support = interpAt([{t:0,x:45,y:18},{t:DUR,x:30,y:24}], time);
  const support2 = interpAt([{t:0,x:45,y:42},{t:DUR,x:30,y:38}], time);
  const ball = interpAt([{t:0,x:75,y:30},{t:DUR,x:35,y:30}], time);
  return (
    <div>
      <PitchSVG>
        {/* Highlight overlays */}
        {highlight === "between" && (
          <g>
            <line x1={attacker.x} y1={attacker.y} x2={5} y2={32}
                  stroke="#F2A007" strokeWidth="0.4" strokeDasharray="1 0.6"/>
            <circle cx={def.x} cy={def.y} r="5.5" fill="none" stroke="#F2A007" strokeWidth="0.7"/>
            <text x={def.x} y={def.y - 6.5} textAnchor="middle" fontSize="2.4" fontWeight="800"
                  fill="#F2A007" fontFamily="Bricolage Grotesque, sans-serif">Mezi soupeřem a brankou</text>
          </g>
        )}
        {highlight === "ball-player" && (
          <g>
            <circle cx={attacker.x} cy={attacker.y} r="5" fill="none" stroke="#F2A007" strokeWidth="0.6" strokeDasharray="1 0.6"/>
            <circle cx={ball.x} cy={ball.y} r="3" fill="none" stroke="#F2A007" strokeWidth="0.6"/>
            <text x={50} y={8} textAnchor="middle" fontSize="2.4" fontWeight="800"
                  fill="#F2A007" fontFamily="Bricolage Grotesque, sans-serif">Sleduj míč i hráče</text>
          </g>
        )}
        {highlight === "comm" && (
          <g>
            <circle cx={support.x} cy={support.y} r="5" fill="none" stroke="#F2A007" strokeWidth="0.6" strokeDasharray="0.8 0.6"/>
            <circle cx={support2.x} cy={support2.y} r="5" fill="none" stroke="#F2A007" strokeWidth="0.6" strokeDasharray="0.8 0.6"/>
            <text x={50} y={56} textAnchor="middle" fontSize="2.4" fontWeight="800"
                  fill="#F2A007" fontFamily="Bricolage Grotesque, sans-serif">Křič na spoluhráče</text>
          </g>
        )}
        {highlight === "patience" && (
          <g>
            <circle cx={def.x} cy={def.y} r="6" fill="none" stroke="#F2A007" strokeWidth="0.7" strokeDasharray="1 0.6"/>
            <text x={def.x} y={def.y + 8.5} textAnchor="middle" fontSize="2.4" fontWeight="800"
                  fill="#F2A007" fontFamily="Bricolage Grotesque, sans-serif">Čekej na souboj</text>
          </g>
        )}

        <Player x={attacker.x} y={attacker.y} team="away" num="9" size={3}/>
        <Player x={def.x} y={def.y} team="home" num="4" size={3} glow/>
        <Player x={support.x} y={support.y} team="home" num="5" size={3}/>
        <Player x={support2.x} y={support2.y} team="home" num="6" size={3}/>
        <Player x={5} y={32} team="gk" num="1" size={3}/>
        <Ball x={ball.x} y={ball.y}/>
        <text x={def.x} y={def.y - 5} fontSize="2" fontWeight="800" fill="#F2A007" fontFamily="Bricolage Grotesque, sans-serif">↓ Hlavní obránce</text>
      </PitchSVG>
      <Scrubber duration={DUR} value={time} onChange={setTime} playing={playing} onPlay={() => setPlaying(!playing)}/>
    </div>
  );
}

export default DefenseAnim;
