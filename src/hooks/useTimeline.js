import { useEffect, useRef, useState } from "react";

/* --- Animator hook: returns time in seconds, looping, with playing state --- */
export function useTimeline(duration, autoplay = false) {
  const [time, setTime] = useState(0);
  const [playing, setPlaying] = useState(autoplay);
  const raf = useRef();
  const last = useRef();
  useEffect(() => {
    if (!playing) return;
    last.current = performance.now();
    const tick = (now) => {
      const dt = (now - last.current) / 1000;
      last.current = now;
      setTime((t) => {
        const nt = t + dt;
        if (nt >= duration) return 0;
        return nt;
      });
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [playing, duration]);
  return { time, setTime, playing, setPlaying };
}

export default useTimeline;
