import {
  AnimatePresence,
  LayoutGroup,
  motion,
  MotionConfig,
} from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  CheckIcon,
  XIcon,
} from "../components/icons";
import BlurText from "../components/reactbits/BlurText";
import LatticeLoader from "../components/reactbits/LatticeLoader";
import ShinyText from "../components/reactbits/ShinyText";
import SpotlightCard from "../components/reactbits/SpotlightCard";
import Squares from "../components/reactbits/Squares";
import { Eyebrow } from "../components/shared";
import VideoButton from "../components/VideoButton";
import { AGENDA_PROJECT } from "../content";
import { useDocumentTitle } from "../lib/hooks";
import { btn, card, focusRing, iconBtn } from "../lib/ui";

/* Demo en vivo de AgendaFlow: un agente de IA que agenda, cambia y cancela
   citas de una clínica de ejemplo. A la izquierda el chat (estilo WhatsApp),
   a la derecha la agenda del negocio y las acciones que ejecutó el agente.
   El backend vive en otro repositorio (AgendaFlow, FastAPI). */

const API_URL = import.meta.env.VITE_AGENDA_API_URL ?? "";

const SUGGESTIONS = [
  "¿Qué servicios tienen y cuánto cuestan?",
  "Quiero una limpieza el jueves en la tarde",
  "¿Tienen estacionamiento?",
  "Quiero cambiar mi cita",
];

// Color de cada profesional en la agenda
const PRO_COLORS = ["#D4B27A", "#C9B6F2"];
const WEEKDAYS = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];

const MSG = {
  network:
    "No se pudo conectar con el servidor. Revisa tu conexión e inténtalo de nuevo.",
  generic: "Algo salió mal. Inténtalo de nuevo.",
  asleep:
    "El servidor de la demo no despertó a tiempo. Inténtalo de nuevo en un momento.",
};

const WAKE_TIMEOUT = 120_000; // un servidor gratuito tarda hasta ~1 minuto en despertar
const WAKE_RETRY = 3_000;

// Fechas como texto "AAAA-MM-DD" sin depender de la zona horaria del visitante
const addDays = (iso, days) => {
  const date = new Date(`${iso}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
};
const weekdayOf = (iso) => new Date(`${iso}T12:00:00Z`).getUTCDay();
const daysBetween = (from, to) =>
  Math.round(
    (new Date(`${to}T12:00:00Z`) - new Date(`${from}T12:00:00Z`)) / 864e5,
  );
const MONTHS = [
  "ene",
  "feb",
  "mar",
  "abr",
  "may",
  "jun",
  "jul",
  "ago",
  "sep",
  "oct",
  "nov",
  "dic",
];
const shortDate = (iso) =>
  `${Number(iso.slice(8, 10))} ${MONTHS[Number(iso.slice(5, 7)) - 1]}`;
const LAST_WEEK = 4; // se puede agendar hasta 30 días a futuro

// Las respuestas son texto plano; si el modelo usa **negritas** o viñetas, se limpian
const tidy = (text) =>
  text.replace(/\*\*(.+?)\*\*/g, "$1").replace(/^\s*[-*]\s+/gm, "• ");

// Ids de mensajes y acciones (sólo para las keys de React)
let lastId = 0;
const newId = () => ++lastId;
const message = (role, text) => ({ id: newId(), role, text });

async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
  } catch {
    throw Object.assign(new Error(MSG.network), { status: 0 });
  }
  // Mientras el servidor gratuito despierta, su proxy puede responder con una
  // página HTML en vez de JSON: se trata como "todavía no está listo"
  const json = (response.headers.get("content-type") || "").includes("json");
  const data = json ? await response.json().catch(() => ({})) : {};
  if (!response.ok || !json) {
    const detail = typeof data.detail === "string" ? data.detail : MSG.generic;
    throw Object.assign(new Error(detail), { status: response.status, json });
  }
  return data;
}

// Espera a que el backend responda /api/health (lo despierta si dormía)
async function wakeUp(onWaiting) {
  const started = Date.now();
  for (;;) {
    try {
      return await request("/api/health");
    } catch {
      if (Date.now() - started > WAKE_TIMEOUT) {
        throw Object.assign(new Error(MSG.asleep), { status: 503 });
      }
      onWaiting();
      await new Promise((resolve) => setTimeout(resolve, WAKE_RETRY));
    }
  }
}

/* ── Chat ─────────────────────────────────────────────────── */

const Bubble = ({ message }) => {
  if (message.role === "system") {
    return (
      <p className="mx-auto max-w-[90%] rounded-full border border-[color:var(--line)] bg-[color:var(--ink)] px-3 py-1.5 text-center text-xs text-[color:var(--muted)]">
        {message.text}
      </p>
    );
  }
  const mine = message.role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`max-w-[85%] whitespace-pre-line rounded-2xl px-3.5 py-2 text-[15px] leading-relaxed ${
        mine
          ? "ml-auto rounded-br-md border border-[color:var(--accent-line)] bg-[rgba(212,178,122,0.16)] text-[color:var(--text)]"
          : "mr-auto rounded-bl-md border border-[color:var(--line)] bg-[color:var(--raised)] text-[color:var(--soft)]"
      }`}
    >
      {mine ? message.text : tidy(message.text)}
    </motion.div>
  );
};

const Chat = ({
  business,
  messages,
  sending,
  remaining,
  onSend,
  onRestart,
  disabled,
}) => {
  const [text, setText] = useState("");
  const logRef = useRef(null);
  const inputRef = useRef(null);

  // Siempre muestra el último mensaje
  useEffect(() => {
    const log = logRef.current;
    if (log) log.scrollTop = log.scrollHeight;
  }, [messages, sending]);

  const submit = (value) => {
    const message = value.trim();
    if (!message || sending || disabled) return;
    onSend(message);
    setText("");
    inputRef.current?.focus();
  };

  const onlyGreeting = messages.filter((m) => m.role === "user").length === 0;

  return (
    <section
      aria-label="Chat con el asistente de la clínica"
      className={`${card} flex h-[36rem] flex-col overflow-hidden lg:h-[42rem]`}
    >
      <header className="flex items-center gap-3 border-b border-[color:var(--line)] px-4 py-3">
        <span
          aria-hidden="true"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[color:var(--accent)] font-display text-sm font-semibold text-[color:var(--btn-ink)]"
        >
          DS
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium text-[color:var(--text)]">
            {business?.nombre ?? "Clínica Dental Sonrisa"}
          </p>
          <p className="flex items-center gap-1.5 text-xs text-[color:var(--muted)]">
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 rounded-full bg-[color:var(--clean)]"
            />
            {sending ? "escribiendo…" : "en línea · asistente con IA"}
          </p>
        </div>
        <button
          type="button"
          onClick={onRestart}
          className={`${iconBtn} w-auto px-2.5 text-xs`}
        >
          Reiniciar
        </button>
      </header>

      <div
        ref={logRef}
        role="log"
        aria-live="polite"
        aria-label="Mensajes"
        className="flex-1 space-y-2.5 overflow-y-auto px-4 py-4"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.035) 1px, transparent 1px)",
          backgroundSize: "18px 18px",
        }}
      >
        {messages.map((message) => (
          <Bubble key={message.id} message={message} />
        ))}
        {sending && (
          <div className="mr-auto w-fit rounded-2xl rounded-bl-md border border-[color:var(--line)] bg-[color:var(--raised)] px-3.5 py-2.5 text-[color:var(--soft)]">
            <LatticeLoader
              label="Escribiendo"
              pattern="snake"
              color="#D4B27A"
              showTimer={false}
              fontSize={13}
              cellSize={5}
            />
          </div>
        )}
      </div>

      {onlyGreeting && !disabled && (
        <div className="flex gap-2 overflow-x-auto border-t border-[color:var(--line)] px-4 py-3">
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
        className="flex items-center gap-2 border-t border-[color:var(--line)] p-3"
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
          disabled={disabled}
          placeholder={disabled ? "Conectando…" : "Escribe como en WhatsApp…"}
          className={`min-w-0 flex-1 rounded-full border border-[color:var(--line-strong)] bg-[color:var(--ink)] px-4 py-2.5 text-[15px] text-[color:var(--text)] placeholder:text-[color:var(--muted)] focus:border-[color:var(--accent-line)] focus:outline-none disabled:opacity-60`}
        />
        <button
          type="submit"
          aria-label="Enviar"
          disabled={sending || disabled || !text.trim()}
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[color:var(--btn)] text-[color:var(--btn-ink)] transition hover:bg-[color:var(--btn-hover)] disabled:opacity-40 ${focusRing}`}
        >
          <ArrowUpIcon className="h-5 w-5" />
        </button>
      </form>
      {remaining !== null && (
        <p className="px-4 pb-2 text-right text-[11px] text-[color:var(--muted)]">
          {remaining} mensajes restantes en esta demo
        </p>
      )}
    </section>
  );
};

/* ── Agenda del negocio ───────────────────────────────────── */

const Calendar = ({ today, agenda, business, highlighted, week, onWeek }) => {
  const first = addDays(today, week * 7);
  const range = Array.from({ length: 7 }, (_, i) => addDays(first, i));
  // Los domingos la clínica cierra: 6 columnas caben sin scroll
  const days = range.filter((day) => weekdayOf(day) !== 0);
  const colorOf = (name) => {
    const index = (business?.profesionales ?? []).findIndex(
      (p) => p.nombre === name,
    );
    return PRO_COLORS[index] ?? "#BCC1CB";
  };

  return (
    <section aria-label="Agenda de la clínica" className={`${card} p-5`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-lg font-semibold">
          Agenda de la clínica
        </h2>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onWeek(week - 1)}
            disabled={week === 0}
            aria-label="Semana anterior"
            className={`${iconBtn} disabled:opacity-30`}
          >
            <ArrowLeftIcon className="h-4 w-4" />
          </button>
          <span className="min-w-[8.5rem] text-center text-sm text-[color:var(--soft)]">
            {week === 0
              ? "Esta semana"
              : `${shortDate(range[0])} – ${shortDate(range[6])}`}
          </span>
          <button
            type="button"
            onClick={() => onWeek(week + 1)}
            disabled={week === LAST_WEEK}
            aria-label="Semana siguiente"
            className={`${iconBtn} disabled:opacity-30`}
          >
            <ArrowRightIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
        <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[color:var(--muted)]">
          {(business?.profesionales ?? []).map((p) => (
            <li key={p.id} className="flex items-center gap-1.5">
              <span
                aria-hidden="true"
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: colorOf(p.nombre) }}
              />
              {p.nombre}
            </li>
          ))}
          <li className="flex items-center gap-1.5">
            <span
              aria-hidden="true"
              className="h-2 w-2 rounded-sm border border-[color:var(--accent)] bg-[color:var(--accent-bg)]"
            />
            Tus citas
          </li>
        </ul>
      </div>

      <div className="mt-4 overflow-x-auto">
        <LayoutGroup>
          <div className="grid min-w-[34rem] grid-cols-6 gap-2">
            {days.map((day) => {
              const weekday = weekdayOf(day);
              const items = agenda.filter((a) => a.inicio.slice(0, 10) === day);
              return (
                <div key={day} className="min-w-0">
                  <p className="mb-2 border-b border-[color:var(--line)] pb-1.5 text-center text-xs">
                    <span className="block font-mono uppercase tracking-wider text-[color:var(--muted)]">
                      {day === today ? "hoy" : WEEKDAYS[weekday]}
                    </span>
                    <span className="font-display text-base font-semibold text-[color:var(--text)]">
                      {Number(day.slice(8, 10))}
                    </span>
                  </p>
                  <ul className="space-y-1">
                    <AnimatePresence initial={false}>
                      {items.map((a) => {
                        const mine = a.origen === "agent";
                        const flash = highlighted.includes(a.codigo);
                        return (
                          <motion.li
                            key={a.codigo}
                            layout
                            layoutId={a.codigo}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{
                              opacity: 1,
                              scale: 1,
                              boxShadow: flash
                                ? [
                                    "0 0 0 0 rgba(212,178,122,0.7)",
                                    "0 0 0 6px rgba(212,178,122,0)",
                                  ]
                                : "0 0 0 0 rgba(212,178,122,0)",
                            }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{
                              duration: 0.35,
                              boxShadow: {
                                duration: 1.2,
                                repeat: flash ? 2 : 0,
                              },
                            }}
                            title={`${a.servicio} · ${a.profesional} · ${a.paciente}`}
                            className={`rounded-md border-l-2 px-1.5 py-1 text-[11px] leading-tight ${
                              mine
                                ? "border border-[color:var(--accent)] bg-[color:var(--accent-bg)] text-[color:var(--text)]"
                                : "bg-[color:var(--glass)] text-[color:var(--soft)]"
                            }`}
                            style={{
                              borderLeftColor: colorOf(a.profesional),
                            }}
                          >
                            <span className="font-mono">
                              {a.inicio.slice(11, 16)}
                            </span>{" "}
                            <span className="block truncate">
                              {mine
                                ? `${a.paciente} · ${a.servicio}`
                                : a.servicio}
                            </span>
                          </motion.li>
                        );
                      })}
                    </AnimatePresence>
                  </ul>
                </div>
              );
            })}
          </div>
        </LayoutGroup>
      </div>
      <p className="mt-3 text-xs text-[color:var(--muted)]">
        Las citas grises son de otros pacientes (ficticios). Cada visitante
        tiene su propia copia de la agenda. Domingos cerrado.
      </p>
    </section>
  );
};

const Actions = ({ actions }) => (
  <section aria-label="Acciones del agente" className={`${card} p-5`}>
    <h2 className="font-display text-lg font-semibold">
      Lo que hizo el agente
    </h2>
    {actions.length === 0 ? (
      <p className="mt-3 text-sm leading-relaxed text-[color:var(--muted)]">
        Aquí verás cada acción que ejecuta el agente detrás del chat: consultar
        horarios, agendar, cambiar o cancelar. Todas pasan por reglas del
        backend; la IA no puede saltárselas.
      </p>
    ) : (
      <ul className="mt-3 space-y-2">
        <AnimatePresence initial={false}>
          {actions.map((action) => (
            <motion.li
              key={action.id}
              layout
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex gap-3 rounded-xl border border-[color:var(--line)] bg-[color:var(--ink)] px-3 py-2.5"
            >
              <span
                aria-hidden="true"
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                  action.ok
                    ? "bg-[color:var(--clean-bg)] text-[color:var(--clean)]"
                    : "bg-[color:var(--danger-bg)] text-[color:var(--danger)]"
                }`}
              >
                {action.ok ? (
                  <CheckIcon className="h-3.5 w-3.5" />
                ) : (
                  <XIcon className="h-3.5 w-3.5" />
                )}
              </span>
              <div className="min-w-0 text-sm">
                <p className="font-medium text-[color:var(--text)]">
                  {action.etiqueta}
                  <span className="ml-2 font-mono text-[11px] font-normal text-[color:var(--muted)]">
                    {action.herramienta}()
                  </span>
                </p>
                {action.detalle && (
                  <p className="text-[color:var(--soft)]">{action.detalle}</p>
                )}
                {!action.ok && action.error && (
                  <p className="text-[color:var(--danger)]">
                    Regla del backend: {action.error}
                  </p>
                )}
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    )}
  </section>
);

/* ── Página ───────────────────────────────────────────────── */

const FACTS = [
  "Clínica de ejemplo",
  "Usa datos inventados",
  "Agenda, cambia y cancela",
  "Reglas validadas en el backend",
];

const AgendaLab = () => {
  useDocumentTitle("AgendaFlow — Demo en vivo · Irving Dávila");

  const [status, setStatus] = useState("connecting"); // connecting | ready | error
  const [slow, setSlow] = useState(false); // el servidor gratuito está despertando
  const [connectError, setConnectError] = useState("");
  const [session, setSession] = useState(null); // { id, negocio, ahora }
  const [messages, setMessages] = useState([]);
  const [agenda, setAgenda] = useState([]);
  const [actions, setActions] = useState([]);
  const [highlighted, setHighlighted] = useState([]);
  const [remaining, setRemaining] = useState(null);
  const [sending, setSending] = useState(false);
  const [week, setWeek] = useState(0); // semana visible en la agenda (0 = esta)

  // Crea una conversación nueva. El estado sólo cambia en callbacks (cuando el
  // servidor responde o cuando tarda), así se puede llamar desde el efecto inicial
  const connect = useCallback(() => {
    const timer = setTimeout(() => setSlow(true), 4000);
    const opened = (data) => {
      setSession({
        id: data.session_id,
        negocio: data.negocio,
        ahora: data.ahora,
      });
      setMessages([message("agent", data.saludo)]);
      setAgenda(data.agenda);
      setActions([]);
      setHighlighted([]);
      setRemaining(data.mensajes_restantes);
      setWeek(0);
      setStatus("ready");
    };
    const failed = (error) => {
      setConnectError(error.message);
      setStatus("error");
    };
    return wakeUp(() => setSlow(true))
      .then(() => request("/api/agenda/sessions", { method: "POST" }))
      .then(opened, failed)
      .finally(() => {
        clearTimeout(timer);
        setSlow(false);
      });
  }, []);

  useEffect(() => {
    connect();
  }, [connect]);

  // "Reiniciar" y "Reintentar": vuelve al estado de conexión y empieza otra
  const restart = () => {
    setStatus("connecting");
    setConnectError("");
    connect();
  };

  const send = async (text) => {
    if (!session || sending) return;
    setMessages((list) => [...list, message("user", text)]);
    setSending(true);
    try {
      const data = await request(
        `/api/agenda/sessions/${session.id}/messages`,
        {
          method: "POST",
          body: JSON.stringify({ message: text }),
        },
      );
      setMessages((list) => [...list, message("agent", data.respuesta)]);
      setAgenda(data.agenda);
      setRemaining(data.mensajes_restantes);
      const fresh = data.acciones.map((a) => ({ ...a, id: newId() }));
      setActions((list) => [...fresh.reverse(), ...list].slice(0, 12));
      const codes = fresh.map((a) => a.codigo).filter(Boolean);
      setHighlighted(codes);
      // Muestra la semana de la cita que el agente acaba de crear o mover
      const touched = data.agenda.find((a) => codes.includes(a.codigo));
      if (touched && session.ahora) {
        const offset = daysBetween(
          session.ahora.slice(0, 10),
          touched.inicio.slice(0, 10),
        );
        setWeek(Math.min(LAST_WEEK, Math.max(0, Math.floor(offset / 7))));
      }
    } catch (error) {
      const text =
        error.status === 404
          ? "La conversación expiró. Pulsa «Reiniciar» para empezar otra."
          : error.message;
      setMessages((list) => [...list, message("system", text)]);
    } finally {
      setSending(false);
    }
  };

  const today = session?.ahora?.slice(0, 10);

  return (
    <MotionConfig reducedMotion="user">
      <div className="grain font-body min-h-screen bg-[color:var(--ink)] text-[color:var(--text)]">
        <header className="relative z-10 border-b border-[color:var(--line)] bg-[color:var(--ink)]/80 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-10">
            <Link
              to="/"
              className={`inline-flex items-center gap-2 rounded-md text-sm text-[color:var(--muted)] transition-colors hover:text-[color:var(--text)] ${focusRing}`}
            >
              <ArrowLeftIcon className="h-4 w-4" /> Volver al portfolio
            </Link>
            <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--line)] bg-[color:var(--glass)] px-3 py-1 text-xs font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--clean)]" />
              <ShinyText text="Demo en vivo" />
            </span>
          </div>
        </header>

        <main className="relative isolate overflow-hidden">
          <div className="relative isolate">
            <Squares className="-z-10" squareSize={48} speed={0.25} />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -z-10"
              style={{
                backgroundImage:
                  "radial-gradient(45% 60% at 85% 0%, rgba(212,178,122,0.12) 0%, rgba(212,178,122,0) 70%), linear-gradient(to bottom, rgba(8,9,12,0) 55%, #08090C 100%)",
              }}
            />
            <div className="mx-auto max-w-6xl px-6 pb-6 pt-12 md:px-10 md:pt-16">
              <Eyebrow>AgendaFlow</Eyebrow>
              <BlurText
                as="h1"
                text="Un agente de IA que agenda citas por ti."
                className="balance mt-4 max-w-3xl font-display text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl"
              />
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[color:var(--soft)]">
                Escríbele como a WhatsApp: consulta horarios, agenda, cambia o
                cancela. A la derecha ves la agenda de la clínica actualizarse y
                cada acción que ejecuta el agente.
              </p>
              <ul className="mt-6 flex flex-wrap gap-2" aria-label="Detalles">
                {FACTS.map((fact) => (
                  <li
                    key={fact}
                    className="inline-flex items-center gap-2 rounded-full border border-[color:var(--line)] bg-[color:var(--ink)]/70 px-3 py-1 text-xs text-[color:var(--soft)] backdrop-blur"
                  >
                    <CheckIcon className="h-3.5 w-3.5 text-[color:var(--accent)]" />
                    {fact}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mx-auto max-w-6xl px-6 pb-16 pt-6 md:px-10 md:pb-24">
            {status !== "ready" ? (
              <div
                className={`${card} flex flex-col items-center gap-4 px-6 py-16 text-center`}
              >
                {status === "connecting" ? (
                  <>
                    <div className="text-[color:var(--soft)]">
                      <LatticeLoader
                        label={slow ? "Despertando el servidor" : "Conectando"}
                        pattern="orbit"
                        color="#D4B27A"
                      />
                    </div>
                    {slow && (
                      <p className="max-w-md text-sm text-[color:var(--muted)]">
                        El servidor gratuito se duerme cuando nadie lo usa; la
                        primera vez puede tardar hasta un minuto.
                      </p>
                    )}
                  </>
                ) : (
                  <>
                    <p className="max-w-md text-[color:var(--danger)]">
                      {connectError}
                    </p>
                    <button
                      type="button"
                      onClick={restart}
                      className={btn("primary")}
                    >
                      Reintentar
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,25rem)_minmax(0,1fr)]">
                <Chat
                  business={session.negocio}
                  messages={messages}
                  sending={sending}
                  remaining={remaining}
                  onSend={send}
                  onRestart={restart}
                  disabled={status !== "ready"}
                />
                <div className="min-w-0 space-y-6">
                  <Calendar
                    today={today}
                    agenda={agenda}
                    business={session.negocio}
                    highlighted={highlighted}
                    week={week}
                    onWeek={setWeek}
                  />
                  <Actions actions={actions} />
                </div>
              </div>
            )}

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <SpotlightCard className={`${card} p-6`}>
                <h2 className="font-display text-lg font-semibold">
                  Qué hay detrás
                </h2>
                <ul className="mt-4 space-y-3 text-sm text-[color:var(--soft)]">
                  {AGENDA_PROJECT.highlights.map((item) => (
                    <li key={item} className="flex gap-3">
                      <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--accent)]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </SpotlightCard>

              <SpotlightCard className={`${card} p-6`}>
                <h2 className="font-display text-lg font-semibold">
                  En tu negocio
                </h2>
                <ul className="mt-4 space-y-3 text-sm text-[color:var(--soft)]">
                  {AGENDA_PROJECT.forBusiness.map((item) => (
                    <li key={item} className="flex gap-3">
                      <ArrowRightIcon className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--accent)]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </SpotlightCard>

              <SpotlightCard className={`${card} flex flex-col p-6`}>
                <h2 className="font-display text-lg font-semibold">
                  ¿Lo quieres para tu negocio?
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-[color:var(--soft)]">
                  Consultorios, salones, talleres o despachos: lo adapto a tus
                  servicios, horarios y equipo, y lo conecto a tu WhatsApp.
                </p>
                <div className="mt-auto flex flex-wrap gap-2 pt-6">
                  <Link to="/#contacto" className={btn("primary", "sm")}>
                    Platiquemos <ArrowRightIcon className="h-4 w-4" />
                  </Link>
                  <VideoButton
                    url={AGENDA_PROJECT.video}
                    label="Ver el video"
                    size="sm"
                  />
                </div>
              </SpotlightCard>
            </div>
          </div>
        </main>
      </div>
    </MotionConfig>
  );
};

export default AgendaLab;
