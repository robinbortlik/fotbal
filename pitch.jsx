/* === Pitch page — clickable hřiště === */

const PITCH_HOTSPOTS = [
  { id: 1, x: 50, y: 32, title: "Středový kruh", text: "Tady začíná každý zápas (výkop). Soupeři musí být mimo kruh. Má průměr 18,30 m." },
  { id: 2, x: 50, y: 1.5, title: "Středová čára", text: "Dělí hřiště na dvě poloviny. Tvůj brankář brání svou půlku." },
  { id: 3, x: 8, y: 32, title: "Pokutové území (vápno)", text: "Tady smí brankář chytat rukama. Když ti soupeř fauluje v jeho vápně — penalta!" },
  { id: 4, x: 10, y: 32.5, title: "Pokutová značka", text: "Z této tečky se kope penalta. 11 metrů od branky." },
  { id: 5, x: 4, y: 32, title: "Branková území (malé vápno)", text: "Šestka. Z ní kope brankář kop od branky." },
  { id: 6, x: 1.5, y: 1.5, title: "Roh", text: "Z rohové značky se kope roh, když obránce vykopne míč přes vlastní brankovou čáru." },
  { id: 7, x: 0.5, y: 32, title: "Branka", text: "7,32 m široká, 2,44 m vysoká. Sem chceš trefit míč!" },
  { id: 8, x: 1, y: 32, title: "Branková čára", text: "Když míč přejde CELÝ za brankovou čáru mezi tyčemi — gól!" },
];

function PitchPage() {
  const [active, setActive] = useState(1);
  const info = PITCH_HOTSPOTS.find(h => h.id === active);
  return (
    <div className="page">
      <span className="eyebrow green"><BallIcon size={14}/> Kapitola 3</span>
      <h1>O hřišti</h1>
      <p className="lead">Co znamenají všechny ty čáry? Klikni na oranžová kolečka — Kopík ti je vysvětlí.</p>

      <div className="divider"/>

      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 24 }} className="hero-grid">
        <div className="pitch-wrap" style={{ position: "relative" }}>
          <div style={{ position: "relative" }}>
            <PitchSVG>
              {PITCH_HOTSPOTS.map(h => (
                <g key={h.id} onClick={() => setActive(h.id)} style={{ cursor: "pointer" }}>
                  <circle cx={h.x} cy={h.y} r={active === h.id ? 2.6 : 2.2} fill={active === h.id ? "#fff" : "#F2A007"} stroke="#0B1F33" strokeWidth="0.5"/>
                  <text x={h.x} y={h.y + 0.9} textAnchor="middle" fontSize="2.4" fontWeight="800" fontFamily="Bricolage Grotesque, sans-serif" fill="#0B1F33">{h.id}</text>
                </g>
              ))}
            </PitchSVG>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <MascotSay>Hřiště má mraky čar a každá něco znamená. Klikni na číslo a já ti to vysvětlím!</MascotSay>
          <div className="card" style={{ background: "var(--orange)", color: "var(--navy)", borderColor: "var(--navy)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div className="hotspot" style={{ position: "static", animation: "none", flexShrink: 0 }}>{info.id}</div>
              <div className="display" style={{ fontSize: 24 }}>{info.title}</div>
            </div>
            <p style={{ marginTop: 12, fontSize: 16 }}>{info.text}</p>
          </div>
          <div className="card">
            <div className="display" style={{ fontSize: 18 }}>Rozměry hřiště</div>
            <ul style={{ paddingLeft: 18, lineHeight: 1.7, marginTop: 8, fontSize: 14 }}>
              <li>Délka: <b>90–120 m</b></li>
              <li>Šířka: <b>45–90 m</b></li>
              <li>Mezinárodní zápasy: <b>100–110 × 64–75 m</b></li>
              <li>Branka: <b>7,32 × 2,44 m</b></li>
              <li>Pokutové území: <b>16,5 m</b> od branky</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { PitchPage });
