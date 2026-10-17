import { useEffect, useState } from "react";
import { BoardEnd, Say, SceneTitle, useChain, Why } from "../Scene.jsx";
import { Icon } from "../Icons.jsx";
import { say } from "../../lib/voice.js";
import { W, L, PAD } from "../../lib/pitch.js";
import "./keeper.css";

/* Společné kousky vlastních situací (brankář, kopání). */

/* Přečte text nahlas (když má dítě zapnuté čtení), kdykoli se změní — jako titulky ve <Scene>.
   Komponenty sem dávají mluvenou verzi (say: titulek + proč), stejnou jako tlačítko 🔊 (Say spoken)
   a Component.TEXTS, ze kterých se nahrává hlas. Vrací true, až Kopík dořekne (nejdřív za 3 s, ať se to stihne
   přečíst) → na tabuli „Znovu“ a „Další“ jako na konci animované situace. */
export function useSpeak(text) {
  const [done, setDone] = useState(false);
  useEffect(() => {
    setDone(false);
    let live = true;
    const t0 = Date.now();
    const end = () => setTimeout(() => live && setDone(true), Math.max(0, 3000 - (Date.now() - t0)));
    say(text, { onEnd: end }) || end(); // bez hlasu: jen čas na přečtení
    return () => {
      live = false;
    };
  }, [text]);
  return done;
}

/* Přepínač dvou stavů. options: [{ id, text, tone?: "good" | "bad", icon? }].
   tone = stejná tlačítka jako „Takhle ano / Takhle ne“ ve <Scene>; bez tone žlutá volba. */
export function Choice({ label, value, onChange, options }) {
  return (
    <div className="compare" role="group" aria-label={label}>
      {options.map((o) => (
        <button
          key={o.id}
          className={"cmp " + (o.tone ? "cmp-" + o.tone : "gk-pick")}
          aria-pressed={value === o.id}
          onClick={() => onChange(o.id)}
        >
          {o.icon && <Icon name={o.icon} size={22} />} {o.text}
        </button>
      ))}
    </div>
  );
}

export const GOOD_BAD = [
  { id: "good", text: "Takhle ano", tone: "good", icon: "check" },
  { id: "bad", text: "Takhle ne", tone: "bad", icon: "cross" },
];

/* Kreslicí plocha ilustrace: stejný poměr stran jako hřiště (Pitch), ať sedí rozvržení scény.
   Souřadnice: x −2.4…32.4 zleva, y −2.4…47.4 shora dolů (obyčejné SVG, žádné sy). */
export const ART = { x0: -PAD, y0: -PAD, w: W + PAD * 2, h: L + PAD * 2 };
export function Art({ label, children }) {
  return (
    <svg viewBox={`${ART.x0} ${ART.y0} ${ART.w} ${ART.h}`} className="pitch gk-art" role="img" aria-label={label}>
      {children}
    </svg>
  );
}

/* Fotka přes celou plochu ilustrace (3 : 4 oříznutá na poměr hřiště, uprostřed). */
export function Photo({ src }) {
  return <image href={src} x={ART.x0} y={ART.y0} width={ART.w} height={ART.h} preserveAspectRatio="xMidYMid slice" />;
}

/* Štítek jako na tabuli (třídy .tag z index.css), volitelně s čárkou k místu `to`. */
export function Label({ x, y, text, tone = "ink", to }) {
  const w = text.length * 0.84 + 1.8;
  return (
    <g className={"gk-label tag tag-" + tone}>
      {to && <path className="gk-leader" d={`M${x} ${y}L${to[0]} ${to[1]}`} />}
      <rect x={x - w / 2} y={y - 1.25} width={w} height={2.5} rx={1.25} />
      <text x={x} y={y + 0.55}>
        {text}
      </text>
    </g>
  );
}

/* Situace „Takhle ano / Takhle ne“ ze dvou fotek (vygenerovaných Gemini) se štítky — postoj brankáře, kopání…
   good / bad = { text, say, src, alt, labels: [[x, y, "štítek", [kamX, kamY]], …] }: text = krátký titulek,
   say = co Kopík řekne nahlas (titulek + proč). quiz = { ask, options: [{ text, ok }], on?: "good" }: v Kvízu
   fotka „Takhle ne“ (nebo „Takhle ano“) bez štítků, po odpovědi se štítky a titulkem.
   Vrací scénu { id, title, icon, Component } pro src/scenes. */
export function photoScene({ id, title, icon, good, bad, why, quiz }) {
  const art = (side, bare) => (
    <Art label={side.alt}>
      <Photo src={side.src} />
      {!bare &&
        side.labels.map(([x, y, text, to]) => <Label key={text} x={x} y={y} text={text} to={to} tone={side === bad ? "bad" : "ink"} />)}
    </Art>
  );
  const story = [["Takhle ano", good.say], ["Takhle ne", bad.say]];

  function PhotoScene({ children, onReplay, next }) {
    const [mode, setMode] = useState("good");
    const [opening, setOpening] = useState(true); // jen první „Takhle ano“ pokračuje samo na „Takhle ne“
    const line = mode === "bad" ? bad : good;
    const done = useSpeak(line.say);
    const chain = done && opening && line === good;
    const note = useChain(chain, () => setMode("bad"));
    const pick = (m) => {
      setOpening(false);
      setMode(m);
    };
    return (
      <div className="scene">
        <div className="board">
          {art(line)}
          {done && !chain && <BoardEnd onReplay={onReplay} next={next} />}
        </div>
        <SceneTitle>{title}</SceneTitle>
        <Choice label="Porovnej" value={mode} onChange={pick} options={GOOD_BAD} />
        <Say text={note ?? line.text} spoken={note ?? line.say} />
        <Why why={why} story={story} />
        {children}
      </div>
    );
  }
  PhotoScene.TEXTS = [good.say, bad.say];
  // Kniha k tisku (src/book): obrázky se štítky a titulky.
  PhotoScene.PRINT = {
    frames: [
      { tone: "good", text: good.text, art: art(good) },
      { tone: "bad", text: bad.text, art: art(bad) },
    ],
    why,
  };
  if (quiz) {
    const side = quiz.on === "good" ? good : bad;
    PhotoScene.QUIZ = { ...quiz, art: art(side, true), solved: art(side), text: side.text, say: side.say };
  }
  return { id, title, icon, Component: PhotoScene };
}
