import { useEffect, useRef } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { Mascot } from "../components";
import {
  TweaksPanel,
  TweakSection,
  TweakRadio,
  TweakToggle,
} from "../components/tweaks";
import { useTweaks } from "../hooks/useTweaks.jsx";
import { NAV } from "../lib/nav.js";

/* ── RootLayout ─────────────────────────────────────────────────────────────
   The persistent chrome shared by every route: topbar (brand + nav rail),
   <Outlet/>, footer, and the floating TweaksPanel. Ported from `main.jsx`'s
   <App/> render body — the imperative `nav()` setter is gone; navigation is
   now declarative via <NavLink> / <Link>.

   Class names with semantic meaning (.topbar, .nav, .nav-link, .brand,
   .brand-mark, .footer, .footer-grid, .hero-grid, .display, .btn.primary)
   are preserved verbatim because the surviving global CSS in
   `src/styles/index.css` targets them. Tailwind utility classes are added
   alongside for layout-level concerns only (flex, min-h-screen) so the
   ported visual matches the legacy app exactly. */
export default function RootLayout() {
  const { pathname } = useLocation();
  // useTweaks() returns a tuple `[values, setTweak]`. We pull both so the
  // tweaks panel below can write back through the same context-provided
  // setter that App.jsx installs.
  const [tweaks, setTweak] = useTweaks();
  const navRef = useRef(null);

  // Scroll to the top on every route change. `behavior: "instant"` matches
  // the legacy hashchange handler — react-router doesn't do this for us.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  // Bring the active chip into view on the mobile nav rail. The rail is
  // horizontally scrollable on narrow viewports; without this the user
  // wouldn't see the active page if it was off-screen.
  useEffect(() => {
    const active = navRef.current?.querySelector(".nav-link.active");
    if (active && typeof active.scrollIntoView === "function") {
      active.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [pathname]);

  // Footer chapter list — drop the CTA so it doesn't double up with the
  // "Spustit kvíz" button below, and drop "home" because the brand mark
  // already links there. Order follows NAV; cap at the legacy 4 entries.
  const footerChapters = NAV.filter((n) => !n.cta && n.id !== "home").slice(
    0,
    4
  );

  return (
    <div
      className="app flex flex-col min-h-screen"
      data-screen-label={pathname}
      data-contrast={tweaks.highContrast ? "high" : "normal"}
    >
      <header className="topbar">
        <Link
          to="/"
          className="brand"
          style={{ cursor: "pointer", background: "none" }}
        >
          <Mascot size={38} bounce />
          <span>
            Fotbalové <span style={{ color: "var(--pitch)" }}>ABC</span>
          </span>
        </Link>
        <div className="nav-rail">
          <nav className="nav" ref={navRef}>
            {NAV.map((n) => (
              <NavLink
                key={n.id}
                to={n.path}
                end={n.path === "/"}
                className={({ isActive }) =>
                  "nav-link" +
                  (isActive ? " active" : "") +
                  (n.cta && !isActive ? " cta" : "")
                }
              >
                {n.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="footer">
        <div
          style={{
            maxWidth: 1400,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1.5fr 1fr 1fr",
            gap: 24,
          }}
          className="footer-grid hero-grid"
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Mascot size={56} />
              <div className="display" style={{ fontSize: 26 }}>
                Fotbalové{" "}
                <span style={{ color: "var(--orange)" }}>ABC</span>
              </div>
            </div>
            <p style={{ marginTop: 12, opacity: 0.8, maxWidth: 480 }}>
              Výukový web o fotbale pro malé fotbalisty. Pravidla, strategie a
              všechno, co se na hřišti hodí. Hraj si, čti a běž ven trénovat!
            </p>
          </div>
          <div>
            <div
              className="display"
              style={{
                fontSize: 18,
                color: "var(--orange)",
                marginBottom: 10,
              }}
            >
              Kapitoly
            </div>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                lineHeight: 2,
                fontSize: 15,
              }}
            >
              {footerChapters.map((n) => (
                <li key={n.id}>
                  <Link to={n.path} style={{ cursor: "pointer" }}>
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div
              className="display"
              style={{
                fontSize: 18,
                color: "var(--orange)",
                marginBottom: 10,
              }}
            >
              Pro děti, rodiče i trenéry
            </div>
            <p style={{ fontSize: 14, opacity: 0.8 }}>
              Vhodné pro děti 6–12 let. Bez reklam, bez přihlašování. Stačí
              klikat a učit se.
            </p>
            <Link
              to="/kviz"
              className="btn primary"
              style={{ marginTop: 12, display: "inline-block" }}
            >
              Spustit kvíz
            </Link>
          </div>
        </div>
        <div
          style={{
            maxWidth: 1400,
            margin: "30px auto 0",
            paddingTop: 20,
            borderTop: "1px solid rgba(247,242,230,0.2)",
            fontSize: 13,
            opacity: 0.6,
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          <span>© Fotbalové ABC — výukový prototyp</span>
          <span>Vyrobeno s ⚽ a spoustou pohybu</span>
        </div>
      </footer>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Domovská stránka">
          <TweakRadio
            label="Varianta layoutu"
            value={tweaks.homeVariant}
            options={[
              { value: "A", label: "Hero" },
              { value: "B", label: "Trenér" },
            ]}
            onChange={(v) => setTweak("homeVariant", v)}
          />
        </TweakSection>
        <TweakSection label="Zobrazení">
          <TweakToggle
            label="Animace maskota"
            value={tweaks.showMascot}
            onChange={(v) => setTweak("showMascot", v)}
          />
          <TweakToggle
            label="Vysoký kontrast"
            value={tweaks.highContrast}
            onChange={(v) => setTweak("highContrast", v)}
          />
        </TweakSection>
        <div
          style={{
            fontSize: 12,
            color: "var(--navy-soft)",
            padding: "8px 4px",
            lineHeight: 1.4,
          }}
        >
          Přepni mezi dvěma návrhy úvodní stránky a porovnej je. Změny se
          uloží.
        </div>
      </TweaksPanel>
    </div>
  );
}
