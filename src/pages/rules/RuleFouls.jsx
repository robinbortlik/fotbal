import { RuleShell } from "./RuleShell.jsx";

/* --- FOULS --- */
export function RuleFouls() {
  const examples = [
    { card: "yellow", title: "Žlutá karta", reasons: ["Tvrdý faul", "Zdržování hry", "Protesty proti rozhodčímu", "Úmyslné ruka"] },
    { card: "red", title: "Červená karta", reasons: ["Velmi tvrdý faul", "Druhá žlutá v zápase", "Zabránění čisté gólové šanci", "Plivnutí, urážky"] },
  ];
  return (
    <RuleShell
      kicker="03 / Fauly"
      title="Faul a karty"
      lead="Když hráč poruší pravidla, dostane od sudího kartu. Žlutá = varování, červená = konec."
      mascotText="Fauly jsou strkání, podražení, držení, kopání do soupeře. Po faulu dostane druhý tým volný kop. Když je to ve vápně, je z toho penalta!"
      pitchSlot={
        <div className="responsive-grid hero-grid grid grid-cols-1 md:grid-cols-2 gap-4">
          {examples.map((ex) => (
            <div key={ex.card} className="card p-[22px]" style={{
              background: ex.card === "yellow" ? "#FFD23F" : "#e64a3b",
              color: ex.card === "yellow" ? "var(--navy)" : "white",
              borderColor: "var(--navy)",
            }}>
              <div className="w-16 h-20 rounded-[4px] mb-3" style={{ background: "currentColor", opacity: 0.15 }}/>
              <div className="display text-2xl">{ex.title}</div>
              <ul className="pl-4 mt-2.5 leading-relaxed text-sm">
                {ex.reasons.map((r,i) => <li key={i}>{r}</li>)}
              </ul>
            </div>
          ))}
          <div className="card" style={{ gridColumn: "1 / -1" }}>
            <div className="display text-xl">Když přijde faul…</div>
            <div className="pill-row mt-2.5">
              <span className="pill">1. Sudí píská</span>
              <span className="pill">2. Ukáže místo</span>
              <span className="pill">3. Případně karta</span>
              <span className="pill">4. Druhý tým kope</span>
            </div>
          </div>
        </div>
      }
    />
  );
}

export default RuleFouls;
