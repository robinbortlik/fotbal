/* --- Section heading ---
   .section-head / .index / h2 styling lives in src/styles/index.css. */
export function SectionHead({ index, title, kicker }) {
  return (
    <div className="section-head">
      {index && <span className="index">{index}</span>}
      <div>
        <h2>{title}</h2>
        {kicker && <p className="mt-1.5 text-navySoft">{kicker}</p>}
      </div>
    </div>
  );
}

export default SectionHead;
