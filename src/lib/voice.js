import { useEffect, useState } from "react";
import recorded from "../voice.json";

/* Čtení nahlas — pro děti, které ještě nečtou.
   1) Nahrané věty z ElevenLabs: public/voice/<hash>.mp3 (vyrobí `npm run voice`, seznam v src/voice.json).
   2) Věta, která nahraná není → český hlas prohlížeče (Web Speech API); bez něj ticho.
   Výchozí je zapnuto; vypnutí si pamatuje prohlížeč.
   Nainstalovaná aplikace (spuštěná z plochy) si nahrávky jednou stáhne do úložiště (~13 MB), ať Kopík mluví
   i bez internetu. Na webu se nic navíc nestahuje. */
const KEY = "fotbal:voice";
const synth = typeof window !== "undefined" ? window.speechSynthesis : null;
const audio = typeof Audio !== "undefined" ? new Audio() : null; // jeden přehrávač: iOS ho po prvním kliknutí odemkne
const have = new Set(recorded);
const subs = new Set();
let on = true;
let token = 0;
let cut = null; // onEnd právě čteného seznamu: zavolá se i při přerušení, jinak by scéna čekala navždy
try {
  on = localStorage.getItem(KEY) !== "0";
} catch {
  /* soukromé okno / zakázané úložiště → výchozí zapnuto */
}

// Prohlížeč pustí zvuk až po prvním kliknutí na stránku; iOS navíc jen přehrávači, který už jednou hrál
// přímo z dotyku. První dotyk/kliknutí kdekoli proto přehrávač „odemkne“ tichým zvukem.
const SILENCE = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=";
if (audio) {
  const unlock = () => {
    ["touchend", "click"].forEach((e) => document.removeEventListener(e, unlock, true));
    if (!audio.paused) return;
    audio.src = SILENCE;
    audio.play().catch(() => {});
  };
  ["touchend", "click"].forEach((e) => document.addEventListener(e, unlock, true));
}

/* Pevné věty mimo scény (scripts/voice.mjs je nahraje taky). */
export const PHRASES = {
  on: "Budu ti to číst nahlas.",
  attack: "Máme míč! Roztáhneme se do šířky i dopředu.",
  defend: "Nemáme míč! Rychle zpátky mezi míč a naši bránu.",
  right: "Správně!",
  wrong: "Tohle ne. Koukej, jak se to dělá.",
  allRight: "Všechno správně! Jsi jako trenér.",
  most: "Skvělé! Ještě kousek a budeš to umět celé.",
  some: "Dobrý začátek! Koukni na animace a zkus to znovu.",
  bad: "Teď si ukážeme, jak to nedělat.",
};

/* FNV-1a 32 bit — název MP3 souboru věty (stejně počítá scripts/voice.mjs). */
export function hash(text) {
  let h = 0x811c9dc5;
  for (const ch of text) h = Math.imul(h ^ ch.codePointAt(0), 0x01000193) >>> 0;
  return h.toString(16).padStart(8, "0");
}

const czech = () => synth?.getVoices().find((v) => v.lang?.toLowerCase().startsWith("cs"));
const canSpeak = () => have.size > 0 || !!czech();

const file = (h) => `/voice/${h}.mp3`;
const CACHE = "voice";
const installed = typeof window !== "undefined" && (matchMedia("(display-mode: standalone)").matches || navigator.standalone === true);
if (installed && window.caches && !navigator.connection?.saveData)
  addEventListener("load", async () => {
    const cache = await caches.open(CACHE);
    const want = new Set([...have].map((h) => new URL(file(h), location.origin).href));
    for (const r of await cache.keys()) if (!want.has(r.url)) await cache.delete(r); // přenahrané věty
    for (const u of want)
      if (!(await cache.match(u)))
        try {
          await cache.add(u);
        } catch {
          return; // bez internetu → zbytek při dalším spuštění
        }
  });

// Nahrávka z úložiště (jako blob, ten jde přehrát všude i bez internetu), jinak ze sítě.
let blob = null;
async function source(h) {
  const hit = await window.caches?.match(file(h)).catch(() => null);
  if (blob) URL.revokeObjectURL(blob);
  blob = hit ? URL.createObjectURL(await hit.blob()) : null;
  return blob || file(h);
}

function stop() {
  token++;
  audio?.pause();
  synth?.cancel();
  const f = cut;
  cut = null;
  f?.();
}

function playOne(text, then) {
  let done = false;
  const fin = () => !done && (done = true) && then();
  const h = hash(text);
  if (audio && have.has(h)) {
    const my = token;
    source(h).then((src) => {
      if (my !== token) return; // mezitím stop() nebo jiná věta
      audio.src = src;
      audio.onended = fin;
      audio.onerror = fin;
      audio.play().catch(fin); // prohlížeč přehrání nepovolil → pokračuj potichu
    });
    return;
  }
  const voice = czech();
  if (!voice) return fin();
  const u = new SpeechSynthesisUtterance(text);
  u.voice = voice;
  u.lang = voice.lang;
  u.rate = 0.92;
  u.onend = u.onerror = fin;
  synth.speak(u);
}

/* Přečte text (nebo pole textů za sebou). Vrací true, když opravdu začal číst.
   force = číst i při vypnutém přepínači (tlačítko 🔊), onEnd = po dočtení nebo přerušení,
   onItem(i) = začíná i-tá věta (Kvíz podle toho zvýrazní odpověď). */
export function say(texts, { force = false, onEnd, onItem } = {}) {
  const list = [].concat(texts).filter(Boolean);
  if (!list.length || !(on || force) || !canSpeak()) return false;
  stop();
  const my = token;
  cut = onEnd;
  const next = (i) => {
    if (my !== token) return; // mezitím začala jiná věta
    onItem?.(i);
    if (i >= list.length) {
      cut = null;
      return onEnd?.();
    }
    playOne(list[i], () => next(i + 1));
  };
  next(0);
  return true;
}

export function useVoice() {
  const [state, setState] = useState(on);
  const [ready, setReady] = useState(canSpeak);
  useEffect(() => {
    const check = () => setReady(canSpeak());
    subs.add(setState);
    synth?.addEventListener?.("voiceschanged", check);
    check();
    return () => {
      subs.delete(setState);
      synth?.removeEventListener?.("voiceschanged", check);
    };
  }, []);
  const toggle = () => {
    on = !on;
    try {
      localStorage.setItem(KEY, on ? "1" : "0");
    } catch {
      /* jen pro tuto návštěvu */
    }
    subs.forEach((f) => f(on));
    // Kliknutí odemkne zvuk i na iOS — proto hned krátká odpověď.
    if (on) say(PHRASES.on);
    else stop();
  };
  return { on: state, ready, toggle };
}
