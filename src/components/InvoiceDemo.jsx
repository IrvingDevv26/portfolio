import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useContent } from "../lib/i18n";
import { card, focusRing, STATE_CHIP, TONE_COLOR } from "../lib/ui";
import { DownloadIcon, FileIcon } from "./icons";
import StatusMark from "./reactbits/StatusMark";

/* Revisión de FacturaCheck para el caso de estudio de la landing: al entrar en
   pantalla, las facturas de un ZIP se consultan en el SAT unas tras otras (varias
   a la vez, como en el backend) y cada una termina con su estatus y sus alertas.
   Es una animación (sin SAT real): la demo en vivo está en /demo/cfdi. Las
   facturas y los textos están en FACTURA_DEMO (content). */

const LEAD = 400; // ms antes de la primera consulta
const GAP = 380; // ms entre el inicio de una consulta y la siguiente
const CHECK = 900; // ms que tarda cada consulta
const TICK = 80;

const Status = ({ status, row, words }) => {
  if (status === "queued") {
    return (
      <span className="text-xs text-[color:var(--faint)]">{words.queued}</span>
    );
  }
  if (status === "running") {
    return (
      <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-xs text-[color:var(--accent)]">
        <StatusMark status="running" size={14} color="#D4B27A" />
        <span className="hidden sm:inline">{words.checking}</span>
      </span>
    );
  }
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25 }}
      className={`inline-flex whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-medium ${STATE_CHIP[row.state]}`}
    >
      {words.states[row.state]}
    </motion.span>
  );
};

const InvoiceDemo = () => {
  const { FACTURA_DEMO: words } = useContent();
  const rows = words.rows;
  const total = LEAD + (rows.length - 1) * GAP + CHECK;
  const [elapsed, setElapsed] = useState(-1); // -1: todavía no empieza
  const rootRef = useRef(null);
  const timer = useRef(null);

  const play = () => {
    clearInterval(timer.current);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setElapsed(total);
      return;
    }
    const started = performance.now();
    setElapsed(0);
    timer.current = setInterval(() => {
      const ms = performance.now() - started;
      setElapsed(Math.min(ms, total));
      if (ms >= total) clearInterval(timer.current);
    }, TICK);
  };

  // Se reproduce una vez al entrar en pantalla
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        play();
      },
      { threshold: 0.45 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      clearInterval(timer.current);
    };
    // Una sola vez al montarse: al cambiar de idioma la página se monta de nuevo
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const statusOf = (i) => {
    const start = LEAD + i * GAP;
    if (elapsed < start) return "queued";
    if (elapsed < start + CHECK) return "running";
    return "done";
  };
  const checked = rows.filter((_, i) => statusOf(i) === "done").length;
  const done = elapsed >= total;
  const flagged = rows.filter((row) => row.state !== "active" || row.alert);

  return (
    <figure ref={rootRef} className={`${card} overflow-hidden`}>
      <header className="flex items-center gap-3 border-b border-[color:var(--line)] px-4 py-3">
        <span
          aria-hidden="true"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[color:var(--accent-bg)] text-[color:var(--accent)]"
        >
          <FileIcon className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1 text-sm">
          <p className="truncate font-medium text-[color:var(--text)]">
            {words.file}
          </p>
          <p className="font-mono text-xs tabular-nums text-[color:var(--muted)]">
            {words.files(rows.length)} · {checked}/{rows.length}
          </p>
        </div>
        <button
          type="button"
          onClick={play}
          disabled={!done}
          className={`rounded-md px-2 py-1 text-xs text-[color:var(--muted)] transition-colors hover:text-[color:var(--text)] disabled:opacity-0 ${focusRing}`}
        >
          {words.replay}
        </button>
      </header>

      {/* Avance de la revisión */}
      <div aria-hidden="true" className="h-0.5 bg-[color:var(--line)]">
        <div
          className="h-full bg-[color:var(--accent)] transition-[width] duration-300"
          style={{ width: `${(checked / rows.length) * 100}%` }}
        />
      </div>

      <ul
        aria-label={words.listLabel}
        aria-busy={!done}
        className="divide-y divide-[color:var(--line)]"
      >
        {rows.map((row, i) => {
          const status = statusOf(i);
          return (
            <li
              // Una factura puede venir dos veces (duplicada): la clave es la posición
              key={i}
              className={`flex items-center gap-3 px-4 py-2.5 transition-colors duration-500 ${
                status === "running" ? "bg-[color:var(--accent-bg)]" : ""
              }`}
            >
              <span className="hidden w-[4.5rem] shrink-0 font-mono text-[12px] text-[color:var(--text)] sm:block">
                {row.number}
              </span>
              <span className="min-w-0 flex-1">
                {/* En pantallas angostas el folio va arriba del emisor */}
                <span className="block font-mono text-[11px] text-[color:var(--text)] sm:hidden">
                  {row.number}
                </span>
                <span className="block truncate text-[13px] text-[color:var(--soft)]">
                  {row.issuer}
                </span>
                {row.alert && (
                  <span
                    className="mt-0.5 flex items-center gap-1.5 text-[11px] font-medium transition-opacity duration-300"
                    style={{
                      color: TONE_COLOR[row.tone],
                      opacity: status === "done" ? 1 : 0,
                    }}
                  >
                    <span
                      aria-hidden="true"
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: TONE_COLOR[row.tone] }}
                    />
                    {row.alert}
                  </span>
                )}
              </span>
              <span className="hidden shrink-0 font-mono text-[12px] tabular-nums text-[color:var(--muted)] sm:block">
                {row.amount}
              </span>
              <span className="flex w-[6.5rem] shrink-0 justify-end sm:w-[8.5rem]">
                <Status status={status} row={row} words={words} />
              </span>
            </li>
          );
        })}
      </ul>

      {/* Resumen al terminar: el mismo alto antes y después, sin saltos */}
      <div className="flex min-h-[3.25rem] flex-wrap items-center justify-between gap-2 border-t border-[color:var(--line)] bg-[color:var(--ink)] px-4 py-3">
        <p
          className="text-sm font-medium text-[color:var(--text)] transition-opacity duration-500"
          style={{ opacity: done ? 1 : 0 }}
        >
          {words.summary(rows.length, flagged.length)}
        </p>
        <span
          className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--clean-line)] bg-[color:var(--clean-bg)] px-2.5 py-1 text-xs font-medium text-[color:var(--clean)] transition-all duration-500"
          style={{
            opacity: done ? 1 : 0,
            transform: done ? "none" : "translateY(4px)",
          }}
        >
          <DownloadIcon className="h-3.5 w-3.5" />
          {words.excel}
        </span>
      </div>
      <figcaption className="border-t border-[color:var(--line)] px-4 py-2.5 text-xs text-[color:var(--muted)]">
        {words.caption}
      </figcaption>
    </figure>
  );
};

export default InvoiceDemo;
