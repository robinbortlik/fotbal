import { W, L, PAD, at, ballAt } from "./pitch.js";

/* Kontrola dat scén — jen ve vývoji (TopicPage ji volá v DEV, výsledky jdou do console.warn).
   Hlídá: časy jdou popořadě, hráči na tabuli, odkazy na existující hráče,
   titulky krátké a ne moc nahusto, hlas (say) bez číslic a ne moc dlouhý, hráči se nepřekrývají (pod 2,2 m),
   štítky (label, text zóny) nezakrývají hráče ani míč. */
const MIN_GAP = 2.2;

export function lintTopic(topic) {
  const out = [];
  const ids = new Set();
  for (const sc of topic.scenes) {
    if (ids.has(sc.id)) out.push(`${sc.id}: duplicitní id`);
    ids.add(sc.id);
    if (sc.Component) continue;
    check(sc, sc.id, out);
    if (sc.bad) check({ ...sc, ...sc.bad }, sc.id + " (Takhle ne)", out);
  }
  out.forEach((m) => console.warn(`[scéna] ${topic.id}/${m}`));
  return out;
}

function check(s, name, out) {
  const say = (m) => out.push(`${name}: ${m}`);
  const P = s.players || [];
  const byId = Object.fromEntries(P.map((p) => [p.id, p]));
  const inside = (x, y) => x >= -PAD && x <= W + PAD && y >= -PAD && y <= L + PAD;
  const ascending = (keys, what) => keys.forEach((k, i) => i && k[0] < keys[i - 1][0] && say(`${what}: čas jde pozpátku (${k[0]})`));
  const ref = (v, what) => typeof v === "string" && v !== "ball" && !byId[v] && say(`${what}: neznámý hráč "${v}"`);

  if (!(s.dur > 0)) say("chybí dur");
  for (const p of P) {
    if (!p.path?.length) say(`hráč ${p.id}: chybí path`);
    ascending(p.path || [], `hráč ${p.id}`);
    (p.path || []).forEach(([, x, y]) => !inside(x, y) && say(`hráč ${p.id}: mimo tabuli (${x}, ${y})`));
  }
  ascending(s.ball || [], "míč");
  (s.ball || []).forEach((k) => (typeof k[1] === "string" ? ref(k[1], "míč") : !inside(k[1], k[2]) && say(`míč mimo tabuli (${k[1]}, ${k[2]})`)));
  (s.marks || []).forEach((m, i) => {
    ref(m.from, `značka ${i}`);
    ref(m.to, `značka ${i}`);
    ref(m.at, `značka ${i}`);
    if (m.t && m.t[0] > s.dur) say(`značka ${i}: začíná po konci scény`);
  });
  const beats = s.beats || [];
  if (!beats.length || beats[0].t !== 0) say("první titulek musí mít t: 0");
  beats.forEach((b, i) => {
    if (b.text.length > 48) say(`titulek „${b.text}“ je delší než 48 znaků`);
    if (b.say && (b.say.length > 130 || /\d/.test(b.say))) say(`hlas „${b.say}“: nad 130 znaků nebo číslice (čísla piš slovy)`);
    if (i && b.t - beats[i - 1].t < 1.8 - 1e-6) say(`titulky ${i}/${i + 1} jsou moc nahusto (< 1,8 s)`);
    if (b.t > s.dur) say(`titulek ${i + 1} je po konci scény`);
  });

  const worst = {};
  for (let t = 0; t <= s.dur + 1e-9; t += 0.1) {
    const xy = P.map((p) => at(p.path, t));
    for (let i = 0; i < P.length; i++)
      for (let j = i + 1; j < P.length; j++) {
        const d = Math.hypot(xy[i].x - xy[j].x, xy[i].y - xy[j].y);
        const key = P[i].id + "+" + P[j].id;
        if (d < MIN_GAP && (!worst[key] || d < worst[key].d)) worst[key] = { d, t };
      }
  }
  Object.entries(worst).forEach(([k, v]) => say(`překryv ${k}: ${v.d.toFixed(1)} m v čase ${v.t.toFixed(1)} s`));

  // Štítky se kreslí nad hráče a míč → nesmí je zakrýt (rozměry jako Tag a Player v Board.jsx).
  const pos = (id, t) => at(byId[id]?.path, t);
  const fwd = (id) => (byId[id]?.team === "them" ? -1 : 1);
  const covered = {};
  (s.marks || []).forEach((m) => {
    if (!m.text || (m.kind !== "label" && m.kind !== "zone")) return;
    const t0 = m.t?.[0] ?? 0;
    const w = Math.max(2.6, m.text.length * 0.78 + 1.2) / 2;
    const fixed = Array.isArray(m.at) ? { x: m.at[0], y: m.at[1] } : null;
    for (let t = t0 + 0.3; t < (m.t?.[1] ?? s.dur); t += 0.1) {
      const c =
        fixed ?? (m.kind === "label" ? pos(m.at, m.follow ? t : t0) : m.circle ? { x: m.circle[0], y: m.circle[1] } : { x: m.rect[0] + m.rect[2] / 2, y: m.rect[1] + m.rect[3] / 2 });
      const things = P.map((p) => [p.id, pos(p.id, t), 1.3]);
      const b = ballAt(s.ball, t, pos, fwd);
      if (b) things.push(["míč", b, 0.62]);
      for (const [id, q, r] of things) {
        const over = r - Math.hypot(Math.max(Math.abs(q.x - c.x) - w, 0), Math.max(Math.abs(q.y - c.y) - 1.05, 0));
        if (over > 0.3) covered[`štítek „${m.text}“ zakrývá ${id}`] ??= t;
      }
    }
  });
  Object.entries(covered).forEach(([k, t]) => say(`${k} v čase ${t.toFixed(1)} s`));
}
