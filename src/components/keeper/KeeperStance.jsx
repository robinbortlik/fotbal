import { useState } from "react";
import { BoardEnd, Say, SceneTitle, useChain, Why } from "../Scene.jsx";
import { Art, Choice, GOOD_BAD, Label, Photo, useSpeak } from "./parts.jsx";
import ready from "../../assets/brankar/postoj-ano.webp";
import sloppy from "../../assets/brankar/postoj-ne.webp";

/* Připravený postoj — fotka (vygenerovaná Gemini) se štítky jako na tabuli. */
// text = krátký titulek, say = co Kopík řekne nahlas (titulek + proč)
const GOOD = {
  text: "Pokrč kolena, ruce před sebe, koukej na míč.",
  say: "Pokrč kolena, ruce před sebe a koukej na míč. Takhle skočíš rychle na obě strany a ruce máš hned u míče.",
};
const BAD = {
  text: "Rovné nohy a ruce dole? To nechytíš!",
  say: "S rovnýma nohama a rukama dole to nechytíš. Než se odrazíš a zvedneš ruce, míč je v bráně.",
};
const WHY =
  "Základní postoj brankáře: chodidla zhruba na šíři ramen, váha na přední části chodidel, kolena lehce pokrčená, ruce před tělem s otevřenými dlaněmi a oči na míči. Z tohoto postoje se nejrychleji vyrazí na kteroukoli stranu a ruce jsou hned u míče. (Fotografie jsou ilustrační, vytvořené pomocí AI.)";
const STORY = [["Takhle ano", GOOD.say], ["Takhle ne", BAD.say]];

function StanceArt({ bad }) {
  return (
    <Art label={bad ? "Brankář stojí rovně, ruce má dole a kouká jinam" : "Brankář v připraveném postoji kouká na míč"}>
      <Photo src={bad ? sloppy : ready} />
      {bad ? (
        <>
          <Label x={24.4} y={3.2} text="Kouká jinam" tone="bad" to={[17.4, 7.0]} />
          <Label x={5.2} y={20.6} text="Ruce dole" tone="bad" to={[11.6, 24.2]} />
          <Label x={24.6} y={33.4} text="Rovné nohy" tone="bad" to={[16.6, 31.4]} />
        </>
      ) : (
        <>
          <Label x={25.2} y={4.4} text="Oči na míč" to={[20.4, 8.6]} />
          <Label x={24.6} y={23.0} text="Ruce před sebe" to={[23.4, 19.2]} />
          <Label x={26.0} y={31.2} text="Pokrč kolena" to={[19.4, 29.8]} />
          <Label x={11.4} y={44.6} text="Na špičky" to={[6.6, 40.0]} />
        </>
      )}
    </Art>
  );
}

export function KeeperStance({ children, onReplay, next }) {
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
        <StanceArt bad={bad} />
        {done && !chain && <BoardEnd onReplay={onReplay} next={next} />}
      </div>
      <SceneTitle>Připravený postoj</SceneTitle>
      <Choice label="Porovnej" value={mode} onChange={pick} options={GOOD_BAD} />
      <Say text={note ?? line.text} spoken={note ?? line.say} />
      <Why why={WHY} story={STORY} />
      {children}
    </div>
  );
}
KeeperStance.TEXTS = [GOOD.say, BAD.say];
// Kniha k tisku (src/book): obrázky se štítky a titulky.
KeeperStance.PRINT = {
  frames: [
    { tone: "good", text: GOOD.text, art: <StanceArt /> },
    { tone: "bad", text: BAD.text, art: <StanceArt bad /> },
  ],
  why: WHY,
};

export default KeeperStance;
