/* Skutečné adresy (/utok/roztahni-se): každá situace je pro vyhledávače samostatná stránka. scripts/seo.mjs k nim
   po buildu vyrobí HTML s titulkem a popisem; adresu bez souboru Cloudflare obslouží jako index.html (SPA). */
import { createBrowserRouter, Navigate } from "react-router-dom";
import RootLayout from "./layouts/RootLayout.jsx";
import HomePage from "./pages/HomePage.jsx";
import TopicPage from "./pages/TopicPage.jsx";
import QuizPage from "./pages/QuizPage.jsx";
import ParentsPage from "./pages/ParentsPage.jsx";
import PrivacyPage from "./pages/PrivacyPage.jsx";
import { fromHash } from "./lib/nav.js";
import { ATTACK } from "./scenes/utok.js";
import { DEFENSE } from "./scenes/obrana.js";
import { KEEPER } from "./scenes/brankar.js";
import { RULES } from "./scenes/pravidla.js";
import { KICKING } from "./scenes/kopani.js";
import { DRIBBLING } from "./scenes/klicky.js";
import { PITCH } from "./scenes/hriste.js";

// Starý odkaz za # → nová adresa, ještě než ji router přečte (bez nového načtení stránky).
const moved = fromHash(location.hash);
if (moved) history.replaceState(null, "", moved + location.search);

const to = (path) => <Navigate to={path} replace />;
const topic = (t) => ({ path: `${t.id}/:scene?`, element: <TopicPage topic={t} /> });

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      topic(PITCH),
      topic(RULES),
      topic(KICKING),
      topic(DRIBBLING),
      topic(ATTACK),
      topic(DEFENSE),
      topic(KEEPER),
      { path: "kviz", element: <QuizPage /> },
      { path: "pro-rodice", element: <ParentsPage /> },
      { path: "ochrana-soukromi", element: <PrivacyPage /> },
      // Staré adresy z předchozí verze webu
      { path: "strategie", element: to("/utok") },
      { path: "pohyb", element: to("/utok") },
      { path: "zony", element: to("/obrana") },
      { path: "pozice", element: to("/hriste") },
      { path: "*", element: to("/") },
    ],
  },
]);

export default router;
