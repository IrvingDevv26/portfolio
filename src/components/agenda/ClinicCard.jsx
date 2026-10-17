import { useContent } from "../../lib/i18n";
import { card, focusRing } from "../../lib/ui";
import { DownIcon } from "../icons";
import { scheduleSummary } from "./dates";
import { proColor } from "./team";

/* Ficha de la clínica de ejemplo (servicios, precios, horario y equipo), con
   los datos que manda el backend. Sirve para saber qué preguntarle al agente.
   En escritorio va junto al título; en móvil, plegada. */

const money = (amount, locale) => `$${amount.toLocaleString(locale)}`;

const Heading = ({ children }) => (
  <h3 className="font-mono text-[11px] uppercase tracking-[0.16em] text-[color:var(--muted)]">
    {children}
  </h3>
);

// Renglones vacíos del mismo alto que los reales mientras llega la información
const Placeholder = ({ rows, className, rowClass = "" }) => (
  <ul className={className} aria-hidden="true">
    {Array.from({ length: rows }, (_, i) => (
      <li key={i} className={rowClass}>
        <span className="block h-5 animate-pulse rounded bg-[color:var(--glass)]" />
      </li>
    ))}
  </ul>
);

const ClinicInfo = ({ business }) => {
  const { AGENDA_LAB, DATES } = useContent();
  const words = AGENDA_LAB.clinic;
  return (
    <div className="space-y-5 text-sm">
      <div>
        <Heading>{words.services}</Heading>
        {business ? (
          <ul className="mt-2 divide-y divide-[color:var(--line)]">
            {business.servicios.map((s) => (
              <li key={s.id} className="flex items-baseline gap-3 py-1.5">
                <span className="min-w-0 flex-1 truncate text-[color:var(--soft)]">
                  {s.nombre}
                </span>
                <span className="font-mono text-[11px] text-[color:var(--muted)]">
                  {s.minutos} min
                </span>
                <span className="w-14 text-right font-medium tabular-nums text-[color:var(--text)]">
                  {money(s.precio, DATES.locale)}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <Placeholder
            rows={5}
            className="mt-2 divide-y divide-[color:var(--line)]"
            rowClass="py-1.5"
          />
        )}
      </div>

      <div>
        <Heading>{words.hours}</Heading>
        {business ? (
          <dl className="mt-2 space-y-1">
            {scheduleSummary(business.horario, DATES, words.closed).map(
              (row) => (
                <div key={row.days} className="flex gap-3">
                  <dt className="w-16 shrink-0 text-[color:var(--muted)]">
                    {row.days}
                  </dt>
                  <dd className="text-[color:var(--soft)]">{row.hours}</dd>
                </div>
              ),
            )}
          </dl>
        ) : (
          <Placeholder rows={3} className="mt-2 space-y-1" />
        )}
      </div>

      <div>
        <Heading>{words.team}</Heading>
        {business ? (
          <ul className="mt-2 space-y-1">
            {business.profesionales.map((p) => (
              <li
                key={p.id}
                className="flex items-center gap-2 text-[color:var(--soft)]"
              >
                <span
                  aria-hidden="true"
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: proColor(business, p.nombre) }}
                />
                {p.nombre}
              </li>
            ))}
          </ul>
        ) : (
          <Placeholder rows={2} className="mt-2 space-y-1" />
        )}
      </div>
    </div>
  );
};

export const ClinicCard = ({ business, className = "" }) => {
  const { AGENDA_LAB } = useContent();
  const words = AGENDA_LAB.clinic;
  return (
    <aside aria-label={words.label} className={`${card} p-5 ${className}`}>
      <div className="mb-5 flex items-center gap-3">
        <span
          aria-hidden="true"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[color:var(--accent)] font-display text-sm font-semibold text-[color:var(--btn-ink)]"
        >
          DS
        </span>
        <div className="min-w-0">
          <p className="truncate font-medium text-[color:var(--text)]">
            {business?.nombre ?? AGENDA_LAB.chat.fallbackName}
          </p>
          <p className="text-xs text-[color:var(--muted)]">{words.sample}</p>
        </div>
      </div>
      <ClinicInfo business={business} />
    </aside>
  );
};

export const ClinicDetails = ({ business, className = "" }) => {
  const words = useContent().AGENDA_LAB.clinic;
  return (
    <details className={`${card} group ${className}`}>
      <summary
        className={`flex cursor-pointer list-none items-center justify-between gap-3 rounded-2xl px-5 py-4 text-sm font-medium text-[color:var(--text)] [&::-webkit-details-marker]:hidden ${focusRing}`}
      >
        {words.details}
        <DownIcon className="h-4 w-4 shrink-0 text-[color:var(--muted)] transition-transform group-open:rotate-180" />
      </summary>
      <div className="border-t border-[color:var(--line)] px-5 py-4">
        <ClinicInfo business={business} />
      </div>
    </details>
  );
};
