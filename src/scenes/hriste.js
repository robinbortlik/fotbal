/* Hřiště — kde hrajeme a kdo hraje. Data scén (formát viz src/components/Scene.jsx).
   Souřadnice v metrech: x 0..W zleva, y 0..L od NAŠÍ branky (dole). Rozměry viz src/lib/pitch.js.
   Titulky krátké, Kopík nahlas (say) dovysvětlí proč. */

/* Soupeř ve výchozím postavení 2-1-2 na své polovině (zrcadlově k nám). */
const themHome = [
  { id: "G", team: "them", gk: true, path: [[0, 15, 42.5]] },
  { id: "t1", team: "them", path: [[0, 8, 36]] },
  { id: "t2", team: "them", path: [[0, 22, 36]] },
  { id: "t3", team: "them", path: [[0, 15, 30.5]] },
  { id: "t4", team: "them", path: [[0, 9, 25]] },
  { id: "t5", team: "them", path: [[0, 21, 25]] },
];

const team = {
  id: "pet-plus-jedna",
  title: "Hraje nás 5 + 1",
  icon: "👕",
  dur: 12,
  beats: [
    { t: 0, text: "Hrajeme 5 + 1. Je nás šest!", say: "Hrajeme pět plus jedna. Pět a jedna je šest a tolik nás je na hřišti." },
    { t: 2.6, text: "Jeden je brankář. Má jiný dres.", say: "Jeden z nás je brankář. Má jiný dres, aby každý poznal, že smí chytat rukama." },
    { t: 5.4, text: "Pět hráčů hraje v poli.", say: "Pět hráčů hraje v poli. Každý má své místo, někdo vzadu, někdo uprostřed a někdo vpředu." },
    { t: 9.2, text: "Soupeř má taky 5 + 1. To je fér!", say: "Soupeř má taky pět hráčů v poli a brankáře. Šest proti šesti, to je fér." },
  ],
  // Z hloučku (pokřik) běží nejdřív brankář do branky, pak ostatní na místa: 2 vzadu, 1 uprostřed, 2 vpředu.
  players: [
    { id: "g", team: "us", gk: true, n: 1, path: [[0, 15, 7.2], [2.8, 15, 7.2], [4.2, 15, 2.5]] },
    { id: "a", team: "us", n: 2, path: [[0, 12.6, 8.6], [5.5, 12.6, 8.6], [7.3, 8, 9]] },
    { id: "b", team: "us", n: 3, path: [[0, 17.4, 8.6], [5.5, 17.4, 8.6], [7.3, 22, 9]] },
    { id: "c", team: "us", n: 4, path: [[0, 15, 12.8], [5.5, 15, 12.8], [6.9, 15, 14.5]] },
    { id: "d", team: "us", n: 5, path: [[0, 12.6, 11.4], [5.5, 12.6, 11.4], [7.7, 9, 20]] },
    { id: "e", team: "us", n: 6, path: [[0, 17.4, 11.4], [5.5, 17.4, 11.4], [7.7, 21, 20]] },
    ...themHome,
  ],
  ball: [[0, 15, 22.5]],
  marks: [
    { kind: "label", at: [21, 2.5], text: "Brankář", tone: "us", t: [3.8] },
    { kind: "label", at: [15, 11.6], text: "5 hráčů v poli", tone: "us", t: [7.9] },
    { kind: "label", at: [15, 33.4], text: "Soupeř: 5 + 1", t: [9.2] },
  ],
  why: "Starší přípravka hraje podle pravidel FAČR 5 + 1: pět hráčů v poli a brankář (nejméně 4 + 1), soupeř stejně. Doporučené rozestavení je 2-1-2 a děti se mají na postech střídat, i v brance. Mladší přípravka (U8–U9) hraje 4 + 1.",
  // všichni už stojí na místech, štítek „5 hráčů v poli“ ještě není
  quiz: {
    at: 7.8,
    ask: "Kolik našich hraje v poli?",
    options: [
      { text: "Pět", ok: true },
      { text: "Šest", ok: false },
      { text: "Jedenáct", ok: false },
    ],
  },
  // Mladší přípravka: 4 + 1 ve čtverci (2 vzadu, 2 vpředu), soupeř zrcadlově.
  younger: {
    title: "Hraje nás 4 + 1",
    beats: [
      { t: 0, text: "Hrajeme 4 + 1. Je nás pět!", say: "Hrajeme čtyři plus jedna. Čtyři a jedna je pět a tolik nás je na hřišti." },
      { t: 2.6, text: "Jeden je brankář. Má jiný dres.", say: "Jeden z nás je brankář. Má jiný dres, aby každý poznal, že smí chytat rukama." },
      { t: 5.4, text: "Čtyři hráči hrají v poli.", say: "Čtyři hráči hrají v poli. Každý má své místo, dva vzadu a dva vpředu." },
      { t: 9.2, text: "Soupeř má taky 4 + 1. To je fér!", say: "Soupeř má taky čtyři hráče v poli a brankáře. Pět proti pěti, to je fér." },
    ],
    players: [
      { id: "g", team: "us", gk: true, n: 1, path: [[0, 15, 7.2], [2.8, 15, 7.2], [4.2, 15, 2.5]] },
      { id: "a", team: "us", n: 2, path: [[0, 12.6, 8.6], [5.5, 12.6, 8.6], [7.3, 8.5, 9.5]] },
      { id: "b", team: "us", n: 3, path: [[0, 17.4, 8.6], [5.5, 17.4, 8.6], [7.3, 21.5, 9.5]] },
      { id: "c", team: "us", n: 4, path: [[0, 12.6, 11.4], [5.5, 12.6, 11.4], [7.7, 9.5, 18.5]] },
      { id: "d", team: "us", n: 5, path: [[0, 17.4, 11.4], [5.5, 17.4, 11.4], [7.7, 20.5, 18.5]] },
      { id: "G", team: "them", gk: true, path: [[0, 15, 42.5]] },
      { id: "t1", team: "them", path: [[0, 8.5, 35.5]] },
      { id: "t2", team: "them", path: [[0, 21.5, 35.5]] },
      { id: "t3", team: "them", path: [[0, 9.5, 26.5]] },
      { id: "t4", team: "them", path: [[0, 20.5, 26.5]] },
    ],
    marks: [
      { kind: "label", at: [21, 2.5], text: "Brankář", tone: "us", t: [3.8] },
      { kind: "label", at: [15, 14], text: "4 hráči v poli", tone: "us", t: [7.9] },
      { kind: "label", at: [15, 31], text: "Soupeř: 4 + 1", t: [9.2] },
    ],
    why: "Mladší přípravka hraje podle pravidel FAČR 4 + 1: čtyři hráči v poli a brankář, soupeř stejně. Pro tuto kategorii FAČR doporučuje rozestavení do čtverce (2-2) a děti se mají na postech střídat, i v brance.",
    quiz: {
      at: 7.8,
      ask: "Kolik našich hraje v poli?",
      options: [
        { text: "Čtyři", ok: true },
        { text: "Pět", ok: false },
        { text: "Jedenáct", ok: false },
      ],
    },
  },
};

const sizeEnd = [
  { t: 7.2, text: "Hřiště dospělých je víc než dvakrát delší.", say: "Hřiště dospělých je víc než dvakrát delší i širší. Pro tebe by bylo moc velké." },
  { t: 10, text: "Na malém hřišti máš míč častěji.", say: "Na malém hřišti nemáš k míči nikdy daleko. Proto si kopneš mnohem častěji." },
];
const size = {
  id: "velikost",
  title: "Velikost hřiště",
  icon: "📏",
  dur: 12.4,
  beats: [
    { t: 0, text: "Tohle je naše hřiště." },
    { t: 2.4, text: "Je dlouhé 45 metrů…", say: "Je dlouhé čtyřicet pět metrů, od jedné branky ke druhé." },
    { t: 4.8, text: "…a široké 30 metrů.", say: "A široké je třicet metrů, z jedné strany na druhou." },
    ...sizeEnd,
  ],
  players: [],
  ball: [[0, 15, 22.5]],
  // Dvojité šipky = měřítko (od štítku na obě strany).
  marks: [
    { kind: "run", from: [3, 22.5], to: [3, 0.3], t: [2.4] },
    { kind: "run", from: [3, 22.5], to: [3, 44.7], t: [2.4] },
    { kind: "label", at: [3, 22.5], text: "45 m", tone: "us", t: [2.4] },
    { kind: "run", from: [15, 11], to: [0.3, 11], t: [4.8] },
    { kind: "run", from: [15, 11], to: [29.7, 11], t: [4.8] },
    { kind: "label", at: [15, 11], text: "30 m", tone: "us", t: [4.8] },
  ],
  why: "Podle pravidel FAČR pro 5 + 1 má hřiště 43–45 × 28–30 m (doporučuje se větší rozměr), hřiště dospělých bývá 105 × 68 m. Na malém hřišti má každé dítě mnohem víc doteků s míčem. Mladší přípravka (U8–U9) hraje na 35–37 × 24–26 m.",
  younger: {
    beats: [
      { t: 0, text: "Tohle je naše hřiště." },
      { t: 2.4, text: "Je dlouhé 37 metrů…", say: "Je dlouhé třicet sedm metrů, od jedné branky ke druhé." },
      { t: 4.8, text: "…a široké 26 metrů.", say: "A široké je dvacet šest metrů, z jedné strany na druhou." },
      ...sizeEnd,
    ],
    marks: [
      { kind: "run", from: [3, 22.5], to: [3, 0.3], t: [2.4] },
      { kind: "run", from: [3, 22.5], to: [3, 44.7], t: [2.4] },
      { kind: "label", at: [3, 22.5], text: "37 m", tone: "us", t: [2.4] },
      { kind: "run", from: [15, 11], to: [0.3, 11], t: [4.8] },
      { kind: "run", from: [15, 11], to: [29.7, 11], t: [4.8] },
      { kind: "label", at: [15, 11], text: "26 m", tone: "us", t: [4.8] },
    ],
    why: "Podle pravidel FAČR pro mladší přípravku (4 + 1) má hřiště 35–37 × 24–26 m (doporučuje se větší rozměr), hrát se smí i na minihřišti s mantinely; hřiště dospělých bývá 105 × 68 m. Na malém hřišti má každé dítě mnohem víc doteků s míčem.",
  },
};

const lines = {
  id: "cary",
  title: "Čáry",
  icon: "🔲",
  dur: 14.4,
  beats: [
    { t: 0, text: "Dlouhé čáry po stranách jsou postranní.", say: "Dlouhé čáry po stranách jsou postranní. Ukazují, kde hřiště končí." },
    { t: 2.6, text: "Míč je celý za postranní čarou. Aut!", say: "Míč je celý za postranní čarou, a to je aut. Dokud je kousek míče na čáře, hraje se dál." },
    { t: 5.4, text: "Míč kopl ven náš hráč, tak vhazuje soupeř.", say: "Míče se naposledy dotkl náš hráč, a proto vhazuje soupeř. Hází ho rukama zpoza čáry." },
    { t: 8.6, text: "Krátké čáry u branek jsou brankové.", say: "Krátké čáry u branek jsou brankové. Když míč přejde čáru vedle branky, hra se zastaví." },
    { t: 11.8, text: "Za brankovou čarou: roh, nebo kop od branky.", say: "Ven ho kopl soupeř, a tak kopeme od branky my. Kdyby to byl náš hráč, kopal by soupeř roh." },
  ],
  players: [
    { id: "g", team: "us", gk: true, n: 1, path: [[0, 15, 2.5], [10.4, 15, 2.5], [11, 14, 2.2]] },
    { id: "a", team: "us", n: 2, path: [[0, 6, 14], [2, 6, 14], [4, 11.5, 10]] },
    { id: "t1", team: "them", path: [[0, 4, 22], [5.4, 4, 22], [6.6, -1, 21.2], [8, -1, 21.2], [9.2, 2.5, 19]] },
    { id: "t2", team: "them", path: [[0, 9, 19], [5.4, 9, 19], [7, 5, 25.5], [8.6, 5, 25.5], [10.4, 6.5, 17]] },
  ],
  // Přihrávka do autu → modrý vhazuje dozadu spoluhráči → ten vede míč a střílí vedle naší branky.
  ball: [[0, "a"], [1.6, "a"], [2.4, -1.3, 21], [6.6, -1.3, 21], [6.8, -1, 21.2], [7.1, -1, 21.2], [8, "t2"], [10.4, "t2"], [11.7, 10.8, -1.3]],
  marks: [
    { kind: "zone", rect: [-0.4, 0, 0.8, 45], tone: "us", t: [0.3] },
    { kind: "zone", rect: [29.6, 0, 0.8, 45], tone: "us", t: [0.3] },
    { kind: "label", at: [-0.2, 25.2], text: "Aut", tone: "us", t: [2.6] },
    { kind: "pass", from: [-1, 21.2], to: [3.8, 24.6], t: [7.1, 8.6] },
    { kind: "zone", rect: [0, -0.6, 30, 1.2], tone: "good", t: [8.6] },
    { kind: "zone", rect: [0, 44.4, 30, 1.2], tone: "good", t: [8.6] },
    { kind: "dribble", team: "them", from: [5, 24], to: [6.5, 16], t: [8.6, 10.6] },
    { kind: "shot", from: [6.5, 15.5], to: [10.8, -1.3], t: [10.4] },
    { kind: "label", at: [6.6, 2.6], text: "Kop od branky", t: [11.8] },
  ],
  why: "Aut je, když celý míč přejde postranní čáru. Když celý míč přejde brankovou čáru mimo branku, následuje kop od branky (naposledy se ho dotkl útočící tým), nebo kop z rohu (naposledy bránící tým).",
  // míč už je celý za čarou, štítek „Aut“ ještě není
  quiz: {
    at: 2.5,
    ask: "Míč je za postranní čarou. Co teď?",
    options: [
      { text: "Aut", ok: true },
      { text: "Roh", ok: false },
      { text: "Hraje se dál", ok: false },
    ],
  },
};

const half = {
  id: "pulka",
  title: "Půlka a střed",
  icon: "⭕",
  dur: 11.8,
  beats: [
    { t: 0, text: "Čára uprostřed dělí hřiště na půlky.", say: "Té čáře uprostřed se říká půlicí. Dělí hřiště na dvě stejně velké půlky." },
    { t: 2.6, text: "Dole je naše půlka, nahoře soupeře.", say: "Dole je naše půlka, protože tam je naše branka. Nahoře je půlka soupeře s jeho brankou." },
    { t: 5.4, text: "Tečka uprostřed je středová značka." },
    { t: 8, text: "Odsud se začíná výkopem. I po gólu!", say: "Odsud se začíná výkopem, na začátku zápasu i po každém gólu. Oba týmy to odsud mají k brance stejně daleko." },
  ],
  // Pětka dovede míč na středovou značku, jako před výkopem.
  players: [{ id: "d", team: "us", n: 5, path: [[0, 15, 16], [8.2, 15, 16], [9.8, 15, 21]] }],
  ball: [[0, "d"], [9.8, "d"]],
  marks: [
    { kind: "zone", rect: [-0.2, 22.1, 30.4, 0.8], tone: "us", t: [0.3] },
    { kind: "label", at: [6.5, 22.5], text: "Půlicí čára", t: [0.3] },
    { kind: "zone", rect: [0, 0, 30, 22.5], tone: "us", text: "Naše půlka", t: [2.6] },
    { kind: "zone", rect: [0, 22.5, 30, 22.5], tone: "good", text: "Půlka soupeře", t: [2.6] },
    { kind: "zone", circle: [15, 22.5, 1.3], tone: "us", t: [5.4] },
    { kind: "label", at: [23.5, 22.5], text: "Středová značka", t: [5.4] },
    { kind: "dribble", from: [15, 17.5], to: [15, 21.8], t: [8.2, 10.2] },
  ],
  why: "Půlicí čára dělí hřiště na dvě poloviny. Ze středové značky se výkopem zahajuje hra i pokračuje po každém gólu; středový kruh hřiště 5 + 1 nemá, soupeř musí být při výkopu aspoň 2 m od míče.",
};

const goals = {
  id: "branky",
  title: "Branky",
  icon: "🥅",
  dur: 13.4,
  beats: [
    { t: 0, text: "Každý tým má svou branku." },
    { t: 2.4, text: "Naši branku dole chráníme.", say: "Naše branka je dole. Chráníme ji, aby nám soupeř nedal gól." },
    { t: 5, text: "Do branky soupeře dáváme góly!", say: "Branka soupeře je nahoře. Tam s míčem útočíme a dáváme góly." },
    { t: 8, text: "Branka je 5 m široká a 2 m vysoká.", say: "Branka je pět metrů široká a dva metry vysoká. Je menší než u dospělých, aby ji ubránil i malý brankář." },
    { t: 10.8, text: "Pamatuj: naši chráníme, do jejich střílíme.", say: "Pamatuj si, která branka je naše. Míč ve vlastní brance je gól pro soupeře." },
  ],
  players: [
    { id: "g", team: "us", gk: true, n: 1, path: [[0, 15, 2.5]] },
    { id: "d", team: "us", n: 5, tag: "Ty", hl: true, path: [[0, 15, 29], [5.2, 15, 29], [6.6, 15, 35]] },
    { id: "G", team: "them", gk: true, path: [[0, 15, 42.8], [6.6, 15, 42.8], [7.1, 16.8, 43.3]] },
  ],
  ball: [[0, "d"], [6.6, "d"], [7.4, 13.1, 45.8]],
  marks: [
    { kind: "zone", rect: [12.2, -1.6, 5.6, 1.9], tone: "us", t: [2.4] },
    { kind: "label", at: [6.4, 1.6], text: "Naše branka", tone: "us", t: [2.4] },
    { kind: "zone", rect: [12.2, 44.7, 5.6, 1.9], tone: "good", t: [5] },
    { kind: "label", at: [6.5, 43.4], text: "Branka soupeře", t: [5] },
    { kind: "dribble", from: [15, 30.5], to: [15, 36], t: [5.2, 7.2] },
    { kind: "shot", from: [15, 36.5], to: [13.1, 45.8], t: [6.6] },
    { kind: "label", at: [23.6, 43.4], text: "5 m × 2 m", tone: "us", t: [8] },
  ],
  why: "Branky pro 5 + 1 jsou podle pravidel FAČR 5 × 2 m, se sítí a zajištěné proti převržení (mladší přípravka smí hrát i na branky 3 × 2 m). Nejmenší děti si často pletou, kterou branku brání – pomáhá ukazovat směr útoku.",
};

const box = {
  id: "pokutove-uzemi",
  title: "Pokutové území",
  icon: "🧤",
  dur: 12.2,
  beats: [
    { t: 0, text: "Před každou brankou je pokutové území.", say: "Před každou brankou je pokutové území. Je to žlutý pruh přes celou šířku hřiště." },
    { t: 2.8, text: "Tady smí brankář chytat míč rukama.", say: "Tady smí brankář chytat míč rukama. Chytil ho uvnitř území, a to je správně." },
    { t: 5.8, text: "Mimo území musí hrát nohama.", say: "Mimo území musí brankář hrát nohama, jako ostatní. Proto míč položí na zem a z území ho vyvede nohou." },
    { t: 9.2, text: "Rukama jen ve svém pokutovém území!", say: "Rukama smí brankář chytat jen ve svém pokutovém území. Jinak má soupeř volný kop blízko naší branky." },
  ],
  // Brankář chytí střelu v území, pak míč položí na zem a vyvede ho ven nohou; modrý mu uhne.
  players: [
    { id: "g", team: "us", gk: true, n: 1, path: [[0, 15, 2.5], [3.2, 15, 2.5], [3.8, 13.8, 2.8], [6.2, 13.8, 2.8], [8, 13.2, 9.4]] },
    { id: "a", team: "us", n: 2, path: [[0, 5, 11], [3, 7.5, 10]] },
    { id: "t4", team: "them", path: [[0, 9, 19], [3, 11.5, 13.5], [5.8, 11.5, 13.5], [7.4, 11, 17.5]] },
  ],
  ball: [[0, "t4"], [3, "t4"], [3.8, "g", 0], [6, "g", 0], [6.2, 13.8, 4.3], [6.5, "g"], [8, "g"]],
  marks: [
    { kind: "zone", rect: [0, 0, 30, 5.5], tone: "us", t: [0.3] },
    { kind: "zone", rect: [0, 39.5, 30, 5.5], tone: "us", t: [0.3] },
    { kind: "label", at: [6.2, 2.75], text: "Pokutové území", tone: "us", t: [0.3] },
    { kind: "label", at: [25.5, 2.75], text: "5,5 m", t: [0.3] },
    { kind: "dribble", team: "them", from: [9, 17.5], to: [11.5, 12.6], t: [0.4, 3.4] },
    { kind: "shot", from: [11.5, 12], to: [13.8, 3.6], t: [3, 5.8] },
    { kind: "check", at: [18.3, 3.2], t: [4, 6] },
    { kind: "dribble", from: [13.8, 4.6], to: [13.25, 10.4], t: [6.4] },
    { kind: "label", at: [20.5, 9.4], text: "Jen nohama", t: [6.8] },
  ],
  why: "Pokutové území je u 5 + 1 pruh 5,5 m od brankové čáry přes celou šířku hřiště. Jen v něm smí brankář hrát rukou; za jeho hranicí je jako hráč v poli (ruka mimo území = přímý volný kop).",
  quiz: {
    at: 1.2,
    ask: "Kde smí brankář chytat rukama?",
    options: [
      { text: "Jen ve svém žlutém pruhu", ok: true },
      { text: "Na celé naší půlce", ok: false },
      { text: "Všude na hřišti", ok: false },
    ],
  },
};

const spot = {
  id: "penalta-7-m",
  title: "Penalta ze 7 m",
  icon: "⚪",
  dur: 10.6,
  beats: [
    { t: 0, text: "Tečka před brankou je značka penalty.", say: "Tečka před brankou je značka penalty. Penalta se kope, když soupeř ve svém pokutovém území fauluje nebo hraje rukou." },
    { t: 2.8, text: "Je 7 metrů od branky.", say: "Značka je sedm metrů od branky. Dospělí kopou penaltu z jedenácti metrů." },
    { t: 5.4, text: "Odsud se kope pokutový kop.", say: "Odsud se kope pokutový kop. Míč položíš na tečku a střílíš přímo na branku." },
    { t: 8, text: "Gól! Penalta je velká šance.", say: "Gól! Penalta je velká šance, protože mezi tebou a brankou stojí jen brankář." },
  ],
  players: [
    { id: "d", team: "us", n: 5, tag: "Ty", hl: true, path: [[0, 15, 30], [0.8, 15, 30], [2.4, 15, 36.5]] },
    { id: "G", team: "them", gk: true, path: [[0, 15, 44.3], [6.6, 15, 44.3], [7.1, 16.8, 44.2]] },
  ],
  ball: [[0, "d"], [6.6, "d"], [7.3, 13.6, 45.8]],
  marks: [
    { kind: "zone", circle: [15, 38, 1.2], tone: "us", t: [0.3] },
    { kind: "run", from: [21, 41.5], to: [21, 38.2], t: [2.8] },
    { kind: "run", from: [21, 41.5], to: [21, 44.8], t: [2.8] },
    { kind: "line", from: [16.5, 38], to: [21, 38], t: [2.8] },
    { kind: "label", at: [21, 41.5], text: "7 m", tone: "us", t: [2.8] },
    { kind: "shot", from: [15, 38], to: [13.6, 45.8], t: [6.6] },
  ],
  why: "Pokutový kop se u 5 + 1 kope ze vzdálenosti 7 m od brankové čáry (u dospělých 11 m). Nařizuje se za přestupek trestaný přímým volným kopem, kterého se obránce dopustí ve vlastním pokutovém území.",
};

export const PITCH = {
  id: "hriste",
  title: "Hřiště",
  lead: "Kde hrajeme a kolik nás je.",
  scenes: [team, size, lines, half, goals, box, spot],
};
