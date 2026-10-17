import { useMemo } from "react";
import { useContent } from "../lib/i18n";
import {
  CloudIcon,
  CodeIcon,
  ServerIcon,
  TableIcon,
  WorkflowIcon,
} from "./icons";
import MagicBento from "./reactbits/MagicBento";

/* Servicios en rejilla bento (MagicBento de React Bits): brillo de borde y foco
   que siguen al cursor. Cada celda lleva un mini visual de lo que resuelve. */

const ICONS = {
  workflow: WorkflowIcon,
  table: TableIcon,
  code: CodeIcon,
  server: ServerIcon,
  cloud: CloudIcon,
};

const mono = "font-mono text-[11px] leading-relaxed sm:text-xs";

// Bitácora de una automatización corriendo sola
const AutomationLog = ({ words }) => (
  <div
    className={`${mono} w-full rounded-xl border border-[color:var(--line)] bg-[#08090C]/70 p-4`}
  >
    {["08:00:00", "08:00:02", "08:00:04", "08:00:05"]
      .map((time, i, all) => [
        time,
        words.log[i],
        i === all.length - 1
          ? "text-[color:var(--clean)]"
          : "text-[color:var(--soft)]",
      ])
      .map(([time, text, tone]) => (
        <p key={time} className="flex gap-3">
          <span className="text-[color:var(--muted)]">{time}</span>
          <span className={tone}>{text}</span>
        </p>
      ))}
    <p className="mt-1 flex items-center gap-2 text-[color:var(--muted)]">
      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[color:var(--clean)] motion-reduce:animate-none" />
      {words.clicks}
    </p>
  </div>
);

// Antes y después de limpiar
const CleanRows = ({ words }) => (
  <div className={`${mono} grid w-full gap-1.5`}>
    {words.clean.map(([before, after]) => (
      <div
        key={before}
        className="grid grid-cols-[1fr_auto_1fr] items-center gap-2"
      >
        <span className="truncate whitespace-pre rounded bg-[color:var(--warn-bg)] px-2 py-1 text-[color:var(--warn)] line-through decoration-[color:var(--warn)]/50">
          {before}
        </span>
        <span className="text-[color:var(--muted)]">→</span>
        <span className="truncate rounded bg-[color:var(--clean-bg)] px-2 py-1 text-[color:var(--clean)]">
          {after}
        </span>
      </div>
    ))}
  </div>
);

// Una llamada a la API
const ApiCall = () => (
  <div
    className={`${mono} w-full rounded-lg border border-[color:var(--line)] bg-[#08090C]/70 px-3 py-2`}
  >
    <p>
      <span className="text-[color:var(--accent)]">POST</span>{" "}
      <span className="text-[color:var(--soft)]">/api/v1/clean</span>
    </p>
    <p className="text-[color:var(--clean)]">200 OK · 1.2 s</p>
  </div>
);

// Estado de la infraestructura
const InfraStatus = ({ words }) => (
  <ul className={`${mono} w-full space-y-1`}>
    {words.servers.map((name) => (
      <li key={name} className="flex items-center justify-between gap-2">
        <span className="text-[color:var(--soft)]">{name}</span>
        <span className="flex items-center gap-1.5 text-[color:var(--clean)]">
          <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--clean)]" />
          {words.active}
        </span>
      </li>
    ))}
  </ul>
);

const visuals = (words) => ({
  workflow: { visual: <AutomationLog words={words} />, colSpan: 2, rowSpan: 2 },
  table: { visual: <CleanRows words={words} />, colSpan: 2 },
  code: { visual: <ApiCall /> },
  server: { visual: <InfraStatus words={words} /> },
});

const itemsFor = (SERVICES, words) => {
  const byIcon = visuals(words);
  return SERVICES.map((service) => {
    const Icon = ICONS[service.icon];
    return {
      // El id es el ícono: no cambia con el idioma
      id: service.icon,
      icon: <Icon className="h-4 w-4" />,
      label: service.tags.join(" · "),
      title: service.title,
      description: service.short ?? service.text,
      ...byIcon[service.icon],
    };
  });
};

const THEME = {
  "--mb-surface": "linear-gradient(180deg, #14161C 0%, #0E1014 100%)",
  "--mb-edge": "rgba(255, 255, 255, 0.08)",
  "--mb-tile": "linear-gradient(180deg, #1F222A 0%, #16181E 100%)",
};

const ServicesBento = () => {
  const { SERVICES, UI } = useContent();
  const items = useMemo(() => itemsFor(SERVICES, UI.bento), [SERVICES, UI]);
  return (
    <MagicBento
      items={items}
      columns={4}
      // Con celdas más angostas el texto y la ilustración se enciman (tablet)
      minCellWidth={210}
      rowHeight={230}
      gap={12}
      radius={20}
      glowColor="#D4B27A"
      textAutoHide={false}
      enableStars={false}
      enableTilt={false}
      enableMagnetism={false}
      spotlightRadius={320}
      style={THEME}
    />
  );
};

export default ServicesBento;
