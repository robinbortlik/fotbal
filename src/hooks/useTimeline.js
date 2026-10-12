import { useEffect, useRef, useState } from "react";

/* Hodiny animace v sekundách. loop=false → na konci zastaví (a play pak jede od začátku).
   start = čas, odkud se začíná (Kvíz zastaví scénu uprostřed). */
export function useTimeline(duration, autoplay = false, loop = true, start = 0) {
  const [time, setTimeState] = useState(start);
  const [playing, setPlaying] = useState(autoplay);
  const tRef = useRef(start);
  const setTime = (t) => {
    tRef.current = t;
    setTimeState(t);
  };
  useEffect(() => {
    if (!playing) return;
    if (tRef.current >= duration) tRef.current = 0;
    let last = performance.now();
    let raf;
    const tick = (now) => {
      let t = tRef.current + (now - last) / 1000;
      last = now;
      if (t >= duration) {
        if (!loop) {
          tRef.current = duration;
          setTimeState(duration);
          setPlaying(false);
          return;
        }
        t = 0;
      }
      tRef.current = t;
      setTimeState(t);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, duration, loop]);
  return { time, setTime, playing, setPlaying };
}

export default useTimeline;
