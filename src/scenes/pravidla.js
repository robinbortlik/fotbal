/* Pravidla — co se smí a co ne (pravidla FAČR pro starší přípravku 5 + 1, 2023).
   Data scén (formát viz src/components/Scene.jsx). Souřadnice v metrech:
   x 0..W zleva, y 0..L od NAŠÍ branky (dole). My (žlutí) útočíme nahoru.
   Titulky krátké, Kopík nahlas (say) dovysvětlí pravidlo a proč platí.
   Varianta „Takhle ne“ začíná stejnými titulky jako „Takhle ano“ (sdílená nahrávka hlasu). */

/* Gól: stejný začátek obou variant. */
const goalStart = [
  { t: 0, text: "Běžíš s míčem na bránu soupeře.", say: "Běžíš s míčem na bránu soupeře. Kdy přesně je to gól?" },
  { t: 2.6, text: "Střílíš! Sleduj čáru mezi tyčemi.", say: "Střílíš! Teď sleduj bílou čáru mezi tyčemi, podle ní se pozná gól." },
];
const goalTeam = [
  { id: "d", team: "us", n: 5, tag: "Ty", hl: true, path: [[0, 13.5, 30], [0.6, 13.5, 30], [2.4, 14.5, 36.2]] },
  { id: "e", team: "us", n: 6, path: [[0, 22, 32], [0.6, 22, 32], [3.4, 21.4, 39.5]] },
  { id: "t1", team: "them", path: [[0, 10.5, 35], [0.6, 10.5, 35], [2.6, 11.6, 37.8]] },
  { id: "t2", team: "them", path: [[0, 19.5, 37], [0.6, 19.5, 37], [2.6, 18.8, 38.6]] },
];

const goal = {
  id: "gol",
  title: "Gól",
  icon: "⚽",
  dur: 10.4,
  beats: [
    ...goalStart,
    { t: 5.2, text: "Míč je na čáře. Gól to ještě není!", say: "Míč je na čáře, ale gól to ještě není. Dokud je kus míče na čáře, brankář ho může chytit." },
    { t: 7.8, text: "Celý míč je za čarou. Teď je to gól!", say: "Teď je celý míč za čarou a čáry se už nedotýká. Teprve teď je to gól!" },
  ],
  players: [...goalTeam, { id: "G", team: "them", gk: true, path: [[0, 15, 43.2], [2.6, 15, 43.2], [3.2, 13, 43.6]] }],
  // Pomalá střela: míč dojede na čáru (4,8 s), chvíli se jí dotýká a až po 7,8 s přejde celý za ni.
  ball: [[0, "d"], [2.6, "d"], [4.8, 16.35, 44.85], [7.8, 16.45, 45.2], [8.6, 16.6, 45.8]],
  marks: [
    { kind: "dribble", from: [13.5, 31.5], to: [14.5, 37.4], t: [0.6, 3.6] },
    { kind: "shot", from: [14.5, 37.7], to: [16.6, 45.8], t: [2.6] },
    { kind: "zone", rect: [12.5, 44.7, 5, 0.6], tone: "us", t: [2.6] },
    { kind: "check", at: [19.8, 44.2], t: [8.7] },
    { kind: "label", at: [15, 40.8], text: "Gól!", tone: "us", t: [8.7] },
  ],
  why: "Gól je dosažen, když celý míč přejde celou brankovou čáru mezi tyčemi a pod břevnem. Dokud je kterákoli část míče na čáře, gól není a hraje se dál.",
  quiz: {
    at: 5.6,
    ask: "Míč je na čáře. Je to už gól?",
    options: [
      { text: "Ještě ne", ok: true },
      { text: "Ano, je to gól", ok: false },
    ],
  },
  bad: {
    dur: 12.8,
    beats: [
      ...goalStart,
      { t: 5.2, text: "Míč je na čáře a ty už slavíš gól.", say: "Míč je na čáře a ty už slavíš. Jenže celý za čarou ještě není!" },
      { t: 7.8, text: "Brankář míč chytil na čáře. Gól není!", say: "Brankář se vrátil a chytil míč přímo na čáře. Kus míče na ní pořád byl, takže gól není." },
      { t: 10.4, text: "Příště hraj, dokud není celý míč za čarou.", say: "Příště neslav moc brzy. Dokud není celý míč za čarou, hraje se dál." },
    ],
    // Brankář skočí na špatnou stranu, ale míč se jen pomalu kutálí po čáře → stihne se vrátit.
    players: [
      ...goalTeam,
      { id: "G", team: "them", gk: true, path: [[0, 15, 43.2], [2.6, 15, 43.2], [3.2, 13, 43.6], [7.8, 13, 43.6], [8.3, 15.6, 44]] },
    ],
    ball: [[0, "d"], [2.6, "d"], [4.8, 16.35, 44.85], [8.3, 16.4, 45]],
    marks: [
      { kind: "dribble", from: [13.5, 31.5], to: [14.5, 37.4], t: [0.6, 3.6] },
      { kind: "shot", from: [14.5, 37.7], to: [16.35, 44.85], t: [2.6] },
      { kind: "zone", rect: [12.5, 44.7, 5, 0.6], tone: "us", t: [2.6, 8.3] },
      { kind: "label", at: [19.6, 35.4], text: "Hurá!", tone: "us", t: [5.2, 8.3] },
      { kind: "zone", rect: [12.5, 44.7, 5, 0.6], tone: "bad", t: [8.3] },
      { kind: "x", at: [19.8, 44.2], t: [8.4] },
      { kind: "label", at: [14.5, 41], text: "Není gól", tone: "bad", t: [8.4] },
    ],
  },
};

const kickoff = {
  id: "vykop",
  title: "Výkop",
  icon: "▶️",
  dur: 10.4,
  beats: [
    { t: 0, text: "Výkop: hra začíná ze středu hřiště.", say: "Výkopem začíná každá část zápasu i hra po gólu. Každý tým přitom stojí na své polovině." },
    { t: 2.6, text: "Soupeř stojí aspoň 2 m od míče.", say: "Soupeři musí stát aspoň dva metry od míče. Ty tak máš klid na první přihrávku." },
    { t: 5.2, text: "Z výkopu gól neplatí. Přihraj kamarádovi!", say: "Přímo z výkopu gól neplatí. Výkop hru jen rozjede, tak přihraj kamarádovi." },
    { t: 7.8, text: "Míč je ve hře. Teď už na něj smí i soupeř.", say: "Jakmile se míč pohne, je ve hře. Teď už se pro něj smí rozběhnout i soupeř." },
  ],
  // Všichni na své polovině, míč na středové značce.
  players: [
    { id: "g", team: "us", gk: true, n: 1, path: [[0, 15, 2.5]] },
    { id: "a", team: "us", n: 2, path: [[0, 8, 9], [7.8, 8, 9], [9.8, 9, 11]] },
    { id: "b", team: "us", n: 3, path: [[0, 22, 9], [7.8, 22, 9], [9.8, 23, 12]] },
    { id: "c", team: "us", n: 4, path: [[0, 15, 14.5], [7.8, 15, 14.5], [9.8, 16.5, 16.5]] },
    { id: "d", team: "us", n: 5, tag: "Ty", hl: true, path: [[0, 13.1, 21.9]] },
    { id: "e", team: "us", n: 6, path: [[0, 21.5, 19], [8.2, 21.5, 19], [9.8, 22.5, 21]] },
    { id: "G", team: "them", gk: true, path: [[0, 15, 42.5]] },
    { id: "t1", team: "them", path: [[0, 8, 36], [7.8, 8, 36], [9.8, 9.5, 33]] },
    { id: "t2", team: "them", path: [[0, 22, 36], [7.8, 22, 36], [9.8, 22, 32]] },
    { id: "t3", team: "them", path: [[0, 15, 30.5], [7.8, 15, 30.5], [9.8, 16.5, 27.5]] },
    { id: "t4", team: "them", path: [[0, 11.8, 24.6]] },
    { id: "t5", team: "them", path: [[0, 18.2, 24.6], [7.8, 18.2, 24.6], [9.6, 21, 24.4]] },
  ],
  ball: [[0, 15, 22.5], [5.6, 15, 22.5], [6.3, 21.5, 20.5], [6.35, "e"], [10.4, "e"]],
  marks: [
    { kind: "zone", circle: [15, 22.5, 2], tone: "good", t: [0.8, 5.8] },
    { kind: "label", at: [15, 26.2], text: "2 m", t: [2.6, 5.8] },
    { kind: "pass", from: [15, 22.5], to: [21.5, 20.5], t: [5.6] },
    { kind: "run", team: "them", from: "t5", to: [21, 24.4], t: [7.8, 9.8] },
  ],
  why: "U 5 + 1 se výkopem ze středové značky začíná každá část hry i hra po gólu. Všichni hráči jsou na své polovině, soupeř nejméně 2 m od míče; míč je ve hře, jakmile se zjevně pohne libovolným směrem, a přímo z výkopu gól platit nemůže.",
};

const throwIn = {
  id: "aut",
  title: "Aut",
  icon: "🙌",
  dur: 10.4,
  beats: [
    { t: 0, text: "Vedeš míč podél čáry.", say: "Vedeš míč podél postranní čáry. Modrý hráč ti ho chce vzít." },
    { t: 2.6, text: "Modrý kopl míč ven. Aut pro nás!", say: "Modrý kopl míč celý za čáru. Dotkl se ho poslední, a proto vhazujeme my." },
    { t: 5.2, text: "Soupeř musí stát aspoň 2 m od tebe.", say: "Soupeř musí stát aspoň dva metry od tebe. Při vhazování ti tak nemůže překážet." },
    { t: 7.8, text: "Vhazuj oběma rukama zpoza hlavy.", say: "Vhazuj oběma rukama zpoza hlavy a obě nohy nech na zemi. Hoď míč kamarádovi, který je volný." },
  ],
  players: [
    { id: "d", team: "us", n: 5, tag: "Ty", hl: true, path: [[0, 7, 24.5], [0.4, 7, 24.5], [2.4, 7, 27], [3.4, 7, 27], [5, -1.1, 30.3]] },
    { id: "e", team: "us", n: 6, path: [[0, 12, 21], [3.4, 12, 21], [5.6, 4.8, 25.5]] },
    { id: "t1", team: "them", path: [[0, 10, 32.5], [0.4, 10, 32.5], [2.4, 8.2, 30.8], [3.6, 8.2, 30.8], [5, 3.8, 33.5]] },
    { id: "t2", team: "them", path: [[0, 15, 29], [3.4, 15, 29], [5.6, 9, 27.5]] },
  ],
  // Modrý odkopne míč za postranní čáru → vhazujeme my (míč v rukou = na středu hráče).
  ball: [[0, "d"], [2.4, "d"], [2.6, 7.4, 28.8], [3.3, -1.4, 30.5], [5, -1.4, 30.5], [5.2, -1.1, 30.3], [8, -1.1, 30.3], [8.9, "e"], [10.4, "e"]],
  marks: [
    { kind: "dribble", from: [7, 26], to: [7, 28.3], t: [0.4, 3.4] },
    { kind: "zone", rect: [-0.4, 22, 0.8, 16], tone: "us", t: [3] },
    { kind: "label", at: [-0.2, 36.8], text: "Aut", tone: "us", t: [3] },
    { kind: "zone", circle: [-1.1, 30.3, 3.3], tone: "good", t: [5.2, 8] },
    { kind: "label", at: [3.4, 30.3], text: "2 m", t: [5.2, 8] },
    { kind: "pass", from: [-1.1, 30.3], to: [3.6, 26.4], t: [8] },
  ],
  why: "Aut je, když celý míč přejde postranní čáru po zemi i vzduchem; vhazuje soupeř hráče, který se míče dotkl naposledy. U 5 + 1 se vhazuje rukama (obě ruce s míčem za hlavou, obě nohy na zemi), soupeř stojí nejméně 2 m a přímo z autu gól neplatí. Mladší přípravka (U8–U9) smí aut i přihrát nohou nebo vyvést.",
  // Mladší přípravka: míč se položí na čáru a hráč ho vyvede do hřiště (smí i vhodit nebo přihrát nohou),
  // modrý napadá až po prvním doteku → přihrávka volnému kamarádovi.
  younger: {
    dur: 13,
    beats: [
      { t: 0, text: "Vedeš míč podél čáry.", say: "Vedeš míč podél postranní čáry. Modrý hráč ti ho chce vzít." },
      { t: 2.6, text: "Modrý kopl míč ven. Aut pro nás!", say: "Modrý kopl míč celý za čáru. Dotkl se ho poslední, a proto aut rozehráváme my." },
      { t: 5.2, text: "Soupeř musí stát aspoň 2 m od tebe.", say: "Soupeř musí stát aspoň dva metry od tebe. Při rozehrávání ti tak nemůže překážet." },
      { t: 7.8, text: "Smíš vhodit, přihrát nohou, nebo vyvést.", say: "Polož míč na čáru. Smíš ho vhodit rukama, přihrát nohou, nebo s ním vyjet do hřiště." },
      { t: 10.4, text: "Vyjel jsi s míčem. Přihraj volnému!", say: "Vyjel jsi s míčem do hřiště. Teď přihraj kamarádovi, který je volný." },
    ],
    players: [
      { id: "d", team: "us", n: 5, tag: "Ty", hl: true, path: [[0, 7, 24.5], [0.4, 7, 24.5], [2.4, 7, 27], [3.4, 7, 27], [5, -0.4, 28.4], [8, -0.4, 28.4], [9.8, 3.6, 28.6]] },
      { id: "e", team: "us", n: 6, path: [[0, 12, 21], [3.4, 12, 21], [5.6, 6.5, 24.2], [10, 6.5, 24.2], [11, 8, 22.6]] },
      { id: "t1", team: "them", path: [[0, 10, 32.5], [0.4, 10, 32.5], [2.4, 8.2, 30.8], [3.6, 8.2, 30.8], [5, 3.8, 33.5], [8.4, 3.8, 33.5], [10.2, 4.8, 31.8]] },
      { id: "t2", team: "them", path: [[0, 15, 29], [3.4, 15, 29], [5.6, 9, 27.5]] },
    ],
    // Míč za čarou → položený na čáru (před nohama) → vyvedení → přihrávka šestce.
    ball: [[0, "d"], [2.4, "d"], [2.6, 7.4, 28.8], [3.3, -1.4, 30.5], [5, -1.4, 30.5], [5.4, -0.4, 29.9], [8, "d"], [9.8, "d"], [11, "e"], [13, "e"]],
    marks: [
      { kind: "dribble", from: [7, 26], to: [7, 28.3], t: [0.4, 3.4] },
      { kind: "zone", rect: [-0.4, 22, 0.8, 16], tone: "us", t: [3] },
      { kind: "label", at: [-0.2, 36.8], text: "Aut", tone: "us", t: [3] },
      { kind: "zone", circle: [-0.4, 28.4, 3.3], tone: "good", t: [5.2, 8] },
      { kind: "label", at: [3.2, 28.6], text: "2 m", t: [5.2, 8] },
      { kind: "dribble", from: [0.4, 29.9], to: [3.6, 30.1], t: [7.8, 10.4] },
      { kind: "pass", from: [3.6, 30.1], to: [7.8, 24.1], t: [10] },
    ],
    why: "U mladší přípravky (4 + 1) se aut rozehrává třemi způsoby: vhozením rukama (obě ruce s míčem za hlavou, obě nohy na zemi), přihrávkou nohou, nebo vyvedením – míč se nejdřív položí do klidu na pomezní čáru. Soupeř stojí nejméně 2 m. Přímo z autu gól neplatí, po vyvedení nejdříve třetím dotykem.",
  },
};

const corner = {
  id: "roh",
  title: "Roh",
  icon: "🚩",
  dur: 10.6,
  beats: [
    { t: 0, text: "Střílíš na bránu soupeře.", say: "Střílíš na bránu soupeře. Sleduj, kde míč skončí." },
    { t: 2.6, text: "Brankář míč vyrazil za brankovou čáru.", say: "Brankář tvou střelu vyrazil vedle branky. Míč přešel celý za jejich brankovou čáru." },
    { t: 5.2, text: "Roh pro nás! Kopeme ho z rohu hřiště.", say: "Naposledy se míče dotkli modří, proto je roh pro nás. Kdyby ho ven poslal někdo z nás, kopal by soupeř od branky." },
    { t: 7.8, text: "Soupeř musí stát aspoň 5 m od míče.", say: "Soupeř musí stát aspoň pět metrů od míče. Máš tak klid přihrát kamarádovi." },
  ],
  players: [
    { id: "d", team: "us", n: 5, tag: "Ty", hl: true, path: [[0, 21, 32], [0.4, 21, 32], [1.6, 21.5, 35.6], [3.2, 21.5, 35.6], [4.8, 24.5, 44.9], [5.2, 24.5, 44.9], [6.4, 29.3, 43.1]] },
    { id: "e", team: "us", n: 6, path: [[0, 12, 33], [3.2, 12, 33], [6.4, 20, 37.5]] },
    { id: "G", team: "them", gk: true, path: [[0, 16, 43.2], [1.9, 16, 43.2], [2.5, 17.1, 43.5], [5.2, 17.1, 43.5], [6.6, 16, 43.4]] },
    { id: "t1", team: "them", path: [[0, 17, 36.5], [3.2, 17, 36.5], [6.4, 17.5, 40.2]] },
    { id: "t2", team: "them", path: [[0, 26.5, 37.5], [3.2, 26.5, 37.5], [5.4, 23.5, 37.2]] },
  ],
  // Střela → brankář vyrazí za brankovou čáru → Ty dovede míč do rohu → krátký roh.
  ball: [[0, "d"], [1.9, "d"], [2.6, 17.9, 42.6], [3.2, 24.5, 46.4], [4.8, "d"], [6.4, "d"], [8, 29.3, 44.6], [8.9, "e"], [10.6, "e"]],
  marks: [
    { kind: "dribble", from: [21, 33.5], to: [21.5, 36.9], t: [0.4, 2.6] },
    { kind: "shot", from: [21.5, 37.1], to: [17.9, 42.6], t: [1.9, 5.2] },
    { kind: "line", from: [17.9, 42.6], to: [24.5, 46.4], t: [2.6, 5.2] },
    { kind: "label", at: [27.2, 38], text: "Roh", tone: "us", t: [5.2] },
    { kind: "zone", circle: [29.3, 44.6, 5], tone: "good", t: [7.8] },
    { kind: "label", at: [24.3, 45.4], text: "5 m", t: [7.8] },
    { kind: "pass", from: [29.3, 44.6], to: [21.2, 38.4], t: [8] },
  ],
  why: "Roh se kope, když celý míč přejde brankovou čáru mimo branku a naposledy se ho dotkl hráč bránícího týmu, i jeho brankář. Kope se z rohového oblouku a soupeř musí být podle pravidel FAČR pro 5 + 1 nejméně 5 m od míče.",
  quiz: {
    at: 3.6,
    ask: "Míč je za čarou. Co bude teď?",
    options: [
      { text: "Roh pro nás", ok: true },
      { text: "Kop od branky", ok: false },
      { text: "Aut", ok: false },
    ],
  },
};

/* Kop od branky: stejný začátek obou variant — modrý střílí vedle, brankář míč přinese a položí
   do pokutového území, tým se rozestaví. Ty = dvojka (hráč a) vlevo. */
const gkTeam = [
  { id: "g", team: "us", gk: true, n: 1, path: [[0, 15.5, 2.4], [2.6, 15.5, 2.4], [3.4, 18, 0.5], [3.6, 18, 0.5], [4.6, 16, 1.5]] },
  { id: "b", team: "us", n: 3, path: [[0, 22, 9], [2.6, 22, 9], [4.6, 24.5, 3.5]] },
  { id: "c", team: "us", n: 4, path: [[0, 15, 15], [2.6, 15, 15], [4.6, 14, 12]] },
  { id: "d", team: "us", n: 5, path: [[0, 9, 20], [2.8, 9, 20], [5.2, 5, 15]] },
  { id: "e", team: "us", n: 6, path: [[0, 21, 21], [2.8, 21, 21], [5.2, 22, 17]] },
  { id: "G", team: "them", gk: true, path: [[0, 15, 42.5]] },
  { id: "t1", team: "them", path: [[0, 10, 30]] },
  { id: "t3", team: "them", path: [[0, 14, 19], [2.8, 14, 19], [4.8, 13.5, 16.5]] },
  { id: "t4", team: "them", path: [[0, 17.5, 11.5], [1.4, 17.5, 11.5], [3.4, 19.5, 9]] },
];
const gkOut = { t: 5.2, text: "Modří musí ven z pokutového území.", say: "Modří musí ven z pokutového území. Brankář tak má klid a místo na přihrávku." };
const gkEnd = { t: 10.4, text: "Míč je u tebe. Teď smí modrý napadat.", say: "Jakmile se míče dotkneš, smí modrý napadat. Rozhlédni se a přihraj rychle dál." };
const gkStart = [
  { t: 0, text: "Modrý hráč střílí na naši bránu." },
  { t: 2.6, text: "Vedle! Kop od branky pro nás.", say: "Vedle! Míč přešel naši brankovou čáru a naposledy se ho dotkl modrý, proto kopeme od branky my." },
];
// Střela vedle → brankář míč přinese a položí do pokutového území (4,9 s).
const gkBall = [[0, "t4"], [1.2, "t4"], [2.2, 18.5, -0.9], [3.4, 18.5, -0.9], [3.6, 18, 0.5], [4.6, 16, 1.5], [4.9, 16, 3]];

const goalKick = {
  id: "kop-od-branky",
  title: "Kop od branky",
  icon: "👟",
  dur: 12.8,
  beats: [
    ...gkStart,
    gkOut,
    { t: 7.8, text: "Brankář ti přihraje krátce po zemi.", say: "Brankář kope míč ze země a přihrát smí komukoli, i tobě v území. Krátká přihrávka po zemi je nejbezpečnější." },
    gkEnd,
  ],
  players: [
    { id: "a", team: "us", n: 2, tag: "Ty", hl: true, path: [[0, 8, 9], [2.6, 8, 9], [4.6, 5.5, 3.2], [10.4, 5.5, 3.2], [11.5, 5, 6]] },
    ...gkTeam,
    { id: "t2", team: "them", path: [[0, 20, 30]] },
    { id: "t5", team: "them", path: [[0, 11.5, 9], [1, 11.5, 9], [2.2, 12.5, 4.5], [5.2, 12.5, 4.5], [6.8, 9.8, 7.6], [10.4, 9.8, 7.6], [11.4, 7.6, 6.4]] },
  ],
  // … modří odejdou z území, brankář přihraje krátce Tobě, modrý napadá až po prvním doteku.
  ball: [...gkBall, [8, 16, 3], [8.9, 5.5, 4.7], [8.95, "a"], [10.8, "a"], [11.8, "d"]],
  marks: [
    { kind: "shot", from: [17.5, 10], to: [18.5, -0.9], t: [1.2, 3.4] },
    { kind: "run", from: [8, 9], to: [5.5, 3.2], t: [2.6, 5.2] },
    { kind: "zone", rect: [0, 0, 30, 5.5], tone: "us", t: [5.2] },
    { kind: "run", team: "them", from: [12.5, 4.5], to: [9.8, 7.6], t: [5.2, 7.4] },
    { kind: "pass", from: [16, 3], to: [5.5, 4.7], t: [8] },
    { kind: "pass", from: [5.4, 5.4], to: [5.1, 13.5], t: [10.8] },
  ],
  why: "Kop od branky následuje, když celý míč přejde naši brankovou čáru mimo branku a naposledy se ho dotkl soupeř. U 5 + 1 kope brankář míč ze země jen nohou, soupeř musí z pokutového území a napadat smí až po prvním doteku hráče, který přihrávku převzal; míč nesmí bez doteku země či hráče přeletět půlicí čáru (jinak nepřímý volný kop soupeře z půlicí čáry). Mladší přípravka (U8–U9): brankář smí míč i vyvést nebo vyhodit rukou.",
  // Mladší přípravka: animace stejná (krátká přihrávka platí i tam), Kopík řekne, co brankář smí navíc.
  younger: {
    beats: [
      ...gkStart,
      gkOut,
      { t: 7.8, text: "Brankář ti přihraje krátce po zemi.", say: "Brankář smí míč přihrát, vyvést, nebo hodit rukou. Krátká přihrávka po zemi je nejbezpečnější." },
      gkEnd,
    ],
    why: "U mladší přípravky (4 + 1) smí brankář při kopu od branky míč přihrát nohou, vyvést (soupeř ho pak smí napadat po prvním doteku nohou) nebo vyhodit rukou – rukou i přes půlku. Soupeř musí z pokutového území. Nohou míč nesmí bez doteku země či hráče přeletět půlicí čáru (jinak nepřímý volný kop soupeře z půlicí čáry).",
  },
  quiz: {
    at: 7.4,
    ask: "Kop od branky. Kam kopne brankář?",
    options: [
      { text: "Krátce kamarádovi", ok: true },
      { text: "Daleko přes půlku", ok: false },
    ],
  },
  bad: {
    dur: 12.8,
    beats: [
      ...gkStart,
      { t: 5.2, text: "Brankář ale nakopne míč daleko dopředu.", say: "Brankář ale nakopne míč daleko dopředu. Míč letí vzduchem přes půlku hřiště." },
      { t: 7.8, text: "To se nesmí! Volný kop pro modré z půlky.", say: "Kopnutý míč nesmí z území přeletět půlku vzduchem. Modří proto kopou volný kop z půlicí čáry." },
      { t: 10.4, text: "Příště přihraj krátce a po zemi.", say: "Příště přihraj krátce po zemi kamarádovi. Míč tak zůstane náš." },
    ],
    players: [
      { id: "a", team: "us", n: 2, tag: "Ty", hl: true, path: [[0, 8, 9], [2.6, 8, 9], [4.6, 5.5, 3.2]] },
      ...gkTeam,
      { id: "t2", team: "them", path: [[0, 20, 30], [6, 20, 30], [7.6, 18.9, 32.6], [8.2, 18.9, 32.6], [10.2, 17.7, 24]] },
      { id: "t5", team: "them", path: [[0, 11.5, 9], [1, 11.5, 9], [2.2, 12.5, 4.5], [3.4, 12.5, 4.5], [5, 9.8, 7.6]] },
    ],
    // … dlouhý nákop přeletí půlicí čáru → modrý míč odnese na půlicí čáru k volnému kopu.
    ball: [...gkBall, [5.4, 16, 3], [7.6, 18.5, 31], [8.2, "t2"], [10.2, "t2"], [12.8, "t2"]],
    marks: [
      { kind: "shot", from: [17.5, 10], to: [18.5, -0.9], t: [1.2, 3.4] },
      { kind: "run", from: [8, 9], to: [5.5, 3.2], t: [2.6, 5.2] },
      { kind: "run", team: "them", from: [12.5, 4.5], to: [9.8, 7.6], t: [3.4, 5.4] },
      { kind: "zone", rect: [0, 0, 30, 5.5], tone: "us", t: [5.2] },
      { kind: "pass", from: [16, 3], to: [18.5, 31], t: [5.4] },
      { kind: "zone", rect: [0, 22.1, 30, 0.8], tone: "bad", t: [7.8] },
      { kind: "x", at: [17.7, 22.5], t: [7.8, 9.4] },
      { kind: "label", at: [11, 20.3], text: "Přes půlku vzduchem ne!", tone: "bad", t: [7.8] },
    ],
  },
};

const foul = {
  id: "faul",
  title: "Faul a volný kop",
  icon: "💥",
  dur: 12.8,
  beats: [
    { t: 0, text: "Vedeš míč na bránu soupeře.", say: "Vedeš míč na bránu soupeře. Modrý obránce ti jde naproti." },
    { t: 2.6, text: "Modrý tě podrazil. To je faul!", say: "Modrý tě podrazil, to je faul. Podrážet, strkat, kopat ani držet soupeře se nesmí, někdo by se mohl zranit." },
    { t: 5.2, text: "Volný kop pro nás. Zeď stojí 5 m od míče.", say: "Za faul kopeme volný kop. Zeď soupeře musí stát aspoň pět metrů od míče, ať máš místo." },
    { t: 7.8, text: "Na půlce soupeře můžeš rovnou vystřelit.", say: "Na půlce soupeře můžeš z volného kopu rovnou vystřelit. Na naší půlce by se muselo nejdřív přihrát." },
    { t: 10.4, text: "Pamatuj: hraj do míče, ne do soupeře.", say: "Faul se modrým nevyplatil, dali jsme gól. Pamatuj si: hraj vždycky do míče, ne do soupeře." },
  ],
  players: [
    { id: "d", team: "us", n: 5, tag: "Ty", hl: true, path: [[0, 8, 24], [0.4, 8, 24], [2.6, 10.6, 30.5]] },
    { id: "e", team: "us", n: 6, path: [[0, 19, 29], [5.2, 19, 29], [7.4, 21, 35.5]] },
    { id: "G", team: "them", gk: true, path: [[0, 15, 43.2], [5.6, 15, 43.2], [7, 13.4, 43.4]] },
    { id: "t1", team: "them", path: [[0, 15.5, 34], [0.4, 15.5, 34], [2.6, 12.9, 31.8], [5.2, 12.9, 31.8], [7, 11.1, 38.6]] },
    { id: "t2", team: "them", path: [[0, 21.5, 37.5], [5.2, 21.5, 37.5], [7.4, 22, 39.2]] },
  ],
  // Faul na naší útočné polovině → přímý volný kop, jednočlenná zeď 5 m, střela k zadní tyči.
  ball: [[0, "d"], [2.6, "d"], [8, 10.6, 32], [9.1, 17.3, 45.8]],
  marks: [
    { kind: "dribble", from: [8, 25.5], to: [10.4, 31.6], t: [0.4, 5.2] },
    { kind: "x", at: [11.8, 31.4], t: [2.6, 5.2] },
    { kind: "label", at: [6.3, 33.6], text: "Faul!", tone: "bad", t: [2.6, 5.2] },
    { kind: "zone", circle: [10.6, 32, 5], tone: "good", t: [5.2, 8] },
    { kind: "label", at: [5.6, 32], text: "5 m", t: [5.2, 8] },
    { kind: "shot", from: [10.6, 32], to: [17.3, 45.8], t: [8] },
    { kind: "label", at: [22.5, 43.3], text: "Gól!", tone: "us", t: [9.2] },
  ],
  why: "Za podražení, strčení, kopnutí nebo držení soupeře se kope volný kop. U 5 + 1 jsou volné kopy z vlastní poloviny a z půlicí čáry nepřímé (musí se přihrát), na polovině soupeře přímé; zeď musí stát nejméně 5 m od míče.",
};

const penalty = {
  id: "penalta",
  title: "Penalta",
  icon: "🎯",
  dur: 12.8,
  beats: [
    { t: 0, text: "Vedeš míč do pokutového území soupeře.", say: "Vedeš míč do pokutového území soupeře. To je ten pruh hned před jejich brankou." },
    { t: 2.6, text: "Modrý tě tam podrazil. Penalta!", say: "Modrý tě v pokutovém území podrazil a připravil tě o šanci na gól. Za to je penalta." },
    { t: 5.2, text: "Kope se ze 7 m. Ostatní jdou z území.", say: "Míč se položí na značku sedm metrů před brankou. Ostatní hráči musí z pokutového území, aby nepřekáželi." },
    { t: 7.8, text: "Jen ty a brankář. Zamiř a vystřel!", say: "Teď jste tu jen ty a brankář, který stojí na brankové čáře. Zamiř a vystřel!" },
    { t: 10.4, text: "Gól! Ve vlastním území nefauluj.", say: "Gól! Penalta je velká šance, proto ve vlastním pokutovém území nikdy nefauluj." },
  ],
  players: [
    { id: "d", team: "us", n: 5, tag: "Ty", hl: true, path: [[0, 18, 33.5], [0.4, 18, 33.5], [2.4, 16.6, 39.6], [5.2, 16.6, 39.6], [6.2, 15, 36.5]] },
    { id: "e", team: "us", n: 6, path: [[0, 21.5, 33], [2.4, 21.5, 35.5], [5.2, 21.5, 35.5], [6.6, 22.5, 35]] },
    { id: "G", team: "them", gk: true, path: [[0, 14.4, 43.6], [5.2, 14.4, 43.6], [6.4, 15, 44.4], [8, 15, 44.4], [8.5, 16.8, 44.3]] },
    { id: "t1", team: "them", path: [[0, 12.5, 38], [0.4, 12.5, 38], [2.4, 14.1, 41.2], [5.2, 14.1, 41.2], [6.6, 10.5, 35.2]] },
    { id: "t2", team: "them", path: [[0, 20.5, 38.8], [5.2, 20.5, 38.8], [6.6, 19.5, 34.8]] },
  ],
  ball: [[0, "d"], [2.4, "d"], [2.7, 16.6, 42.2], [5.4, 16.6, 42.2], [6, 15, 38], [8, 15, 38], [8.7, 13.2, 45.8]],
  marks: [
    { kind: "zone", rect: [0, 39.5, 30, 5.5], tone: "us", t: [0.3] },
    { kind: "dribble", from: [18, 35], to: [16.7, 40.8], t: [0.4, 3] },
    { kind: "x", at: [15.3, 40.4], t: [2.6, 5.2] },
    { kind: "label", at: [23.6, 41.6], text: "Faul v území", tone: "bad", t: [2.6, 5.2] },
    { kind: "zone", circle: [15, 38, 1.2], tone: "us", t: [5.6, 8] },
    { kind: "label", at: [11, 38], text: "7 m", t: [6.6, 8] },
    { kind: "shot", from: [15, 38], to: [13.2, 45.8], t: [8] },
    { kind: "check", at: [9.6, 43.6], t: [8.8] },
  ],
  why: "Penalta (pokutový kop) se nařizuje za přestupek trestaný přímým volným kopem, kterého se hráč dopustí ve vlastním pokutovém území. U 5 + 1 se kope ze 7 m; brankář stojí na brankové čáře a ostatní hráči čekají mimo pokutové území za značkou pokutového kopu.",
};

/* Ruka: dlouhý míč soupeře na naši bránu (stejné postavení i pohyb v obou variantách). */
const handTeam = [
  { id: "a", team: "us", n: 2, path: [[0, 8, 9], [5.4, 8, 9], [7.2, 9.5, 7.5]] },
  { id: "b", team: "us", n: 3, path: [[0, 22, 9], [5.4, 22, 9], [7.2, 20.5, 7.5]] },
  { id: "c", team: "us", n: 4, path: [[0, 23, 17]] },
  { id: "t3", team: "them", path: [[0, 16.5, 24]] },
  { id: "t4", team: "them", path: [[0, 9.5, 15], [5.4, 9.5, 15], [7.2, 10.5, 12]] },
  { id: "t5", team: "them", path: [[0, 22, 13.5], [5.4, 22, 13.5], [7.2, 19, 12]] },
];
const handStart = [
  { t: 0, text: "Hráči v poli nesmí hrát rukou.", say: "Hráči v poli, tedy všichni kromě brankáře, nesmí hrát rukou. Za ruku kope soupeř volný kop." },
  { t: 2.6, text: "Brankář smí, ale jen ve svém území.", say: "Rukama smí chytat jen brankář, protože chrání branku. Smí ale jen ve svém pokutovém území." },
];

const hand = {
  id: "ruka",
  title: "Ruka",
  icon: "✋",
  dur: 10.4,
  beats: [
    ...handStart,
    { t: 5.2, text: "Modrý kope dlouhý míč. Brankář čeká v území.", say: "Modrý nakopne dlouhý míč k naší bráně. Brankář zůstane ve svém území a počká na něj." },
    { t: 7.8, text: "Chytil míč v území. V pořádku!", say: "Brankář chytil míč rukama ve svém území. To smí, takže je všechno v pořádku." },
  ],
  players: [{ id: "g", team: "us", gk: true, n: 1, path: [[0, 15, 2.5], [6.2, 15, 2.5], [7.2, 14, 3.7]] }, ...handTeam],
  ball: [[0, "t3"], [5.4, "t3"], [7.4, 14, 3.8]],
  marks: [
    { kind: "zone", rect: [0, 0, 30, 5.5], tone: "us", t: [2.6] },
    { kind: "pass", from: [16.5, 22.5], to: [14, 3.8], t: [5.4, 8.6] },
    { kind: "check", at: [18.2, 3.4], t: [7.8] },
  ],
  why: "Hráč v poli nesmí úmyslně hrát rukou – trestá se přímým volným kopem, ve vlastním pokutovém území penaltou. Brankář smí u 5 + 1 chytat po celé šíři svého pokutového území; zahraje-li rukou mimo něj, nařizuje se přímý volný kop z místa přestupku.",
  bad: {
    dur: 12.8,
    beats: [
      ...handStart,
      { t: 5.2, text: "Brankář ale vyběhne daleko z území.", say: "Modrý nakopne dlouhý míč a brankář mu vyběhne naproti, daleko ze svého území." },
      { t: 7.8, text: "Chytil míč rukama mimo území. To nesmí!", say: "Brankář chytil míč rukama mimo své území. Tam je jako hráč v poli a rukou hrát nesmí." },
      { t: 10.4, text: "Volný kop pro modré. Mimo území jen nohou!", say: "Modří kopou volný kop kousek od naší branky. Až budeš chytat ty, mimo území hraj jen nohou." },
    ],
    players: [
      { id: "g", team: "us", gk: true, n: 1, path: [[0, 15, 2.5], [5.4, 15, 2.5], [7.4, 14, 8.6]] },
      ...handTeam,
    ],
    ball: [[0, "t3"], [5.4, "t3"], [7.6, 14, 8.7]],
    marks: [
      { kind: "zone", rect: [0, 0, 30, 5.5], tone: "us", t: [2.6] },
      { kind: "pass", from: [16.5, 22.5], to: [14, 8.7], t: [5.4, 8.6] },
      { kind: "x", at: [17.4, 9.4], t: [7.8] },
      { kind: "label", at: [14, 15.6], text: "Ruka mimo území", tone: "bad", t: [7.8] },
    ],
  },
};

const offside = {
  id: "ofsajd",
  title: "Ofsajd tu není",
  icon: "🆓",
  dur: 10.4,
  beats: [
    { t: 0, text: "Stojíš u brány soupeře, za obránci.", say: "Stojíš blízko brány soupeře, až za jejich obránci. Před tebou je jen brankář." },
    { t: 2.6, text: "Kamarád ti přihraje za obránce." },
    { t: 5.2, text: "Vystřelíš a dáš gól. Platí to!", say: "Vystřelíš a dáš gól. Platí, i když stojíš až za obránci." },
    { t: 7.8, text: "V přípravce ofsajd není.", say: "V přípravce ofsajd není, takže smíš stát kdekoli. U starších hráčů by tenhle gól neplatil." },
  ],
  players: [
    { id: "c", team: "us", n: 4, path: [[0, 5, 33]] },
    { id: "d", team: "us", n: 5, tag: "Ty", hl: true, path: [[0, 19.5, 38.5]] },
    { id: "G", team: "them", gk: true, path: [[0, 15.5, 43.2], [5.3, 15.5, 43.2], [5.9, 13.6, 43.5]] },
    { id: "t1", team: "them", path: [[0, 11, 33], [2.9, 11, 33], [4.6, 13.5, 35.5]] },
    { id: "t2", team: "them", path: [[0, 18.5, 32.5], [2.9, 18.5, 32.5], [4.6, 16.5, 34.2]] },
    { id: "t3", team: "them", path: [[0, 8.5, 28.5], [0.6, 8.5, 28.5], [2.4, 7, 30.3]] },
  ],
  // Přihrávka z kraje přiletí Tobě zleva, střela k bližší tyči.
  ball: [[0, "c"], [2.8, "c"], [4, "d"], [5.3, 18.05, 38.1], [6, 16.9, 45.8]],
  marks: [
    { kind: "line", from: [0, 33], to: [30, 33], t: [0.4, 4.6] },
    { kind: "pass", from: [5, 34.5], to: [18.05, 38.1], t: [2.8] },
    { kind: "shot", from: [18.05, 38.1], to: [16.9, 45.8], t: [5.3] },
    { kind: "check", at: [22.6, 43.6], t: [6.1] },
    { kind: "label", at: [23.5, 30], text: "Ofsajd tu není", tone: "good", t: [7.8] },
  ],
  why: "V pravidlech FAČR pro 5 + 1 (stejně jako u mladší přípravky) ofsajd neplatí – útočník smí stát kdekoli, i za posledním obráncem. Ofsajd se začíná uplatňovat až u mladších žáků.",
};

const subs = {
  id: "stridani",
  title: "Střídání",
  icon: "🔄",
  dur: 10.4,
  beats: [
    { t: 0, text: "Hra běží. Čekáš u střídaček.", say: "Hra běží a ty čekáš u střídaček. Kamarád na hřišti už je unavený." },
    { t: 2.6, text: "Kamarád nejdřív odběhne ze hřiště.", say: "Kamarád nejdřív úplně odběhne ze hřiště. Na hřišti tak nikdy není víc hráčů, než se smí." },
    { t: 5.2, text: "Pak hned vběhneš ty. Hra jede dál.", say: "Pak hned vběhneš na hřiště ty. Kvůli střídání se hra nezastavuje, jede pořád dál." },
    { t: 7.8, text: "Střídat se smí kdykoli a kolikrát chcete.", say: "Střídat se smí kdykoli a kolikrát chcete. Každý si tak odpočine a zahraje si." },
  ],
  players: [
    { id: "g", team: "us", gk: true, n: 1, path: [[0, 15, 2.5]] },
    { id: "a", team: "us", n: 2, path: [[0, 10, 12], [1.8, 10, 12], [3.8, 11, 15]] },
    { id: "b", team: "us", n: 3, path: [[0, 21, 13], [2, 21, 13], [4, 23, 18]] },
    { id: "c", team: "us", n: 4, path: [[0, 9, 24], [2.6, 9, 24], [4.8, -1.1, 24.5]] },
    { id: "d", team: "us", n: 5, path: [[0, 14, 30], [5.4, 14, 30], [7.4, 15, 33]] },
    { id: "e", team: "us", n: 6, path: [[0, 22.5, 28]] },
    { id: "s", team: "us", n: 7, tag: "Ty", hl: true, path: [[0, -1.1, 20.5], [5.2, -1.1, 20.5], [7.2, 9, 22.5]] },
    { id: "G", team: "them", gk: true, path: [[0, 15, 42.5]] },
    { id: "t1", team: "them", path: [[0, 10, 35]] },
    { id: "t2", team: "them", path: [[0, 21, 35], [5.4, 21, 35], [7.4, 22, 33]] },
    { id: "t3", team: "them", path: [[0, 15, 27], [2.6, 15, 27], [4.6, 18.5, 27.5]] },
    { id: "t4", team: "them", path: [[0, 12, 18], [1.6, 12, 18], [3.6, 15.5, 16.5]] },
    { id: "t5", team: "them", path: [[0, 19.5, 20], [1.6, 19.5, 20], [3.6, 19.5, 21]] },
  ],
  // Hra běží pořád: přihrávka 2 → 3, trojka vede míč, a zatímco Ty vbíháš, přihraje šestce.
  ball: [[0, "a"], [1, "a"], [1.9, 21, 14.5], [1.95, "b"], [5.4, "b"], [6.2, "e"]],
  marks: [
    { kind: "zone", rect: [-2.3, 17.5, 2.2, 10], tone: "us", t: [0.3] },
    { kind: "label", at: [5.2, 16.5], text: "Střídačky", tone: "us", t: [0.3] },
    { kind: "pass", from: [10, 13.5], to: [21, 14.5], t: [1, 2.6] },
    { kind: "run", from: [9, 24], to: [-1.1, 24.5], t: [2.6, 5.2] },
    { kind: "pass", from: [23, 19.5], to: [22.6, 26.5], t: [5.4, 7] },
    { kind: "run", from: [-1.1, 20.5], to: [9, 22.5], t: [5.2, 7.6] },
  ],
  why: "U 5 + 1 je střídání opakované a bez přerušení hry: kdykoli, kolikrát chcete, ale jen v prostoru střídaček a tak, aby na hřišti bylo vždy právě 5 hráčů a brankář (u mladší přípravky 4 a brankář). Nový hráč vběhne, až když střídaný opustí hřiště.",
};

const fairPlay = {
  id: "fair-play",
  title: "Fair play",
  icon: "🩹",
  dur: 10.4,
  beats: [
    { t: 0, text: "Modrý hráč se zranil a leží.", say: "Modrý hráč se zranil a leží na zemi. Míč máš zrovna ty." },
    { t: 2.6, text: "Kopni míč do autu, ať mu můžou pomoct.", say: "Kopni míč schválně do autu. Hra se zastaví a ke zraněnému hráči může přiběhnout trenér." },
    { t: 5.2, text: "Modří vhazují a míč nám vrátí.", say: "Modří pak vhazují a míč nám vrátí. Tak nám poděkují, že jsme jim pomohli." },
    { t: 7.8, text: "Tomu se říká fair play.", say: "Tomu se říká fair play. Není to pravidlo, ale slušní hráči to tak dělají." },
  ],
  players: [
    { id: "g", team: "us", gk: true, n: 1, path: [[0, 15, 2.5]] },
    { id: "c", team: "us", n: 4, path: [[0, 12, 21], [2.8, 12, 21], [4.6, 10.2, 25.3]] },
    { id: "d", team: "us", n: 5, tag: "Ty", hl: true, path: [[0, 18, 22.5], [0.4, 18, 22.5], [1.6, 19.5, 24.5]] },
    { id: "e", team: "us", n: 6, path: [[0, 23, 19], [5.2, 23, 19], [7, 25.5, 24]] },
    { id: "G", team: "them", gk: true, path: [[0, 15, 42.5]] },
    { id: "t1", team: "them", path: [[0, 12, 34]] },
    { id: "t2", team: "them", dim: true, path: [[0, 8, 28]] },
    { id: "t3", team: "them", path: [[0, 24.5, 31], [5.2, 24.5, 31], [6.6, 31.1, 27.8]] },
  ],
  ball: [[0, "d"], [2.8, "d"], [3.8, 31.3, 27.5], [6.6, 31.3, 27.5], [6.8, 31.1, 27.8], [7, 31.1, 27.8], [7.8, "e"], [10.4, "e"]],
  marks: [
    { kind: "label", at: [8, 31.2], text: "Au!", tone: "bad", t: [0.3] },
    { kind: "pass", from: [19.5, 26], to: [31.3, 27.5], t: [2.8, 5.2] },
    { kind: "pass", from: [31.1, 27.8], to: [26.7, 24.8], t: [7] },
    { kind: "check", at: [28.6, 21.6], t: [7.9] },
  ],
  why: "Když se hráč zraní, kopne tým s míčem míč do autu, aby se mu dalo pomoci; soupeř pak vhazováním míč vrátí. Není to pravidlo, ale zvyk fair play – stejně jako pozdrav a podání rukou po zápase.",
};

const handshake = {
  id: "po-zapase",
  title: "Po zápase",
  icon: "🤝",
  dur: 8.2,
  beats: [
    { t: 0, text: "Konec zápasu!", say: "Konec zápasu! Ať jste vyhráli, nebo prohráli, teď přijde něco moc důležitého." },
    { t: 2.6, text: "Podáme si ruce se všemi soupeři.", say: "Podáme si ruce nebo si plácneme se všemi soupeři. I když se nám dnes třeba nedařilo." },
    { t: 5.2, text: "Díky za zápas!", say: "Díky za zápas! Bez soupeře by žádný zápas nebyl, proto mu poděkujeme." },
  ],
  // Dvě řady se míjejí u půlicí čáry a hráči si plácnou.
  players: [
    ...[1, 2, 3, 4, 5, 6].map((n, i) => ({
      id: "u" + n,
      team: "us",
      gk: n === 1,
      n,
      path: [[0, 2 + i * 3, 21.1], [2.6, 2 + i * 3, 21.1], [7.4, 13 + i * 3, 21.1]],
    })),
    ...[0, 1, 2, 3, 4, 5].map((i) => ({
      id: "s" + i,
      team: "them",
      gk: i === 0,
      path: [[0, 13 + i * 3, 23.9], [2.6, 13 + i * 3, 23.9], [7.4, 2 + i * 3, 23.9]],
    })),
  ],
  ball: [],
  marks: [],
  why: "Po zápase se hráči obou týmů pozdraví – podají si ruce nebo si plácnou (tzv. hokejový pozdrav). Ruce by si měli podat i trenéři, jdou dětem příkladem.",
};

export const RULES = {
  id: "pravidla",
  title: "Pravidla",
  lead: "Co se smí a co ne.",
  scenes: [goal, kickoff, throwIn, corner, goalKick, foul, penalty, hand, offside, subs, fairPlay, handshake],
};
