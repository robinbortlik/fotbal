import { Link } from "react-router-dom";
import { PitchSVG, Player, MascotSay } from "../../components";

/* --- Positions overview (teaser linking to /pozice for the deep dive) --- */
const ZONES = [
  { name: "Brankář", x: 4, y: 32, color: "#7CD3A0", w: 12, h: 24 },
  { name: "Obrana", x: 22, y: 32, color: "#9BB4D6", w: 18, h: 48 },
  { name: "Záloha", x: 45, y: 32, color: "#F2C572", w: 22, h: 50 },
  { name: "Útok", x: 75, y: 32, color: "#E8835A", w: 20, h: 44 },
];

export function StratPositions() {
  return (
    <div className="hero-grid grid grid-cols-1 md:grid-cols-hero gap-5 md:gap-6">
      <div className="pitch-wrap">
        <PitchSVG>
          {ZONES.map((z, i) => (
            <g key={i}>
              <rect x={z.x - z.w/2} y={z.y - z.h/2} width={z.w} height={z.h} fill={z.color} opacity="0.45" rx="2"/>
              <text x={z.x} y={z.y - z.h/2 - 1.5} textAnchor="middle" fontWeight="800" fontSize="2.6" fill="white" fontFamily="Bricolage Grotesque, sans-serif">{z.name.toUpperCase()}</text>
            </g>
          ))}
          <Player x={5} y={32} team="gk" num="1" size={2.8}/>
          {[[22,18],[22,30],[22,40],[22,52]].map(([x,y],i) => <Player key={"d"+i} x={x} y={y} team="home" num="" size={2.4}/>)}
          {[[45,18],[45,30],[45,40],[45,52]].map(([x,y],i) => <Player key={"m"+i} x={x} y={y} team="home" num="" size={2.4}/>)}
          {[[72,22],[78,32],[72,42]].map(([x,y],i) => <Player key={"a"+i} x={x} y={y} team="home" num="" size={2.4}/>)}
        </PitchSVG>
      </div>
      <div className="flex flex-col gap-3.5">
        <MascotSay>Každý hráč má svou zónu, kde má hlavně být — brankář, obrana, záloha, útok. Ale fotbal žije pohybem, nestůj na místě!</MascotSay>
        <div className="card">
          <div className="display text-xl">Detaily ke všem 9 pozicím</div>
          <p className="mt-1.5 text-[15px] opacity-90">
            Tady vidíš jen čtyři velké zóny. Detail každé z 9 hráčských pozic (brankář, stoper, krajní obránce, defenzivní záložník, střední záložník, křídelní záložník, ofenzivní záložník, křídelní útočník, útočník) — jejich úkoly, dovednosti i slavné hráče — najdeš v samostatné kapitole.
          </p>
          <Link to="/pozice" className="btn primary mt-3.5 inline-block">Otevřít „Pozice hráčů" →</Link>
        </div>
      </div>
    </div>
  );
}

export default StratPositions;
