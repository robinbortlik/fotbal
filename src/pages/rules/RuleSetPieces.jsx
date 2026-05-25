import { useState } from "react";
import { Link } from "react-router-dom";
import { PitchSVG, Player, Ball, Scrubber } from "../../components";
import { useTimeline } from "../../hooks/useTimeline.js";
import { interpAt } from "../../lib/pitchGeometry.js";
import { RuleShell } from "./RuleShell.jsx";

/* --- SET PIECES --- */
export function RuleSetPieces() {
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
          <div className="display text-xl">Vyber situaci</div>
          <div className="flex flex-col gap-2.5 mt-3">
            {Object.entries(configs).map(([k, v]) => (
              <button key={k} className={"step-chip " + (type === k ? "active" : "")} style={{ width: "100%", textAlign: "left" }} onClick={() => { setType(k); setTime(0); }}>{v.label}</button>
            ))}
          </div>
          <p className="mt-3.5 text-[15px] text-navySoft">{cfg.note}</p>
          {type === "corner" && (
            <Link to="/strategie?step=set-piece" className="pill orange text-[12px] mt-3 inline-block" style={{ textDecoration: "none" }}>
              Jak se na roh nabíhá? →
            </Link>
          )}
        </div>
      }
      pitchSlot={
        <div className="flex flex-col gap-4">
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

          <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
            <div className="card p-4" style={{ borderLeft: "8px solid var(--pitch)" }}>
              <div className="flex items-center gap-2.5">
                <span aria-hidden>
                  {/* Referee signal: direct FK — arm extended forward */}
                  <svg width="36" height="36" viewBox="0 0 36 36" aria-hidden>
                    <circle cx="18" cy="8" r="3.5" fill="#0B1F33"/>
                    <line x1="18" y1="11" x2="18" y2="22" stroke="#0B1F33" strokeWidth="3" strokeLinecap="round"/>
                    <line x1="18" y1="13" x2="32" y2="14" stroke="#F2A007" strokeWidth="3" strokeLinecap="round"/>
                    <line x1="14" y1="22" x2="13" y2="32" stroke="#0B1F33" strokeWidth="3" strokeLinecap="round"/>
                    <line x1="22" y1="22" x2="23" y2="32" stroke="#0B1F33" strokeWidth="3" strokeLinecap="round"/>
                  </svg>
                </span>
                <div className="display text-[18px]">Přímý volný kop</div>
              </div>
              <p className="mt-2 text-[14px] opacity-95">
                Z přímého volného kopu se dá vstřelit gól rovnou (bez doteku). Uděluje se po faulech: kop, podražení, držení, úmyslná ruka.
              </p>
              <p className="mt-1.5 text-[13px] text-navySoft">
                <b>Signál sudího:</b> ruka ukazuje směr kopu vpřed.
              </p>
            </div>
            <div className="card p-4" style={{ borderLeft: "8px solid var(--orange)" }}>
              <div className="flex items-center gap-2.5">
                <span aria-hidden>
                  {/* Referee signal: indirect FK — arm straight up */}
                  <svg width="36" height="36" viewBox="0 0 36 36" aria-hidden>
                    <circle cx="18" cy="8" r="3.5" fill="#0B1F33"/>
                    <line x1="18" y1="11" x2="18" y2="22" stroke="#0B1F33" strokeWidth="3" strokeLinecap="round"/>
                    <line x1="18" y1="11" x2="18" y2="1" stroke="#F2A007" strokeWidth="3" strokeLinecap="round"/>
                    <line x1="14" y1="22" x2="13" y2="32" stroke="#0B1F33" strokeWidth="3" strokeLinecap="round"/>
                    <line x1="22" y1="22" x2="23" y2="32" stroke="#0B1F33" strokeWidth="3" strokeLinecap="round"/>
                  </svg>
                </span>
                <div className="display text-[18px]">Nepřímý volný kop</div>
              </div>
              <p className="mt-2 text-[14px] opacity-95">
                Než se dá gól, musí se míče dotknout ještě někdo jiný. Uděluje se mj. po „malé domů", ofsajdu nebo nesportovním chování.
              </p>
              <p className="mt-1.5 text-[13px] text-navySoft">
                <b>Signál sudího:</b> ruka rovně nahoru, dokud se míče nedotkne další hráč.
              </p>
            </div>
          </div>
        </div>
      }
    />
  );
}

export default RuleSetPieces;
