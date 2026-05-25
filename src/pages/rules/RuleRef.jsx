import { useState } from "react";
import { RuleShell } from "./RuleShell.jsx";

/* --- REFEREE SIGNALS ---
   Each signal is a tiny inline SVG. The "armEnd" coords drive both the arm
   stroke and a CSS transition trigger for tap-to-replay animation.
   Body is a simple stick figure on a 36×36 canvas. */
const SIGNALS = [
  {
    id: "direct-fk",
    title: "Přímý volný kop",
    note: "Ruka ukazuje směr kopu vpřed. Z přímého kopu se dá vstřelit gól rovnou.",
    arm: { x: 32, y: 14 }, // right horizontal
  },
  {
    id: "indirect-fk",
    title: "Nepřímý volný kop",
    note: "Ruka rovně nahoru — drží ji, dokud se míče nedotkne další hráč.",
    arm: { x: 18, y: 0 }, // straight up
  },
  {
    id: "corner",
    title: "Roh",
    note: "Ruka ukazuje šikmo dolů k rohové značce.",
    arm: { x: 30, y: 28 }, // diagonal down-right
  },
  {
    id: "advantage",
    title: "Výhoda",
    note: "Obě ruce vpřed — sudí říká „pokračujte, výhoda“.",
    arm: { x: 32, y: 14 },
    arm2: { x: 30, y: 18 },
  },
  {
    id: "penalty",
    title: "Penalta",
    note: "Ruka ukazuje na puntík v pokutovém území.",
    arm: { x: 28, y: 26 }, // forward-down
  },
  {
    id: "yellow",
    title: "Žlutá karta",
    note: "Sudí drží žlutou kartu vysoko nad hlavou.",
    arm: { x: 18, y: 0 },
    card: "#FFD23F",
  },
  {
    id: "red",
    title: "Červená karta",
    note: "Sudí drží červenou kartu — hráč musí pryč.",
    arm: { x: 18, y: 0 },
    card: "#e64a3b",
  },
  {
    id: "sub",
    title: "Střídání",
    note: "Čtvrtý rozhodčí ukáže elektronickou tabuli s číslem hráče, který jde dolů, a číslem hráče, který jde nahoru.",
    arm: { x: 28, y: 8 },
    arm2: { x: 8, y: 8 },
  },
];

function SignalSVG({ s, active }) {
  return (
    <svg width="72" height="72" viewBox="0 0 36 36" aria-hidden>
      {/* head */}
      <circle cx="18" cy="8" r="3.5" fill="#0B1F33"/>
      {/* body */}
      <line x1="18" y1="11" x2="18" y2="22" stroke="#0B1F33" strokeWidth="3" strokeLinecap="round"/>
      {/* legs */}
      <line x1="14" y1="22" x2="13" y2="32" stroke="#0B1F33" strokeWidth="3" strokeLinecap="round"/>
      <line x1="22" y1="22" x2="23" y2="32" stroke="#0B1F33" strokeWidth="3" strokeLinecap="round"/>
      {/* primary arm (animates on active toggle via stroke length transition) */}
      <line
        x1="18" y1="13" x2={s.arm.x} y2={s.arm.y}
        stroke={s.card ? s.card : "#F2A007"}
        strokeWidth="3" strokeLinecap="round"
        style={{
          transition: "all 350ms cubic-bezier(.4,.2,.2,1)",
          transform: active ? "scale(1)" : "scale(0.95)",
          transformOrigin: "18px 13px",
        }}
      />
      {/* optional second arm */}
      {s.arm2 && (
        <line
          x1="18" y1="13" x2={s.arm2.x} y2={s.arm2.y}
          stroke={s.card ? s.card : "#F2A007"}
          strokeWidth="3" strokeLinecap="round"
          style={{
            transition: "all 350ms cubic-bezier(.4,.2,.2,1)",
            transform: active ? "scale(1)" : "scale(0.95)",
            transformOrigin: "18px 13px",
          }}
        />
      )}
      {/* card icon for yellow/red */}
      {s.card && active && (
        <rect x="15.5" y="-3" width="5" height="7" rx="0.6" fill={s.card} stroke="#0B1F33" strokeWidth="0.4">
          <animate attributeName="y" from="3" to="-3" dur="350ms" fill="freeze"/>
        </rect>
      )}
    </svg>
  );
}

function SignalGrid() {
  const [active, setActive] = useState(null);

  return (
    <div className="card p-5 mt-5">
      <div className="display text-xl">Co rozhodčí ukazuje rukama</div>
      <p className="mt-1.5 text-[14px] text-navySoft">Klikni na signál, ať vidíš animaci. Tyhle gesta uvidíš v každém zápase.</p>
      <div
        className="grid gap-2.5 mt-4"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))" }}
      >
        {SIGNALS.map((s) => {
          const isActive = active === s.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setActive(isActive ? null : s.id)}
              className="tile p-3"
              style={{
                background: isActive ? "var(--navy)" : "var(--paper)",
                color: isActive ? "var(--cream)" : "var(--navy)",
                borderColor: "var(--navy)",
                cursor: "pointer",
                textAlign: "center",
              }}
            >
              <div className="flex justify-center">
                <SignalSVG s={s} active={isActive}/>
              </div>
              <div className="font-display font-extrabold text-[13px] mt-1.5">{s.title}</div>
              {isActive && (
                <div className="text-[12px] opacity-95 mt-1.5 leading-snug">{s.note}</div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* --- REF --- */
export function RuleRef() {
  return (
    <RuleShell
      kicker="07 / Rozhodčí"
      title="Role rozhodčího"
      lead="Sudí má píšťalku a slovo na hřišti. Pomáhají mu asistenti a v profesionálním fotbale i VAR."
      mascotText="Rozhodčí kontroluje, jestli se hraje podle pravidel. Když píská — všichni poslouchají. Je to jeho hřiště!"
      pitchSlot={
        <div>
          <div className="card-grid">
            {[
              { who: "Hlavní rozhodčí", desc: "Píská, ukazuje karty, kontroluje čas. Běhá po celém hřišti.", color: "var(--navy)", text: "var(--cream)" },
              { who: "2× asistent (lajnsmen)", desc: "Sledují postranní čáru, mávají při ofsajdu a autu.", color: "var(--orange)", text: "var(--navy)" },
              { who: "4. rozhodčí", desc: "Stojí u střídaček. Hlídá střídání a nastavený čas.", color: "var(--pitch)", text: "white" },
              { who: "VAR (jen velký fotbal)", desc: "V televizi sleduje záznam a poradí sudímu při zásadních situacích.", color: "var(--cream-deep)", text: "var(--navy)" },
            ].map((r, i) => (
              <div key={i} className="card" style={{ background: r.color, color: r.text, borderColor: "var(--navy)" }}>
                <div className="display text-[22px]">{r.who}</div>
                <p className="mt-2 opacity-90">{r.desc}</p>
              </div>
            ))}
          </div>
          <SignalGrid/>
        </div>
      }
    />
  );
}

export default RuleRef;
