/* --- Bouncing ball icon for inline use --- */
export function BallIcon({ size = 24 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size}>
      <circle cx="12" cy="12" r="10" fill="#fff" stroke="#0B1F33" strokeWidth="2" />
      <polygon points="12,7 15,9.5 14,13 10,13 9,9.5" fill="#0B1F33" />
    </svg>
  );
}

export default BallIcon;
