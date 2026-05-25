import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Mascot, BallIcon } from "../components";

/* Deep-link helpers — keep paths in one place to avoid drift. */
const LINK = {
  rule: (id) => ({ to: `/pravidla?rule=${id}`, label: "Více v Pravidlech →" }),
  step: (id) => ({ to: `/strategie?step=${id}`, label: "Více ve Strategii →" }),
  positions: { to: "/pozice", label: "Více v Pozicích →" },
  pitch: { to: "/hriste", label: "Více na Hřišti →" },
};

const GLOSSARY = [
  { term: "Aut", cat: "Pravidla", def: "Když míč přejde celou postranní čáru. Hází se zpátky do hřiště rukama nad hlavou.", seeAlso: LINK.rule("set") },
  { term: "Asistence", cat: "Hra", def: "Přihrávka, po které spoluhráč hned vstřelí gól. Skoro tak důležitá jako gól sám." },
  { term: "Brankář", cat: "Pozice", def: "Jediný hráč, který smí ve vápně chytat rukama. Hlídá branku.", seeAlso: LINK.positions },
  { term: "Centr", cat: "Hra", def: "Přihrávka z křídla doprostřed pokutového území — obvykle vzduchem na hlavu útočníkovi.", seeAlso: LINK.step("passing") },
  { term: "Červená karta", cat: "Pravidla", def: "Hráč musí okamžitě opustit hřiště. Tým hraje v deseti. Dostane ji za hrubý faul nebo druhou žlutou.", seeAlso: LINK.rule("fouls") },
  { term: "Faul", cat: "Pravidla", def: "Porušení pravidel — strkání, podražení, držení, kop do soupeře. Trestá se volným kopem.", seeAlso: LINK.rule("fouls") },
  { term: "Formace", cat: "Strategie", def: "Rozestavení hráčů na hřišti, např. 4-4-2 nebo 4-3-3. Čísla říkají, kolik je obránců / záložníků / útočníků.", seeAlso: LINK.step("formations") },
  { term: "Gól", cat: "Hra", def: "Když celý míč přejde za brankovou čáru mezi tyčemi a pod břevnem. Cíl hry!", seeAlso: LINK.rule("goal") },
  { term: "Hattrick", cat: "Hra", def: "Tři góly jednoho hráče v jednom zápase. Velký úspěch!" },
  { term: "Kapitán", cat: "Hra", def: "Vůdce týmu na hřišti. Nosí pásku na ruce a má slovo se sudím." },
  { term: "Kop od branky", cat: "Pravidla", def: "Brankář kope míč z malého vápna, když ho soupeř vykopne přes brankovou čáru.", seeAlso: LINK.rule("set") },
  { term: "Lajna", cat: "Hra", def: "Slangově postranní čára nebo asistent rozhodčího (lajnsmen)." },
  { term: "Mantinel", cat: "Strategie", def: "Zóna u postranní čáry, kde se často hraje krajní záloha." },
  { term: "Nastavený čas", cat: "Pravidla", def: "Minuty navíc na konci poločasu, kdy se nahrazuje čas ztracený zraněními a střídáním." },
  { term: "Ofsajd", cat: "Pravidla", def: "Útočník stojí blíž k bráně soupeře než předposlední soupeř v okamžiku přihrávky. Píská se ofsajd.", seeAlso: LINK.rule("offside") },
  { term: "Penalta", cat: "Pravidla", def: "Kop z 11 metrů. Souboj střelec vs. brankář. Trest za faul v pokutovém území.", seeAlso: LINK.rule("penalty") },
  { term: "Poločas", cat: "Pravidla", def: "Přestávka mezi dvěma 45minutovými poločasy zápasu. Trvá 15 minut.", seeAlso: LINK.rule("basics") },
  { term: "Pressing", cat: "Strategie", def: "Když celý tým útočí na hráče s míčem a snaží se mu míč vzít co nejvýš na hřišti.", seeAlso: LINK.step("attack-defense") },
  { term: "Přihrávka", cat: "Hra", def: "Posílání míče spoluhráči. Krátké, dlouhé, průnikové, centry — typů je hodně.", seeAlso: LINK.step("passing") },
  { term: "Roh", cat: "Pravidla", def: "Kop z rohové značky. Kope se, když obránce vykopne míč přes vlastní brankovou čáru.", seeAlso: LINK.rule("set") },
  { term: "Sólo", cat: "Hra", def: "Když si hráč veze míč sám přes hřiště a obchází protihráče." },
  { term: "Sudí", cat: "Pravidla", def: "Hlavní rozhodčí. Má píšťalku, ukazuje karty, kontroluje čas.", seeAlso: LINK.rule("ref") },
  { term: "Standardní situace", cat: "Strategie", def: "Roh, volný kop, aut, penalta. Hra začíná znovu z přerušení.", seeAlso: LINK.step("set-piece") },
  { term: "Stoper", cat: "Pozice", def: "Střední obránce. Bere míč útočníkům, hraje hlavou ve vzdušných soubojích.", seeAlso: LINK.positions },
  { term: "Střídání", cat: "Pravidla", def: "Výměna hráče během zápasu. Obvykle 5 střídání (u mládeže často neomezeně).", seeAlso: LINK.rule("youth") },
  { term: "Tlak", cat: "Strategie", def: "Když tým drží míč hluboko v polovině soupeře a útočí jeden útok za druhým.", seeAlso: LINK.step("attack-defense") },
  { term: "Trefa", cat: "Hra", def: "Slangový výraz pro pěknou střelu nebo gól." },
  { term: "Útočník", cat: "Pozice", def: "Hráč, který je nejvíc vepředu a má dávat góly.", seeAlso: LINK.positions },
  { term: "VAR", cat: "Pravidla", def: "Video Assistant Referee. V profi fotbale sleduje záznam a pomáhá sudímu při zásadních situacích.", seeAlso: LINK.rule("ref") },
  { term: "Vápno", cat: "Hřiště", def: "Lidově pokutové území — velký obdélník před brankou. Tady chytá brankář rukama.", seeAlso: LINK.pitch },
  { term: "Volný kop", cat: "Pravidla", def: "Kop po faulu, mimo pokutové území. Přímý (může do branky) nebo nepřímý.", seeAlso: LINK.rule("set") },
  { term: "Výkop", cat: "Pravidla", def: "Začátek zápasu, poločasu nebo hry po vstřeleném gólu — ze středového kruhu.", seeAlso: LINK.rule("basics") },
  { term: "Záloha", cat: "Pozice", def: "Pozice mezi obranou a útokem. Záložníci nejvíc běhají a tvoří hru.", seeAlso: LINK.positions },
  { term: "Žlutá karta", cat: "Pravidla", def: "Varování pro hráče. Druhá žlutá v zápase = červená a hráč musí pryč.", seeAlso: LINK.rule("fouls") },
];

export function GlossaryPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("Vše");
  const cats = ["Vše", "Pravidla", "Strategie", "Pozice", "Hra", "Hřiště"];
  const filtered = useMemo(() => {
    return GLOSSARY.filter(g => {
      if (cat !== "Vše" && g.cat !== cat) return false;
      if (q && !(g.term.toLowerCase().includes(q.toLowerCase()) || g.def.toLowerCase().includes(q.toLowerCase()))) return false;
      return true;
    }).sort((a,b) => a.term.localeCompare(b.term, "cs"));
  }, [q, cat]);

  return (
    <div className="page">
      <span className="eyebrow green"><BallIcon size={14}/> Kapitola 7</span>
      <h1>Slovníček fotbalových pojmů</h1>
      <p className="lead">{GLOSSARY.length} pojmů, které možná uslyšíš na hřišti, v televizi nebo u táty na gauči. Hledej a uč se!</p>

      <div className="divider"/>

      <div className="grid grid-cols-1 gap-4 max-w-[800px]">
        <input type="text" className="glossary-search" placeholder="Hledej pojem (např. 'ofsajd')…" value={q} onChange={(e) => setQ(e.target.value)}/>
        <div className="pill-row">
          {cats.map(c => (
            <button key={c} className={"step-chip " + (cat === c ? "active" : "")} onClick={() => setCat(c)}>{c}</button>
          ))}
        </div>
      </div>

      <div className="mt-6 text-navySoft text-sm">{filtered.length} {filtered.length === 1 ? "pojem" : filtered.length < 5 ? "pojmy" : "pojmů"}</div>

      <div
        className="glossary-grid grid gap-3.5 mt-3.5"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}
      >
        {filtered.map((g, i) => (
          <div key={i} className="glossary-item">
            <div className="flex justify-between items-baseline gap-2">
              <div className="glossary-term">{g.term}</div>
              <span className="pill text-[11px]">{g.cat}</span>
            </div>
            <p className="mt-1 text-[15px] text-navySoft">{g.def}</p>
            {g.seeAlso && (
              <Link
                to={g.seeAlso.to}
                className="pill orange text-[12px] mt-2.5 inline-block"
                style={{ textDecoration: "none" }}
              >
                {g.seeAlso.label}
              </Link>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="card text-center p-10" style={{ gridColumn: "1 / -1" }}>
            <Mascot size={60} mood="wink"/>
            <p className="mt-3 font-bold">Nic jsem nenašel. Zkus jiné slovíčko!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default GlossaryPage;
