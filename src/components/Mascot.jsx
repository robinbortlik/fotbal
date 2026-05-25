/* --- Mascot: a friendly soccer ball "Kopík" ---
   The size prop sets a CSS var (--mascot-size) consumed by the .mascot rule
   in src/styles/index.css. This lets mobile @media breakpoints clamp the size
   via CSS without inline style winning. The SVG fills its container 100% and
   scales proportionally via its viewBox. */
export function Mascot({ size = 80, mood = "happy", spin = false, bounce = false }) {
  const eyeY = mood === "wink" ? 36 : 34;
  return (
    <div
      className={"mascot " + (bounce ? "bouncy" : "")}
      style={{ "--mascot-size": size + "px" }}
    >
      <svg
        viewBox="0 0 80 80"
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid meet"
        className="block"
        style={{ animation: spin ? "spin 1.8s linear infinite" : "none" }}
      >
        <defs>
          <radialGradient id="ballShade" cx="35%" cy="32%" r="70%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="55%" stopColor="#f3ede0" />
            <stop offset="100%" stopColor="#d4cbb4" />
          </radialGradient>
        </defs>
        <circle cx="40" cy="40" r="36" fill="url(#ballShade)" stroke="#0B1F33" strokeWidth="3" />
        {/* pentagon center */}
        <polygon points="40,24 49,30 46,40 34,40 31,30" fill="#0B1F33" />
        {/* surrounding seams */}
        <path d="M40 6 L40 24" stroke="#0B1F33" strokeWidth="2.5" fill="none" />
        <path d="M14 24 L31 30" stroke="#0B1F33" strokeWidth="2.5" fill="none" />
        <path d="M66 24 L49 30" stroke="#0B1F33" strokeWidth="2.5" fill="none" />
        <path d="M22 56 L34 40" stroke="#0B1F33" strokeWidth="2.5" fill="none" />
        <path d="M58 56 L46 40" stroke="#0B1F33" strokeWidth="2.5" fill="none" />
        {/* face on pentagon */}
        <circle cx="36" cy={eyeY} r="1.6" fill="#F7F2E6" />
        <circle cx="44" cy={eyeY} r="1.6" fill="#F7F2E6" />
        {mood === "wink" && (
          <path d="M43 34 L46 34" stroke="#F7F2E6" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        )}
        <path d="M36 38 Q40 41 44 38" stroke="#F7F2E6" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export default Mascot;
