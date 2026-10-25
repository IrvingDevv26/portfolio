import { useState } from "react";
import { Link } from "react-router-dom";
import { useContent, useLocalize } from "../lib/i18n";
import { useSalesMode } from "../lib/salesMode";
import { btn, focusRing } from "../lib/ui";
import { WhatsAppButton } from "./ContactButtons";
import { AlertIcon, ArrowLeftIcon, ArrowRightIcon, UploadIcon } from "./icons";
import LanguageSwitch from "./LanguageSwitch";
import ElectricBorder from "./reactbits/ElectricBorder";
import ShinyText from "./reactbits/ShinyText";
import StatusMark from "./reactbits/StatusMark";

/* Piezas que comparten las demos (DataRefine, AgendaFlow y FacturaCheck):
   encabezado, pasos, zona para soltar archivos y avisos. */

const LiveBadge = ({ className = "" }) => {
  const { UI } = useContent();
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border border-[color:var(--line)] bg-[color:var(--glass)] px-3 py-1 text-xs font-medium ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--clean)]" />
      <ShinyText text={UI.common.liveDemo} />
    </span>
  );
};

/* Barra superior de las demos y de las páginas del sitio.
   - Demos abiertas directo desde su link (como llegan desde Workana): solo
     "Demo en vivo" y el idioma, sin nada que lleve a tus datos de contacto.
   - Demos en modo venta (ver lib/salesMode.js) y páginas del sitio (`site`):
     volver al portfolio, WhatsApp con el mensaje de la página (`topic`) y el
     idioma. `badge`: muestra "Demo en vivo". */
export const LabHeader = ({ topic, badge = true, site = false }) => {
  const { UI } = useContent();
  const to = useLocalize();
  const sales = useSalesMode();
  const contact = site || sales;
  return (
    <header className="relative z-10 border-b border-[color:var(--line)] bg-[color:var(--ink)]/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-10">
        {contact ? (
          <Link
            to={to("/")}
            className={`inline-flex items-center gap-2 rounded-md text-sm text-[color:var(--muted)] transition-colors hover:text-[color:var(--text)] ${focusRing}`}
          >
            <ArrowLeftIcon className="h-4 w-4" />
            {/* En celular, corto: deja lugar a WhatsApp y al idioma */}
            <span className="sm:hidden">Portfolio</span>
            <span className="max-sm:hidden">{UI.common.backToPortfolio}</span>
          </Link>
        ) : (
          badge && <LiveBadge />
        )}
        <div className="flex items-center gap-2">
          {contact && badge && <LiveBadge className="max-md:hidden" />}
          {contact && topic && <WhatsAppButton topic={topic} size="sm" />}
          <LanguageSwitch />
        </div>
      </div>
    </header>
  );
};

/** "Platiquemos" (lleva a Contacto) y WhatsApp: solo en modo venta. */
export const TalkButton = ({ topic }) => {
  const { UI } = useContent();
  const to = useLocalize();
  const sales = useSalesMode();
  if (!sales) return null;
  return (
    <>
      <Link to={to("/#contacto")} className={btn("primary", "sm")}>
        {UI.common.letsTalk} <ArrowRightIcon className="h-4 w-4" />
      </Link>
      {topic && <WhatsAppButton topic={topic} size="sm" />}
    </>
  );
};

// Estado de cada paso para StatusMark: pendiente, en curso, completado o fallido
const markOf = (state, activity) => {
  if (state === "done") return "done";
  if (state === "current" && activity === "done") return "done";
  if (state === "current" && activity === "processing") return "running";
  if (state === "current" && activity === "error") return "failed";
  return "pending";
};

export const Stepper = ({ current, activity, words }) => (
  <ol aria-label={words.progress} className="flex items-center gap-3">
    {words.steps.map((label, i) => {
      const n = i + 1;
      const state = n < current ? "done" : n === current ? "current" : "todo";

      return (
        <li
          key={label}
          aria-current={state === "current" ? "step" : undefined}
          className="flex flex-1 items-center gap-3 last:flex-none"
        >
          <StatusMark
            status={markOf(state, activity)}
            size={22}
            color={state === "todo" ? "#8A909C" : "#D4B27A"}
            doneColor="#7BDDB5"
            errorColor="#FF9AA8"
            strike={false}
          />
          <span
            className={`text-sm ${
              state === "current" ? "inline" : "hidden sm:inline"
            } ${
              state === "todo"
                ? "text-[color:var(--muted)]"
                : "text-[color:var(--text)]"
            }`}
          >
            {label}
          </span>
          {n < words.steps.length && (
            <span
              aria-hidden="true"
              className="h-px flex-1 bg-[color:var(--line)]"
            />
          )}
        </li>
      );
    })}
  </ol>
);

// Borde eléctrico (React Bits) sólo con WebGL acelerado
export const Charged = ({ glow, on, strong = false, radius = 16, children }) =>
  glow ? (
    <ElectricBorder
      active={on}
      color="#D4B27A"
      borderRadius={radius}
      intensity={strong ? 0.9 : 0.55}
      chaos={0.35}
      spread={0.5}
      strands={2}
      thickness={1.2}
      glow={0.5}
      arcs={strong ? 1.2 : 0.3}
      speed={0.8}
      cursorRadius={70}
    >
      {children}
    </ElectricBorder>
  ) : (
    children
  );

/** Zona para arrastrar o elegir archivos. `onFiles` recibe la lista elegida
    (un FileList); `accept` son las extensiones admitidas (".xml"…). */
export const Dropzone = ({
  dragging,
  setDragging,
  onFiles,
  glow,
  onArm,
  words,
  accept,
  multiple = false,
  note,
}) => {
  const [hover, setHover] = useState(false);

  return (
    <Charged glow={glow} on={dragging || hover} strong={dragging}>
      <label
        onPointerEnter={() => {
          onArm();
          setHover(true);
        }}
        onPointerLeave={() => setHover(false)}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) setDragging(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          onFiles(e.dataTransfer.files);
        }}
        className={`group flex cursor-pointer flex-col items-center gap-4 rounded-2xl border-2 border-dashed px-6 py-14 text-center transition-colors focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[color:var(--accent)] md:py-16 ${
          dragging
            ? "border-[color:var(--accent)] bg-[color:var(--accent-bg)]"
            : "border-[color:var(--line-strong)] bg-[color:var(--ink)] hover:border-[rgba(212,178,122,0.35)]"
        }`}
      >
        <input
          type="file"
          accept={accept.join(",")}
          multiple={multiple}
          className="sr-only"
          onChange={(e) => {
            onFiles(e.target.files);
            e.target.value = "";
          }}
        />
        <span
          className={`flex h-14 w-14 items-center justify-center rounded-full border transition-colors ${
            dragging
              ? "border-[color:var(--accent-line)] text-[color:var(--accent)]"
              : "border-[color:var(--line)] bg-[color:var(--raised)] text-[color:var(--soft)] group-hover:text-[color:var(--accent)]"
          }`}
        >
          <UploadIcon className="h-6 w-6" />
        </span>
        <span className="font-display text-xl font-semibold text-[color:var(--text)]">
          {dragging ? words.drop : words.drag}
        </span>
        <span className="text-sm text-[color:var(--muted)]">
          {words.or}{" "}
          <span className="text-[color:var(--text)] underline underline-offset-4">
            {words.choose}
          </span>
        </span>
        <ul
          aria-label={words.formats}
          className="flex flex-wrap justify-center gap-2"
        >
          {accept.map((ext) => (
            <li
              key={ext}
              className="rounded-md border border-[color:var(--line)] px-2 py-0.5 font-mono text-xs text-[color:var(--muted)]"
            >
              {ext}
            </li>
          ))}
        </ul>
        {note && (
          <span className="text-xs text-[color:var(--muted)]">{note}</span>
        )}
      </label>
    </Charged>
  );
};

export const ErrorAlert = ({ children }) => (
  <div
    role="alert"
    className="mt-5 flex gap-3 rounded-xl border border-[color:var(--danger-line)] bg-[color:var(--danger-bg)] p-4 text-sm leading-relaxed text-[color:var(--danger)]"
  >
    <AlertIcon className="mt-0.5 h-5 w-5 shrink-0" />
    <p>{children}</p>
  </div>
);

export const SubTitle = ({ children }) => (
  <h3 className="mb-3 font-mono text-xs uppercase tracking-[0.16em] text-[color:var(--muted)]">
    {children}
  </h3>
);
