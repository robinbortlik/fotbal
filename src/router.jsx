/* HashRouter je záměr: web běží jako statická stránka pod /fotbal/ a hosting
   neumí přesměrovat libovolnou cestu na index.html. Adresy vypadají jako #/utok. */
import { createHashRouter, Navigate } from "react-router-dom";
import RootLayout from "./layouts/RootLayout.jsx";
import HomePage from "./pages/HomePage.jsx";
import TopicPage from "./pages/TopicPage.jsx";
import QuizPage from "./pages/QuizPage.jsx";
import ParentsPage from "./pages/ParentsPage.jsx";
import { ATTACK } from "./scenes/utok.js";
import { DEFENSE } from "./scenes/obrana.js";
import { KEEPER } from "./scenes/brankar.js";
import { RULES } from "./scenes/pravidla.js";
import { PITCH } from "./scenes/hriste.js";

const to = (path) => <Navigate to={path} replace />;

export const router = createHashRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "hriste", element: <TopicPage topic={PITCH} /> },
      { path: "pravidla", element: <TopicPage topic={RULES} /> },
      { path: "utok", element: <TopicPage topic={ATTACK} /> },
      { path: "obrana", element: <TopicPage topic={DEFENSE} /> },
      { path: "brankar", element: <TopicPage topic={KEEPER} /> },
      { path: "kviz", element: <QuizPage /> },
      { path: "pro-rodice", element: <ParentsPage /> },
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
