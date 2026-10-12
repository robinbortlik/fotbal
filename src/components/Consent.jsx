/* Statistiky návštěv (Google Analytics) jen se souhlasem: gtag.js se načte až po „Povolit“
   (analytické cookies potřebují v ČR předchozí souhlas). Volba je v localStorage fotbal:stats ("1" | "0"),
   změnit ji jde v patičce („Nastavení cookies“). */
const GA = "G-T1RYP3MGRD";
const KEY = "fotbal:stats";

export function statsChoice() {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null; // zakázané úložiště → lišta se ukáže při každé návštěvě
  }
}
let on = statsChoice() === "1";

/* Zobrazení stránky. Web má adresy za # (HashRouter), GA by je ořízl na „/“ → posíláme /utok?s=… */
export function trackPage() {
  if (on) window.gtag?.("event", "page_view", { page_location: location.origin + "/" + location.hash.replace(/^#\/?/, "") });
}

function load() {
  if (window.gtag) return;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () {
    window.dataLayer.push(arguments); // gtag.js chce objekt arguments, ne pole
  };
  window.gtag("js", new Date());
  // stránky posílá trackPage (RootLayout při každé změně adresy); web pro děti: žádné reklamní signály
  window.gtag("config", GA, { send_page_view: false, allow_google_signals: false, allow_ad_personalization_signals: false });
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA}`;
  document.head.appendChild(s);
}

function choose(ok) {
  try {
    localStorage.setItem(KEY, ok ? "1" : "0");
  } catch {
    /* jen pro tuto návštěvu */
  }
  on = ok;
  window[`ga-disable-${GA}`] = !ok;
  if (ok) {
    load();
    return trackPage();
  }
  // odvolání souhlasu: smazat cookies _ga* (GA je dává na nejvyšší možnou doménu)
  const host = location.hostname.split(".");
  for (const c of document.cookie.split("; ")) {
    const name = c.split("=")[0];
    if (!name.startsWith("_ga")) continue;
    document.cookie = `${name}=; Max-Age=0; path=/`;
    for (let i = 0; i < host.length - 1; i++) document.cookie = `${name}=; Max-Age=0; path=/; domain=.${host.slice(i).join(".")}`;
  }
}

if (on) load();

export function Consent({ onClose }) {
  const pick = (ok) => {
    choose(ok);
    onClose();
  };
  return (
    <section className="consent" aria-label="Souhlas se statistikami">
      <p>Smíme počítat návštěvy? Pomůže nám to web vylepšovat. Používáme Google Analytics, které ukládá cookies.</p>
      <div className="consent-btns">
        <button className="btn" onClick={() => pick(true)}>
          Povolit
        </button>
        <button className="btn" onClick={() => pick(false)}>
          Nepovolit
        </button>
      </div>
    </section>
  );
}
