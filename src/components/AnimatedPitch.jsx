import { PitchSVG } from "./PitchSVG.jsx";
import { Scrubber } from "./Scrubber.jsx";
import { useTimeline } from "../hooks/useTimeline.js";

/* --- AnimatedPitch: PitchSVG + useTimeline + Scrubber bundle (plan §6.8) ---
   `children` is a render-prop receiving `{ time }`; whatever it returns is
   rendered inside <PitchSVG>. Pass `scrubber={false}` to hide the timeline UI
   (useful for the home hero teaser). `steps`/`currentStep`/`onStepChange` are
   forwarded to <Scrubber>. */
export function AnimatedPitch({
  duration,
  autoplay = false,
  steps = null,
  currentStep = 0,
  onStepChange,
  pitchProps = {},
  scrubber = true,
  children,
}) {
  const { time, setTime, playing, setPlaying } = useTimeline(duration, autoplay);
  return (
    <div className="pitch-wrap">
      <PitchSVG {...pitchProps}>{children({ time })}</PitchSVG>
      {scrubber && (
        <Scrubber
          duration={duration}
          value={time}
          onChange={setTime}
          playing={playing}
          onPlay={() => setPlaying(!playing)}
          steps={steps}
          currentStep={currentStep}
          onStepChange={onStepChange}
        />
      )}
    </div>
  );
}

export default AnimatedPitch;
