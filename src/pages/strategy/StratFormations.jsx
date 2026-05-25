import { useEffect, useRef, useState } from "react";
import { PitchSVG, MascotSay } from "../../components";
import { PITCH_W, PITCH_H } from "../../lib/pitchGeometry.js";

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

export function StratFormations() {
  const [formation, setFormation] = useState("4-4-2");
  const [players, setPlayers] = useState(FORMATIONS["4-4-2"]);
  const [dragging, setDragging] = useState(null);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const svgRef = useRef();

  const pickFormation = (f) => {
    setFormation(f);
    setPlayers(FORMATIONS[f].map(p => ({...p})));
    setSelectedPlayer(null);
  };

  const onPointerDown = (id) => (e) => {
    e.stopPropagation();
    // Tap-to-pick fallback for coarse pointers (touch / pen)
    if (e.pointerType === "touch" || e.pointerType === "pen") {
      setSelectedPlayer(prev => prev === id ? null : id);
      return;
    }
    setDragging(id);
  };

  // Tap on pitch to place selected player (coarse-pointer flow)
  const onPitchTap = (e) => {
    if (!selectedPlayer || !svgRef.current) return;
    if (e.pointerType && e.pointerType !== "touch" && e.pointerType !== "pen") return;
    const rect = svgRef.current.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;
    const svgX = (cx / rect.width) * PITCH_W;
    const svgY = (cy / rect.height) * PITCH_H;
    setPlayers(ps => ps.map(p => p.id === selectedPlayer
      ? { ...p, x: Math.max(2, Math.min(PITCH_W - 2, svgX)), y: Math.max(2, Math.min(PITCH_H - 2, svgY)) }
      : p));
    setSelectedPlayer(null);
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
    <div className="hero-grid grid grid-cols-1 md:grid-cols-hero gap-5 md:gap-6">
      <div>
        <div className="pitch-wrap">
          <svg ref={svgRef} className="pitch-svg" viewBox={`0 0 ${PITCH_W} ${PITCH_H}`} preserveAspectRatio="xMidYMid meet" onPointerDown={onPitchTap}>
            <PitchSVG/>
            {players.map(p => (
              <g key={p.id} className="drag-player" transform={`translate(${p.x}, ${p.y})`}>
                <circle r="3.2" fill={p.role === "GK" ? "#7CD3A0" : "#F2A007"} stroke={selectedPlayer === p.id ? "#F2A007" : "#0B1F33"} strokeWidth={selectedPlayer === p.id ? 1.2 : 0.5}/>
                <text textAnchor="middle" y="1" fontSize="2.2" fontWeight="800" fill="#0B1F33" fontFamily="Bricolage Grotesque, sans-serif" pointerEvents="none">{p.role}</text>
                {/* invisible hit overlay — painted AFTER so it wins pointer events */}
                <circle r="6" fill="transparent" pointerEvents="all"
                  style={{ cursor: "pointer", touchAction: "none" }}
                  onPointerDown={onPointerDown(p.id)}/>
              </g>
            ))}
          </svg>
        </div>
        <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2">
          <div className="pill-row">
            {Object.keys(FORMATIONS).map(f => (
              <button key={f} className={"step-chip " + (formation === f ? "active" : "")} onClick={() => pickFormation(f)}>{f}</button>
            ))}
          </div>
          <button className="btn sm" onClick={() => setPlayers(FORMATIONS[formation].map(p => ({...p})))}>↻ Resetovat</button>
        </div>
      </div>
      <div className="flex flex-col gap-3.5">
        <MascotSay>Klikni na hráče a táhni ho! Vyzkoušej, jak vypadají různé formace, a postav si vlastní.</MascotSay>
        <div className="card">
          <div className="display text-[22px]">{formation}</div>
          <p className="mt-1.5 text-navySoft text-[15px]">
            {formation === "4-4-2" && "Klasická univerzální formace. 4 obránci, 4 záložníci, 2 útočníci. Vyvážená a stabilní."}
            {formation === "4-3-3" && "Útočnější varianta. 3 útočníci s křídelními útočníky (LW, RW). Tlak vysoko, hodně gólů."}
            {formation === "3-5-2" && "5 záložníků s krajními (LWB/RWB), kteří běhají sem a tam. Hodně kreativní, ale náročná."}
          </p>
          <div className="pill-row mt-3.5">
            <span className="pill green">{players.filter(p => p.role === "GK").length} brankář</span>
            <span className="pill orange">{players.filter(p => ["LB","RB","CB"].includes(p.role)).length} obránců</span>
            <span className="pill navy">{players.filter(p => ["LM","RM","CM","CDM","LWB","RWB"].includes(p.role)).length} záložníků</span>
            <span className="pill">{players.filter(p => ["ST","LW","RW"].includes(p.role)).length} útočníků</span>
          </div>
        </div>
        <div className="card">
          <div className="display text-lg">Zkratky pozic</div>
          <div className="grid grid-cols-2 gap-1.5 mt-2 text-sm">
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

export default StratFormations;
