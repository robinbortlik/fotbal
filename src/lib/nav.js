/* Hlavní menu — jediný zdroj pro horní lištu, spodní lištu na mobilu i dlaždice na úvodu.
   Při přidání stránky uprav i children v src/router.jsx. */
export const NAV = [
  { id: "hriste", label: "Hřiště", path: "/hriste", icon: "pitch", hint: "Kde a kolik nás hraje" },
  { id: "pravidla", label: "Pravidla", path: "/pravidla", icon: "whistle", hint: "Co se smí a co ne" },
  { id: "utok", label: "Útok", path: "/utok", icon: "attack", hint: "Máme míč. Jdeme na bránu!" },
  { id: "obrana", label: "Obrana", path: "/obrana", icon: "shield", hint: "Nemáme míč. Chráníme bránu!" },
  { id: "brankar", label: "Brankář", path: "/brankar", icon: "glove", hint: "Chytá, brání a rozehrává" },
  { id: "kviz", label: "Kvíz", path: "/kviz", icon: "quiz", hint: "Co uděláš ty?" },
];

export default NAV;
