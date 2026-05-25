/* --- TileGrid: responsive grid for <Tile> cards.
   Defaults to 1 col mobile → 2 col tablet → 3 col desktop. Pass `cols` (a
   complete Tailwind grid-cols-* class string) to override. */
export function TileGrid({ children, cols, className = "" }) {
  const colsClass = cols ?? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
  return <div className={`grid ${colsClass} gap-4 ${className}`}>{children}</div>;
}

export default TileGrid;
