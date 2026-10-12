# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

"Fotbalové ABC" — Czech-language SPA that teaches football to kids 5–10 from *přípravka*, using the
**5+1** format (FAČR „Pravidla fotbalu malých forem“ 2023). Principle: show, don't tell — every rule
and game principle is an animated scene on a coach's board, captions are short and can be read aloud.
Vite + React 18, plain global CSS (no Tailwind). No test framework, no linter.

## Commands

- `npm run dev` — Vite dev server (`http://localhost:5173/`)
- `npm run build` — production build to `dist/`
- `npm run preview` — serve the build
- `npm run check` — the one runnable check: ball logic asserts + lint of every scene/topic + video ids. Keep it green.
- `ELEVENLABS_API_KEY=… npm run voice` — re-record captions after changing any spoken text (see Read-aloud).

## Architecture

### Routing — HashRouter (intentional)
Static files with a relative `base: "./"` (`vite.config.js`), so `src/router.jsx` uses `createHashRouter`
(`#/utok?s=roztahni-se`): the document URL never changes, relative asset/voice paths always resolve.
Don't switch to a browser router without changing `base`. `src/lib/nav.js` is the single
source for the menu (top bar, mobile tab bar, home tiles) — add pages there and in `router.jsx`.
Old slugs redirect via `<Navigate>` routes; pre-router hashes (`#rules`…) via `LEGACY_MAP` in
`src/hooks/useLegacyHashRedirect.js`.

### Scenes — the core
- `src/lib/pitch.js` — pitch in **meters**, vertical: `x 0..W(30)` left→right, `y 0..L(45)` from OUR
  goal line (bottom) to theirs. We (yellow, `team: "us"`) attack up (+y); opponents (blue) down.
  Penalty area = 5.5 m strip across the full width, penalty spot 7 m, goals 5 m. `sy(y)` → SVG y.
- `src/components/Board.jsx` — `Pitch`, `Player` (magnet), `Ball`, `Mark` (pass/run/dribble/shot/line
  arrows, zone, label, x/check).
- `src/components/Scene.jsx` — scene player. **The data format is documented at the top of this file.**
  `SceneBoard` renders a scene at a given time (also used by the quiz).
- `src/scenes/*.js` — one topic per file (`hriste`, `pravidla`, `utok`, `obrana`, `brankar`): plain data
  `{ id, title, lead, scenes: [...] }`. A scene may instead be `{ id, title, icon, Component }` for
  custom interactive content (see `src/components/keeper/`); it must render the same `.scene` grid
  skeleton (`.board`, `.scene-title`, `<Say>`, `.scene-extra`, `{children}`).
- `src/pages/TopicPage.jsx` renders any topic; `src/pages/QuizPage.jsx` collects `scene.quiz` from all
  topics. Scene ids must be unique within a topic (they appear in URLs `?s=`).
- `src/lib/lint.js` — data check (overlaps, bounds, caption length/spacing, labels covering a player or the ball — move a zone label with `at`). Runs on every topic page
  in DEV (`console.warn`, not in the prod bundle) and in `npm run check`. Keep it at zero warnings.
- `src/scenes/videos.js` — YouTube videos per topic (`scene` = id of the situation it belongs to).
  `src/components/Video.jsx` loads nothing from YouTube until clicked (youtube-nocookie).
- `src/components/keeper/` — custom goalkeeper scenes (stance figure, interactive positioning, hands).
  Every custom component must list its spoken sentences in `Component.TEXTS` (for voice generation).

### Read-aloud
`src/lib/voice.js` plays pre-recorded ElevenLabs MP3s from `public/voice/<hash>.mp3` (list in
`src/voice.json`, hash = FNV-1a of the exact sentence) and falls back to the browser's Czech
Web Speech voice for sentences that aren't recorded. `scripts/voice.mjs` collects every spoken text
(scene beats incl. `bad` — a beat's `say` replaces its caption when Kopík should explain more aloud, quiz questions/options, `Component.TEXTS`, `PHRASES`), records only new
ones (voice „Jan – Kind Educator“, model `eleven_v4`) and deletes unused files. The API key must
never be committed or shipped to the browser. Spoken strings must be static (no runtime concatenation).
Voice is ON by default (turning it off is remembered in localStorage `fotbal:voice`); browsers allow sound only after the
first tap, so `voice.js` unlocks the single shared `Audio` element on the first touch/click (needed for iOS). Scenes start
by themselves 2 s after opening (`Play` `delay`), immediately after switching „Takhle ano / ne“. When „Takhle ano“ ends
and Kopík has finished, 1.5 s pause, Kopík says `PHRASES.bad` and „Takhle ne“ plays by itself (`onNext`, only from the
opening state; replay, toggle or leaving cancels it). `say`'s `onEnd` also fires when speech is cut off (🔊, voice off),
otherwise a scene waiting for Kopík would freeze.

### Analytics — only with consent
`src/components/Consent.jsx`: Google Analytics 4 (`G-T1RYP3MGRD`) loads only after „Povolit“ in the bottom bar (choice in
localStorage `fotbal:stats`; footer „Nastavení cookies“ reopens it, withdrawal deletes `_ga*` cookies). Page views are sent
by `trackPage` from `RootLayout` on every route change (`send_page_view: false`; hash routes go to GA as `/utok?s=…`).
Google signals and ad personalization are off (site for kids). Don't add the gtag snippet to `index.html`.

### Tweaks system — host iframe protocol (do not break)
`src/hooks/useTweaks.jsx` + `src/components/tweaks/TweaksPanel.jsx` implement a postMessage contract:
inbound `__activate_edit_mode` / `__deactivate_edit_mode`; outbound `__edit_mode_available` (mount),
`__edit_mode_dismissed` (close), `__edit_mode_set_keys` (each edit); same-window `tweakchange` event.
`<TweaksProvider>` is mounted in `App.jsx` (default keys there: `highContrast`).

### Styling
`src/styles/index.css` — design tokens on `:root` (`--ink`, `--board`, `--grass`, `--us`, `--them`,
`--good`, `--bad`…), fonts Grandstander (display) + Andika (text, designed for beginning readers),
then components by section. Mobile ≤ 760 px: menu becomes a bottom tab bar.

### Deployment
Cloudflare Workers static assets (`wrangler.jsonc`, Worker `fotbalove-abc`, no Worker code): `npm run deploy`
(= build + `npx wrangler deploy`; needs `npx wrangler login`). Live on `https://fotbalove-abc.cz` + `www` (`routes` with
`custom_domain: true`, zone active in Cloudflare, registrar Webglobe points NS to Cloudflare); `workers_dev: true` keeps
`fotbalove-abc.robinbortlik.workers.dev` as a fallback.
Relative `base: "./"` makes the same build work under `/fotbal/` too (old GitHub Pages workflow `.github/workflows/deploy.yml`).
