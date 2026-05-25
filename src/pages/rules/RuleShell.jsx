import { MascotSay } from "../../components";

/* --- Reusable rule layout shell ---
   Provides the standard header (kicker / title / lead / mascot intro) plus a
   1.4fr / 1fr grid for pitchSlot + sideSlot. Falls back to a single column when
   no sideSlot is provided. */
export function RuleShell({ kicker, title, lead, mascotText, children, pitchSlot, sideSlot }) {
  return (
    <div>
      <span className="eyebrow orange">{kicker}</span>
      <h2 className="mt-2.5">{title}</h2>
      <p className="lead">{lead}</p>
      {mascotText && (
        <div className="mt-4.5">
          <MascotSay>{mascotText}</MascotSay>
        </div>
      )}
      <div
        className={`responsive-grid hero-grid grid gap-5 md:gap-6 mt-4.5 ${
          sideSlot ? "grid-cols-1 md:grid-cols-hero" : "grid-cols-1"
        }`}
      >
        <div>{pitchSlot}</div>
        {sideSlot && <div>{sideSlot}</div>}
      </div>
      {children}
    </div>
  );
}

export default RuleShell;
