/* Jednoduché ikony 24×24, barva = currentColor. */
const P = {
  pitch: (
    <>
      <rect x="5" y="2.5" width="14" height="19" rx="2" />
      <path d="M5 12h14M9 2.5v3.5h6V2.5M9 21.5V18h6v3.5" />
      <circle cx="12" cy="12" r="2.4" />
    </>
  ),
  whistle: (
    <>
      <path d="M14.5 9.5H21v4h-5.2" />
      <circle cx="9.5" cy="14" r="6" />
      <circle cx="9.5" cy="14" r="1.6" fill="currentColor" />
      <path d="M6 8.5 4 4.5" />
    </>
  ),
  attack: (
    <>
      <path d="M4 9.5V3.5h16v6" />
      <circle cx="12" cy="16" r="5" />
      <path d="m12 13.2 2.6 1.9-1 3h-3.2l-1-3z" fill="currentColor" stroke="none" />
    </>
  ),
  dribble: (
    <>
      <circle cx="6" cy="18" r="3" />
      <path d="M10 15.5 14.5 13 10.5 9.5 17 5.5" />
      <path d="M13.4 4.8 17 5.5l-.8 3.6" />
    </>
  ),
  kick: (
    <>
      <path d="M3 8.5h4.5l.6 3.6c3.6.2 6.4 1.3 7.2 3.4.3.8-.2 1.5-1 1.5H3z" />
      <circle cx="19.2" cy="10.6" r="2.7" />
    </>
  ),
  shield: <path d="M12 2.5 4.5 5.5v6c0 4.6 3.2 8.3 7.5 10 4.3-1.7 7.5-5.4 7.5-10v-6z" />,
  glove: (
    <>
      <path d="M7.5 21.5v-4.2L4.6 13a1.7 1.7 0 0 1 2.7-2l1.7 1.9V5.4a1.6 1.6 0 0 1 3.2 0V11V3.9a1.6 1.6 0 0 1 3.2 0V11V5.6a1.6 1.6 0 0 1 3.2 0v9.6c0 3.5-2.3 6.3-5.6 6.3z" />
      <path d="M7.5 18.5h10.4" />
    </>
  ),
  quiz: (
    <>
      <path d="M4 6a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3h-6.5L6 21v-4a2 2 0 0 1-2-2z" />
      <path d="M9.7 8.3a2.3 2.3 0 1 1 3.3 2.1c-.6.3-1 .8-1 1.4v.4" />
      <circle cx="12" cy="14.6" r=".5" fill="currentColor" />
    </>
  ),
  speaker: (
    <>
      <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor" />
      <path d="M15.5 9a4.2 4.2 0 0 1 0 6M18.3 6.3a8 8 0 0 1 0 11.4" />
    </>
  ),
  install: (
    <>
      <rect x="6" y="2.5" width="12" height="19" rx="2.5" />
      <path d="M12 6.5v8M9.5 12l2.5 2.5 2.5-2.5" />
    </>
  ),
  play: <path d="M8 5.5v13l10.5-6.5z" fill="currentColor" />,
  pause: <path d="M7.5 5.5h3v13h-3zM13.5 5.5h3v13h-3z" fill="currentColor" />,
  replay: (
    <>
      <path d="M5 12a7 7 0 1 0 2.1-5" />
      <path d="M6.5 2.8v4.6h4.6" />
    </>
  ),
  check: <path d="M5 12.5 10 17.5 19.5 6.5" />,
  cross: <path d="M6 6l12 12M18 6 6 18" />,
  next: <path d="M5 12h13M13 6.5 18.5 12 13 17.5" />,
};

export function Icon({ name, size = 24, className = "" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={"icon " + className}
      aria-hidden="true"
    >
      {P[name]}
    </svg>
  );
}

export default Icon;
