/* === Quiz === */

const QUIZ = [
  { q: "Kolik hráčů hraje v jednom týmu (včetně brankáře)?", a: ["9", "10", "11", "12"], correct: 2,
    hint: "Mysli na číslo z dresů. Plný tým má…" },
  { q: "Co znamená ofsajd?", a: [
      "Útočník stojí za soupeřovou brankou",
      "Útočník je v okamžiku přihrávky blíž k bráně než předposlední soupeř",
      "Útočník překročí postranní čáru",
      "Útočník si vezme míč rukama"
    ], correct: 1, hint: "Důležité je, kdy se ofsajd posuzuje — v okamžiku přihrávky." },
  { q: "Z jaké vzdálenosti se kope penalta?", a: ["7 m", "9 m", "11 m", "16 m"], correct: 2,
    hint: "Vzdálenost je stejná jako rok začátku 1. světové války… nebo skoro." },
  { q: "Kolik trvá zápas (bez nastavení)?", a: ["60 min", "80 min", "90 min", "100 min"], correct: 2,
    hint: "Dva poločasy po 45 minutách." },
  { q: "Co dostane hráč za druhou žlutou kartu v jednom zápase?", a: [
      "Pokutu",
      "Volný kop pro soupeře",
      "Červenou kartu a musí ze hřiště",
      "Náhradníka místo sebe"
    ], correct: 2, hint: "Dvě žluté = jedna…?" },
  { q: "Kdo smí ve vápně chytat míč rukama?", a: ["Útočník", "Záložník", "Brankář", "Kapitán"], correct: 2,
    hint: "Má rukavice a jiný dres." },
  { q: "Jaké rozestavení znamená 4-3-3?", a: [
      "4 obránci, 3 záložníci, 3 útočníci",
      "4 útočníci, 3 záložníci, 3 obránci",
      "4 brankáři, 3 obránci, 3 záložníci",
      "4 záložníci, 3 útočníci, 3 obránci"
    ], correct: 0, hint: "Čísla se čtou odzadu — od brankáře dopředu." },
  { q: "Co je 'centr'?", a: [
      "Místo uprostřed hřiště",
      "Přihrávka z křídla do vápna",
      "Hráč ve středu obrany",
      "Sudí na lajně"
    ], correct: 1, hint: "Děje se to hlavně před brankou." },
  { q: "Co se stane, když míč přejde celou postranní čáru?", a: [
      "Roh",
      "Volný kop",
      "Aut",
      "Branka"
    ], correct: 2, hint: "Hází se zpátky do hřiště rukama." },
  { q: "Když útočník kopne míč, ten projde brankovou čárou — ale jen půlka — je to gól?", a: [
      "Ano, stačí půlka",
      "Ne, musí celý míč přejít",
      "Jen když to je penalta",
      "Jen když to vidí sudí"
    ], correct: 1, hint: "Pamatuj si: celý za čárou!" },
];

function QuizPage() {
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState(null);
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [done, setDone] = useState(false);
  const q = QUIZ[idx];

  const pick = (i) => {
    if (picked !== null) return;
    setPicked(i);
    if (i === q.correct) setScore(s => s + 1);
  };

  const next = () => {
    setShowHint(false);
    setPicked(null);
    if (idx + 1 >= QUIZ.length) setDone(true);
    else setIdx(idx + 1);
  };

  const restart = () => {
    setIdx(0); setPicked(null); setScore(0); setShowHint(false); setDone(false);
  };

  if (done) {
    const pct = Math.round((score / QUIZ.length) * 100);
    const message = pct === 100 ? "Mistře! Stoprocentní úspěch!"
                  : pct >= 70 ? "Skvělé! Fotbal už umíš docela slušně."
                  : pct >= 40 ? "Není to špatné. Mrkni se ještě na pravidla a zkus to znovu."
                  : "To chce trochu cvičit. Vrať se na pravidla a strategii a pak to zkus znovu!";
    return (
      <div className="page" style={{ textAlign: "center" }}>
        <span className="eyebrow green"><BallIcon size={14}/> Hotovo!</span>
        <h1 style={{ marginTop: 10 }}>Skvělá práce!</h1>
        <div style={{ margin: "30px auto", maxWidth: 480 }}>
          <Mascot size={140} mood={pct >= 70 ? "wink" : "happy"} bounce/>
        </div>
        <div className="display" style={{ fontSize: 72, color: "var(--orange-deep)" }}>{score} / {QUIZ.length}</div>
        <p className="lead" style={{ margin: "16px auto", maxWidth: 560 }}>{message}</p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 20 }}>
          <button className="btn primary" onClick={restart}>Hrát znovu</button>
          <button className="btn" onClick={() => window.dispatchEvent(new CustomEvent("nav", { detail: "rules" }))}>Zpět na pravidla</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <span className="eyebrow green"><BallIcon size={14}/> Kapitola 6</span>
      <h1>Kvíz: co už umíš?</h1>
      <p className="lead">{QUIZ.length} otázek. Klikni na odpověď. Žádný stres — když se spleteš, dozvíš se proč.</p>

      <div className="divider"/>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 22, maxWidth: 760 }}>
        <div className="between">
          <div className="pill-row">
            {QUIZ.map((_, i) => (
              <div key={i} style={{
                width: 26, height: 26, borderRadius: "50%",
                background: i < idx ? "var(--pitch)" : i === idx ? "var(--orange)" : "var(--cream-deep)",
                border: "2px solid var(--navy)",
                display: "grid", placeItems: "center",
                fontSize: 12, fontWeight: 800, color: i === idx || i < idx ? "white" : "var(--navy-soft)",
                fontFamily: "Bricolage Grotesque, sans-serif"
              }}>{i + 1}</div>
            ))}
          </div>
          <div className="display" style={{ fontSize: 22, color: "var(--orange-deep)" }}>Skóre: {score}</div>
        </div>

        <div className="card" style={{ padding: 28 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "var(--navy-soft)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Otázka {idx + 1} / {QUIZ.length}
          </div>
          <div className="display" style={{ fontSize: 28, marginTop: 8 }}>{q.q}</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12, marginTop: 20 }}>
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
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 18, flexWrap: "wrap", gap: 12 }}>
            <button className="btn sm" onClick={() => setShowHint(!showHint)}>
              💡 {showHint ? "Skrýt nápovědu" : "Nápověda"}
            </button>
            {picked !== null && (
              <button className="btn primary" onClick={next}>
                {idx + 1 === QUIZ.length ? "Vyhodnotit" : "Další otázka →"}
              </button>
            )}
          </div>
          {showHint && (
            <div style={{ marginTop: 14 }}>
              <MascotSay mood="wink" size={56}>{q.hint}</MascotSay>
            </div>
          )}
          {picked !== null && (
            <div style={{ marginTop: 14, padding: 14, borderRadius: 12, background: picked === q.correct ? "#dff5e6" : "#ffe9d6", border: "2px solid var(--navy)" }}>
              <b>{picked === q.correct ? "✓ Správně!" : "✗ Nesprávně."}</b> Správná odpověď: <b>{q.a[q.correct]}</b>.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { QuizPage });
