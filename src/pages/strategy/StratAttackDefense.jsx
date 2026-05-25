import { useState } from "react";
import { MascotSay } from "../../components";
import { AttackAnim } from "./AttackAnim.jsx";
import { DefenseAnim } from "./DefenseAnim.jsx";

/* --- Attack & Defense --- */
export function StratAttackDefense() {
  const [mode, setMode] = useState("attack");
  return (
    <div>
      <div className="pill-row mb-4">
        <button className={"step-chip " + (mode === "attack" ? "active" : "")} onClick={() => setMode("attack")}>Útok</button>
        <button className={"step-chip " + (mode === "defense" ? "active" : "")} onClick={() => setMode("defense")}>Obrana</button>
      </div>
      <div className="hero-grid grid grid-cols-1 md:grid-cols-hero gap-5 md:gap-6">
        <div className="pitch-wrap">
          {mode === "attack" ? <AttackAnim/> : <DefenseAnim/>}
        </div>
        <div className="flex flex-col gap-3.5">
          {mode === "attack" ? (
            <>
              <MascotSay>Útok znamená rychle vpřed, ale ne sami! Spoluhráči se rozcházejí do prostoru, ty máš tři možnosti přihrávky.</MascotSay>
              <div className="card">
                <div className="display text-xl">4 zásady útoku</div>
                <ol className="pl-5 leading-loose mt-1.5">
                  <li>Hraj rychle vpřed, když máš prostor</li>
                  <li>Drž přehled — kde jsou spoluhráči?</li>
                  <li>Naběhni do vápna, když přihrávka jde z křídla</li>
                  <li>Střílej, když je šance — neváhej</li>
                </ol>
              </div>
            </>
          ) : (
            <>
              <MascotSay mood="wink">Bránit znamená nedat soupeři čas a prostor. Stoj mezi soupeřem a brankou — to je celé tajemství.</MascotSay>
              <div className="card">
                <div className="display text-xl">4 zásady obrany</div>
                <ol className="pl-5 leading-loose mt-1.5">
                  <li>Buď mezi soupeřem a brankou</li>
                  <li>Sleduj míč I hráče — ne jen jedno</li>
                  <li>Komunikuj se spoluhráči (kdo koho hlídá)</li>
                  <li>Nevyrážej do souboje moc brzy — počkej</li>
                </ol>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default StratAttackDefense;
