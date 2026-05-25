import { RuleShell } from "./RuleShell.jsx";

/* --- REF --- */
export function RuleRef() {
  return (
    <RuleShell
      kicker="07 / Rozhodčí"
      title="Role rozhodčího"
      lead="Sudí má píšťalku a slovo na hřišti. Pomáhají mu asistenti a v profesionálním fotbale i VAR."
      mascotText="Rozhodčí kontroluje, jestli se hraje podle pravidel. Když píská — všichni poslouchají. Je to jeho hřiště!"
      pitchSlot={
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
      }
    />
  );
}

export default RuleRef;
