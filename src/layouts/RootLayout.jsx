import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { Consent, statsChoice } from "../components/Consent.jsx";
import { Kopik } from "../components/Kopik.jsx";
import { Icon } from "../components/Icons.jsx";
import { TweaksPanel, TweakSection, TweakToggle } from "../components/tweaks";
import { useTweaks } from "../hooks/useTweaks.jsx";
import { useVoice } from "../lib/voice.js";
import { showInstall, useCanInstall } from "../lib/install.js";
import { NAV, BOOK } from "../lib/nav.js";

/* Společný rám: horní lišta (na mobilu menu dole), obsah, patička, panel Tweaks
   (protokol s hostitelským iframem — viz CLAUDE.md, neměnit). */
export default function RootLayout() {
  const { pathname } = useLocation();
  const page = pathname.split("/")[1]; // /utok/roztahni-se → utok
  const [tweaks, setTweak] = useTweaks();
  const voice = useVoice();
  const [consent, setConsent] = useState(() => statsChoice() == null); // ještě nevybral → lišta dole
  const canInstall = useCanInstall();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" }); // jiná stránka → nahoru; jiná situace téhož tématu ne
  }, [page]);

  return (
    <div className="app" data-contrast={tweaks.highContrast ? "high" : "normal"}>
      <header className="topbar">
        <Link to="/" className="brand" aria-label="Fotbalové ABC – úvod">
          <Kopik size={44} />
          <span>Fotbalové ABC</span>
        </Link>
        <nav className="nav" aria-label="Hlavní menu">
          {NAV.map((n) => (
            <NavLink key={n.id} to={n.path} className="nav-link">
              <Icon name={n.icon} size={26} />
              <span>{n.label}</span>
            </NavLink>
          ))}
        </nav>
        {canInstall && (
          <button className="install-app" onClick={showInstall} title="Nainstalovat jako aplikaci">
            <Icon name="install" size={22} />
            <span>Nainstalovat</span>
          </button>
        )}
        {voice.ready && (
          <button className="voice" aria-pressed={voice.on} onClick={voice.toggle} title="Číst nahlas">
            <Icon name="speaker" size={22} />
            <span>{voice.on ? "Čtu nahlas" : "Číst nahlas"}</span>
          </button>
        )}
      </header>

      <main className="main">
        <Outlet />
      </main>

      <footer className="footer">
        <p>
          Fotbalové ABC je pro děti z přípravky a jejich rodiče a trenéry. Hrajeme podle pravidel FAČR
          pro přípravku (5 + 1).
        </p>
        <div className="footer-links">
          <Link to="/pro-rodice" className="footer-link">
            Pro rodiče a trenéry: přehled pravidel a zdroje
          </Link>
          <a {...BOOK} className="footer-link">
            Kniha k vytištění (PDF)
          </a>
          <Link to="/ochrana-soukromi" className="footer-link">
            Ochrana osobních údajů
          </Link>
          <button className="footer-link" onClick={() => setConsent(true)}>
            Nastavení cookies
          </button>
          {canInstall && (
            <button className="footer-link" onClick={showInstall}>
              Nainstalovat jako aplikaci
            </button>
          )}
        </div>
      </footer>
      {consent && <Consent onClose={() => setConsent(false)} />}

      <TweaksPanel title="Tweaks">
        <TweakSection label="Zobrazení">
          <TweakToggle
            label="Vysoký kontrast"
            value={tweaks.highContrast}
            onChange={(v) => setTweak("highContrast", v)}
          />
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}
