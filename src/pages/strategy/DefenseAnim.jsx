import { PitchSVG, Player, Ball, Scrubber } from "../../components";
import { useTimeline } from "../../hooks/useTimeline.js";
import { interpAt } from "../../lib/pitchGeometry.js";

export function DefenseAnim() {
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
