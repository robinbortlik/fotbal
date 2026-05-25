import { useState } from "react";
import { Mascot } from "../../components";
import { RuleShell } from "./RuleShell.jsx";

/* --- FOULS --- */
const examples = [
  { card: "yellow", title: "Žlutá karta", reasons: ["Tvrdý faul", "Zdržování hry", "Protesty proti rozhodčímu", "Úmyslná ruka"] },
  { card: "red", title: "Červená karta", reasons: ["Velmi tvrdý faul", "Druhá žlutá v zápase", "Zabránění čisté gólové šanci", "Plivnutí, urážky"] },
];

const EXTRA = [
  {
    emoji: "✋",
    title: "Ruka úmyslně",
    text: "Faul je jen ÚMYSLNÁ ruka — když si hráč míč rukou srovná, hraje rukou nad ramenem, nebo si ruku odtáhne od těla, aby zvětšil tělo. Ruka přitisknutá k tělu obvykle faul není.",
  },
  {
    emoji: "🧤",
    title: "Malá domů",
    text: "Brankář NESMÍ chytit do rukou úmyslnou přihrávku nohou od spoluhráče. Pokud chytí, soupeř kope nepřímý volný kop. (Platí i v mládeži.)",
  },
  {
    emoji: "⏩",
    title: "Výhoda",
    text: "Když nastane faul, ale faulovaný tým má výhodu (zachová si míč a může pokračovat), rozhodčí může nepískat a nechat hrát. Říká se tomu „výhoda“ — sudí ji ukazuje oběma rukama vpřed.",
  },
];

/* Mini-quiz scenarios — used by the interactivity upgrade in phase 8c.
   Kept in this file because the data + scoring belongs to this lesson. */
const QUIZ = [
  {
    id: "tackle",
    text: "Útočník v souboji o míč ucouvne a podloží obránci nohu z boku — obránce padá.",
    correct: "yellow",
    explain: "Riskantní faul ze strany. Obvykle žlutá karta. Kdyby šel zezadu plnou silou, byla by červená.",
  },
  {
    id: "dogso",
    text: "Útočník je sám před brankářem (čistá šance). Obránce ho chytne za dres, aby ho zastavil.",
    correct: "red",
    explain: "Zabránění čisté gólové šanci (DOGSO) = červená karta.",
  },
  {
    id: "accidental",
    text: "Útočník vystřelí, míč se nečekaně odrazí o ruku obránce, která visí podél těla.",
    correct: "none",
    explain: "Není to úmyslná ruka — ruka byla přirozeně podél těla. Hra pokračuje.",
  },
  {
    id: "insult",
    text: "Brankář po obdrženém gólu nadává hlavnímu rozhodčímu.",
    correct: "red",
    explain: "Urážky rozhodčího = červená karta, brankář musí pryč.",
  },
];

const PICK = [
  { id: "none", emoji: "⚪", label: "Nic", color: "var(--paper)", text: "var(--navy)" },
  { id: "yellow", emoji: "🟨", label: "Žlutá", color: "#FFD23F", text: "var(--navy)" },
  { id: "red", emoji: "🟥", label: "Červená", color: "#e64a3b", text: "white" },
];

function CardQuiz() {
  const [active, setActive] = useState(0);
  const [pick, setPick] = useState(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(0);
  const q = QUIZ[active];
  const isLast = active === QUIZ.length - 1;
  const isCorrect = pick === q.correct;

  function choose(id) {
    if (pick !== null) return;
    setPick(id);
    setAnswered((n) => n + 1);
    if (id === q.correct) setScore((s) => s + 1);
  }
  function next() {
    if (isLast) {
      setActive(0); setPick(null); setScore(0); setAnswered(0);
    } else {
      setActive((i) => i + 1); setPick(null);
    }
  }

  return (
    <div className="card p-5" style={{ borderColor: "var(--navy)" }}>
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="display text-xl">Co bys ukázal/a ty?</div>
        <span className="pill orange text-[12px]">Otázka {active + 1} / {QUIZ.length} · Skóre {score}/{answered}</span>
      </div>
      <p className="mt-3 text-[15px] leading-relaxed">{q.text}</p>
      <div className="grid gap-2.5 mt-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))" }}>
        {PICK.map((p) => {
          const isPick = pick === p.id;
          const showResult = pick !== null;
          const isAnswer = p.id === q.correct;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => choose(p.id)}
              disabled={pick !== null}
              className="tile p-3.5"
              style={{
                background: showResult && isAnswer ? "#1f8a4c" :
                            showResult && isPick && !isCorrect ? "#a93a2a" : p.color,
                color: showResult && (isAnswer || (isPick && !isCorrect)) ? "white" : p.text,
                opacity: pick !== null && !isPick && !isAnswer ? 0.55 : 1,
                cursor: pick === null ? "pointer" : "default",
              }}
            >
              <div className="text-[28px]">{p.emoji}</div>
              <div className="font-display font-extrabold text-[15px] mt-1">{p.label}</div>
            </button>
          );
        })}
      </div>
      {pick !== null && (
        <div className="mt-4 card" style={{ background: isCorrect ? "#dff5e6" : "#ffe9d6", borderColor: isCorrect ? "var(--pitch-dark)" : "#d18800" }}>
          <div className="flex items-center gap-2.5">
            <Mascot size={48} mood={isCorrect ? "wink" : "default"} />
            <div>
              <div className="display text-[18px]">{isCorrect ? "✓ Správně!" : "Vedle — koukni se na to znova"}</div>
              <p className="mt-1 text-[14px] opacity-95">{q.explain}</p>
            </div>
          </div>
          <button type="button" onClick={next} className="btn primary mt-3">
            {isLast ? "Začít znovu" : "Další scénář →"}
          </button>
        </div>
      )}
    </div>
  );
}

export function RuleFouls() {
  return (
    <RuleShell
      kicker="03 / Fauly"
      title="Faul a karty"
      lead="Když hráč poruší pravidla, dostane od sudího kartu. Žlutá = varování, červená = konec."
      mascotText="Fauly jsou strkání, podražení, držení, kopání do soupeře. Po faulu dostane druhý tým volný kop. Když je to ve vápně, je z toho penalta!"
      pitchSlot={
        <div className="flex flex-col gap-4">
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

          <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
            {EXTRA.map((e) => (
              <div key={e.title} className="card p-4" style={{ borderLeft: "8px solid var(--pitch)" }}>
                <div className="flex items-center gap-2.5">
                  <span className="text-[28px]" aria-hidden>{e.emoji}</span>
                  <div className="display text-[18px]">{e.title}</div>
                </div>
                <p className="mt-2 text-[14px] opacity-95">{e.text}</p>
              </div>
            ))}
          </div>

          <CardQuiz/>
        </div>
      }
    />
  );
}

export default RuleFouls;
