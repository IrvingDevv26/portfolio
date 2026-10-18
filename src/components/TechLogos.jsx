import { useContent } from "../lib/i18n";
import { STACK_LOGOS } from "./logos";
import LogoLoop from "./reactbits/LogoLoop";

/* Cinta de logos del stack (LogoLoop de React Bits). Se carga en diferido. */

const LOGOS = STACK_LOGOS.map(({ title, d, wordmark }) => ({
  title,
  node: d ? (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="h-[1em] w-[1em]"
    >
      <path d={d} />
    </svg>
  ) : (
    <span className="font-display text-[0.8em] font-bold leading-none tracking-tight">
      {wordmark}
    </span>
  ),
}));

// Infraestructura que habla a reclutadores, no a una pyme (ver showInfraLogos)
const INFRA = ["Proxmox", "MikroTik"];
const PYME_LOGOS = LOGOS.filter((logo) => !INFRA.includes(logo.title));

const TechLogos = () => {
  const { UI } = useContent();
  return (
    <LogoLoop
      logos={UI.landing.showInfraLogos ? LOGOS : PYME_LOGOS}
      speed={45}
      logoHeight={28}
      gap={56}
      labels="inline"
      pauseOnHover
      fadeOut
      fadeOutWidth={0.1}
      ariaLabel={UI.landing.techLogos}
      className="text-[color:var(--soft)]"
    />
  );
};

export default TechLogos;
