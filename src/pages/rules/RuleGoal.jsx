import { RuleShell } from "./RuleShell.jsx";

/* --- GOAL --- */
export function RuleGoal() {
  return (
    <RuleShell
      kicker="06 / Branka"
      title="Co znamená vstřelit branku?"
      lead="Míč musí přejít CELÝ za brankovou čáru, mezi tyčemi a pod břevnem. Ani milimetr méně."
      mascotText="Pozor! Když je míč na čáře, ještě to není gól. Musí být CELÝ za ní. Sudí to dnes ve velkých zápasech kontroluje i pomocí kamer (gólová technologie)."
      pitchSlot={
        <div className="card p-6">
          <div className="responsive-grid hero-grid grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { ok: false, label: "Míč na čáře", caption: "Není gól. Část míče je ještě na hřišti." },
              { ok: false, label: "Půl na, půl za", caption: "Pořád není gól. Musí celý." },
              { ok: true, label: "Celý za čárou", caption: "GÓL! ⚽" },
            ].map((c, i) => (
              <div key={i} className="text-center p-3 rounded-[14px] border-2 border-navy" style={{ background: c.ok ? "#dff5e6" : "var(--cream)" }}>
                <svg viewBox="0 0 60 40" className="w-full h-[100px]">
                  <rect x="0" y="5" width="60" height="30" fill="#0E8A4F"/>
                  <line x1="10" y1="5" x2="10" y2="35" stroke="white" strokeWidth="0.6"/>
                  <rect x="2" y="10" width="8" height="20" fill="none" stroke="white" strokeWidth="0.5"/>
                  {/* ball position */}
                  <circle cx={i === 0 ? 11 : i === 1 ? 9 : 6} cy={22} r="2.5" fill="white" stroke="#0B1F33" strokeWidth="0.5"/>
                </svg>
                <div className="font-display font-extrabold mt-2" style={{ color: c.ok ? "#084d2c" : "var(--navy)" }}>{c.label}</div>
                <div className="text-[13px] text-navySoft mt-1">{c.caption}</div>
              </div>
            ))}
          </div>
        </div>
      }
    />
  );
}

export default RuleGoal;
