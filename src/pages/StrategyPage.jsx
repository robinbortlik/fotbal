import { useState } from "react";
import { BallIcon } from "../components";
import { StratPositions } from "./strategy/StratPositions.jsx";
import { StratFormations } from "./strategy/StratFormations.jsx";
import { StratMovement } from "./strategy/StratMovement.jsx";
import { StratPassing } from "./strategy/StratPassing.jsx";
import { StratAttackDefense } from "./strategy/StratAttackDefense.jsx";
import { StratSetPiece } from "./strategy/StratSetPiece.jsx";

const STRATEGY = [
  { id: "positions-pitch", title: "Pozice na hřišti", icon: "🧩" },
  { id: "formations", title: "Formace (drag & drop)", icon: "📐" },
  { id: "movement", title: "Pohyb bez míče", icon: "🏃" },
  { id: "passing", title: "Přihrávání", icon: "↗️" },
  { id: "attack-defense", title: "Útok a obrana", icon: "⚔️" },
  { id: "set-piece", title: "Standardní situace", icon: "🎯" },
];

export function StrategyPage() {
  const [active, setActive] = useState("formations");
  return (
    <div className="page">
      <span className="eyebrow green"><BallIcon size={14}/> Kapitola 2</span>
      <h1>Strategie hraní</h1>
      <p className="lead">Jak hrát chytře, ne jen rychle. Tady se naučíš, kdy přihrát, kdy běžet a kdy zůstat stát.</p>

      <div className="divider"/>

      <div className="steps stack-scroll flex flex-wrap gap-2.5 mb-6">
        {STRATEGY.map((s) => (
          <button
            key={s.id}
            type="button"
            className={"step-chip " + (active === s.id ? "active" : "")}
            onClick={() => setActive(s.id)}
          >
            <span className="mr-1.5">{s.icon}</span>{s.title}
          </button>
        ))}
      </div>

      {active === "positions-pitch" && <StratPositions/>}
      {active === "formations" && <StratFormations/>}
      {active === "movement" && <StratMovement/>}
      {active === "passing" && <StratPassing/>}
      {active === "attack-defense" && <StratAttackDefense/>}
      {active === "set-piece" && <StratSetPiece/>}
    </div>
  );
}

export default StrategyPage;
