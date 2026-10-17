import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { useMediaQuery } from "../../lib/hooks";
import { useContent } from "../../lib/i18n";
import { card, focusRing, iconBtn } from "../../lib/ui";
import { ArrowLeftIcon, ArrowRightIcon } from "../icons";
import {
  addDays,
  clock,
  minutesOf,
  openingHours,
  openRanges,
  shortDate,
  weekdayOf,
} from "./dates";
import { proColor, proIndex } from "./team";

/* Agenda de la clínica como un calendario semanal: cada cita es un bloque del
   alto de su duración, las horas sin servicio van rayadas y una línea marca la
   hora actual. En móvil se ve un día a la vez (con botones para cambiar). */

export const LAST_WEEK = 4; // se puede agendar hasta 30 días a futuro

const HATCH =
  "repeating-linear-gradient(135deg, rgba(255,255,255,0.05) 0 1px, transparent 1px 7px)";
const MINE = "#D4B27A";

// Tramos sin servicio dentro de la cuadrícula (comida, sábado en la tarde…)
const closedRanges = (open, start, end) => {
  const closed = [];
  let cursor = start;
  for (const [from, to] of open) {
    if (from > cursor) closed.push([cursor, from]);
    cursor = Math.max(cursor, to);
  }
  if (cursor < end) closed.push([cursor, end]);
  return closed;
};

const overlapsAnother = (a, items) =>
  items.some((b) => b !== a && b.inicio < a.fin && a.inicio < b.fin);

// "Dra. Ana Torres" → "Dra. Ana"
const shortName = (name) => name.split(" ").slice(0, 2).join(" ");

const Stat = ({ label, value }) => (
  <div className="min-w-0 rounded-xl border border-[color:var(--line)] bg-[color:var(--ink)] px-3 py-2.5">
    <p className="truncate text-[11px] text-[color:var(--muted)]">{label}</p>
    <motion.p
      key={value}
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-0.5 font-display text-xl font-semibold tabular-nums text-[color:var(--text)]"
    >
      {value}
    </motion.p>
  </div>
);

const Appointment = ({ a, business, flash, overlap, pct }) => {
  const from = minutesOf(a.inicio);
  const to = minutesOf(a.fin);
  const mine = a.origen === "agent";
  const color = mine ? MINE : proColor(business, a.profesional);
  const lane = overlap ? Math.max(0, proIndex(business, a.profesional)) : 0;
  const short = to - from <= 30;
  // La tercera línea sólo cabe completa en citas de una hora o más y a lo ancho
  const roomy = to - from >= 60 && !overlap;
  const time = `${a.inicio.slice(11, 16)}–${a.fin.slice(11, 16)}`;

  return (
    <motion.li
      layout
      layoutId={a.codigo}
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{
        opacity: 1,
        scale: 1,
        boxShadow: flash
          ? ["0 0 0 0 rgba(212,178,122,0.7)", "0 0 0 7px rgba(212,178,122,0)"]
          : "0 0 0 0 rgba(212,178,122,0)",
      }}
      exit={{ opacity: 0, scale: 0.92 }}
      transition={{
        duration: 0.35,
        boxShadow: { duration: 1.2, repeat: flash ? 2 : 0 },
      }}
      title={`${time} · ${a.servicio} · ${a.profesional}${mine ? ` · ${a.paciente} (${a.codigo})` : ""}`}
      className={`@container absolute overflow-hidden rounded-md border-l-[3px] text-[11px] leading-tight ${overlap ? "px-1" : "px-1.5"} ${
        short ? "flex items-center" : "py-1"
      } ${mine ? "z-[1] text-[color:var(--text)] ring-1 ring-[color:var(--accent)]" : "text-[color:var(--soft)]"}`}
      style={{
        top: `calc(${pct(from)}% + 1px)`,
        height: `calc(${pct(to) - pct(from)}% - 2px)`,
        left: overlap ? `calc(${lane * 50}% + 2px)` : "3px",
        width: overlap ? "calc(50% - 4px)" : "calc(100% - 6px)",
        borderLeftColor: color,
        backgroundColor: "#14171D",
        backgroundImage: `linear-gradient(${color}${mine ? "38" : "1F"}, ${color}${mine ? "38" : "1F"})`,
      }}
    >
      {short ? (
        <span className="truncate">
          <span className="font-mono text-[10px] opacity-75">
            {a.inicio.slice(11, 16)}
          </span>{" "}
          {a.servicio}
        </span>
      ) : (
        <>
          <span className="block truncate font-mono text-[10px] opacity-75">
            {a.inicio.slice(11, 16)}
            {/* La hora de fin sólo si el bloque es lo bastante ancho */}
            <span className="hidden @min-[4.25rem]:inline">
              –{a.fin.slice(11, 16)}
            </span>
          </span>
          <span className="block truncate font-medium">{a.servicio}</span>
          {roomy && (
            <span className="block truncate opacity-70">
              {mine ? `${a.paciente} · ${a.codigo}` : shortName(a.profesional)}
            </span>
          )}
        </>
      )}
    </motion.li>
  );
};

const DayHeader = ({ day, today, weekdays }) => (
  <div className="border-b border-[color:var(--line)] pb-2 text-center">
    {day ? (
      <>
        <span className="block font-mono text-[10px] uppercase tracking-wider text-[color:var(--muted)]">
          {weekdays[weekdayOf(day)]}
        </span>
        <span
          className={`mx-auto mt-0.5 flex h-8 w-8 items-center justify-center rounded-full font-display text-base font-semibold ${
            day === today
              ? "bg-[color:var(--accent)] text-[color:var(--btn-ink)]"
              : "text-[color:var(--text)]"
          }`}
        >
          {Number(day.slice(8, 10))}
        </span>
      </>
    ) : (
      <span className="mx-auto block h-[2.875rem] w-9 animate-pulse rounded-lg bg-[color:var(--glass)]" />
    )}
  </div>
);

const DayColumn = ({
  day,
  today,
  now,
  items,
  business,
  highlighted,
  start,
  end,
  weekdays,
  dayLabel,
}) => {
  const pct = (minutes) => ((minutes - start) / (end - start)) * 100;
  const closed = day
    ? closedRanges(openRanges(business?.horario, day), start, end)
    : [];
  const isToday = day === today && now !== null;
  const past = isToday ? Math.min(Math.max(now, start), end) : start;

  return (
    <div
      className="relative h-[32rem] border-l border-[color:var(--line)]"
      style={{
        backgroundImage:
          "linear-gradient(to bottom, var(--line) 1px, transparent 1px)",
        backgroundSize: `100% ${(60 / (end - start)) * 100}%`,
      }}
    >
      {closed.map(([from, to]) => (
        <div
          key={from}
          aria-hidden="true"
          className="absolute inset-x-0"
          style={{
            top: `${pct(from)}%`,
            height: `${pct(to) - pct(from)}%`,
            backgroundImage: HATCH,
          }}
        />
      ))}
      {/* Lo que ya pasó hoy queda atenuado */}
      {past > start && (
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 bg-[rgba(8,9,12,0.5)]"
          style={{ height: `${pct(past)}%` }}
        />
      )}

      {day && (
        <ul
          className="absolute inset-0"
          aria-label={dayLabel(
            weekdays[weekdayOf(day)],
            Number(day.slice(8, 10)),
          )}
        >
          <AnimatePresence initial={false}>
            {items.map((a) => (
              <Appointment
                key={a.codigo}
                a={a}
                business={business}
                flash={highlighted.includes(a.codigo)}
                overlap={overlapsAnother(a, items)}
                pct={pct}
              />
            ))}
          </AnimatePresence>
        </ul>
      )}

      {isToday && now > start && now < end && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 z-[2] flex -translate-y-1/2 items-center"
          style={{ top: `${pct(now)}%` }}
        >
          <span className="-ml-1 h-2 w-2 rounded-full bg-[color:var(--danger)]" />
          <span className="h-px flex-1 bg-[color:var(--danger)]" />
        </div>
      )}
    </div>
  );
};

const WeekCalendar = ({
  today,
  now,
  agenda,
  business,
  highlighted,
  week,
  onWeek,
  day,
  onDay,
}) => {
  const { AGENDA_LAB, DATES } = useContent();
  const words = AGENDA_LAB.calendar;
  const wide = useMediaQuery("(min-width: 768px)");
  const loading = !today;
  const [start, end] = openingHours(business?.horario);
  const hours = Array.from(
    { length: (end - start) / 60 + 1 },
    (_, i) => start + i * 60,
  );

  const first = loading ? null : addDays(today, week * 7);
  const range = loading
    ? []
    : Array.from({ length: 7 }, (_, i) => addDays(first, i));
  // Sólo los días que abre la clínica (los domingos no): 6 columnas
  const days = range.filter((d) => openRanges(business?.horario, d).length > 0);
  const selected = days.includes(day) ? day : days[0];
  const columns = loading
    ? Array.from({ length: wide ? 6 : 1 }, () => null)
    : wide
      ? days
      : [selected];
  const itemsOf = (d) => agenda.filter((a) => a.inicio.slice(0, 10) === d);

  // Cifras de la semana visible
  const weekItems = days.flatMap(itemsOf);
  const pros = Math.max(1, business?.profesionales?.length ?? 1);
  const openMinutes =
    days.reduce(
      (sum, d) =>
        sum +
        openRanges(business?.horario, d).reduce((s, [a, b]) => s + b - a, 0),
      0,
    ) * pros;
  const busyMinutes = weekItems.reduce(
    (sum, a) => sum + minutesOf(a.fin) - minutesOf(a.inicio),
    0,
  );
  const occupancy = openMinutes
    ? Math.round((busyMinutes / openMinutes) * 100)
    : 0;
  const mine = agenda.filter((a) => a.origen === "agent").length;

  return (
    <section aria-label={words.label} className={`${card} p-4 sm:p-5`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-semibold">{words.title}</h2>
          <p className="text-xs text-[color:var(--muted)]">{words.subtitle}</p>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onWeek(week - 1)}
            disabled={loading || week === 0}
            aria-label={words.previous}
            className={`${iconBtn} disabled:opacity-30`}
          >
            <ArrowLeftIcon className="h-4 w-4" />
          </button>
          <span className="min-w-[8.5rem] text-center text-sm text-[color:var(--soft)]">
            {loading
              ? "…"
              : week === 0
                ? words.thisWeek
                : `${shortDate(range[0], DATES)} – ${shortDate(range[6], DATES)}`}
          </span>
          <button
            type="button"
            onClick={() => onWeek(week + 1)}
            disabled={loading || week === LAST_WEEK}
            aria-label={words.next}
            className={`${iconBtn} disabled:opacity-30`}
          >
            <ArrowRightIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <Stat
          label={words.appointments}
          value={loading ? "–" : weekItems.length}
        />
        <Stat
          label={words.occupancy}
          value={loading ? "–" : `${occupancy} %`}
        />
        <Stat label={words.yours} value={loading ? "–" : mine} />
      </div>

      <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-[color:var(--muted)]">
        {(business?.profesionales ?? []).map((p) => (
          <li key={p.id} className="flex items-center gap-1.5">
            <span
              aria-hidden="true"
              className="h-3 w-1 rounded-full"
              style={{ backgroundColor: proColor(business, p.nombre) }}
            />
            {p.nombre}
          </li>
        ))}
        <li className="flex items-center gap-1.5">
          <span
            aria-hidden="true"
            className="h-3 w-3 rounded-sm border border-[color:var(--accent)] bg-[color:var(--accent-bg)]"
          />
          {words.yours}
        </li>
        <li className="flex items-center gap-1.5">
          <span
            aria-hidden="true"
            className="h-3 w-3 rounded-sm border border-[color:var(--line-strong)]"
            style={{ backgroundImage: HATCH }}
          />
          {words.closed}
        </li>
      </ul>

      {/* Móvil: un día a la vez */}
      {!wide && (
        <div
          className="mt-4 grid grid-cols-6 gap-1"
          role="group"
          aria-label={words.day}
        >
          {(loading ? Array.from({ length: 6 }, () => null) : days).map(
            (d, i) =>
              d ? (
                <button
                  key={d}
                  type="button"
                  aria-pressed={d === selected}
                  onClick={() => onDay(d)}
                  className={`relative rounded-xl border py-1.5 text-center transition-colors ${focusRing} ${
                    d === selected
                      ? "border-[color:var(--accent-line)] bg-[color:var(--accent-bg)] text-[color:var(--text)]"
                      : "border-[color:var(--line)] text-[color:var(--soft)]"
                  }`}
                >
                  <span className="block font-mono text-[10px] uppercase tracking-wider text-[color:var(--muted)]">
                    {d === today ? words.today : DATES.weekdays[weekdayOf(d)]}
                  </span>
                  <span className="block font-display text-base font-semibold">
                    {Number(d.slice(8, 10))}
                  </span>
                  {itemsOf(d).some((a) => a.origen === "agent") && (
                    <span
                      aria-label={words.hasYours}
                      className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[color:var(--accent)]"
                    />
                  )}
                </button>
              ) : (
                <span
                  key={i}
                  className="h-[3.25rem] animate-pulse rounded-xl bg-[color:var(--glass)]"
                />
              ),
          )}
        </div>
      )}

      <div
        className="mt-4 grid gap-y-2"
        style={{
          gridTemplateColumns: `2.5rem repeat(${columns.length}, minmax(0, 1fr))`,
        }}
      >
        {wide && (
          <>
            <span />
            {columns.map((d, i) => (
              <DayHeader
                key={d ?? i}
                day={d}
                today={today}
                weekdays={DATES.weekdays}
              />
            ))}
          </>
        )}

        <div className="relative h-[32rem]" aria-hidden="true">
          {hours.map((minutes) => (
            <span
              key={minutes}
              className="absolute right-2 -translate-y-1/2 font-mono text-[10px] text-[color:var(--muted)]"
              style={{ top: `${((minutes - start) / (end - start)) * 100}%` }}
            >
              {clock(minutes)}
            </span>
          ))}
        </div>
        <LayoutGroup>
          {columns.map((d, i) => (
            <DayColumn
              key={d ?? i}
              day={d}
              today={today}
              now={now}
              items={d ? itemsOf(d) : []}
              business={business}
              highlighted={highlighted}
              start={start}
              end={end}
              weekdays={DATES.weekdays}
              dayLabel={words.dayLabel}
            />
          ))}
        </LayoutGroup>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-[color:var(--muted)]">
        {words.note}
      </p>
    </section>
  );
};

export default WeekCalendar;
