import { useSyncExternalStore } from "react";

/* Kategorie přípravky — výběr v horní liště, pamatuje si ho prohlížeč. Výchozí je starší přípravka (5 + 1),
   na ní je postavený celý web. Scéna může mít younger: { …stejné klíče jako scéna… } = co je u mladší
   přípravky (4 + 1) jinak; přepíše se jen to, co uvede (younger.bad: null = bez „Takhle ne“, quiz: null = bez otázky). */
export const AGES = [
  { id: "older", label: "U10–U11", name: "starší přípravka, 5 + 1" },
  { id: "younger", label: "U8–U9", name: "mladší přípravka, 4 + 1" },
];
const KEY = "fotbal:age";
const subs = new Set();
let age = "older";
try {
  if (localStorage.getItem(KEY) === "younger") age = "younger";
} catch {
  /* soukromé okno / zakázané úložiště → výchozí */
}

export function setAge(a) {
  age = a;
  try {
    localStorage.setItem(KEY, a);
  } catch {
    /* jen pro tuto návštěvu */
  }
  subs.forEach((f) => f());
}

export const useAge = () =>
  useSyncExternalStore(
    (f) => (subs.add(f), () => subs.delete(f)),
    () => age,
    () => "older",
  );

export const forAge = (scene, a) => (a === "younger" && scene.younger ? { ...scene, ...scene.younger } : scene);
