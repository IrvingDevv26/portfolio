import { focusRing } from "../lib/ui";
import DecryptedText from "./reactbits/DecryptedText";
import WarmTooltip from "./reactbits/WarmTooltip";

const SECTION_SPACING = {
  lg: "py-24 md:py-32",
  md: "py-16 md:py-20",
};

export const Section = ({ id, size = "lg", className = "", children }) => (
  <section
    id={id}
    className={`mx-auto max-w-6xl px-6 md:px-10 ${SECTION_SPACING[size]} ${className}`}
  >
    {children}
  </section>
);

export const h2 =
  "balance font-display text-4xl font-semibold leading-[1.05] tracking-tight text-[color:var(--text)] md:text-5xl";

/* Etiqueta numerada de sección: "01 — Servicios" */
export const Eyebrow = ({ index, children }) => (
  <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-[color:var(--accent)]">
    {index && <span className="text-[color:var(--muted)]">{index}</span>}
    {index && (
      <span aria-hidden="true" className="h-px w-8 bg-[color:var(--accent-line)]" />
    )}
    <DecryptedText text={children} />
  </p>
);

export const SectionHeading = ({ index, eyebrow, title, intro, className = "" }) => (
  <div className={`max-w-2xl ${className}`}>
    <Eyebrow index={index}>{eyebrow}</Eyebrow>
    <h2 className={`${h2} mt-5`}>{title}</h2>
    {intro && (
      <p className="mt-5 text-lg leading-relaxed text-[color:var(--soft)]">
        {intro}
      </p>
    )}
  </div>
);

export const SocialLink = ({ href, label, children }) => (
  <WarmTooltip content={label} surfaceColor="#F1F3F6" inkColor="#08090C" size="sm">
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={`inline-flex h-10 w-10 items-center justify-center rounded-[10px] border border-[color:var(--line)] bg-[color:var(--glass)] text-[color:var(--soft)] transition duration-200 hover:-translate-y-0.5 hover:border-[color:var(--accent-line)] hover:text-[color:var(--text)] ${focusRing}`}
    >
      {children}
    </a>
  </WarmTooltip>
);

export const Tag = ({ children }) => (
  <li className="rounded-full border border-[color:var(--line)] bg-[color:var(--glass)] px-3 py-1 text-xs font-medium text-[color:var(--soft)]">
    {children}
  </li>
);
