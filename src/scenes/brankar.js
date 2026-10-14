/* Brankář — data scén (formát viz src/components/Scene.jsx). Souřadnice v metrech:
   x 0..W zleva, y 0..L od NAŠÍ branky (dole). Brankář (žlutý tým, oranžový dres, č. 1)
   je ve všech situacích „Ty“. První tři situace jsou vlastní komponenty (src/components/keeper).
   Titulky krátké, Kopík nahlas (say) dovysvětlí proč. */
import { KeeperStance } from "../components/keeper/KeeperStance.jsx";
import { KeeperAngle } from "../components/keeper/KeeperAngle.jsx";
import { KeeperHands } from "../components/keeper/KeeperHands.jsx";

const stance = { id: "postoj", title: "Připravený postoj", icon: "🧍", Component: KeeperStance };
const angle = { id: "kde-stat", title: "Kde stát", icon: "📐", Component: KeeperAngle };
const hands = { id: "ruce", title: "Jak chytat", icon: "🧤", Component: KeeperHands };

// Tyče naší branky (na brankové čáře y = 0).
const POST_L = [12.5, 0];
const POST_R = [17.5, 0];

/* 1 na 1: útočník jde sám na bránu. Brankář u brány mu nechá u bližší tyče díru (tečkované
   čáry k tyčím = „okno“, jdou s míčem), vyběhne po spojnici míč – střed brány, okno zmenší,
   zůstane na nohou a sebere míč po dlouhém doteku.
   Takhle ne: brankář couvne na čáru, díra u tyče zůstane a útočník do ní dá gól. */
const oneOnOne = {
  id: "vybehni",
  title: "Vyběhni 1 na 1",
  icon: "🏃",
  dur: 13.2,
  beats: [
    { t: 0, text: "Útočník běží sám na naši bránu.", say: "Útočník běží s míčem sám na naši bránu. Nikdo ho nehlídá, teď je to na tobě." },
    { t: 2.6, text: "Stojíš u brány? U tyče je velká díra.", say: "Když zůstaneš vzadu na čáře, útočník vidí velký kus brány. U tyče má díru, kam může vystřelit." },
    { t: 5.2, text: "Vyběhni mu naproti, mezi míč a bránu.", say: "Tak mu vyběhni naproti, mezi míč a střed brány. Čím jsi blíž k míči, tím víc brány zakryješ." },
    { t: 7.8, text: "Teď vidí jen malý kousek brány.", say: "Podívej, teď útočník vidí jen malý kousek brány. Skoro nemá kam střílet." },
    { t: 10.4, text: "Zůstaň na nohou a seber mu míč!", say: "Zůstaň na nohou, ať tě útočník neobejde. Jakmile si pustí míč dál od nohy, seber mu ho!" },
  ],
  players: [
    { id: "g", team: "us", gk: true, n: 1, tag: "Ty", hl: true, path: [[0, 15, 2.5], [5.2, 15, 2.5], [6.8, 16.8, 3.7], [10.5, 16.8, 3.7], [11.2, 17.5, 4.9]] },
    { id: "d", team: "us", n: 2, dim: true, path: [[0, 13.6, 16.5], [11, 15.4, 10.2]] },
    { id: "t1", team: "them", path: [[0, 21, 19], [2.4, 20.4, 15.2], [5.2, 20.3, 14.8], [7.4, 19.6, 11.2], [10.4, 19.4, 10.2], [11.4, 19.2, 9.2]] },
  ],
  ball: [[0, "t1"], [10.4, "t1"], [10.9, 17.6, 6.4], [11.2, "g", 0], [13.2, "g", 0]],
  marks: [
    // velké okno: brankář stojí u brány, u bližší tyče je díra
    { kind: "line", from: "ball", to: POST_L, follow: true, t: [2.6, 5.2] },
    { kind: "line", from: "ball", to: POST_R, follow: true, t: [2.6, 5.2] },
    { kind: "zone", rect: [15.6, -1.25, 1.9, 1.9], tone: "bad", t: [2.6, 5.6] },
    { kind: "label", at: [22.4, -0.4], text: "Díra!", tone: "bad", t: [2.6, 5.2] },
    // malé okno: brankář vyběhl a zakryl skoro celou bránu
    { kind: "line", from: "ball", to: POST_L, follow: true, t: [7.8, 10.4] },
    { kind: "line", from: "ball", to: POST_R, follow: true, t: [7.8, 10.4] },
    { kind: "check", at: [21.4, 1.8], t: [11.6] },
  ],
  why: "Když jde útočník sám na bránu, brankář mu včas vyběhne naproti po spojnici míč – střed branky: z místa střely pak zakryje větší část branky (zmenší úhel). Má zůstat na nohou, nepadat předčasně a míč sebrat, jakmile si ho útočník pustí dál od nohy.",
  bad: {
    dur: 12.6,
    beats: [
      { t: 0, text: "Útočník běží sám na naši bránu.", say: "Útočník běží s míčem sám na naši bránu. Nikdo ho nehlídá, teď je to na tobě." },
      { t: 2.6, text: "Stojíš u brány? U tyče je velká díra.", say: "Když zůstaneš vzadu na čáře, útočník vidí velký kus brány. U tyče má díru, kam může vystřelit." },
      { t: 5.2, text: "Ty ale couváš až na čáru.", say: "Ty ale couváš zpátky na brankovou čáru. Útočník se blíží a díra u tyče pořád zůstává." },
      { t: 7.8, text: "Útočník střílí do díry u tyče. Gól!", say: "Útočník vystřelí přesně do díry u tyče. Tam už nedosáhneš a je gól." },
      { t: 10.4, text: "Nezůstávej na čáře. Vyběhni naproti!", say: "Z čáry bránu nezakryješ. Příště vyběhni útočníkovi naproti, ať vidí jen kousek brány." },
    ],
    players: [
      { id: "g", team: "us", gk: true, n: 1, tag: "Ty", hl: true, path: [[0, 15, 2.5], [5.2, 15, 2.5], [6.4, 15.1, 1.4]] },
      { id: "d", team: "us", n: 2, dim: true, path: [[0, 13.6, 16.5], [11, 15.4, 10.2]] },
      { id: "t1", team: "them", path: [[0, 21, 19], [2.4, 20.4, 15.2], [5.2, 20.3, 14.8], [7.6, 19.6, 10.6], [9.4, 19.8, 9.6]] },
    ],
    ball: [[0, "t1"], [7.8, "t1"], [8.4, 17.2, -0.8]],
    marks: [
      { kind: "line", from: "ball", to: POST_L, follow: true, t: [2.6, 7.8] },
      { kind: "line", from: "ball", to: POST_R, follow: true, t: [2.6, 7.8] },
      { kind: "zone", rect: [15.6, -1.25, 1.9, 1.9], tone: "bad", t: [2.6] },
      { kind: "label", at: [22.4, -0.4], text: "Díra!", tone: "bad", t: [2.6, 7.8] },
      { kind: "shot", team: "them", from: "ball", to: [17.2, -0.8], t: [7.8] },
      { kind: "x", at: [21.0, 2.6], t: [8.6] },
    ],
  },
};

/* Volej nahlas: dlouhý míč do vápna, na míč běží brankář i obránce. Brankář zakřičí MOJE!,
   obránce uhne a brankář míč chytí v pokutovém území.
   Takhle ne: nikdo nevolá, oba zaváhají a soupeř dá gól. */
const call = {
  id: "volej",
  title: "Volej nahlas",
  icon: "📣",
  dur: 10.4,
  beats: [
    { t: 0, text: "Soupeř kope dlouhý míč k naší bráně.", say: "Soupeř kope dlouhý míč k naší bráně. Běžíte na něj oba, ty i kamarád." },
    { t: 2.6, text: "Křič nahlas: MOJE!", say: "Křič hned a nahlas: Moje! Kamarád tak ví, že míč bereš ty." },
    { t: 5.2, text: "Kamarád uhne a míč máš v rukou.", say: "Kamarád ti uhne z cesty, takže do sebe nenarazíte. Míč máš v rukou dřív než soupeř." },
    { t: 7.8, text: "Pamatuj: volej včas a nahlas!", say: "Pamatuj si: když jdeš na míč, volej včas a nahlas. Každý pak ví, kdo ho bere." },
  ],
  players: [
    { id: "g", team: "us", gk: true, n: 1, tag: "Ty", hl: true, path: [[0, 15, 2.5], [1.2, 15, 2.5], [3.8, 13.4, 3.6]] },
    { id: "a", team: "us", n: 2, path: [[0, 9.5, 13.5], [2.6, 11.0, 9.8], [4.4, 8.4, 6.8]] },
    { id: "b", team: "us", n: 3, dim: true, path: [[0, 24, 9.8], [4.0, 20.6, 6.6]] },
    { id: "t1", team: "them", path: [[0, 21, 13.5], [4.2, 17.6, 10.0]] },
    { id: "t2", team: "them", dim: true, path: [[0, 17.4, 26], [0.8, 17.2, 25.4]] },
  ],
  ball: [[0, "t2"], [0.8, "t2"], [4.2, 13.4, 5.1], [4.5, "g", 0], [10.4, "g", 0]],
  marks: [
    { kind: "pass", from: "ball", to: [13.4, 5.1], t: [0.8, 4.2] },
    { kind: "label", at: [9.3, 1.8], text: "MOJE!", tone: "us", t: [2.6, 5.2] },
    { kind: "run", from: [11.0, 9.8], to: [8.4, 6.8], t: [2.7, 4.6] },
    { kind: "check", at: [10.4, 3.4], t: [5.4] },
  ],
  why: "Brankář volá včas a nahlas, aby všichni věděli, kdo jde na míč: „Moje!“ = beru ho já (obránce uhne a jistí), „Hraj!“ = míč je tvůj, zůstávám v bráně. Bez volání hráči zaváhají nebo do sebe narazí – a soupeř je u míče první.",
  bad: {
    dur: 10.4,
    beats: [
      { t: 0, text: "Soupeř kope dlouhý míč k naší bráně.", say: "Soupeř kope dlouhý míč k naší bráně. Běžíte na něj oba, ty i kamarád." },
      { t: 2.6, text: "Nikdo nevolá. Kdo ten míč vezme?", say: "Ty ani kamarád nic neřeknete. Oba váháte, kdo ten míč vezme." },
      { t: 5.2, text: "Soupeř je u míče první. Gól!", say: "Zatímco váháte, soupeř doběhne k míči první. Vystřelí a je gól." },
      { t: 7.8, text: "Příště křič nahlas: MOJE!", say: "Když nikdo nevolá, kamarádi váhají nebo do sebe narazí. Příště křič hned a nahlas: Moje!" },
    ],
    players: [
      { id: "g", team: "us", gk: true, n: 1, tag: "Ty", hl: true, path: [[0, 15, 2.5], [1.2, 15, 2.5], [3.4, 11.8, 4.0]] },
      { id: "a", team: "us", n: 2, path: [[0, 9.5, 13.5], [2.6, 11.0, 9.8], [3.6, 10.6, 8.8]] },
      { id: "b", team: "us", n: 3, dim: true, path: [[0, 24, 9.8], [4.0, 20.6, 6.6]] },
      { id: "t1", team: "them", path: [[0, 21, 13.5], [3.4, 18.0, 11.0], [5.4, 13.4, 8.1], [5.8, 13.4, 7.8]] },
      { id: "t2", team: "them", dim: true, path: [[0, 17.4, 26], [0.8, 17.2, 25.4]] },
    ],
    // míč dopadne mezi brankáře a obránce a leží, dokud k němu nedoběhne soupeř
    ball: [[0, "t2"], [0.8, "t2"], [4.2, 13.4, 6.6], [5.2, 13.4, 6.6], [5.4, "t1"], [5.8, "t1"], [6.4, 16.9, -0.8]],
    marks: [
      { kind: "pass", from: "ball", to: [13.4, 6.6], t: [0.8, 4.2] },
      { kind: "label", at: [7.9, 5.9], text: "Kdo?", tone: "bad", t: [2.8, 5.2] },
      { kind: "shot", team: "them", from: "ball", to: [16.9, -0.8], t: [5.8] },
      { kind: "x", at: [20.0, 2.2], t: [6.6] },
    ],
  },
};

/* Rozehraj rychle a do strany: brankář má míč v rukou, uprostřed je plno soupeřů,
   spoluhráči se roztáhnou → hod k čáře volnému. Takhle ne: hod doprostřed → soupeř střílí. */
const throwOut = {
  id: "rozehravka",
  title: "Rozehraj do strany",
  icon: "🤾",
  dur: 12.8,
  beats: [
    { t: 0, text: "Máš míč v rukou! Rozhlédni se.", say: "Máš míč v rukou! Než ho rozehraješ, rozhlédni se, kdo je volný." },
    { t: 2.6, text: "Uprostřed před bránou stojí soupeři.", say: "Pozor, uprostřed před naší bránou stojí soupeři. Kdyby tam míč dostali, hned by stříleli." },
    { t: 5.2, text: "Hoď míč rychle volnému do strany.", say: "Hoď míč rychle kamarádovi, který je volný u čáry. Soupeři k němu nestihnou doběhnout." },
    { t: 7.8, text: "Kamarád má volno a vede míč dopředu.", say: "Kamarád má kolem sebe volno, tak vede míč dopředu. Takhle rychle začíná náš útok." },
    { t: 10.4, text: "Pamatuj: rychle a do strany!", say: "Pamatuj si: rozehraj rychle a do strany, nikdy ne doprostřed před naši bránu." },
  ],
  players: [
    { id: "g", team: "us", gk: true, n: 1, tag: "Ty", hl: true, path: [[0, 15, 2.6], [2.4, 15.8, 3.2]] },
    { id: "a", team: "us", n: 2, path: [[0, 9, 7.5], [0.4, 9, 7.5], [2.4, 3.5, 9.5]] },
    { id: "b", team: "us", n: 3, path: [[0, 20.5, 6.5], [0.3, 20.5, 6.5], [2.4, 26.8, 8.6], [7.8, 26.8, 8.8], [10.6, 27.4, 17]] },
    { id: "c", team: "us", n: 4, path: [[0, 14, 14.5], [3, 13.5, 16.5]] },
    { id: "d", team: "us", n: 5, path: [[0, 6, 20], [3, 4.5, 25]] },
    { id: "e", team: "us", n: 6, path: [[0, 23, 21], [3, 25, 27]] },
    { id: "t1", team: "them", path: [[0, 12.5, 10.5], [3, 13.2, 11.6]] },
    { id: "t2", team: "them", path: [[0, 19, 11], [3, 18.6, 13.4]] },
    { id: "t3", team: "them", path: [[0, 16, 18.5], [3, 16.4, 19.2]] },
    { id: "t4", team: "them", dim: true, path: [[0, 8.6, 19], [3, 9, 21.5]] },
    { id: "t5", team: "them", dim: true, path: [[0, 21.5, 24], [3, 22, 26]] },
    { id: "G", team: "them", gk: true, dim: true, path: [[0, 15, 42.5]] },
  ],
  ball: [[0, "g", 0], [5.4, "g", 0], [6.6, "b"], [12.8, "b"]],
  marks: [
    { kind: "run", from: [9, 7.5], to: [3.5, 9.5], t: [0.4, 2.8] },
    { kind: "run", from: [20.5, 6.5], to: [26.8, 8.6], t: [0.3, 2.8] },
    { kind: "zone", circle: [15, 12.2, 4.6], tone: "bad", t: [2.6, 6.8] },
    { kind: "zone", rect: [23.6, 10.8, 6, 7], at: [26.6, 16.6], text: "Volno", t: [5.2, 9.0] },
    { kind: "pass", from: "ball", to: [26.8, 10.3], t: [5.4, 6.8] },
    { kind: "dribble", from: [26.8, 10.8], to: [27.4, 18], t: [7.8] },
  ],
  why: "Po chycení míče rozehraj rychle, dokud se soupeř nevrátil, a raději do strany volnému spoluhráči než doprostřed před vlastní bránu – ztráta tam znamená střelu. Rukou smí brankář rozehrát kamkoli (i přes půlku); míč kopnutý z pokutového území (i výkop z ruky) ale nesmí přeletět půlicí čáru vzduchem.",
  quiz: {
    at: 2.4,
    ask: "Kam míč rozehraješ?",
    options: [
      { text: "Volnému do strany", ok: true },
      { text: "Doprostřed před bránu", ok: false },
      { text: "Vykopnu co nejdál", ok: false },
    ],
  },
  bad: {
    dur: 12.8,
    beats: [
      { t: 0, text: "Máš míč v rukou! Rozhlédni se.", say: "Máš míč v rukou! Než ho rozehraješ, rozhlédni se, kdo je volný." },
      { t: 2.6, text: "Uprostřed před bránou stojí soupeři.", say: "Pozor, uprostřed před naší bránou stojí soupeři. Kdyby tam míč dostali, hned by stříleli." },
      { t: 5.2, text: "Ty ale hodíš míč doprostřed.", say: "Ty ale hodíš míč doprostřed, mezi soupeře. Soupeř to má k míči blíž než kamarád." },
      { t: 7.8, text: "Soupeř je hned před bránou a střílí. Gól!", say: "Soupeř má míč kousek před naší bránou. Hned vystřelí a je gól." },
      { t: 10.4, text: "Doprostřed ne! Hoď do strany volnému.", say: "Před naší bránou může soupeř hned střílet. Příště hoď míč do strany volnému kamarádovi." },
    ],
    players: [
      { id: "g", team: "us", gk: true, n: 1, tag: "Ty", hl: true, path: [[0, 15, 2.6], [2.4, 15.2, 3.4]] },
      { id: "a", team: "us", n: 2, path: [[0, 9, 7.5], [0.4, 9, 7.5], [2.4, 3.5, 9.5]] },
      { id: "b", team: "us", n: 3, path: [[0, 20.5, 6.5], [0.3, 20.5, 6.5], [2.4, 26.8, 8.6]] },
      { id: "c", team: "us", n: 4, path: [[0, 14, 14.5], [3, 14.6, 13.6]] },
      { id: "d", team: "us", n: 5, path: [[0, 6, 20], [3, 4.5, 25]] },
      { id: "e", team: "us", n: 6, path: [[0, 23, 21], [3, 25, 27]] },
      { id: "t1", team: "them", path: [[0, 12.5, 10.5], [3, 13.2, 11.2], [5.4, 13.2, 11.2], [6.0, 14.0, 10.2], [7.8, 14.0, 10.2], [9.0, 12.4, 8.2]] },
      { id: "t2", team: "them", path: [[0, 19, 11], [3, 18.6, 13.4]] },
      { id: "t3", team: "them", path: [[0, 16, 18.5], [3, 16.4, 19.2]] },
      { id: "t4", team: "them", dim: true, path: [[0, 8.6, 19], [3, 9, 21.5]] },
      { id: "t5", team: "them", dim: true, path: [[0, 21.5, 24], [3, 22, 26]] },
      { id: "G", team: "them", gk: true, dim: true, path: [[0, 15, 42.5]] },
    ],
    ball: [[0, "g", 0], [5.4, "g", 0], [6.0, "t1"], [9.0, "t1"], [9.6, 13.0, -0.8]],
    marks: [
      { kind: "run", from: [9, 7.5], to: [3.5, 9.5], t: [0.4, 2.8] },
      { kind: "run", from: [20.5, 6.5], to: [26.8, 8.6], t: [0.3, 2.8] },
      { kind: "zone", circle: [15, 12.2, 4.6], tone: "bad", t: [2.6] },
      { kind: "pass", from: "ball", to: [14.0, 8.7], t: [5.4, 6.4] },
      { kind: "dribble", team: "them", from: [14.0, 8.6], to: [12.4, 6.7], t: [7.8, 9.0] },
      { kind: "shot", team: "them", from: "ball", to: [13.0, -0.8], t: [9.0] },
      { kind: "x", at: [9.2, 2.4], t: [9.8] },
    ],
  },
};

/* Malá domů: obránce v tísni přihraje nohou zpátky. Brankář se nabídne vedle branky, míč
   NEchytá rukama, zpracuje ho nohou a vrátí ho kamarádovi, který se mezitím uvolnil.
   Takhle ne: brankář míč chytí do rukou → nepřímý volný kop pro soupeře před naší bránou. */
const backPassStart = [
  { t: 0, text: "Soupeř honí kamaráda. Ukaž se mu!", say: "Soupeř honí kamaráda s míčem. Ukaž se mu bokem, ať ti může přihrát zpátky." },
  { t: 2.6, text: "Kamarád ti přihraje nohou zpátky.", say: "Kamarád ti přihraje nohou zpátky. Tomu se říká malá domů a platí pro ni zvláštní pravidlo." },
];
const backPass = {
  id: "mala-domu",
  title: "Malá domů",
  icon: "🦶",
  dur: 11.6,
  beats: [
    ...backPassStart,
    { t: 5.2, text: "Malou domů nechytej. Zpracuj ji nohou!", say: "Malou domů nesmíš chytit do rukou, to by byl volný kop pro soupeře. Zpracuj ji nohou jako hráč v poli." },
    { t: 7.8, text: "Kamarád se uvolnil. Přihraj mu!", say: "Mezitím se kamarád uvolnil od soupeře. Přihraj mu a míč máme zase v bezpečí." },
  ],
  players: [
    { id: "g", team: "us", gk: true, n: 1, tag: "Ty", hl: true, path: [[0, 15, 2.5], [0.4, 15, 2.5], [2.0, 11.4, 3.1], [5.4, 11.4, 3.1], [6.6, 11.6, 3.2]] },
    { id: "a", team: "us", n: 2, path: [[0, 8.5, 12.5], [2.6, 8.2, 11.4], [3.4, 8.2, 11.4], [5.6, 3.6, 8.6], [8.8, 3.6, 8.6], [11.6, 4.4, 17]] },
    { id: "b", team: "us", n: 3, path: [[0, 20, 9], [2, 22.5, 9.5]] },
    { id: "c", team: "us", n: 4, dim: true, path: [[0, 14.5, 16.5], [3, 16, 18]] },
    { id: "t1", team: "them", path: [[0, 9.5, 17.5], [2.6, 8.9, 13.9], [3.4, 8.9, 13.9], [6.2, 10.8, 8.6]] },
    { id: "t2", team: "them", dim: true, path: [[0, 15.5, 21.5], [3, 16.5, 21]] },
  ],
  // kamarád stojí čelem k naší bráně, míč má u nohy; přihrávka zpět je pomalá (kvíz ji zastaví v půli)
  ball: [[0, 8.5, 11.0], [2.6, 8.2, 9.9], [3.4, 8.2, 9.9], [5.2, 11.4, 4.6], [5.4, "g"], [7.8, "g"], [8.8, "a"], [11.6, "a"]],
  marks: [
    { kind: "run", from: [15, 2.5], to: [11.4, 3.1], t: [0.4, 2.2] },
    { kind: "pass", from: [8.2, 9.9], to: [11.4, 4.6], t: [3.4, 5.2] },
    { kind: "label", at: [6.6, 3.2], text: "Nohou!", tone: "good", t: [5.2, 7.8] },
    { kind: "run", from: [8.2, 11.4], to: [3.6, 8.6], t: [3.4, 5.8] },
    { kind: "pass", from: "ball", to: [3.6, 10.1], t: [7.8, 9.0] },
    { kind: "dribble", from: [3.8, 10.6], to: [4.4, 18], t: [9.0] },
    { kind: "check", at: [7.0, 3.2], t: [9.2] },
  ],
  why: "„Malá domů“ je v 5+1 zakázaná (Pravidla FAČR 2023, pravidlo III): brankář nesmí chytit do rukou úmyslnou přihrávku nohou od spoluhráče. Trestá se nepřímým volným kopem z hranice pokutového území na spojnici s místem přestupku – proto brankář takový míč zpracuje nohou a rozehraje. V mladší přípravce (U8–U9) ji chytit smí.",
  // Mladší přípravka: malou domů chytit smí → chytí a hodí míč kamarádovi, který se uvolnil. Špatně to tu není.
  younger: {
    beats: [
      ...backPassStart,
      { t: 5.2, text: "Malou domů smíš chytit do rukou.", say: "V mladší přípravce smíš malou domů chytit do rukou. Ve starší už ne, tak ji zkoušej hrát i nohou." },
      { t: 7.8, text: "Kamarád se uvolnil. Hoď mu míč!", say: "Mezitím se kamarád uvolnil od soupeře. Hoď mu míč a máme ho zase v bezpečí." },
    ],
    ball: [[0, 8.5, 11.0], [2.6, 8.2, 9.9], [3.4, 8.2, 9.9], [5.2, 11.4, 4.6], [5.5, "g", 0], [7.8, "g", 0], [8.8, "a"], [11.6, "a"]],
    marks: [
      { kind: "run", from: [15, 2.5], to: [11.4, 3.1], t: [0.4, 2.2] },
      { kind: "pass", from: [8.2, 9.9], to: [11.4, 4.6], t: [3.4, 5.2] },
      { kind: "label", at: [5.8, 3.2], text: "Rukama!", tone: "good", t: [5.2, 7.8] },
      { kind: "run", from: [8.2, 11.4], to: [3.6, 8.6], t: [3.4, 5.8] },
      { kind: "pass", from: [11.4, 3.1], to: [3.6, 10.1], t: [7.8, 9.0] },
      { kind: "dribble", from: [3.8, 10.6], to: [4.4, 18], t: [9.0] },
      { kind: "check", at: [7.0, 3.2], t: [9.2] },
    ],
    why: "V mladší přípravce (4 + 1) je „malá domů“ povolená (Pravidla FAČR 2023, pravidlo III): brankář smí chytit do rukou i úmyslnou přihrávku nohou od spoluhráče. Ve starší přípravce už je zakázaná, proto je dobré, když ji brankář zkouší zpracovat i nohou.",
    bad: null,
    quiz: null, // obě odpovědi by byly správně
  },
  quiz: {
    at: 4.4,
    ask: "Kamarád ti přihrál nohou. Co uděláš?",
    options: [
      { text: "Zpracuju míč nohou", ok: true },
      { text: "Chytím ho do rukou", ok: false },
    ],
  },
  bad: {
    dur: 12.8,
    beats: [
      ...backPassStart,
      { t: 5.2, text: "Ty ale míč chytíš do rukou.", say: "Ty ale míč chytíš do rukou. A to brankář nesmí, když mu kamarád přihrál nohou." },
      { t: 7.8, text: "Písk! Nepřímý volný kop pro soupeře.", say: "Sudí pískne a soupeř kope nepřímý volný kop. A to kousek před naší bránou!" },
      { t: 10.4, text: "Malou domů nechytej. Hraj ji nohou!", say: "Volný kop tak blízko brány je nebezpečný. Příště malou domů zpracuj nohou, ne rukama." },
    ],
    players: [
      { id: "g", team: "us", gk: true, n: 1, tag: "Ty", hl: true, path: [[0, 15, 2.5], [0.4, 15, 2.5], [2.0, 11.4, 3.1], [8.0, 11.4, 3.1], [9.4, 14.6, 1.0]] },
      { id: "a", team: "us", n: 2, path: [[0, 8.5, 12.5], [2.6, 8.2, 11.4], [3.4, 8.2, 11.4], [5.6, 4.6, 10.4]] },
      { id: "b", team: "us", n: 3, path: [[0, 20, 9], [2, 22.5, 9.5]] },
      { id: "c", team: "us", n: 4, dim: true, path: [[0, 14.5, 16.5], [3, 16, 18]] },
      { id: "t1", team: "them", path: [[0, 9.5, 17.5], [2.6, 8.9, 13.9], [3.4, 8.9, 13.9], [6.2, 10.4, 9.6], [8.0, 10.4, 9.6], [9.4, 11.4, 7.4]] },
      { id: "t2", team: "them", dim: true, path: [[0, 15.5, 21.5], [3, 16.5, 21]] },
    ],
    // chytí do rukou → sudí píská, míč se položí na hranici pokutového území
    ball: [[0, 8.5, 11.0], [2.6, 8.2, 9.9], [3.4, 8.2, 9.9], [5.2, 11.4, 4.6], [5.5, "g", 0], [8.0, "g", 0], [8.6, 11.4, 5.5]],
    marks: [
      { kind: "run", from: [15, 2.5], to: [11.4, 3.1], t: [0.4, 2.2] },
      { kind: "pass", from: [8.2, 9.9], to: [11.4, 4.6], t: [3.4, 5.2] },
      { kind: "label", at: [5.8, 3.2], text: "Do rukou!", tone: "bad", t: [5.2, 7.6] },
      { kind: "x", at: [6.8, 3.0], t: [7.8] },
      { kind: "label", at: [22.6, 5.4], text: "Nepřímý volný kop!", tone: "bad", t: [7.8] },
      { kind: "zone", circle: [11.4, 5.5, 1.4], tone: "bad", t: [8.6] },
    ],
  },
};

/* Hraj i nohama: máme míč, soupeř napadá obránce. Brankář vystoupí z brány jako poslední
   hráč v poli, obránce mu přihraje zpátky a brankář přenese hru na volnou stranu.
   Takhle ne: brankář zůstane v bráně, obránce nemá komu přihrát a přijde o míč. */
const feet = {
  id: "nohama",
  title: "Hraj i nohama",
  icon: "👟",
  dur: 13,
  beats: [
    { t: 0, text: "Máme míč. Soupeř ale běží na kamaráda.", say: "Máme míč, ale soupeř běží na kamaráda. Ten teď potřebuje rychle přihrát." },
    { t: 2.6, text: "Vystup z brány a nabídni se mu!", say: "Když máme míč, vystup z brány dopředu. Kamarád ti pak může přihrát zpátky." },
    { t: 5.2, text: "Kamarád ti přihraje zpátky.", say: "Kamarád ti stihne přihrát zpátky, než k němu soupeř doběhne. Míč je v bezpečí." },
    { t: 7.8, text: "Pošli míč na druhou stranu, tam je volno.", say: "Soupeř teď běží k tobě. Pošli míč rychle na druhou stranu, kde je volno." },
    { t: 10.4, text: "Kamarád má volno. Útočíme!", say: "Kamarád na druhé straně má volno a vede míč dopředu. Útočíme!" },
  ],
  players: [
    { id: "g", team: "us", gk: true, n: 1, tag: "Ty", hl: true, path: [[0, 15, 2.5], [2.6, 15, 2.5], [4.2, 16.2, 6.4]] },
    { id: "a", team: "us", n: 2, path: [[0, 9, 10], [2.4, 5.6, 11.5], [9.2, 6, 12], [10.4, 6, 12.2], [13, 6.6, 20.5]] },
    { id: "b", team: "us", n: 3, path: [[0, 22.5, 12.5], [2.6, 22.0, 11.4], [5.2, 22.0, 11.4], [6.8, 25.5, 11.0]] },
    { id: "c", team: "us", n: 4, path: [[0, 14.5, 16.5]] },
    { id: "d", team: "us", n: 5, dim: true, path: [[0, 8, 27]] },
    { id: "e", team: "us", n: 6, dim: true, path: [[0, 22, 28]] },
    { id: "t1", team: "them", path: [[0, 23.2, 17.2], [2.6, 23.4, 15.0], [5.4, 23.4, 14.2], [8.4, 19.2, 10.6]] },
    { id: "t2", team: "them", path: [[0, 15.2, 19.8]] },
    { id: "t3", team: "them", dim: true, path: [[0, 10.5, 22.5]] },
    { id: "t4", team: "them", dim: true, path: [[0, 8.5, 30.5]] },
    { id: "t5", team: "them", dim: true, path: [[0, 21.5, 31.5]] },
  ],
  // kamarád stojí čelem k naší bráně, míč má u nohy
  ball: [[0, 22.6, 11.0], [2.6, 22.0, 9.9], [5.2, 22.0, 9.9], [6.2, 16.2, 7.9], [6.4, "g"], [8.0, "g"], [9.2, "a"], [13, "a"]],
  marks: [
    { kind: "run", from: [15, 2.5], to: [16.2, 6.4], t: [2.6, 4.4] },
    { kind: "pass", from: [22.0, 9.9], to: [16.2, 7.9], t: [5.2, 6.4] },
    { kind: "zone", rect: [0.8, 14, 8.6, 8], text: "Volno", t: [7.8, 10.8] },
    { kind: "pass", from: "ball", to: [6.0, 13.5], t: [8.0, 9.4] },
    { kind: "dribble", from: [6.0, 14.0], to: [6.6, 21.4], t: [10.4] },
  ],
  why: "Brankář je zároveň posledním hráčem v poli: když máme míč, vystoupí z branky (k hranici pokutového území), nabídne se obráncům na přihrávku zpět a přenese hru na volnou stranu. Proto i brankáři v přípravce trénují přihrávky a zpracování míče – a část zápasu hrají v poli.",
  bad: {
    dur: 10.4,
    beats: [
      { t: 0, text: "Máme míč. Soupeř ale běží na kamaráda.", say: "Máme míč, ale soupeř běží na kamaráda. Ten teď potřebuje rychle přihrát." },
      { t: 2.6, text: "Ty ale zůstáváš stát v bráně.", say: "Ty ale zůstáváš stát vzadu v bráně. Jsi moc daleko a kamarád ti nemůže bezpečně přihrát." },
      { t: 5.2, text: "Soupeř mu vezme míč a jde na bránu!", say: "Kamarád nemá komu přihrát a soupeř mu míč vezme. Teď běží sám na naši bránu!" },
      { t: 7.8, text: "Příště vystup z brány a nabídni se!", say: "Vzadu v bráně kamarádům nepomůžeš. Příště vystup dopředu a nabídni se jim na přihrávku." },
    ],
    players: [
      { id: "g", team: "us", gk: true, n: 1, tag: "Ty", hl: true, path: [[0, 15, 2.5]] },
      { id: "a", team: "us", n: 2, path: [[0, 9, 10], [2.4, 5.6, 11.5]] },
      { id: "b", team: "us", n: 3, path: [[0, 22.5, 12.5], [2.6, 22.0, 11.4]] },
      { id: "c", team: "us", n: 4, path: [[0, 14.5, 16.5]] },
      { id: "d", team: "us", n: 5, dim: true, path: [[0, 8, 27]] },
      { id: "e", team: "us", n: 6, dim: true, path: [[0, 22, 28]] },
      { id: "t1", team: "them", path: [[0, 23.2, 17.2], [2.6, 23.4, 15.0], [5.0, 23.4, 14.2], [5.9, 24.7, 11.0], [7.6, 21.0, 6.2]] },
      { id: "t2", team: "them", path: [[0, 15.2, 19.8]] },
      { id: "t3", team: "them", dim: true, path: [[0, 10.5, 22.5]] },
      { id: "t4", team: "them", dim: true, path: [[0, 8.5, 30.5]] },
      { id: "t5", team: "them", dim: true, path: [[0, 21.5, 31.5]] },
    ],
    ball: [[0, 22.6, 11.0], [2.6, 22.0, 9.9], [5.6, 22.0, 9.9], [5.9, "t1"], [7.6, "t1"]],
    marks: [
      { kind: "line", from: "b", to: "g", t: [2.8, 5.2] },
      { kind: "zone", circle: [22.4, 10.8, 3.6], tone: "bad", t: [2.8] },
      { kind: "dribble", team: "them", from: [24.7, 9.5], to: [21.0, 4.7], t: [5.9] },
      { kind: "x", at: [25.2, 3.0], t: [7.6] },
    ],
  },
};

export const KEEPER = {
  id: "brankar",
  title: "Brankář",
  lead: "Chytá, brání a rozehrává.",
  scenes: [stance, angle, hands, oneOnOne, call, throwOut, backPass, feet],
};
