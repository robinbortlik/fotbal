/* Kličky — jak obejít soupeře s míčem u nohy. Scény na tabuli (formát viz src/components/Scene.jsx).
   Samotný pohyb nohou ukazují videa (src/scenes/videos.js), tabule ukazuje, kdy a kam kličku udělat.
   „Klička a zrychli“ v Útoku vysvětluje, proč po kličce zrychlit; tady jde o jednotlivé kličky. */

/* 1. Klička tělem: nakloň se doleva, odjeď doprava — kousek před soupeřem, ne zdaleka. */
const feintStart = [
  { t: 0, text: "Soupeř stojí před tebou. Jeď k němu.", say: "Vedeš míč a před tebou stojí soupeř. Jeď klidně až k němu, skoro na dva kroky." },
];
const feintTeam = [
  { id: "g", team: "us", gk: true, n: 1, path: [[0, 15, 2.5]] },
  { id: "a", team: "us", n: 2, dim: true, path: [[0, 8, 12]] },
  { id: "b", team: "us", n: 3, dim: true, path: [[0, 22, 12]] },
  { id: "c", team: "us", n: 4, dim: true, path: [[0, 9, 22]] },
  { id: "d", team: "us", n: 5, dim: true, path: [[0, 24, 22]] },
  { id: "G", team: "them", gk: true, dim: true, path: [[0, 15, 42.5]] },
  { id: "t2", team: "them", dim: true, path: [[0, 8, 36]] },
  { id: "t3", team: "them", dim: true, path: [[0, 24.5, 34]] },
  { id: "t4", team: "them", dim: true, path: [[0, 9, 17]] },
  { id: "t5", team: "them", dim: true, path: [[0, 20.5, 17]] },
];
const feint = {
  id: "klicka-telem",
  title: "Klička tělem",
  icon: "🕺",
  dur: 10.4,
  beats: [
    ...feintStart,
    { t: 2.6, text: "Kousek před ním se nakloň doleva…", say: "Kousek před soupeřem se celým tělem nakloň doleva, jako bys tam chtěl jet." },
    { t: 5.2, text: "…a odjeď doprava!", say: "Soupeř ti uvěřil a šel doleva. Teď rychle odjeď doprava, kolem něj." },
    { t: 7.8, text: "Soupeř stojí špatně. Máš volno!", say: "Soupeř stojí na špatné straně a nestihne to. Před tebou je volná cesta." },
  ],
  players: [
    ...feintTeam,
    {
      id: "ty", team: "us", n: 6, tag: "Ty", hl: true,
      path: [[0, 15, 20], [0.4, 15, 20], [2.6, 15, 27.6], [3.2, 13.8, 28], [5.2, 13.8, 28], [6.2, 18.4, 29.6], [7.6, 18.8, 35], [9, 18.6, 37.6]],
    },
    { id: "t1", team: "them", path: [[0, 15, 31], [2.9, 15, 31], [3.7, 13.6, 31], [5.6, 13.6, 31], [7, 15.2, 32.6], [8.6, 16.2, 34.2]] },
  ],
  ball: [[0, "ty"], [2.6, "ty"], [3.2, 15, 29.1], [5.2, 15, 29.1], [6.2, "ty"], [10.4, "ty"]],
  marks: [
    { kind: "dribble", from: [15, 21.5], to: [15, 28.7], t: [0.4] },
    { kind: "run", from: [15, 27.6], to: [12.4, 28.2], t: [2.6, 5.2] },
    { kind: "label", at: [7.6, 28.2], text: "Nakloň se", t: [2.6, 5.2] },
    { kind: "run", team: "them", from: [15, 31], to: [13.6, 31], t: [2.9, 5.6] },
    { kind: "dribble", from: [15, 29.1], to: [18.6, 31.4], t: [5.2] },
    { kind: "dribble", from: [18.6, 31.4], to: [18.7, 38], t: [6.2] },
  ],
  why: "Klička tělem je nejjednodušší klička: hráč se trupem a ramenem nakloní na jednu stranu, obránce přenese váhu za ním a hráč odjede s míčem na druhou stranu. Dělá se kousek před obráncem, asi na dva kroky. Zdaleka má obránce čas se vrátit, zblízka dosáhne na míč. Po kličce hned zrychlit (Útok: Klička a zrychli).",
  quiz: {
    at: 2.4,
    ask: "Soupeř je dva kroky před tebou. Co uděláš?",
    options: [
      { text: "Nakloním se doleva a odjedu doprava", ok: true },
      { text: "Zastavím a počkám", ok: false },
      { text: "Kopnu míč do soupeře", ok: false },
    ],
  },
  bad: {
    beats: [
      ...feintStart,
      { t: 2.6, text: "Ty se ale nakláníš už zdaleka…", say: "Ty se ale nakláníš už daleko od soupeře. Ten se nenechá nachytat a v klidu čeká." },
      { t: 5.2, text: "Soupeř má čas a zavře ti cestu.", say: "Soupeř má dost času. Vidí, kam jedeš, a zavře ti cestu." },
      { t: 7.8, text: "Míč ti vzal. Kličkuj až dva kroky před ním!", say: "Soupeř ti míč vzal. Kličkuj až kousek před ním, asi na dva kroky. Pak nestihne zareagovat." },
    ],
    players: [
      ...feintTeam,
      {
        id: "ty", team: "us", n: 6, tag: "Ty", hl: true,
        path: [[0, 15, 20], [0.4, 15, 20], [2, 15, 24.2], [2.6, 15, 24.2], [3.2, 13.8, 24.4], [4.4, 13.8, 24.4], [5.6, 18, 26.6], [7, 18.4, 28.8]],
      },
      { id: "t1", team: "them", path: [[0, 15, 31], [5, 15, 31], [6.2, 17.6, 31.4], [7.8, 18.2, 31.2], [8.8, 14.5, 30.6], [10.4, 12, 26.5]] },
    ],
    ball: [[0, "ty"], [2.6, "ty"], [3.2, 15, 25.7], [4.4, 15, 25.7], [5.6, "ty"], [7.3, "ty"], [7.6, "t1"], [10.4, "t1"]],
    marks: [
      { kind: "dribble", from: [15, 21.5], to: [15, 25.3], t: [0.4] },
      { kind: "run", from: [15, 24.2], to: [12.4, 24.6], t: [2.6, 4.4] },
      { kind: "line", from: [15, 26.4], to: [15, 29.6], t: [2.6, 4.4] },
      { kind: "label", at: [19.4, 27.7], text: "Moc daleko", tone: "bad", t: [2.6, 4.4] },
      { kind: "run", team: "them", from: [15, 31], to: [17.6, 31.4], t: [5] },
      { kind: "dribble", from: [15, 25.7], to: [18.2, 28.2], t: [4.4, 7.6] },
      { kind: "x", at: [21.4, 30.4], t: [7.6] },
      { kind: "dribble", team: "them", from: [17.6, 29.6], to: [12.4, 25.4], t: [7.8] },
    ],
  },
};

/* 2. Stáhni podrážkou: cesta dopředu zavřená → stáhnout míč, otočit se do volna. */
const dragStart = [
  { t: 0, text: "Vedeš míč a soupeř ti běží naproti.", say: "Vedeš míč dopředu a soupeř ti běží naproti. Cestu dopředu máš zavřenou." },
];
const dragTeam = [
  { id: "g", team: "us", gk: true, n: 1, path: [[0, 15, 2.5]] },
  { id: "a", team: "us", n: 2, path: [[0, 5, 30]] },
  { id: "b", team: "us", n: 3, dim: true, path: [[0, 22, 10]] },
  { id: "c", team: "us", n: 5, dim: true, path: [[0, 23, 16]] },
  { id: "d", team: "us", n: 6, dim: true, path: [[0, 20, 27]] },
  { id: "G", team: "them", gk: true, dim: true, path: [[0, 15, 42.5]] },
  { id: "t2", team: "them", dim: true, path: [[0, 9, 37]] },
  { id: "t3", team: "them", dim: true, path: [[0, 21, 34]] },
  { id: "t4", team: "them", dim: true, path: [[0, 18, 14]] },
  { id: "t5", team: "them", dim: true, path: [[0, 7, 12]] },
];
const dragBack = {
  id: "stahni-podrazkou",
  title: "Stáhni podrážkou",
  icon: "👟",
  dur: 10.4,
  beats: [
    ...dragStart,
    { t: 2.6, text: "Podrážku na míč a stáhni ho k sobě.", say: "Polož podrážku na míč a stáhni si ho k sobě, dozadu. Míč máš pořád u nohy." },
    { t: 5.2, text: "Otoč se a jeď tam, kde je volno.", say: "Otoč se a s míčem odjeď tam, kde je volno. Soupeř musí brzdit a otáčet se." },
    { t: 7.8, text: "Míč máš pořád ty. Teď přihraj!", say: "Míč máš pořád ty a soupeř to nestihl. Teď se rozhlédni a přihraj volnému kamarádovi." },
  ],
  players: [
    ...dragTeam,
    { id: "ty", team: "us", n: 4, tag: "Ty", hl: true, path: [[0, 12, 18], [0.3, 12, 18], [2.6, 12, 23.5], [3.4, 12.3, 22.8], [5.2, 12.3, 22.8], [7.4, 6.6, 19.6]] },
    { id: "t1", team: "them", path: [[0, 12, 33], [0.3, 12, 33], [2.6, 12, 27.2], [4.4, 12, 26.2], [6.4, 11.4, 25.6], [8.6, 9.4, 24]] },
  ],
  ball: [[0, "ty"], [2.6, "ty"], [3.4, 10.4, 22.2], [5.2, 10.4, 22.2], [6.3, 8.1, 20.5], [7.4, 5.3, 18.9], [8.6, 5.3, 18.9], [9.6, "a"], [10.4, "a"]],
  marks: [
    { kind: "dribble", from: [12, 19.5], to: [12, 24.6], t: [0.3] },
    { kind: "run", team: "them", from: [12, 33], to: [12, 27.9], t: [0.3] },
    { kind: "dribble", from: [12.2, 24.8], to: [10.8, 22.6], t: [2.6] },
    { kind: "label", at: [17.6, 22.4], text: "Podrážka", t: [2.6, 5.2] },
    { kind: "dribble", from: [10.4, 22.2], to: [5.6, 18.6], t: [5.2] },
    { kind: "pass", from: [5.3, 18.9], to: [5, 28.3], t: [8.6] },
  ],
  why: "Stažení podrážkou: hráč položí podrážku na horní část míče, stáhne ho k sobě a otočí se s ním do volného prostoru. Hodí se, když obránce zavře cestu dopředu a hráč nemá kam uhnout do strany. Míč zůstane u hráče a obránce musí brzdit a měnit směr. Trénujte oběma nohama.",
  quiz: {
    at: 2.4,
    ask: "Soupeř ti zavřel cestu dopředu. Co uděláš?",
    options: [
      { text: "Stáhnu míč podrážkou a otočím se", ok: true },
      { text: "Pojedu dál přímo do něj", ok: false },
      { text: "Nechám míč ležet a uteču", ok: false },
    ],
  },
  bad: {
    beats: [
      ...dragStart,
      { t: 2.6, text: "Ty ale jedeš dál přímo do soupeře.", say: "Ty ale jedeš dál přímo do soupeře. Cestu máš zavřenou a nemáš kam uhnout." },
      { t: 5.2, text: "Soupeř ti míč vzal a jde na bránu.", say: "Soupeř ti míč snadno vzal a už jde na naši bránu." },
      { t: 7.8, text: "Zavřeno? Stáhni podrážkou a otoč se!", say: "Když máš cestu zavřenou, nejeď do soupeře. Stáhni si míč podrážkou, otoč se a jeď do volna." },
    ],
    players: [
      ...dragTeam,
      { id: "ty", team: "us", n: 4, tag: "Ty", hl: true, path: [[0, 12, 18], [0.3, 12, 18], [2.6, 12, 23.5], [4.6, 12, 24.9]] },
      {
        id: "t1", team: "them",
        path: [[0, 12, 33], [0.3, 12, 33], [2.6, 12, 27.2], [4.6, 12, 27.2], [5.4, 12.4, 27.2], [6.4, 15.6, 27.2], [8.4, 18.2, 21.6], [10.4, 19, 18]],
      },
    ],
    ball: [[0, "ty"], [4.7, "ty"], [5, "t1"], [10.4, "t1"]],
    marks: [
      { kind: "dribble", from: [12, 19.5], to: [12, 25.8], t: [0.3, 4.6] },
      { kind: "run", team: "them", from: [12, 33], to: [12, 27.9], t: [0.3] },
      { kind: "x", at: [8.4, 26.4], t: [5] },
      { kind: "dribble", team: "them", from: [15.6, 25.7], to: [18.6, 19], t: [6.4] },
    ],
  },
};

/* 3. Otočka za nohu (Cruyff): soupeř skočí do kopu → míč za stojnou nohu a pryč. */
const turnStart = [
  { t: 0, text: "Jedeš po kraji a soupeř běží k tobě.", say: "Vedeš míč podél kraje a soupeř ti běží naproti, aby tě zastavil." },
];
const turnTeam = [
  { id: "g", team: "us", gk: true, n: 1, path: [[0, 15, 2.5]] },
  { id: "a", team: "us", n: 2, dim: true, path: [[0, 8, 14]] },
  { id: "b", team: "us", n: 3, dim: true, path: [[0, 20, 12]] },
  { id: "c", team: "us", n: 4, dim: true, path: [[0, 17, 23]] },
  { id: "d", team: "us", n: 6, dim: true, path: [[0, 24, 28]] },
  { id: "G", team: "them", gk: true, dim: true, path: [[0, 15, 42.5]] },
  { id: "t2", team: "them", dim: true, path: [[0, 17, 38.5]] },
  { id: "t3", team: "them", dim: true, path: [[0, 23, 35]] },
  { id: "t4", team: "them", dim: true, path: [[0, 12, 18]] },
  { id: "t5", team: "them", dim: true, path: [[0, 24, 18]] },
];
const t1Lunge = [[0, 11, 37.4], [0.3, 11, 37.4], [2.6, 8.4, 35.8], [3, 8.4, 35.8], [3.8, 6.9, 34.8], [6.4, 6.9, 34.8]];
const cruyff = {
  id: "otocka-za-nohu",
  title: "Otočka za nohu",
  icon: "🔄",
  dur: 10.4,
  beats: [
    ...turnStart,
    { t: 2.6, text: "Napřáhni se, jako bys chtěl kopnout…", say: "Napřáhni se, jako bys chtěl kopnout míč do vápna. Soupeř se lekne a natáhne nohu." },
    { t: 5.2, text: "…a schovej si míč za stojnou nohu!", say: "Místo kopu si míč vnitřní stranou nohy schovej za stojnou nohu a otoč se. Soupeř jede na špatnou stranu." },
    { t: 7.8, text: "Soupeř je pryč. Máš volno dovnitř!", say: "Soupeř skočil na špatnou stranu. Ty máš míč a volno doprostřed hřiště." },
  ],
  players: [
    ...turnTeam,
    { id: "ty", team: "us", n: 5, tag: "Ty", hl: true, path: [[0, 4.5, 25], [0.3, 4.5, 25], [2.6, 4.5, 32.2], [5.2, 4.5, 32.2], [6, 4.6, 31.8], [7.8, 9.8, 28.4], [9.6, 13.2, 28.6]] },
    { id: "t1", team: "them", path: [...t1Lunge, [7.4, 7.2, 34.4], [9.2, 9.6, 32.2]] },
  ],
  ball: [[0, "ty"], [5.2, "ty"], [6, 5.9, 30.6], [7.8, 11.1, 27.6], [9.6, 14.7, 28.7], [10.4, 14.7, 28.7]],
  marks: [
    { kind: "dribble", from: [4.5, 26.5], to: [4.5, 33.3], t: [0.3] },
    { kind: "run", team: "them", from: [11, 37.4], to: [8.6, 35.9], t: [0.3, 3] },
    { kind: "line", from: [4.5, 33.7], to: [12.5, 38.6], t: [2.6, 5.2] },
    { kind: "label", at: [4.4, 38.4], text: "Naznač kop", t: [2.6, 5.2] },
    { kind: "dribble", from: [4.5, 33.7], to: [6, 30.7], t: [5.2] },
    { kind: "dribble", from: [6, 30.7], to: [14.4, 28.7], t: [6] },
  ],
  why: "Otočka za nohu (Cruyffova otočka): hráč se napřáhne jako ke střele nebo centru, ale místo kopu si míč vnitřní stranou nohy stáhne za stojnou nohu a odjede opačným směrem. Obránce, který se vrhl do kopu, zůstane na špatné straně. Hodí se hlavně u postranní čáry, když obránce zavírá cestu dopředu.",
  quiz: {
    at: 3.6,
    ask: "Soupeř ti skočil do cesty, když chceš kopnout. Co uděláš?",
    options: [
      { text: "Schovám si míč za nohu a otočím se", ok: true },
      { text: "Stejně kopnu do míče", ok: false },
      { text: "Zastavím se a počkám", ok: false },
    ],
  },
  bad: {
    beats: [
      ...turnStart,
      { t: 2.6, text: "Kopneš, i když ti soupeř stojí v cestě…", say: "Ty ale opravdu kopneš, i když ti soupeř stojí přímo v cestě." },
      { t: 5.2, text: "Míč se od něj odrazil do autu.", say: "Míč se odrazil od soupeřovy nohy a letí do autu. Teď mají míč soupeři." },
      { t: 7.8, text: "Soupeř v cestě? Naznač kop a otoč se!", say: "Když ti soupeř stojí v cestě, nekopej do něj. Naznač kop, schovej si míč za nohu a otoč se." },
    ],
    players: [
      ...turnTeam,
      { id: "ty", team: "us", n: 5, tag: "Ty", hl: true, path: [[0, 4.5, 25], [0.3, 4.5, 25], [2.6, 4.5, 32.2]] },
      { id: "t1", team: "them", path: t1Lunge },
    ],
    ball: [[0, "ty"], [3.8, "ty"], [4.2, 6.4, 35.2], [5.2, -1.4, 36.6], [10.4, -1.4, 36.6]],
    marks: [
      { kind: "dribble", from: [4.5, 26.5], to: [4.5, 33.3], t: [0.3] },
      { kind: "run", team: "them", from: [11, 37.4], to: [8.6, 35.9], t: [0.3, 3] },
      { kind: "shot", from: [4.5, 33.7], to: [6.2, 35], t: [3.8] },
      { kind: "pass", from: [6.4, 35.2], to: [-1, 36.5], t: [4.2] },
      { kind: "x", at: [2.2, 39.8], t: [5.2] },
    ],
  },
};

/* 4. Přešlapovačka: jedna a hned pryč, ne pořád dokola. */
const stepStart = [
  { t: 0, text: "Soupeř stojí mezi tebou a bránou.", say: "Jedeš s míčem k bráně a soupeř stojí přímo mezi tebou a bránou." },
];
const stepTeam = [
  { id: "g", team: "us", gk: true, n: 1, path: [[0, 15, 2.5]] },
  { id: "a", team: "us", n: 2, dim: true, path: [[0, 9, 12]] },
  { id: "b", team: "us", n: 3, dim: true, path: [[0, 21, 12]] },
  { id: "c", team: "us", n: 4, dim: true, path: [[0, 10, 24]] },
  { id: "d", team: "us", n: 5, dim: true, path: [[0, 5, 33]] },
  { id: "t2", team: "them", dim: true, path: [[0, 6, 36.4]] },
  { id: "t4", team: "them", dim: true, path: [[0, 14, 17]] },
  { id: "t5", team: "them", dim: true, path: [[0, 24, 19]] },
];
const stepTy = [[0, 20, 26], [0.3, 20, 26], [2.6, 20, 30.6], [3.2, 21.1, 30.7]];
const stepOver = {
  id: "preslapovacka",
  title: "Přešlapovačka",
  icon: "🦶",
  dur: 10.4,
  beats: [
    ...stepStart,
    { t: 2.6, text: "Přešlápni míč, jako bys šel doprava…", say: "Přešlápni míč nohou, jako bys chtěl jet doprava. Soupeř uvěří a udělá krok doprava." },
    { t: 5.2, text: "…a odjeď doleva. Vystřel!", say: "A teď si míč vezmi druhou nohou doleva a odjeď kolem soupeře. Máš volno, tak hned vystřel." },
    { t: 7.8, text: "Gól! Jedna přešlapovačka stačila.", say: "Gól! Stačila jedna přešlapovačka a hned dál. Soupeř se nestihl ani otočit." },
  ],
  players: [
    ...stepTeam,
    { id: "ty", team: "us", n: 6, tag: "Ty", hl: true, path: [...stepTy, [3.8, 21.2, 30.6], [5.2, 21.2, 30.6], [6.2, 17.2, 32.2], [7, 16.2, 34.6]] },
    { id: "G", team: "them", gk: true, path: [[0, 15, 42.5], [7.4, 15, 42.5], [8, 16.4, 42.6]] },
    { id: "t1", team: "them", path: [[0, 20, 34.4], [3, 20, 34.4], [3.9, 21.6, 34.2], [5.6, 21.6, 34.2], [7.2, 19.6, 34.8], [8.4, 18.8, 35.6]] },
    { id: "t3", team: "them", dim: true, path: [[0, 11, 39]] },
  ],
  ball: [[0, "ty"], [2.6, "ty"], [5.2, 20, 32.1], [6.2, "ty"], [7.2, "ty"], [8, 13.4, 45.2], [10.4, 13.4, 45.2]],
  marks: [
    { kind: "dribble", from: [20, 27.5], to: [20, 31.7], t: [0.3] },
    { kind: "run", from: [20, 30.6], to: [22.8, 30.8], t: [2.6, 5.2] },
    { kind: "label", at: [27.4, 29.2], text: "Přešlápni", t: [2.6, 5.2] },
    { kind: "run", team: "them", from: [20, 34.4], to: [21.6, 34.2], t: [3, 5.6] },
    { kind: "dribble", from: [20, 32.1], to: [16.4, 35.6], t: [5.2] },
    { kind: "shot", from: [16.2, 36.1], to: [13.5, 44.8], t: [7.2] },
    { kind: "check", at: [10.4, 42], t: [8] },
  ],
  why: "Přešlapovačka: hráč přejde nohou přes míč (nebo kolem něj), jako by s ním chtěl jet tím směrem, a pak míč vezme vnější stranou druhé nohy a odjede opačně. Stačí jedna, nanejvýš dvě. Obránce, kterého to nenachytá, si jinak jen počká a mezitím mu přiběhne pomoc. Po přešlapovačce hned zrychlit.",
  quiz: {
    at: 4,
    ask: "Soupeř uvěřil, že půjdeš doprava. Co uděláš teď?",
    options: [
      { text: "Hned odjedu doleva", ok: true },
      { text: "Přešlápnu míč ještě jednou", ok: false },
      { text: "Zastavím se", ok: false },
    ],
  },
  bad: {
    beats: [
      ...stepStart,
      { t: 2.6, text: "Ty ale přešlapuješ pořád dokola…", say: "Ty ale přešlapuješ pořád dokola, doprava, doleva, doprava. Soupeř se jen dívá a čeká." },
      { t: 5.2, text: "Soupeř počkal a přiběhl další.", say: "Soupeř se nenechal nachytat. Počkal, a mezitím mu na pomoc přiběhl další." },
      { t: 7.8, text: "Míč je pryč. Přešlápni jednou a jeď!", say: "Soupeři ti míč vzali. Přešlápni jednou a hned odjeď, než soupeř pochopí, co děláš." },
    ],
    players: [
      ...stepTeam,
      { id: "ty", team: "us", n: 6, tag: "Ty", hl: true, path: [...stepTy, [3.8, 20, 30.6], [4.4, 18.9, 30.7], [5, 20, 30.6], [5.6, 21.1, 30.7], [6.2, 20, 30.6]] },
      { id: "G", team: "them", gk: true, path: [[0, 15, 42.5]] },
      { id: "t1", team: "them", path: [[0, 20, 34.4], [7.2, 20, 34.4], [7.6, 20, 33], [8.2, 22.8, 33.6], [10.4, 25.6, 28.4]] },
      { id: "t3", team: "them", path: [[0, 11, 39], [5.2, 11, 39], [7, 16.6, 32.6]] },
    ],
    ball: [[0, "ty"], [2.6, "ty"], [7.6, 20, 32.1], [7.9, "t1"], [10.4, "t1"]],
    marks: [
      { kind: "dribble", from: [20, 27.5], to: [20, 31.7], t: [0.3] },
      { kind: "label", at: [26.9, 28.2], text: "Pořád dokola", tone: "bad", t: [2.6, 7.6] },
      { kind: "run", team: "them", from: [11, 39], to: [16.2, 33], t: [5.2] },
      { kind: "x", at: [20, 37], t: [8] },
      { kind: "dribble", team: "them", from: [22.8, 32.1], to: [25.6, 27], t: [8.2] },
    ],
  },
};

/* 5. Zastav a vyraž: soupeř běží vedle tebe → prudce zastav, nechej ho proběhnout a vyraž za jeho záda. */
const stopStart = [
  { t: 0, text: "Soupeř běží vedle tebe a hlídá tě.", say: "Vedeš míč po kraji a soupeř běží vedle tebe. Je stejně rychlý jako ty." },
];
const stopTeam = [
  { id: "g", team: "us", gk: true, n: 1, path: [[0, 15, 2.5]] },
  { id: "a", team: "us", n: 2, dim: true, path: [[0, 8, 10]] },
  { id: "b", team: "us", n: 3, dim: true, path: [[0, 16, 12]] },
  { id: "c", team: "us", n: 4, dim: true, path: [[0, 8, 24]] },
  { id: "d", team: "us", n: 6, dim: true, path: [[0, 6, 34]] },
  { id: "G", team: "them", gk: true, dim: true, path: [[0, 15, 42.5]] },
  { id: "t2", team: "them", dim: true, path: [[0, 9, 38.5]] },
  { id: "t3", team: "them", dim: true, path: [[0, 24.5, 37]] },
  { id: "t4", team: "them", dim: true, path: [[0, 12, 19]] },
  { id: "t5", team: "them", dim: true, path: [[0, 17, 8.5]] },
];
const stopTy = [[0, 24, 16], [0.3, 24, 16], [2.6, 24, 22.5]];
const stopT1 = [[0, 20.4, 16.5], [0.3, 20.4, 16.5], [2.6, 20.4, 23]];
const stopGo = {
  id: "zastav-a-vyraz",
  title: "Zastav a vyraž",
  icon: "🚦",
  dur: 10.4,
  beats: [
    ...stopStart,
    { t: 2.6, text: "Najednou zastav míč podrážkou!", say: "Najednou prudce zastav míč podrážkou. Soupeř to nečeká a běží ještě kus dál." },
    { t: 5.2, text: "Teď vyraž za jeho záda!", say: "A teď vyraž! Zrychli za jeho záda, než se soupeř stihne zastavit a otočit." },
    { t: 7.8, text: "Soupeř musel brzdit. Máš náskok!", say: "Soupeř musel zabrzdit a otočit se. Ty už jsi pryč a máš velký náskok." },
  ],
  players: [
    ...stopTeam,
    { id: "ty", team: "us", n: 5, tag: "Ty", hl: true, path: [...stopTy, [3, 24, 23.2], [5.2, 24, 23.2], [6.6, 17.6, 25.6], [8.4, 14.5, 32], [10.4, 14, 35]] },
    { id: "t1", team: "them", path: [...stopT1, [4, 20.4, 28], [6.6, 20.4, 28.4], [8.6, 18.6, 30.4], [10.4, 17.6, 32.6]] },
  ],
  ball: [[0, "ty"], [10.4, "ty"]],
  marks: [
    { kind: "dribble", from: [24, 17.5], to: [24, 23.8], t: [0.3] },
    { kind: "run", team: "them", from: [20.4, 16.5], to: [20.4, 22.4], t: [0.3, 2.6] },
    { kind: "run", team: "them", from: [20.4, 23], to: [20.4, 28.4], t: [2.6] },
    { kind: "label", at: [28.8, 24.2], text: "Stop!", t: [2.6, 5.2] },
    { kind: "dribble", from: [24, 24.7], to: [17.8, 27], t: [5.2] },
    { kind: "dribble", from: [17.6, 27.1], to: [14.5, 34.5], t: [6.6] },
  ],
  why: "Změna rychlosti je nejjednodušší a nejúčinnější klička. Když obránce běží vedle hráče, prudké zastavení míče podrážkou ho nechá proběhnout dál a následné vyražení (nejlépe za jeho záda) mu nedá čas zareagovat. Kdo vede míč pořád stejně rychle, toho obránce snadno doprovodí a zastaví.",
  quiz: {
    at: 4.4,
    ask: "Zastavil jsi a soupeř běžel dál. Co uděláš teď?",
    options: [
      { text: "Prudce vyrazím za jeho záda", ok: true },
      { text: "Počkám, až se vrátí", ok: false },
      { text: "Pojedu dál pomalu", ok: false },
    ],
  },
  bad: {
    beats: [
      ...stopStart,
      { t: 2.6, text: "Ty ale jedeš pořád stejně rychle…", say: "Ty ale jedeš pořád stejně rychle a rovně. Soupeř běží vedle tebe a nemusí nic měnit." },
      { t: 5.2, text: "Soupeř tě předběhl a míč ti vzal.", say: "Soupeř běžel pořád s tebou. Předběhl tě, postavil se ti do cesty a míč ti vzal." },
      { t: 7.8, text: "Měň rychlost: zastav a vyraž!", say: "Měň rychlost. Zpomal, zastav míč podrážkou a pak prudce vyraž. Soupeř to nestihne." },
    ],
    players: [
      ...stopTeam,
      { id: "ty", team: "us", n: 5, tag: "Ty", hl: true, path: [...stopTy, [6, 24, 30], [6.4, 24, 30.4]] },
      { id: "t1", team: "them", path: [...stopT1, [5.6, 21, 30.4], [6.4, 21.6, 32.4], [7.2, 21.6, 32.4], [9.4, 17, 28], [10.4, 15.6, 26.4]] },
    ],
    ball: [[0, "ty"], [6.6, "ty"], [6.9, "t1"], [10.4, "t1"]],
    marks: [
      { kind: "dribble", from: [24, 17.5], to: [24, 31.5], t: [0.3, 6.6] },
      { kind: "run", team: "them", from: [20.4, 16.5], to: [21, 30.4], t: [0.3, 5.6] },
      { kind: "x", at: [27.6, 33.6], t: [6.9] },
      { kind: "dribble", team: "them", from: [21.6, 30.9], to: [16.4, 26.2], t: [7.2] },
    ],
  },
};

/* 6. Kde kličkovat: u soupeřovy brány ano, u naší přihraj. */
const whereStart = [
  { t: 0, text: "U jejich brány kličkuj, u naší ne.", say: "Kličky patří k soupeřově bráně. U naší brány je to moc nebezpečné." },
  { t: 2.6, text: "Máš míč u naší brány a soupeř běží k tobě.", say: "Máš míč kousek od naší brány a soupeř už běží k tobě." },
];
const whereTeam = [
  { id: "b", team: "us", n: 4, path: [[0, 24, 14]] },
  { id: "a", team: "us", n: 2, dim: true, path: [[0, 5, 18]] },
  { id: "c", team: "us", n: 5, dim: true, path: [[0, 14, 24]] },
  { id: "d", team: "us", n: 6, dim: true, path: [[0, 22, 30]] },
  { id: "G", team: "them", gk: true, dim: true, path: [[0, 15, 42.5]] },
  { id: "t2", team: "them", dim: true, path: [[0, 8, 30]] },
  { id: "t3", team: "them", dim: true, path: [[0, 19.5, 34.5]] },
  { id: "t4", team: "them", dim: true, path: [[0, 20, 22]] },
  { id: "t5", team: "them", dim: true, path: [[0, 26.5, 25]] },
];
const whereZones = [
  { kind: "zone", rect: [0, 30, 30, 15], text: "Tady kličkuj", t: [0, 5.2] },
  { kind: "zone", rect: [0, 0, 30, 15], tone: "bad", text: "Tady nekličkuj", at: [18.6, 7.2], t: [0, 5.2] },
  { kind: "run", team: "them", from: [13, 19], to: [11.6, 14.2], t: [2.6, 4.6] },
];
const t1Press = [[0, 13, 19], [2.6, 13, 19], [4.6, 11.4, 13.4]];
const where = {
  id: "kde-klickovat",
  title: "Kde kličkovat",
  icon: "🗺️",
  dur: 10.4,
  beats: [
    ...whereStart,
    { t: 5.2, text: "Nekličkuj. Přihraj volnému kamarádovi!", say: "Tady nekličkuj. Přihraj volnému kamarádovi na kraji, ať je míč dál od naší brány." },
    { t: 7.8, text: "Míč je v bezpečí. Kličky až dopředu!", say: "Míč je v bezpečí a naše brána taky. Kličky si nech až dopředu, k soupeřově bráně." },
  ],
  players: [
    ...whereTeam,
    { id: "g", team: "us", gk: true, n: 1, path: [[0, 15, 2.5]] },
    { id: "ty", team: "us", n: 3, tag: "Ty", hl: true, path: [[0, 10, 9]] },
    { id: "t1", team: "them", path: [...t1Press, [6, 11.4, 13.4], [8, 15.6, 13.8]] },
  ],
  ball: [[0, "ty"], [5.4, "ty"], [6.4, "b"], [10.4, "b"]],
  marks: [
    ...whereZones,
    { kind: "pass", from: [10, 10.5], to: [23.4, 13.8], t: [5.4] },
    { kind: "check", at: [24, 18.2], t: [6.4] },
  ],
  why: "Klička je riskantní: když nevyjde, má míč soupeř. U soupeřovy brány je ztráta malá a povedená klička často znamená gól, u vlastní brány dává ztráta soupeři šanci. Kličkovat se děti v přípravce učí všude a chyba k tomu patří. Když je ale u naší brány soupeř blízko a kamarád volný, je přihrávka bezpečnější. Odvážné kličky povzbuzujte hlavně u soupeřovy brány.",
  quiz: {
    at: 4,
    ask: "Máš míč u naší brány a soupeř běží k tobě. Co uděláš?",
    options: [
      { text: "Přihraju volnému kamarádovi", ok: true },
      { text: "Zkusím ho obejít kličkou", ok: false },
      { text: "Zastavím se a počkám", ok: false },
    ],
  },
  bad: {
    beats: [
      ...whereStart,
      { t: 5.2, text: "Ty ale kličkuješ před naší bránou…", say: "Ty ale zkoušíš kličku přímo před naší bránou. Soupeř ji prokoukl a míč ti vzal." },
      { t: 7.8, text: "Gól! U naší brány nekličkuj, přihraj.", say: "Soupeř to měl k bráně kousek a dal gól. U naší brány nekličkuj a přihraj kamarádovi." },
    ],
    players: [
      ...whereTeam,
      { id: "g", team: "us", gk: true, n: 1, path: [[0, 15, 2.5], [7.2, 15, 2.5], [7.8, 16.6, 2.4]] },
      { id: "ty", team: "us", n: 3, tag: "Ty", hl: true, path: [[0, 10, 9], [5.2, 10, 9], [5.8, 8.6, 9.6], [6.4, 9.2, 9.8]] },
      { id: "t1", team: "them", path: [...t1Press, [5.8, 10.6, 12.2], [6.6, 10.6, 12]] },
    ],
    ball: [[0, "ty"], [6, "ty"], [6.4, "t1"], [7, "t1"], [7.6, 14, -0.6], [10.4, 14, -0.6]],
    marks: [
      ...whereZones,
      { kind: "shot", team: "them", from: [10.6, 10.5], to: [14, -0.4], t: [7] },
      { kind: "x", at: [5.4, 4.4], t: [7.6] },
    ],
  },
};

export const DRIBBLING = {
  id: "klicky",
  title: "Kličky",
  lead: "Jak obejít soupeře a neztratit míč.",
  scenes: [feint, dragBack, cruyff, stepOver, stopGo, where],
};
