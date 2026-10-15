import { useState } from "react";
import { BoardEnd, Say, SceneTitle, useChain, Why } from "../Scene.jsx";
import { Art, Choice, GOOD_BAD, Label, Photo, useSpeak } from "./parts.jsx";
import side from "../../assets/brankar/pad-ano.webp";
import belly from "../../assets/brankar/pad-ne.webp";

/* Pád na bok — fotka (vygenerovaná Gemini) se štítky, stejně jako KeeperStance. */
const GOOD = {
  text: "Padni na bok, míč drž v obou rukou.",
  say: "Padni na bok a míč drž pevně v obou rukou. Na boku se nebouchneš a míč ti nevyskočí.",
};
const BAD = {
  text: "Na břicho? Bouchneš se a míč uteče.",
  say: "Když padneš na břicho, bouchneš se do loktů a míč ti vyskočí z rukou. Útočník ho pak snadno dorazí.",
};
const WHY =
  "Při nízkém míči do strany brankář padá na bok (stehno, bok, rameno), ne na břicho. Míč drží oběma rukama — spodní ruka za míčem, horní na něm — a hned si ho přitáhne k tělu. Pád na břicho nebo na lokty bolí a míč z rukou snadno vyskočí útočníkovi k noze. Pád se trénuje nejdřív z kleku na měkké trávě. (Fotografie jsou ilustrační, vytvořené pomocí AI.)";
const STORY = [["Takhle ano", GOOD.say], ["Takhle ne", BAD.say]];

function FallArt({ bad }) {
  return (
    <Art label={bad ? "Brankář dopadl na břicho a míč mu utekl" : "Brankář leží na boku a drží míč v obou rukou"}>
      <Photo src={bad ? belly : side} />
      {bad ? (
        <>
          <Label x={17.5} y={45.8} text="Lokty na zemi" tone="bad" to={[13.4, 37.6]} />
          <Label x={25.4} y={42.0} text="Na břicho" tone="bad" to={[19.0, 36.8]} />
          <Label x={5.0} y={44.6} text="Míč utekl" tone="bad" to={[5.4, 40.4]} />
        </>
      ) : (
        <>
          <Label x={7.2} y={20.4} text="Oči na míč" to={[9.0, 24.6]} />
          <Label x={25.0} y={42.2} text="Na bok" to={[20.4, 36.8]} />
          <Label x={11.6} y={44.4} text="Míč v obou rukou" to={[10.8, 38.6]} />
        </>
      )}
    </Art>
  );
}

export function KeeperFall({ children, onReplay, next }) {
  const [mode, setMode] = useState("good");
  const [opening, setOpening] = useState(true); // jen první „Takhle ano“ pokračuje samo na „Takhle ne“
  const bad = mode === "bad";
  const line = bad ? BAD : GOOD;
  const done = useSpeak(line.say);
  const chain = done && opening && !bad;
  const note = useChain(chain, () => setMode("bad"));
  const pick = (m) => {
    setOpening(false);
    setMode(m);
  };

  return (
    <div className="scene">
      <div className="board">
        <FallArt bad={bad} />
        {done && !chain && <BoardEnd onReplay={onReplay} next={next} />}
      </div>
      <SceneTitle>Padej na bok</SceneTitle>
      <Choice label="Porovnej" value={mode} onChange={pick} options={GOOD_BAD} />
      <Say text={note ?? line.text} spoken={note ?? line.say} />
      <Why why={WHY} story={STORY} />
      {children}
    </div>
  );
}
KeeperFall.TEXTS = [GOOD.say, BAD.say];
// Kniha k tisku (src/book): obrázky se štítky a titulky.
KeeperFall.PRINT = {
  frames: [
    { tone: "good", text: GOOD.text, art: <FallArt /> },
    { tone: "bad", text: BAD.text, art: <FallArt bad /> },
  ],
  why: WHY,
};

export default KeeperFall;
