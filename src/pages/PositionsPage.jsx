import { useState } from "react";
import { BallIcon, PitchSVG, SectionHead } from "../components";

const POSITIONS = [
  { id: "gk", name: "Brankář", short: "GK", emoji: "🧤", color: "#7CD3A0",
    desc: "Jediný hráč, který smí ve vápně chytat rukama. Stojí v brance a chrání ji.",
    skills: ["Rychlé reflexy", "Skok", "Komunikace s obranou", "Kop nohou", "Odvaha"],
    famous: ["Petr Čech", "Manuel Neuer", "Iker Casillas"],
    x: 5, y: 32 },
  { id: "cb", name: "Stoper (střední obránce)", short: "CB", emoji: "🛡️", color: "#9BB4D6",
    desc: "Zastavuje útočníky soupeře. Hraje hlavou ve vzdušných soubojích, blokuje střely.",
    skills: ["Síla", "Hra hlavou", "Čtení hry", "Tackle", "Klid"],
    famous: ["Sergio Ramos", "Virgil van Dijk", "Tomáš Galásek"],
    x: 22, y: 26 },
  { id: "fb", name: "Krajní obránce", short: "LB / RB", emoji: "🏃‍♂️", color: "#8AB7C9",
    desc: "Brání křídlo a zároveň pomáhá útoku. Hodně běhá nahoru-dolů.",
    skills: ["Vytrvalost", "Rychlost", "Centry", "Tackle"],
    famous: ["Trent Alexander-Arnold", "Marcelo", "Pavel Nedvěd (i jinde)"],
    x: 22, y: 12 },
  { id: "cdm", name: "Defenzivní záložník", short: "CDM", emoji: "⚙️", color: "#F2C572",
    desc: "Stojí před obránci. Bere míč soupeři a rozjíždí útok krátkou přihrávkou.",
    skills: ["Tackle", "Přihrávka", "Pozičnost", "Vytrvalost"],
    famous: ["Casemiro", "Sergio Busquets", "N'Golo Kanté"],
    x: 36, y: 32 },
  { id: "cm", name: "Střední záložník", short: "CM", emoji: "🎯", color: "#F2C572",
    desc: "Mozek týmu. Dirigent všeho — útoku i obrany. Musí hodně myslet.",
    skills: ["Přihrávka", "Vidění hry", "Vytrvalost", "Technika"],
    famous: ["Luka Modrić", "Toni Kroos", "Pavel Nedvěd"],
    x: 45, y: 26 },
  { id: "wm", name: "Křídelní záložník", short: "LM / RM", emoji: "💨", color: "#F2C572",
    desc: "Hraje po straně hřiště. Rychlý, drží míč a centruje.",
    skills: ["Rychlost", "Dribling", "Centry", "Vytrvalost"],
    famous: ["Mohamed Salah", "Sadio Mané", "Karel Poborský"],
    x: 50, y: 12 },
  { id: "cam", name: "Ofenzivní záložník", short: "CAM", emoji: "🪄", color: "#E8835A",
    desc: "Stojí mezi zálohou a útokem. Tvoří šance, dělá finální přihrávky.",
    skills: ["Technika", "Kreativita", "Přihrávka", "Střela"],
    famous: ["Kevin De Bruyne", "Bruno Fernandes", "Tomáš Rosický"],
    x: 56, y: 32 },
  { id: "lw", name: "Křídelní útočník", short: "LW / RW", emoji: "🚀", color: "#E8835A",
    desc: "Útočí po straně. Rychle běží a buď vystřelí, nebo přihraje do středu.",
    skills: ["Rychlost", "Dribling", "Střela", "1 na 1"],
    famous: ["Cristiano Ronaldo", "Vinícius Júnior", "Patrik Schick (i jinde)"],
    x: 68, y: 14 },
  { id: "st", name: "Útočník", short: "ST", emoji: "⚽", color: "#E04E2B",
    desc: "Hlavní střelec. Jeho úkol je dávat góly. Musí být ve správný čas na správném místě.",
    skills: ["Střela", "Hra hlavou", "Pohyb", "Klid před brankou"],
    famous: ["Erling Haaland", "Robert Lewandowski", "Patrik Schick"],
    x: 78, y: 32 },
];

export function PositionsPage() {
  const [active, setActive] = useState("gk");
  const p = POSITIONS.find(p => p.id === active);
  return (
    <div className="page">
      <span className="eyebrow green"><BallIcon size={14}/> Kapitola 4</span>
      <h1>Pozice hráčů</h1>
      <p className="lead">11 hráčů, 9 různých rolí. Vyber si pozici a podívej se, co dělá a kdo je v ní legenda.</p>

      <div className="divider"/>

      {/* Page-specific 1.3fr/1fr ratio — keep inline (doesn't match HeroLayout variants) */}
      <div
        className="hero-grid grid gap-5"
        style={{ gridTemplateColumns: "1.3fr 1fr" }}
      >
        <div className="pitch-wrap">
          <PitchSVG>
            {POSITIONS.map(pos => (
              <g key={pos.id} style={{ cursor: "pointer" }}>
                {active === pos.id && <circle cx={pos.x} cy={pos.y} r="5.5" fill="none" stroke="#F2A007" strokeWidth="0.6" strokeDasharray="1 0.8" pointerEvents="none"/>}
                <circle cx={pos.x} cy={pos.y} r={active === pos.id ? 4 : 3.2} fill={pos.color} stroke="#0B1F33" strokeWidth="0.5" pointerEvents="none"/>
                <text x={pos.x} y={pos.y + 1} textAnchor="middle" fontSize="2" fontWeight="800" fill="#0B1F33" fontFamily="Bricolage Grotesque, sans-serif" pointerEvents="none">{pos.short.split(" / ")[0]}</text>
                <circle cx={pos.x} cy={pos.y} r="6.5" fill="transparent" pointerEvents="all" onClick={() => setActive(pos.id)} style={{ cursor: "pointer" }}/>
              </g>
            ))}
          </PitchSVG>
        </div>
        <div className="flex flex-col gap-3.5">
          <div className="card p-6" style={{ background: p.color, borderColor: "var(--navy)" }}>
            <div className="flex items-center gap-3.5">
              <div className="text-[56px]">{p.emoji}</div>
              <div>
                <div className="text-xs font-bold tracking-wider uppercase">{p.short}</div>
                <div className="display position-display">{p.name}</div>
              </div>
            </div>
            <p className="mt-3.5 text-base">{p.desc}</p>
          </div>
          <div className="card">
            <div className="display text-lg">Co musíš umět</div>
            <div className="pill-row mt-2.5">
              {p.skills.map((s, i) => <span key={i} className="pill orange">{s}</span>)}
            </div>
          </div>
          <div className="card dark">
            <div className="display text-lg text-orange">Slavní hráči</div>
            <ul className="pl-[18px] mt-1.5 text-[15px]" style={{ lineHeight: 1.8 }}>
              {p.famous.map((f, i) => <li key={i}>{f}</li>)}
            </ul>
          </div>
        </div>
      </div>

      <div className="divider"/>
      <SectionHead title="Všechny pozice" kicker="Klikni do mřížky nebo na hřiště nahoře."/>
      <div
        className="grid gap-3"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))" }}
      >
        {POSITIONS.map(pos => (
          <button
            key={pos.id}
            className="tile p-3.5"
            onClick={() => setActive(pos.id)}
            style={{
              background: active === pos.id ? pos.color : "var(--paper)",
              borderColor: "var(--navy)",
            }}
          >
            <div className="flex items-center gap-2.5">
              <span className="text-[28px]">{pos.emoji}</span>
              <div className="text-left">
                <div className="text-[11px] font-bold" style={{ letterSpacing: "0.06em" }}>{pos.short}</div>
                <div className="font-display font-extrabold text-[15px] leading-[1.1]">{pos.name}</div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default PositionsPage;
