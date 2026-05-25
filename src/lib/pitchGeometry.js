/* Pitch coordinate system: 0..100 (x: along touchline), 0..64 (y: along byline). */
export const PITCH_W = 100;
export const PITCH_H = 64;

/* --- Interpolation helper: positions[] = [{t, x, y}, ...] returns {x, y} at time t --- */
export function interpAt(track, t) {
  if (!track || track.length === 0) return { x: 0, y: 0 };
  if (t <= track[0].t) return track[0];
  if (t >= track[track.length - 1].t) return track[track.length - 1];
  for (let i = 0; i < track.length - 1; i++) {
    const a = track[i];
    const b = track[i + 1];
    if (t >= a.t && t <= b.t) {
      const f = (t - a.t) / (b.t - a.t);
      // easeInOut
      const e = f < 0.5 ? 2 * f * f : 1 - Math.pow(-2 * f + 2, 2) / 2;
      return { x: a.x + (b.x - a.x) * e, y: a.y + (b.y - a.y) * e };
    }
  }
  return track[track.length - 1];
}
