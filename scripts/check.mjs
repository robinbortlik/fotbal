/* Kontrola dat a logiky bez prohlížeče:  npm run check
   1) ballAt — míč u nohy, příjem přihrávky ze správné strany, vedení míče; staré odkazy za # → nové adresy.
   2) lint všech témat (src/lib/lint.js) + videa ukazují na existující situace.
   Skončí chybou, když něco nesedí. */
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { createServer } from "vite";

const vite = await createServer({ server: { middlewareMode: true }, appType: "custom", logLevel: "error" });
const load = (p) => vite.ssrLoadModule(p);
try {
  const { ballAt, at } = await load("/src/lib/pitch.js");
  const P = { a: [[0, 10, 10]], b: [[0, 10, 20], [3, 10, 20], [5, 10, 26]] };
  const ball = (t) => {
    const v = ballAt([[0, "a"], [1, "a"], [2, "b"], [5, "b"]], t, (id, tt) => at(P[id], tt), () => 1);
    return [+v.x.toFixed(2), +v.y.toFixed(2)];
  };
  assert.deepEqual(ball(0.5), [10, 11.5]); // před nohou přihrávajícího
  assert.deepEqual(ball(2), [10, 18.5]); // příjem na straně, odkud míč přiletěl (ne skrz hráče)
  assert.deepEqual(ball(2.5), [10, 21.5]); // za 0,35 s už před přijímajícím
  assert.deepEqual(ball(5), [10, 27.5]); // vede míč
  const held = ballAt([[0, "b", 0], [3, "b", 0]], 1, (id, tt) => at(P[id], tt), () => 1);
  assert.deepEqual([held.x, held.y], [10, 20]); // [t, "id", 0] = míč v rukou (na středu hráče)

  const { fromHash } = await load("/src/lib/nav.js"); // staré odkazy za # → nové adresy
  assert.equal(fromHash("#/utok?s=roztahni-se"), "/utok/roztahni-se");
  assert.equal(fromHash("#/kviz"), "/kviz");
  assert.equal(fromHash("#/"), "/");
  assert.equal(fromHash("#rules"), "/pravidla");
  assert.equal(fromHash("#situace"), null); // kotva na stránce
  assert.equal(fromHash(""), null);

  const { lintTopic } = await load("/src/lib/lint.js");
  const { VIDEOS } = await load("/src/scenes/videos.js");
  const warn = console.warn;
  console.warn = () => {};
  const problems = [];
  for (const f of await fs.readdir("src/scenes")) {
    for (const topic of Object.values(await load(`/src/scenes/${f}`))) {
      if (!topic?.scenes) continue;
      problems.push(...lintTopic(topic).map((m) => `${topic.id}/${m}`));
      const ids = new Set(topic.scenes.map((s) => s.id));
      (VIDEOS[topic.id] || []).forEach((v) => v.scene && !ids.has(v.scene) && problems.push(`${topic.id}: video ${v.id} → neznámá situace "${v.scene}"`));
    }
  }
  console.warn = warn;
  if (problems.length) {
    console.error(problems.join("\n"));
    process.exitCode = 1;
  } else console.log("OK: míč i všechny scény bez varování");
} finally {
  await vite.close();
}
