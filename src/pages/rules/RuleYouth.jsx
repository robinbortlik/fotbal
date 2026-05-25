import { useState } from "react";
import { Mascot } from "../../components";
import { RuleShell } from "./RuleShell.jsx";

/* --- YOUTH CATEGORIES (FAČR U7-U13) --- */
const CATS = [
  {
    id: "u7",
    name: "U7 — mini přípravka",
    age: "do 7 let",
    color: "#7CD3A0",
    roster: "3+0 nebo 3+1 (s brankářem)",
    pitch: "≈ 24 × 18 m (vícekrát menší než velké hřiště)",
    goal: "malá branka cca 1,5 × 1 m (dle areálu)",
    duration: "3 × 10–15 minut",
    offside: "neaplikuje se — nech kluky/holky hrát!",
    subs: "neomezeně (rolling)",
    backpass: "malá domů — brankář nesmí chytit úmyslnou přihrávku nohou od spoluhráče",
    ball: "velikost 3"
  },
  {
    id: "u9",
    name: "U8 / U9 — mladší přípravka",
    age: "8–9 let",
    color: "#F2C572",
    roster: "4+1 (s brankářem)",
    pitch: "≈ 35–37 × 24–26 m",
    goal: "malá branka 3 × 2 m (nebo podle soutěže)",
    duration: "obvykle 4 × 15 minut",
    offside: "neaplikuje se",
    subs: "neomezeně (rolling)",
    backpass: "malá domů — brankář nesmí chytit úmyslnou přihrávku nohou",
    ball: "velikost 3"
  },
  {
    id: "u11",
    name: "U10 / U11 — starší přípravka",
    age: "10–11 let",
    color: "#E8A65A",
    roster: "5+1 (s brankářem)",
    pitch: "≈ 43–45 × 28–30 m",
    goal: "branka 5 × 2 m",
    duration: "2 × 25 min (případně 2 × 30 min nebo 3 × 16 min)",
    offside: "zjednodušeně — jen od linie pokutového území",
    subs: "neomezeně (rolling)",
    backpass: "malá domů — brankář nesmí chytit úmyslnou přihrávku nohou",
    ball: "velikost 4"
  },
  {
    id: "u13",
    name: "U12 / U13 — mladší žáci",
    age: "12–13 let",
    color: "#E8835A",
    roster: "7+1 (případně 8+1)",
    pitch: "≈ 60 × 40 m nebo polovina velkého hřiště",
    goal: "branka 5 × 2 m",
    duration: "2 × 30 min (7+1) nebo 2 × 35 min (8+1)",
    offside: "standardní pravidlo (jako u dospělých)",
    subs: "neomezeně (rolling)",
    backpass: "malá domů platí",
    ball: "velikost 4 (od U13 občas 5)"
  },
];

const ROW_FIELDS = [
  { id: "roster", label: "Počet hráčů", emoji: "👥" },
  { id: "pitch", label: "Velikost hřiště", emoji: "📐" },
  { id: "goal", label: "Branka", emoji: "🥅" },
  { id: "duration", label: "Délka zápasu", emoji: "⏱️" },
  { id: "offside", label: "Ofsajd", emoji: "🚩" },
  { id: "subs", label: "Střídání", emoji: "🔄" },
  { id: "backpass", label: "Malá domů", emoji: "🧤" },
  { id: "ball", label: "Velikost míče", emoji: "⚽" },
];

export function RuleYouth() {
  const [active, setActive] = useState("u9");
  const cat = CATS.find((c) => c.id === active);

  return (
    <RuleShell
      kicker="08 / Kategorie mládeže"
      title="Co hraju já? — kategorie mládeže"
      lead="Velký fotbal (11 hráčů, 90 minut) se učíš, ale ty teď hraješ menší fotbálek — a má svoje pravidla. Vyber kategorii a koukni, co platí."
      mascotText="Mladší přípravka kope na menší branky, hraje na menším hřišti a nedostává ofsajd. Pravidla velkého fotbalu se naučíš postupně — od U13 je to v podstatě jako u táty u televize!"
      sideSlot={
        <div className="flex flex-col gap-3">
          <div className="card">
            <div className="display text-xl">Vyber svou kategorii</div>
            <div className="flex flex-col gap-2 mt-3">
              {CATS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className={"step-chip " + (active === c.id ? "active" : "")}
                  style={{ width: "100%", textAlign: "left" }}
                  onClick={() => setActive(c.id)}
                >
                  <span style={{
                    display: "inline-block",
                    width: 10, height: 10, borderRadius: "50%",
                    background: c.color, marginRight: 8, verticalAlign: "middle"
                  }}/>
                  <b>{c.name}</b>
                  <span className="text-[12px] opacity-70 ml-2">({c.age})</span>
                </button>
              ))}
            </div>
          </div>
          <div className="card green flex items-center gap-3 p-4">
            <Mascot size={56} mood="wink" />
            <p className="text-[14px] opacity-95">Hraješ jinou kategorii? Pravidla se mírně liší podle ročníku a soutěže — pokud máš tým, řekne ti přesně trenér.</p>
          </div>
        </div>
      }
      pitchSlot={
        <div className="card" style={{ borderLeft: `8px solid ${cat.color}`, padding: 22 }}>
          <div className="flex items-center gap-3">
            <div className="text-[40px]">🧒</div>
            <div>
              <div className="text-xs font-bold tracking-wider uppercase opacity-70">{cat.age}</div>
              <div className="display text-2xl">{cat.name}</div>
            </div>
          </div>
          <div className="grid gap-2.5 mt-4" style={{ gridTemplateColumns: "1fr" }}>
            {ROW_FIELDS.map((f) => (
              <div
                key={f.id}
                className="flex items-start gap-3 p-2.5"
                style={{ background: "var(--paper)", borderRadius: 8 }}
              >
                <span className="text-[22px]" aria-hidden>{f.emoji}</span>
                <div className="flex-1">
                  <div className="text-[12px] font-bold uppercase tracking-wider opacity-60">{f.label}</div>
                  <div className="text-[15px] mt-0.5">{cat[f.id]}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      }
    >
      <div className="mt-6 card orange p-5">
        <div className="display text-xl">Proč je to jinak než u dospělých?</div>
        <p className="mt-2 text-[15px] opacity-95">
          Pro malé hráče platí menší hřiště i míče, kratší zápasy a jednodušší pravidla, aby se dalo na hřišti běhat, kopat a hrát — ne čekat a poslouchat píšťalku. Až od kategorie <b>mladších žáků (U12/U13)</b> se hraje s ofsajdem a na rozměrech, které se blíží velkému fotbalu. Ten teprve čeká ve <b>starších žácích (U14+)</b>.
        </p>
      </div>
    </RuleShell>
  );
}

export default RuleYouth;
