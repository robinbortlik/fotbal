/* Barrel re-exports for shared components.
   Import sites: `import { Mascot, MascotSay, ... } from "../components";`
   Tweaks panel ships its own barrel at ./tweaks/index.js. */
export { Mascot } from "./Mascot.jsx";
export { MascotSay } from "./MascotSay.jsx";
export { BallIcon } from "./BallIcon.jsx";
export { PitchSVG } from "./PitchSVG.jsx";
export { Player } from "./Player.jsx";
export { Ball } from "./Ball.jsx";
export { Arrow } from "./Arrow.jsx";
export { Scrubber } from "./Scrubber.jsx";
export { SectionHead } from "./SectionHead.jsx";
export { Tile } from "./Tile.jsx";

/* Dedup primitives (plan §6) */
export { HeroLayout } from "./HeroLayout.jsx";
export { StepChips } from "./StepChips.jsx";
export { SectionIntro } from "./SectionIntro.jsx";
export { TileGrid } from "./TileGrid.jsx";
export { AnimatedPitch } from "./AnimatedPitch.jsx";
