import { useEffect, useRef, useState } from "react";
import { DEMO_FILE, DEMO_ROWS } from "../content";
import { card, focusRing } from "../lib/ui";
import { FileIcon } from "./icons";
import ThoughtLine from "./reactbits/ThoughtLine";

const COLUMNS = ["cliente", "fecha", "monto"];
const COLS = COLUMNS.length;
const TOTAL_CELLS = DEMO_ROWS.length * COLS;
const STEP_MS = 90; // velocidad de la "ola" de limpieza
const GRID = "grid grid-cols-[1.25fr_1fr_0.8fr] gap-x-3";

const WARN = "bg-[color:var(--warn-bg)] text-[color:var(--warn)]";
const NORMAL = "bg-transparent text-[color:var(--text)]";
const STRUCK = "bg-transparent text-[color:var(--muted)] line-through";

const count = (list) => list.filter(Boolean).length;

// Lo que "va pensando" la IA mientras avanza la ola de limpieza
const AI_STEPS = [
  "Normalizando nombres",
  "Unificando fechas y montos",
  "Fusionando duplicados",
  "Marcando datos faltantes",
];

// Cifras calculadas a partir de los datos del ejemplo
const STATS = (() => {
  const problems = count(DEMO_ROWS.flatMap((r) => r.bad));
  const review = count(DEMO_ROWS.flatMap((r) => r.review ?? []));
  const merged = DEMO_ROWS.filter((r) => r.merged).length;
  const fixed =
    count(DEMO_ROWS.filter((r) => !r.merged).flatMap((r) => r.bad)) - review;
  return { problems, review, merged, fixed };
})();

const cellTone = (row, col, cleaned) => {
  if (row.merged) return cleaned ? STRUCK : row.bad[col] ? WARN : NORMAL;
  if (!cleaned) return row.bad[col] ? WARN : NORMAL;
  return row.review?.[col] ? WARN : NORMAL;
};

const Chip = ({ tone, children }) => (
  <span
    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
      tone === "warn"
        ? "bg-[color:var(--warn-bg)] text-[color:var(--warn)]"
        : "bg-[color:var(--clean-bg)] text-[color:var(--clean)]"
    }`}
  >
    {children}
  </span>
);

const CleaningDemo = () => {
  const [mode, setMode] = useState("before"); // before | after
  const [progress, setProgress] = useState(0); // celdas ya limpiadas
  const [run, setRun] = useState(0); // reinicia el cronómetro de la IA
  const rootRef = useRef(null);
  const timer = useRef(null);
  const kickoff = useRef(null);
  const interacted = useRef(false);
  const reduceMotion = useRef(false);

  const stop = () => {
    clearInterval(timer.current);
    clearTimeout(kickoff.current);
    timer.current = null;
  };

  const play = () => {
    interacted.current = true;
    stop();
    setMode("after");
    setRun((r) => r + 1);
    if (reduceMotion.current) {
      setProgress(TOTAL_CELLS);
      return;
    }
    setProgress(0);
    let n = 0;
    timer.current = setInterval(() => {
      n += 1;
      setProgress(n);
      if (n >= TOTAL_CELLS) stop();
    }, STEP_MS);
  };

  const reset = () => {
    interacted.current = true;
    stop();
    setMode("before");
    setProgress(0);
  };

  // La limpieza arranca sola una vez, cuando la tarjeta entra en pantalla
  useEffect(() => {
    reduceMotion.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const el = rootRef.current;
    if (!el || reduceMotion.current) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !interacted.current) {
          interacted.current = true;
          kickoff.current = setTimeout(play, 900);
          observer.disconnect();
        }
      },
      { threshold: 0.6 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const done = progress >= TOTAL_CELLS;
  const stepsShown = done
    ? AI_STEPS.length
    : Math.min(
        AI_STEPS.length,
        Math.floor((progress / TOTAL_CELLS) * AI_STEPS.length) + 1,
      );

  return (
    <figure>
      <div ref={rootRef} className={`${card} p-5 md:p-6`}>
        {/* Barra superior: archivo + selector antes/después */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-[color:var(--line)] pb-4">
          <div className="flex min-w-0 items-center gap-2 text-sm text-[color:var(--soft)]">
            <FileIcon className="h-5 w-5 shrink-0 text-[color:var(--muted)]" />
            <span className="truncate font-mono text-[13px]">{DEMO_FILE}</span>
          </div>

          <div
            role="group"
            aria-label="Estado de los datos"
            className="inline-flex rounded-[10px] border border-[color:var(--line)] bg-[color:var(--ink)] p-0.5 text-sm"
          >
            {[
              ["before", "Antes"],
              ["after", "Después"],
            ].map(([key, label]) => (
              <button
                key={key}
                type="button"
                aria-pressed={mode === key}
                onClick={() => (key === "before" ? reset() : play())}
                className={`rounded-lg px-3 py-1 font-medium transition-colors ${
                  mode === key
                    ? "bg-[rgba(255,255,255,0.09)] text-[color:var(--text)]"
                    : "text-[color:var(--muted)] hover:text-[color:var(--text)]"
                } ${focusRing}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto">
          <div
            role="table"
            aria-label="Ejemplo de datos antes y después de la limpieza"
            className="min-w-[300px] font-mono text-[13px]"
          >
            <div
              role="row"
              className={`${GRID} pb-2 text-[color:var(--muted)]`}
            >
              {COLUMNS.map((name, c) => (
                <div
                  key={name}
                  role="columnheader"
                  className={`px-1.5 ${c === COLS - 1 ? "text-right" : ""}`}
                >
                  {name}
                </div>
              ))}
            </div>

            {DEMO_ROWS.map((row, r) => {
              const start = r * COLS;
              // El duplicado se tacha y luego se pliega
              const collapsed = row.merged && progress >= start + COLS;
              return (
                <div
                  key={r}
                  role="presentation"
                  // El duplicado se atenúa en su lugar (si se plegara, el
                  // contenido de abajo subiría de golpe)
                  className={`transition-opacity duration-500 motion-reduce:transition-none ${
                    collapsed ? "opacity-35" : "opacity-100"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div
                      role="row"
                      className={`${GRID} border-t border-[color:var(--line)] py-1.5`}
                    >
                      {COLUMNS.map((name, c) => {
                        const cleaned = progress > start + c;
                        const value =
                          cleaned && !row.merged ? row.after[c] : row.before[c];
                        return (
                          <div
                            key={name}
                            role="cell"
                            className={`min-w-0 overflow-hidden text-ellipsis whitespace-pre rounded px-1.5 py-1 transition-colors duration-500 motion-reduce:transition-none ${
                              c === COLS - 1 ? "text-right" : ""
                            } ${cellTone(row, c, cleaned)}`}
                          >
                            {value}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* La IA trabajando: se asienta en "Limpieza lista en …". El espacio
            está reservado desde el inicio para que nada se recorra */}
        <div className="mt-5 min-h-[8.5rem] border-t border-[color:var(--line)] pt-4">
          {mode === "after" && (
            <ThoughtLine
              key={run}
              working={!done}
              label="Limpiando con IA…"
              doneLabel="Limpieza lista en"
              steps={AI_STEPS.slice(0, stepsShown)}
              color="#BCC1CB"
              glyphColor="#D4B27A"
              fontSize={13}
              collapseOnSettle={false}
            />
          )}
        </div>

        {/* Resumen */}
        <div
          aria-live="polite"
          className="mt-5 flex min-h-[64px] flex-wrap content-start items-center gap-2 sm:min-h-[28px]"
        >
          {done ? (
            <>
              <Chip tone="clean">{STATS.fixed} celdas corregidas</Chip>
              <Chip tone="clean">
                {STATS.merged}{" "}
                {STATS.merged === 1
                  ? "duplicado fusionado"
                  : "duplicados fusionados"}
              </Chip>
              <Chip tone="warn">{STATS.review} por revisar</Chip>
            </>
          ) : (
            <Chip tone="warn">{STATS.problems} celdas con problemas</Chip>
          )}
        </div>
      </div>

      <figcaption className="mt-3 text-sm text-[color:var(--muted)]">
        Ejemplo ilustrativo de cómo se transforman los datos.
      </figcaption>
    </figure>
  );
};

export default CleaningDemo;
