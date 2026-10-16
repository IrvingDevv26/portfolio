import { STACK_LOGOS } from "./logos";
import LogoLoop from "./reactbits/LogoLoop";

/* Cinta de logos del stack (LogoLoop de React Bits). Se carga en diferido. */

const LOGOS = STACK_LOGOS.map(({ title, d, wordmark }) => ({
  title,
  node: d ? (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-[1em] w-[1em]">
      <path d={d} />
    </svg>
  ) : (
    <span className="font-display text-[0.8em] font-bold leading-none tracking-tight">
      {wordmark}
    </span>
  ),
}));

const TechLogos = () => (
  <LogoLoop
    logos={LOGOS}
    speed={45}
    logoHeight={28}
    gap={56}
    labels="inline"
    pauseOnHover
    fadeOut
    fadeOutWidth={0.1}
    ariaLabel="Tecnologías con las que trabajo"
    className="text-[color:var(--soft)]"
  />
);

export default TechLogos;
