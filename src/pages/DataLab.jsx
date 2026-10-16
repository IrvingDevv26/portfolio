import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  DownloadIcon,
  FileIcon,
  UploadIcon,
  XIcon,
} from "../components/icons";
import BlurText from "../components/reactbits/BlurText";
import ElectricBorder from "../components/reactbits/ElectricBorder";
import LatticeLoader from "../components/reactbits/LatticeLoader";
import Magnet from "../components/reactbits/Magnet";
import ShinyText from "../components/reactbits/ShinyText";
import SpotlightCard from "../components/reactbits/SpotlightCard";
import Squares from "../components/reactbits/Squares";
import StatusMark from "../components/reactbits/StatusMark";
import ThoughtLine from "../components/reactbits/ThoughtLine";
import { Eyebrow } from "../components/shared";
import { IssueList, PreviewTable, Stat } from "../components/SheetPreview";
import VideoButton from "../components/VideoButton";
import { DATAREFINE_FIXES, PROJECT, makeSampleFile } from "../content";
import { hasHardwareWebGL } from "../lib/gpu";
import { useDocumentTitle } from "../lib/hooks";
import { analyze, ISSUE_TYPES, ISSUES, readSheet } from "../lib/sheet";
import { useToast } from "../lib/toast";
import { btn, card, focusRing, iconBtn } from "../lib/ui";

/* ──────────────────────────────────────────────────────────────
   CONFIGURACIÓN
   ────────────────────────────────────────────────────────────── */

// Vite: define VITE_API_URL en tu .env (ej. http://localhost:8000)
const API_URL = import.meta.env.VITE_API_URL ?? "";
const ENDPOINT = `${API_URL}/api/datarefine/clean`;

const ACCEPTED = [".xlsx", ".xls", ".csv"];
const MAX_MB = 10;
const MAX_BYTES = MAX_MB * 1024 * 1024;

const MSG = {
  format: "Formato no compatible. Sube un archivo .xlsx, .xls o .csv.",
  size: `El archivo pesa más de ${MAX_MB} MB. Sube uno más pequeño.`,
  empty: "El archivo está vacío. Sube uno que tenga datos.",
  generic:
    "No se pudo procesar el archivo. Verifica el formato o inténtalo de nuevo.",
  network:
    "No se pudo conectar con el servidor. Revisa tu conexión e inténtalo de nuevo.",
};

const formatSize = (bytes) =>
  bytes < 1024 * 1024
    ? `${Math.max(1, Math.round(bytes / 1024))} KB`
    : `${(bytes / 1024 / 1024).toFixed(1)} MB`;

const extOf = (name) =>
  name.includes(".") ? name.split(".").pop().toUpperCase() : "";

// Devuelve el mensaje de error, o "" si el archivo es válido
const validate = (file) => {
  const dot = file.name.lastIndexOf(".");
  const ext = dot === -1 ? "" : file.name.slice(dot).toLowerCase();
  if (!ACCEPTED.includes(ext)) return MSG.format;
  if (file.size === 0) return MSG.empty;
  if (file.size > MAX_BYTES) return MSG.size;
  return "";
};

// Problemas detectados, en texto: "2 filas duplicadas, 4 celdas vacías"
const describe = (analysis) =>
  ISSUE_TYPES.filter((t) => analysis.counts[t] > 0)
    .map((t) => `${analysis.counts[t]} ${ISSUES[t].label.toLowerCase()}`)
    .join(", ");

/* ──────────────────────────────────────────────────────────────
   PIEZAS DE LA INTERFAZ
   ────────────────────────────────────────────────────────────── */

const STEP_LABELS = ["Subir archivo", "Revisar y limpiar", "Descargar"];

// Estado de cada paso para StatusMark: pendiente, en curso, completado o fallido
const markOf = (state, activity) => {
  if (state === "done") return "done";
  if (state === "current" && activity === "done") return "done";
  if (state === "current" && activity === "processing") return "running";
  if (state === "current" && activity === "error") return "failed";
  return "pending";
};

const Stepper = ({ current, activity }) => (
  <ol aria-label="Progreso" className="flex items-center gap-3">
    {STEP_LABELS.map((label, i) => {
      const n = i + 1;
      const state = n < current ? "done" : n === current ? "current" : "todo";

      return (
        <li
          key={label}
          aria-current={state === "current" ? "step" : undefined}
          className="flex flex-1 items-center gap-3 last:flex-none"
        >
          <StatusMark
            status={markOf(state, activity)}
            size={22}
            color={state === "todo" ? "#8A909C" : "#D4B27A"}
            doneColor="#7BDDB5"
            errorColor="#FF9AA8"
            strike={false}
          />
          <span
            className={`text-sm ${
              state === "current" ? "inline" : "hidden sm:inline"
            } ${
              state === "todo"
                ? "text-[color:var(--muted)]"
                : "text-[color:var(--text)]"
            }`}
          >
            {label}
          </span>
          {n < STEP_LABELS.length && (
            <span
              aria-hidden="true"
              className="h-px flex-1 bg-[color:var(--line)]"
            />
          )}
        </li>
      );
    })}
  </ol>
);

// Borde eléctrico (React Bits) sólo con WebGL acelerado
const Charged = ({ glow, on, strong = false, radius = 16, children }) =>
  glow ? (
    <ElectricBorder
      active={on}
      color="#D4B27A"
      borderRadius={radius}
      intensity={strong ? 0.9 : 0.55}
      chaos={0.35}
      spread={0.5}
      strands={2}
      thickness={1.2}
      glow={0.5}
      arcs={strong ? 1.2 : 0.3}
      speed={0.8}
      cursorRadius={70}
    >
      {children}
    </ElectricBorder>
  ) : (
    children
  );

const Dropzone = ({ dragging, setDragging, onFile, glow, onArm }) => {
  const [hover, setHover] = useState(false);

  return (
    <Charged glow={glow} on={dragging || hover} strong={dragging}>
      <label
        onPointerEnter={() => {
          onArm();
          setHover(true);
        }}
        onPointerLeave={() => setHover(false)}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) setDragging(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          onFile(e.dataTransfer.files?.[0]);
        }}
        className={`group flex cursor-pointer flex-col items-center gap-4 rounded-2xl border-2 border-dashed px-6 py-14 text-center transition-colors focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[color:var(--accent)] md:py-16 ${
          dragging
            ? "border-[color:var(--accent)] bg-[color:var(--accent-bg)]"
            : "border-[color:var(--line-strong)] bg-[color:var(--ink)] hover:border-[rgba(212,178,122,0.35)]"
        }`}
      >
        <input
          type="file"
          accept={ACCEPTED.join(",")}
          className="sr-only"
          onChange={(e) => {
            onFile(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
        <span
          className={`flex h-14 w-14 items-center justify-center rounded-full border transition-colors ${
            dragging
              ? "border-[color:var(--accent-line)] text-[color:var(--accent)]"
              : "border-[color:var(--line)] bg-[color:var(--raised)] text-[color:var(--soft)] group-hover:text-[color:var(--accent)]"
          }`}
        >
          <UploadIcon className="h-6 w-6" />
        </span>
        <span className="font-display text-xl font-semibold text-[color:var(--text)]">
          {dragging
            ? "Suelta el archivo para cargarlo"
            : "Arrastra tu archivo aquí"}
        </span>
        <span className="text-sm text-[color:var(--muted)]">
          o{" "}
          <span className="text-[color:var(--text)] underline underline-offset-4">
            elige uno de tu equipo
          </span>
        </span>
        <ul
          aria-label="Formatos admitidos"
          className="flex flex-wrap justify-center gap-2"
        >
          {ACCEPTED.map((ext) => (
            <li
              key={ext}
              className="rounded-md border border-[color:var(--line)] px-2 py-0.5 font-mono text-xs text-[color:var(--muted)]"
            >
              {ext}
            </li>
          ))}
        </ul>
        <span className="text-xs text-[color:var(--muted)]">
          Máximo {MAX_MB} MB
        </span>
      </label>
    </Charged>
  );
};

const FileCard = ({ file, onRemove }) => (
  <div className="flex items-center gap-3 rounded-xl border border-[color:var(--line)] bg-[color:var(--ink)] px-4 py-3">
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[color:var(--clean-bg)] text-[color:var(--clean)]">
      <FileIcon className="h-5 w-5" />
    </span>
    <div className="min-w-0 flex-1">
      <p className="truncate font-medium text-[color:var(--text)]">
        {file.name}
      </p>
      <p className="mt-0.5 flex items-center gap-2 text-sm text-[color:var(--muted)]">
        {extOf(file.name) && (
          <span className="rounded bg-[color:var(--glass)] px-1.5 py-0.5 text-[11px] font-semibold text-[color:var(--soft)]">
            {extOf(file.name)}
          </span>
        )}
        {formatSize(file.size)}
      </p>
    </div>
    {onRemove && (
      <button
        type="button"
        onClick={onRemove}
        aria-label="Quitar archivo"
        className={iconBtn}
      >
        <XIcon className="h-5 w-5" />
      </button>
    )}
  </div>
);

const ErrorAlert = ({ children }) => (
  <div
    role="alert"
    className="mt-5 flex gap-3 rounded-xl border border-[color:var(--danger-line)] bg-[color:var(--danger-bg)] p-4 text-sm leading-relaxed text-[color:var(--danger)]"
  >
    <AlertIcon className="mt-0.5 h-5 w-5 shrink-0" />
    <p>{children}</p>
  </div>
);

const SubTitle = ({ children }) => (
  <h3 className="mb-3 font-mono text-xs uppercase tracking-[0.16em] text-[color:var(--muted)]">
    {children}
  </h3>
);

// Diagnóstico del archivo, hecho en el navegador antes de enviarlo
const Diagnosis = ({ preview, focus, onFocus }) => {
  if (preview.status === "loading") {
    return (
      <div className="mt-6 flex justify-center py-12 text-[color:var(--soft)]">
        <LatticeLoader
          label="Revisando el archivo"
          pattern="snake"
          color="#D4B27A"
          showTimer={false}
        />
      </div>
    );
  }
  if (preview.status !== "ready") {
    return (
      <p className="mt-5 rounded-xl border border-dashed border-[color:var(--line-strong)] p-4 text-sm leading-relaxed text-[color:var(--muted)]">
        La vista previa está disponible para archivos .csv y .xlsx. DataRefine
        procesa tu archivo igual.
      </p>
    );
  }

  const { analysis } = preview;
  return (
    <div className="mt-6">
      <div className="grid grid-cols-3 gap-3">
        <Stat value={analysis.rows.length} label="Filas" />
        <Stat value={analysis.headers.length} label="Columnas" />
        <Stat value={analysis.total} label="Problemas" accent />
      </div>

      {analysis.total > 0 ? (
        <div className="mt-7 grid items-start gap-6 lg:grid-cols-[18rem_minmax(0,1fr)]">
          <div>
            <SubTitle>Qué encontramos</SubTitle>
            <IssueList analysis={analysis} onFocus={onFocus} />
          </div>
          <div className="min-w-0">
            <SubTitle>Vista previa</SubTitle>
            <PreviewTable
              key={focus ?? "all"}
              analysis={analysis}
              focus={focus}
              caption="Vista previa del archivo original con los problemas resaltados"
            />
          </div>
        </div>
      ) : (
        <div className="mt-7">
          <p className="mb-4 text-sm text-[color:var(--soft)]">
            No vemos problemas evidentes; la IA revisará el contenido a fondo.
          </p>
          <PreviewTable
            analysis={analysis}
            caption="Vista previa del archivo"
          />
        </div>
      )}
    </div>
  );
};

// Mientras la IA trabaja: cargador y lo que se va a corregir
const Working = ({ analysis, elapsed, glow }) => (
  <div className="mt-5 space-y-5">
    <div className="rounded-xl border border-[color:var(--line)] bg-[color:var(--ink)] p-4 md:p-5">
      <div className="text-[color:var(--text)]">
        <LatticeLoader
          label="Limpiando con IA"
          pattern="orbit"
          color="#D4B27A"
          glow
          glowColor="#D4B27A"
          fontSize={15}
        />
      </div>
      {analysis?.total > 0 && (
        <ul
          aria-label="Qué se está corrigiendo"
          className="mt-4 flex flex-wrap gap-2"
        >
          {ISSUE_TYPES.filter((t) => analysis.counts[t] > 0).map((t) => (
            <li
              key={t}
              className="inline-flex items-center gap-2 rounded-full border border-[color:var(--line)] px-3 py-1 text-xs text-[color:var(--soft)]"
            >
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: ISSUES[t].color }}
              />
              {analysis.counts[t]} · {ISSUES[t].label.toLowerCase()}
            </li>
          ))}
        </ul>
      )}
      <p className="mt-4 text-sm text-[color:var(--muted)]">
        {elapsed >= 20
          ? "Está tardando más de lo normal. Puedes cancelar e intentarlo de nuevo."
          : "Puede tardar unos segundos, según el tamaño del archivo."}
      </p>
    </div>

    {analysis && (
      <Charged glow={glow} on strong radius={12}>
        <PreviewTable
          analysis={analysis}
          scanning
          footer={false}
          caption="Archivo original mientras se limpia"
        />
      </Charged>
    )}
  </div>
);

// Resultado: cifras reales de antes y después, comparación y descarga
const Result = ({ result, baseName, duration, before, after, onReset }) => {
  const [view, setView] = useState("after");
  const fileName = `${baseName}_limpio.xlsx`;
  const shown = view === "before" && before ? before : after;

  return (
    <div>
      <div className="py-2 text-center">
        <span className="pop mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[color:var(--clean-line)] bg-[color:var(--clean-bg)] text-[color:var(--clean)]">
          <CheckIcon className="h-7 w-7" />
        </span>
        <h2 className="mt-5 font-display text-2xl font-semibold md:text-3xl">
          Tu archivo está limpio
        </h2>
        <p className="mt-2 text-[color:var(--soft)]">
          {fileName}, {formatSize(result.size)}
        </p>
        <div className="mt-4 flex justify-center">
          <ThoughtLine
            working={false}
            elapsed={duration}
            doneLabel="Limpieza lista en"
            steps={[
              "Archivo revisado en tu navegador",
              "Fechas, montos y duplicados corregidos",
              result.ai === "unavailable"
                ? "Revisión de textos con IA omitida"
                : "Textos revisados con IA",
              "Excel limpio generado",
            ]}
            color="#BCC1CB"
            glyphColor="#7BDDB5"
            fontSize={14}
          />
        </div>
        {result.ai === "unavailable" && (
          <p className="mx-auto mt-4 max-w-md text-sm text-[color:var(--muted)]">
            La IA está saturada en este momento: se aplicaron las reglas
            automáticas. Inténtalo de nuevo en unos minutos para revisar también
            los textos.
          </p>
        )}
      </div>

      {after && (
        <>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {before && (
              <Stat
                value={Math.max(0, before.total - after.total)}
                label="Problemas corregidos"
                detail={`de ${before.total} detectados`}
                accent
              />
            )}
            <Stat
              value={after.rows.length}
              label="Filas finales"
              detail={
                before ? `de ${before.rows.length} originales` : undefined
              }
            />
            <Stat
              value={after.total}
              label="Por revisar"
              detail={
                after.total
                  ? `${describe(after)}${after.counts.empty ? ", en amarillo en el Excel" : ""}`
                  : "Todo en orden"
              }
            />
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
            <SubTitle>Vista previa</SubTitle>
            {before && (
              <div
                role="group"
                aria-label="Comparar versiones"
                className="mb-3 inline-flex rounded-full border border-[color:var(--line)] bg-[color:var(--ink)] p-1"
              >
                {[
                  ["before", "Antes"],
                  ["after", "Después"],
                ].map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    aria-pressed={view === id}
                    onClick={() => setView(id)}
                    className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                      view === id
                        ? "bg-[color:var(--btn)] text-[color:var(--btn-ink)]"
                        : "text-[color:var(--soft)] hover:text-[color:var(--text)]"
                    } ${focusRing}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <PreviewTable
            key={view}
            analysis={shown}
            caption={shown === after ? "Archivo limpio" : "Archivo original"}
          />
        </>
      )}

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Magnet>
          <a href={result.url} download={fileName} className={btn("primary")}>
            <DownloadIcon /> Descargar archivo limpio
          </a>
        </Magnet>
        <button type="button" onClick={onReset} className={btn("secondary")}>
          Limpiar otro archivo
        </button>
      </div>
    </div>
  );
};

/* ──────────────────────────────────────────────────────────────
   PÁGINA
   ────────────────────────────────────────────────────────────── */

const FACTS = [
  "CSV, XLSX y XLS",
  `Hasta ${MAX_MB} MB`,
  "Diagnóstico en tu navegador",
  "Resultado en .xlsx",
];

const DataLab = () => {
  useDocumentTitle("DataRefine — Demo en vivo · Irving Dávila");
  const notify = useToast();
  // El borde eléctrico necesita WebGL: comprobarlo y compilar su shader cuesta
  // medio segundo o más, así que se hace la primera vez que hace falta (cursor
  // sobre la zona, archivo arrastrado o limpieza en curso), no al cargar
  const [glow, setGlow] = useState(false);
  const armedRef = useRef(false);
  const armGlow = useCallback(() => {
    if (armedRef.current) return;
    armedRef.current = true;
    setGlow(hasHardwareWebGL());
  }, []);

  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("idle"); // idle | processing | done | error
  const [result, setResult] = useState(null); // { url, size }
  const [before, setBefore] = useState({ status: "idle" }); // diagnóstico del original
  const [after, setAfter] = useState(null); // diagnóstico del archivo limpio
  const [focus, setFocus] = useState(null); // tipo de problema resaltado
  const [dragging, setDragging] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [duration, setDuration] = useState(0); // segundos que tardó la IA
  const abortRef = useRef(null);
  const readRef = useRef(0); // descarta lecturas de un archivo anterior
  const workRef = useRef(null);

  // Evita que el navegador abra el archivo si se suelta fuera de la zona
  useEffect(() => {
    const prevent = (e) => e.preventDefault();
    window.addEventListener("dragenter", armGlow);
    window.addEventListener("dragover", prevent);
    window.addEventListener("drop", prevent);
    return () => {
      window.removeEventListener("dragenter", armGlow);
      window.removeEventListener("dragover", prevent);
      window.removeEventListener("drop", prevent);
    };
  }, [armGlow]);

  // Cancela una petición en curso al salir de la página
  useEffect(() => () => abortRef.current?.abort(), []);

  // Libera la URL del archivo limpio cuando cambia o al salir
  useEffect(
    () => () => {
      if (result?.url) URL.revokeObjectURL(result.url);
    },
    [result],
  );

  // Al empezar y al terminar, el área de trabajo vuelve a la vista (en móvil
  // el botón queda muy abajo y el resultado aparecería fuera de pantalla)
  useEffect(() => {
    if (status !== "processing" && status !== "done") return;
    const el = workRef.current;
    if (!el || el.getBoundingClientRect().top >= 0) return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }, [status]);

  // Contador de segundos mientras se procesa
  useEffect(() => {
    if (status !== "processing") return undefined;
    const started = Date.now();
    const id = setInterval(
      () => setElapsed(Math.floor((Date.now() - started) / 1000)),
      1000,
    );
    return () => clearInterval(id);
  }, [status]);

  // Lee el archivo en el navegador y cuenta sus problemas
  const inspect = async (candidate) => {
    const token = ++readRef.current;
    setBefore({ status: "loading" });
    const rows = await readSheet(candidate);
    if (token !== readRef.current) return;
    const analysis = rows && analyze(rows);
    setBefore(analysis ? { status: "ready", analysis } : { status: "none" });
  };

  const pickFile = (candidate) => {
    setResult(null);
    setAfter(null);
    setFocus(null);
    setStatus("idle");
    if (!candidate) return;

    const problem = validate(candidate);
    if (problem) {
      readRef.current += 1;
      setFile(null);
      setBefore({ status: "idle" });
      setError(problem);
      return;
    }
    setError("");
    setFile(candidate);
    inspect(candidate);
  };

  const loadSample = () => {
    pickFile(makeSampleFile());
    notify(
      "Datos de ejemplo cargados",
      "Un CSV con errores típicos de captura.",
    );
  };

  const resetAll = () => {
    abortRef.current?.abort();
    readRef.current += 1;
    setFile(null);
    setError("");
    setResult(null);
    setBefore({ status: "idle" });
    setAfter(null);
    setFocus(null);
    setStatus("idle");
  };

  const cancel = () => abortRef.current?.abort();

  const handleProcess = async () => {
    if (!file) return;
    const controller = new AbortController();
    abortRef.current = controller;
    const startedAt = performance.now();
    armGlow();
    setElapsed(0);
    setStatus("processing");
    setError("");

    try {
      const body = new FormData();
      body.append("file", file);

      const res = await fetch(ENDPOINT, {
        method: "POST",
        body,
        signal: controller.signal,
      });

      // 400, 413 y 422 traen un mensaje claro en español; el resto, genérico
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const clear = [400, 413, 422].includes(res.status);
        throw new Error(
          clear && typeof data.detail === "string" ? data.detail : MSG.generic,
        );
      }

      const blob = await res.blob();
      setDuration((performance.now() - startedAt) / 1000);
      const cleaned = await readSheet(blob, "limpio.xlsx");
      const checked = cleaned && analyze(cleaned);
      const original = before.status === "ready" ? before.analysis : null;

      setAfter(checked || null);
      setResult({
        url: URL.createObjectURL(blob),
        size: blob.size,
        // "unavailable": la IA estaba saturada y se aplicaron sólo las reglas
        ai: res.headers.get("X-DataRefine-AI"),
      });
      setStatus("done");
      notify(
        "Archivo limpio",
        original && checked
          ? `${Math.max(0, original.total - checked.total)} problemas corregidos.`
          : "Listo para descargar.",
      );
    } catch (err) {
      if (err.name === "AbortError") {
        setStatus("idle"); // el usuario canceló: sin mensaje de error
        return;
      }
      setStatus("error");
      setError(err instanceof TypeError ? MSG.network : err.message);
    }
  };

  const baseName = file ? file.name.replace(/\.[^.]+$/, "") : "archivo";
  const step = status === "done" ? 3 : file ? 2 : 1;
  const original = before.status === "ready" ? before.analysis : null;

  return (
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
        {/* Presentación sobre una cuadrícula animada */}
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
            <Eyebrow>DataRefine</Eyebrow>
            <BlurText
              as="h1"
              text="Sube un Excel desordenado. Recíbelo limpio."
              className="balance mt-4 max-w-3xl font-display text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl"
            />
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[color:var(--soft)]">
              Primero ves, en tu navegador, qué problemas tiene tu archivo.
              Después la IA los corrige y te devuelve un .xlsx listo para usar.
              Sin cuentas ni configuraciones.
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
          {/* Área de trabajo */}
          <section
            ref={workRef}
            aria-label="Limpieza de archivo"
            className={`${card} p-5 md:p-8`}
          >
            <Stepper current={step} activity={status} />

            <div className="mt-7">
              {/* Paso 3: listo */}
              {status === "done" && result && (
                <Result
                  result={result}
                  baseName={baseName}
                  duration={duration}
                  before={original}
                  after={after}
                  onReset={resetAll}
                />
              )}

              {/* Paso 1: subir */}
              {!file && status !== "done" && (
                <>
                  <Dropzone
                    dragging={dragging}
                    setDragging={setDragging}
                    onFile={pickFile}
                    glow={glow}
                    onArm={armGlow}
                  />
                  {error && <ErrorAlert>{error}</ErrorAlert>}
                  <p className="mt-5 text-center text-sm text-[color:var(--muted)]">
                    ¿No tienes un archivo a la mano?{" "}
                    <button
                      type="button"
                      onClick={loadSample}
                      className={`rounded font-medium text-[color:var(--accent)] underline underline-offset-4 transition-colors hover:text-[color:var(--text)] ${focusRing}`}
                    >
                      Prueba con datos de ejemplo
                    </button>
                  </p>
                </>
              )}

              {/* Paso 2: revisar y limpiar */}
              {file && (status === "idle" || status === "error") && (
                <>
                  <FileCard file={file} onRemove={resetAll} />
                  {error && <ErrorAlert>{error}</ErrorAlert>}
                  <Diagnosis
                    preview={before}
                    focus={focus}
                    onFocus={setFocus}
                  />
                  <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-[color:var(--line)] pt-6">
                    <Magnet>
                      <button
                        type="button"
                        onClick={handleProcess}
                        disabled={before.status === "loading"}
                        className={`${btn("primary")} disabled:cursor-wait disabled:opacity-60`}
                      >
                        {status === "error" ? "Reintentar" : "Limpiar con IA"}
                        <ArrowRightIcon className="h-4 w-4" />
                      </button>
                    </Magnet>
                    <p className="text-sm text-[color:var(--muted)]">
                      {original?.total
                        ? `Corrige ${original.total === 1 ? "el problema" : `los ${original.total} problemas`} y te devuelve un .xlsx.`
                        : "Te devuelve un .xlsx limpio y consistente."}
                    </p>
                  </div>
                </>
              )}

              {file && status === "processing" && (
                <>
                  <FileCard file={file} />
                  <Working analysis={original} elapsed={elapsed} glow={glow} />
                  <div className="mt-6">
                    <button
                      type="button"
                      onClick={cancel}
                      className={btn("secondary")}
                    >
                      Cancelar
                    </button>
                  </div>
                </>
              )}
            </div>
          </section>

          {/* Información y contacto */}
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <SpotlightCard className={`${card} p-6`}>
              <h2 className="font-display text-lg font-semibold">
                Qué corrige DataRefine
              </h2>
              <ul className="mt-4 space-y-3 text-sm text-[color:var(--soft)]">
                {DATAREFINE_FIXES.map((fix) => (
                  <li key={fix} className="flex gap-3">
                    <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--accent)]" />
                    <span>{fix}</span>
                  </li>
                ))}
              </ul>
            </SpotlightCard>

            <SpotlightCard className={`${card} p-6`}>
              <h2 className="font-display text-lg font-semibold">
                Antes de subir
              </h2>
              <dl className="mt-4 space-y-3 text-sm">
                {[
                  ["Formatos", ACCEPTED.join(", ")],
                  ["Tamaño máximo", `${MAX_MB} MB`],
                  ["Vista previa", ".csv y .xlsx"],
                  ["Resultado", ".xlsx limpio"],
                ].map(([term, value]) => (
                  <div key={term} className="flex justify-between gap-4">
                    <dt className="text-[color:var(--muted)]">{term}</dt>
                    <dd className="text-right text-[color:var(--soft)]">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="mt-5 text-sm leading-relaxed text-[color:var(--muted)]">
                Si la IA está saturada, espera unos minutos y vuelve a
                intentarlo.
              </p>
            </SpotlightCard>

            <SpotlightCard className={`${card} flex flex-col p-6`}>
              <h2 className="font-display text-lg font-semibold">
                ¿Lo necesitas para tu negocio?
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-[color:var(--soft)]">
                Lo adapto a tus archivos: reglas de tu operación, más columnas o
                conexión directa con tu sistema. En una llamada te digo cómo
                quedaría.
              </p>
              <div className="mt-auto flex flex-wrap gap-2 pt-6">
                <Link to="/#contacto" className={btn("primary", "sm")}>
                  Platiquemos <ArrowRightIcon className="h-4 w-4" />
                </Link>
                <VideoButton
                  url={PROJECT.video}
                  label="Ver el video"
                  size="sm"
                />
              </div>
            </SpotlightCard>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DataLab;
