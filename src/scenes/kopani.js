/* Kopání — technika kopu. Prvních pět situací jsou fotky se štítky (photoScene, fotky vygenerované Gemini),
   „Kopej oběma nohama“ je scéna na tabuli (formát viz src/components/Scene.jsx).
   Souřadnice štítků na fotkách: x −2.4…32.4 zleva, y −2.4…47.4 shora (viz Art v src/components/keeper/parts.jsx). */
import { photoScene } from "../components/keeper/parts.jsx";
import passGood from "../assets/kopani/placirka-ano.webp";
import passBad from "../assets/kopani/placirka-ne.webp";
import lacesGood from "../assets/kopani/tkanicky-ano.webp";
import lacesBad from "../assets/kopani/tkanicky-ne.webp";
import swingGood from "../assets/kopani/svih-ano.webp";
import swingBad from "../assets/kopani/svih-ne.webp";
import standGood from "../assets/kopani/stojna-ano.webp";
import standBad from "../assets/kopani/stojna-ne.webp";
import leanGood from "../assets/kopani/naklon-ano.webp";
import leanBad from "../assets/kopani/naklon-ne.webp";

const AI = " (Fotografie jsou ilustrační, vytvořené pomocí AI.)";

const pass = photoScene({
  id: "placirka",
  title: "Placírka",
  icon: "🦶",
  good: {
    text: "Placírka: vnitřní strana, špička ven.",
    say: "Kamarádovi kousek od tebe přihraj placírkou. Kopni vnitřní stranou nohy, špičku vytoč ven a kotník drž pevně. Míč poletí přesně.",
    src: passGood,
    alt: "Pohled shora: stojná noha stojí u míče, kopající noha je vytočená špičkou ven a míče se dotýká vnitřní stranou",
    labels: [
      [6.4, 9.0, "Stojná noha u míče", [6.6, 18.2]],
      [26.8, 13.5, "Špička ven", [28.6, 24.6]],
      [24.8, 38.0, "Vnitřní strana", [19.4, 28.6]],
    ],
  },
  bad: {
    text: "Špičkou? Míč uteče, kam chce.",
    say: "Když přihráváš špičkou, trefíš míč jen malým kouskem boty. Míč pak uteče, kam chce, a kamarád ho nedostane.",
    src: passBad,
    alt: "Pohled shora: noha míří rovně na míč a dotýká se ho jen špičkou boty",
    labels: [[26.3, 34.0, "Kope špičkou", [19.6, 29.0]]],
  },
  why:
    "Placírka (přihrávka vnitřní stranou nohy) je nejpřesnější přihrávka na krátkou vzdálenost: vnitřní strana chodidla je velká rovná plocha. Kopající noha je vytočená špičkou ven, kotník zpevněný, noha trefí míč doprostřed a pokračuje za ním směrem k cíli. Stojná noha stojí vedle míče. Kop špičkou trefí míč malou plochou, a proto je nepřesný." +
    AI,
  quiz: {
    ask: "Tahle přihrávka kamarádovi nedojde. Co dělá špatně?",
    options: [
      { text: "Kope špičkou", ok: true },
      { text: "Kope patou", ok: false },
      { text: "Stojí daleko od míče", ok: false },
    ],
  },
});

const laces = photoScene({
  id: "tkanicky",
  title: "Kopni tkaničkami",
  icon: "👟",
  good: {
    text: "Střílej nártem: špička dolů, kopni tkaničkami.",
    say: "Na bránu střílej nártem. Špičku natáhni dolů, kotník zpevni a kopni do míče tkaničkami. Střela má sílu a nebolí to.",
    src: lacesGood,
    alt: "Detail: kopající noha má špičku nataženou dolů a jde do míče tkaničkami, stojná noha stojí vedle míče",
    labels: [
      [27.3, 9.0, "Tkaničkami", [22.6, 18.6]],
      [26.9, 42.0, "Špička dolů", [27.6, 26.4]],
    ],
  },
  bad: {
    text: "Špičkou? Bolí to a míč letí, kam chce.",
    say: "Když střílíš špičkou, bolí to do prstů a míč letí, kam chce. Do míče se trefíš jen malým kouskem boty.",
    src: lacesBad,
    alt: "Detail z boku: noha naráží do míče špičkou boty",
    labels: [[24.6, 12.0, "Kope špičkou", [25.2, 21.4]]],
  },
  why:
    "Střela přímým nártem: kopající noha je natažená, špička míří dolů a kotník je zpevněný, míč se trefí tkaničkami (přímým nártem) uprostřed. Koleno kopající nohy je nad míčem, stojná noha vedle míče a ruce drží rovnováhu. Kop špičkou je nepřesný a bolí." +
    AI,
  quiz: {
    on: "good",
    ask: "Čím tady hráč kope do míče?",
    options: [
      { text: "Tkaničkami", ok: true },
      { text: "Špičkou", ok: false },
      { text: "Patou", ok: false },
    ],
  },
});

const swing = photoScene({
  id: "svihni-od-kolena",
  title: "Švihni od kolena",
  icon: "🦵",
  good: {
    text: "Pokrč koleno a švihni nohou jako bič.",
    say: "Před kopem pokrč koleno, pata jde dozadu nahoru. Pak švihni spodní částí nohy jako bičem. Míč poletí rychle a přesně.",
    src: swingGood,
    alt: "Detail z boku: koleno kopající nohy je pokrčené a pata jde vysoko dozadu",
    labels: [
      [26.2, 20.0, "Pokrč koleno", [18.0, 17.4]],
      [9.5, 4.0, "Pata dozadu", [1.6, 12.8]],
    ],
  },
  bad: {
    text: "Rovná noha jako klacek? Kop je slabý.",
    say: "Když kopeš celou nataženou nohou jako klackem, kop je slabý a míč letí, kam nechceš. Sílu dává švih od kolena.",
    src: swingBad,
    alt: "Detail z boku: kopající noha je natažená dozadu rovně jako klacek",
    labels: [
      [6.0, 37.0, "Rovná noha", [7.6, 21.2]],
      [5.0, 9.0, "Jako klacek", [10.5, 18.3]],
    ],
  },
  why:
    "Rychlost kopu dává hlavně švih bérce. V nápřahu se koleno pokrčí (pata jde dozadu k hýždím), stehno vede pohyb dopředu a těsně před kopem se spodní část nohy prudce natáhne z kolena — jako bič. Děti často kopou nataženou nohou z kyčle jako kyvadlem, a kop je pak slabý a nepřesný. Platí to pro střelu i přihrávku, u placírky je nápřah jen kratší. Heslo: noha jako bič, ne jako klacek." +
    AI,
  quiz: {
    ask: "Proč bude tenhle kop slabý?",
    options: [
      { text: "Noha je rovná jako klacek", ok: true },
      { text: "Kouká na míč", ok: false },
      { text: "Stojí vedle míče", ok: false },
    ],
  },
});

const stand = photoScene({
  id: "stojna-noha",
  title: "Stojná noha míří na cíl",
  icon: "🎯",
  good: {
    text: "Stojná noha vedle míče, špička míří na cíl.",
    say: "Stojnou nohu postav vedle míče a špičkou ukaž, kam má míč letět. Kam míří stojná noha, tam poletí i míč.",
    src: standGood,
    alt: "Pohled shora: stojná noha stojí vedle míče a špičkou míří přímo na kužel",
    labels: [
      [23.0, 4.5, "Cíl", [17.8, 4.5]],
      [6.3, 44.2, "Stojná noha u míče", [5.8, 31.0]],
    ],
  },
  bad: {
    text: "Stojná noha míří jinam? Míč letí vedle.",
    say: "Když stojná noha míří jinam nebo stojí daleko od míče, tělo se otočí a míč letí vedle. Kamarád ani brána ho nedostanou.",
    src: standBad,
    alt: "Pohled shora: stojná noha je vytočená do strany a špičkou míří mimo kužel",
    labels: [
      [23.0, 4.5, "Cíl", [17.8, 4.5]],
      [6.3, 44.2, "Špička míří jinam", [4.6, 25.6]],
    ],
  },
  why:
    "Stojná (opěrná) noha se staví vedle míče, zhruba na šířku dlaně od něj, a její špička míří tam, kam má míč letět. Boky a kopající noha se pak natočí stejně. Když stojná noha stojí daleko od míče nebo míří jinam, hráč se natahuje, boky se otočí a míč letí mimo cíl." +
    AI,
  quiz: {
    ask: "Kam asi poletí míč?",
    options: [
      { text: "Vedle, kam míří stojná noha", ok: true },
      { text: "Přesně na kužel", ok: false },
      { text: "Nikam, zůstane ležet", ok: false },
    ],
  },
});

const lean = photoScene({
  id: "naklon-se",
  title: "Nakloň se nad míč",
  icon: "🙇",
  good: {
    text: "Nakloň se nad míč. Míč poletí nízko.",
    say: "Při kopu se nakloň nad míč, ramena a koleno měj nad ním. Míč pak letí nízko a rovně, přesně na bránu.",
    src: leanGood,
    alt: "Holka je po střele nakloněná dopředu, míč letí nízko nad trávou",
    labels: [
      [22.6, 9.0, "Nakloň se", [20.4, 15.6]],
      [5.6, 40.6, "Míč letí nízko", [1.4, 33.4]],
    ],
  },
  bad: {
    text: "Záklon? Míč letí do nebe.",
    say: "Když se při kopu zakloníš, kopneš míč zespodu. Míč pak letí vysoko do nebe nebo přes bránu.",
    src: leanBad,
    alt: "Holka se při kopu zaklání a míč letí vysoko",
    labels: [
      [26.4, 10.4, "Záklon", [24.6, 18.6]],
      [10.6, 9.6, "Míč letí do nebe", [4.4, 3.8]],
    ],
  },
  why:
    "Jak vysoko míč letí, určuje hlavně poloha těla a místo, kde noha míč trefí. Trup nakloněný nad míč a koleno nad míčem udrží střelu nízko. Záklon (často když stojná noha zůstane daleko za míčem) pošle míč vysoko nad bránu. Branky v přípravce jsou jen dva metry vysoké, takže nízká střela je ta správná." +
    AI,
  quiz: {
    ask: "Kam poletí míč, když se takhle zakloníš?",
    options: [
      { text: "Vysoko do nebe", ok: true },
      { text: "Nízko na bránu", ok: false },
      { text: "Zůstane ležet", ok: false },
    ],
  },
});

/* Kopej oběma nohama: míč se ti zastaví u levé nohy a soupeř běží k tobě → přihraj hned levou.
   Takhle ne: přehazuješ si ho na pravou, soupeř doběhne a vezme ti ho. */
const bothStart = [
  { t: 0, text: "Míč máš u levé nohy. Kamarád je volný.", say: "Míč se ti zastavil u levé nohy. Kamarád vlevo vepředu je volný, ale soupeř už běží k tobě." },
];
const bothTeam = [
  { id: "g", team: "us", gk: true, n: 1, path: [[0, 15, 2.5]] },
  { id: "ty", team: "us", n: 2, tag: "Ty", hl: true, path: [[0, 8, 17]] },
  { id: "b", team: "us", n: 3, dim: true, path: [[0, 22, 13]] },
  { id: "c", team: "us", n: 4, dim: true, path: [[0, 16.5, 25.5]] },
  { id: "d", team: "us", n: 5, path: [[0, 5, 30]] },
  { id: "e", team: "us", n: 6, dim: true, path: [[0, 23, 31]] },
  { id: "G", team: "them", gk: true, dim: true, path: [[0, 15, 42.5]] },
  { id: "t2", team: "them", dim: true, path: [[0, 19, 34.5]] },
  { id: "t3", team: "them", dim: true, path: [[0, 24, 21.5]] },
  { id: "t4", team: "them", dim: true, path: [[0, 12, 34]] },
  { id: "t5", team: "them", dim: true, path: [[0, 9.5, 39]] },
];
const BALL_LEFT = [6.6, 17.6]; // u levé nohy (útočíme nahoru, levá je vlevo)
const both = {
  id: "obe-nohy",
  title: "Kopej oběma nohama",
  icon: "👣",
  dur: 10.4,
  beats: [
    ...bothStart,
    { t: 2.6, text: "Nepřehazuj ho. Přihraj hned levou!", say: "Nepřehazuj si míč na pravou nohu, na to není čas. Přihraj hned levou nohou." },
    { t: 5.2, text: "Kamarád má míč. Soupeř to nestihl.", say: "Kamarád má míč a soupeř to nestihl. Kopl jsi hned, tou nohou, u které míč byl." },
    { t: 7.8, text: "Trénuj obě nohy, ať můžeš kopnout hned.", say: "Trénuj kopání oběma nohama. Pak můžeš kopnout hned, ať máš míč u kterékoli nohy." },
  ],
  players: [...bothTeam, { id: "t1", team: "them", path: [[0, 15, 21.5], [4.6, 11.4, 19.2]] }],
  ball: [[0, ...BALL_LEFT], [3.8, ...BALL_LEFT], [5.0, 5.2, 28.5], [10.4, 5.2, 28.5]],
  marks: [
    { kind: "label", at: [3.4, 12], text: "Levá noha", t: [0] },
    { kind: "label", at: [5, 34], text: "Volný", tone: "good", t: [0] },
    { kind: "run", team: "them", from: [15, 21.5], to: [11.4, 19.2], t: [0, 4.6] },
    { kind: "pass", from: "ball", to: [5.2, 28.5], t: [3.8] },
  ],
  why: "Kdo umí kopnout jen jednou nohou, musí si míč pokaždé přehodit, a to stojí čas, kterého soupeř využije. Slabší nohu trénujte od začátku: přihrávky o zeď nebo ve dvojici, hry, kde se smí kopat jen „tou druhou“. V přípravce se děti naučí obě nohy nejsnáz.",
  quiz: {
    at: 1.4,
    ask: "Míč máš u levé nohy a soupeř běží k tobě. Co uděláš?",
    options: [
      { text: "Hned přihraju levou nohou", ok: true },
      { text: "Přehodím si ho na pravou", ok: false },
      { text: "Počkám, až soupeř odejde", ok: false },
    ],
  },
  bad: {
    beats: [
      ...bothStart,
      { t: 2.6, text: "Ty si ho ale přehazuješ na pravou…", say: "Ty si ale míč přehazuješ na pravou nohu, protože levou kopat neumíš. To trvá dlouho." },
      { t: 5.2, text: "Soupeř doběhl a míč ti vzal.", say: "Než sis míč přehodil, soupeř doběhl a vzal ti ho. Teď útočí on na naši bránu." },
      { t: 7.8, text: "Příště kopni hned nohou, u které je míč.", say: "Příště kopni hned tou nohou, u které míč máš. A slabší nohu trénuj, ať se jí nebojíš." },
    ],
    players: [
      ...bothTeam,
      { id: "t1", team: "them", path: [[0, 15, 21.5], [4.6, 10.6, 18.6], [5.2, 10.4, 18.4], [8.4, 12.5, 11.5]] },
    ],
    ball: [[0, ...BALL_LEFT], [2.6, ...BALL_LEFT], [3.5, 8, 18.6], [4.4, 9.4, 17.6], [5.0, "t1"], [10.4, "t1"]],
    marks: [
      { kind: "label", at: [3.4, 12], text: "Levá noha", t: [0] },
      { kind: "label", at: [5, 34], text: "Volný", tone: "good", t: [0] },
      { kind: "run", team: "them", from: [15, 21.5], to: [10.6, 18.6], t: [0, 4.6] },
      { kind: "dribble", team: "them", from: [10.4, 16.9], to: [12.5, 10], t: [5.2] },
      { kind: "x", at: [10.4, 19.6], t: [7.0] },
    ],
  },
};

export const KICKING = {
  id: "kopani",
  title: "Kopání",
  lead: "Jak kopnout, aby míč letěl, kam chceš.",
  scenes: [pass, laces, swing, stand, lean, both],
};
