/* Videa z YouTube k tématům (ověřeno 10/2026: existují a jdou vložit).
   scene = id situace, u které se video ukáže; všechna videa tématu jsou i v poličce „Videa“ dole.
   lang: "CZ" | "EN" | "" (beze slov). vertical = Shorts (na výšku). start/end v sekundách. */
export const VIDEOS = {
  hriste: [
    { id: "MEk1FFFRQ7o", title: "Hřiště a základní pravidla (kreslené)", channel: "Smile and Learn", lang: "EN", start: 20 },
    { id: "hW1rSpHeWF4", title: "Části hřiště", channel: "Smile and Learn", lang: "EN", vertical: true },
  ],
  pravidla: [
    { id: "XzdTvbwR4s4", scene: "gol", title: "Kdy je to gól", channel: "Kuba Benny Football Tutorials", lang: "", vertical: true },
    { id: "ykjYpxplhKQ", scene: "aut", title: "Kdy je míč v autu", channel: "Kuba Benny Football Tutorials", lang: "", vertical: true },
    { id: "jHvKVnb7Lrw", scene: "roh", title: "Co je rohový kop", channel: "Smile and Learn", lang: "EN", vertical: true },
    { id: "sMBzwV6admc", scene: "kop-od-branky", title: "Výkop, aut, roh a kop od branky (kreslené)", channel: "Smile and Learn", lang: "EN", start: 23 },
    { id: "q0fqcBxYP34", scene: "penalta", title: "Volný kop a penalta", channel: "Smile and Learn", lang: "EN", vertical: true },
  ],
  utok: [
    { id: "tO37HwloKvo", scene: "roztahni-se", title: "Roztáhněte hru, na druhé straně bývá volno", channel: "FAČR", lang: "CZ", start: 952, end: 978 },
    { id: "zEA0wfoR8po", scene: "ved-mic", title: "Vedení míče se změnou směru", channel: "Můj první gól", lang: "CZ" },
    { id: "muuD_ThFuDA", scene: "klicka", title: "Klička přešlapovačka", channel: "Můj první gól", lang: "CZ", start: 20 },
    { id: "stIfylUDjDM", scene: "prihraj-volnemu", title: "Přihrávka placírkou", channel: "Můj první gól", lang: "CZ" },
    { id: "WywDLhxyDlo", scene: "vystrel", title: "Jak správně kopnout do míče", channel: "Zdeněk Folprecht", lang: "CZ" },
  ],
  obrana: [
    { id: "IjxTOLgSb3M", scene: "trpelive", title: "Bránění bez míče", channel: "Můj první gól", lang: "CZ" },
    { id: "LasPGkJfyoE", scene: "bokem", title: "Bránění s míčem", channel: "Můj první gól", lang: "CZ" },
    { id: "yREWtO19RQc", scene: "nejblizsi", title: "Napadání a pomoc spoluhráči", channel: "MOJO", lang: "EN", start: 5, end: 115 },
    { id: "OPkBKvrE5X4", scene: "mezi-souper-a-branu", title: "1 na 1: mezi míčem a brankou", channel: "Soccer Dots", lang: "" },
  ],
  brankar: [
    { id: "ilWJKcRvl4I", scene: "postoj", title: "Postoj a chytání do W", channel: "Lukáš Kocourek", lang: "CZ" },
    { id: "hJXPuADMOyE", scene: "ruce", title: "Chytání do košíčku", channel: "Lukáš Kocourek", lang: "CZ" },
    { id: "-y3dl7PqLxI", scene: "vybehni", title: "Neuer v souboji 1 na 1 (rozbor s popisky)", channel: "Lukáš Kocourek", lang: "CZ" },
    { id: "fqGqBH3sIR8", scene: "rozehravka", title: "Jak rozehrát rukou", channel: "SIKANA", lang: "EN" },
    { id: "Yq3Luk-gkKw", title: "Trénink malého brankáře", channel: "Just4keepers CZ", lang: "CZ" },
  ],
  rodice: [
    { id: "ytm6BdrsRrE", title: "Vítězství a prohry", channel: "FAČR", lang: "CZ" },
    { id: "YnspBmBQiSE", title: "Fair play", channel: "FAČR", lang: "CZ" },
    { id: "uFnVzNQ4-RQ", title: "Jak vypadá trénink přípravky", channel: "Zdeněk Folprecht", lang: "CZ" },
    { id: "tO37HwloKvo", title: "Nekřičte pokyny, nechte děti rozhodovat", channel: "FAČR", lang: "CZ", start: 381, end: 530 },
  ],
};
