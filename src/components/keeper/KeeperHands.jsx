import { useState } from "react";
import { BoardEnd, Say } from "../Scene.jsx";
import { Art, Choice, Label, Photo, useSpeak } from "./parts.jsx";
import high from "../../assets/brankar/ruce-w.webp";
import low from "../../assets/brankar/kosicek.webp";

/* Ruce do W / košíček — fotky (vygenerované Gemini) se štítky jako na tabuli.
   Vysoký míč: pohled přes rameno brankáře, palce a ukazováky tvoří za míčem „W“.
   Nízký míč: brankář z boku — nohy u sebe, tělo za míčem, dlaně k míči, prsty k trávě. */
// text = krátký titulek, say = co Kopík řekne nahlas (titulek + proč)
const HIGH = {
  text: "Vysoký míč? Ruce do W!",
  say: "Vysoký míč chytej do W, palce k sobě a prsty nahoru. Míč se zastaví o dlaně a neproletí ti mezi rukama.",
};
const LOW = {
  text: "Nízký míč? Košíček – tělo za míč!",
  say: "Nízký míč chytej do košíčku a tělo dej za míč. Když ti vyklouzne z rukou, zastaví ho tvoje nohy.",
};

const MODES = [
  { id: "high", text: "Vysoký míč" },
  { id: "low", text: "Nízký míč" },
];

/* „W“ na fotce vysokého míče: ukazovák levé ruky → mezi palcem a ukazovákem → palce → … pravá ruka. */
const W_PATH = "M14.0 10.8L14.8 15.6L17.2 14.6L19.6 15.6L20.0 10.8";

const WHY =
  "Míč nad pasem se chytá do „W“: dlaně za míčem, prsty roztažené, palce u sebe (nepřekrývají se), lokty před tělem tlumí náraz. Nízký nebo kutálející se míč se sbírá do „košíčku“: tělo a nohy za míčem, dlaně pod míčem, malíčky u sebe, pak míč přitáhnout k hrudi.";

function HandsArt({ isHigh }) {
  return (
    <Art label={isHigh ? "Ruce v rukavicích ve tvaru W za vysokým míčem" : "Brankář z boku sbírá kutálející se míč do košíčku"}>
      <Photo src={isHigh ? high : low} />
      {isHigh ? (
        <>
          <path className="gk-w-edge" d={W_PATH} />
          <path className="gk-w" d={W_PATH} />
          <Label x={5.6} y={20.4} text="Palce k sobě" to={[16.0, 15.4]} />
          <Label x={25.6} y={5.0} text="Prsty nahoru" to={[20.6, 10.6]} />
        </>
      ) : (
        <>
          <Label x={7.0} y={25.2} text="Dlaně k míči" to={[11.8, 31.6]} />
          <Label x={26.0} y={16.0} text="Tělo za míčem" tone="us" to={[21.0, 19.0]} />
          <Label x={25.4} y={44.4} text="Nohy u sebe" to={[19.4, 40.2]} />
        </>
      )}
    </Art>
  );
}

export function KeeperHands({ children, onReplay, next }) {
  const [mode, setMode] = useState("high");
  const isHigh = mode === "high";
  const line = isHigh ? HIGH : LOW;
  const done = useSpeak(line.say);

  return (
    <div className="scene">
      <div className="board">
        <HandsArt isHigh={isHigh} />
        {done && <BoardEnd onReplay={onReplay} next={next} />}
      </div>
      <h2 className="scene-title">Jak chytat</h2>
      <Choice label="Jaký míč letí" value={mode} onChange={setMode} options={MODES} />
      <Say text={line.text} spoken={line.say} />
      <details className="why">
        <summary>Pro rodiče a trenéry</summary>
        <p>{WHY}</p>
      </details>
      {children}
    </div>
  );
}
KeeperHands.TEXTS = [HIGH.say, LOW.say];
KeeperHands.PRINT = {
  frames: [
    { text: HIGH.text, art: <HandsArt isHigh /> },
    { text: LOW.text, art: <HandsArt /> },
  ],
  why: WHY,
};

export default KeeperHands;
