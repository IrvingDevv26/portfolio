import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { btn, card, focusRing, iconBtn } from "../../lib/ui";
import { ArrowUpIcon, CheckIcon, XIcon } from "../icons";
import LatticeLoader from "../reactbits/LatticeLoader";

/* Chat con el asistente de la clínica, al estilo WhatsApp. Entre los mensajes
   aparecen las herramientas que ejecutó el agente para responder. Mientras el
   backend se conecta (o si falla), el mismo recuadro muestra el estado, así la
   página no cambia de tamaño. */

const SUGGESTIONS = [
  "¿Qué servicios tienen y cuánto cuestan?",
  "Quiero una limpieza el jueves en la tarde",
  "¿Tienen estacionamiento?",
  "Quiero cambiar mi cita",
];

// Las respuestas son texto plano; si el modelo usa **negritas** o viñetas, se limpian
const tidy = (text) =>
  text.replace(/\*\*(.+?)\*\*/g, "$1").replace(/^\s*[-*]\s+/gm, "• ");

const DoubleCheck = ({ className }) => (
  <svg
    viewBox="0 0 18 12"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-label="Leído"
    className={className}
  >
    <path d="M1 6.5l3.2 3.2L11 2.5" />
    <path d="M7.6 9.3l.4.4L17 2.5" />
  </svg>
);

const Bubble = ({ message }) => {
  if (message.role === "system") {
    return (
      <p
        data-role="system"
        className="mx-auto max-w-[90%] rounded-xl border border-[color:var(--line)] bg-[color:var(--ink)] px-3 py-1.5 text-center text-xs text-[color:var(--muted)]"
      >
        {message.text}
      </p>
    );
  }
  const mine = message.role === "user";
  return (
    <motion.div
      data-role={message.role}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`max-w-[85%] whitespace-pre-line rounded-2xl px-3.5 pb-1.5 pt-2 text-[15px] leading-relaxed ${
        mine
          ? "ml-auto rounded-br-md border border-[color:var(--accent-line)] bg-[rgba(212,178,122,0.16)] text-[color:var(--text)]"
          : "mr-auto rounded-bl-md border border-[color:var(--line)] bg-[color:var(--raised)] text-[color:var(--soft)]"
      }`}
    >
      {mine ? message.text : tidy(message.text)}
      <span className="float-right ml-3 mt-2 inline-flex items-center gap-1 font-mono text-[10px] leading-none text-[color:var(--muted)]">
        {message.time}
        {mine && <DoubleCheck className="h-3 w-4 text-[color:var(--accent)]" />}
      </span>
    </motion.div>
  );
};

// Herramienta que ejecutó el agente, entre los mensajes
const ToolChip = ({ action, onShow }) => (
  <motion.div
    data-role="tool"
    initial={{ opacity: 0, scale: 0.96 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.25 }}
    className={`mx-auto flex max-w-[92%] items-start gap-2 rounded-xl border px-3 py-1.5 text-[12px] leading-snug ${
      action.ok
        ? "border-[color:var(--clean-line)] bg-[color:var(--clean-bg)] text-[color:var(--soft)]"
        : "border-[color:var(--danger-line)] bg-[color:var(--danger-bg)] text-[color:var(--danger)]"
    }`}
  >
    <span aria-hidden="true" className="mt-px shrink-0">
      {action.ok ? (
        <CheckIcon className="h-3.5 w-3.5 text-[color:var(--clean)]" />
      ) : (
        <XIcon className="h-3.5 w-3.5" />
      )}
    </span>
    <span className="min-w-0">
      <span className="font-medium text-[color:var(--text)]">
        {action.etiqueta}
      </span>
      {action.codigo && (
        <span className="font-mono text-[color:var(--muted)]">
          {" "}
          · {action.codigo}
        </span>
      )}
      {!action.ok && action.error && (
        <span className="block">Regla: {action.error}</span>
      )}
    </span>
    {action.ok && action.codigo && onShow && (
      <button
        type="button"
        onClick={onShow}
        className={`ml-1 shrink-0 rounded font-medium text-[color:var(--accent)] underline-offset-2 hover:underline lg:hidden ${focusRing}`}
      >
        Ver
      </button>
    )}
  </motion.div>
);

const Typing = () => (
  <motion.div
    initial={{ opacity: 0, y: 6 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0 }}
    aria-label="El asistente está escribiendo"
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
  </motion.div>
);

const Chat = ({
  business,
  status,
  slow,
  error,
  messages,
  sending,
  remaining,
  onSend,
  onRestart,
  onShowAgenda,
}) => {
  const [text, setText] = useState("");
  const logRef = useRef(null);
  const inputRef = useRef(null);
  const ready = status === "ready";

  // Siempre muestra el último mensaje
  useEffect(() => {
    const log = logRef.current;
    if (log) log.scrollTop = log.scrollHeight;
  }, [messages, sending]);

  const submit = (value) => {
    const message = value.trim();
    if (!message || sending || !ready) return;
    onSend(message);
    setText("");
    inputRef.current?.focus();
  };

  const onlyGreeting = ready && !messages.some((m) => m.role === "user");

  return (
    <section
      aria-label="Chat con el asistente de la clínica"
      className={`${card} flex h-[min(40rem,calc(100svh_-_5rem))] min-h-[30rem] flex-col overflow-hidden lg:h-[min(46rem,calc(100vh_-_3rem))]`}
    >
      <header className="flex items-center gap-3 border-b border-[color:var(--line)] px-4 py-3">
        <span
          aria-hidden="true"
          className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[color:var(--accent)] font-display text-sm font-semibold text-[color:var(--btn-ink)]"
        >
          DS
          <span
            className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[color:var(--raised)] ${
              ready ? "bg-[color:var(--clean)]" : "bg-[color:var(--faint)]"
            }`}
          />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium text-[color:var(--text)]">
            {business?.nombre ?? "Clínica Dental Sonrisa"}
          </p>
          <p className="text-xs text-[color:var(--muted)]">
            {!ready
              ? status === "error"
                ? "sin conexión"
                : "conectando…"
              : sending
                ? "escribiendo…"
                : "en línea · asistente con IA"}
          </p>
        </div>
        <button
          type="button"
          onClick={onRestart}
          disabled={status === "connecting"}
          className={`${iconBtn} w-auto px-2.5 text-xs disabled:opacity-40`}
        >
          Reiniciar
        </button>
      </header>

      <div
        ref={logRef}
        role="log"
        aria-live="polite"
        aria-label="Mensajes"
        className="flex flex-1 flex-col gap-2.5 overflow-y-auto px-3 py-4 sm:px-4"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.035) 1px, transparent 1px)",
          backgroundSize: "18px 18px",
        }}
      >
        {messages.length > 0 ? (
          <>
            <p className="mx-auto rounded-md border border-[color:var(--line)] bg-[color:var(--ink)] px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-[color:var(--muted)]">
              Hoy
            </p>
            {messages.map((m) =>
              m.role === "tool" ? (
                <ToolChip key={m.id} action={m.action} onShow={onShowAgenda} />
              ) : (
                <Bubble key={m.id} message={m} />
              ),
            )}
            <AnimatePresence>
              {sending && <Typing key="typing" />}
            </AnimatePresence>
          </>
        ) : (
          <div className="m-auto flex max-w-xs flex-col items-center gap-4 text-center">
            {status === "error" ? (
              <>
                <p className="text-sm leading-relaxed text-[color:var(--danger)]">
                  {error}
                </p>
                <button
                  type="button"
                  onClick={onRestart}
                  className={btn("primary", "sm")}
                >
                  Reintentar
                </button>
              </>
            ) : (
              <>
                <div className="text-[color:var(--soft)]">
                  <LatticeLoader
                    label={slow ? "Despertando el servidor" : "Conectando"}
                    pattern="orbit"
                    color="#D4B27A"
                  />
                </div>
                <p
                  className={`text-sm leading-relaxed text-[color:var(--muted)] transition-opacity ${
                    slow ? "opacity-100" : "opacity-0"
                  }`}
                >
                  El servidor gratuito se duerme cuando nadie lo usa; la primera
                  vez puede tardar hasta un minuto.
                </p>
              </>
            )}
          </div>
        )}
      </div>

      {onlyGreeting && (
        <div
          className="flex gap-2 overflow-x-auto border-t border-[color:var(--line)] px-4 py-3 [scrollbar-width:none]"
          style={{
            maskImage: "linear-gradient(to right, #000 85%, transparent)",
            WebkitMaskImage: "linear-gradient(to right, #000 85%, transparent)",
          }}
        >
          {SUGGESTIONS.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => submit(suggestion)}
              disabled={sending}
              className={`shrink-0 rounded-full border border-[color:var(--line-strong)] px-3 py-1.5 text-xs text-[color:var(--soft)] transition-colors hover:border-[color:var(--accent-line)] hover:text-[color:var(--text)] ${focusRing}`}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit(text);
        }}
        className="flex items-center gap-2 border-t border-[color:var(--line)] px-3 pb-1 pt-3"
      >
        <label htmlFor="agenda-message" className="sr-only">
          Escribe un mensaje
        </label>
        <input
          id="agenda-message"
          ref={inputRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={500}
          autoComplete="off"
          disabled={!ready}
          placeholder={ready ? "Escribe como en WhatsApp…" : "Conectando…"}
          className="min-w-0 flex-1 rounded-full border border-[color:var(--line-strong)] bg-[color:var(--ink)] px-4 py-2.5 text-[15px] text-[color:var(--text)] placeholder:text-[color:var(--muted)] focus:border-[color:var(--accent-line)] focus:outline-none disabled:opacity-60"
        />
        <button
          type="submit"
          aria-label="Enviar"
          disabled={sending || !ready || !text.trim()}
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[color:var(--btn)] text-[color:var(--btn-ink)] transition hover:bg-[color:var(--btn-hover)] disabled:opacity-40 ${focusRing}`}
        >
          <ArrowUpIcon className="h-5 w-5" />
        </button>
      </form>
      <p
        className={`px-4 pb-2 pt-1 text-right text-[11px] ${
          remaining !== null && remaining <= 5
            ? "text-[color:var(--warn)]"
            : "text-[color:var(--muted)]"
        }`}
      >
        {remaining !== null
          ? `${remaining} mensajes restantes en esta demo`
          : " "}
      </p>
    </section>
  );
};

export default Chat;
