import { PitchSVG, Player, MascotSay } from "../../components";

/* --- Positions on pitch (overview heatmap-ish) --- */
export function StratPositions() {
  const zones = [
    { name: "Brankář", x: 4, y: 32, color: "#7CD3A0", w: 12, h: 24, desc: "Hlídá branku, jediný smí ve vápně rukama." },
    { name: "Obrana", x: 22, y: 32, color: "#9BB4D6", w: 18, h: 48, desc: "Brání hřiště, blokuje útoky soupeře." },
    { name: "Záloha", x: 45, y: 32, color: "#F2C572", w: 22, h: 50, desc: "Spojuje obranu s útokem. Nejvíc běhají." },
    { name: "Útok", x: 75, y: 32, color: "#E8835A", w: 20, h: 44, desc: "Střílí góly, vytváří šance." },
  ];
  return (
    <div className="hero-grid grid grid-cols-1 md:grid-cols-hero gap-5 md:gap-6">
      <div className="pitch-wrap">
        <PitchSVG>
          {zones.map((z, i) => (
            <g key={i}>
              <rect x={z.x - z.w/2} y={z.y - z.h/2} width={z.w} height={z.h} fill={z.color} opacity="0.45" rx="2"/>
              <text x={z.x} y={z.y - z.h/2 - 1.5} textAnchor="middle" fontWeight="800" fontSize="2.6" fill="white" fontFamily="Bricolage Grotesque, sans-serif">{z.name.toUpperCase()}</text>
            </g>
          ))}
          {/* Sample players */}
          <Player x={5} y={32} team="gk" num="1" size={2.8}/>
          {[[22,18],[22,30],[22,40],[22,52]].map(([x,y],i) => <Player key={"d"+i} x={x} y={y} team="home" num="" size={2.4}/>)}
          {[[45,18],[45,30],[45,40],[45,52]].map(([x,y],i) => <Player key={"m"+i} x={x} y={y} team="home" num="" size={2.4}/>)}
          {[[72,22],[78,32],[72,42]].map(([x,y],i) => <Player key={"a"+i} x={x} y={y} team="home" num="" size={2.4}/>)}
        </PitchSVG>
      </div>
      <div className="flex flex-col gap-3">
        <MascotSay>Každý hráč má svou zónu, kde má hlavně být. Ale fotbal žije pohybem — nestůj na místě!</MascotSay>
        {zones.map((z, i) => (
          <div key={i} className="card p-4" style={{ borderLeft: `8px solid ${z.color}` }}>
            <div className="display text-xl">{z.name}</div>
            <p className="mt-1 text-[15px] text-navySoft">{z.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StratPositions;
