import { createContext, useContext, useEffect, useReducer, useRef, useState } from "react";
import { Pitch, Player, Ball, Mark } from "./Board.jsx";
import { Kopik } from "./Kopik.jsx";
import { Icon } from "./Icons.jsx";
import { at, ballAt } from "../lib/pitch.js";
import { useTimeline } from "../hooks/useTimeline.js";
import { PHRASES, say, stop, useSpeech, useVoice } from "../lib/voice.js";

export const reducedMotion = () => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/* Situace na vlastní adrese (/utok/roztahni-se, nastavuje TopicPage): její název je H1 stránky a „Pro rodiče
   a trenéry“ obsahuje celý její text — vyhledávače čtou stránku až po vykreslení aplikace. Na adrese tématu
   (/utok) zůstává H1 název tématu. */
export const OwnPage = createContext(false);

export function SceneTitle({ children }) {
  const H = useContext(OwnPage) ? "h1" : "h2";
  return <H className="scene-title">{children}</H>;
}

/* Rozbalovací „Pro rodiče a trenéry“: proč se to tak hraje, na vlastní adrese situace i co v ní Kopík říká.
   story = [[„Takhle ano“, text], …] */
export function Why({ why, story = [] }) {
  const lines = useContext(OwnPage) ? story : [];
  if (!why && !lines.length) return null;
  return (
    <details className="why">
      <summary>Pro rodiče a trenéry</summary>
      {why && <p>{why}</p>}
      {lines.map(([label, text]) => (
        <p key={label}>
          <b>{label}:</b> {text}
        </p>
      ))}
    </details>
  );
}

/* Otázka do Kvízu: scene.quiz (scéna na tabuli), nebo Component.QUIZ (fotková situace, photoScene). */
export const quizOf = (s) => s.quiz ?? s.Component?.QUIZ;

const said = (beats = []) => beats.map((b) => b.say ?? b.text).join(" ");

/* Scéna = data → animace na tabuli + Kopíkův komentář.
   {
     id, title, icon, dur,
     beats:   [{ t, text, say }]                  // titulky; say = co Kopík řekne nahlas, když má
                                                  // dovysvětlit víc, než se vejde do titulku (výchozí text)
     players: [{ id, team: "us"|"them", gk, n, tag, hl, dim, path: [[t, x, y], …] }]
     ball:    [[t, x, y] | [t, "idHráče"] | [t, "idHráče", vzdálenost], …]
              // vzdálenost od středu hráče ve směru útoku: výchozí 1,5 (u nohy), 0 = v rukou,
              // záporná = míč za hráčem (hráč čelem k vlastní bráně)
     marks:   [{ kind, from, to, at, t: [od, do?], … }]  // viz Mark v Board.jsx
     why:     "věta pro trenéra/rodiče" (nepovinné)
     bad:     { …stejné klíče… }                  // varianta „Takhle ne“ (nepovinné)
     quiz:    { at, ask, options: [{ text, ok }] } // otázka do Kvízu: scéna se zastaví v čase at
     younger: { …stejné klíče… }                  // mladší přípravka U8–U9, kde má jiná pravidla (src/lib/age.js)
   }
   from / to / at: [x, y] | "idHráče" | "ball" — pozice v čase začátku značky
   (s follow: true v aktuálním čase — čára jde s hráčem).
   next = { title, go } — kam vede „Další“ v nabídce na konci (jako konec videa na YouTube). */
export function Scene({ scene, children, onEnded, next }) {
  const [bad, setBad] = useState(null); // null = celá situace od začátku: „Takhle ano“, pak sama „Takhle ne“
  const [run, setRun] = useState(0);
  const show = (b) => {
    setBad(b);
    setRun((r) => r + 1); // i klik na už vybranou variantu ji pustí znovu
  };
  const s = bad && scene.bad ? { ...scene, ...scene.bad } : scene;
  const story = [
    [scene.bad ? "Takhle ano" : "Kopík říká", said(scene.beats)],
    scene.bad?.beats && ["Takhle ne", said(scene.bad.beats)],
  ].filter(Boolean);
  const compare = scene.bad && (
    <div className="compare" role="group" aria-label="Porovnej">
      <button className="cmp cmp-good" aria-pressed={!bad} onClick={() => show(false)}>
        <Icon name="check" size={22} /> Takhle ano
      </button>
      <button className="cmp cmp-bad" aria-pressed={!!bad} onClick={() => show(true)}>
        <Icon name="cross" size={22} /> Takhle ne
      </button>
    </div>
  );
  return (
    <Play
      key={run}
      s={s}
      story={story}
      compare={compare}
      delay={run ? 0 : 1200} // po otevření se dítě chvilku rozkouká, po kliknutí hned
      onEnded={bad ? null : onEnded}
      onNext={bad === null && scene.bad ? () => show(true) : null}
      onReplay={() => show(null)}
      next={next}
    >
      {children}
    </Play>
  );
}

/* Aktuální titulek v čase t. */
/* Dořečené první „Takhle ano“ → 1,5 s pauza, Kopík řekne PHRASES.bad a sám pustí „Takhle ne“ (next).
   Vrací větu pro bublinu. Přepnutí, „Znovu“ nebo odchod řetěz zruší (on zhasne / odmontování). */
export function useChain(on, next) {
  const [note, setNote] = useState(null);
  useEffect(() => {
    if (!on) return;
    let live = true;
    const go = () => live && next();
    const t = setTimeout(() => {
      setNote(PHRASES.bad);
      say(PHRASES.bad, { onEnd: go }) || setTimeout(go, 2000); // bez hlasu: chvíli na přečtení
    }, 1500);
    return () => {
      live = false;
      clearTimeout(t);
      setNote(null);
    };
  }, [on]);
  return note;
}

export function beatAt(s, t) {
  let bi = 0;
  (s.beats || []).forEach((b, i) => {
    if (t + 0.001 >= b.t) bi = i;
  });
  return bi;
}

function Play({ s, story, compare, delay, children, onEnded, onNext, onReplay, next }) {
  const still = reducedMotion();
  const { time, setTime, playing, setPlaying } = useTimeline(s.dur, false, false);
  // Pustí se sama: po otevření scény za 1,2 s (dítě se rozkouká), po přepnutí Ano/Ne hned.
  const auto = useRef();
  const [waiting, setWaiting] = useState(!still);
  useEffect(() => {
    if (still) {
      setTime(s.dur);
      return;
    }
    auto.current = setTimeout(() => {
      setWaiting(false);
      setPlaying(true);
    }, delay);
    return () => clearTimeout(auto.current);
  }, []);

  const beats = s.beats || [];
  const bi = beatAt(s, time);
  const beat = beats[bi];
  // Čtení nahlas: každý titulek jednou; když Kopík ještě mluví a přijde další titulek,
  // animace počká, než dořekne (děti, které nečtou, jinak nestíhají).
  const voice = useRef({ spoken: -1, talking: false, held: false, n: 0 });
  const [, hush] = useReducer((n) => n + 1, 0); // Kopík domluvil → překreslit (hlídá to done)
  useEffect(() => {
    const v = voice.current;
    if (!beat || !playing || v.spoken === bi) return;
    const id = ++v.n;
    v.spoken = bi;
    v.talking = say(beat.say ?? beat.text, {
      onEnd: () => {
        if (id !== v.n) return; // dořekla se starší (přerušená) věta
        v.talking = false;
        hush();
        if (v.held) {
          v.held = false;
          setPlaying(true);
        }
      },
    });
  }, [bi, playing]);
  useEffect(() => {
    const v = voice.current;
    const next = beats[bi + 1];
    if (playing && v.talking && next && time >= next.t - 0.05) {
      v.held = true;
      setPlaying(false);
    }
  }, [time]);

  const ended = !playing && time >= s.dur;
  const done = ended && !voice.current.talking; // doběhla a Kopík dořekl poslední větu
  useEffect(() => {
    if (done) onEnded?.();
  }, [done]);

  // Děti se učí i z chyb: po „Takhle ano“ chvilka ticha, Kopík ohlásí „Takhle ne“ a ta se pustí sama.
  // Přehrát znovu, přepnout nebo odejít ze scény to zruší (cleanup).
  const chain = done && !!onNext && !still;
  const note = useChain(chain, onNext);

  // Konec jako u videa: přes tabuli „Znovu“ a „Další“ (na mobilu děti nevědí, že seznam situací nahoře jede do strany).
  // Jen když opravdu dohrála (ne hned po otevření bez animací) a nenavazuje „Takhle ne“.
  const [played, setPlayed] = useState(false);
  useEffect(() => {
    if (playing) setPlayed(true);
  }, [playing]);
  const over = done && played && !chain;

  // Ovládání jako u videa, přímo na tabuli: ťuknutí zastaví, při pauze překryv s velkým „Pustit“.
  // Čekání na Kopíka (held) ani rozjezd po otevření není pauza — tabule se nezakryje.
  const held = voice.current.held;
  const paused = !playing && !waiting && !held && (!ended || !played);
  const play = () => {
    clearTimeout(auto.current); // kliklo samo, nečekáme
    setWaiting(false);
    if (ended) voice.current.spoken = -1; // znovu od začátku = znovu i číst
    setPlaying(true);
  };
  const pause = () => {
    const v = voice.current;
    v.held = false;
    if (v.talking) {
      v.spoken = -1; // jako video ztichne; po puštění řekne titulek znovu celý
      stop();
    }
    setPlaying(false);
    hush();
  };

  return (
    <div className="scene">
      <SceneBoard s={s} time={time}>
        {(playing || held || waiting) && (
          <button className="board-tap" onClick={waiting ? play : pause} aria-label={waiting ? "Pustit" : "Zastavit"} />
        )}
        {paused && (
          <button className="board-play" onClick={play} aria-label="Pustit">
            <span className="end-ico">
              <Icon name="play" size={44} />
            </span>
          </button>
        )}
        <div className="board-progress" aria-hidden="true">
          {beats.map((b, i) => {
            const end = beats[i + 1]?.t ?? s.dur;
            return <span key={i} style={{ "--fill": Math.max(0, Math.min(1, (time - b.t) / (end - b.t || 1))) }} />;
          })}
        </div>
        {over && <BoardEnd onReplay={onReplay} next={next} />}
      </SceneBoard>
      <SceneTitle>{s.title}</SceneTitle>
      {compare}
      <Say text={note ?? beat?.text} spoken={note ?? beat?.say} />
      <Why why={s.why} story={story} />
      {children}
    </div>
  );
}

/* Tabule se scénou v čase time — čisté vykreslení, bez hodin (používá i Kvíz). children = vrstva přes tabuli. */
/* Konec situace jako u videa: tabule ztmavne, přes ni „Znovu“ a „Další“ (i vlastní situace, brankář). */
export function BoardEnd({ onReplay, next }) {
  return (
    <div className="board-end">
      <button className="end-btn" onClick={onReplay} aria-label="Znovu">
        <span className="end-ico">
          <Icon name="replay" size={34} />
        </span>
        <span className="end-label">Znovu</span>
      </button>
      {next && (
        <button className="end-btn end-next" onClick={next.go} aria-label={`Další: ${next.title}`}>
          <span className="end-ico">
            <Icon name="next" size={40} />
          </span>
          <span className="end-label">Další</span>
        </button>
      )}
    </div>
  );
}

export function SceneBoard({ s, time, children }) {
  const byId = Object.fromEntries((s.players || []).map((p) => [p.id, p]));
  const pos = (id, t) => at(byId[id]?.path, t);
  const fwd = (id) => (byId[id]?.team === "them" ? -1 : 1);
  const ballPos = (t) => ballAt(s.ball, t, pos, fwd);
  const point = (v, t) =>
    v == null ? null : v === "ball" ? ballPos(t) : typeof v === "string" ? pos(v, t) : { x: v[0], y: v[1] };

  const ball = ballPos(time);
  const marks = (s.marks || []).filter((m) => time >= (m.t?.[0] ?? 0) && (m.t?.[1] == null || time < m.t[1]));
  const isTop = (m) => m.kind === "label" || m.kind === "x" || m.kind === "check";
  const draw = (layer) => (m, i) => {
    const t0 = m.t?.[0] ?? 0;
    const p = Math.min(1, (time - t0) / 0.5);
    const tp = m.follow ? time : t0; // follow: true → čára sleduje hráče/míč
    return <Mark key={i} m={m} a={point(m.from ?? m.at, tp)} b={m.to && point(m.to, tp)} p={p} layer={layer} />;
  };

  return (
    <div className="board">
      <Pitch label={s.title}>
        {marks.filter((m) => !isTop(m)).map(draw("under"))}
        {(s.players || []).map((p) => {
          const xy = pos(p.id, time);
          return <Player key={p.id} {...p} x={xy.x} y={xy.y} />;
        })}
        {ball && <Ball x={ball.x} y={ball.y} />}
        {marks.filter((m) => isTop(m) || (m.kind === "zone" && m.text)).map(draw("over"))}
      </Pitch>
      {children}
    </div>
  );
}

/* Kopík + bublina s textem + tlačítko přečíst (spoken = delší verze nahlas). */
export function Say({ text, spoken = text, size = 64 }) {
  const { ready } = useVoice();
  const { speaking, blocked } = useSpeech();
  if (!text) return null;
  return (
    <div className="say">
      <Kopik size={size} talking={speaking} />
      <p className="say-text" key={text} aria-live="polite">
        {text}
      </p>
      {ready && (
        <button className="say-btn" onClick={() => say(spoken, { force: true })} aria-label="Přečíst nahlas">
          <Icon name="speaker" size={26} />
        </button>
      )}
      {ready && blocked && (
        <button className="say-unmute" onClick={() => say(spoken, { force: true })}>
          <Icon name="speaker" size={22} /> Ťukni a Kopík promluví
        </button>
      )}
    </div>
  );
}

export default Scene;
