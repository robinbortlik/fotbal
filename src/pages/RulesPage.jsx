import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { BallIcon } from "../components";
import { RuleBasics } from "./rules/RuleBasics.jsx";
import { RuleOffside } from "./rules/RuleOffside.jsx";
import { RuleFouls } from "./rules/RuleFouls.jsx";
import { RuleSetPieces } from "./rules/RuleSetPieces.jsx";
import { RulePenalty } from "./rules/RulePenalty.jsx";
import { RuleGoal } from "./rules/RuleGoal.jsx";
import { RuleRef } from "./rules/RuleRef.jsx";
import { RuleYouth } from "./rules/RuleYouth.jsx";

const RULES = [
  { id: "basics", title: "Základy hry", icon: "⚽", duration: 6 },
  { id: "offside", title: "Ofsajd", icon: "🚩", duration: 7 },
  { id: "fouls", title: "Faul & karty", icon: "🟨", duration: 6 },
  { id: "set", title: "Roh, aut a volný kop", icon: "📐", duration: 6 },
  { id: "penalty", title: "Penalta", icon: "🎯", duration: 5 },
  { id: "goal", title: "Branka a góly", icon: "🥅", duration: 4 },
  { id: "ref", title: "Role rozhodčího", icon: "👮", duration: 4 },
  { id: "youth", title: "Kategorie mládeže", icon: "🧒", duration: 6 },
];

const VALID_IDS = RULES.map((r) => r.id);

export function RulesPage() {
  const [searchParams] = useSearchParams();
  const initial = (() => {
    const fromQuery = searchParams.get("rule");
    return fromQuery && VALID_IDS.includes(fromQuery) ? fromQuery : "offside";
  })();
  const [active, setActive] = useState(initial);

  useEffect(() => {
    const fromQuery = searchParams.get("rule");
    if (fromQuery && VALID_IDS.includes(fromQuery) && fromQuery !== active) {
      setActive(fromQuery);
    }
  }, [searchParams]);

  return (
    <div className="page">
      <span className="eyebrow green"><BallIcon size={14}/> Kapitola 1</span>
      <h1>Pravidla fotbalu</h1>
      <p className="lead">Sedm hlavních lekcí, ve kterých si projdeme nejdůležitější pravidla. Celkem jich má fotbal sedmnáct — tyhle nejhlavnější si dáme jako první. Klikni na lekci a Kopík ti ji ukáže s animací.</p>

      <div className="divider"/>

      <div className="rules-layout grid grid-cols-1 md:grid-cols-[260px_1fr] gap-7">
        <aside className="flex flex-col gap-2.5">
          {RULES.map((r, i) => (
            <button
              key={r.id}
              type="button"
              className="tile p-3.5"
              onClick={() => setActive(r.id)}
              style={{
                background: active === r.id ? "var(--navy)" : "var(--paper)",
                color: active === r.id ? "var(--cream)" : "var(--navy)",
                boxShadow: active === r.id ? "0 4px 0 #000" : "var(--shadow)",
              }}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{r.icon}</span>
                <div className="text-left">
                  <div className="text-xs opacity-70 font-bold tracking-wider">{String(i+1).padStart(2,"0")}</div>
                  <div className="font-display font-extrabold text-[17px]">{r.title}</div>
                </div>
              </div>
            </button>
          ))}
        </aside>
        <main>
          {active === "basics" && <RuleBasics/>}
          {active === "offside" && <RuleOffside/>}
          {active === "fouls" && <RuleFouls/>}
          {active === "set" && <RuleSetPieces/>}
          {active === "penalty" && <RulePenalty/>}
          {active === "goal" && <RuleGoal/>}
          {active === "ref" && <RuleRef/>}
          {active === "youth" && <RuleYouth/>}
        </main>
      </div>
    </div>
  );
}

export default RulesPage;
