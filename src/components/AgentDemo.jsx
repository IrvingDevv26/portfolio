import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useContent } from "../lib/i18n";
import { card, focusRing } from "../lib/ui";
import StatusMark from "./reactbits/StatusMark";

/* Conversación de ejemplo de AgendaFlow para el caso de estudio de la landing:
   se reproduce sola al entrar en pantalla. A la izquierda el chat; a la derecha
   la agenda del jueves y las herramientas que ejecuta el agente, incluida una
   regla que el backend rechaza. Es una animación (sin IA real): la demo en vivo
   está en /demo/agenda. El guion y los textos están en AGENT_DEMO (content). */

const Bubble = ({ item }) => {
  const mine = item.kind === "user";
  return (
    <motion.p
      layout
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`max-w-[88%] rounded-2xl px-3.5 py-2 text-[14px] leading-relaxed ${
        mine
          ? "ml-auto rounded-br-md border border-[color:var(--accent-line)] bg-[rgba(212,178,122,0.16)] text-[color:var(--text)]"
          : "mr-auto rounded-bl-md border border-[color:var(--line)] bg-[color:var(--raised)] text-[color:var(--soft)]"
      }`}
    >
      {item.text}
    </motion.p>
  );
};

const Typing = () => (
  <motion.p
    layout
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    aria-hidden="true"
    className="mr-auto flex gap-1 rounded-2xl rounded-bl-md border border-[color:var(--line)] bg-[color:var(--raised)] px-3.5 py-3"
  >
    {[0, 1, 2].map((i) => (
      <motion.span
        key={i}
        className="h-1.5 w-1.5 rounded-full bg-[color:var(--muted)]"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
      />
    ))}
  </motion.p>
);

const AgentDemo = () => {
  const { AGENT_DEMO: demo } = useContent();
  const SCRIPT = demo.script;
  const CHECKED = SCRIPT.findIndex((s) => s.name === "ver_disponibilidad");
  const BOOKED = SCRIPT.findIndex((s) => s.name === "agendar_cita");
  const [step, setStep] = useState(0); // cuántos elementos del guion se ven
  const rootRef = useRef(null);
  const timer = useRef(null);
  const started = useRef(false);

  const runFrom = (from) => {
    clearTimeout(timer.current);
    setStep(from);
    const next = (n) => {
      if (n > SCRIPT.length) return;
      setStep(n);
      if (n < SCRIPT.length)
        timer.current = setTimeout(() => next(n + 1), SCRIPT[n - 1].wait);
    };
    timer.current = setTimeout(() => next(from + 1), 500);
  };

  // Se reproduce una vez al entrar en pantalla; sin animaciones, todo de golpe
  useEffect(() => {
    const el = rootRef.current;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (!el) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return;
        started.current = true;
        observer.disconnect();
        if (reduce) setStep(SCRIPT.length);
        else runFrom(0);
      },
      { threshold: 0.5 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      clearTimeout(timer.current);
    };
    // Una sola vez al montarse: al cambiar de idioma la página se monta de nuevo
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const shown = SCRIPT.slice(0, step);
  const messages = shown.filter((s) => s.kind !== "tool");
  const tools = shown
    .map((s, i) => ({ ...s, index: i }))
    .filter((s) => s.kind === "tool");
  const typing =
    step > 0 && step < SCRIPT.length && SCRIPT[step]?.kind === "agent";
  const checked = step > CHECKED + 1;
  const booked = step > BOOKED + 1;
  const done = step >= SCRIPT.length;

  return (
    <figure ref={rootRef} className={`${card} overflow-hidden`}>
      <header className="flex items-center gap-3 border-b border-[color:var(--line)] px-4 py-3">
        <span
          aria-hidden="true"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[color:var(--accent)] font-display text-xs font-semibold text-[color:var(--btn-ink)]"
        >
          DS
        </span>
        <div className="min-w-0 flex-1 text-sm">
          <p className="truncate font-medium text-[color:var(--text)]">
            {demo.clinic}
          </p>
          <p className="text-xs text-[color:var(--muted)]">
            {typing ? demo.typing : demo.role}
          </p>
        </div>
        <button
          type="button"
          onClick={() => runFrom(0)}
          disabled={!done}
          className={`rounded-md px-2 py-1 text-xs text-[color:var(--muted)] transition-colors hover:text-[color:var(--text)] disabled:opacity-0 ${focusRing}`}
        >
          {demo.replay}
        </button>
      </header>

      <div className="grid md:grid-cols-[1.15fr_1fr]">
        {/* Chat: los mensajes nuevos empujan a los viejos hacia arriba */}
        <div
          className="flex h-[23rem] flex-col justify-end gap-2 overflow-hidden px-4 py-4"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.035) 1px, transparent 1px)",
            backgroundSize: "18px 18px",
            // Los mensajes que suben se desvanecen en vez de cortarse de golpe
            maskImage: "linear-gradient(to bottom, transparent, #000 3rem)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent, #000 3rem)",
          }}
        >
          {messages.map((item) => (
            <Bubble key={item.text} item={item} />
          ))}
          <AnimatePresence>{typing && <Typing key="typing" />}</AnimatePresence>
        </div>

        {/* Lo que pasa detrás: agenda y herramientas */}
        <div className="border-t border-[color:var(--line)] bg-[color:var(--ink)] p-4 md:border-l md:border-t-0">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[color:var(--muted)]">
            {demo.day}
          </p>
          <ul className="mt-2 space-y-1">
            {demo.slots.map((slot) => {
              const mine = booked && slot.time === "16:00";
              const free = !slot.busy && !mine;
              return (
                <li
                  key={slot.time}
                  className={`flex items-center gap-2 rounded-md border px-2 py-1 text-[12px] transition-colors duration-500 ${
                    mine
                      ? "border-[color:var(--accent)] bg-[color:var(--accent-bg)] text-[color:var(--text)]"
                      : free && checked
                        ? "border-dashed border-[color:var(--accent-line)] text-[color:var(--soft)]"
                        : "border-transparent bg-[color:var(--glass)] text-[color:var(--muted)]"
                  }`}
                >
                  <span className="font-mono">{slot.time}</span>
                  <span className="truncate">
                    {mine
                      ? demo.booked
                      : (slot.busy ?? (checked ? demo.free : ""))}
                  </span>
                </li>
              );
            })}
          </ul>

          <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.16em] text-[color:var(--muted)]">
            {demo.tools}
          </p>
          <ul
            className="mt-2 min-h-[10.5rem] space-y-1.5"
            aria-label={demo.toolsLabel}
          >
            {tools.map((tool) => {
              const status =
                step > tool.index + 1
                  ? tool.ok
                    ? "done"
                    : "failed"
                  : "running";
              return (
                <motion.li
                  key={tool.name}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex gap-2 text-[12px]"
                >
                  <StatusMark
                    status={status}
                    size={16}
                    color="#D4B27A"
                    doneColor="#7BDDB5"
                    errorColor="#FF9AA8"
                    strike={false}
                  />
                  <span className="min-w-0">
                    <span className="font-mono text-[color:var(--text)]">
                      {tool.name}()
                    </span>
                    <span className="block text-[color:var(--muted)]">
                      {tool.detail}
                    </span>
                    {status === "failed" && (
                      <span className="block text-[color:var(--danger)]">
                        {demo.rule}: {tool.error}
                      </span>
                    )}
                  </span>
                </motion.li>
              );
            })}
          </ul>
        </div>
      </div>
      <figcaption className="border-t border-[color:var(--line)] px-4 py-2.5 text-xs text-[color:var(--muted)]">
        {demo.caption}
      </figcaption>
    </figure>
  );
};

export default AgentDemo;
