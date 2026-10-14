import { useEffect } from "react";
import { PAGES } from "../lib/nav.js";

/* Ochrana osobních údajů (GDPR čl. 13). Při přidání služby třetí strany nebo nového úložiště v prohlížeči
   (viz Consent.jsx, voice.js, Video.jsx) aktualizujte i tuhle stránku. */
const MAIL = "robinbortlik@gmail.com";

export function PrivacyPage() {
  useEffect(() => {
    document.title = PAGES["/ochrana-soukromi"].title;
  }, []);
  return (
    <div className="page doc">
      <h1>Ochrana osobních údajů</h1>
      <p className="lead">Bez vašeho souhlasu nic neměříme. Se souhlasem počítáme návštěvy přes Google Analytics. Registrace ani reklamy tu nejsou.</p>

      <section>
        <h2>Kdo údaje spravuje</h2>
        <p>
          Robin Bortlik, e-mail <a href={`mailto:${MAIL}`}>{MAIL}</a>. Sem pište dotazy i žádosti k osobním údajům.
        </p>
      </section>

      <section>
        <h2>Bez souhlasu</h2>
        <ul>
          <li>
            Web běží na hostingu Cloudflare. Ten při doručení stránky zpracuje vaši IP adresu a údaje o prohlížeči, aby web fungoval a byl chráněný před
            útoky (oprávněný zájem, čl. 6 odst. 1 písm. f) GDPR).
          </li>
          <li>
            Prohlížeč si pamatuje jen vaše nastavení: zapnutý hlas, kategorii přípravky (U8–U9 / U10–U11), volbu u statistik, které situace dítě už vidělo a jestli jsme už nabídli instalaci.
            Aby web fungoval i bez internetu, uloží si prohlížeč jeho soubory; nainstalovaná aplikace navíc nahrávky Kopíkova hlasu (asi 13 MB).
            Všechno zůstává ve vašem zařízení a nikam se neposílá.
          </li>
          <li>
            Videa z YouTube se načtou až po kliknutí na ně (z adresy youtube-nocookie.com). Pak platí{" "}
            <a href="https://policies.google.com/privacy?hl=cs" target="_blank" rel="noreferrer">
              zásady ochrany soukromí Googlu
            </a>
            .
          </li>
        </ul>
      </section>

      <section>
        <h2>Statistiky návštěv (jen se souhlasem)</h2>
        <ul>
          <li>
            <b>Co:</b> po kliknutí na „Povolit“ se načte Google Analytics. Uloží do prohlížeče cookies (<code>_ga</code>, <code>_ga_T1RYP3MGRD</code>) s
            náhodným identifikátorem a měří, které stránky a situace se otevírají, na jakém zařízení a přibližně odkud (země, město). IP adresu Google
            Analytics neukládá.
          </li>
          <li>
            <b>Proč:</b> abychom věděli, kolik lidí web používá a co jim pomáhá, a mohli ho zlepšovat. Reklamní funkce jsou vypnuté.
          </li>
          <li>
            <b>Právní základ:</b> váš souhlas (čl. 6 odst. 1 písm. a) GDPR a § 89 odst. 3 zákona č. 127/2005 Sb., o elektronických komunikacích).
          </li>
          <li>
            <b>Kdo data zpracovává:</b> Google Ireland Limited. Data se mohou dostat i ke Google LLC do USA, která je certifikovaná podle rámce EU–USA pro
            ochranu osobních údajů (Data Privacy Framework).
          </li>
          <li>
            <b>Jak dlouho:</b> cookies vydrží až 2 roky od poslední návštěvy. Podrobná data Google Analytics maže po 2 měsících, zůstávají jen souhrnné počty
            (např. návštěvy za měsíc).
          </li>
          <li>
            <b>Odvolání:</b> kdykoli odkazem <i>Nastavení cookies</i> dole na stránce. Cookies Google Analytics tím smažeme a měření se zastaví.
          </li>
        </ul>
        <p className="note">Web je pro děti. O souhlasu se statistikami by měl rozhodnout rodič nebo trenér.</p>
      </section>

      <section>
        <h2>Vaše práva</h2>
        <p>
          Máte právo na přístup k údajům, jejich opravu, výmaz, omezení zpracování a přenositelnost, a právo vznést námitku. Odvolání souhlasu neovlivní
          zpracování před ním. Napište na <a href={`mailto:${MAIL}`}>{MAIL}</a>. Statistiky obsahují jen náhodný identifikátor, podle kterého vás většinou
          nepoznáme, proto je nejjednodušší souhlas odvolat. Stížnost můžete podat{" "}
          <a href="https://uoou.gov.cz/" target="_blank" rel="noreferrer">
            Úřadu pro ochranu osobních údajů
          </a>
          .
        </p>
        <p className="note">Platné od 13. 10. 2026.</p>
      </section>
    </div>
  );
}

export default PrivacyPage;
