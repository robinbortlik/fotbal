import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { Consent, statsChoice, trackPage } from "../components/Consent.jsx";
import { Kopik } from "../components/Kopik.jsx";
import { Icon } from "../components/Icons.jsx";
import { TweaksPanel, TweakSection, TweakToggle } from "../components/tweaks";
import { useTweaks } from "../hooks/useTweaks.jsx";
import { useVoice } from "../lib/voice.js";
import { NAV } from "../lib/nav.js";

/* Společný rám: horní lišta (na mobilu menu dole), obsah, patička, panel Tweaks
   (protokol s hostitelským iframem — viz CLAUDE.md, neměnit). */
export default function RootLayout() {
  const { pathname, search } = useLocation();
  const [tweaks, setTweak] = useTweaks();
  const voice = useVoice();
  const [consent, setConsent] = useState(() => statsChoice() == null); // ještě nevybral → lišta dole

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);
  useEffect(trackPage, [pathname, search]); // statistiky (jen se souhlasem)

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
        {voice.ready && (
          <button className="voice" aria-pressed={voice.on} onClick={voice.toggle}>
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
        <Link to="/pro-rodice" className="footer-link">
          Pro rodiče a trenéry: přehled pravidel a zdroje
        </Link>
        <button className="footer-link" onClick={() => setConsent(true)}>
          Nastavení cookies
        </button>
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
