/* Obrana — nemáme míč. Souřadnice v metrech: x 0..W zleva, y 0..L od NAŠÍ branky (dole).
   Soupeř (modří) útočí DOLŮ na naši bránu (y = 0). Formát scény popisuje src/components/Scene.jsx.
   Naši hráči: 1 brankář, 2 a 3 obránci, 4 střed, 5 a 6 útočníci (rozestavení 2-1-2).
   Titulky krátké, Kopík nahlas (say) dovysvětlí, co je dobře / špatně a proč.
   Každá akce začíná u titulku, který ji popisuje (titulky po 2,6 s). */

/* 1. Přechod do obrany: ztráta → nejbližší hned zpátky na míč, ostatní mezi míč a bránu. */
const regain = {
  id: "hned-zpatky",
  title: "Ztráta? Hned zpátky!",
  icon: "🔄",
  dur: 12.4,
  beats: [
    { t: 0, text: "Pozor! Soupeř ti bere míč.", say: "Pozor, soupeř ti bere míč! Teď poběží on na naši bránu." },
    { t: 2.6, text: "Hned zpátky – mezi míč a naši bránu!", say: "Všichni hned zpátky, mezi míč a naši bránu! Soupeř pak nemá volnou cestu k bráně." },
    { t: 5.2, text: "Jsi nejblíž – hned mu míč vezmi!", say: "Ty jsi u soupeře nejblíž, tak mu míč hned vezmi. Ještě ho nemá pořádně u nohy." },
    { t: 7.8, text: "Máš ho! Míč je zase náš.", say: "Máš ho! Soupeř se ani nestihl rozkoukat a míč je zase náš." },
    { t: 10.4, text: "Pamatuj: ztratíš míč? Hned zpátky!", say: "Pamatuj si: když ztratíš míč, nestůj a hned běž zpátky." },
  ],
  players: [
    { id: "g", team: "us", gk: true, n: 1, path: [[0, 15, 3.5], [2.6, 15, 3.5], [4.8, 14.4, 3]] },
    { id: "lo", team: "us", n: 2, path: [[0, 9, 15], [2.6, 9, 15], [4.8, 10.5, 12]] },
    { id: "po", team: "us", n: 3, path: [[0, 21, 15], [2.6, 21, 15], [4.8, 18.5, 12]] },
    { id: "st", team: "us", n: 4, path: [[0, 15, 21], [2.6, 15, 21], [4.8, 14.2, 17]] },
    {
      id: "ty", team: "us", n: 5, tag: "Ty", hl: true,
      path: [[0, 8, 26], [1.9, 8, 28.6], [2.6, 8, 28.6], [4.8, 11.6, 22.4], [5.2, 11.6, 22.4], [5.9, 11.9, 23.4], [7.8, 11.9, 23.4], [9.2, 7.5, 24.5]],
    },
    { id: "pu", team: "us", n: 6, path: [[0, 22, 30.5], [2.6, 22, 30.5], [5.3, 18.5, 22]] },
    { id: "G", team: "them", gk: true, path: [[0, 15, 42.5]] },
    {
      id: "t1", team: "them",
      path: [[0, 11.5, 35], [1.9, 10.5, 31.4], [2.6, 10.5, 31.4], [4.8, 13, 26.3], [5.9, 13, 26.3], [7.2, 13.8, 27.5]],
    },
    { id: "t2", team: "them", path: [[0, 20, 37]] },
    { id: "t3", team: "them", path: [[0, 16, 32], [2.7, 16, 32], [4.9, 17.5, 27.5]] },
    { id: "t4", team: "them", path: [[0, 9, 20], [2.7, 9, 20], [4.9, 7.5, 16]] },
    { id: "t5", team: "them", path: [[0, 21, 21], [2.7, 21, 21], [4.9, 22.5, 17]] },
  ],
  ball: [[0, "ty"], [1.9, "ty"], [2.15, "t1"], [5.5, "t1"], [5.8, "ty"], [9.2, "ty"]],
  marks: [
    { kind: "run", from: "ty", to: [11.6, 22.4], t: [2.6, 5.1] },
    { kind: "run", from: "st", to: [14.2, 17], t: [2.6, 5.1] },
    { kind: "run", from: "pu", to: [18.5, 22], t: [2.6, 5.5] },
    { kind: "run", from: "lo", to: [10.5, 12], t: [2.6, 5.1] },
    { kind: "run", from: "po", to: [18.5, 12], t: [2.6, 5.1] },
    { kind: "check", at: [4, 24.5], t: [7.8] },
  ],
  why: "Přechod do obrany: hned po ztrátě napadá nejbližší hráč (soupeř ještě nemá míč pod kontrolou) a ostatní se okamžitě vracejí mezi míč a vlastní branku. Kdo po ztrátě zůstane stát, dává soupeři volný prostor k rychlému protiútoku.",
  quiz: {
    at: 2.45,
    ask: "Soupeř ti vzal míč. Co uděláš?",
    options: [
      { text: "Hned zpátky pro míč", ok: true },
      { text: "Zastavím se, škoda", ok: false },
      { text: "Počkám vepředu", ok: false },
    ],
  },
  bad: {
    dur: 12.4,
    beats: [
      { t: 0, text: "Pozor! Soupeř ti bere míč.", say: "Pozor, soupeř ti bere míč! Teď poběží on na naši bránu." },
      { t: 2.6, text: "Všichni jen stojí a koukají…", say: "Ty i kamarádi jen stojíte a koukáte za míčem. Jenže soupeř nečeká a už běží." },
      { t: 5.2, text: "Soupeř má volnou cestu na bránu.", say: "Nikdo se nevrací zpátky, a tak soupeř běží s míčem až k naší bráně." },
      { t: 7.8, text: "Střela – a gól.", say: "Střela a gól! Brankář proti němu zůstal úplně sám." },
      { t: 10.4, text: "Příště hned zpátky, mezi míč a bránu!", say: "Kdo po ztrátě míče stojí, pomáhá soupeři. Příště hned běž zpátky, mezi míč a naši bránu." },
    ],
    players: [
      { id: "g", team: "us", gk: true, n: 1, path: [[0, 15, 3.5], [6.0, 15, 3.5], [7.6, 15.6, 3]] },
      { id: "lo", team: "us", n: 2, path: [[0, 9, 15]] },
      { id: "po", team: "us", n: 3, path: [[0, 21, 15]] },
      { id: "st", team: "us", n: 4, path: [[0, 15, 21]] },
      { id: "ty", team: "us", n: 5, tag: "Ty", hl: true, path: [[0, 8, 26], [1.9, 8, 28.6]] },
      { id: "pu", team: "us", n: 6, path: [[0, 22, 30.5]] },
      { id: "G", team: "them", gk: true, path: [[0, 15, 42.5]] },
      { id: "t1", team: "them", path: [[0, 11.5, 35], [1.9, 10.5, 31.4], [2.6, 10.5, 31.4], [7.6, 13.5, 14]] },
      { id: "t2", team: "them", path: [[0, 20, 37]] },
      { id: "t3", team: "them", path: [[0, 16, 32], [2.7, 16, 32], [5.5, 18.5, 22]] },
      { id: "t4", team: "them", path: [[0, 9, 20], [2.7, 9, 20], [5.5, 6.5, 16.5]] },
      { id: "t5", team: "them", path: [[0, 21, 21], [2.7, 21, 21], [5.5, 24, 17.5]] },
    ],
    ball: [[0, "ty"], [1.9, "ty"], [2.15, "t1"], [7.8, "t1"], [8.6, 12.9, -0.8]],
    marks: [
      { kind: "x", at: [4.6, 30.4], t: [2.6] },
      // volno až od čtyřky dolů (čtyřka sama stojí mimo zónu)
      { kind: "zone", rect: [10.5, 6, 6, 13], at: [13.5, 8], tone: "bad", text: "Volno", t: [5.2, 7.8] },
      { kind: "shot", from: [13.5, 12.5], to: [12.9, -0.8], t: [7.8] },
    ],
  },
};

/* 2. Postavení: na spojnici soupeř – střed naší branky. */
const goalSide = {
  id: "mezi-souper-a-branu",
  title: "Mezi soupeře a bránu",
  icon: "🧱",
  dur: 10.2,
  beats: [
    { t: 0, text: "Soupeř má míč a jde na bránu.", say: "Soupeř má míč a jde na naši bránu. Tečkovaná čára ukazuje, kudy to má k bráně nejblíž." },
    { t: 2.6, text: "Postav se mezi něj a naši bránu!", say: "Postav se mezi něj a naši bránu, přímo na tu tečkovanou čáru." },
    { t: 5.2, text: "Stojíš mu v cestě.", say: "Teď mu stojíš přímo v cestě. Aby se dostal k bráně, musel by přes tebe." },
    { t: 7.8, text: "Rovně na bránu teď nemůže.", say: "Rovně na bránu teď nemůže a střílet přes tebe je těžké. Musí jít oklikou, a to mu zabere čas." },
  ],
  players: [
    { id: "g", team: "us", gk: true, n: 1, path: [[0, 15.4, 2.6]] },
    { id: "lo", team: "us", n: 2, path: [[0, 10.5, 11.5]] },
    { id: "po", team: "us", n: 3, path: [[0, 21.5, 11.5]] },
    { id: "ty", team: "us", n: 4, tag: "Ty", hl: true, path: [[0, 12.5, 25], [2.6, 12.5, 25], [4.7, 18.4, 21]] },
    { id: "lu", team: "us", n: 5, dim: true, path: [[0, 8, 30], [4, 8.5, 26]] },
    { id: "pu", team: "us", n: 6, dim: true, path: [[0, 25, 31], [4, 24, 27]] },
    { id: "G", team: "them", gk: true, dim: true, path: [[0, 15, 42.5]] },
    { id: "t1", team: "them", dim: true, path: [[0, 11, 35]] },
    { id: "t2", team: "them", dim: true, path: [[0, 20, 37]] },
    // soupeř se blíží po tečkované čáře a před tebou se zastaví
    { id: "t3", team: "them", path: [[0, 20, 30.5], [1.2, 19.5, 27.5], [2.6, 19.5, 27.5], [5.2, 19.2, 25.8], [6.6, 18.9, 24.2]] },
    { id: "t4", team: "them", path: [[0, 9.5, 16.5]] },
    { id: "t5", team: "them", path: [[0, 23, 16.5]] },
  ],
  ball: [[0, "t3"], [6.6, "t3"]],
  marks: [
    { kind: "line", from: "t3", to: [15, 0], t: [1.2] },
    { kind: "run", from: "ty", to: [18.4, 21], t: [2.6, 5.0] },
    { kind: "check", at: [15.2, 21], t: [6.6] },
  ],
  why: "Základní obranné postavení: obránce stojí na pomyslné spojnici soupeře s míčem a středu vlastní branky, čelem k míči. Soupeř tak nemá přímou cestu ani střelu na branku a musí jít oklikou.",
  quiz: {
    at: 0.8,
    ask: "Soupeř má míč. Kam se postavíš?",
    options: [
      { text: "Mezi něj a naši bránu", ok: true },
      { text: "Vedle něj", ok: false },
      { text: "Za něj", ok: false },
    ],
  },
  bad: {
    dur: 12.4,
    beats: [
      { t: 0, text: "Soupeř má míč a jde na bránu.", say: "Soupeř má míč a jde na naši bránu. Tečkovaná čára ukazuje, kudy to má k bráně nejblíž." },
      { t: 2.6, text: "Běžíš k němu z boku…", say: "Ty ale běžíš k němu z boku a stoupneš si vedle něj. Cestu k bráně mu tím nezavřeš." },
      { t: 5.2, text: "Cesta k bráně je volná!", say: "Cesta k bráně je volná! Soupeř tě nechá stát a ty ho už jen doháníš." },
      { t: 7.8, text: "Střela – a gól.", say: "Střela a gól. Kdo běží za soupeřem, ten ho už nezastaví." },
      { t: 10.4, text: "Příště se postav mezi něj a bránu!", say: "Vedle soupeře mu cestu nezavřeš. Příště se postav mezi něj a naši bránu." },
    ],
    players: [
      { id: "g", team: "us", gk: true, n: 1, path: [[0, 15.4, 2.6], [5.6, 15.4, 2.6], [7.4, 16.6, 2.8]] },
      { id: "lo", team: "us", n: 2, path: [[0, 10.5, 11.5]] },
      { id: "po", team: "us", n: 3, path: [[0, 21.5, 11.5]] },
      {
        id: "ty", team: "us", n: 4, tag: "Ty", hl: true,
        path: [[0, 12.5, 25], [2.6, 12.5, 25], [4.4, 16.3, 27.3], [6.0, 16.3, 27.3], [8.0, 16.6, 20]],
      },
      { id: "lu", team: "us", n: 5, dim: true, path: [[0, 8, 30], [4, 8.5, 26]] },
      { id: "pu", team: "us", n: 6, dim: true, path: [[0, 25, 31], [4, 24, 27]] },
      { id: "G", team: "them", gk: true, dim: true, path: [[0, 15, 42.5]] },
      { id: "t1", team: "them", dim: true, path: [[0, 11, 35]] },
      { id: "t2", team: "them", dim: true, path: [[0, 20, 37]] },
      { id: "t3", team: "them", path: [[0, 20, 30.5], [1.2, 19.5, 27.5], [5.2, 19.5, 27.5], [7.6, 17, 13]] },
      { id: "t4", team: "them", path: [[0, 9.5, 16.5]] },
      { id: "t5", team: "them", path: [[0, 23, 16.5]] },
    ],
    ball: [[0, "t3"], [7.8, "t3"], [8.4, 13.1, -0.8]],
    marks: [
      { kind: "line", from: "t3", to: [15, 0], t: [1.2] },
      { kind: "run", from: "ty", to: [16.3, 27.3], t: [2.6, 4.6] },
      { kind: "x", at: [13.2, 27.6], t: [4.4] },
      { kind: "zone", rect: [14.5, 6, 6, 16], at: [17.5, 9], tone: "bad", text: "Volno", t: [5.2, 7.0] },
      { kind: "shot", from: [17, 11.5], to: [13.1, -0.8], t: [7.8] },
    ],
  },
};

/* 3. Na míč jde jen nejbližší, ostatní hlídají volné soupeře. */
const nearest = {
  id: "nejblizsi",
  title: "Nejbližší jde na míč",
  icon: "☝️",
  dur: 12.4,
  beats: [
    { t: 0, text: "Soupeř má míč.", say: "Soupeř má míč. Kdo z nás je u něj nejblíž?" },
    { t: 2.6, text: "Na míč jde jen nejbližší – kamarád.", say: "Na míč jde jen ten, kdo je nejblíž. Teď je to čtyřka." },
    { t: 5.2, text: "Ty hlídáš volného soupeře.", say: "Ty zatím hlídáš volného soupeře. Kdyby mu soupeř s míčem přihrál, jsi hned u toho." },
    { t: 7.8, text: "Přihrávka? Máš ji ty!", say: "Soupeř mu chce přihrát, ale ty jsi u toho první. Míč je náš!" },
    { t: 10.4, text: "Pamatuj: na míč jeden, ostatní hlídají.", say: "Pamatuj si: na míč jde jen ten nejbližší a ostatní hlídají volné soupeře." },
  ],
  players: [
    { id: "g", team: "us", gk: true, n: 1, path: [[0, 15, 2.5], [3, 15.6, 2.6]] },
    { id: "lo", team: "us", n: 2, path: [[0, 8.5, 11.5], [5.2, 8.5, 11.5], [6.8, 9, 14]] },
    {
      id: "ty", team: "us", n: 3, tag: "Ty", hl: true,
      path: [[0, 21.5, 11.5], [5.2, 21.5, 11.5], [6.7, 21, 15.5], [7.8, 21, 15.5], [8.4, 20.3, 17.6]],
    },
    { id: "st", team: "us", n: 4, path: [[0, 15, 16], [2.6, 15, 16], [4.6, 13.8, 21.5]] },
    { id: "lu", team: "us", n: 5, path: [[0, 9, 30], [4, 9.5, 27]] },
    { id: "pu", team: "us", n: 6, path: [[0, 21, 31], [4, 20.5, 28]] },
    { id: "G", team: "them", gk: true, dim: true, path: [[0, 15, 42.5]] },
    { id: "t1", team: "them", dim: true, path: [[0, 10, 36]] },
    { id: "t2", team: "them", dim: true, path: [[0, 20, 36]] },
    { id: "t3", team: "them", path: [[0, 15, 30], [0.3, 15, 30], [3.6, 15, 25.2]] },
    { id: "t4", team: "them", path: [[0, 6.5, 20], [3.0, 6.5, 18]] },
    { id: "t5", team: "them", path: [[0, 23.5, 20], [3.0, 23.5, 18]] },
  ],
  // soupeř zkusí přihrát volné šestce — ty, který ji hlídáš, míč zachytíš
  ball: [[0, "t3"], [7.8, "t3"], [8.4, "ty"], [12.4, "ty"]],
  marks: [
    { kind: "run", from: "st", to: [13.8, 21.5], t: [2.6, 4.9] },
    { kind: "run", from: "ty", to: [21, 15.5], t: [5.2, 7.0] },
    { kind: "check", at: [17.6, 16.5], t: [8.6] },
  ],
  why: "Na hráče s míčem jde jen ten nejbližší („první obránce“), ostatní hlídají volné soupeře a prostor mezi nimi a brankou. Když na míč běží všichni, stačí soupeři jedna přihrávka na volného hráče.",
  quiz: {
    at: 3.6,
    ask: "Kamarád běží na míč. Co ty?",
    options: [
      { text: "Hlídám volného soupeře", ok: true },
      { text: "Poběžím taky na míč", ok: false },
      { text: "Budu stát a koukat", ok: false },
    ],
  },
  bad: {
    dur: 12.4,
    beats: [
      { t: 0, text: "Soupeř má míč.", say: "Soupeř má míč. Kdo z nás je u něj nejblíž?" },
      { t: 2.6, text: "Všichni běží na míč…", say: "Ale na míč běží všichni, ty taky. Ostatní soupeře teď nikdo nehlídá." },
      { t: 5.2, text: "Soupeř přihraje volnému hráči.", say: "Soupeř přihraje volnému hráči. Nikdo z nás u něj není, všichni jsou u míče." },
      { t: 7.8, text: "Ten jde sám na bránu. Gól!", say: "Volný hráč jde sám na bránu a dá gól. Nikdo z nás ho už nedoběhne." },
      { t: 10.4, text: "Příště hlídej volného soupeře!", say: "Na míč stačí jeden, ten nejbližší. Příště hlídej volného soupeře, ať nemá komu přihrát." },
    ],
    players: [
      { id: "g", team: "us", gk: true, n: 1, path: [[0, 15, 2.5], [6.0, 15, 2.5], [9.4, 17.5, 2.6]] },
      { id: "lo", team: "us", n: 2, path: [[0, 8.5, 11.5], [2.6, 8.5, 11.5], [5.0, 10.8, 22.3]] },
      { id: "ty", team: "us", n: 3, tag: "Ty", hl: true, path: [[0, 21.5, 11.5], [2.6, 21.5, 11.5], [5.0, 19.3, 23.5]] },
      { id: "st", team: "us", n: 4, path: [[0, 15, 16], [2.6, 15, 16], [5.0, 15, 19.3]] },
      { id: "lu", team: "us", n: 5, path: [[0, 9, 30], [2.6, 9, 30], [5.0, 12, 27]] },
      { id: "pu", team: "us", n: 6, path: [[0, 21, 31], [2.6, 21, 31], [5.0, 18, 27]] },
      { id: "G", team: "them", gk: true, dim: true, path: [[0, 15, 42.5]] },
      { id: "t1", team: "them", dim: true, path: [[0, 10, 36]] },
      { id: "t2", team: "them", dim: true, path: [[0, 20, 36]] },
      { id: "t3", team: "them", path: [[0, 15, 30], [0.3, 15, 30], [3.6, 15, 25]] },
      { id: "t4", team: "them", path: [[0, 6.5, 20], [3.0, 6.5, 18]] },
      { id: "t5", team: "them", path: [[0, 23.5, 20], [3.0, 23.5, 19], [5.0, 23.5, 19], [6.1, 21, 16.8], [9.4, 17.5, 9]] },
    ],
    ball: [[0, "t3"], [5.2, "t3"], [6.1, "t5"], [9.6, "t5"], [10.3, 13, -0.8]],
    marks: [
      { kind: "zone", circle: [15, 23.5, 6.8], tone: "bad", t: [5.0] },
      { kind: "pass", team: "them", from: "ball", to: [21, 15.3], t: [5.2, 6.2] },
      { kind: "dribble", team: "them", from: [21, 15.3], to: [17.5, 7.5], t: [6.2] },
    ],
  },
};

/* 4. Zajištění: druhý obránce šikmo za prvním, mezi ním a brankou. */
const cover = {
  id: "jisti-kamarada",
  title: "Jisti kamaráda",
  icon: "🤝",
  dur: 10.4,
  beats: [
    { t: 0, text: "Kamarád jde na soupeře s míčem.", say: "Kamarád jde na soupeře s míčem. Co když ho soupeř obejde?" },
    { t: 2.6, text: "Ty ho jistíš: kousek za ním, šikmo.", say: "Ty ho jistíš. Stoupni si kousek za něj, šikmo, blíž k naší bráně." },
    { t: 5.2, text: "Soupeř kamaráda obešel…", say: "Soupeř kamaráda obešel. To se stává i nejlepším obráncům." },
    { t: 7.8, text: "…ale ty už tam jsi!", say: "Ale ty už tam jsi a míč mu vezmeš. Proto jistíš šikmo za kamarádem, ne vedle něj." },
  ],
  players: [
    { id: "g", team: "us", gk: true, n: 1, path: [[0, 15, 2.5], [3, 15.8, 2.6]] },
    { id: "lo", team: "us", n: 2, path: [[0, 9, 11], [3, 11, 12.5]] },
    {
      id: "ty", team: "us", n: 3, tag: "Ty", hl: true,
      path: [[0, 21, 13], [2.6, 21, 13], [4.6, 19.5, 18.3], [6.2, 19.5, 18.3], [7.1, 17.6, 20.8], [8.1, 17.6, 20.9], [9.3, 14.5, 21.5]],
    },
    {
      id: "st", team: "us", n: 4,
      path: [[0, 17, 23], [0.6, 17, 23], [2.2, 21.5, 23], [5.2, 21.5, 23], [5.8, 22.4, 23.2], [7.2, 21.3, 21.8]],
    },
    { id: "lu", team: "us", n: 5, dim: true, path: [[0, 9, 30], [4, 9.5, 26]] },
    { id: "pu", team: "us", n: 6, dim: true, path: [[0, 23, 34], [5, 23, 28.5]] },
    { id: "G", team: "them", gk: true, dim: true, path: [[0, 15, 42.5]] },
    { id: "t1", team: "them", dim: true, path: [[0, 10, 35]] },
    { id: "t2", team: "them", dim: true, path: [[0, 20, 37]] },
    { id: "t3", team: "them", path: [[0, 14, 30], [3, 13, 27]] },
    { id: "t4", team: "them", path: [[0, 8, 19]] },
    {
      id: "t5", team: "them",
      path: [[0, 22.5, 31], [0.4, 22.5, 31], [2.2, 22, 26.5], [5.2, 22, 26.5], [6.1, 18.6, 25], [7.1, 18.6, 23.6], [8.1, 18.6, 23.6], [9.3, 19.3, 24.6]],
    },
  ],
  ball: [[0, "t5"], [7.8, "t5"], [8.1, "ty"], [9.3, "ty"]],
  marks: [
    { kind: "run", from: "st", to: [21.5, 23], t: [0.6, 2.6] },
    { kind: "run", from: "ty", to: [19.5, 18.3], t: [2.6, 5.0] },
    { kind: "line", from: [21.5, 23], to: [19.5, 18.3], t: [4.6, 6.0] },
    { kind: "dribble", team: "them", from: [22, 25], to: [18.6, 23.4], t: [5.2, 6.8] },
    { kind: "check", at: [11.5, 21.5], t: [8.6] },
  ],
  why: "Zajištění: druhý obránce stojí šikmo za spoluhráčem, který napadá, asi 3–5 m od něj, mezi ním a brankou. Když soupeř prvního obránce obejde, druhý ho hned napadne; obránce vedle sebe v jedné řadě vyřadí jedna klička oba.",
  bad: {
    dur: 12.4,
    beats: [
      { t: 0, text: "Kamarád jde na soupeře s míčem.", say: "Kamarád jde na soupeře s míčem. Co když ho soupeř obejde?" },
      { t: 2.6, text: "Ty stojíš vedle něj, v řadě…", say: "Ty ale stojíš vedle kamaráda, v jedné řadě. Za vámi už nikdo není." },
      { t: 5.2, text: "Jedna klička a jste oba pryč!", say: "Jedna klička a soupeř je za vámi oběma. Teď už ho nikdo nezastaví." },
      { t: 7.8, text: "Soupeř dá gól." },
      { t: 10.4, text: "Příště jisti kousek za ním, šikmo!", say: "V jedné řadě vás obejde jediná klička. Příště jisti kamaráda kousek za ním, šikmo." },
    ],
    players: [
      { id: "g", team: "us", gk: true, n: 1, path: [[0, 15, 2.5], [5, 15.2, 2.6]] },
      { id: "lo", team: "us", n: 2, path: [[0, 9, 11], [3, 11, 12.5]] },
      { id: "ty", team: "us", n: 3, tag: "Ty", hl: true, path: [[0, 21, 13], [2.6, 21, 13], [4.8, 15.5, 22.8], [6.4, 15.5, 22.8], [7.6, 15.8, 20.5]] },
      { id: "st", team: "us", n: 4, path: [[0, 17, 23], [0.6, 17, 23], [2.2, 21.5, 23], [5.2, 21.5, 23], [5.8, 22.4, 23.2], [7.6, 21.5, 19.5]] },
      { id: "lu", team: "us", n: 5, dim: true, path: [[0, 9, 30], [4, 9.5, 26]] },
      { id: "pu", team: "us", n: 6, dim: true, path: [[0, 23, 34], [5, 23, 28.5]] },
      { id: "G", team: "them", gk: true, dim: true, path: [[0, 15, 42.5]] },
      { id: "t1", team: "them", dim: true, path: [[0, 10, 35]] },
      { id: "t2", team: "them", dim: true, path: [[0, 20, 37]] },
      { id: "t3", team: "them", path: [[0, 14, 30], [3, 13, 27]] },
      { id: "t4", team: "them", path: [[0, 8, 19]] },
      { id: "t5", team: "them", path: [[0, 22.5, 31], [0.4, 22.5, 31], [2.2, 22, 26.5], [5.2, 22, 26.5], [6.1, 18.6, 25], [8.0, 18.5, 15.5]] },
    ],
    ball: [[0, "t5"], [8.0, "t5"], [8.9, 17.2, -0.8]],
    marks: [
      { kind: "run", from: "st", to: [21.5, 23], t: [0.6, 2.6] },
      { kind: "run", from: "ty", to: [15.5, 22.8], t: [2.6, 5.0] },
      { kind: "line", from: [15.5, 22.8], to: [21.5, 23], t: [4.8, 6.1] },
      { kind: "x", at: [12.2, 21.6], t: [5.0] },
      { kind: "zone", rect: [15.5, 7, 6, 13], at: [18.5, 9], tone: "bad", text: "Volno", t: [5.8, 7.6] },
      { kind: "dribble", team: "them", from: [18.6, 23.5], to: [18.5, 14], t: [6.1] },
      { kind: "shot", from: [18.5, 14], to: [17.2, -0.8], t: [8.0] },
    ],
  },
};

/* 5. Bokem, z vnitřní strany: zavřít střed, vytlačit soupeře k postranní čáře. */
const side = {
  id: "bokem",
  title: "Bokem, ke straně",
  icon: "🚧",
  dur: 10.2,
  beats: [
    { t: 0, text: "Soupeř jde s míčem na bránu.", say: "Soupeř jde s míčem na naši bránu. Středem by to měl k bráně nejblíž." },
    { t: 2.6, text: "Postav se bokem a zavři mu střed.", say: "Postav se bokem, blíž ke středu než on. Do středu pak nemůže a zbývá mu jen cesta ke straně." },
    { t: 5.2, text: "Vytlač ho ke straně.", say: "Couvej s ním a tlač ho ke straně, až k čáře. Odtamtud se mu na bránu střílí špatně." },
    { t: 7.8, text: "U čáry nemá kam. Aut je náš!", say: "U čáry už nemá kam a míč mu uteče do autu. Čára brání s námi!" },
  ],
  players: [
    { id: "g", team: "us", gk: true, n: 1, path: [[0, 15, 2.5], [4, 16.2, 2.6]] },
    { id: "lo", team: "us", n: 2, path: [[0, 9.5, 11], [3, 10, 12]] },
    {
      id: "ty", team: "us", n: 3, tag: "Ty", hl: true,
      path: [[0, 21, 14], [2.6, 21, 14], [4.6, 20.3, 22.2], [5.2, 20.3, 22.2], [6.8, 23.8, 18.8], [7.8, 25.8, 16.4], [8.3, 26.6, 17]],
    },
    { id: "st", team: "us", n: 4, path: [[0, 13, 22], [3, 13, 23.5]] },
    { id: "lu", team: "us", n: 5, dim: true, path: [[0, 8, 31], [4, 8.5, 27]] },
    { id: "pu", team: "us", n: 6, dim: true, path: [[0, 22, 35], [6, 24.5, 27]] },
    { id: "G", team: "them", gk: true, dim: true, path: [[0, 15, 42.5]] },
    { id: "t1", team: "them", dim: true, path: [[0, 10, 36]] },
    { id: "t2", team: "them", dim: true, path: [[0, 19, 37]] },
    { id: "t3", team: "them", path: [[0, 13, 30], [3, 13.5, 28]] },
    { id: "t4", team: "them", path: [[0, 8, 19]] },
    {
      id: "t5", team: "them",
      path: [[0, 23, 30], [0.4, 23, 30], [3.4, 22.5, 25.5], [5.2, 22.5, 25.5], [6.8, 26.5, 22], [7.8, 28, 19.2]],
    },
  ],
  // u čáry si soupeř míč pustí do autu → vhazujeme my
  ball: [[0, "t5"], [7.8, "t5"], [8.4, 30.9, 16.8]],
  marks: [
    { kind: "run", from: "ty", to: [20.3, 22.2], t: [2.6, 4.8] },
    { kind: "zone", rect: [12.5, 12.5, 7, 9], tone: "us", text: "Zavřeno", t: [4.4] },
    { kind: "dribble", team: "them", from: [22.5, 24], to: [27.8, 17.8], t: [5.2, 8.0] },
    { kind: "check", at: [23, 14.5], t: [8.4] },
  ],
  why: "Obránce se k soupeři staví bokem (pootočený, ne čelně) a z vnitřní strany, takže mu zavře cestu do středu k brance a nechá mu jen cestu k postranní čáře. U čáry má útočník málo místa a špatný úhel ke střele – čára „brání s námi“.",
  bad: {
    dur: 12.4,
    beats: [
      { t: 0, text: "Soupeř jde s míčem na bránu.", say: "Soupeř jde s míčem na naši bránu. Středem by to měl k bráně nejblíž." },
      { t: 2.6, text: "Běžíš na něj rovně zepředu…", say: "Ty ale běžíš rovně proti němu. Necháš mu otevřené obě strany, i tu do středu." },
      { t: 5.2, text: "Uhne do středu a má volno.", say: "Soupeř uhne do středu, kde nikdo nestojí. Má volnou cestu rovnou na bránu." },
      { t: 7.8, text: "Střela – a gól.", say: "Ze středu má celou bránu před sebou. Střela a gól!" },
      { t: 10.4, text: "Příště bokem – a zavři mu střed!", say: "Zepředu si soupeř vybere, kam uhne. Příště se postav bokem a zavři mu cestu do středu." },
    ],
    players: [
      { id: "g", team: "us", gk: true, n: 1, path: [[0, 15, 2.5], [5.6, 15, 2.5], [7.4, 16.2, 2.6]] },
      { id: "lo", team: "us", n: 2, path: [[0, 9.5, 11], [3, 10, 12]] },
      {
        id: "ty", team: "us", n: 3, tag: "Ty", hl: true,
        path: [[0, 21, 14], [2.6, 21, 14], [4.6, 22.5, 21.6], [5.2, 22.5, 22], [6.2, 22.5, 22], [7.6, 21.3, 18.8]],
      },
      { id: "st", team: "us", n: 4, path: [[0, 13, 22], [3, 13, 23.5]] },
      { id: "lu", team: "us", n: 5, dim: true, path: [[0, 8, 31], [4, 8.5, 27]] },
      { id: "pu", team: "us", n: 6, dim: true, path: [[0, 22, 35], [6, 24.5, 27]] },
      { id: "G", team: "them", gk: true, dim: true, path: [[0, 15, 42.5]] },
      { id: "t1", team: "them", dim: true, path: [[0, 10, 36]] },
      { id: "t2", team: "them", dim: true, path: [[0, 19, 37]] },
      { id: "t3", team: "them", path: [[0, 13, 30], [3, 13.5, 28]] },
      { id: "t4", team: "them", path: [[0, 8, 19]] },
      {
        id: "t5", team: "them",
        path: [[0, 23, 30], [0.4, 23, 30], [3.4, 22.5, 25.5], [5.2, 22.5, 25.5], [6.2, 18.5, 23.5], [7.8, 16.5, 15]],
      },
    ],
    ball: [[0, "t5"], [7.8, "t5"], [8.7, 12.9, -0.8]],
    marks: [
      { kind: "run", from: "ty", to: [22.5, 21.6], t: [2.6, 4.8] },
      { kind: "x", at: [24.8, 19.4], t: [5.2] },
      { kind: "zone", rect: [13, 9, 7, 12], at: [16.5, 10.6], tone: "bad", text: "Volno", t: [5.4, 7.6] },
      { kind: "dribble", team: "them", from: [18.5, 22], to: [16.5, 13.5], t: [6.2] },
      { kind: "shot", from: [16.5, 13.5], to: [12.9, -0.8], t: [7.8] },
    ],
  },
};

/* 6. Trpělivost: zůstat na nohou, couvat, vzít míč, až si ho soupeř pustí od nohy. */
const patience = {
  id: "trpelive",
  title: "Trpělivě, nevrhej se",
  icon: "⏳",
  dur: 10.2,
  beats: [
    { t: 0, text: "Soupeř jde s míčem na tebe.", say: "Soupeř jde s míčem přímo na tebe. Chce tě obejít kličkou." },
    { t: 2.6, text: "Nevrhej se. Zůstaň na nohou, couvej.", say: "Nevrhej se po míči. Zůstaň na nohou a couvej s ním, ať ti nemůže utéct." },
    { t: 5.2, text: "Míč mu odskočil – teď!", say: "Míč mu odskočil daleko od nohy. Teď je ta chvíle, jdi do něj!" },
    { t: 7.8, text: "Máš ho! Trpělivost se vyplatí.", say: "Máš ho! Stačilo zůstat na nohou a počkat na správnou chvíli." },
  ],
  players: [
    { id: "g", team: "us", gk: true, n: 1, path: [[0, 15, 2.5]] },
    { id: "lo", team: "us", n: 2, path: [[0, 9, 11]] },
    { id: "po", team: "us", n: 3, path: [[0, 21, 11]] },
    {
      id: "ty", team: "us", n: 4, tag: "Ty", hl: true,
      path: [[0, 15, 16.5], [0.6, 15, 16.5], [2.0, 15, 21], [2.6, 15, 21], [4.8, 15, 19], [5.2, 15, 19], [5.9, 14.8, 20.1], [7.8, 14.8, 20.1], [9.2, 11.5, 21]],
    },
    { id: "lu", team: "us", n: 5, dim: true, path: [[0, 9, 29.5], [5, 6.5, 27]] },
    { id: "pu", team: "us", n: 6, dim: true, path: [[0, 21, 30], [5, 22, 27.5]] },
    { id: "G", team: "them", gk: true, dim: true, path: [[0, 15, 42.5]] },
    { id: "t1", team: "them", dim: true, path: [[0, 10, 35]] },
    { id: "t2", team: "them", dim: true, path: [[0, 20, 35]] },
    { id: "t3", team: "them", path: [[0, 15, 30.5], [0.4, 15, 30.5], [4.8, 15, 24.4], [5.2, 15, 24.4], [5.8, 15, 23.9]] },
    { id: "t4", team: "them", path: [[0, 8, 17]] },
    { id: "t5", team: "them", path: [[0, 22, 17]] },
  ],
  // soupeř si míč pustí moc daleko od nohy → to je chvíle jít do něj
  ball: [[0, "t3"], [5.2, "t3"], [5.6, 14.8, 21.6], [5.9, "ty"], [9.2, "ty"]],
  marks: [
    { kind: "label", at: [19.5, 21.6], text: "Teď!", tone: "us", t: [5.4, 6.8] },
    { kind: "check", at: [8, 21.5], t: [8.4] },
  ],
  why: "Obránce zůstává na nohou kousek před soupeřem, couvá s ním a sleduje míč, ne nohy. Do míče jde, až si ho soupeř pustí dál od nohy; skluz nebo „vrhnutí se“ při neúspěchu obránce vyřadí ze hry.",
  bad: {
    dur: 12.4,
    beats: [
      { t: 0, text: "Soupeř jde s míčem na tebe.", say: "Soupeř jde s míčem přímo na tebe. Chce tě obejít kličkou." },
      { t: 2.6, text: "Vrhneš se po míči…", say: "Ty se ale vrhneš po míči moc brzo. Soupeř ho má pořád u nohy a uhne ti." },
      { t: 5.2, text: "Soupeř uhne a je pryč!", say: "Soupeř jen uhne a je pryč. Ty ležíš na zemi a nestihneš ho dohnat." },
      { t: 7.8, text: "Volná cesta – a gól.", say: "Před ním je volno až k bráně. Střela a gól." },
      { t: 10.4, text: "Nevrhej se. Počkej, až míč odskočí!", say: "Kdo se vrhne a netrefí, je ze hry. Příště zůstaň na nohou a počkej, až mu míč odskočí." },
    ],
    players: [
      { id: "g", team: "us", gk: true, n: 1, path: [[0, 15, 2.5], [5.6, 15, 2.5], [7.4, 16.2, 2.6]] },
      { id: "lo", team: "us", n: 2, path: [[0, 9, 11]] },
      { id: "po", team: "us", n: 3, path: [[0, 21, 11]] },
      // jde soupeři naproti a na konci titulku se vrhne; soupeř uhne právě s dalším titulkem
      {
        id: "ty", team: "us", n: 4, tag: "Ty", hl: true,
        path: [[0, 15, 16.5], [0.6, 15, 16.5], [2.0, 15, 21], [2.6, 15, 21], [4.2, 15, 22], [4.4, 15, 22], [5.0, 14.2, 25.8]],
      },
      { id: "lu", team: "us", n: 5, dim: true, path: [[0, 9, 29.5], [5, 6.5, 27]] },
      { id: "pu", team: "us", n: 6, dim: true, path: [[0, 21, 30], [5, 22, 27.5]] },
      { id: "G", team: "them", gk: true, dim: true, path: [[0, 15, 42.5]] },
      { id: "t1", team: "them", dim: true, path: [[0, 10, 35]] },
      { id: "t2", team: "them", dim: true, path: [[0, 20, 35]] },
      { id: "t3", team: "them", path: [[0, 15, 30.5], [0.4, 15, 30.5], [4.4, 15, 26.2], [5.0, 18.6, 25.6], [7.6, 16.8, 15.5]] },
      { id: "t4", team: "them", path: [[0, 8, 17]] },
      { id: "t5", team: "them", path: [[0, 22, 17]] },
    ],
    ball: [[0, "t3"], [7.8, "t3"], [8.6, 12.9, -0.8]],
    marks: [
      { kind: "x", at: [11.3, 26.6], t: [5.0] },
      { kind: "zone", rect: [13, 6, 7, 14], at: [16.5, 9], tone: "bad", text: "Volno", t: [5.3, 7.6] },
      { kind: "shot", from: [16.8, 14], to: [12.9, -0.8], t: [7.8] },
    ],
  },
};

/* 7. Po zisku míč podržet a přihrát, ne jen odkopnout. */
const keep = {
  id: "vezmi-ne-odkopni",
  title: "Míč vezmi, ne odkopni",
  icon: "🧲",
  dur: 10.2,
  beats: [
    { t: 0, text: "Vezmeš soupeři míč. Teď je tvůj!", say: "Vezmeš soupeři míč a teď je tvůj. Co s ním uděláš?" },
    { t: 2.6, text: "Nekopej ho pryč. Podrž ho.", say: "Nekopej ho pryč, podrž ho a zvedni hlavu. Odkopnutý míč má většinou hned zase soupeř." },
    { t: 5.2, text: "Přihraj volnému kamarádovi.", say: "Kamarád vlevo je volný, tak mu přihraj. Takhle míč zůstane náš." },
    { t: 7.8, text: "Teď útočíme my!", say: "Teď útočíme my! Místo abychom zase bránili, jdeme na jejich bránu." },
  ],
  players: [
    { id: "g", team: "us", gk: true, n: 1, path: [[0, 15, 2.5]] },
    {
      id: "ty", team: "us", n: 2, tag: "Ty", hl: true,
      path: [[0, 13, 12.5], [0.9, 11.5, 14], [2.6, 11.5, 14], [4.2, 13.5, 15]],
    },
    { id: "po", team: "us", n: 3, path: [[0, 21, 11], [3, 22, 14]] },
    { id: "st", team: "us", n: 4, path: [[0, 16.5, 21], [3, 18, 23.5]] },
    { id: "lu", team: "us", n: 5, path: [[0, 8, 28], [2.8, 8, 28], [4.8, 4.5, 24], [7.8, 4.5, 24], [9.6, 6, 31]] },
    { id: "pu", team: "us", n: 6, path: [[0, 22, 29]] },
    { id: "G", team: "them", gk: true, path: [[0, 15, 42.5]] },
    { id: "t1", team: "them", path: [[0, 11, 33]] },
    { id: "t2", team: "them", path: [[0, 20, 33]] },
    { id: "t3", team: "them", path: [[0, 17, 26.5]] },
    { id: "t4", team: "them", path: [[0, 9, 19], [0.9, 9, 17]] },
    { id: "t5", team: "them", path: [[0, 23, 18]] },
  ],
  ball: [[0, "t4"], [0.9, "t4"], [1.15, "ty"], [5.2, "ty"], [6.0, "lu"], [9.6, "lu"]],
  marks: [
    { kind: "run", from: "lu", to: [4.5, 24], t: [2.8, 5.0] },
    { kind: "pass", from: [13.5, 16.5], to: [4.5, 25.5], t: [5.2] },
    { kind: "check", at: [16.6, 15], t: [6.2] },
    { kind: "dribble", from: [4.5, 25.5], to: [6, 32.5], t: [7.8] },
  ],
  why: "Po zisku míče je cílem ho udržet a založit útok, ne ho jen odkopnout – odkopnutý míč se většinou hned vrátí soupeři. Hráč si míč zpracuje stranou od soupeře, zvedne hlavu a přihraje volnému spoluhráči; odkopnutí je jen nouzové řešení přímo před vlastní brankou.",
  bad: {
    dur: 12.4,
    beats: [
      { t: 0, text: "Vezmeš soupeři míč. Teď je tvůj!", say: "Vezmeš soupeři míč a teď je tvůj. Co s ním uděláš?" },
      { t: 2.6, text: "Bum! Kopneš ho dopředu naslepo…", say: "Kopneš ho naslepo dopředu, ani se nepodíváš kam. Jenže tam stojí soupeři." },
      { t: 5.2, text: "…a míč má hned zase soupeř.", say: "A míč má hned zase soupeř. Odkopnutý míč totiž většinou skončí u něj." },
      { t: 7.8, text: "A musíme zase bránit.", say: "Soupeř útočí a my musíme znovu bránit. Přitom už byl míč náš!" },
      { t: 10.4, text: "Příště míč podrž a přihraj kamarádovi.", say: "Získaný míč hned neodkopávej. Příště ho podrž a přihraj volnému kamarádovi." },
    ],
    players: [
      { id: "g", team: "us", gk: true, n: 1, path: [[0, 15, 2.5]] },
      { id: "ty", team: "us", n: 2, tag: "Ty", hl: true, path: [[0, 13, 12.5], [0.9, 11.5, 14]] },
      { id: "po", team: "us", n: 3, path: [[0, 21, 11]] },
      { id: "st", team: "us", n: 4, path: [[0, 16.5, 21]] },
      { id: "lu", team: "us", n: 5, path: [[0, 8, 28]] },
      { id: "pu", team: "us", n: 6, path: [[0, 22, 29]] },
      { id: "G", team: "them", gk: true, path: [[0, 15, 42.5]] },
      { id: "t1", team: "them", path: [[0, 11, 33], [3.0, 11, 33], [4.2, 14, 31.5]] },
      { id: "t2", team: "them", path: [[0, 20, 33]] },
      { id: "t3", team: "them", path: [[0, 17, 26.5], [3.0, 17, 26.5], [5.0, 18.5, 29.5], [7.8, 18.5, 29.5], [9.6, 21, 22]] },
      { id: "t4", team: "them", path: [[0, 9, 19], [0.9, 9, 17], [7.8, 9, 17], [10.2, 7, 12]] },
      { id: "t5", team: "them", path: [[0, 23, 18]] },
    ],
    // naslepo odkopnutý míč skončí u soupeře, ten přihraje dál a modří jdou do útoku
    ball: [[0, "t4"], [0.9, "t4"], [1.15, "ty"], [2.6, "ty"], [4.2, "t1"], [5.6, "t1"], [6.1, "t3"], [9.6, "t3"]],
    marks: [
      { kind: "shot", from: [11.5, 15.5], to: [14, 30], t: [2.6] },
      { kind: "x", at: [10.8, 32.4], t: [5.2] },
      { kind: "pass", team: "them", from: [14, 30], to: [18.5, 28], t: [5.6] },
      { kind: "dribble", team: "them", from: [18.5, 27.5], to: [21, 19.5], t: [7.8] },
    ],
  },
};

export const DEFENSE = {
  id: "obrana",
  title: "Obrana",
  lead: "Nemáme míč. Chráníme bránu!",
  scenes: [regain, goalSide, nearest, cover, side, patience, keep],
};
