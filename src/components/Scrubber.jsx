import { useEffect, useRef } from "react";

/* --- Scrubber (play/pause + draggable timeline + steps) ---
   .scrubber, .scrubber-btn, .scrubber-track, .scrubber-fill, .scrubber-thumb,
   .scrubber-time, .step-chip, .steps all live in @layer components (index.css). */
export function Scrubber({
  duration,
  value,
  onChange,
  playing,
  onPlay,
  steps = null,
  onStepChange = null,
  currentStep = 0,
}) {
  const trackRef = useRef(null);
  const dragging = useRef(false);

  const handlePoint = (e) => {
    const rect = trackRef.current.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const ratio = Math.max(0, Math.min(1, x / rect.width));
    onChange(ratio * duration);
  };
  const onDown = (e) => {
    dragging.current = true;
    handlePoint(e);
  };
  const onMove = (e) => {
    if (dragging.current) {
      e.preventDefault();
      handlePoint(e);
    }
  };
  const onUp = () => {
    dragging.current = false;
  };

  useEffect(() => {
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
    };
  }, []);

  const ratio = Math.max(0, Math.min(1, value / duration));

  return (
    <div>
      <div className="scrubber">
        <button
          className="scrubber-btn"
          onClick={onPlay}
          aria-label={playing ? "Pauza" : "Přehrát"}
        >
          {playing ? (
            <svg width="14" height="14" viewBox="0 0 14 14">
              <rect x="2" y="1" width="3.5" height="12" fill="#0B1F33" />
              <rect x="8.5" y="1" width="3.5" height="12" fill="#0B1F33" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 14 14">
              <polygon points="2,1 13,7 2,13" fill="#0B1F33" />
            </svg>
          )}
        </button>
        <div
          className="scrubber-track"
          ref={trackRef}
          onMouseDown={onDown}
          onTouchStart={onDown}
        >
          <div className="scrubber-fill" style={{ width: ratio * 100 + "%" }} />
          <div className="scrubber-thumb" style={{ left: ratio * 100 + "%" }} />
        </div>
        <div className="scrubber-time">
          {value.toFixed(1)}s / {duration.toFixed(0)}s
        </div>
      </div>
      {steps && (
        <div className="steps">
          {steps.map((s, i) => (
            <button
              key={i}
              className={
                "step-chip " + (i === currentStep ? "active" : i < currentStep ? "done" : "")
              }
              onClick={() => onStepChange && onStepChange(i)}
            >
              {i + 1}. {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default Scrubber;
