import { useState } from "react";
import { PitchSVG, Player, Ball, Arrow, Scrubber, MascotSay } from "../../components";
import { useTimeline } from "../../hooks/useTimeline.js";

/* --- Passing --- */
export function StratPassing() {
  const [type, setType] = useState("short");
  const DUR = 4;
  const { time, setTime, playing, setPlaying } = useTimeline(DUR, false);
  const configs = {
    short: { label: "Krátká přihrávka", desc: "Po zemi, na nohu spoluhráče. Bezpečné, přesné.",
      from: [42, 32], to: [55, 30], color: "#F2A007" },
    long: { label: "Dlouhá přihrávka", desc: "Vzduchem přes půl hřiště. Riskantní, ale rychlá.",
      from: [25, 32], to: [80, 20], color: "#0B1F33" },
    through: { label: "Průniková přihrávka", desc: "Mezi obránce do volného prostoru pro útočníka.",
      from: [50, 38], to: [80, 32], color: "#0E8A4F" },
    cross: { label: "Centr", desc: "Z křídla doprostřed pokutového území, na hlavu útočníkovi.",
      from: [85, 8], to: [88, 32], color: "#7CD3A0" },
  };
  const cfg = configs[type];
  // Ball arc: simple parabola in y if "long" or "cross"
  const t = Math.min(1, Math.max(0, (time - 1.2) / 1.8));
  const ease = t < 0.5 ? 2*t*t : 1 - Math.pow(-2*t+2,2)/2;
  const bx = cfg.from[0] + (cfg.to[0] - cfg.from[0]) * ease;
  const by = cfg.from[1] + (cfg.to[1] - cfg.from[1]) * ease;
  const arc = (type === "long" || type === "cross") ? -Math.sin(t * Math.PI) * 4 : 0;
  return (
    <div className="hero-grid grid grid-cols-1 md:grid-cols-hero gap-5 md:gap-6">
      <div className="pitch-wrap">
        <PitchSVG>
          <Arrow x1={cfg.from[0]} y1={cfg.from[1]} x2={cfg.to[0]} y2={cfg.to[1]} dashed color={cfg.color}/>
          <Player x={cfg.from[0]} y={cfg.from[1]} team="home" num="10" size={3}/>
          <Player x={cfg.to[0]} y={cfg.to[1]} team="home" num="9" size={3} glow={t > 0.8}/>
          {type === "cross" && [[70, 36],[68, 28]].map(([x,y],i) => <Player key={i} x={x} y={y} team="away" num="" size={2.6}/>)}
          {type === "through" && [[65, 26],[65, 36]].map(([x,y],i) => <Player key={i} x={x} y={y} team="away" num="" size={2.6}/>)}
          {type === "long" && [[50, 32]].map(([x,y],i) => <Player key={i} x={x} y={y} team="away" num="" size={2.6}/>)}
          <Ball x={bx} y={by + arc}/>
        </PitchSVG>
        <Scrubber duration={DUR} value={time} onChange={setTime} playing={playing} onPlay={() => setPlaying(!playing)}/>
      </div>
      <div className="flex flex-col gap-3">
        <MascotSay>Přihrávek je víc druhů. Každá se hodí na jinou situaci. Zkus si je!</MascotSay>
        {Object.entries(configs).map(([k, v]) => (
          <button key={k} className="tile p-3.5" onClick={() => { setType(k); setTime(0); }} style={{
            borderColor: type === k ? "var(--orange)" : "var(--navy)",
            boxShadow: type === k ? "0 3px 0 var(--orange-deep)" : "var(--shadow)",
          }}>
            <div className="flex gap-3 items-center">
              <div className="w-3.5 h-3.5 rounded-[7px] border-2 border-navy" style={{ background: v.color }}/>
              <div className="text-left">
                <div className="font-display font-extrabold text-lg">{v.label}</div>
                <div className="text-sm text-navySoft">{v.desc}</div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default StratPassing;
