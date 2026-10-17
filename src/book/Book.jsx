import { flushSync } from "react-dom";
import { createRoot } from "react-dom/client";
import { SceneBoard, quizOf } from "../components/Scene.jsx";
import { Pitch, Player, Ball } from "../components/Board.jsx";
import { Kopik } from "../components/Kopik.jsx";
import { Icon } from "../components/Icons.jsx";
import { W, L } from "../lib/pitch.js";
import { PHRASES } from "../lib/voice.js";
import { NAV } from "../lib/nav.js";
import { SHAPES, LEGEND } from "../pages/HomePage.jsx";
import { RULES as RULE_LIST, YOUNGER, SLOGANS, SOURCES } from "../pages/ParentsPage.jsx";
import { PITCH } from "../scenes/hriste.js";
import { RULES } from "../scenes/pravidla.js";
import { KICKING } from "../scenes/kopani.js";
import { DRIBBLING } from "../scenes/klicky.js";
import { ATTACK } from "../scenes/utok.js";
import { DEFENSE } from "../scenes/obrana.js";
import { KEEPER } from "../scenes/brankar.js";
import cover from "./img/cover.jpg";
import hriste from "./img/hriste.jpg";
import pravidla from "./img/pravidla.jpg";
import kopani from "./img/kopani.jpg";
import klicky from "./img/klicky.jpg";
import utok from "./img/utok.jpg";
import obrana from "./img/obrana.jpg";
import brankar from "./img/brankar.jpg";
import kviz from "./img/kviz.jpg";
import rodice from "./img/rodice.jpg";
import "../styles/index.css";
import "./book.css";

/* Kniha k tisku: všechno z webu na stránkách A4 na šířku. Každá situace = jedna stránka,
   kroky animace jako komiks (tabule v čase kroku + titulek), pod tím „Takhle ne“ a vysvětlení
   pro rodiče a trenéry. PDF dělá `npm run book` (scripts/book.mjs). */
const SITE = "fotbalove-abc.cz";
const TOPICS = [PITCH, RULES, KICKING, DRIBBLING, ATTACK, DEFENSE, KEEPER];
const ART = { hriste, pravidla, kopani, klicky, utok, obrana, brankar };
const ICON = Object.fromEntries(NAV.map((n) => [n.id, n.icon]));
const QUIZ = TOPICS.flatMap((t) => t.scenes.filter(quizOf).map((s) => ({ t, s, q: quizOf(s) })));
const PER_QUIZ_PAGE = 6;

/* Kdy „vyfotit“ krok i: na konci kroku (je vidět, co se stalo), ale dřív, než zmizí šipka
   nebo štítek, který v tom kroku začal. */
function shot(s, i) {
  const b = s.beats[i];
  const end = (s.beats[i + 1]?.t ?? s.dur) - 0.05;
  const mine = (s.marks || []).filter((m) => (m.t?.[0] ?? 0) >= b.t && (m.t?.[0] ?? 0) < end);
  const gone = mine.filter((m) => m.t?.[1] != null && m.t[1] <= end).map((m) => m.t[1] - 0.05);
  const drawn = Math.max(b.t + 0.05, ...mine.map((m) => m.t[0] + 0.5));
  return Math.min(end, Math.max(drawn, Math.min(end, ...gone)));
}

/* „Takhle ne“ začíná stejně jako „Takhle ano“ → stejné kroky se netisknou dvakrát. */
const sameStart = (s, bad) => {
  let k = 0;
  while (bad.beats[k] && s.beats[k]?.text === bad.beats[k].text) k++;
  return k;
};

/* Čísla stránek (kvůli obsahu): obálka, Kopík, obsah, pak kapitoly, kvíz, rodiče, diplom. */
let n = 3;
const CHAPTERS = TOPICS.map((t) => ({ t, page: ++n, scenes: t.scenes.map((s) => ({ s, page: ++n })) }));
const QUIZ_PAGES = Array.from({ length: Math.ceil(QUIZ.length / PER_QUIZ_PAGE) }, (_, i) => ({
  page: ++n,
  items: QUIZ.slice(i * PER_QUIZ_PAGE, (i + 1) * PER_QUIZ_PAGE).map((q, k) => ({ ...q, no: i * PER_QUIZ_PAGE + k + 1 })),
}));
const PARENTS = ++n;
const SLOGAN_PAGE = ++n;
const DIPLOMA = ++n;

function Page({ no, className = "", url, children }) {
  return (
    <section className={"page " + className}>
      {children}
      {no > 1 && (
        <footer className="pg-foot">
          <span>Fotbalové ABC</span>
          {url && <span className="pg-url">Animace s Kopíkovým hlasem: {url}</span>}
          <b>{no}</b>
        </footer>
      )}
    </section>
  );
}

function Bubble({ children, size = 90 }) {
  return (
    <div className="bubble">
      <Kopik size={size} />
      <p>{children}</p>
    </div>
  );
}

function Cover() {
  return (
    <Page no={1} className="cover">
      <div className="cover-top">
        <div>
          <h1>Fotbalové ABC</h1>
          <p className="cover-sub">Kniha pro malé fotbalisty z přípravky</p>
        </div>
        <Bubble size={100}>Ahoj! Jsem Kopík. Pojď si se mnou zahrát fotbal!</Bubble>
      </div>
      <ul className="cover-topics">
        {TOPICS.map((t) => (
          <li key={t.id} className={"toc-" + t.id}>
            <span className="toc-ico">
              <Icon name={ICON[t.id]} size={18} />
            </span>
            {t.title}
          </li>
        ))}
      </ul>
      <img className="cover-art" src={cover} alt="" />
      <div className="cover-foot">
        <p>
          Tahle kniha patří: <span className="blank" />
        </p>
        <p>Pro děti 5–10 let, jejich rodiče a trenéry · hra 5 + 1 podle pravidel FAČR · {SITE}</p>
      </div>
    </Page>
  );
}

/* Máme / nemáme míč — stejné postavení jako přepínač na úvodní stránce webu. */
function Shape({ phase }) {
  const shape = SHAPES[phase];
  const m = (pt) => ({ x: pt[0] * W, y: pt[1] * L });
  const holder = m(shape[shape.ball.team][shape.ball.i]);
  return (
    <div className="board">
      <Pitch label={shape.text}>
        {shape.them.map((pt, i) => (
          <Player key={"t" + i} {...m(pt)} team="them" gk={i === 0} />
        ))}
        {shape.us.map((pt, i) => (
          <Player key={"u" + i} {...m(pt)} team="us" gk={i === 0} n={i + 1} />
        ))}
        <Ball x={holder.x} y={holder.y + (shape.ball.team === "us" ? 1.5 : -1.5)} />
      </Pitch>
    </div>
  );
}

function Hello() {
  return (
    <Page no={2} className="hello">
      <div className="hello-left">
        <h2>Ahoj, já jsem Kopík!</h2>
        <Bubble size={96}>
          Ukážu ti, jak se hraje fotbal. Každá situace je nakreslená jako na trenérské tabuli, krok za krokem. Žlutí
          jsme my, modří je soupeř.
        </Bubble>
        <h3>Jak číst tabuli</h3>
        <ul className="legend-list">
          {LEGEND.map(([label, el]) => (
            <li key={label}>
              <svg viewBox="0 0 8 4" aria-hidden="true">
                {el}
              </svg>
              {label}
            </li>
          ))}
        </ul>
        <p className="hint hint-good">
          <Icon name="check" size={22} />
          <span>
            <b>Takhle ano</b> ukazuje, jak to dělat.
          </span>
        </p>
        <p className="hint hint-bad">
          <Icon name="cross" size={22} />
          <span>
            <b>Takhle ne</b> ukazuje chybu, ze které se učíme.
          </span>
        </p>
      </div>
      <div className="hello-right">
        <h3>Máme míč, nebo nemáme?</h3>
        <p className="lead">Tohle se ve fotbale ptáš pořád.</p>
        <div className="shapes">
          {["attack", "defend"].map((p) => (
            <figure key={p} className={"shape shape-" + p}>
              <figcaption>{p === "attack" ? "Máme míč" : "Nemáme míč"}</figcaption>
              <Shape phase={p} />
              <p>{PHRASES[p]}</p>
            </figure>
          ))}
        </div>
      </div>
    </Page>
  );
}

function Contents() {
  return (
    <Page no={3} className="contents">
      <div>
        <h2>Co je v knize</h2>
        <ol className="toc">
          {CHAPTERS.map(({ t, page }, i) => (
            <li key={t.id} className={"toc-" + t.id}>
              <span className="toc-ico">
                <Icon name={ICON[t.id]} size={26} />
              </span>
              <span>
                <b>
                  {i + 1}. {t.title}
                </b>{" "}
                – {t.lead}
              </span>
              <span className="toc-pg">{page}</span>
            </li>
          ))}
          <li className="toc-kviz">
            <span className="toc-ico">
              <Icon name="quiz" size={26} />
            </span>
            <span>
              <b>Kvíz</b> – Co uděláš ty?
            </span>
            <span className="toc-pg">{QUIZ_PAGES[0].page}</span>
          </li>
          <li className="toc-rodice">
            <span className="toc-ico">
              <Icon name="whistle" size={26} />
            </span>
            <span>
              <b>Pro rodiče a trenéry</b> – pravidla v kostce a hesla na trénink
            </span>
            <span className="toc-pg">{PARENTS}</span>
          </li>
          <li className="toc-diplom">
            <span className="toc-ico">⭐</span>
            <span>
              <b>Diplom</b> – pro malého fotbalistu
            </span>
            <span className="toc-pg">{DIPLOMA}</span>
          </li>
        </ol>
      </div>
      <div className="howto-box">
        <img src={rodice} alt="" />
        <h3>Jak s knihou pracovat</h3>
        <ol>
          <li>
            <b>Jedna situace najednou.</b> Projděte obrázky po krocích 1, 2, 3… a ptejte se: „Co vidíš? Kdo má míč? Kam
            kdo běží?“
          </li>
          <li>
            <b>Porovnejte „Takhle ano“ a „Takhle ne“.</b> Ať dítě samo řekne, co je jinak.
          </li>
          <li>
            <b>Jedna věc na trénink.</b> Vyberte jedno heslo (str. {SLOGAN_PAGE}) a zkuste ho venku v malé hře 2 : 2 až
            5 : 5. Chvalte snahu, ne jen výsledek.
          </li>
        </ol>
        <p className="note">
          Pod každou situací je krátké vysvětlení pro dospělé s přesným pravidlem. Animace s Kopíkovým hlasem najdete na{" "}
          {SITE} — adresa je dole na každé stránce.
        </p>
      </div>
    </Page>
  );
}

function Opener({ t, page, scenes, i }) {
  return (
    <Page no={page} className={"opener opener-" + t.id}>
      <img className="opener-art" src={ART[t.id]} alt="" />
      <div className="opener-text">
        <p className="chip">
          <Icon name={ICON[t.id]} size={22} /> Kapitola {i + 1}
        </p>
        <h2>{t.title}</h2>
        <p className="lead">{t.lead}</p>
        <ol className="opener-list">
          {scenes.map(({ s, page: p }) => (
            <li key={s.id}>
              <span className="ico">{s.icon}</span> {s.title}
              <span className="toc-pg">{p}</span>
            </li>
          ))}
        </ol>
      </div>
    </Page>
  );
}

function Frame({ no, text, said, tone, children }) {
  return (
    <figure className={"frame" + (tone ? " frame-" + tone : "")}>
      <div className="frame-art">{children}</div>
      <figcaption>
        {no != null && <b className="frame-no">{no}</b>}
        {tone && <Icon name={tone === "good" ? "check" : "cross"} size={20} />}
        <span>
          {text}
          {said && <span className="said">{said}</span>}
        </span>
      </figcaption>
    </figure>
  );
}

/* more = pod titulkem i to, co Kopík říká nahlas (vejde se jen na stránku bez „Takhle ne“). */
function Strip({ s, tone, from = 0, cols, more }) {
  return (
    <div className={"strip" + (tone ? " strip-" + tone : "")} style={{ "--cols": cols }}>
      {tone && (
        <p className="strip-label">
          <Icon name={tone === "good" ? "check" : "cross"} size={20} /> {tone === "good" ? "Takhle ano" : "Takhle ne"}
        </p>
      )}
      {from > 0 && (
        <p className="same" style={{ gridColumn: `span ${from}` }}>
          Začátek je stejný jako nahoře…
        </p>
      )}
      {s.beats.slice(from).map((b, k) => (
        <Frame key={k} no={from + k + 1} text={b.text} said={more && b.say}>
          <SceneBoard s={s} time={shot(s, from + k)} />
        </Frame>
      ))}
    </div>
  );
}

function ScenePage({ t, s, i, page }) {
  const print = s.Component?.PRINT;
  const bad = s.bad && { ...s, ...s.bad };
  const cols = Math.max(s.beats?.length ?? 0, bad?.beats.length ?? 0);
  return (
    <Page no={page} className={"scene-page sp-" + t.id + (bad ? " two" : " one")} url={`${SITE}/${t.id}/${s.id}`}>
      <header className="sp-head">
        <p className="chip">
          <Icon name={ICON[t.id]} size={20} /> {t.title} · {i + 1}/{t.scenes.length}
        </p>
        <h2>
          <span className="ico">{s.icon}</span> {s.title}
        </h2>
      </header>
      {print ? (
        <div className="strip" style={{ "--cols": print.frames.length }}>
          {print.frames.map((f, k) => (
            <Frame key={k} text={f.text} tone={f.tone}>
              <div className="board">{f.art}</div>
            </Frame>
          ))}
        </div>
      ) : (
        <>
          <Strip s={s} tone={bad && "good"} cols={cols} more={!bad} />
          {bad && <Strip s={bad} tone="bad" from={sameStart(s, bad)} cols={cols} />}
        </>
      )}
      <p className="why">
        <b>Pro rodiče a trenéry:</b> {print?.why ?? s.why}
      </p>
    </Page>
  );
}

/* Kvíz: tabule zastavená v čase otázky, odpovědi k zakroužkování. Pořadí odpovědí se
   posouvá podle čísla otázky, ať správná není pořád první. */
const quizOptions = (q, no) => q.options.map((_, k) => q.options[(k + no) % q.options.length]);
const LETTERS = "ABCD";

function QuizPage({ page, items, first, last }) {
  return (
    <Page no={page} className="quiz-page">
      <header className="quiz-head">
        {first && <img src={kviz} alt="" />}
        <div>
          <p className="chip">
            <Icon name="quiz" size={20} /> Kvíz
          </p>
          <h2>Co uděláš ty?</h2>
          {first && <p className="lead">Prohlédni si tabuli a zakroužkuj správnou odpověď.</p>}
        </div>
      </header>
      <div className="quiz-grid">
        {items.map(({ s, q, no }) => (
          <div key={s.id} className="quiz-card">
            {q.art ? <div className="board">{q.art}</div> : <SceneBoard s={s} time={q.at} />}
            <div>
              <p className="q">
                <b>{no}.</b> {q.ask}
              </p>
              <ol className="opts">
                {quizOptions(q, no).map((o, k) => (
                  <li key={o.text}>
                    <b>{LETTERS[k]}</b> {o.text}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        ))}
      </div>
      {last && (
        <p className="answers">
          Správné odpovědi:{" "}
          {QUIZ.map(({ q }, i) => `${i + 1} ${LETTERS[quizOptions(q, i + 1).findIndex((o) => o.ok)]}`).join(" · ")}
        </p>
      )}
    </Page>
  );
}

function Parents() {
  const half = Math.ceil(RULE_LIST.length / 2);
  return (
    <Page no={PARENTS} className="parents">
      <p className="chip">
        <Icon name="whistle" size={20} /> Pro rodiče a trenéry
      </p>
      <h2>Pravidla 5 + 1 v kostce</h2>
      <p className="lead">Starší přípravka (U10–U11) podle FAČR, Pravidla fotbalu malých forem 2023.</p>
      <div className="rules-cols">
        {[RULE_LIST.slice(0, half), RULE_LIST.slice(half)].map((rows, i) => (
          <table key={i} className="rules">
            <tbody>
              {rows.map(([k, v]) => (
                <tr key={k}>
                  <th scope="row">{k}</th>
                  <td>{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ))}
      </div>
      <div className="younger">
        <h3>Mladší přípravka (U8–U9) hraje 4 + 1</h3>
        <ul>
          {YOUNGER.map((y) => (
            <li key={y}>{y}</li>
          ))}
        </ul>
        <p className="note">
          Délka zápasu a organizace se liší podle okresu a kraje — rozhoduje rozpis soutěží vašeho OFS / KFS.
        </p>
      </div>
    </Page>
  );
}

function Slogans() {
  return (
    <Page no={SLOGAN_PAGE} className="slogans-page">
      <p className="chip">
        <Icon name="whistle" size={20} /> Pro rodiče a trenéry
      </p>
      <h2>Hesla na trénink</h2>
      <div className="slogan-grid">
        {SLOGANS.map(([title, items]) => (
          <div key={title} className="slogan-card">
            <h3>{title}</h3>
            <ul>
              {items.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="note">
        Podle metodiky FAČR a UČFT: krátké pokyny, jedna věc najednou, otázky místo povelů, děti mají právo na chybu.
        Pozice je dobré střídat a v bráně si má zkusit chytat každý. Základní rozestavení pro 5 + 1 je podle FAČR 2-1-2.
      </p>
      <div className="sources">
        <h3>Zdroje</h3>
        <ul>
          {SOURCES.map(([title, url]) => (
            <li key={url}>
              {title} — {url.replace(/^https:\/\/(www\.)?/, "")}
            </li>
          ))}
        </ul>
        <p className="note">
          Ověřeno v říjnu 2026. Ilustrace a fotografie brankáře a kopání jsou vytvořené pomocí AI (Google Gemini). Celý obsah
          zdarma na {SITE}.
        </p>
      </div>
    </Page>
  );
}

function Diploma() {
  return (
    <Page no={DIPLOMA} className="diploma">
      <div className="diploma-frame">
        <Kopik size={120} />
        <h2>Diplom</h2>
        <p className="lead">Fotbalové ABC</p>
        <p className="for">
          pro <span className="blank" />
        </p>
        <p>Znáš hřiště i pravidla, umíš kopat i kličkovat, útočit, bránit i chytat. Hraješ fér a s radostí!</p>
        <div className="signs">
          <span>
            <span className="blank" />
            trenér / trenérka
          </span>
          <span>
            <span className="blank" />
            datum
          </span>
        </div>
      </div>
    </Page>
  );
}

function Book() {
  return (
    <>
      <Cover />
      <Hello />
      <Contents />
      {CHAPTERS.map(({ t, page, scenes }, i) => [
        <Opener key={t.id} t={t} page={page} scenes={scenes} i={i} />,
        ...scenes.map(({ s, page: p }, k) => <ScenePage key={t.id + s.id} t={t} s={s} i={k} page={p} />),
      ])}
      {QUIZ_PAGES.map((q, i) => (
        <QuizPage key={q.page} {...q} first={i === 0} last={i === QUIZ_PAGES.length - 1} />
      ))}
      <Parents />
      <Slogans />
      <Diploma />
    </>
  );
}

// Synchronně: obrázky jsou v DOM ještě před událostí load, na kterou čeká tisk do PDF.
const root = createRoot(document.getElementById("root"));
flushSync(() => root.render(<Book />));
