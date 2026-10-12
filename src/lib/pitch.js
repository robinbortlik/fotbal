/* Hřiště pro starší přípravku 5+1 podle FAČR (Pravidla fotbalu malých forem 2023):
   43–45 × 28–30 m (doporučen větší rozměr), branky 5 × 2 m, pokutové území = pruh
   5,5 m od brankové čáry přes celou šířku, pokutový kop ze 7 m. V metrech, svislá orientace:
   x = 0..W zleva doprava, y = 0..L od NAŠÍ brankové čáry (dole) k soupeřově (nahoře).
   Dopředu = nahoru = +y. Do SVG se převádí přes sy(). */
export const W = 30; // šířka
export const L = 45; // délka
export const GOAL_W = 5; // branka 5 × 2 m
export const BOX_D = 5.5; // pokutové území (celá šířka hřiště)
export const PEN = 7; // pokutový kop
export const PAD = 2.4; // okraj kolem čar (aut, roh, síť branky)
export const MID = { x: W / 2, y: L / 2 };

export const sy = (y) => L - y;

const easeInOut = (f) => (f < 0.5 ? 2 * f * f : 1 - (-2 * f + 2) ** 2 / 2);
const easeOut = (f) => 1 - (1 - f) ** 2;

/* path = [[t, x, y], ...] → {x, y} v čase t (hráči: plynulý rozjezd i dojezd). */
export function at(path, t) {
  if (!path?.length) return { x: 0, y: 0 };
  if (t <= path[0][0]) return { x: path[0][1], y: path[0][2] };
  for (let i = 1; i < path.length; i++) {
    const [t1, x1, y1] = path[i];
    if (t <= t1) {
      const [t0, x0, y0] = path[i - 1];
      const e = easeInOut((t - t0) / (t1 - t0 || 1));
      return { x: x0 + (x1 - x0) * e, y: y0 + (y1 - y0) * e };
    }
  }
  const last = path[path.length - 1];
  return { x: last[1], y: last[2] };
}

/* Míč: klíčové snímky [t, x, y] nebo [t, "idHráče"] (= míč u hráče), případně [t, "idHráče", 0]
   = míč v rukou (vzdálenost od středu hráče v metrech; výchozí 1,5).
   - Dva po sobě jdoucí snímky u stejného hráče → hráč míč vede (míč 1,5 m před ním ve směru útoku).
   - Jinak míč letí (přihrávka, střela) se zpomalením na konci. Přihrávka se zastaví na straně
     hráče, odkud přiletěla (neprojede „skrz“ něj); když pak hráč míč vede, míč se mu za 0,35 s
     přesune dopředu.
   center(id, t) = střed hráče, fwd(id) = +1 (útočí nahoru) / −1 (dolů). */
const OFF = 1.5;
const BLEND = 0.35;

export function ballAt(path, t, center, fwd) {
  if (!path?.length) return null;
  const id = (k) => (typeof k[1] === "string" ? k[1] : null);
  const front = (p, tt, off = OFF) => {
    const c = center(p, tt);
    return { x: c.x, y: c.y + off * fwd(p) };
  };
  const side = (p, tt, from) => {
    const c = center(p, tt);
    const dx = from.x - c.x;
    const dy = from.y - c.y;
    const d = Math.hypot(dx, dy);
    return d < 0.3 ? front(p, tt) : { x: c.x + (dx / d) * OFF, y: c.y + (dy / d) * OFF };
  };
  // Poloha míče u i-tého snímku v čase tt.
  const where = (i, tt) => {
    const k = path[i];
    const p = id(k);
    if (!p) return { x: k[1], y: k[2] };
    const caught = i > 0 && id(path[i - 1]) !== p;
    if (typeof k[2] === "number") return front(p, tt, k[2]); // míč v rukou / vlastní vzdálenost
    if (!caught) return front(p, tt);
    const s = side(p, tt, where(i - 1, path[i - 1][0]));
    const f = Math.min(1, (tt - k[0]) / BLEND);
    if (f <= 0 || id(path[i + 1] || []) !== p) return s;
    const fr = front(p, tt);
    return { x: s.x + (fr.x - s.x) * f, y: s.y + (fr.y - s.y) * f };
  };

  if (t <= path[0][0]) return where(0, t);
  for (let i = 1; i < path.length; i++) {
    if (t <= path[i][0]) {
      const k0 = path[i - 1];
      if (id(k0) && id(k0) === id(path[i])) return where(i - 1, t);
      const p0 = where(i - 1, k0[0]);
      const p1 = where(i, path[i][0]);
      const e = easeOut((t - k0[0]) / (path[i][0] - k0[0] || 1));
      return { x: p0.x + (p1.x - p0.x) * e, y: p0.y + (p1.y - p0.y) * e };
    }
  }
  return where(path.length - 1, t);
}
