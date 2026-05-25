import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Mascot,
  MascotSay,
  BallIcon,
  PitchSVG,
  Ball,
  Arrow,
  SectionHead,
} from "../components";

/* === Zóny — pohyb hráčů v zónách === */

const ZONES = [
  {
    id: "gk", name: "Brankář", short: "GK", emoji: "🧤", color: "#7CD3A0",
    summary: "Hlídá branku, ale když máme míč, vyběhne až ven z vápna.",
    attack:  { zone: { x: 3, y: 24, w: 14, h: 16 }, pos: { x: 14, y: 32 } },
    defense: { zone: { x: 1, y: 28, w: 6, h: 8 },   pos: { x: 4,  y: 32 } },
    attackTips: [
      "Vyběhni z brány až k hraně vápna",
      "Buď připraven přijmout zpětnou přihrávku",
      "Diriguj obranu — vidíš celé hřiště zezadu",
    ],
    defenseTips: [
      "Stůj v ose branky, mírně před čárou",
      "Pozor na střely zdaleka, drž ruce nahoru",
      "Vyběhni proti útočníkovi — zmenši mu úhel střely",
    ],
    avoid: ["Nevybíhej zbytečně daleko, když máš za zády obranu", "Při rohu nikdy z brány"],
  },
  {
    id: "cb", name: "Stoper", short: "CB", emoji: "🛡️", color: "#9BB4D6",
    summary: "Střed obrany. Stojí před brankářem a chrání vápno.",
    attack:  { zone: { x: 18, y: 18, w: 22, h: 28 }, pos: { x: 32, y: 28 } },
    defense: { zone: { x: 10, y: 22, w: 14, h: 20 }, pos: { x: 18, y: 28 } },
    attackTips: [
      "Při rozehrávce posuň se vpřed",
      "Nabízej přihrávku — buď otevřený",
      "Při rohu se přesuň do vápna soupeře (z výšky!)",
    ],
    defenseTips: [
      "Zůstaň v ose mezi míčem a vlastní brankou",
      "Sleduj nejnebezpečnějšího útočníka",
      "Tackle teprve když je hráč zády k tobě",
    ],
    avoid: ["Nikdy oba stopeři vepředu!", "Nezapojuj se sám do souboje, když je za tebou prázdno"],
  },
  {
    id: "fb", name: "Krajní obránce", short: "LB/RB", emoji: "🏃‍♂️", color: "#8AB7C9",
    summary: "Brání křídlo a v útoku zabíhá po čáře dopředu.",
    attack:  { zone: { x: 25, y: 4, w: 45, h: 18 }, pos: { x: 55, y: 12 } },
    defense: { zone: { x: 12, y: 4, w: 18, h: 18 }, pos: { x: 20, y: 12 } },
    attackTips: [
      "Sprintuj po křídle dopředu",
      "Centruj do vápna spoluhráčům",
      "Kombinuj s krajním záložníkem (rychlá přihrávka)",
    ],
    defenseTips: [
      "Vrať se rychle zpátky k vápnu",
      "Brání křídelní útočník — drž ho na čáře",
      "Nikdy ho nepouštěj uvnitř za záda",
    ],
    avoid: ["Neostav prázdné křídlo, když útočíš", "Nevybíhej se dvěma najednou (pravým i levým bekem)"],
  },
  {
    id: "cdm", name: "Defenzivní záložník", short: "CDM", emoji: "⚙️", color: "#F2C572",
    summary: "Štít před obranou. Bere míče soupeři a rozjíždí útok.",
    attack:  { zone: { x: 30, y: 22, w: 20, h: 20 }, pos: { x: 42, y: 32 } },
    defense: { zone: { x: 22, y: 24, w: 16, h: 16 }, pos: { x: 28, y: 32 } },
    attackTips: [
      "Stůj uprostřed, vždy nabízej přihrávku",
      "Krátké přihrávky doleva i doprava",
      "Když máš čas, kop dlouhou diagonálu",
    ],
    defenseTips: [
      "Drž prostor před stopery — neumíráš v zóně",
      "Tackluj, když soupeř drží míč zády",
      "Sleduj útočníka soupeře, který by vbíhal mezi řady",
    ],
    avoid: ["Neopouštěj střed — to je tvůj domov", "Nehoň se za míčem do křídel"],
  },
  {
    id: "cm", name: "Střední záložník", short: "CM", emoji: "🎯", color: "#F2C572",
    summary: "Box-to-box. Běhá z vlastní šestnáctky až do soupeřovy.",
    attack:  { zone: { x: 35, y: 18, w: 30, h: 30 }, pos: { x: 58, y: 28 } },
    defense: { zone: { x: 28, y: 18, w: 18, h: 30 }, pos: { x: 36, y: 28 } },
    attackTips: [
      "Naběhni do vápna jako 'druhá vlna'",
      "Hledej prostor mezi obránci a záložníky soupeře",
      "Střílej zdálky, když je čistá pozice",
    ],
    defenseTips: [
      "Vracej se hluboko a pomáhej obraně",
      "Drž svého soupeře (záložník)",
      "Po ztrátě míče okamžitě presuj",
    ],
    avoid: ["Nestůj na místě — buď v pohybu!", "Nevypouštěj soupeře za záda"],
  },
  {
    id: "wm", name: "Křídelní záložník", short: "LM/RM", emoji: "💨", color: "#F2C572",
    summary: "Po čáře nahoru-dolů. Spojuje obranu s útokem na křídle.",
    attack:  { zone: { x: 50, y: 4, w: 25, h: 18 }, pos: { x: 68, y: 12 } },
    defense: { zone: { x: 28, y: 4, w: 22, h: 18 }, pos: { x: 38, y: 12 } },
    attackTips: [
      "Hraj 1 na 1 s krajním bekem soupeře",
      "Centruj nebo střílej dovnitř (cut-in)",
      "Spolupracuj se svým bekem (přečíslení)",
    ],
    defenseTips: [
      "Vrať se a pomoz svému bekovi",
      "Sleduj jejich krajního beka, když útočí",
      "Stůj na své půli, drž křídlo",
    ],
    avoid: ["Nezapomeň se vracet!", "Nezabíhej příliš do středu, opustíš křídlo"],
  },
  {
    id: "st", name: "Útočník", short: "ST", emoji: "⚽", color: "#E04E2B",
    summary: "Nejvíc vepředu. Dává góly. Naběhne, kde nikdo nečeká.",
    attack:  { zone: { x: 60, y: 18, w: 35, h: 30 }, pos: { x: 78, y: 28 } },
    defense: { zone: { x: 45, y: 22, w: 25, h: 20 }, pos: { x: 50, y: 32 } },
    attackTips: [
      "Naběhni za poslední obránce (pozor na ofsajd!)",
      "Buď v pokutovém území, když přijde centr",
      "Stříhej obránce — měň směr náběhu",
    ],
    defenseTips: [
      "Presuj brankáře a stopery, když rozehrávají",
      "Zacloň přihrávku k soupeřovu záložníkovi",
      "Po ztrátě se přibliž k míči — okamžitý pressing",
    ],
    avoid: ["Nestoj jen na hrotu jako socha", "Neutíkej z ofsajdu pozdě"],
  },
];

export function ZonesPage() {
  const [active, setActive] = useState("cb");
  const [phase, setPhase] = useState("defense"); // "attack" | "defense"
  const [auto, setAuto] = useState(true);
  const p = ZONES.find(z => z.id === active);

  // Auto-switching loop
  useEffect(() => {
    if (!auto) return;
    const t = setInterval(() => setPhase(p => p === "attack" ? "defense" : "attack"), 2600);
    return () => clearInterval(t);
  }, [auto]);

  // Animate player between defense pos & attack pos based on phase
  const [playerPos, setPlayerPos] = useState(p.defense.pos);
  useEffect(() => {
    const target = phase === "attack" ? p.attack.pos : p.defense.pos;
    let raf;
    let start = performance.now();
    const from = { ...playerPos };
    const dur = 700;
    const tick = (now) => {
      const f = Math.min(1, (now - start) / dur);
      const e = f < 0.5 ? 2*f*f : 1 - Math.pow(-2*f + 2, 2)/2;
      setPlayerPos({ x: from.x + (target.x - from.x) * e, y: from.y + (target.y - from.y) * e });
      if (f < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase, active]);

  // When position changes, reset player to defense pos of new player
  useEffect(() => { setPlayerPos(p.defense.pos); setPhase("defense"); }, [active]);

  const tips = phase === "attack" ? p.attackTips : p.defenseTips;

  return (
    <div className="page">
      <span className="eyebrow green"><BallIcon size={14}/> Kapitola 5</span>
      <h1>Pohyb v zónách</h1>
      <p className="lead">Kde má hráč stát, když máme míč? A kde, když ho má soupeř? Vyber pozici a sleduj, jak se mění zóna pohybu.</p>
      <p className="text-[14px] text-navySoft mt-1">
        Jak máš stát podle své pozice. Chceš pohled, jak se hýbe celý tým podle míče?{" "}
        <Link to="/pohyb" className="underline font-bold">Pohyb podle míče</Link>.
      </p>

      <div className="divider"/>

      <div className="hero-grid grid grid-cols-1 md:grid-cols-hero gap-5 md:gap-6">
        <div>
          <div className="pitch-wrap">
            <PitchSVG>
              {/* Defense zone — always visible, dim when not active */}
              <rect
                x={p.defense.zone.x} y={p.defense.zone.y}
                width={p.defense.zone.w} height={p.defense.zone.h}
                rx={2}
                fill="#0B1F33" opacity={phase === "defense" ? 0.55 : 0.18}
                stroke="#0B1F33" strokeWidth="0.4" strokeDasharray="1 0.6"
                style={{ transition: "opacity 0.4s" }}
              />
              <text
                x={p.defense.zone.x + p.defense.zone.w / 2}
                y={p.defense.zone.y - 1}
                textAnchor="middle" fontSize="3.2" fontWeight="800"
                fill="#fff" fontFamily="Bricolage Grotesque, sans-serif"
                opacity={phase === "defense" ? 1 : 0.35}
                paintOrder="stroke"
                stroke="var(--cream)"
                strokeWidth="0.5"
                style={{ transition: "opacity 0.4s" }}
              >ZÓNA OBRANY</text>

              {/* Attack zone */}
              <rect
                x={p.attack.zone.x} y={p.attack.zone.y}
                width={p.attack.zone.w} height={p.attack.zone.h}
                rx={2}
                fill="#F2A007" opacity={phase === "attack" ? 0.55 : 0.18}
                stroke="#F2A007" strokeWidth="0.4" strokeDasharray="1 0.6"
                style={{ transition: "opacity 0.4s" }}
              />
              <text
                x={p.attack.zone.x + p.attack.zone.w / 2}
                y={p.attack.zone.y - 1}
                textAnchor="middle" fontSize="3.2" fontWeight="800"
                fill="#fff" fontFamily="Bricolage Grotesque, sans-serif"
                opacity={phase === "attack" ? 1 : 0.35}
                paintOrder="stroke"
                stroke="var(--cream)"
                strokeWidth="0.5"
                style={{ transition: "opacity 0.4s" }}
              >ZÓNA ÚTOKU</text>

              {/* Connector arrow between zones */}
              <Arrow
                x1={p.defense.pos.x} y1={p.defense.pos.y}
                x2={p.attack.pos.x} y2={p.attack.pos.y}
                dashed color="rgba(255,255,255,0.55)" width={0.35}
              />

              {/* Other players faded */}
              {ZONES.filter(z => z.id !== active).map(other => {
                const pos = phase === "attack" ? other.attack.pos : other.defense.pos;
                return <circle key={other.id} cx={pos.x} cy={pos.y} r="2.2" fill="rgba(255,255,255,0.35)" stroke="rgba(11,31,51,0.4)" strokeWidth="0.3"/>;
              })}
              {/* Goalie ghost (if not GK selected) */}
              {active !== "gk" && <circle cx={4} cy={32} r="2.2" fill="rgba(124,211,160,0.45)" stroke="rgba(11,31,51,0.4)" strokeWidth="0.3"/>}

              {/* Animated player */}
              <g transform={`translate(${playerPos.x}, ${playerPos.y})`}>
                <circle r="5" fill="none" stroke="#F2A007" strokeWidth="0.5" strokeDasharray="0.8 0.6">
                  <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="6s" repeatCount="indefinite"/>
                </circle>
                <circle r="3.4" fill={p.color} stroke="#0B1F33" strokeWidth="0.6"/>
                <text textAnchor="middle" y="1.2" fontSize="2.4" fontWeight="800" fill="#0B1F33" fontFamily="Bricolage Grotesque, sans-serif">{p.short.split("/")[0]}</text>
              </g>

              {/* Ball — placed near holder of phase */}
              <Ball
                x={phase === "attack" ? Math.max(15, p.attack.pos.x - 8) : Math.min(85, p.defense.pos.x + 30)}
                y={32}
              />
            </PitchSVG>
          </div>

          <div className="between mt-4">
            <div className="pill-row">
              <button
                className={"step-chip " + (phase === "defense" ? "active" : "")}
                onClick={() => { setAuto(false); setPhase("defense"); }}
              >🛡️ Soupeř má míč</button>
              <button
                className={"step-chip " + (phase === "attack" ? "active" : "")}
                onClick={() => { setAuto(false); setPhase("attack"); }}
              >⚽ My máme míč</button>
            </div>
            <button className="btn sm" onClick={() => setAuto(a => !a)}>
              {auto ? "⏸ Stop auto-přepínání" : "▶ Auto-přepínat"}
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-3.5">
          <MascotSay mood="wink">Sleduj, jak se zóna posouvá vpřed, když máme míč, a stahuje se zpátky, když ho má soupeř. To je celý fotbal!</MascotSay>

          <div className="card p-[22px]" style={{ background: p.color, borderColor: "var(--navy)" }}>
            <div className="flex items-center gap-3.5">
              <div className="text-[44px]">{p.emoji}</div>
              <div>
                <div className="text-xs font-bold tracking-wider uppercase">{p.short}</div>
                <div className="display text-2xl">{p.name}</div>
              </div>
            </div>
            <p className="mt-3 text-[15px]">{p.summary}</p>
          </div>

          <div className="card" style={{ background: phase === "attack" ? "#fff3df" : "#e6ecf3", borderColor: "var(--navy)" }}>
            <div className="display text-xl mb-2.5">
              {phase === "attack" ? "⚽ Když máme míč" : "🛡️ Když má míč soupeř"}
            </div>
            <ul className="pl-[18px] leading-[1.7] m-0 text-[15px]">
              {tips.map((t, i) => <li key={i}>{t}</li>)}
            </ul>
          </div>

          <div className="card dark">
            <div className="display text-base mb-2" style={{ color: "#ff8a7a" }}>⚠ Čeho se vyvaruj</div>
            <ul className="pl-[18px] leading-[1.6] m-0 text-sm opacity-95">
              {p.avoid.map((a, i) => <li key={i}>{a}</li>)}
            </ul>
          </div>
        </div>
      </div>

      <div className="divider"/>

      <SectionHead title="Vyber pozici" kicker="Klikni si je jednu po druhé a podívej, jak se zóny liší."/>
      <div
        className="zony-tile-grid grid gap-3"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))" }}
      >
        {ZONES.map(z => (
          <button key={z.id} className="tile p-3.5" onClick={() => setActive(z.id)} style={{
            background: active === z.id ? z.color : "var(--paper)",
            borderColor: "var(--navy)",
            boxShadow: active === z.id ? "0 4px 0 var(--navy)" : "var(--shadow)",
          }}>
            <div className="flex items-center gap-2.5">
              <span className="text-[28px]">{z.emoji}</span>
              <div className="text-left">
                <div className="text-[11px] font-bold tracking-wide text-navySoft">{z.short}</div>
                <div className="font-display font-extrabold text-[15px] leading-[1.1]">{z.name}</div>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="divider"/>

      <div className="card green responsive-grid grid items-center gap-[18px]" style={{ gridTemplateColumns: "auto 1fr" }}>
        <Mascot size={72} mood="wink" bounce/>
        <div>
          <div className="display text-[22px]">Pamatuj si to nejdůležitější</div>
          <p className="mt-1.5 opacity-95">
            Když máme míč → <b>roztáhneme se</b> široko a dopředu.
            Když máme míč soupeř → <b>scházíme se</b> doprostřed a dozadu, blíž k vlastní bráně.
            Hřiště se s tebou pohybuje — pořád dýchá!
          </p>
        </div>
      </div>

      <div className="pill-row mt-5">
        <Link to="/pohyb" className="pill orange" style={{ textDecoration: "none" }}>Viz také: Pohyb podle míče →</Link>
      </div>
    </div>
  );
}

export default ZonesPage;
