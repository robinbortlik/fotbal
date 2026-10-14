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
- `npm run book` — re-print the PDF book `public/fotbalove-abc.pdf` after changing scenes or texts (see Book).

## Architecture

### Routing — real URLs (one page per situation, for search engines)
`createBrowserRouter` in `src/router.jsx`, `base: "/"` (site runs at the domain root): `/utok` = topic,
`/utok/roztahni-se` = situation (`:scene?` param; picking one `navigate`s with `replace`). `src/lib/nav.js` is the single
source for the menu (top bar, mobile tab bar, home tiles) and for page titles/descriptions (`PAGES`, `pageTitle`) — add
pages there and in `router.jsx`. Old slugs redirect via `<Navigate>` routes; old `#` links (`#/utok?s=x`, `#rules`) are
rewritten by `fromHash` (nav.js, asserted in `npm run check`) with `history.replaceState` before the router starts.
`scripts/seo.mjs` runs after `vite build`: writes `dist/<url>.html` for every page and situation (own title, description,
canonical, og:*, plus a `.seo` text + links in `#root` for crawlers without JS — hidden by CSS for 3 s, replaced by the app),
`dist/sitemap.xml` (all URLs) and `dist/llms.txt`. It fails the build if `index.html` loses a tag it rewrites.

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
  Every custom component must list its spoken sentences in `Component.TEXTS` (for voice generation) and its pictures for
  the book in `Component.PRINT` (`{ frames: [{ art, text, tone? }], why }`).

### Read-aloud
`src/lib/voice.js` plays pre-recorded ElevenLabs MP3s from `public/voice/<hash>.mp3` (list in
`src/voice.json`, hash = FNV-1a of the exact sentence) and falls back to the browser's Czech
Web Speech voice for sentences that aren't recorded. Only the installed app (`display-mode: standalone`) downloads
all MP3s once into Cache Storage `voice` (~13 MB, skipped with Data Saver) and plays them from there as blobs — works offline,
no service-worker range requests needed; the normal website downloads nothing extra. `scripts/voice.mjs` collects every spoken text
(scene beats incl. `bad` — a beat's `say` replaces its caption when Kopík should explain more aloud, quiz questions/options, `Component.TEXTS`, `PHRASES`), records only new
ones (voice „Jan – Kind Educator“, model `eleven_v4`) and deletes unused files. The API key must
never be committed or shipped to the browser. Spoken strings must be static (no runtime concatenation).
Voice is ON by default (turning it off is remembered in localStorage `fotbal:voice`); browsers allow sound only after the
first tap, so `voice.js` unlocks the single shared `Audio` element on the first touch/click (needed for iOS). Scenes start
by themselves 1.2 s after opening (`Play` `delay`), immediately after switching „Takhle ano / ne“. Clicking the already
selected situation, „Takhle ano / ne“ or (home) „Máme / Nemáme míč“ plays it again; picking a situation silences Kopík (`stop`).
On mobile the situation list is a horizontal strip — the selected one scrolls to its middle. When „Takhle ano“ ends
and Kopík has finished, 1.5 s pause, Kopík says `PHRASES.bad` and „Takhle ne“ plays by itself (`onNext`, only from the
opening state; replay, toggle or leaving cancels it). `say`'s `onEnd` also fires when speech is cut off (🔊, voice off),
otherwise a scene waiting for Kopík would freeze. When the situation has really played to the end (not right after the
chain hands over to „Takhle ne“, not the still frame of reduced motion), an end screen like on YouTube dims the board:
„Znovu“ (whole situation again, at once) and „Další“ (`next` from `TopicPage`: next situation, after the last one the next
topic from `NAV`) — on mobile kids don't know the situation strip scrolls sideways. Its buttons scale with the board
(container query), labels hide on a board under 160 px.

### Book (PDF to print)
`book.html` + `src/book/Book.jsx` lay the whole site out as A4-landscape pages (cover, Kopík + how to read the board, contents,
per topic an opener with an illustration, then one page per situation, quiz with answers upside down, rules, slogans, diploma).
A situation page is a comic: `SceneBoard` at the end of each beat (`shot` — before a mark that started in that beat disappears),
„Takhle ne“ underneath without the beats it shares with „Takhle ano“, and `why`; page numbers are computed up front for the contents.
`scripts/book.mjs` builds it with Vite (no PWA, no `public/`) and prints it with headless Chrome into `public/fotbalove-abc.pdf`
(committed, ~7 MB, linked as `BOOK` from `nav.js` on the home page, Pro rodiče and footer; not precached). Keep the PDF small: Chrome
embeds webp losslessly, so the book aliases the keeper photos to JPEG copies `src/book/img/brankar-*.jpg`, and `book.css` replaces
SVG patterns (goal net, red hatch) with flat fills. Illustrations `src/book/img/*.jpg` were made with Gemini in the user's Chrome.

### Analytics — only with consent
`src/components/Consent.jsx`: Google Analytics 4 (`G-T1RYP3MGRD`) loads only after „Povolit“ in the bottom bar (choice in
localStorage `fotbal:stats`; footer „Nastavení cookies“ reopens it, withdrawal deletes `_ga*` cookies). Page views are sent
by GA itself: on load and on every history change (enhanced measurement, incl. `replace` on picking a situation) — don't add
manual `page_view` events, they would double count.
Google signals and ad personalization are off (site for kids). Don't add the gtag snippet to `index.html`.
`src/pages/PrivacyPage.jsx` (`/ochrana-soukromi`, linked from the footer and the bar) is the GDPR notice — update it whenever
you add a third-party service or a new browser-storage key.

### PWA
`vite-plugin-pwa` in `vite.config.js`: manifest (icons `public/icons`, install-dialog screenshots `public/screenshots`) and
a Workbox service worker that precaches the app (`autoUpdate`; every navigation gets the precached `index.html`; voice MP3s
are not precached — see Read-aloud).
Install dialog = open source `<pwa-install>` (`@khmyznikov/pwa-install`, element in `index.html`, lazy-loaded by
`src/lib/install.js`): offered by itself once (`fotbal:install`) on the home page of a returning visitor, otherwise the
install button next to the voice button in the top bar (and a footer link). The top bar is full: its label breakpoints in
`index.css` were measured so nothing overflows at 320–1440 px — re-measure after adding anything to it. Icons are rendered from the Kopík SVG; re-render them if Kopík changes.
Share preview: Open Graph / Twitter meta in `index.html` with absolute URLs, image `public/og.png` (1200×630, < 300 kB for
WhatsApp) composed from the home-page board, Kopík and menu icons; per-page og:title/description/url come from `scripts/seo.mjs`.
After changing it, re-scrape in the Facebook Sharing Debugger.
SEO: `public/robots.txt`, WebSite JSON-LD in `index.html`, everything else generated by `scripts/seo.mjs` (see Routing) from
the scene data, `PAGES` and `RULES`/`YOUNGER`/`SOURCES` exported from `ParentsPage.jsx`; `public/_headers` serves `llms.txt` as UTF-8.

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
`fotbalove-abc.robinbortlik.workers.dev` as a fallback. Cloudflare serves `/utok/roztahni-se` from `utok/roztahni-se.html`
(`/utok/` and `/utok.html` redirect to `/utok`) and any unknown path as `index.html` (`not_found_handling`). `npx wrangler dev`
serves `dist/` the same way locally (`vite preview` does not know the `.html` mapping).
