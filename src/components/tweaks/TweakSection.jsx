/* TweakSection — visual divider/header for a group of tweak rows. */
export function TweakSection({ label, children }) {
  return (
    <>
      <div className="twk-sect">{label}</div>
      {children}
    </>
  );
}

export default TweakSection;
