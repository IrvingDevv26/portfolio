import { motion, MotionConfig } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import ActionLog from "../components/agenda/ActionLog";
import Chat from "../components/agenda/Chat";
import { ClinicCard, ClinicDetails } from "../components/agenda/ClinicCard";
import { daysBetween, minutesOf, timeNow } from "../components/agenda/dates";
import WeekCalendar, { LAST_WEEK } from "../components/agenda/WeekCalendar";
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon } from "../components/icons";
import BlurText from "../components/reactbits/BlurText";
import ShinyText from "../components/reactbits/ShinyText";
import SpotlightCard from "../components/reactbits/SpotlightCard";
import Squares from "../components/reactbits/Squares";
import { Eyebrow } from "../components/shared";
import VideoButton from "../components/VideoButton";
import { AGENDA_PROJECT } from "../content";
import { useDocumentTitle, useMediaQuery } from "../lib/hooks";
import { btn, card, focusRing } from "../lib/ui";

/* Demo en vivo de AgendaFlow: un agente de IA que agenda, cambia y cancela
   citas de una clínica de ejemplo. El chat (estilo WhatsApp) va junto a la
   agenda del negocio y la bitácora de acciones del agente; en móvil se cambia
   entre los tres con pestañas. El backend vive en otro repositorio
   (AgendaFlow, FastAPI). */

const API_URL = import.meta.env.VITE_AGENDA_API_URL ?? "";

const MSG = {
  network:
    "No se pudo conectar con el servidor. Revisa tu conexión e inténtalo de nuevo.",
  generic: "Algo salió mal. Inténtalo de nuevo.",
  asleep:
    "El servidor de la demo no despertó a tiempo. Inténtalo de nuevo en un momento.",
};

const WAKE_TIMEOUT = 120_000; // un servidor gratuito tarda hasta ~1 minuto en despertar
const WAKE_RETRY = 3_000;

// Ids de mensajes y acciones (sólo para las keys de React)
let lastId = 0;
const newId = () => ++lastId;
const message = (role, text) => ({ id: newId(), role, text, time: timeNow() });

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

const FACTS = [
  "Clínica de ejemplo",
  "Usa datos inventados",
  "Agenda, cambia y cancela",
  "Reglas validadas en el backend",
];

// Pestañas del área de trabajo en pantallas angostas
const TABS = [
  ["chat", "Chat"],
  ["agenda", "Agenda"],
  ["acciones", "Acciones"],
];

const AgendaLab = () => {
  useDocumentTitle("AgendaFlow — Demo en vivo · Irving Dávila");
  const desktop = useMediaQuery("(min-width: 1024px)");

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
  const [day, setDay] = useState(null); // día visible en móvil
  const [now, setNow] = useState(null); // minutos desde medianoche, hora de la clínica
  const [tab, setTab] = useState("chat");
  const [unseen, setUnseen] = useState({ agenda: 0, acciones: 0 });
  const tabRef = useRef("chat");
  const workspaceRef = useRef(null);

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
      setDay(null);
      setNow(minutesOf(data.ahora));
      setUnseen({ agenda: 0, acciones: 0 });
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

  // El reloj de la clínica avanza para mover la línea de "ahora" en la agenda
  useEffect(() => {
    const id = setInterval(
      () => setNow((minutes) => (minutes === null ? minutes : minutes + 1)),
      60_000,
    );
    return () => clearInterval(id);
  }, []);

  // "Reiniciar" y "Reintentar": vuelve al estado de conexión y empieza otra
  const restart = () => {
    setStatus("connecting");
    setConnectError("");
    setMessages([]);
    connect();
  };

  const selectTab = (next) => {
    tabRef.current = next;
    setTab(next);
    setUnseen((counts) => ({ ...counts, [next]: 0 }));
    // Si ya se bajó por la página, vuelve al inicio del área de trabajo
    const area = workspaceRef.current;
    if (!area) return;
    const top = area.getBoundingClientRect().top + window.scrollY;
    if (window.scrollY > top) window.scrollTo({ top, behavior: "smooth" });
  };

  const changeWeek = (next) => {
    setWeek(next);
    setDay(null);
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
      const time = timeNow();
      const fresh = data.acciones.map((a) => ({ ...a, id: newId(), time }));
      // Las herramientas se ven en el chat antes de la respuesta del agente
      setMessages((list) => [
        ...list,
        ...fresh.map((action) => ({ id: newId(), role: "tool", action })),
        message("agent", data.respuesta),
      ]);
      setAgenda(data.agenda);
      setRemaining(data.mensajes_restantes);
      setActions((list) => [...[...fresh].reverse(), ...list].slice(0, 12));
      const codes = fresh
        .filter((a) => a.ok)
        .map((a) => a.codigo)
        .filter(Boolean);
      setHighlighted(codes);
      setUnseen((counts) => ({
        agenda:
          codes.length && tabRef.current !== "agenda"
            ? counts.agenda + 1
            : counts.agenda,
        acciones:
          tabRef.current !== "acciones"
            ? counts.acciones + fresh.length
            : counts.acciones,
      }));
      // Lleva la agenda al día de la cita que el agente acaba de crear o mover
      const touched = data.agenda.find((a) => codes.includes(a.codigo));
      if (touched && session.ahora) {
        const date = touched.inicio.slice(0, 10);
        const offset = daysBetween(session.ahora.slice(0, 10), date);
        setWeek(Math.min(LAST_WEEK, Math.max(0, Math.floor(offset / 7))));
        setDay(date);
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

  const business = session?.negocio;
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

        {/* overflow-x-clip (y no hidden) para que las pestañas puedan quedarse fijas */}
        <main className="relative isolate overflow-x-clip">
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
            <div className="mx-auto max-w-6xl px-6 pb-6 pt-12 md:px-10 md:pt-16 lg:grid lg:grid-cols-[minmax(0,1fr)_21rem] lg:items-end lg:gap-12">
              <div>
                <Eyebrow>AgendaFlow</Eyebrow>
                <BlurText
                  as="h1"
                  text="Un agente de IA que agenda citas por ti."
                  className="balance mt-4 max-w-3xl font-display text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl"
                />
                <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[color:var(--soft)]">
                  Escríbele como a WhatsApp: consulta horarios, agenda, cambia o
                  cancela. Mientras conversan, la agenda de la clínica se
                  actualiza y ves cada acción que ejecuta el agente.
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
                <ClinicDetails business={business} className="mt-6 lg:hidden" />
              </div>
              <ClinicCard business={business} className="hidden lg:block" />
            </div>
          </div>

          <div
            ref={workspaceRef}
            className="mx-auto max-w-6xl scroll-mt-2 px-6 pb-16 pt-4 md:px-10 md:pb-24 lg:pt-6"
          >
            {/* Pestañas (sólo en pantallas angostas) */}
            {!desktop && (
              <div className="sticky top-0 z-20 -mx-6 mb-4 bg-[color:var(--ink)]/85 px-6 py-2 backdrop-blur md:-mx-10 md:px-10">
                <div
                  role="group"
                  aria-label="Vista de la demo"
                  className="grid grid-cols-3 gap-1 rounded-xl border border-[color:var(--line)] bg-[color:var(--raised)] p-1"
                >
                  {TABS.map(([key, label]) => (
                    <button
                      key={key}
                      type="button"
                      aria-pressed={tab === key}
                      onClick={() => selectTab(key)}
                      className={`relative flex items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-medium transition-colors ${focusRing} ${
                        tab === key
                          ? "text-[color:var(--btn-ink)]"
                          : "text-[color:var(--soft)]"
                      }`}
                    >
                      {tab === key && (
                        <motion.span
                          layoutId="agenda-tab"
                          className="absolute inset-0 rounded-lg bg-[color:var(--btn)]"
                          transition={{
                            type: "spring",
                            bounce: 0.2,
                            duration: 0.4,
                          }}
                        />
                      )}
                      <span className="relative">{label}</span>
                      {tab !== key && unseen[key] > 0 && (
                        <span className="relative inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-[color:var(--accent)] px-1 text-[10px] font-semibold text-[color:var(--btn-ink)]">
                          {unseen[key]}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-6 lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)]">
              <div
                className={`lg:sticky lg:top-6 ${tab === "chat" ? "" : "hidden lg:block"}`}
              >
                <Chat
                  business={business}
                  status={status}
                  slow={slow}
                  error={connectError}
                  messages={messages}
                  sending={sending}
                  remaining={remaining}
                  onSend={send}
                  onRestart={restart}
                  onShowAgenda={() => selectTab("agenda")}
                />
              </div>
              {/* En móvil sólo se monta la pestaña visible: las animaciones de
                  la agenda no pueden medir elementos ocultos */}
              {(desktop || tab !== "chat") && (
                <div className="min-w-0 space-y-6">
                  {(desktop || tab === "agenda") && (
                    <WeekCalendar
                      today={today}
                      now={now}
                      agenda={agenda}
                      business={business}
                      highlighted={highlighted}
                      week={week}
                      onWeek={changeWeek}
                      day={day}
                      onDay={setDay}
                    />
                  )}
                  {(desktop || tab === "acciones") && (
                    <ActionLog actions={actions} />
                  )}
                </div>
              )}
            </div>

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
