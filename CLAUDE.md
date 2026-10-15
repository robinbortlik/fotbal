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
`/utok/roztahni-se` = situation (`:scene?` param; the situation list is `<Link>`s so crawlers follow them, a click
`navigate`s with `replace`). `src/lib/nav.js` is the single
source for the menu (top bar, mobile tab bar, home tiles) and for page titles/descriptions (`PAGES`, `pageTitle`) — add
pages there and in `router.jsx`. Old slugs redirect via `<Navigate>` routes and with a 301 in `public/_redirects`; old `#` links (`#/utok?s=x`, `#rules`) are
rewritten by `fromHash` (nav.js, asserted in `npm run check`) with `history.replaceState` before the router starts.
`scripts/seo.mjs` runs after `vite build`: writes `dist/<url>.html` for every page and situation (own title, description,
canonical, og:*, BreadcrumbList JSON-LD on topics and situations, plus a `.seo` text + links in `#root` for crawlers without JS — hidden by CSS for 3 s, replaced by the app),
`dist/404.html` (noindex), `dist/sitemap.xml` (all URLs) and `dist/llms.txt`. It fails the build if `index.html` loses a tag it rewrites.
Google indexes the page as rendered by the app, not the `.seo` text: on a situation's own URL its title is the H1
(`OwnPage` context from TopicPage → `<SceneTitle>`) and the collapsed „Pro rodiče a trenéry“ (`<Why>`) also holds
everything Kopík says in it; on the topic URL the H1 is the topic.

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
  skeleton (`.board`, `<SceneTitle>`, `<Say>`, `.scene-extra`, `<Why why story>`, `{children}`).
- `src/pages/TopicPage.jsx` renders any topic; `src/pages/QuizPage.jsx` collects `scene.quiz` from all
  topics. Scene ids must be unique within a topic (they appear in URLs `?s=`).
- Age category: the site is built for *starší přípravka* U10–U11 (5 + 1, default). The top-bar `<select>` switches to
  *mladší přípravka* U8–U9 (4 + 1), remembered in localStorage `fotbal:age` (`src/lib/age.js`). Only scenes whose rules
  differ carry `younger: { …scene keys… }`, merged over the scene by `forAge` (TopicPage, Quiz; `bad: null` / `quiz: null`
  drop them): hřiště/pet-plus-jedna, hřiště/velikost, pravidla/aut, pravidla/kop-od-branky, brankar/mala-domu. Lint, voice
  and SEO include the variants; the book prints U10–U11 only, so the U10–U11 `why` texts mention the U8–U9 difference.
- `src/lib/lint.js` — data check (overlaps, bounds, caption length/spacing, labels covering a player or the ball — move a zone label with `at`). Runs on every topic page
  in DEV (`console.warn`, not in the prod bundle) and in `npm run check`. Keep it at zero warnings.
- `src/scenes/videos.js` — YouTube videos per topic (`scene` = id of the situation it belongs to).
  `src/components/Video.jsx` loads nothing from YouTube until clicked (youtube-nocookie).
- `src/components/keeper/` — custom goalkeeper scenes (stance figure, interactive positioning, hands).
  Custom scenes get `next` / `onReplay` from TopicPage: they show `<BoardEnd>` (Znovu / Další) once Kopík finished
  (`useSpeak` returns done), and „Takhle ano“ chains to „Takhle ne“ with `useChain` (Scene.jsx) like a normal scene.
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
first tap, so `voice.js` unlocks the single shared `Audio` element on the first touch/click (needed for iOS). A page can't
know the device volume or mute switch, so `useSpeech()` (voice.js) exposes what it can: `speaking` (audio/speech is really
playing, from media events) moves Kopík's mouth (`<Kopik talking>`), so a kid on a muted phone sees him talk; `blocked`
(the browser refused to play because nobody tapped the page yet, e.g. a shared link) shows „Ťukni a Kopík promluví“
under the `<Say>` bubble until sound gets unlocked. Scenes start
by themselves 1.2 s after opening (`Play` `delay`), immediately after switching „Takhle ano / ne“. Clicking the already
selected situation, „Takhle ano / ne“ or (home) „Máme / Nemáme míč“ plays it again; picking a situation silences Kopík (`stop`).
The home board starts dimmed with a play button (first-time visitors didn't know what to do): it plays „Máme míč“, after
Kopík „Nemáme míč“, then shows „Znovu“; the switch buttons cancel it.
On mobile the situation list is a horizontal strip — the selected one scrolls to its middle. When „Takhle ano“ ends
and Kopík has finished, 1.5 s pause, Kopík says `PHRASES.bad` and „Takhle ne“ plays by itself (`onNext`, only from the
opening state; replay, toggle or leaving cancels it). `say`'s `onEnd` also fires when speech is cut off (🔊, voice off),
otherwise a scene waiting for Kopík would freeze. The scene is controlled like a video, on the board itself (no controls
beside it): tapping the board pauses (Kopík goes quiet and repeats the cut-off caption on resume), a paused board is dimmed
with a big play button, progress is a thin line of beat segments along the board's top edge. Waiting for Kopík (`held`)
or for the autostart is not a pause — the board stays uncovered. When the situation has really played to the end (not
right after the chain hands over to „Takhle ne“, not the still frame of reduced motion — that one shows the play button),
an end screen dims the board: „Znovu“ (whole situation again, at once) and „Další“ (`next` from `TopicPage`: next
situation, after the last one the next topic from `NAV`) — on mobile kids don't know the situation strip scrolls
sideways. The board buttons scale with the board (container query), labels hide on a board under 160 px.

### Book (PDF to print)
`book.html` + `src/book/Book.jsx` lay the whole site out as A4-landscape pages (cover, Kopík + how to read the board, contents,
per topic an opener with an illustration, then one page per situation, quiz with answers upside down, rules, slogans, diploma).
A situation page is a comic: `SceneBoard` at the end of each beat (`shot` — before a mark that started in that beat disappears),
„Takhle ne“ underneath without the beats it shares with „Takhle ano“, and `why`; page numbers are computed up front for the contents.
`scripts/book.mjs` builds it with Vite (no PWA, no `public/`) and prints it with headless Chrome into `public/fotbalove-abc.pdf`
(committed, ~9 MB, linked as `BOOK` from `nav.js` on the home page, Pro rodiče and footer; not precached). Keep the PDF small: Chrome
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
install button next to the voice button in the top bar (and a footer link). The top bar is full (brand, menu, U10–U11 select,
install, voice): its label breakpoints in `index.css` were measured (with a 15 px scrollbar, install button forced, longer
„Číst nahlas“) so nothing overflows at 320–1600 px — re-measure after adding anything to it. Icons are rendered from the Kopík SVG; re-render them if Kopík changes.
Share preview: Open Graph / Twitter meta in `index.html` with absolute URLs, image `public/og.png` (1200×630, < 300 kB for
WhatsApp) composed from the home-page board, Kopík and menu icons; per-page og:title/description/url come from `scripts/seo.mjs`.
After changing it, re-scrape in the Facebook Sharing Debugger.
SEO: `public/robots.txt`, WebSite JSON-LD in `index.html`, everything else generated by `scripts/seo.mjs` (see Routing) from
the scene data, `PAGES` and `RULES`/`YOUNGER`/`SOURCES` exported from `ParentsPage.jsx`; `public/_headers` serves `llms.txt` as UTF-8
and `/assets/*` (hashed names) with a 1-year immutable cache. Search Console is verified by a DNS TXT record, Seznam Webmaster by
`seznam-wmt` in `index.html`.

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
Cloudflare Workers static assets (`wrangler.jsonc`, Worker `fotbalove-abc`, no Worker code). Deploys automatically on
every push to `master` (a merged PR goes live by itself; no workflow in this repo, Cloudflare builds it). Manual fallback:
`npm run deploy` (= build + `npx wrangler deploy`; needs `npx wrangler login`). Live on `https://fotbalove-abc.cz` (`routes` with
`custom_domain: true`, zone active in Cloudflare, registrar Webglobe points NS to Cloudflare); `www` and `http://` 301 to it in the
Cloudflare dashboard (Redirect Rule over a proxied DNS record `AAAA www 100::`, and Always Use HTTPS) — never attach `www` to the
Worker, the rule would not run. `workers_dev: true` keeps
`fotbalove-abc.robinbortlik.workers.dev` as a fallback. Cloudflare serves `/utok/roztahni-se` from `utok/roztahni-se.html`
(`/utok/` and `/utok.html` redirect to `/utok`) and any unknown path as `404.html` with status 404 (`not_found_handling: "404-page"`;
the app then shows the home page). `npx wrangler dev`
serves `dist/` the same way locally (`vite preview` does not know the `.html` mapping).
