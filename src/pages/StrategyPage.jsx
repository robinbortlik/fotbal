import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { BallIcon } from "../components";
import { StratPositions } from "./strategy/StratPositions.jsx";
import { StratFormations } from "./strategy/StratFormations.jsx";
import { StratMovement } from "./strategy/StratMovement.jsx";
import { StratPassing } from "./strategy/StratPassing.jsx";
import { StratAttackDefense } from "./strategy/StratAttackDefense.jsx";
import { StratSetPiece } from "./strategy/StratSetPiece.jsx";
import { StratFairPlay } from "./strategy/StratFairPlay.jsx";

const STRATEGY = [
  { id: "positions-pitch", title: "Přehled pozic", icon: "🧩" },
  { id: "formations", title: "Formace (drag & drop)", icon: "📐" },
  { id: "movement", title: "Pohyb bez míče", icon: "🏃" },
  { id: "passing", title: "Přihrávání", icon: "↗️" },
  { id: "attack-defense", title: "Útok a obrana", icon: "⚔️" },
  { id: "set-piece", title: "Standardní situace", icon: "🎯" },
  { id: "fair-play", title: "Fair play", icon: "🤝" },
];

const VALID_IDS = STRATEGY.map((s) => s.id);

export function StrategyPage() {
  const [searchParams] = useSearchParams();
  const initial = (() => {
    const fromQuery = searchParams.get("step");
    return fromQuery && VALID_IDS.includes(fromQuery) ? fromQuery : "formations";
  })();
  const [active, setActive] = useState(initial);

  useEffect(() => {
    const fromQuery = searchParams.get("step");
    if (fromQuery && VALID_IDS.includes(fromQuery) && fromQuery !== active) {
      setActive(fromQuery);
    }
  }, [searchParams]);

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
      {active === "fair-play" && <StratFairPlay/>}
    </div>
  );
}

export default StrategyPage;
