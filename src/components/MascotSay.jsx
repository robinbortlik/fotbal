import { Mascot } from "./Mascot.jsx";

/* --- Speech bubble row ---
   .mascot-row + .bubble are styled via @layer components in src/styles/index.css
   (the speech-bubble pseudo-element triangles). */
export function MascotSay({ children, mood = "happy", size = 72 }) {
  return (
    <div className="mascot-row">
      <Mascot size={size} mood={mood} bounce />
      <div className="bubble">{children}</div>
    </div>
  );
}

export default MascotSay;
