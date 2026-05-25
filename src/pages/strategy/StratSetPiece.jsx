import { Link } from "react-router-dom";
import { PitchSVG, Player, Ball, Arrow, MascotSay } from "../../components";

/* --- Set piece strategy --- */
export function StratSetPiece() {
  return (
    <div className="hero-grid grid grid-cols-1 md:grid-cols-hero gap-5 md:gap-6">
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
      <div className="flex flex-col gap-3.5">
        <MascotSay>Standardní situace = připravená šance! Roh, volný kop, aut — to jsou momenty, kdy máš čas si všechno rozmyslet.</MascotSay>
        <div className="text-[13px] text-navySoft">
          Pravidla rohu, autu a volného kopu najdeš v kapitole{" "}
          <Link to="/pravidla?rule=set" className="underline font-bold">Pravidla / Standardní situace</Link>.
        </div>
        <div className="card">
          <div className="display text-[22px]">Rohový kop: 3 typy náběhů</div>
          <ul className="pl-5 leading-loose mt-1.5">
            <li><b>Přední tyč</b> — krátký náběh dopředu</li>
            <li><b>Zadní tyč</b> — náběh za obránce</li>
            <li><b>Penalta bod</b> — náběh do středu</li>
          </ul>
        </div>
        <div className="card orange">
          <b>Trenérská rada:</b> Vždy mějte alespoň 3 spoluhráče v pokutovém území. Jeden na přední tyč, dva na zadní. Pomate to obránce! (Není to oficiální pravidlo, je to taktický tip.)
        </div>
      </div>
    </div>
  );
}

export default StratSetPiece;
