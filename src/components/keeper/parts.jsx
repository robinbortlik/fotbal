import { useEffect } from "react";
import { Icon } from "../Icons.jsx";
import { say } from "../../lib/voice.js";
import { W, L, PAD } from "../../lib/pitch.js";
import "./keeper.css";

/* Společné kousky vlastních brankářských situací. */

/* Přečte text nahlas (když má dítě zapnuté čtení), kdykoli se změní — jako titulky ve <Scene>.
   Komponenty sem dávají mluvenou verzi (say: titulek + proč), stejnou jako tlačítko 🔊 (Say spoken)
   a Component.TEXTS, ze kterých se nahrává hlas. */
export function useSpeak(text) {
  useEffect(() => {
    if (text) say(text);
  }, [text]);
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
