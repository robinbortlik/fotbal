import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mascot,
  MascotSay,
  BallIcon,
} from "../components";

/* === Quiz ===
   Each question now carries `explain` (always-shown post-answer) plus an
   optional `learn` deep-link to the lesson that covers the question, used
   on the end screen to bounce the kid to the relevant rule on misses. */
const QUIZ = [
  {
    q: "Kolik hráčů hraje v jednom týmu (včetně brankáře)?",
    a: ["9", "10", "11", "12"], correct: 2,
    hint: "Mysli na číslo z dresů. Plný tým má…",
    explain: "Tým má 11 hráčů — 1 brankář a 10 v poli. (V mládeži se hraje s menšími sestavami 4+1, 5+1, 7+1.)",
    learn: { to: "/pravidla?rule=basics", label: "Základy hry →" },
  },
  {
    q: "Co znamená ofsajd?",
    a: [
      "Útočník stojí za soupeřovou brankou",
      "Útočník je v okamžiku přihrávky blíž k bráně než předposlední soupeř",
      "Útočník překročí postranní čáru",
      "Útočník si vezme míč rukama"
    ], correct: 1,
    hint: "Důležité je, kdy se ofsajd posuzuje — v okamžiku přihrávky.",
    explain: "Ofsajd se posuzuje v okamžiku přihrávky. Útočník nesmí být blíž k bráně soupeře než předposlední soupeř (typicky obránce).",
    learn: { to: "/pravidla?rule=offside", label: "Ofsajd →" },
  },
  {
    q: "Z jaké vzdálenosti se kope penalta?",
    a: ["7 m", "9 m", "11 m", "16 m"], correct: 2,
    hint: "Tolik metrů, kolik je hráčů v týmu.",
    explain: "Penalta se kope z 11 metrů — stejné číslo, kolik je hráčů v týmu. Pamatuj si: 11 a 11.",
    learn: { to: "/pravidla?rule=penalty", label: "Penalta →" },
  },
  {
    q: "Kolik trvá zápas (bez nastavení)?",
    a: ["60 min", "80 min", "90 min", "100 min"], correct: 2,
    hint: "Dva poločasy po 45 minutách.",
    explain: "Velký fotbal trvá 90 minut: dva poločasy po 45 minutách. V mládeži je to kratší (např. 2 × 30 min v U13).",
    learn: { to: "/pravidla?rule=basics", label: "Základy hry →" },
  },
  {
    q: "Co dostane hráč za druhou žlutou kartu v jednom zápase?",
    a: [
      "Pokutu",
      "Volný kop pro soupeře",
      "Červenou kartu a musí ze hřiště",
      "Náhradníka místo sebe"
    ], correct: 2,
    hint: "Dvě žluté = jedna…?",
    explain: "Druhá žlutá v zápase = červená karta. Hráč musí pryč a tým hraje v deseti.",
    learn: { to: "/pravidla?rule=fouls", label: "Faul a karty →" },
  },
  {
    q: "Kdo smí ve vápně chytat míč rukama?",
    a: ["Útočník", "Záložník", "Brankář", "Kapitán"], correct: 2,
    hint: "Má rukavice a jiný dres.",
    explain: "Jen brankář, a jen ve svém pokutovém území. Mimo vápno už ani on rukama nesmí.",
    learn: { to: "/pozice", label: "Pozice hráčů →" },
  },
  {
    q: "Jaké rozestavení znamená 4-3-3?",
    a: [
      "4 obránci, 3 záložníci, 3 útočníci",
      "4 útočníci, 3 záložníci, 3 obránci",
      "4 brankáři, 3 obránci, 3 záložníci",
      "4 záložníci, 3 útočníci, 3 obránci"
    ], correct: 0,
    hint: "Čísla se čtou odzadu — od brankáře dopředu.",
    explain: "Čte se odzadu od brankáře: 4 obránci → 3 záložníci → 3 útočníci. Plus brankář dělá dohromady 11.",
    learn: { to: "/strategie?step=formations", label: "Formace →" },
  },
  {
    q: "Co je 'centr'?",
    a: [
      "Místo uprostřed hřiště",
      "Přihrávka z křídla do vápna",
      "Hráč ve středu obrany",
      "Sudí na lajně"
    ], correct: 1,
    hint: "Děje se to hlavně před brankou.",
    explain: "Centr je přihrávka z křídla doprostřed pokutového území — obvykle vzduchem na hlavu útočníkovi.",
    learn: { to: "/strategie?step=passing", label: "Přihrávání →" },
  },
  {
    q: "Co se stane, když míč přejde celou postranní čáru?",
    a: [
      "Roh",
      "Volný kop",
      "Aut",
      "Branka"
    ], correct: 2,
    hint: "Hází se zpátky do hřiště rukama.",
    explain: "Aut! Hráč soupeře (toho, kdo se míče nedotkl naposled) hází míč zpátky oběma rukama zezadu přes hlavu.",
    learn: { to: "/pravidla?rule=set", label: "Roh, aut a volný kop →" },
  },
  {
    q: "Když útočník kopne míč, ten projde brankovou čárou — ale jen půlka — je to gól?",
    a: [
      "Ano, stačí půlka",
      "Ne, musí celý míč přejít",
      "Jen když to je penalta",
      "Jen když to vidí sudí"
    ], correct: 1,
    hint: "Pamatuj si: celý za čárou!",
    explain: "Musí přejít CELÝ míč — ani milimetr méně. Ve velkých zápasech to dnes hlídá i gólová technologie.",
    learn: { to: "/pravidla?rule=goal", label: "Branka a góly →" },
  },
];

export function QuizPage() {
  const navigate = useNavigate();
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState(null);
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [done, setDone] = useState(false);
  // Track per-question correctness to drive the end-screen review.
  const [results, setResults] = useState([]);
  const q = QUIZ[idx];

  const pick = (i) => {
    if (picked !== null) return;
    setPicked(i);
    const correct = i === q.correct;
    if (correct) setScore(s => s + 1);
    setResults((r) => [...r, { idx, correct, picked: i }]);
  };

  const next = () => {
    setShowHint(false);
    setPicked(null);
    if (idx + 1 >= QUIZ.length) setDone(true);
    else setIdx(idx + 1);
  };

  const restart = () => {
    setIdx(0); setPicked(null); setScore(0); setShowHint(false); setDone(false);
    setResults([]);
  };

  if (done) {
    const pct = Math.round((score / QUIZ.length) * 100);
    const message = pct === 100 ? "Mistře! Stoprocentní úspěch!"
                  : pct >= 70 ? "Skvělé! Fotbal už umíš docela slušně."
                  : pct >= 40 ? "Není to špatné. Mrkni se ještě na pravidla a zkus to znovu."
                  : "To chce trochu cvičit. Vrať se na pravidla a strategii a pak to zkus znovu!";
    const missed = results.filter((r) => !r.correct);
    return (
      <div className="page text-center">
        <span className="eyebrow green"><BallIcon size={14}/> Hotovo!</span>
        <h1 className="mt-2.5">Skvělá práce!</h1>
        <div className="my-[30px] mx-auto max-w-[480px]">
          <Mascot size={140} mood={pct >= 70 ? "wink" : "happy"} bounce/>
        </div>
        <div className="display text-[72px]" style={{ color: "var(--orange-deep)" }}>{score} / {QUIZ.length}</div>
        <p className="lead mx-auto my-4 max-w-[560px]">{message}</p>

        {missed.length > 0 && (
          <div className="card mx-auto max-w-[640px] text-left mt-5 p-5">
            <div className="display text-xl">Co dotáhnout</div>
            <p className="text-[14px] text-navySoft mt-1">Tyhle otázky šly mimo. Klikni na lekci a koukni se znovu.</p>
            <ul className="pl-0 list-none flex flex-col gap-2 mt-3">
              {missed.map((m) => {
                const mq = QUIZ[m.idx];
                return (
                  <li key={m.idx}>
                    <div className="card p-3" style={{ borderLeft: "8px solid #e64a3b" }}>
                      <div className="text-[13px] font-bold text-navySoft tracking-wider uppercase">Otázka {m.idx + 1}</div>
                      <div className="font-display font-extrabold text-[15px] leading-snug mt-1">{mq.q}</div>
                      <p className="text-[14px] mt-1.5 opacity-95">{mq.explain}</p>
                      {mq.learn && (
                        <Link
                          to={mq.learn.to}
                          className="pill orange text-[13px] mt-2 inline-block"
                          style={{ textDecoration: "none" }}
                        >
                          📚 {mq.learn.label}
                        </Link>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        <div className="flex gap-3 justify-center mt-5 flex-wrap">
          <button className="btn primary" onClick={restart}>Hrát znovu</button>
          <button className="btn" onClick={() => navigate("/pravidla")}>Zpět na pravidla</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <span className="eyebrow green"><BallIcon size={14}/> Kapitola 8</span>
      <h1>Kvíz: co už umíš?</h1>
      <p className="lead">{QUIZ.length} otázek. Klikni na odpověď. Žádný stres — když se spleteš, dozvíš se proč.</p>

      <div className="divider"/>

      <div className="grid grid-cols-1 gap-5 max-w-[760px]">
        <div className="between">
          <div className="pill-row">
            {QUIZ.map((_, i) => (
              <div key={i}
                className="grid place-items-center font-display font-extrabold text-xs"
                style={{
                  width: 26, height: 26, borderRadius: "50%",
                  background: i < idx ? "var(--pitch)" : i === idx ? "var(--orange)" : "var(--cream-deep)",
                  border: "2px solid var(--navy)",
                  color: i === idx || i < idx ? "white" : "var(--navy-soft)",
                }}>{i + 1}</div>
            ))}
          </div>
          <div className="display text-[22px]" style={{ color: "var(--orange-deep)" }}>Skóre: {score}</div>
        </div>

        <div className="card p-7">
          <div className="text-sm font-bold text-navySoft tracking-wider uppercase">
            Otázka {idx + 1} / {QUIZ.length}
          </div>
          <div className="display quiz-question mt-2">{q.q}</div>
          <div className="grid grid-cols-1 gap-3 mt-5">
            {q.a.map((opt, i) => {
              let cls = "quiz-option";
              if (picked !== null) {
                if (i === q.correct) cls += " correct";
                else if (i === picked) cls += " wrong";
                else cls += " disabled";
              }
              return (
                <button key={i} className={cls} onClick={() => pick(i)}>
                  <span className="quiz-letter">{String.fromCharCode(65 + i)}</span>
                  {opt}
                </button>
              );
            })}
          </div>
          <div className="flex justify-between items-center mt-[18px] flex-wrap gap-3">
            <button className="btn sm" onClick={() => setShowHint(!showHint)}>
              💡 {showHint ? "Skrýt nápovědu" : "Nápověda"}
            </button>
            {picked !== null && (
              <button className="btn primary" onClick={next}>
                {idx + 1 === QUIZ.length ? "Vyhodnotit" : "Další otázka →"}
              </button>
            )}
          </div>
          {showHint && picked === null && (
            <div className="mt-3.5">
              <MascotSay mood="wink" size={56}>{q.hint}</MascotSay>
            </div>
          )}
          {picked !== null && (
            <div
              className="mt-3.5 p-3.5 rounded-[12px] border-2 border-navy"
              style={{ background: picked === q.correct ? "#dff5e6" : "#ffe9d6" }}
            >
              <div className="flex items-center gap-2.5">
                <Mascot size={42} mood={picked === q.correct ? "wink" : "default"}/>
                <div className="flex-1">
                  <b>{picked === q.correct ? "✓ Správně!" : "✗ Nesprávně."}</b> Správná odpověď: <b>{q.a[q.correct]}</b>.
                  <p className="text-[14px] mt-1 opacity-95">{q.explain}</p>
                  {picked !== q.correct && q.learn && (
                    <Link
                      to={q.learn.to}
                      className="pill orange text-[13px] mt-2 inline-block"
                      style={{ textDecoration: "none" }}
                    >
                      📚 {q.learn.label}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default QuizPage;
