import { useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { Link } from "react-router-dom";
import { Pitch, Player, Ball, Mark } from "../components/Board.jsx";
import { Say } from "../components/Scene.jsx";
import { Icon } from "../components/Icons.jsx";
import { W, L } from "../lib/pitch.js";
import { say, PHRASES } from "../lib/voice.js";
import { NAV, PAGES, BOOK } from "../lib/nav.js";

/* Úvod: přepínač „Máme míč / Nemáme míč“ — nejdůležitější otázka fotbalu.
   Pozice jsou v podílech hřiště (x · W, y · L), takže sedí pro jakýkoli rozměr. */
export const SHAPES = {
  attack: {
    us: [[0.5, 0.08], [0.14, 0.3], [0.86, 0.3], [0.5, 0.46], [0.12, 0.7], [0.82, 0.74]],
    them: [[0.5, 0.94], [0.36, 0.8], [0.64, 0.8], [0.5, 0.66], [0.32, 0.6], [0.68, 0.58]],
    ball: { team: "us", i: 3 },
    text: PHRASES.attack,
  },
  defend: {
    us: [[0.5, 0.06], [0.38, 0.2], [0.62, 0.22], [0.5, 0.33], [0.3, 0.36], [0.64, 0.38]],
    them: [[0.5, 0.92], [0.16, 0.66], [0.84, 0.64], [0.62, 0.48], [0.22, 0.34], [0.8, 0.36]],
    ball: { team: "them", i: 3 },
    text: PHRASES.defend,
  },
};
const NUMS = [1, 2, 3, 4, 5, 6];

function Hero() {
  const [phase, setPhase] = useState("attack");
  const [prev, setPrev] = useState(null);
  const [snap, setSnap] = useState(false); // hráči přeskočí bez přechodu
  const shape = SHAPES[phase];
  const m = (pt) => ({ x: pt[0] * W, y: pt[1] * L });
  const holder = m(shape[shape.ball.team][shape.ball.i]);
  const ball = { x: holder.x, y: holder.y + (shape.ball.team === "us" ? 1.5 : -1.5) };
  const choose = (p) => {
    const from = p !== phase ? phase : p === "attack" ? "defend" : "attack";
    if (p === phase) {
      // Znovu stejné tlačítko: hráči skočí do druhého postavení a přeběhnou znovu.
      flushSync(() => {
        setSnap(true);
        setPhase(from);
      });
      void document.body.offsetWidth; // prohlížeč si skok zapíše, jinak by přechod nezačal
      setSnap(false);
    }
    setPrev(from);
    setPhase(p);
    say(SHAPES[p].text);
  };

  return (
    <section className="hero">
      <div className="hero-text">
        <h1>Máme míč, nebo nemáme?</h1>
        <p className="lead">Tohle se ve fotbale ptáš pořád. Přepni a koukej, co udělá náš žlutý tým.</p>
        <div className="phase" role="group" aria-label="Kdo má míč">
          <button className="phase-btn phase-us" aria-pressed={phase === "attack"} onClick={() => choose("attack")}>
            <Icon name="attack" size={30} /> Máme míč
          </button>
          <button className="phase-btn phase-them" aria-pressed={phase === "defend"} onClick={() => choose("defend")}>
            <Icon name="shield" size={30} /> Nemáme míč
          </button>
        </div>
        <Say text={shape.text} />
      </div>
      <div className="board hero-board">
        <Pitch label="Náš tým se roztahuje, když máme míč, a stahuje, když ho nemáme">
          {prev && (
            <g className="trails" key={phase}>
              {shape.us.map((pt, i) => {
                const a = m(SHAPES[prev].us[i]);
                const b = m(pt);
                return Math.hypot(b.x - a.x, b.y - a.y) > 3 ? (
                  <Mark key={i} m={{ kind: "run" }} a={a} b={b} />
                ) : null;
              })}
            </g>
          )}
          <g className={snap ? "glide snap" : "glide"}>
            {shape.them.map((pt, i) => (
              <Player key={"t" + i} {...m(pt)} team="them" gk={i === 0} />
            ))}
            {shape.us.map((pt, i) => (
              <Player key={"u" + i} {...m(pt)} team="us" gk={i === 0} n={NUMS[i]} />
            ))}
            <Ball {...ball} />
          </g>
        </Pitch>
      </div>
    </section>
  );
}

/* Jak číst tabuli — značky, které děti uvidí ve všech animacích. Malá SVG používají stejné
   komponenty jako hřiště (y = L − 2 → svisle uprostřed obrázku 8 × 4). */
export const LEGEND = [
  ["My (žlutí)", <Player x={4} y={L - 2} n={7} />],
  ["Soupeř (modří)", <Player x={4} y={L - 2} team="them" />],
  ["Náš brankář", <Player x={4} y={L - 2} gk n={1} />],
  ["Přihrávka", <Mark m={{ kind: "pass" }} a={{ x: 0.6, y: L - 2 }} b={{ x: 7.4, y: L - 2 }} />],
  ["Běh bez míče", <Mark m={{ kind: "run" }} a={{ x: 0.6, y: L - 2 }} b={{ x: 7.4, y: L - 2 }} />],
  ["Vedení míče", <Mark m={{ kind: "dribble" }} a={{ x: 0.6, y: L - 2 }} b={{ x: 7.4, y: L - 2 }} />],
  ["Střela", <Mark m={{ kind: "shot" }} a={{ x: 0.6, y: L - 2 }} b={{ x: 7.4, y: L - 2 }} />],
];

function Legend() {
  return (
    <section className="legend" aria-labelledby="tabule">
      <h2 id="tabule">Jak číst tabuli</h2>
      <ul>
        {LEGEND.map(([label, el]) => (
          <li key={label}>
            <svg viewBox="0 0 8 4" aria-hidden="true">
              {el}
            </svg>
            {label}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function HomePage() {
  useEffect(() => {
    document.title = PAGES["/"].title;
  }, []);
  return (
    <div className="page home">
      <Hero />
      <Legend />
      <section className="chapters" aria-labelledby="co-umet">
        <h2 id="co-umet">Co chceš umět?</h2>
        <div className="tiles">
          {NAV.map((n) => (
            <Link key={n.id} to={n.path} className={"tile tile-" + n.id}>
              <span className="tile-ico">
                <Icon name={n.icon} size={34} />
              </span>
              <span className="tile-label">{n.label}</span>
              <span className="tile-hint">{n.hint}</span>
            </Link>
          ))}
        </div>
        <p className="book-link">
          Chcete to mít na papíře? <a {...BOOK}>Stáhněte si knihu k vytištění (PDF)</a>.
        </p>
      </section>
    </div>
  );
}

export default HomePage;
