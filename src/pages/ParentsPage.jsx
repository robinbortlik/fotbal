import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Icon } from "../components/Icons.jsx";
import { Video } from "../components/Video.jsx";
import { VIDEOS } from "../scenes/videos.js";
import { PAGES, BOOK } from "../lib/nav.js";

/* Pro rodiče a trenéry — jediná „textová“ stránka webu. Pravidla podle FAČR
   (Pravidla fotbalu malých forem 2023, Soutěžní řád), ověřeno 10/2026. */
export const RULES = [
  ["Hráči", "5 v poli + brankář (nejméně 4 + 1)"],
  ["Hřiště", "43–45 × 28–30 m (doporučen větší rozměr)"],
  ["Branky", "5 × 2 m, se sítí, zajištěné proti převržení"],
  ["Pokutové území", "pruh 5,5 m od brankové čáry přes celou šířku"],
  ["Pokutový kop", "ze 7 m"],
  ["Míč", "velikost 4"],
  ["Hrací doba", "FAČR doporučuje 4 × 20 min; v okresech a krajích často 2 × 25 nebo 2 × 30 min (viz rozpis soutěže)"],
  ["Střídání", "hokejové — kdykoli a opakovaně, v prostoru střídaček"],
  ["Ofsajd", "neplatí"],
  ["Výkop", "soupeř 2 m od míče; míč je ve hře, jakmile se pohne; přímo z výkopu nelze dát gól"],
  ["Kop od branky", "brankář kope ze země, jen nohou, jedním dotekem a míč v PÚ nevede; soupeř stojí mimo PÚ a napadat smí až po prvním doteku spoluhráče"],
  ["Přes půlku", "míč kopnutý z PÚ (i výkop z ruky) nesmí přeletět půlicí čáru bez dotyku země nebo hráče — jinak nepřímý volný kop z půlicí čáry; rukou smí brankář rozehrát kamkoli"],
  ["Malá domů", "zakázaná — brankář nesmí chytit do rukou přihrávku nohou od spoluhráče (nepřímý volný kop z hranice PÚ)"],
  ["Aut", "vhazuje se rukama, soupeř aspoň 2 m; přímo z autu gól neplatí"],
  ["Volné kopy", "na vlastní polovině a na půlicí čáře nepřímé, na polovině soupeře přímé; soupeř 5 m"],
  ["Roh", "soupeř aspoň 5 m od míče"],
  ["Tresty", "surová hra = vyloučení na 2 min, tým hráče nahradí a hraje v plném počtu"],
  ["Výsledky", "zapisují se, ale tabulky přípravek se nevedou ani nezveřejňují"],
];

export const YOUNGER = [
  "hraje 4 + 1 na hřišti 35–37 × 24–26 m, branky 5 × 2 nebo 3 × 2 m, míč velikosti 3",
  "aut se smí vhodit rukama, přihrát nohou, nebo vyvést vedením",
  "brankář smí s míčem vyjet a „malá domů“ je povolená",
  "doporučená hrací doba 4 × 15 min",
];

export const SLOGANS = [
  ["Útok (máme míč)", ["Máme míč? Roztáhni se!", "Ukaž se, ať ti přihrají!", "Veď míč tam, kde nikdo není.", "Klička – a zrychli!", "Před střelou koukni na bránu.", "Po střele dobíhej!"]],
  ["Obrana (nemáme míč)", ["Nemáme míč? Bráníme všichni!", "Mezi soupeře a naši bránu!", "Nejbližší jde na míč.", "Kamarád jde na míč? Jisti ho zezadu.", "Bokem – vytlač ho ke straně.", "Míč vezmi, ne jen odkopni."]],
  ["Přepnutí", ["Ztráta? Hned zpátky pro míč!", "Získali jsme míč? Hned na bránu!", "Nejde to dopředu? Podrž míč."]],
  ["Brankář", ["Stůj mezi míčem a středem brány.", "Ruce do W!", "Nízký míč? Košíček!", "Křič včas a nahlas!", "I brankář hraje nohama."]],
  ["Fair play", ["Po zápase podej ruku.", "Chyba? Nevadí, hraj dál!", "Rodiče fandí, ale nekoučují."]],
];

export const SOURCES = [
  ["FAČR: Pravidla fotbalu malých forem — starší přípravka 5+1 (2023)", "https://facr.fotbal.cz/document/download/120826"],
  ["FAČR: Pravidla fotbalu malých forem — mladší přípravka 4+1 (2023)", "https://facr.fotbal.cz/document/download/120823"],
  ["FAČR: Pravidla fotbalu (rozcestník)", "https://www.fotbal.cz/trenink/pravidla-fotbalu/p460"],
  ["FAČR: Pravidla fotbalu malých forem U6 až U13 (článek, 2023)", "https://www.fotbal.cz/souteze/pravidla-fotbalu-malych-forem-u6-az-u13/a18640"],
  ["FAČR: Soutěžní řád od 1. 7. 2025", "https://www.fotbal.cz/facr/document/download/155706"],
  ["FAČR: Pravidla malých forem a pedagogicko-organizační manuál (2016)", "https://hop.rvp.cz/filemanager/userfiles/Metodika/Fotbal_doporucena_literatura/Pravidla_fotbalu_malych_forem_2016.pdf"],
  ["OFS Zlín / UČFT: Tréninková příručka pro mladší přípravku (2025)", "https://www.ofszlin.cz/wp-content/uploads/2025/07/Treninkova-prirucka-kategorie-MLADSI-PRIPRAVKA.pdf"],
  ["FAČR: Metodika — mladší přípravka U8–U9", "https://www.fotbal.cz/trenink/mladsi-pripravka-u8-u9/p535"],
  ["US Soccer: herní model U7–U10", "https://www.ussoccer.com/us-way/player-development/game/game-models/u9-u10"],
  ["England Football: How to coach goalkeepers", "https://learn.englandfootball.com/articles-and-resources/coaching/resources/2023/How-to-coach-goalkeepers"],
];

export function ParentsPage() {
  useEffect(() => {
    document.title = PAGES["/pro-rodice"].title;
  }, []);
  return (
    <div className="page doc">
      <h1>Pro rodiče a trenéry</h1>
      <p className="lead">Web je pro děti z přípravky (5–10 let). Všechno ukazuje na hře 5 + 1, jak ji hraje starší přípravka podle pravidel FAČR.</p>

      <section>
        <h2>Kniha k vytištění</h2>
        <p>
          Celý web na papíře: každá situace jako komiks krok za krokem (Takhle ano / Takhle ne), kvíz, pravidla v kostce,
          hesla na trénink a diplom. Na tisk doma i na trénink (PDF, A4 na šířku).
        </p>
        <a {...BOOK} className="btn go">
          <Icon name="install" /> Stáhnout knihu
        </a>
      </section>

      <section>
        <h2>Jak web používat s dětmi</h2>
        <ol className="howto">
          <li>
            <b>Pusťte jednu situaci.</b> Žádné čtení navíc — Kopík titulky sám přečte a vysvětlí proč (hlas vypnete tlačítkem <i>Čtu nahlas</i>).
          </li>
          <li>
            <b>Zeptejte se: „Co vidíš?“</b> Nechte dítě říct, kdo má míč a kam kdo běží. Po správné variantě se sama pustí <i>Takhle ne</i> — porovnejte je.
          </li>
          <li>
            <b>Jedna věc na trénink.</b> Vyberte jedno heslo a zkuste ho venku v malé hře 2:2 až 5:5. Chvalte snahu, ne jen výsledek.
          </li>
        </ol>
        <p className="note">
          Každou situaci můžete poslat odkazem — adresa obsahuje i vybranou situaci. Pod každou animací je rozbalovací vysvětlení „Pro rodiče a trenéry“ s přesným pravidlem.
        </p>
      </section>

      <section>
        <h2>Pravidla 5 + 1 v kostce</h2>
        <table className="rules">
          <tbody>
            {RULES.map(([k, v]) => (
              <tr key={k}>
                <th scope="row">{k}</th>
                <td>{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="note">
          Délka zápasu a organizace se liší podle okresu a kraje — rozhoduje rozpis soutěží vašeho OFS / KFS. Některé okresy ještě používají starší zjednodušená pravidla (např. hřiště 42 × 27 m).
        </p>
      </section>

      <section>
        <h2>Mladší přípravka (U8–U9) hraje 4 + 1</h2>
        <ul>
          {YOUNGER.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </section>

      <section className="slogans">
        <div className="slogans-head">
          <h2>Hesla na trénink</h2>
          <button className="btn" onClick={() => window.print()}>
            Vytisknout
          </button>
        </div>
        <div className="slogan-grid">
          {SLOGANS.map(([title, items]) => (
            <div key={title} className="slogan-card">
              <h3>{title}</h3>
              <ul>
                {items.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="note">
          Podle metodiky FAČR a UČFT: krátké pokyny, jedna věc najednou, otázky místo povelů, děti mají právo na chybu. Pozice je dobré střídat a v bráně si má zkusit chytat každý. Základní rozestavení pro 5 + 1 je podle FAČR 2-1-2.
        </p>
      </section>

      <section>
        <h2>Videa pro rodiče a trenéry</h2>
        <div className="video-grid">
          {VIDEOS.rodice.map((v) => (
            <Video key={v.id} v={v} />
          ))}
        </div>
        <p className="note">
          Ke každému tématu najdete dole na stránce i videa pro děti (česká hlavně o technice a brankářích). Video se načte až po kliknutí, přes youtube-nocookie.com.
        </p>
      </section>

      <section>
        <h2>Zdroje</h2>
        <ul className="sources">
          {SOURCES.map(([t, u]) => (
            <li key={u}>
              <a href={u} target="_blank" rel="noreferrer">
                {t}
              </a>
            </li>
          ))}
        </ul>
        <p className="note">
          Ověřeno v říjnu 2026. Dokumenty FAČR se někdy otevřou až v běžném prohlížeči. Fotografie brankáře jsou
          ilustrační, vytvořené pomocí AI (Google Gemini); hlas Kopíka je syntetický (ElevenLabs).
        </p>
      </section>

      <Link to="/" className="btn go">
        <Icon name="attack" /> Zpátky na hřiště
      </Link>
    </div>
  );
}

export default ParentsPage;
