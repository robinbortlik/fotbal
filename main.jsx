/* === Main app — routing + chrome === */

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "homeVariant": "A",
  "showMascot": true,
  "highContrast": false
}/*EDITMODE-END*/;

const NAV = [
  { id: "home", label: "Domů" },
  { id: "rules", label: "Pravidla" },
  { id: "strategy", label: "Strategie" },
  { id: "pitch", label: "Hřiště" },
  { id: "positions", label: "Pozice" },
  { id: "zones", label: "Zóny" },
  { id: "move", label: "Pohyb dle míče" },
  { id: "glossary", label: "Slovníček" },
  { id: "quiz", label: "Kvíz", cta: true },
];

function App() {
  const [route, setRoute] = useState(() => (window.location.hash || "#home").slice(1));
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  useEffect(() => {
    const onHash = () => {
      setRoute((window.location.hash || "#home").slice(1));
      window.scrollTo({ top: 0, behavior: "instant" });
    };
    window.addEventListener("hashchange", onHash);
    const onNav = (e) => nav(e.detail);
    window.addEventListener("nav", onNav);
    return () => {
      window.removeEventListener("hashchange", onHash);
      window.removeEventListener("nav", onNav);
    };
  }, []);

  const nav = (id) => {
    window.location.hash = id;
    setRoute(id);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  let page;
  switch (route) {
    case "rules": page = <RulesPage/>; break;
    case "strategy": page = <StrategyPage/>; break;
    case "pitch": page = <PitchPage/>; break;
    case "positions": page = <PositionsPage/>; break;
    case "zones": page = <ZonesPage/>; break;
    case "move": page = <MovePage/>; break;
    case "glossary": page = <GlossaryPage/>; break;
    case "quiz": page = <QuizPage/>; break;
    default:
      page = t.homeVariant === "B" ? <HomeVariantB onNav={nav}/> : <HomeVariantA onNav={nav}/>;
  }

  return (
    <div className="app" data-screen-label={route} data-contrast={t.highContrast ? "high" : "normal"}>
      <header className="topbar">
        <button className="brand" onClick={() => nav("home")} style={{ cursor: "pointer", background: "none" }}>
          <Mascot size={38} bounce/>
          <span>Fotbalové <span style={{ color: "var(--pitch)" }}>ABC</span></span>
        </button>
        <nav className="nav">
          {NAV.map(n => (
            <button key={n.id} className={"nav-link " + (route === n.id ? "active" : "") + (n.cta && route !== n.id ? " cta" : "")} onClick={() => nav(n.id)}>
              {n.label}
            </button>
          ))}
        </nav>
      </header>

      <main style={{ flex: 1 }}>{page}</main>

      <footer className="footer">
        <div style={{ maxWidth: 1400, margin: "0 auto", display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr", gap: 24 }} className="hero-grid">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Mascot size={56}/>
              <div className="display" style={{ fontSize: 26 }}>Fotbalové <span style={{ color: "var(--orange)" }}>ABC</span></div>
            </div>
            <p style={{ marginTop: 12, opacity: 0.8, maxWidth: 480 }}>Výukový web o fotbale pro malé fotbalisty. Pravidla, strategie a všechno, co se na hřišti hodí. Hraj si, čti a běž ven trénovat!</p>
          </div>
          <div>
            <div className="display" style={{ fontSize: 18, color: "var(--orange)", marginBottom: 10 }}>Kapitoly</div>
            <ul style={{ listStyle: "none", padding: 0, lineHeight: 2, fontSize: 15 }}>
              <li><a onClick={() => nav("rules")} style={{ cursor: "pointer" }}>Pravidla</a></li>
              <li><a onClick={() => nav("strategy")} style={{ cursor: "pointer" }}>Strategie</a></li>
              <li><a onClick={() => nav("pitch")} style={{ cursor: "pointer" }}>O hřišti</a></li>
              <li><a onClick={() => nav("positions")} style={{ cursor: "pointer" }}>Pozice</a></li>
            </ul>
          </div>
          <div>
            <div className="display" style={{ fontSize: 18, color: "var(--orange)", marginBottom: 10 }}>Pro děti, rodiče i trenéry</div>
            <p style={{ fontSize: 14, opacity: 0.8 }}>Vhodné pro děti 6–12 let. Bez reklam, bez přihlašování. Stačí klikat a učit se.</p>
            <button className="btn primary" style={{ marginTop: 12 }} onClick={() => nav("quiz")}>Spustit kvíz</button>
          </div>
        </div>
        <div style={{ maxWidth: 1400, margin: "30px auto 0", paddingTop: 20, borderTop: "1px solid rgba(247,242,230,0.2)", fontSize: 13, opacity: 0.6, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
          <span>© Fotbalové ABC — výukový prototyp</span>
          <span>Vyrobeno s ⚽ a spoustou pohybu</span>
        </div>
      </footer>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Domovská stránka">
          <TweakRadio label="Varianta layoutu" value={t.homeVariant} options={[
            { value: "A", label: "Hero" },
            { value: "B", label: "Trenér" },
          ]} onChange={(v) => setTweak("homeVariant", v)}/>
        </TweakSection>
        <TweakSection label="Zobrazení">
          <TweakToggle label="Animace maskota" value={t.showMascot} onChange={(v) => setTweak("showMascot", v)}/>
          <TweakToggle label="Vysoký kontrast" value={t.highContrast} onChange={(v) => setTweak("highContrast", v)}/>
        </TweakSection>
        <div style={{ fontSize: 12, color: "var(--navy-soft)", padding: "8px 4px", lineHeight: 1.4 }}>
          Přepni mezi dvěma návrhy úvodní stránky a porovnej je. Změny se uloží.
        </div>
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
