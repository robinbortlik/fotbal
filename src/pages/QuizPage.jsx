import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { SceneBoard, Say, beatAt } from "../components/Scene.jsx";
import { Kopik } from "../components/Kopik.jsx";
import { Icon } from "../components/Icons.jsx";
import { useTimeline } from "../hooks/useTimeline.js";
import { say, PHRASES } from "../lib/voice.js";
import { PITCH } from "../scenes/hriste.js";
import { RULES } from "../scenes/pravidla.js";
import { ATTACK } from "../scenes/utok.js";
import { DEFENSE } from "../scenes/obrana.js";
import { KEEPER } from "../scenes/brankar.js";
import { PAGES } from "../lib/nav.js";

/* Kvíz „Co uděláš ty?“ — otázky jsou přímo ve scénách (pole quiz). Scéna se zastaví v čase
   quiz.at, dítě odpoví a scéna se dohraje: ukáže správné řešení. */
const ALL = [PITCH, RULES, ATTACK, DEFENSE, KEEPER].flatMap((topic) =>
  topic.scenes.filter((s) => s.quiz).map((scene) => ({ topic, scene }))
);
const ROUND = 8;

const shuffle = (a) => {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
};

export function QuizPage() {
  const [round, setRound] = useState(() => shuffle(ALL).slice(0, ROUND));
  const [results, setResults] = useState([]);
  useEffect(() => {
    document.title = PAGES["/kviz"].title;
  }, []);
  const again = () => {
    setRound(shuffle(ALL).slice(0, ROUND));
    setResults([]);
  };
  const n = results.length;

  return (
    <div className="page topic quiz">
      <header className="topic-head">
        <h1>Kvíz</h1>
        <p className="lead">Co uděláš ty?</p>
      </header>
      {n < round.length ? (
        <>
          <ol className="quiz-dots" aria-label={`Otázka ${n + 1} z ${round.length}`}>
            {round.map((_, k) => (
              <li key={k} className={k < n ? (results[k].ok ? "ok" : "miss") : k === n ? "now" : ""} />
            ))}
          </ol>
          <Question key={n + round[n].scene.id} q={round[n]} last={n + 1 === round.length} onNext={(ok) => setResults([...results, { ...round[n], ok }])} />
        </>
      ) : (
        <Done results={results} onAgain={again} />
      )}
    </div>
  );
}

function Question({ q, last, onNext }) {
  const { scene } = q;
  const { at: stop, ask, options } = scene.quiz;
  const { time, setPlaying } = useTimeline(scene.dur, false, false, stop);
  const opts = useMemo(() => shuffle(options), [options]);
  const [picked, setPicked] = useState(null);
  const [reading, setReading] = useState(-1); // která odpověď se právě čte (pro děti, co nečtou)
  const answered = picked != null;
  const ok = answered && opts[picked].ok;

  // Otázka a pak odpovědi; čtená odpověď se zvýrazní.
  useEffect(() => {
    say([ask, ...opts.map((o) => o.text)], { onItem: (i) => setReading(i - 1) });
  }, []);
  const pick = (k) => {
    if (answered) return;
    setPicked(k);
    setReading(-1);
    setPlaying(true);
    say(opts[k].ok ? PHRASES.right : PHRASES.wrong, { force: true });
  };
  const beat = scene.beats?.[beatAt(scene, time)];

  return (
    <div className="scene">
      <SceneBoard s={scene} time={time} />
      <h2 className="scene-title">{scene.title}</h2>
      <Say text={answered ? beat?.text : ask} spoken={answered ? beat?.say : undefined} />
      <div className="scene-extra">
        {answered && (
          <p className={"verdict " + (ok ? "ok" : "miss")}>
            <Icon name={ok ? "check" : "cross"} size={28} />
            {ok ? PHRASES.right : PHRASES.wrong}
          </p>
        )}
        <div className="answers">
          {opts.map((o, k) => (
            <button
              key={k}
              className={
                "answer" + (answered ? (o.ok ? " right" : k === picked ? " wrong" : " off") : k === reading ? " reading" : "")
              }
              onClick={() => pick(k)}
              disabled={answered && k !== picked && !o.ok}
            >
              {o.text}
            </button>
          ))}
        </div>
      </div>
      {answered && (
        <button className="btn go next" onClick={() => onNext(ok)}>
          {last ? "Ukaž výsledek" : "Další otázka"} <Icon name="next" />
        </button>
      )}
    </div>
  );
}

function Done({ results, onAgain }) {
  const good = results.filter((r) => r.ok).length;
  const missed = results.filter((r) => !r.ok);
  const text = good === results.length ? PHRASES.allRight : good >= results.length / 2 ? PHRASES.most : PHRASES.some;
  useEffect(() => {
    say(text);
  }, []);
  return (
    <section className="done">
      <Kopik size={120} className="kopik-jump" />
      <p className="score">
        {good} z {results.length}
      </p>
      <ol className="stars" aria-hidden="true">
        {results.map((r, k) => (
          <li key={k} className={r.ok ? "on" : ""}>
            ★
          </li>
        ))}
      </ol>
      <p className="lead">{text}</p>
      {missed.length > 0 && (
        <div className="again-list">
          <h2>Podívej se ještě na</h2>
          <ul>
            {missed.map(({ topic, scene }) => (
              <li key={topic.id + scene.id}>
                <Link to={`/${topic.id}/${scene.id}`}>
                  <span aria-hidden="true">{scene.icon}</span> {topic.title}: {scene.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      <button className="btn go" onClick={onAgain}>
        <Icon name="replay" /> Hrát znovu
      </button>
    </section>
  );
}

export default QuizPage;
