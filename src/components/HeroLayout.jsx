/* --- HeroLayout: compound 1.4fr / 1fr grid (plan §6.1) ---
   Default variant uses `grid-cols-hero` (1.4fr 1fr). `variant="alt"` switches to
   `grid-cols-heroAlt` (1.1fr 1fr) for the HomePage hero. Mobile collapses to a
   single column. */
export function HeroLayout({ children, variant = "default", className = "" }) {
  const cols =
    variant === "alt" ? "grid-cols-1 md:grid-cols-heroAlt" : "grid-cols-1 md:grid-cols-hero";
  return (
    <div className={`grid ${cols} gap-5 md:gap-6 ${className}`}>
      {children}
    </div>
  );
}

function Main({ children, className = "" }) {
  return <div className={className}>{children}</div>;
}
Main.displayName = "HeroLayout.Main";

function Side({ children, className = "" }) {
  return <div className={`flex flex-col gap-3.5 ${className}`}>{children}</div>;
}
Side.displayName = "HeroLayout.Side";

HeroLayout.Main = Main;
HeroLayout.Side = Side;

export default HeroLayout;
