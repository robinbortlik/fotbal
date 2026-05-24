/* === Rules page === */

const RULES = [
  { id: "basics", title: "Základy hry", icon: "⚽", duration: 6 },
  { id: "offside", title: "Ofsajd", icon: "🚩", duration: 7 },
  { id: "fouls", title: "Faul & karty", icon: "🟨", duration: 6 },
  { id: "set", title: "Roh, aut a volný kop", icon: "📐", duration: 6 },
  { id: "penalty", title: "Penalta", icon: "🎯", duration: 5 },
  { id: "goal", title: "Branka a góly", icon: "🥅", duration: 4 },
  { id: "ref", title: "Role rozhodčího", icon: "👮", duration: 4 },
];

function RulesPage() {
  const [active, setActive] = useState("offside");
  return (
    <div className="page">
      <span className="eyebrow green"><BallIcon size={14}/> Kapitola 1</span>
      <h1>Pravidla fotbalu</h1>
      <p className="lead">Sedm hlavních pravidel, která musíš znát, než vyběhneš na hřiště. Klikni na lekci a Kopík ti ji ukáže s animací.</p>

      <div className="divider"/>

      <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 28 }} className="rules-layout">
        <aside style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {RULES.map((r, i) => (
            <button
              key={r.id}
              className="tile"
              onClick={() => setActive(r.id)}
              style={{
                padding: 14,
                background: active === r.id ? "var(--navy)" : "var(--paper)",
                color: active === r.id ? "var(--cream)" : "var(--navy)",
                boxShadow: active === r.id ? "0 4px 0 #000" : "var(--shadow)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 24 }}>{r.icon}</span>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontSize: 12, opacity: 0.7, fontWeight: 700, letterSpacing: "0.08em" }}>{String(i+1).padStart(2,"0")}</div>
                  <div style={{ fontFamily: "Bricolage Grotesque, sans-serif", fontWeight: 800, fontSize: 17 }}>{r.title}</div>
                </div>
              </div>
            </button>
          ))}
        </aside>
        <main>
          {active === "basics" && <RuleBasics/>}
          {active === "offside" && <RuleOffside/>}
          {active === "fouls" && <RuleFouls/>}
          {active === "set" && <RuleSetPieces/>}
          {active === "penalty" && <RulePenalty/>}
          {active === "goal" && <RuleGoal/>}
          {active === "ref" && <RuleRef/>}
        </main>
      </div>
    </div>
  );
}

/* --- Reusable rule layout shell --- */
function RuleShell({ kicker, title, lead, mascotText, children, pitchSlot, sideSlot }) {
  return (
    <div>
      <span className="eyebrow orange">{kicker}</span>
      <h2 style={{ marginTop: 10 }}>{title}</h2>
      <p className="lead">{lead}</p>
      {mascotText && <div style={{ marginTop: 18 }}><MascotSay>{mascotText}</MascotSay></div>}
      <div style={{ display: "grid", gridTemplateColumns: sideSlot ? "1.4fr 1fr" : "1fr", gap: 22, marginTop: 18 }}>
        <div>{pitchSlot}</div>
        {sideSlot && <div>{sideSlot}</div>}
      </div>
      {children}
    </div>
  );
}

/* --- BASICS --- */
function RuleBasics() {
  return (
    <RuleShell
      kicker="01 / Základy"
      title="Jak vlastně fotbal funguje?"
      lead="Dva týmy. Jeden míč. Kdo dá víc gólů, vyhrává."
      mascotText="Fotbal hrají dva týmy proti sobě. V každém týmu je 11 hráčů, jeden z nich je brankář. Cílem je dostat míč do soupeřovy branky — nohou, hlavou nebo jakoukoli částí těla kromě rukou (brankář ve vápně může rukama)."
      sideSlot={
        <div className="card">
          <div className="display" style={{ fontSize: 22 }}>Rychlofakta</div>
          <ul style={{ paddingLeft: 18, lineHeight: 1.8, marginTop: 8 }}>
            <li><b>11 hráčů</b> v týmu (1 brankář + 10 v poli)</li>
            <li><b>2 × 45 minut</b> (poločas 15 minut)</li>
            <li><b>3 střídání</b> za zápas (často víc u mládeže)</li>
            <li><b>Sudí</b> řídí zápas, má 2 asistenty na čárách</li>
            <li><b>Žluté/červené karty</b> trestají fauly</li>
          </ul>
        </div>
      }
      pitchSlot={
        <div className="pitch-wrap">
          <PitchSVG>
            {/* Sample 11v11 starting positions */}
            {[[5,32],[20,12],[20,24],[20,40],[20,52],[35,16],[35,32],[35,48],[45,24],[45,40],[42,32]].map(([x,y], i) => (
              <Player key={"h"+i} x={x} y={y} team={i === 0 ? "gk" : "home"} num={i === 0 ? "1" : ""} size={2.4}/>
            ))}
            {[[95,32],[80,12],[80,24],[80,40],[80,52],[65,16],[65,32],[65,48],[55,24],[55,40],[58,32]].map(([x,y], i) => (
              <Player key={"a"+i} x={x} y={y} team={i === 0 ? "gk" : "away"} num={i === 0 ? "1" : ""} size={2.4}/>
            ))}
            <Ball x={50} y={32}/>
          </PitchSVG>
          <div style={{ marginTop: 14, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
            <div className="pill-row">
              <span className="pill orange">Domácí ⬤</span>
              <span className="pill navy">Hosté ⬤</span>
              <span className="pill green">Brankář ⬤</span>
            </div>
            <span style={{ fontSize: 13, color: "var(--navy-soft)" }}>Rozestavení před výkopem</span>
          </div>
        </div>
      }
    />
  );
}

/* --- OFFSIDE --- */
function RuleOffside() {
  const DUR = 6;
  const { time, setTime, playing, setPlaying } = useTimeline(DUR, false);

  // Scene: attacker (yellow #9) runs from x=40 to x=85. Passer #10 stays. Last defender #4 at x=72.
  // Ball is passed at t=2 from passer to attacker — at moment of pass, #9 is at x=63 (BEFORE last defender → onside? No, 63 < 72 means closer to own goal — onside)
  // We'll make TWO scenarios with toggle.
  const [scenario, setScenario] = useState("offside");

  const config = scenario === "offside" ? {
    passer: [{t:0,x:40,y:48},{t:DUR,x:40,y:48}],
    attacker: [{t:0,x:55,y:24},{t:2,x:76,y:22},{t:DUR,x:92,y:18}], // attacker beyond defender at pass time
    defender: [{t:0,x:72,y:30},{t:DUR,x:72,y:30}],
    ball: [{t:0,x:40,y:48},{t:2,x:40,y:48},{t:3.4,x:85,y:22},{t:DUR,x:85,y:22}],
    passT: 2,
  } : {
    passer: [{t:0,x:40,y:48},{t:DUR,x:40,y:48}],
    attacker: [{t:0,x:50,y:24},{t:2,x:60,y:22},{t:DUR,x:88,y:18}], // attacker behind defender at pass time
    defender: [{t:0,x:72,y:30},{t:DUR,x:72,y:30}],
    ball: [{t:0,x:40,y:48},{t:2,x:40,y:48},{t:3.4,x:85,y:22},{t:DUR,x:85,y:22}],
    passT: 2,
  };

  const passer = interpAt(config.passer, time);
  const attacker = interpAt(config.attacker, time);
  const defender = interpAt(config.defender, time);
  const ball = interpAt(config.ball, time);

  const isPassMoment = Math.abs(time - config.passT) < 0.15;
  // Determine ofside at moment of pass
  const attackerAtPass = interpAt(config.attacker, config.passT);
  const defenderAtPass = interpAt(config.defender, config.passT);
  const isOffside = attackerAtPass.x > defenderAtPass.x;

  const steps = ["Hráč drží míč", "Útočník se rozbíhá", "Přihrávka", "Pozice ofsajdu?", "Výsledek"];
  const currentStep = time < 1 ? 0 : time < 2 ? 1 : time < 2.2 ? 2 : time < 4 ? 3 : 4;

  return (
    <RuleShell
      kicker="02 / Ofsajd"
      title="Ofsajd — pravidlo, které matě nejvíc lidí"
      lead="Útočník nesmí stát blíž k bráně soupeře než předposlední soupeř, KDYŽ mu jde míč."
      mascotText={<>
        <b>Důležitá věta:</b> Ofsajd se posuzuje v okamžiku, kdy spoluhráč přihrává — ne když útočník míč přebírá. Klikni na <span className="pill orange">Přehrát</span> a sleduj zelenou čáru posledního obránce.
      </>}
      sideSlot={
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="card">
            <div className="display" style={{ fontSize: 20 }}>Co sleduješ?</div>
            <ul style={{ paddingLeft: 18, lineHeight: 1.7, marginTop: 6, fontSize: 15 }}>
              <li><span className="pill orange" style={{ padding: "2px 8px" }}>9</span> útočník</li>
              <li><span className="pill orange" style={{ padding: "2px 8px" }}>10</span> přihrávající</li>
              <li><span className="pill navy" style={{ padding: "2px 8px" }}>4</span> poslední obránce</li>
              <li>Zelená čára = pomyslná linie ofsajdu</li>
            </ul>
          </div>
          <div className="card" style={{ background: isOffside ? "#ffe9d6" : "#dff5e6", borderColor: isOffside ? "#d18800" : "var(--pitch-dark)" }}>
            <div className="display" style={{ fontSize: 22, color: isOffside ? "#a85a00" : "#084d2c" }}>
              {isOffside ? "🚩 Ofsajd!" : "✓ V pořádku"}
            </div>
            <p style={{ marginTop: 6, fontSize: 15 }}>
              {isOffside
                ? "V okamžiku přihrávky byl útočník BLÍŽ k bráně než předposlední soupeř. Sudí píská ofsajd a tým ztrácí míč."
                : "V okamžiku přihrávky byl útočník na úrovni nebo ZA posledním obráncem. Pokračuje se ve hře."}
            </p>
          </div>
          <div className="pill-row">
            <button className={"step-chip " + (scenario === "offside" ? "active" : "")} onClick={() => { setScenario("offside"); setTime(0); }}>Scénář A: Ofsajd</button>
            <button className={"step-chip " + (scenario === "onside" ? "active" : "")} onClick={() => { setScenario("onside"); setTime(0); }}>Scénář B: V pořádku</button>
          </div>
        </div>
      }
      pitchSlot={
        <div className="pitch-wrap">
          <PitchSVG>
            {/* Offside line at last defender x */}
            <line x1={defender.x} y1={1} x2={defender.x} y2={PITCH_H-1} stroke="#7CD3A0" strokeWidth="0.5" strokeDasharray="1.5 1"/>
            {/* Ball trajectory hint */}
            <Arrow x1={passer.x} y1={passer.y} x2={interpAt(config.ball, 3.4).x} y2={interpAt(config.ball, 3.4).y} dashed color="rgba(255,255,255,0.5)" width={0.4}/>
            {/* Players */}
            <Player x={passer.x} y={passer.y} team="home" num="10" size={3}/>
            <Player x={attacker.x} y={attacker.y} team="home" num="9" size={3} glow={isPassMoment}/>
            <Player x={defender.x} y={defender.y} team="away" num="4" size={3}/>
            <Player x={20} y={32} team="away" num="6" size={3}/>
            <Player x={97} y={32} team="gk" num="1" size={3}/>
            <Ball x={ball.x} y={ball.y}/>
            {isPassMoment && (
              <text x={defender.x + 1} y={6} fontSize="2.8" fontWeight="800" fill="#7CD3A0" fontFamily="Bricolage Grotesque, sans-serif">LINIE OFSAJDU</text>
            )}
          </PitchSVG>
          <Scrubber duration={DUR} value={time} onChange={setTime} playing={playing} onPlay={() => setPlaying(!playing)}
            steps={steps} currentStep={currentStep} onStepChange={(i) => setTime([0.5, 1.5, 2, 3, 4.5][i])}/>
        </div>
      }
    />
  );
}

/* --- FOULS --- */
function RuleFouls() {
  const examples = [
    { card: "yellow", title: "Žlutá karta", reasons: ["Tvrdý faul", "Zdržování hry", "Protesty proti rozhodčímu", "Úmyslné ruka"] },
    { card: "red", title: "Červená karta", reasons: ["Velmi tvrdý faul", "Druhá žlutá v zápase", "Zabránění čisté gólové šanci", "Plivnutí, urážky"] },
  ];
  return (
    <RuleShell
      kicker="03 / Fauly"
      title="Faul a karty"
      lead="Když hráč poruší pravidla, dostane od sudího kartu. Žlutá = varování, červená = konec."
      mascotText="Fauly jsou strkání, podražení, držení, kopání do soupeře. Po faulu dostane druhý tým volný kop. Když je to ve vápně, je z toho penalta!"
      pitchSlot={
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {examples.map((ex) => (
            <div key={ex.card} className="card" style={{
              background: ex.card === "yellow" ? "#FFD23F" : "#e64a3b",
              color: ex.card === "yellow" ? "var(--navy)" : "white",
              borderColor: "var(--navy)",
              padding: 22,
            }}>
              <div style={{ width: 64, height: 80, background: "currentColor", opacity: 0.15, borderRadius: 4, marginBottom: 12 }}/>
              <div className="display" style={{ fontSize: 24 }}>{ex.title}</div>
              <ul style={{ paddingLeft: 16, marginTop: 10, lineHeight: 1.6, fontSize: 14 }}>
                {ex.reasons.map((r,i) => <li key={i}>{r}</li>)}
              </ul>
            </div>
          ))}
          <div className="card" style={{ gridColumn: "1 / -1" }}>
            <div className="display" style={{ fontSize: 20 }}>Když přijde faul…</div>
            <div className="pill-row" style={{ marginTop: 10 }}>
              <span className="pill">1. Sudí píská</span>
              <span className="pill">2. Ukáže místo</span>
              <span className="pill">3. Případně karta</span>
              <span className="pill">4. Druhý tým kope</span>
            </div>
          </div>
        </div>
      }
    />
  );
}

/* --- SET PIECES --- */
function RuleSetPieces() {
  const [type, setType] = useState("corner");
  const DUR = 4;
  const { time, setTime, playing, setPlaying } = useTimeline(DUR, false);

  const configs = {
    corner: {
      label: "Roh", note: "Když obránce vykopne míč přes vlastní brankovou čáru, kope se roh ze značky v rohu hřiště.",
      ball: [{t:0,x:99,y:1},{t:1.8,x:99,y:1},{t:3.2,x:90,y:32}],
      shooter: [{t:0,x:99,y:1},{t:DUR,x:99,y:1}],
      mates: [{x:88,y:24},{x:84,y:32},{x:88,y:40}],
    },
    throwin: {
      label: "Aut", note: "Když míč přejde celou postranní čáru, hází se aut. Obě nohy musí být na zemi, ruce nad hlavou.",
      ball: [{t:0,x:50,y:0},{t:2,x:50,y:0},{t:3.2,x:45,y:18}],
      shooter: [{t:0,x:50,y:-1},{t:DUR,x:50,y:-1}],
      mates: [{x:45,y:14},{x:55,y:20},{x:40,y:24}],
    },
    freekick: {
      label: "Volný kop", note: "Po faulu kope druhý tým volný kop. Soupeři musí být minimálně 9,15 m daleko (zeď).",
      ball: [{t:0,x:65,y:32},{t:2,x:65,y:32},{t:3.2,x:96,y:32}],
      shooter: [{t:0,x:62,y:32},{t:DUR,x:64,y:32}],
      mates: [{x:78,y:30},{x:78,y:34},{x:78,y:38}, {x:78,y:26}], // wall
    },
  };

  const cfg = configs[type];
  const ball = interpAt(cfg.ball, time);
  const shooter = interpAt(cfg.shooter, time);

  return (
    <RuleShell
      kicker="04 / Standardní situace"
      title="Roh, aut a volný kop"
      lead="Když míč opustí hřiště nebo dojde k faulu, hra se rozjede znovu z jedné z těchto standardních situací."
      mascotText="Tahle pravidla využiješ v každém zápase! Klikni si je jedno po druhém — Kopík ti je ukáže."
      sideSlot={
        <div className="card">
          <div className="display" style={{ fontSize: 20 }}>Vyber situaci</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 12 }}>
            {Object.entries(configs).map(([k, v]) => (
              <button key={k} className={"step-chip " + (type === k ? "active" : "")} style={{ width: "100%", textAlign: "left" }} onClick={() => { setType(k); setTime(0); }}>{v.label}</button>
            ))}
          </div>
          <p style={{ marginTop: 14, fontSize: 15, color: "var(--navy-soft)" }}>{cfg.note}</p>
        </div>
      }
      pitchSlot={
        <div className="pitch-wrap">
          <PitchSVG>
            {/* mates */}
            {cfg.mates.map((m, i) => <Player key={i} x={m.x} y={m.y} team={type === "freekick" && i < 4 ? "away" : "home"} num="" size={2.4}/>)}
            <Player x={shooter.x} y={shooter.y} team={type === "freekick" ? "home" : "home"} num="" size={3} glow/>
            <Player x={97} y={32} team="gk" num="1" size={3}/>
            <Ball x={ball.x} y={ball.y}/>
            {type === "freekick" && (
              <g>
                <line x1={73} y1={26} x2={73} y2={40} stroke="#F2A007" strokeWidth="0.3" strokeDasharray="1 1"/>
                <text x={74} y={24} fontSize="2.2" fill="#F2A007" fontWeight="800">9,15 m</text>
              </g>
            )}
          </PitchSVG>
          <Scrubber duration={DUR} value={time} onChange={setTime} playing={playing} onPlay={() => setPlaying(!playing)}/>
        </div>
      }
    />
  );
}

/* --- PENALTY --- */
function RulePenalty() {
  const DUR = 3;
  const { time, setTime, playing, setPlaying } = useTimeline(DUR, false);
  const [target, setTarget] = useState({ x: 99, y: 28 }); // user-selectable shot target
  const ballTrack = [{t:0,x:90,y:32},{t:1.2,x:90,y:32},{t:2.4,x:target.x,y:target.y},{t:DUR,x:target.x,y:target.y}];
  const ball = interpAt(ballTrack, time);
  const gkTrack = [{t:0,x:99,y:32},{t:1.2,x:99,y:32},{t:2.4,x:99,y:32 + (target.y > 32 ? -3 : 3)}]; // gk dives wrong way
  const gk = interpAt(gkTrack, time);
  const shooter = interpAt([{t:0,x:88,y:32},{t:1.2,x:90,y:32},{t:1.6,x:90,y:32},{t:DUR,x:88,y:32}], time);
  return (
    <RuleShell
      kicker="05 / Penalta"
      title="Penalta — souboj jeden na jednoho"
      lead="Když nastane faul v pokutovém území, druhý tým kope penaltu z 11 metrů. Branka a brankář. Nic jiného."
      mascotText="Klikni do branky a vyber, kam chceš kopnout! Pak zmáčkni Přehrát."
      sideSlot={
        <div className="card">
          <div className="display" style={{ fontSize: 20 }}>Pravidla penalty</div>
          <ul style={{ paddingLeft: 18, lineHeight: 1.7, fontSize: 15, marginTop: 8 }}>
            <li>Z 11 metrů od branky</li>
            <li>Jen <b>brankář vs. střelec</b></li>
            <li>Ostatní stojí mimo vápno</li>
            <li>Brankář se nesmí pohnout dopředu před výstřelem</li>
            <li>Střelec střelí jen jednou</li>
          </ul>
        </div>
      }
      pitchSlot={
        <div className="pitch-wrap">
          <PitchSVG halfOnly="right">
            <Player x={shooter.x} y={shooter.y} team="home" num="9" size={3.5}/>
            <Player x={gk.x} y={gk.y} team="gk" num="1" size={3.5}/>
            <Ball x={ball.x} y={ball.y} size={2}/>
            <Arrow x1={90} y1={32} x2={target.x} y2={target.y} dashed color="#F2A007" width={0.5}/>
            {/* target click area: goal mouth */}
            <rect x={98} y={28} width={3} height={8} fill="rgba(242,160,7,0.15)" stroke="#F2A007" strokeWidth="0.3" strokeDasharray="0.6 0.6"
              onClick={(e) => {
                const svg = e.currentTarget.ownerSVGElement;
                const pt = svg.createSVGPoint();
                pt.x = e.clientX; pt.y = e.clientY;
                const c = pt.matrixTransform(svg.getScreenCTM().inverse());
                setTarget({ x: Math.max(98.5, Math.min(99.8, c.x)), y: Math.max(28.5, Math.min(35.5, c.y)) });
                setTime(0);
              }}
              style={{ cursor: "crosshair" }}/>
            <text x={88} y={26} fontSize="2" fontWeight="700" fill="#F2A007" fontFamily="Bricolage Grotesque, sans-serif">↑ Klikni do branky</text>
          </PitchSVG>
          <Scrubber duration={DUR} value={time} onChange={setTime} playing={playing} onPlay={() => setPlaying(!playing)}/>
        </div>
      }
    />
  );
}

/* --- GOAL --- */
function RuleGoal() {
  return (
    <RuleShell
      kicker="06 / Branka"
      title="Co znamená vstřelit branku?"
      lead="Míč musí přejít CELÝ za brankovou čáru, mezi tyčemi a pod břevnem. Ani milimetr méně."
      mascotText="Pozor! Když je míč na čáře, ještě to není gól. Musí být CELÝ za ní. Sudí to dnes ve velkých zápasech kontroluje i pomocí kamer (gólová technologie)."
      pitchSlot={
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
            {[
              { ok: false, label: "Míč na čáře", caption: "Není gól. Část míče je ještě na hřišti." },
              { ok: false, label: "Půl na, půl za", caption: "Pořád není gól. Musí celý." },
              { ok: true, label: "Celý za čárou", caption: "GÓL! ⚽" },
            ].map((c, i) => (
              <div key={i} style={{ textAlign: "center", padding: 12, background: c.ok ? "#dff5e6" : "var(--cream)", borderRadius: 14, border: "2px solid var(--navy)" }}>
                <svg viewBox="0 0 60 40" style={{ width: "100%", height: 100 }}>
                  <rect x="0" y="5" width="60" height="30" fill="#0E8A4F"/>
                  <line x1="10" y1="5" x2="10" y2="35" stroke="white" strokeWidth="0.6"/>
                  <rect x="2" y="10" width="8" height="20" fill="none" stroke="white" strokeWidth="0.5"/>
                  {/* ball position */}
                  <circle cx={i === 0 ? 11 : i === 1 ? 9 : 6} cy={22} r="2.5" fill="white" stroke="#0B1F33" strokeWidth="0.5"/>
                </svg>
                <div style={{ fontWeight: 800, fontFamily: "Bricolage Grotesque, sans-serif", marginTop: 8, color: c.ok ? "#084d2c" : "var(--navy)" }}>{c.label}</div>
                <div style={{ fontSize: 13, color: "var(--navy-soft)", marginTop: 4 }}>{c.caption}</div>
              </div>
            ))}
          </div>
        </div>
      }
    />
  );
}

/* --- REF --- */
function RuleRef() {
  return (
    <RuleShell
      kicker="07 / Rozhodčí"
      title="Role rozhodčího"
      lead="Sudí má píšťalku a slovo na hřišti. Pomáhají mu asistenti a v profesionálním fotbale i VAR."
      mascotText="Rozhodčí kontroluje, jestli se hraje podle pravidel. Když píská — všichni poslouchají. Je to jeho hřiště!"
      pitchSlot={
        <div className="card-grid">
          {[
            { who: "Hlavní rozhodčí", desc: "Píská, ukazuje karty, kontroluje čas. Běhá po celém hřišti.", color: "var(--navy)", text: "var(--cream)" },
            { who: "2× asistent (lajnsmen)", desc: "Sledují postranní čáru, mávají při ofsajdu a autu.", color: "var(--orange)", text: "var(--navy)" },
            { who: "4. rozhodčí", desc: "Stojí u střídaček. Hlídá střídání a nastavený čas.", color: "var(--pitch)", text: "white" },
            { who: "VAR (jen velký fotbal)", desc: "V televizi sleduje záznam a poradí sudímu při zásadních situacích.", color: "var(--cream-deep)", text: "var(--navy)" },
          ].map((r, i) => (
            <div key={i} className="card" style={{ background: r.color, color: r.text, borderColor: "var(--navy)" }}>
              <div className="display" style={{ fontSize: 22 }}>{r.who}</div>
              <p style={{ marginTop: 8, opacity: 0.9 }}>{r.desc}</p>
            </div>
          ))}
        </div>
      }
    />
  );
}

Object.assign(window, { RulesPage });
