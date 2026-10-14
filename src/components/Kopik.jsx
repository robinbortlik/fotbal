/* Kopík — míč s obličejem, průvodce webem. Čistě SVG, velikost v px.
   talking = hýbe pusou (když opravdu hraje jeho hlas — useSpeech ve voice.js). */
export function Kopik({ size = 64, className = "", talking = false }) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={"kopik " + (talking ? "talking " : "") + className}
      aria-hidden="true"
    >
      <defs>
        <clipPath id="kopik-clip">
          <circle cx="50" cy="50" r="44" />
        </clipPath>
      </defs>
      <circle cx="50" cy="50" r="44" fill="#fff" />
      <g clipPath="url(#kopik-clip)" fill="var(--ink)">
        <polygon points="50,2 62,10 58,22 42,22 38,10" />
        <polygon points="2,36 14,30 22,40 16,54 4,52" />
        <polygon points="98,36 86,30 78,40 84,54 96,52" />
        <polygon points="14,82 26,76 34,86 28,98 14,96" />
        <polygon points="86,82 74,76 66,86 72,98 86,96" />
      </g>
      <circle cx="50" cy="50" r="44" fill="none" stroke="var(--ink)" strokeWidth="5" />
      <ellipse cx="38" cy="47" rx="8" ry="10" fill="#fff" stroke="var(--ink)" strokeWidth="3" />
      <ellipse cx="62" cy="47" rx="8" ry="10" fill="#fff" stroke="var(--ink)" strokeWidth="3" />
      <circle cx="40" cy="49" r="4.2" fill="var(--ink)" />
      <circle cx="64" cy="49" r="4.2" fill="var(--ink)" />
      <circle cx="41.6" cy="47" r="1.4" fill="#fff" />
      <circle cx="65.6" cy="47" r="1.4" fill="#fff" />
      <circle cx="27" cy="62" r="4.5" fill="#FF9AA8" opacity="0.7" />
      <circle cx="73" cy="62" r="4.5" fill="#FF9AA8" opacity="0.7" />
      <g className="kopik-mouth">
        <path d="M40 64 Q50 75 60 64 Z" fill="var(--ink)" stroke="var(--ink)" strokeWidth="3" strokeLinejoin="round" />
        <path d="M45 69 Q50 72 55 69" fill="#FF6B6B" />
      </g>
    </svg>
  );
}

export default Kopik;
