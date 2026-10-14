import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Scene, reducedMotion } from "../components/Scene.jsx";
import { Icon } from "../components/Icons.jsx";
import { Video } from "../components/Video.jsx";
import { VIDEOS } from "../scenes/videos.js";
import { NAV, pageTitle } from "../lib/nav.js";
import { stop } from "../lib/voice.js";
import { forAge, useAge } from "../lib/age.js";

/* Stránka tématu (Pravidla, Útok, Obrana, Brankář): seznam situací + přehrávač.
   topic = { id, title, lead, scenes: [scéna | { id, title, icon, Component }] }; videa v src/scenes/videos.js
   Component = vlastní interaktivní situace; dostane children (tlačítko „Další“) a vykreslí je
   ve svém postranním sloupci — stejně jako <Scene>.
   Vybraná situace je v adrese (/utok/roztahni-se), aby šla poslat odkazem a našly ji vyhledávače. */
const SEEN = "fotbal:seen";
const readSeen = () => {
  try {
    return new Set(JSON.parse(localStorage.getItem(SEEN) || "[]"));
  } catch {
    return new Set();
  }
};

export function TopicPage({ topic }) {
  const { scene: sid } = useParams();
  const navigate = useNavigate();
  const [seen, setSeen] = useState(readSeen); // dokoukané situace → fajfka v seznamu
  const markSeen = (key) => {
    if (seen.has(key)) return;
    const next = new Set(seen).add(key);
    setSeen(next);
    try {
      localStorage.setItem(SEEN, JSON.stringify([...next]));
    } catch {
      /* jen pro tuto návštěvu */
    }
  };
  const age = useAge();
  const scenes = useMemo(() => topic.scenes.map((s) => forAge(s, age)), [topic, age]); // U8–U9: kde se pravidla liší
  const found = scenes.findIndex((s) => s.id === sid);
  const i = Math.max(0, found); // neznámá situace → první
  const scene = scenes[i];
  const next = scenes[i + 1];
  const [run, setRun] = useState(0); // klik na už vybranou situaci ji pustí znovu od začátku
  const pick = (s, scroll) => {
    stop(); // Kopík nedočte větu ze staré scény
    if (s === scene) setRun((r) => r + 1);
    else navigate(`/${topic.id}/${s.id}`, { replace: true });
    if (scroll) document.getElementById("situace")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  // Na mobilu je seznam situací vodorovný pás: vybraná jede doprostřed, ať je vidět, že jsou i další.
  const list = useRef();
  useEffect(() => {
    const el = list.current;
    const l = el.getBoundingClientRect();
    const b = el.querySelector('[aria-current="true"]').getBoundingClientRect();
    el.scrollTo({ left: el.scrollLeft + b.left - l.left - (l.width - b.width) / 2, behavior: reducedMotion() ? "auto" : "smooth" });
  }, [topic.id, scene.id]);
  const Custom = scene.Component;
  useEffect(() => {
    if (Custom) markSeen(topic.id + "/" + scene.id); // interaktivní situace nemají konec → stačí ji otevřít
  }, [topic.id, scene.id]);
  useEffect(() => {
    if (import.meta.env.DEV) import("../lib/lint.js").then((m) => m.lintTopic(topic));
  }, [topic]);
  useEffect(() => {
    document.title = pageTitle(found >= 0 && scene.title, topic.title);
  }, [topic, found, scene.title]);
  // „Další“ přes tabuli na konci scény: další situace, za poslední situací další téma (za Brankářem Kvíz).
  const after = NAV[NAV.findIndex((n) => n.id === topic.id) + 1];
  const onward = next ? { title: next.title, go: () => pick(next) } : after && { title: after.label, go: () => navigate(after.path) };
  const videos = VIDEOS[topic.id] || [];
  const video = videos.find((v) => v.scene === scene.id);
  const nextBtn = (
    <>
      {video && <Video key={video.id} v={video} />}
      {next && (
        <button className="btn next" onClick={() => pick(next, true)}>
          Další: {next.title} <Icon name="next" />
        </button>
      )}
    </>
  );

  return (
    <div className={"page topic topic-" + topic.id}>
      <header className="topic-head">
        <h1>{topic.title}</h1>
        {topic.lead && <p className="lead">{topic.lead}</p>}
      </header>
      <div className="topic-body">
        <nav className="scene-list" aria-label="Situace" ref={list}>
          {scenes.map((s) => (
            <button key={s.id} className="scene-pick" aria-current={s === scene} onClick={() => pick(s)}>
              <span className="scene-ico" aria-hidden="true">
                {s.icon}
              </span>
              {s.title}
              {seen.has(topic.id + "/" + s.id) && <Icon name="check" size={22} className="seen" />}
            </button>
          ))}
        </nav>
        <section className="scene-main" id="situace" aria-label={scene.title}>
          {Custom ? (
            <Custom key={topic.id + scene.id + run} next={onward} onReplay={() => pick(scene)}>
              {nextBtn}
            </Custom>
          ) : (
            <Scene
              key={topic.id + scene.id + run + age}
              scene={scene}
              next={onward}
              onEnded={() => markSeen(topic.id + "/" + scene.id)}
            >
              {nextBtn}
            </Scene>
          )}
        </section>
      </div>
      {videos.length > 0 && (
        <section className="videos" aria-labelledby="videa">
          <h2 id="videa">Videa z opravdového hřiště</h2>
          <div className="video-grid">
            {videos.map((v) => (
              <Video key={v.id} v={v} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default TopicPage;
