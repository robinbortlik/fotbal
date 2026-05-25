import { Mascot, MascotSay } from "../../components";

/* --- FAIR PLAY & RESPECT --- */
const SCENARIOS = [
  {
    emoji: "🤝",
    title: "Před zápasem a po něm",
    good: "Podáš ruku soupeřům, sudímu i spoluhráčům.",
    bad: "Projdeš kolem soupeře, kouknul/a si na něj přes rameno.",
  },
  {
    emoji: "🙋",
    title: "Když srazíš soupeře",
    good: "Pomůžeš mu vstát. Řekneš „pardon, dobrý?“.",
    bad: "Otočíš se a běžíš pryč jakoby nic.",
  },
  {
    emoji: "📣",
    title: "Když není jasné, kdo poslední sáhl na míč",
    good: "Když to víš, řekneš to. „Bylo to z mojí nohy — to je jejich roh.“",
    bad: "Mlčíš, doufáš, že to projde.",
  },
  {
    emoji: "👮",
    title: "Když ti přijde, že sudí udělal chybu",
    good: "Nic neříkáš. Sudí to ví líp než ty. Hraje se dál.",
    bad: "Začneš hádat, nadávat. Žlutá karta, někdy červená.",
  },
  {
    emoji: "🏆",
    title: "Když vyhraješ",
    good: "Zatleskáš soupeři. „Dobrý zápas!“",
    bad: "Vysmíváš se. „Jste mimina!“ — to vážně ne.",
  },
  {
    emoji: "🤕",
    title: "Když prohraješ",
    good: "Zvedneš hlavu, podáš ruku vítězi. Příště to půjde líp.",
    bad: "Rozplácneš se do trávy a brečíš, nebo někoho kopneš.",
  },
  {
    emoji: "🎭",
    title: "Když si představíš, že tě někdo srazil, ale ve skutečnosti ne",
    good: "Hraješ dál, fotbal není divadlo.",
    bad: "Spadneš schválně (simulování — žlutá karta!).",
  },
  {
    emoji: "💪",
    title: "Když dáš gól",
    good: "Radost, ano! Ale nepřipomínáš soupeři pořád, že prohrává.",
    bad: "Posmíváš se brankáři, ukazuješ na něj prstem.",
  },
];

export function StratFairPlay() {
  return (
    <div className="hero-grid grid grid-cols-1 md:grid-cols-hero gap-5 md:gap-6">
      <div className="flex flex-col gap-3.5">
        <MascotSay mood="wink">
          <b>Fair play znamená „čistá hra“.</b> Není to o tom, že vždycky vyhraješ. Je to o tom, že se za hru nestydíš — ani když prohraješ. Trenér, rodiče i spoluhráči to vidí.
        </MascotSay>
        <div className="card">
          <div className="display text-[22px]">Pravidlo Kopíka č. 1</div>
          <p className="mt-2 text-[15px] opacity-95">
            <b>„Hraj tak, jak chceš, aby hráli proti tobě.“</b> Když ti někdo podloží nohu, naštve tě to. Tak to tedy nedělej ostatním.
          </p>
        </div>
        <div className="card orange">
          <div className="display text-xl">Kdy ti to jde nejlíp?</div>
          <ul className="pl-5 leading-relaxed mt-2 text-[15px]">
            <li>Když se uklidníš mezi akcemi.</li>
            <li>Když posloucháš trenéra.</li>
            <li>Když si pomáháš se spoluhráči.</li>
            <li>Když si pamatuješ: <b>je to hra</b>.</li>
          </ul>
        </div>
        <div className="card green flex items-center gap-3 p-4">
          <Mascot size={56} mood="wink"/>
          <p className="text-[14px] opacity-95">
            <b>Žluté karty často padají za řeči s rozhodčím.</b> Vyplatí se mlčet — i když máš pocit, že má pravdu jen tvůj tým.
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <div className="display text-xl">Jak ano a jak ne</div>
        <div className="grid gap-2.5">
          {SCENARIOS.map((s, i) => (
            <div
              key={i}
              className="card p-4"
              style={{ borderLeft: "8px solid var(--pitch)" }}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-[28px]" aria-hidden>{s.emoji}</span>
                <div className="font-display font-extrabold text-[15px] leading-[1.15]">{s.title}</div>
              </div>
              <div className="mt-2 grid gap-1.5">
                <div className="text-[14px]" style={{ color: "#0f6b3c" }}>
                  <b>✅ Tak jo:</b> {s.good}
                </div>
                <div className="text-[14px]" style={{ color: "#a93a2a" }}>
                  <b>❌ Tak ne:</b> {s.bad}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default StratFairPlay;
