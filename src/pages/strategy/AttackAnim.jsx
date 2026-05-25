import { PitchSVG, Player, Ball, Arrow, Scrubber } from "../../components";
import { useTimeline } from "../../hooks/useTimeline.js";
import { interpAt } from "../../lib/pitchGeometry.js";

export function AttackAnim() {
  const DUR = 5;
  const { time, setTime, playing, setPlaying } = useTimeline(DUR, false);
  const p10 = interpAt([{t:0,x:30,y:32},{t:1.5,x:30,y:32},{t:DUR,x:30,y:32}], time);
  const p7 = interpAt([{t:0,x:45,y:14},{t:2,x:60,y:12},{t:DUR,x:75,y:14}], time);
  const p9 = interpAt([{t:0,x:55,y:32},{t:1.5,x:70,y:30},{t:DUR,x:85,y:28}], time);
  const p11 = interpAt([{t:0,x:45,y:50},{t:2,x:60,y:52},{t:DUR,x:75,y:50}], time);
  const ball = interpAt([{t:0,x:30,y:32},{t:1.5,x:30,y:32},{t:2.7,x:70,y:30},{t:DUR,x:85,y:28}], time);
  return (
    <div>
      <PitchSVG>
        <Arrow x1={30} y1={32} x2={70} y2={30} dashed color="#F2A007"/>
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
