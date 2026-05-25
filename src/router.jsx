/* Router — HashRouter route table.
   HashRouter (not BrowserRouter) is intentional: the legacy app shipped with
   hash-based navigation (`#home`, `#rules`, …) and is hosted on a static page
   that can't rewrite arbitrary paths to /index.html. createHashRouter keeps
   the URL shape predictable (`#/pravidla`) while the
   `useLegacyHashRedirect` hook in App.jsx translates pre-migration hashes
   like `#rules` → `#/pravidla` so existing links keep working. */
import { createHashRouter } from "react-router-dom";
import RootLayout from "./layouts/RootLayout.jsx";
import HomePage from "./pages/HomePage.jsx";
import RulesPage from "./pages/RulesPage.jsx";
import StrategyPage from "./pages/StrategyPage.jsx";
import PitchPage from "./pages/PitchPage.jsx";
import PositionsPage from "./pages/PositionsPage.jsx";
import ZonesPage from "./pages/ZonesPage.jsx";
import MovePage from "./pages/MovePage.jsx";
import GlossaryPage from "./pages/GlossaryPage.jsx";
import QuizPage from "./pages/QuizPage.jsx";

export const router = createHashRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "pravidla", element: <RulesPage /> },
      { path: "strategie", element: <StrategyPage /> },
      { path: "hriste", element: <PitchPage /> },
      { path: "pozice", element: <PositionsPage /> },
      { path: "zony", element: <ZonesPage /> },
      { path: "pohyb", element: <MovePage /> },
      { path: "slovnik", element: <GlossaryPage /> },
      { path: "kviz", element: <QuizPage /> },
    ],
  },
]);

export default router;
