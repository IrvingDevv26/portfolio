import { AnimatePresence, motion } from "framer-motion";
import { useContent } from "../../lib/i18n";
import { card } from "../../lib/ui";
import { CheckIcon, XIcon } from "../icons";

/* Bitácora de lo que hizo el agente detrás del chat, la más reciente arriba.
   Las acciones que frenó una regla del backend se marcan en rojo. */

const TOOLS = [
  "ver_disponibilidad",
  "agendar_cita",
  "buscar_citas",
  "reprogramar_cita",
  "cancelar_cita",
];

const ActionLog = ({ actions }) => {
  const words = useContent().AGENDA_LAB.actions;
  const blocked = actions.filter((a) => !a.ok).length;

  return (
    <section aria-label={words.label} className={`${card} p-4 sm:p-5`}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <h2 className="font-display text-lg font-semibold">{words.title}</h2>
        {actions.length > 0 && (
          <p className="text-xs text-[color:var(--muted)]">
            {words.count(actions.length, blocked)}
          </p>
        )}
      </div>

      {actions.length === 0 ? (
        <>
          <p className="mt-3 text-sm leading-relaxed text-[color:var(--muted)]">
            {words.empty}
          </p>
          <ul className="mt-4 flex flex-wrap gap-2" aria-label={words.tools}>
            {TOOLS.map((tool) => (
              <li
                key={tool}
                className="rounded-md border border-dashed border-[color:var(--line-strong)] px-2 py-1 font-mono text-[11px] text-[color:var(--muted)]"
              >
                {tool}()
              </li>
            ))}
          </ul>
        </>
      ) : (
        <ol className="relative mt-4 space-y-3 before:absolute before:bottom-3 before:left-[9.5px] before:top-3 before:w-px before:bg-[color:var(--line)]">
          <AnimatePresence initial={false}>
            {actions.map((action) => (
              <motion.li
                key={action.id}
                layout
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                className="relative flex gap-3"
              >
                <span
                  aria-hidden="true"
                  className={`relative mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border bg-[color:var(--raised)] ${
                    action.ok
                      ? "border-[color:var(--clean-line)] text-[color:var(--clean)]"
                      : "border-[color:var(--danger-line)] text-[color:var(--danger)]"
                  }`}
                >
                  {action.ok ? (
                    <CheckIcon className="h-3 w-3" />
                  ) : (
                    <XIcon className="h-3 w-3" />
                  )}
                </span>
                <div className="min-w-0 flex-1 text-sm">
                  <p className="flex flex-wrap items-baseline gap-x-2">
                    <span className="font-medium text-[color:var(--text)]">
                      {action.etiqueta}
                    </span>
                    <code className="font-mono text-[11px] text-[color:var(--muted)]">
                      {action.herramienta}()
                    </code>
                  </p>
                  {action.detalle && (
                    <p className="text-[color:var(--soft)]">{action.detalle}</p>
                  )}
                  {!action.ok && action.error && (
                    <p className="mt-1 rounded-md bg-[color:var(--danger-bg)] px-2 py-1 text-[13px] text-[color:var(--danger)]">
                      {words.rule}: {action.error}
                    </p>
                  )}
                </div>
                <time className="shrink-0 font-mono text-[11px] text-[color:var(--muted)]">
                  {action.time}
                </time>
              </motion.li>
            ))}
          </AnimatePresence>
        </ol>
      )}
    </section>
  );
};

export default ActionLog;
