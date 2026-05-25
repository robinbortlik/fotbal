import { MascotSay } from "./MascotSay.jsx";

/* --- SectionIntro: MascotSay wrapped in a section with consistent bottom margin.
   Forwards any MascotSay prop (mood, size) and renders children inside the bubble. */
export function SectionIntro({ children, mood, size }) {
  return (
    <section className="mb-6">
      <MascotSay mood={mood} size={size}>
        {children}
      </MascotSay>
    </section>
  );
}

export default SectionIntro;
