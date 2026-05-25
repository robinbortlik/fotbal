import { Link } from "react-router-dom";
import { PitchSVG, Player, Ball } from "../../components";
import { RuleShell } from "./RuleShell.jsx";

/* --- BASICS --- */
export function RuleBasics() {
  return (
    <RuleShell
      kicker="01 / Základy"
      title="Jak vlastně fotbal funguje?"
      lead="Dva týmy. Jeden míč. Kdo dá víc gólů, vyhrává."
      mascotText="Fotbal hrají dva týmy proti sobě. V každém týmu je 11 hráčů, jeden z nich je brankář. Cílem je dostat míč do soupeřovy branky — nohou, hlavou nebo jakoukoli částí těla kromě rukou (brankář ve vápně může rukama)."
      sideSlot={
        <div className="flex flex-col gap-3.5">
          <div className="card">
            <div className="display text-[22px]">Rychlofakta</div>
            <ul className="pl-4.5 leading-loose mt-2">
              <li><b>11 hráčů</b> v týmu (1 brankář + 10 v poli)</li>
              <li><b>2 × 45 minut</b> (poločas 15 minut)</li>
              <li><b>Obvykle 5 střídání</b> za zápas (u mládeže často neomezeně)</li>
              <li><b>Sudí</b> řídí zápas, má 2 asistenty na čárách</li>
              <li><b>Žluté/červené karty</b> trestají fauly</li>
            </ul>
            <Link to="/pravidla?rule=youth" className="pill orange text-[12px] mt-3 inline-block" style={{ textDecoration: "none" }}>
              Co platí v přípravce? →
            </Link>
          </div>
          <div className="card" style={{ borderLeft: "8px solid var(--pitch)" }}>
            <div className="display text-[18px]">Vybavení a míč</div>
            <ul className="pl-4.5 leading-relaxed mt-2 text-[14px]">
              <li>Dres, trenýrky a štulpny</li>
              <li><b>Chrániče holení</b> — povinné, schované pod štulpnami</li>
              <li>Kopačky (lisovky na umělou trávu, kolíky na mokrou trávu)</li>
              <li><b>Bez šperků a hodinek</b> — kvůli bezpečnosti</li>
              <li>Velikost míče podle věku: <b>3</b> (U6–U9), <b>4</b> (U10–U13), <b>5</b> (od U14 / starší žáci)</li>
            </ul>
          </div>
          <div className="card" style={{ borderLeft: "8px solid var(--orange)" }}>
            <div className="display text-[18px]">Výkop</div>
            <p className="mt-1.5 text-[14px] opacity-95">
              Zápas, druhý poločas i hra po gólu začíná <b>výkopem ze středového kruhu</b>. Soupeři musí být <b>mimo kruh</b>. Od roku 2016 se může kopnout jakýmkoli směrem (dřív se muselo dopředu).
            </p>
          </div>
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
          <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2">
            <div className="pill-row">
              <span className="pill orange">Domácí ⬤</span>
              <span className="pill navy">Hosté ⬤</span>
              <span className="pill green">Brankář ⬤</span>
            </div>
            <span className="text-[13px] text-navySoft">Rozestavení před výkopem</span>
          </div>
        </div>
      }
    />
  );
}

export default RuleBasics;
