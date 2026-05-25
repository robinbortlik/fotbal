import { useState } from "react";
import { BallIcon, PitchSVG, MascotSay } from "../components";

const PITCH_HOTSPOTS = [
  { id: 1, x: 50, y: 32, title: "Středový kruh", text: "Tady začíná každý zápas (výkop). Soupeři musí být mimo kruh. Má průměr 18,30 m." },
  { id: 2, x: 50, y: 1.5, title: "Středová čára", text: "Dělí hřiště na dvě poloviny. Tvůj brankář brání svou půlku." },
  { id: 3, x: 8, y: 32, title: "Pokutové území (vápno)", text: "Tady smí brankář chytat rukama. Když ti soupeř fauluje v jeho vápně — penalta!" },
  { id: 4, x: 10, y: 32.5, title: "Pokutová značka", text: "Z této tečky se kope penalta. 11 metrů od branky." },
  { id: 5, x: 4, y: 32, title: "Branková území (malé vápno)", text: "Šestka. Z ní kope brankář kop od branky." },
  { id: 6, x: 1.5, y: 1.5, title: "Roh", text: "Z rohové značky se kope roh, když obránce vykopne míč přes vlastní brankovou čáru." },
  { id: 7, x: 0.5, y: 32, title: "Branka", text: "7,32 m široká, 2,44 m vysoká. Sem chceš trefit míč!" },
  { id: 8, x: 1, y: 32, title: "Branková čára", text: "Když míč přejde CELÝ za brankovou čáru mezi tyčemi — gól!" },
];

export function PitchPage() {
  const [active, setActive] = useState(1);
  const info = PITCH_HOTSPOTS.find(h => h.id === active);
  return (
    <div className="page">
      <span className="eyebrow green"><BallIcon size={14}/> Kapitola 3</span>
      <h1>O hřišti</h1>
      <p className="lead">Co znamenají všechny ty čáry? Klikni na oranžová kolečka — Kopík ti je vysvětlí.</p>

      <div className="divider"/>

      {/* Page-specific 1.5fr/1fr ratio — keep inline (doesn't match HeroLayout variants) */}
      <div
        className="hero-grid grid gap-6"
        style={{ gridTemplateColumns: "1.5fr 1fr" }}
      >
        <div className="pitch-wrap relative">
          <div className="relative">
            <PitchSVG>
              {PITCH_HOTSPOTS.map(h => (
                <g key={h.id} style={{ cursor: "pointer" }}>
                  <circle cx={h.x} cy={h.y} r={active === h.id ? 2.6 : 2.2} fill={active === h.id ? "#fff" : "#F2A007"} stroke="#0B1F33" strokeWidth="0.5" pointerEvents="none"/>
                  <text x={h.x} y={h.y + 0.9} textAnchor="middle" fontSize="2.4" fontWeight="800" fontFamily="Bricolage Grotesque, sans-serif" fill="#0B1F33" pointerEvents="none">{h.id}</text>
                  <circle cx={h.x} cy={h.y} r="6" fill="transparent" pointerEvents="all" onClick={() => setActive(h.id)} style={{ cursor: "pointer" }}/>
                </g>
              ))}
            </PitchSVG>
          </div>
        </div>
        <div className="flex flex-col gap-3.5">
          <MascotSay>Hřiště má mraky čar a každá něco znamená. Klikni na číslo a já ti to vysvětlím!</MascotSay>
          <div className="card bg-orange text-navy" style={{ borderColor: "var(--navy)" }}>
            <div className="flex items-center gap-2.5">
              <div className="hotspot flex-shrink-0" style={{ position: "static", animation: "none" }}>{info.id}</div>
              <div className="display text-2xl">{info.title}</div>
            </div>
            <p className="mt-3 text-base">{info.text}</p>
          </div>
          <div className="card">
            <div className="display text-lg">Rozměry hřiště</div>
            <ul className="pl-[18px] mt-2 text-sm" style={{ lineHeight: 1.7 }}>
              <li>Délka: <b>90–120 m</b></li>
              <li>Šířka: <b>45–90 m</b></li>
              <li>Mezinárodní zápasy: <b>100–110 × 64–75 m</b></li>
              <li>Branka: <b>7,32 × 2,44 m</b></li>
              <li>Pokutové území: <b>16,5 m</b> od branky</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PitchPage;
