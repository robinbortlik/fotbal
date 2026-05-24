/* === Strategy page === */

const STRATEGY = [
  { id: "positions-pitch", title: "Pozice na hřišti", icon: "🧩" },
  { id: "formations", title: "Formace (drag & drop)", icon: "📐" },
  { id: "movement", title: "Pohyb bez míče", icon: "🏃" },
  { id: "passing", title: "Přihrávání", icon: "↗️" },
  { id: "attack-defense", title: "Útok a obrana", icon: "⚔️" },
  { id: "set-piece", title: "Standardní situace", icon: "🎯" },
];

function StrategyPage() {
  const [active, setActive] = useState("formations");
  return (
    <div className="page">
      <span className="eyebrow green"><BallIcon size={14}/> Kapitola 2</span>
      <h1>Strategie hraní</h1>
      <p className="lead">Jak hrát chytře, ne jen rychle. Tady se naučíš, kdy přihrát, kdy běžet a kdy zůstat stát.</p>

      <div className="divider"/>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 24 }}>
        {STRATEGY.map((s, i) => (
          <button key={s.id} className={"step-chip " + (active === s.id ? "active" : "")} onClick={() => setActive(s.id)}>
            <span style={{ marginRight: 6 }}>{s.icon}</span>{s.title}
          </button>
        ))}
      </div>

      {active === "positions-pitch" && <StratPositions/>}
      {active === "formations" && <StratFormations/>}
      {active === "movement" && <StratMovement/>}
      {active === "passing" && <StratPassing/>}
      {active === "attack-defense" && <StratAttackDefense/>}
      {active === "set-piece" && <StratSetPiece/>}
    </div>
  );
}

/* --- Positions on pitch (overview heatmap-ish) --- */
function StratPositions() {
  const zones = [
    { name: "Brankář", x: 4, y: 32, color: "#7CD3A0", w: 12, h: 24, desc: "Hlídá branku, jediný smí ve vápně rukama." },
    { name: "Obrana", x: 22, y: 32, color: "#9BB4D6", w: 18, h: 48, desc: "Brání hřiště, blokuje útoky soupeře." },
    { name: "Záloha", x: 45, y: 32, color: "#F2C572", w: 22, h: 50, desc: "Spojuje obranu s útokem. Nejvíc běhají." },
    { name: "Útok", x: 75, y: 32, color: "#E8835A", w: 20, h: 44, desc: "Střílí góly, vytváří šance." },
  ];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 22 }}>
      <div className="pitch-wrap">
        <PitchSVG>
          {zones.map((z, i) => (
            <g key={i}>
              <rect x={z.x - z.w/2} y={z.y - z.h/2} width={z.w} height={z.h} fill={z.color} opacity="0.45" rx="2"/>
              <text x={z.x} y={z.y - z.h/2 - 1.5} textAnchor="middle" fontWeight="800" fontSize="2.6" fill="white" fontFamily="Bricolage Grotesque, sans-serif">{z.name.toUpperCase()}</text>
            </g>
          ))}
          {/* Sample players */}
          <Player x={5} y={32} team="gk" num="1" size={2.8}/>
          {[[22,18],[22,30],[22,40],[22,52]].map(([x,y],i) => <Player key={"d"+i} x={x} y={y} team="home" num="" size={2.4}/>)}
          {[[45,18],[45,30],[45,40],[45,52]].map(([x,y],i) => <Player key={"m"+i} x={x} y={y} team="home" num="" size={2.4}/>)}
          {[[72,22],[78,32],[72,42]].map(([x,y],i) => <Player key={"a"+i} x={x} y={y} team="home" num="" size={2.4}/>)}
        </PitchSVG>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <MascotSay>Každý hráč má svou zónu, kde má hlavně být. Ale fotbal žije pohybem — nestůj na místě!</MascotSay>
        {zones.map((z, i) => (
          <div key={i} className="card" style={{ borderLeft: `8px solid ${z.color}`, padding: 16 }}>
            <div className="display" style={{ fontSize: 20 }}>{z.name}</div>
            <p style={{ marginTop: 4, fontSize: 15, color: "var(--navy-soft)" }}>{z.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* --- Formations: drag & drop --- */
const FORMATIONS = {
  "4-4-2": [
    { id: "gk", x: 5, y: 32, role: "GK" },
    { id: "lb", x: 20, y: 12, role: "LB" }, { id: "cb1", x: 20, y: 24, role: "CB" }, { id: "cb2", x: 20, y: 40, role: "CB" }, { id: "rb", x: 20, y: 52, role: "RB" },
    { id: "lm", x: 40, y: 12, role: "LM" }, { id: "cm1", x: 40, y: 24, role: "CM" }, { id: "cm2", x: 40, y: 40, role: "CM" }, { id: "rm", x: 40, y: 52, role: "RM" },
    { id: "st1", x: 65, y: 26, role: "ST" }, { id: "st2", x: 65, y: 38, role: "ST" },
  ],
  "4-3-3": [
    { id: "gk", x: 5, y: 32, role: "GK" },
    { id: "lb", x: 20, y: 12, role: "LB" }, { id: "cb1", x: 20, y: 24, role: "CB" }, { id: "cb2", x: 20, y: 40, role: "CB" }, { id: "rb", x: 20, y: 52, role: "RB" },
    { id: "cdm", x: 36, y: 32, role: "CDM" }, { id: "cm1", x: 44, y: 22, role: "CM" }, { id: "cm2", x: 44, y: 42, role: "CM" },
    { id: "lw", x: 68, y: 14, role: "LW" }, { id: "st", x: 68, y: 32, role: "ST" }, { id: "rw", x: 68, y: 50, role: "RW" },
  ],
  "3-5-2": [
    { id: "gk", x: 5, y: 32, role: "GK" },
    { id: "cb1", x: 20, y: 20, role: "CB" }, { id: "cb2", x: 20, y: 32, role: "CB" }, { id: "cb3", x: 20, y: 44, role: "CB" },
    { id: "lwb", x: 40, y: 10, role: "LWB" }, { id: "cm1", x: 38, y: 24, role: "CM" }, { id: "cdm", x: 36, y: 32, role: "CDM" }, { id: "cm2", x: 38, y: 40, role: "CM" }, { id: "rwb", x: 40, y: 54, role: "RWB" },
    { id: "st1", x: 64, y: 26, role: "ST" }, { id: "st2", x: 64, y: 38, role: "ST" },
  ],
};

function StratFormations() {
  const [formation, setFormation] = useState("4-4-2");
  const [players, setPlayers] = useState(FORMATIONS["4-4-2"]);
  const [dragging, setDragging] = useState(null);
  const svgRef = useRef();

  const pickFormation = (f) => {
    setFormation(f);
    setPlayers(FORMATIONS[f].map(p => ({...p})));
  };

  const onPointerDown = (id) => (e) => {
    e.stopPropagation();
    setDragging(id);
  };

  const onPointerMove = (e) => {
    if (!dragging || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const cx = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const cy = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
    const ratioX = cx / rect.width;
    const ratioY = cy / rect.height;
    const svgX = ratioX * PITCH_W;
    const svgY = ratioY * PITCH_H;
    setPlayers(ps => ps.map(p => p.id === dragging ? { ...p, x: Math.max(2, Math.min(PITCH_W-2, svgX)), y: Math.max(2, Math.min(PITCH_H-2, svgY)) } : p));
  };

  const onPointerUp = () => setDragging(null);

  useEffect(() => {
    window.addEventListener("mousemove", onPointerMove);
    window.addEventListener("mouseup", onPointerUp);
    window.addEventListener("touchmove", onPointerMove, { passive: false });
    window.addEventListener("touchend", onPointerUp);
    return () => {
      window.removeEventListener("mousemove", onPointerMove);
      window.removeEventListener("mouseup", onPointerUp);
      window.removeEventListener("touchmove", onPointerMove);
      window.removeEventListener("touchend", onPointerUp);
    };
  }, [dragging]);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 22 }} className="hero-grid">
      <div>
        <div className="pitch-wrap">
          <svg ref={svgRef} className="pitch-svg" viewBox={`0 0 ${PITCH_W} ${PITCH_H}`} preserveAspectRatio="xMidYMid meet">
            <PitchSVG/>
            {players.map(p => (
              <g key={p.id} className="drag-player" onMouseDown={onPointerDown(p.id)} onTouchStart={onPointerDown(p.id)} transform={`translate(${p.x}, ${p.y})`}>
                <circle r="3.2" fill={p.role === "GK" ? "#7CD3A0" : "#F2A007"} stroke="#0B1F33" strokeWidth="0.5"/>
                <text textAnchor="middle" y="1" fontSize="2.2" fontWeight="800" fill="#0B1F33" fontFamily="Bricolage Grotesque, sans-serif">{p.role}</text>
              </g>
            ))}
          </svg>
        </div>
        <div style={{ marginTop: 14, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <div className="pill-row">
            {Object.keys(FORMATIONS).map(f => (
              <button key={f} className={"step-chip " + (formation === f ? "active" : "")} onClick={() => pickFormation(f)}>{f}</button>
            ))}
          </div>
          <button className="btn sm" onClick={() => setPlayers(FORMATIONS[formation].map(p => ({...p})))}>↻ Resetovat</button>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <MascotSay>Klikni na hráče a táhni ho! Vyzkoušej, jak vypadají různé formace, a postav si vlastní.</MascotSay>
        <div className="card">
          <div className="display" style={{ fontSize: 22 }}>{formation}</div>
          <p style={{ marginTop: 6, color: "var(--navy-soft)", fontSize: 15 }}>
            {formation === "4-4-2" && "Klasická univerzální formace. 4 obránci, 4 záložníci, 2 útočníci. Vyvážená a stabilní."}
            {formation === "4-3-3" && "Útočnější varianta. 3 útočníci s křídelními útočníky (LW, RW). Tlak vysoko, hodně gólů."}
            {formation === "3-5-2" && "5 záložníků s krajními (LWB/RWB), kteří běhají sem a tam. Hodně kreativní, ale náročná."}
          </p>
          <div className="pill-row" style={{ marginTop: 14 }}>
            <span className="pill green">{players.filter(p => p.role === "GK").length} brankář</span>
            <span className="pill orange">{players.filter(p => ["LB","RB","CB"].includes(p.role)).length} obránců</span>
            <span className="pill navy">{players.filter(p => ["LM","RM","CM","CDM","LWB","RWB"].includes(p.role)).length} záložníků</span>
            <span className="pill">{players.filter(p => ["ST","LW","RW"].includes(p.role)).length} útočníků</span>
          </div>
        </div>
        <div className="card">
          <div className="display" style={{ fontSize: 18 }}>Zkratky pozic</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginTop: 8, fontSize: 14 }}>
            <div><b>GK</b> — brankář</div>
            <div><b>CB</b> — střed obrany</div>
            <div><b>LB/RB</b> — krajní obránce</div>
            <div><b>CDM</b> — defensiv. záloha</div>
            <div><b>CM</b> — střed zálohy</div>
            <div><b>LM/RM</b> — krajní záloha</div>
            <div><b>LW/RW</b> — křídelní útočník</div>
            <div><b>ST</b> — útočník</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* --- Movement without ball --- */
function StratMovement() {
  const DUR = 5;
  const { time, setTime, playing, setPlaying } = useTimeline(DUR, false);
  // Player without ball makes a run to receive
  const ballHolder = [{t:0,x:35,y:36},{t:1.5,x:35,y:36},{t:2.5,x:65,y:18},{t:DUR,x:65,y:18}];
  const runner = [{t:0,x:50,y:32},{t:2.5,x:65,y:18},{t:DUR,x:80,y:18}];
  const ball = [{t:0,x:35,y:36},{t:1.5,x:35,y:36},{t:2.5,x:65,y:18},{t:DUR,x:80,y:18}];
  const def = [{t:0,x:60,y:32},{t:DUR,x:62,y:30}];
  const holder = interpAt(ballHolder, time);
  const run = interpAt(runner, time);
  const b = interpAt(ball, time);
  const d = interpAt(def, time);
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 22 }} className="hero-grid">
      <div className="pitch-wrap">
        <PitchSVG>
          <Arrow x1={50} y1={32} x2={65} y2={18} dashed color="#F2A007" width={0.4}/>
          <Arrow x1={35} y1={36} x2={65} y2={18} dashed color="#fff" width={0.4}/>
          <Player x={holder.x} y={holder.y} team="home" num="10" size={3}/>
          <Player x={run.x} y={run.y} team="home" num="9" size={3} glow={time > 1 && time < 3}/>
          <Player x={d.x} y={d.y} team="away" num="4" size={3}/>
          <Ball x={b.x} y={b.y}/>
          <text x={75} y={14} fontSize="2.4" fontWeight="800" fill="#F2A007" fontFamily="Bricolage Grotesque, sans-serif">VOLNÝ PROSTOR ↗</text>
        </PitchSVG>
        <Scrubber duration={DUR} value={time} onChange={setTime} playing={playing} onPlay={() => setPlaying(!playing)}/>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <MascotSay mood="wink">Pohyb je půlka fotbalu. Když nemáš míč, NEHÝBEŠ se? Tak nehraješ — jen koukáš!</MascotSay>
        <div className="card">
          <div className="display" style={{ fontSize: 22 }}>Tři pravidla pohybu</div>
          <ol style={{ paddingLeft: 22, lineHeight: 1.8, marginTop: 8 }}>
            <li><b>Hledej prostor.</b> Tam, kde nikdo není, je tvoje šance.</li>
            <li><b>Běž do volného místa,</b> ne tam, kde už spoluhráč je.</li>
            <li><b>Komunikuj!</b> Kývni, mávej, křič — ať tě spoluhráč vidí.</li>
          </ol>
        </div>
        <div className="card orange">
          <b>Tip Kopíka:</b> "Před přihrávkou se zastav, naznač, kam chceš jít, pak změň směr a vyběhni. Obránce tě nestihne!"
        </div>
      </div>
    </div>
  );
}

/* --- Passing --- */
function StratPassing() {
  const [type, setType] = useState("short");
  const DUR = 4;
  const { time, setTime, playing, setPlaying } = useTimeline(DUR, false);
  const configs = {
    short: { label: "Krátká přihrávka", desc: "Po zemi, na nohu spoluhráče. Bezpečné, přesné.",
      from: [42, 32], to: [55, 30], color: "#F2A007" },
    long: { label: "Dlouhá přihrávka", desc: "Vzduchem přes půl hřiště. Riskantní, ale rychlá.",
      from: [25, 32], to: [80, 20], color: "#0B1F33" },
    through: { label: "Průniková přihrávka", desc: "Mezi obránce do volného prostoru pro útočníka.",
      from: [50, 38], to: [80, 32], color: "#0E8A4F" },
    cross: { label: "Centr", desc: "Z křídla doprostřed pokutového území, na hlavu útočníkovi.",
      from: [85, 8], to: [88, 32], color: "#7CD3A0" },
  };
  const cfg = configs[type];
  // Ball arc: simple parabola in y if "long" or "cross"
  const t = Math.min(1, Math.max(0, (time - 1.2) / 1.8));
  const ease = t < 0.5 ? 2*t*t : 1 - Math.pow(-2*t+2,2)/2;
  const bx = cfg.from[0] + (cfg.to[0] - cfg.from[0]) * ease;
  const by = cfg.from[1] + (cfg.to[1] - cfg.from[1]) * ease;
  const arc = (type === "long" || type === "cross") ? -Math.sin(t * Math.PI) * 4 : 0;
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 22 }} className="hero-grid">
      <div className="pitch-wrap">
        <PitchSVG>
          <Arrow x1={cfg.from[0]} y1={cfg.from[1]} x2={cfg.to[0]} y2={cfg.to[1]} dashed color={cfg.color}/>
          <Player x={cfg.from[0]} y={cfg.from[1]} team="home" num="10" size={3}/>
          <Player x={cfg.to[0]} y={cfg.to[1]} team="home" num="9" size={3} glow={t > 0.8}/>
          {type === "cross" && [[70, 36],[68, 28]].map(([x,y],i) => <Player key={i} x={x} y={y} team="away" num="" size={2.6}/>)}
          {type === "through" && [[65, 26],[65, 36]].map(([x,y],i) => <Player key={i} x={x} y={y} team="away" num="" size={2.6}/>)}
          {type === "long" && [[50, 32]].map(([x,y],i) => <Player key={i} x={x} y={y} team="away" num="" size={2.6}/>)}
          <Ball x={bx} y={by + arc}/>
        </PitchSVG>
        <Scrubber duration={DUR} value={time} onChange={setTime} playing={playing} onPlay={() => setPlaying(!playing)}/>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <MascotSay>Přihrávek je víc druhů. Každá se hodí na jinou situaci. Zkus si je!</MascotSay>
        {Object.entries(configs).map(([k, v]) => (
          <button key={k} className="tile" onClick={() => { setType(k); setTime(0); }} style={{
            padding: 14,
            borderColor: type === k ? "var(--orange)" : "var(--navy)",
            boxShadow: type === k ? "0 3px 0 var(--orange-deep)" : "var(--shadow)",
          }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div style={{ width: 14, height: 14, borderRadius: 7, background: v.color, border: "2px solid var(--navy)" }}/>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontFamily: "Bricolage Grotesque, sans-serif", fontWeight: 800, fontSize: 18 }}>{v.label}</div>
                <div style={{ fontSize: 14, color: "var(--navy-soft)" }}>{v.desc}</div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

/* --- Attack & Defense --- */
function StratAttackDefense() {
  const [mode, setMode] = useState("attack");
  return (
    <div>
      <div className="pill-row" style={{ marginBottom: 16 }}>
        <button className={"step-chip " + (mode === "attack" ? "active" : "")} onClick={() => setMode("attack")}>Útok</button>
        <button className={"step-chip " + (mode === "defense" ? "active" : "")} onClick={() => setMode("defense")}>Obrana</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 22 }} className="hero-grid">
        <div className="pitch-wrap">
          {mode === "attack" ? <AttackAnim/> : <DefenseAnim/>}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {mode === "attack" ? (
            <>
              <MascotSay>Útok znamená rychle vpřed, ale ne sami! Spoluhráči se rozcházejí do prostoru, ty máš tři možnosti přihrávky.</MascotSay>
              <div className="card">
                <div className="display" style={{ fontSize: 20 }}>4 zásady útoku</div>
                <ol style={{ paddingLeft: 20, lineHeight: 1.8, marginTop: 6 }}>
                  <li>Hraj rychle vpřed, když máš prostor</li>
                  <li>Drž přehled — kde jsou spoluhráči?</li>
                  <li>Naběhni do vápna, když přihrávka jde z křídla</li>
                  <li>Střílej, když je šance — neváhej</li>
                </ol>
              </div>
            </>
          ) : (
            <>
              <MascotSay mood="wink">Bránit znamená nedat soupeři čas a prostor. Stoj mezi soupeřem a brankou — to je celé tajemství.</MascotSay>
              <div className="card">
                <div className="display" style={{ fontSize: 20 }}>4 zásady obrany</div>
                <ol style={{ paddingLeft: 20, lineHeight: 1.8, marginTop: 6 }}>
                  <li>Buď mezi soupeřem a brankou</li>
                  <li>Sleduj míč I hráče — ne jen jedno</li>
                  <li>Komunikuj se spoluhráči (kdo koho hlídá)</li>
                  <li>Nevyrážej do souboje moc brzy — počkej</li>
                </ol>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function AttackAnim() {
  const DUR = 5;
  const { time, setTime, playing, setPlaying } = useTimeline(DUR, false);
  const p10 = interpAt([{t:0,x:30,y:32},{t:1.5,x:30,y:32},{t:DUR,x:30,y:32}], time);
  const p7 = interpAt([{t:0,x:45,y:14},{t:2,x:60,y:12},{t:DUR,x:75,y:14}], time);
  const p9 = interpAt([{t:0,x:55,y:32},{t:1.5,x:70,y:30},{t:DUR,x:85,y:28}], time);
  const p11 = interpAt([{t:0,x:45,y:50},{t:2,x:60,y:52},{t:DUR,x:75,y:50}], time);
  const ball = interpAt([{t:0,x:30,y:32},{t:1.5,x:30,y:32},{t:2.7,x:70,y:30},{t:DUR,x:85,y:28}], time);
  return (
    <div>
      <PitchSVG>
        <Arrow x1={30} y1={32} x2={70} y2={30} dashed color="#F2A007"/>
        <Player x={p10.x} y={p10.y} team="home" num="10" size={3}/>
        <Player x={p9.x} y={p9.y} team="home" num="9" size={3}/>
        <Player x={p7.x} y={p7.y} team="home" num="7" size={3}/>
        <Player x={p11.x} y={p11.y} team="home" num="11" size={3}/>
        <Player x={75} y={32} team="away" num="" size={3}/>
        <Player x={80} y={20} team="away" num="" size={3}/>
        <Player x={80} y={44} team="away" num="" size={3}/>
        <Ball x={ball.x} y={ball.y}/>
      </PitchSVG>
      <Scrubber duration={DUR} value={time} onChange={setTime} playing={playing} onPlay={() => setPlaying(!playing)}/>
    </div>
  );
}
function DefenseAnim() {
  const DUR = 5;
  const { time, setTime, playing, setPlaying } = useTimeline(DUR, false);
  const attacker = interpAt([{t:0,x:75,y:30},{t:DUR,x:35,y:30}], time);
  const def = interpAt([{t:0,x:60,y:30},{t:DUR,x:25,y:30}], time);
  const support = interpAt([{t:0,x:45,y:18},{t:DUR,x:30,y:24}], time);
  const support2 = interpAt([{t:0,x:45,y:42},{t:DUR,x:30,y:38}], time);
  const ball = interpAt([{t:0,x:75,y:30},{t:DUR,x:35,y:30}], time);
  return (
    <div>
      <PitchSVG>
        <Player x={attacker.x} y={attacker.y} team="away" num="9" size={3}/>
        <Player x={def.x} y={def.y} team="home" num="4" size={3} glow/>
        <Player x={support.x} y={support.y} team="home" num="5" size={3}/>
        <Player x={support2.x} y={support2.y} team="home" num="6" size={3}/>
        <Player x={5} y={32} team="gk" num="1" size={3}/>
        <Ball x={ball.x} y={ball.y}/>
        <text x={def.x} y={def.y - 5} fontSize="2" fontWeight="800" fill="#F2A007" fontFamily="Bricolage Grotesque, sans-serif">↓ Hlavní obránce</text>
      </PitchSVG>
      <Scrubber duration={DUR} value={time} onChange={setTime} playing={playing} onPlay={() => setPlaying(!playing)}/>
    </div>
  );
}

/* --- Set piece strategy --- */
function StratSetPiece() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 22 }} className="hero-grid">
      <div className="pitch-wrap">
        <PitchSVG halfOnly="right">
          {/* Corner kick scenario */}
          <Player x={99} y={1} team="home" num="7" size={3} glow/>
          <Player x={86} y={26} team="home" num="9" size={3}/>
          <Player x={86} y={32} team="home" num="11" size={3}/>
          <Player x={90} y={38} team="home" num="6" size={3}/>
          <Player x={94} y={28} team="home" num="4" size={3}/>
          <Player x={88} y={30} team="away" num="" size={3}/>
          <Player x={88} y={36} team="away" num="" size={3}/>
          <Player x={92} y={30} team="away" num="" size={3}/>
          <Player x={97} y={32} team="gk" num="1" size={3}/>
          <Ball x={99} y={1} size={2}/>
          {/* arrows showing runs */}
          <Arrow x1={86} y1={26} x2={94} y2={32} dashed color="#F2A007"/>
          <Arrow x1={90} y1={38} x2={92} y2={28} dashed color="#F2A007"/>
          <Arrow x1={99} y1={1} x2={92} y2={30} color="#fff"/>
        </PitchSVG>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <MascotSay>Standardní situace = připravená šance! Roh, volný kop, aut — to jsou momenty, kdy máš čas si všechno rozmyslet.</MascotSay>
        <div className="card">
          <div className="display" style={{ fontSize: 22 }}>Rohový kop: 3 typy náběhů</div>
          <ul style={{ paddingLeft: 20, lineHeight: 1.8, marginTop: 6 }}>
            <li><b>Přední tyč</b> — krátký náběh dopředu</li>
            <li><b>Zadní tyč</b> — náběh za obránce</li>
            <li><b>Penalta bod</b> — náběh do středu</li>
          </ul>
        </div>
        <div className="card orange">
          <b>Pravidlo:</b> Vždy musíš mít alespoň 3 spoluhráče v pokutovém území. Jeden krátkou, dva dlouhou. Pomate to obránce!
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { StrategyPage });
