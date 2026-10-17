import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Kopik } from "../components/Kopik.jsx";
import { Tiles } from "./HomePage.jsx";
import { pageTitle } from "../lib/nav.js";

/* Neznámá adresa: Cloudflare ji podá jako 404.html se stavem 404 (scripts/seo.mjs), tady je vidět, že tu nic není a kam dál. */
export default function NotFoundPage() {
  useEffect(() => {
    document.title = pageTitle("Stránka nenalezena");
  }, []);
  return (
    <div className="page notfound">
      <Kopik size={96} />
      <h1>Stránka nenalezena</h1>
      <p className="lead">
        Tahle stránka tu není. Vyber si, co chceš umět, nebo jdi <Link to="/">na úvod</Link>.
      </p>
      <Tiles />
    </div>
  );
}
