/* === Home page — two variants === */

function HomeVariantA({ onNav }) {
  // "Vibrant Hero" — playful hero + tile grid
  const cats = [
    { id: "rules", num: "01", title: "Pravidla fotbalu", desc: "Ofsajd, fauly, rohy a další pravidla s animacemi.", tag: "7 lekcí", color: null },
    { id: "strategy", num: "02", title: "Strategie hraní", desc: "Formace, pohyb bez míče, jak spolupracovat v týmu.", tag: "6 lekcí", color: null },
    { id: "pitch", num: "03", title: "O hřišti", desc: "Klikni si hřiště — co znamenají všechny čáry?", tag: "Interaktivní", color: null },
    { id: "positions", num: "04", title: "Pozice hráčů", desc: "Brankář, obrana, záloha, útok. Kdo co dělá?", tag: "Karty hráčů", color: null },
    { id: "zones", num: "05", title: "Pohyb v zónách", desc: "Kde se pohybovat — když máme míč a když ho má soupeř.", tag: "Animace", color: null },
    { id: "move", num: "06", title: "Pohyb podle míče", desc: "Přetáhni míč — celý tým se přerozestaví. Vyber svou pozici.", tag: "Drag & drop", color: null },
    { id: "glossary", num: "07", title: "Slovníček", desc: "Všechna fotbalová slůvka na jednom místě.", tag: "30+ pojmů", color: null },
    { id: "quiz", num: "08", title: "Kvíz a procvičování", desc: "Otestuj si, co už umíš. Hraje se to samo!", tag: "Kvíz", color: null },
  ];

  return (
    <div className="page">
      <section className="hero-grid">
        <div>
          <span className="eyebrow orange"><BallIcon size={14}/> Vítej, parťáku</span>
          <h1 className="hero-title">Nauč se <em>fotbal</em> hrou.</h1>
          <p className="lead">Ahoj! Já jsem <strong>Kopík</strong> a provedu tě tím nejlepším sportem na světě. Společně si projdeme pravidla, formace a všechny finty, co bys měl znát.</p>
          <div className="hero-actions">
            <button className="btn primary" onClick={() => onNav("rules")}>Začít s pravidly <span aria-hidden>→</span></button>
            <button className="btn" onClick={() => onNav("quiz")}>Spustit kvíz</button>
          </div>
          <div className="stat-row">
            <div className="stat"><div className="num">17</div><div className="label">Pravidel</div></div>
            <div className="stat"><div className="num">11</div><div className="label">Hráčů v týmu</div></div>
            <div className="stat"><div className="num">90<span style={{ fontSize: 18 }}> min</span></div><div className="label">Délka zápasu</div></div>
            <div className="stat"><div className="num">1</div><div className="label">Míč</div></div>
          </div>
        </div>
        <HeroPitchPreview onNav={onNav}/>
      </section>

      <div className="divider"/>

      <SectionHead index="OBSAH WEBU" title="Co se tu naučíš?" kicker="Šest kapitol. Začni klidně tou, co tě láká nejvíc."/>
      <div className="card-grid">
        {cats.map(c => (
          <Tile key={c.id} num={c.num} title={c.title} desc={c.desc} tag={c.tag} onClick={() => onNav(c.id)}/>
        ))}
      </div>

      <div className="divider"/>

      <div className="card green" style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", alignItems: "center", gap: 24, padding: 28 }}>
        <Mascot size={84} mood="wink" bounce/>
        <div>
          <div className="display" style={{ fontSize: 30 }}>Tip od Kopíka</div>
          <p style={{ marginTop: 6, fontSize: 17, opacity: 0.95 }}>Když narazíš na nové slovíčko, klikni na <span className="pill orange">Slovníček</span> nahoře. Najdeš tam vysvětlení každého pojmu.</p>
        </div>
        <button className="btn dark" onClick={() => onNav("glossary")}>Slovníček</button>
      </div>
    </div>
  );
}

function HeroPitchPreview({ onNav }) {
  const { time, setTime, playing, setPlaying } = useTimeline(4, true);
  // small animation of ball passing
  const tracks = {
    p1: [{ t: 0, x: 30, y: 22 }, { t: 1.2, x: 32, y: 22 }, { t: 3, x: 32, y: 22 }, { t: 4, x: 32, y: 22 }],
    p2: [{ t: 0, x: 60, y: 42 }, { t: 1.2, x: 60, y: 42 }, { t: 3, x: 75, y: 32 }, { t: 4, x: 78, y: 32 }],
    ball: [{ t: 0, x: 30, y: 22 }, { t: 1.2, x: 60, y: 42 }, { t: 3, x: 75, y: 32 }, { t: 4, x: 92, y: 32 }],
  };
  const p1 = interpAt(tracks.p1, time);
  const p2 = interpAt(tracks.p2, time);
  const ball = interpAt(tracks.ball, time);

  return (
    <div className="pitch-wrap" style={{ transform: "rotate(0.5deg)" }}>
      <PitchSVG>
        <Arrow x1={30} y1={22} x2={60} y2={42} dashed/>
        <Arrow x1={60} y1={42} x2={92} y2={32} dashed color="#fff"/>
        <Player x={p1.x} y={p1.y} team="home" num="9"/>
        <Player x={p2.x} y={p2.y} team="home" num="10" glow={time > 1 && time < 3.2}/>
        <Player x={20} y={50} team="away" num="4"/>
        <Player x={50} y={20} team="away" num="6"/>
        <Player x={80} y={48} team="away" num="2"/>
        <Player x={97} y={32} team="gk" num=""/>
        <Ball x={ball.x} y={ball.y}/>
      </PitchSVG>
      <Scrubber duration={4} value={time} onChange={setTime} playing={playing} onPlay={() => setPlaying(!playing)}/>
      <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <span className="pill navy">Ukázka přihrávky</span>
        <button className="btn sm" onClick={() => onNav("strategy")}>Více strategií →</button>
      </div>
    </div>
  );
}

/* --- Variant B: "Notebook / Coach's chalkboard" --- */
function HomeVariantB({ onNav }) {
  const cats = [
    { id: "rules", title: "Pravidla", note: "Co se smí a nesmí.", icon: "📋" },
    { id: "strategy", title: "Strategie", note: "Jak hrát chytře.", icon: "🧠" },
    { id: "pitch", title: "Hřiště", note: "Co znamenají čáry.", icon: "📐" },
    { id: "positions", title: "Pozice", note: "Kdo kde stojí.", icon: "👕" },
    { id: "zones", title: "Zóny pohybu", note: "Kdy v́před, kdy zp̌átky.", icon: "🟩" },
    { id: "move", title: "Pohyb dle míče", note: "Přetahuj míč.", icon: "🎯" },
    { id: "glossary", title: "Slovníček", note: "Fotbalová slovíčka.", icon: "📖" },
    { id: "quiz", title: "Kvíz", note: "Otestuj se!", icon: "🎯" },
  ];
  return (
    <div className="page">
      {/* Coach's clipboard layout */}
      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 28, alignItems: "stretch" }} className="hero-grid">
        <div className="card dark" style={{ padding: 36, background: "var(--navy)", borderRadius: 28, position: "relative", overflow: "hidden" }}>
          {/* Subtle tactic lines bg */}
          <svg viewBox="0 0 200 200" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.07 }} preserveAspectRatio="none">
            {Array.from({ length: 8 }).map((_, i) => (
              <line key={i} x1={0} y1={i*25} x2={200} y2={i*25} stroke="#F2A007" strokeWidth="0.5"/>
            ))}
            {Array.from({ length: 8 }).map((_, i) => (
              <line key={"v" + i} x1={i*25} y1={0} x2={i*25} y2={200} stroke="#F2A007" strokeWidth="0.5"/>
            ))}
          </svg>
          <div style={{ position: "relative" }}>
            <span className="eyebrow orange"><BallIcon size={14}/> Trenér Kopík</span>
            <h1 className="hero-title" style={{ color: "var(--cream)", marginTop: 14 }}>Vítej v naší <em style={{ color: "var(--orange)" }}>kabině!</em></h1>
            <p className="lead" style={{ color: "rgba(247,242,230,0.8)", marginTop: 16 }}>Naučím tě úplně všechno o fotbale. Pravidla, taktiku, pozice — krok za krokem, s animacemi a hrami.</p>
            <div className="hero-actions">
              <button className="btn primary" onClick={() => onNav("rules")}>První lekce</button>
              <button className="btn" style={{ background: "transparent", color: "var(--cream)", borderColor: "var(--cream)", boxShadow: "0 3px 0 var(--cream)" }} onClick={() => onNav("quiz")}>Rovnou kvíz</button>
            </div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateRows: "1fr 1fr", gap: 16 }}>
          <div className="card orange" style={{ padding: 22 }}>
            <div className="display" style={{ fontSize: 26 }}>Co nás čeká?</div>
            <p style={{ marginTop: 6, color: "var(--navy)" }}>6 kapitol plných animací, klikací hřiště a kvízy s okamžitou zpětnou vazbou.</p>
            <div className="pill-row" style={{ marginTop: 12 }}>
              <span className="pill navy">Pravidla</span>
              <span className="pill navy">Strategie</span>
              <span className="pill navy">Hra</span>
            </div>
          </div>
          <div className="card" style={{ padding: 22, display: "flex", alignItems: "center", gap: 14 }}>
            <Mascot size={72} bounce mood="wink"/>
            <div>
              <div style={{ fontWeight: 700 }}>"Bez ofsajdu to nepůjde, kámo!"</div>
              <div style={{ fontSize: 13, color: "var(--navy-soft)" }}>— Kopík, 8 let zkušeností</div>
            </div>
          </div>
        </div>
      </div>

      <div className="divider"/>

      <SectionHead index="MENU" title="Vyber si kapitolu" kicker="Šest oblastí. Žádné limity, projdi je tak, jak chceš."/>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 18 }}>
        {cats.map((c, i) => (
          <button key={c.id} className="tile" onClick={() => onNav(c.id)} style={{ alignItems: "flex-start" }}>
            <div style={{ fontSize: 42 }}>{c.icon}</div>
            <div className="tile-title">{c.title}</div>
            <div className="tile-desc">{c.note}</div>
            <div className="tile-num" style={{ marginTop: 6 }}><span>Kapitola {String(i+1).padStart(2,"0")}</span></div>
          </button>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { HomeVariantA, HomeVariantB });
