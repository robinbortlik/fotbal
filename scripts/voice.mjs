/* Nahraje všechny titulky webu hlasem z ElevenLabs → public/voice/<hash>.mp3 + seznam src/voice.json.
   Spusť po změně textů:  ELEVENLABS_API_KEY=… npm run voice
   Hotové věty se znovu negenerují (název souboru = hash textu), nepoužívané soubory se smažou.
   Klíč nikdy nepatří do repozitáře ani do kódu webu. */
import fs from "node:fs/promises";
import { createServer } from "vite";

const VOICE = "KIDKfqJyZ6ASuyzsKfh5"; // „Jan – Kind Educator“, český hlas z knihovny ElevenLabs
const MODEL = "eleven_v4";
const OUT = "public/voice";
const KEY = process.env.ELEVENLABS_API_KEY;
if (!KEY) {
  console.error("Chybí proměnná ELEVENLABS_API_KEY.");
  process.exit(1);
}

// Texty sbíráme přímo z dat webu (Vite umí načíst i moduly s JSX).
const vite = await createServer({ server: { middlewareMode: true }, appType: "custom", logLevel: "error" });
const load = (p) => vite.ssrLoadModule(p);
const { hash, PHRASES } = await load("/src/lib/voice.js");
const texts = new Set(Object.values(PHRASES));
for (const f of await fs.readdir("src/scenes")) {
  for (const topic of Object.values(await load(`/src/scenes/${f}`))) {
    for (const s of topic?.scenes || []) {
      [s, s.bad, s.younger, s.younger?.bad].forEach((v) => v?.beats?.forEach((b) => texts.add(b.say ?? b.text)));
      [s.quiz, s.younger?.quiz].forEach((q) => q && [q.ask, ...q.options.map((o) => o.text)].forEach((t) => texts.add(t)));
      (s.Component?.TEXTS || []).forEach((t) => texts.add(t));
    }
  }
}
await vite.close();

await fs.mkdir(OUT, { recursive: true });
const list = [...texts].map((text) => ({ text, name: `${hash(text)}.mp3` }));
const existing = new Set(await fs.readdir(OUT));
const todo = list.filter((it) => !existing.has(it.name));
console.log(`${list.length} vět, nových ${todo.length} (${todo.reduce((n, t) => n + t.text.length, 0)} znaků)`);

async function tts(text, attempt = 1) {
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE}?output_format=mp3_44100_64`, {
    method: "POST",
    headers: { "xi-api-key": KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ text, model_id: MODEL, language_code: "cs" }),
  });
  if ((res.status === 429 || res.status >= 500) && attempt < 4) {
    await new Promise((r) => setTimeout(r, 2000 * attempt));
    return tts(text, attempt + 1);
  }
  if (!res.ok) throw new Error(`${res.status} ${await res.text()} — „${text}“`);
  return Buffer.from(await res.arrayBuffer());
}

let i = 0;
const worker = async () => {
  while (i < todo.length) {
    const it = todo[i++];
    await fs.writeFile(`${OUT}/${it.name}`, await tts(it.text));
    console.log("✓", it.text);
  }
};
await Promise.all([worker(), worker(), worker()]);

const keep = new Set(list.map((it) => it.name));
for (const f of await fs.readdir(OUT)) if (!keep.has(f)) await fs.rm(`${OUT}/${f}`);
await fs.writeFile("src/voice.json", JSON.stringify(list.map((it) => it.name.slice(0, 8)).sort()) + "\n");
console.log("Hotovo: src/voice.json");
