import { useMemo, useState } from "react";
import { Mascot, BallIcon } from "../components";

const GLOSSARY = [
  { term: "Aut", cat: "Pravidla", def: "Když míč přejde celou postranní čáru. Hází se zpátky do hřiště rukama nad hlavou." },
  { term: "Asistence", cat: "Hra", def: "Přihrávka, po které spoluhráč hned vstřelí gól. Skoro tak důležitá jako gól sám." },
  { term: "Brankář", cat: "Pozice", def: "Jediný hráč, který smí ve vápně chytat rukama. Hlídá branku." },
  { term: "Centr", cat: "Hra", def: "Přihrávka z křídla doprostřed pokutového území — obvykle vzduchem na hlavu útočníkovi." },
  { term: "Červená karta", cat: "Pravidla", def: "Hráč musí okamžitě opustit hřiště. Tým hraje v deseti. Dostane ji za hrubý faul nebo druhou žlutou." },
  { term: "Faul", cat: "Pravidla", def: "Porušení pravidel — strkání, podražení, držení, kop do soupeře. Trestá se volným kopem." },
  { term: "Formace", cat: "Strategie", def: "Rozestavení hráčů na hřišti, např. 4-4-2 nebo 4-3-3. Čísla říkají, kolik je obránců / záložníků / útočníků." },
  { term: "Gól", cat: "Hra", def: "Když celý míč přejde za brankovou čáru mezi tyčemi a pod břevnem. Cíl hry!" },
  { term: "Hattrick", cat: "Hra", def: "Tři góly jednoho hráče v jednom zápase. Velký úspěch!" },
  { term: "Kapitán", cat: "Hra", def: "Vůdce týmu na hřišti. Nosí pásku na ruce a má slovo se sudím." },
  { term: "Kop od branky", cat: "Pravidla", def: "Brankář kope míč z malého vápna, když ho soupeř vykopne přes brankovou čáru." },
  { term: "Lajna", cat: "Hra", def: "Slangově postranní čára nebo asistent rozhodčího (lajnsmen)." },
  { term: "Mantinel", cat: "Strategie", def: "Zóna u postranní čáry, kde se často hraje krajní záloha." },
  { term: "Nastavený čas", cat: "Pravidla", def: "Minuty navíc na konci poločasu, kdy se nahrazuje čas ztracený zraněními a střídáním." },
  { term: "Ofsajd", cat: "Pravidla", def: "Útočník stojí blíž k bráně soupeře než předposlední soupeř v okamžiku přihrávky. Píská se ofsajd." },
  { term: "Penalta", cat: "Pravidla", def: "Kop z 11 metrů. Souboj střelec vs. brankář. Trest za faul v pokutovém území." },
  { term: "Poločas", cat: "Pravidla", def: "Přestávka mezi dvěma 45minutovými poločasy zápasu. Trvá 15 minut." },
  { term: "Pressing", cat: "Strategie", def: "Když celý tým útočí na hráče s míčem a snaží se mu míč vzít co nejvýš na hřišti." },
  { term: "Přihrávka", cat: "Hra", def: "Posílání míče spoluhráči. Krátké, dlouhé, průnikové, centry — typů je hodně." },
  { term: "Roh", cat: "Pravidla", def: "Kop z rohové značky. Kope se, když obránce vykopne míč přes vlastní brankovou čáru." },
  { term: "Sólo", cat: "Hra", def: "Když si hráč veze míč sám přes hřiště a obchází protihráče." },
  { term: "Sudí", cat: "Pravidla", def: "Hlavní rozhodčí. Má píšťalku, ukazuje karty, kontroluje čas." },
  { term: "Standardní situace", cat: "Strategie", def: "Roh, volný kop, aut, penalta. Hra začíná znovu z přerušení." },
  { term: "Stoper", cat: "Pozice", def: "Střední obránce. Bere míč útočníkům, hraje hlavou ve vzdušných soubojích." },
  { term: "Střídání", cat: "Pravidla", def: "Výměna hráče během zápasu. Obvykle 3–5 střídání za zápas." },
  { term: "Tlak", cat: "Strategie", def: "Když tým drží míč hluboko v polovině soupeře a útočí jeden útok za druhým." },
  { term: "Trefa", cat: "Hra", def: "Slangový výraz pro pěknou střelu nebo gól." },
  { term: "Útočník", cat: "Pozice", def: "Hráč, který je nejvíc vepředu a má dávat góly." },
  { term: "VAR", cat: "Pravidla", def: "Video Assistant Referee. V profi fotbale sleduje záznam a pomáhá sudímu při zásadních situacích." },
  { term: "Vápno", cat: "Hřiště", def: "Lidově pokutové území — velký obdélník před brankou. Tady chytá brankář rukama." },
  { term: "Volný kop", cat: "Pravidla", def: "Kop po faulu, mimo pokutové území. Přímý (může do branky) nebo nepřímý." },
  { term: "Výkop", cat: "Pravidla", def: "Začátek zápasu, poločasu nebo hry po vstřeleném gólu — ze středového kruhu." },
  { term: "Záloha", cat: "Pozice", def: "Pozice mezi obranou a útokem. Záložníci nejvíc běhají a tvoří hru." },
  { term: "Žlutá karta", cat: "Pravidla", def: "Varování pro hráče. Druhá žlutá v zápase = červená a hráč musí pryč." },
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
      <span className="eyebrow green"><BallIcon size={14}/> Kapitola 5</span>
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
