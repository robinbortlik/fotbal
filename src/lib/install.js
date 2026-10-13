import { useEffect, useState } from "react";
import { statsChoice } from "../components/Consent.jsx";

/* Instalace na plochu (PWA). Dialog je open source <pwa-install> (@khmyznikov/pwa-install, element v index.html):
   na Androidu a v Chromu nativní instalace, na iPhonu a Macu návod „Přidat na plochu / do Docku“.
   Knihovna (~45 kB) se načte až po načtení stránky; beforeinstallprompt chytáme hned, ať nepropadne.
   Sama se nabídne jen jednou (localStorage fotbal:install), a to až při další návštěvě na úvodní stránce:
   ne při první (tam je lišta se souhlasem) a ne uprostřed scény. Kdykoli jindy: odkaz v patičce. */
const KEY = "fotbal:install";
const el = () => document.querySelector("pwa-install");
const returning = statsChoice() != null; // lištu se souhlasem vyřešil už při minulé návštěvě

addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault(); // místo lišty prohlížeče náš dialog
  el().externalPromptEvent = e;
});

const ready = new Promise((ok) => (document.readyState === "complete" ? ok() : addEventListener("load", ok, { once: true })))
  .then(() => import("@khmyznikov/pwa-install"))
  .then(() => el().updateComplete);

const canInstall = () => {
  const e = el();
  return !e.isUnderStandaloneMode && !!(e.isInstallAvailable || e.isAppleMobilePlatform || e.isAppleDesktopPlatform || e.isAndroidFallback);
};

export const showInstall = () => el().showDialog();

function offer() {
  if (!returning || !canInstall() || location.pathname !== "/") return;
  try {
    if (localStorage.getItem(KEY)) return;
    localStorage.setItem(KEY, "1");
  } catch {
    return; // bez úložiště bychom otravovali při každé návštěvě
  }
  showInstall();
}
ready.then(() => {
  setTimeout(offer, 3000);
  el().addEventListener("pwa-install-available-event", () => setTimeout(offer, 3000));
});

/* Jde web na tomhle zařízení nainstalovat (a ještě není)? Pro odkaz v patičce. */
export function useCanInstall() {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    const check = () => setOk(canInstall());
    const events = ["pwa-install-available-event", "pwa-install-success-event"];
    ready.then(check);
    events.forEach((n) => el().addEventListener(n, check));
    return () => events.forEach((n) => el().removeEventListener(n, check));
  }, []);
  return ok;
}
