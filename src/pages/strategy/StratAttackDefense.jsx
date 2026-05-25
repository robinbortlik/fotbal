import { useEffect, useState } from "react";
import { MascotSay } from "../../components";
import { AttackAnim } from "./AttackAnim.jsx";
import { DefenseAnim } from "./DefenseAnim.jsx";

const ATTACK_PRINCIPLES = [
  { id: "fast",     label: "Hraj rychle vpřed, když máš prostor" },
  { id: "overview", label: "Drž přehled — kde jsou spoluhráči?" },
  { id: "run",      label: "Naběhni do vápna, když přihrávka jde z křídla" },
  { id: "shoot",    label: "Střílej, když je šance — neváhej" },
];

const DEFENSE_PRINCIPLES = [
  { id: "between",     label: "Buď mezi soupeřem a brankou" },
  { id: "ball-player", label: "Sleduj míč I hráče — ne jen jedno" },
  { id: "comm",        label: "Komunikuj se spoluhráči (kdo koho hlídá)" },
  { id: "patience",    label: "Nevyrážej do souboje moc brzy — počkej" },
];

/* --- Attack & Defense --- */
export function StratAttackDefense() {
  const [mode, setMode] = useState("attack");
  const [highlight, setHighlight] = useState(null);
  const list = mode === "attack" ? ATTACK_PRINCIPLES : DEFENSE_PRINCIPLES;

  // Reset highlight when switching mode
  useEffect(() => { setHighlight(null); }, [mode]);

  return (
    <div>
      <div className="pill-row mb-4">
        <button className={"step-chip " + (mode === "attack" ? "active" : "")} onClick={() => setMode("attack")}>Útok</button>
        <button className={"step-chip " + (mode === "defense" ? "active" : "")} onClick={() => setMode("defense")}>Obrana</button>
      </div>
      <div className="hero-grid grid grid-cols-1 md:grid-cols-hero gap-5 md:gap-6">
        <div className="pitch-wrap">
          {mode === "attack"
            ? <AttackAnim highlight={highlight}/>
            : <DefenseAnim highlight={highlight}/>}
        </div>
        <div className="flex flex-col gap-3.5">
          {mode === "attack" ? (
            <MascotSay>Útok znamená rychle vpřed, ale ne sami! Spoluhráči se rozcházejí do prostoru, ty máš tři možnosti přihrávky.</MascotSay>
          ) : (
            <MascotSay mood="wink">Bránit znamená nedat soupeři čas a prostor. Stoj mezi soupeřem a brankou — to je celé tajemství.</MascotSay>
          )}
          <div className="card">
            <div className="display text-xl">{mode === "attack" ? "4 zásady útoku" : "4 zásady obrany"}</div>
            <p className="text-[13px] text-navySoft mt-1">Klikni na zásadu, sleduj na hřišti, co se k ní hodí.</p>
            <ol className="pl-0 mt-3 list-none flex flex-col gap-1.5">
              {list.map((p, i) => {
                const isActive = highlight === p.id;
                return (
                  <li key={p.id}>
                    <button
                      type="button"
                      onClick={() => setHighlight(isActive ? null : p.id)}
                      className="tile w-full p-2.5 text-left"
                      style={{
                        background: isActive ? "var(--orange)" : "var(--paper)",
                        color: isActive ? "var(--navy)" : "var(--navy)",
                        borderColor: "var(--navy)",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                      }}
                      aria-pressed={isActive}
                    >
                      <span
                        className="font-display font-extrabold"
                        style={{
                          minWidth: 24, height: 24,
                          borderRadius: "50%",
                          background: isActive ? "var(--navy)" : "var(--orange)",
                          color: isActive ? "var(--cream)" : "var(--navy)",
                          fontSize: 14,
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >{i + 1}</span>
                      <span className="text-[14px] leading-snug">{p.label}</span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StratAttackDefense;
