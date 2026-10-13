import { useEffect, useRef, useState } from "react";
import { Pitch, Player, Ball, Mark } from "../Board.jsx";
import { Say } from "../Scene.jsx";
import { W, L, GOAL_W, PAD, sy } from "../../lib/pitch.js";
import { Choice, GOOD_BAD, useSpeak } from "./parts.jsx";

/* Kde stát — dítě táhne (nebo ťukne) míč po naší polovině a brankář se sám staví na spojnici
   míč – střed brány, kousek před brankovou čarou. Tečkované čáry k tyčím = „trojúhelník střely“.
   Takhle ne: brankář trčí uprostřed na čáře → kus brány zůstane volný (červeně). */
// text = krátký titulek, say = co Kopík řekne nahlas (titulek + proč)
const HINT = {
  text: "Posuň míč. Kam se postaví brankář?",
  say: "Posuň míč jinam a sleduj brankáře. Pokaždé se postaví tam, kde zakryje nejvíc brány.",
};
const GOOD = {
  text: "Stůj mezi míčem a středem brány.",
  say: "Stůj mezi míčem a středem brány. Tak zakryješ obě strany stejně a střelec skoro nemá kam mířit.",
};
const BAD = {
  text: "Stojíš na čáře uprostřed? U tyče je díra!",
  say: "Stojíš uprostřed na čáře? Když přijde míč ze strany, zůstane ti u tyče díra a střelec ji snadno trefí.",
};

const WHY =
  "Brankář se staví na pomyslnou spojnici míče a středu branky, kousek před brankovou čarou: z pohledu střelce tak zakryje bránu rovnoměrně na obě strany a zmenší úhel ke střele. Kdo zůstane uprostřed na čáře, nechá při míči ze strany volnou bližší tyč.";

const R = 1.3; // poloměr hráče na tabuli (Board.jsx)
const GX = W / 2; // střed brány (na brankové čáře y = 0)
const POSTS = [GX - GOAL_W / 2, GX + GOAL_W / 2];
const STUCK = { x: GX, y: 1.0 }; // Takhle ne: uprostřed na čáře
const MIN_D = 7; // míč nejblíž 7 m od středu brány (blíž by brankář šel rovnou na míč)
const STEP = 1.5; // posun míče šipkou (m)

/* Kam se postaví brankář: na spojnici míč – střed brány. Čím víc je míč uprostřed, tím dál
   vyleze (oblouk od tyče k tyči); když je míč blíž, ještě o kus dál (zmenší úhel). */
export function keeperSpot(b) {
  const dx = b.x - GX;
  const D = Math.hypot(dx, b.y);
  const centred = b.y / D; // 1 = míč přímo před bránou, 0 = u brankové čáry
  const close = Math.min(1, Math.max(0, (20 - D) / 12));
  const d = Math.min((1.2 + 1.6 * centred) * (1 + 0.3 * close), D - 3.2);
  return { x: GX + (dx / D) * d, y: Math.max(1.1, (b.y / D) * d) };
}

/* Volné kusy brány z pohledu míče: úseky brankové čáry, které brankář (kruh) nezakryje. */
function holes(b, k) {
  const hit = (a) => {
    const s = Math.sin(a);
    if (s < -1e-6) return b.x - (Math.cos(a) * b.y) / s;
    return Math.cos(a) < 0 ? -Infinity : Infinity; // paprsek čáru mine
  };
  const ak = Math.atan2(k.y - b.y, k.x - b.x);
  const half = Math.asin(Math.min(1, R / Math.hypot(k.x - b.x, k.y - b.y)));
  const [c0, c1] = [hit(ak - half), hit(ak + half)].sort((p, q) => p - q);
  const out = [];
  if (c0 > POSTS[0]) out.push([POSTS[0], Math.min(POSTS[1], c0)]);
  if (c1 < POSTS[1]) out.push([Math.max(POSTS[0], c1), POSTS[1]]);
  return out.filter(([a, z]) => z - a > 0.2);
}

/* Míč jen na naší polovině, na hřišti a ne až u branky. */
function place(p) {
  let x = Math.min(W - 0.8, Math.max(0.8, p.x));
  let y = Math.min(L / 2, Math.max(0.8, p.y));
  const D = Math.hypot(x - GX, y);
  if (D < MIN_D) {
    const f = MIN_D / (D || 1);
    x = GX + (x - GX) * f;
    y = D ? y * f : MIN_D;
  }
  return { x, y };
}

export function KeeperAngle({ children }) {
  const [ball, setBall] = useState({ x: 23.5, y: 10 });
  const [mode, setMode] = useState("good");
  const [moved, setMoved] = useState(false);
  const drag = useRef(false);
  const ballRef = useRef(null);
  const bad = mode === "bad";
  const line = bad ? BAD : moved ? GOOD : HINT;
  useSpeak(line.say);

  // iOS Safari nemusí respektovat touch-action na prvku SVG → tah za míč nesmí posouvat stránku.
  useEffect(() => {
    const el = ballRef.current;
    const stop = (e) => e.preventDefault();
    el?.addEventListener("touchstart", stop, { passive: false });
    return () => el?.removeEventListener("touchstart", stop);
  }, []);

  const move = (p) => {
    setBall(place(p));
    setMoved(true);
  };
  const fromEvent = (e) => {
    const svg = e.currentTarget.ownerSVGElement || e.currentTarget;
    const pt = new DOMPoint(e.clientX, e.clientY).matrixTransform(svg.getScreenCTM().inverse());
    return { x: pt.x, y: L - pt.y };
  };
  const keys = { ArrowLeft: [-STEP, 0], ArrowRight: [STEP, 0], ArrowUp: [0, STEP], ArrowDown: [0, -STEP] };
  const onKey = (e) => {
    const v = keys[e.key];
    if (!v) return;
    e.preventDefault();
    move({ x: ball.x + v[0], y: ball.y + v[1] });
  };

  return (
    <div className="scene">
      <div className="board">
        <AnglePitch
          ball={ball}
          bad={bad}
          label="Kde stát: posuň míč a brankář se postaví mezi míč a střed brány"
          role="group"
          className="gk-pitch"
          onClick={(e) => move(fromEvent(e))}
          onPointerMove={(e) => drag.current && move(fromEvent(e))}
          onPointerUp={() => (drag.current = false)}
          onPointerCancel={() => (drag.current = false)}
          ballEl={
            <g
              ref={ballRef}
              className="gk-ball"
              tabIndex={0}
              role="button"
              aria-label="Míč – posuň ho šipkami"
              onKeyDown={onKey}
              onPointerDown={(e) => {
                drag.current = true;
                e.currentTarget.ownerSVGElement.setPointerCapture(e.pointerId);
              }}
            >
              <circle className="gk-hit" cx={ball.x} cy={sy(ball.y)} r={2.8} />
              {!moved && <circle className="gk-hint" cx={ball.x} cy={sy(ball.y)} r={1.7} />}
              <circle className="gk-focus" cx={ball.x} cy={sy(ball.y)} r={1.5} />
              <Ball x={ball.x} y={ball.y} />
            </g>
          }
        />
      </div>
      <h2 className="scene-title">Kde stát</h2>
      <Choice label="Porovnej" value={mode} onChange={setMode} options={GOOD_BAD} />
      <Say text={line.text} spoken={line.say} />
      <details className="why">
        <summary>Pro rodiče a trenéry</summary>
        <p>{WHY}</p>
      </details>
      {children}
    </div>
  );
}
KeeperAngle.TEXTS = [HINT.say, GOOD.say, BAD.say];
const HALF = `${-PAD} ${sy(20)} ${W + PAD * 2} ${20 + PAD}`; // v knize jen kus hřiště u naší brány
KeeperAngle.PRINT = {
  frames: [
    { tone: "good", text: GOOD.text, art: <AnglePitch ball={{ x: 23.5, y: 10 }} viewBox={HALF} /> },
    { tone: "good", text: "Míč jde jinam? Posuň se s ním.", art: <AnglePitch ball={{ x: 8, y: 15 }} viewBox={HALF} /> },
    { tone: "bad", text: BAD.text, art: <AnglePitch ball={{ x: 23.5, y: 10 }} viewBox={HALF} bad /> },
  ],
  why: WHY,
};

/* Hřiště s „trojúhelníkem střely“ a brankářem pro míč v ball (Takhle ne: brankář uprostřed na čáře).
   ballEl = míč: v aplikaci tahací, v knize obyčejný. */
function AnglePitch({ ball, bad, ballEl = <Ball x={ball.x} y={ball.y} />, ...rest }) {
  const k = bad ? STUCK : keeperSpot(ball);
  const gaps = bad ? holes(ball, k) : [];
  const tri = `${ball.x},${sy(ball.y)} ${POSTS[0]},${sy(0)} ${POSTS[1]},${sy(0)}`;
  return (
    <Pitch {...rest}>
      <polygon className="gk-shot" points={tri} />
      {gaps.map(([a, z]) => (
        <polygon key={a} className="gk-hole" points={`${ball.x},${sy(ball.y)} ${a},${sy(0)} ${z},${sy(0)}`} />
      ))}
      {POSTS.map((x) => (
        <Mark key={x} m={{ kind: "line" }} a={ball} b={{ x, y: 0 }} />
      ))}
      {!bad && (
        <>
          <line className="gk-mid" x1={ball.x} y1={sy(ball.y)} x2={GX} y2={sy(0)} />
          <circle className="gk-center" cx={GX} cy={sy(0)} r={0.45} />
        </>
      )}
      <g className="gk-keeper">
        <Player team="us" gk n={1} x={k.x} y={k.y} />
      </g>
      {ballEl}
      {gaps.length > 0 && <HoleLabel ball={ball} gap={gaps.reduce((g, h) => (h[1] - h[0] > g[1] - g[0] ? h : g))} />}
    </Pitch>
  );
}

/* Štítek „Díra!“ na ose největší díry, kousek před brankou. */
function HoleLabel({ ball, gap: [a, z] }) {
  const tx = (a + z) / 2;
  const f = Math.min(0.55, 4.6 / ball.y);
  return <Mark m={{ kind: "label", text: "Díra!", tone: "bad" }} a={{ x: tx + (ball.x - tx) * f, y: ball.y * f }} />;
}

export default KeeperAngle;
