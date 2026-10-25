import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowRightIcon,
  CheckIcon,
  DownloadIcon,
  FileIcon,
  XIcon,
} from "../components/icons";
import {
  Charged,
  Dropzone,
  ErrorAlert,
  LabHeader,
  Stepper,
  TalkButton,
  SubTitle,
} from "../components/LabParts";
import BlurText from "../components/reactbits/BlurText";
import LatticeLoader from "../components/reactbits/LatticeLoader";
import Magnet from "../components/reactbits/Magnet";
import SpotlightCard from "../components/reactbits/SpotlightCard";
import Squares from "../components/reactbits/Squares";
import ThoughtLine from "../components/reactbits/ThoughtLine";
import { Eyebrow } from "../components/shared";
import { IssueList, PreviewTable, Stat } from "../components/SheetPreview";
import VideoButton from "../components/VideoButton";
import { formatSize } from "../lib/files";
import { hasHardwareWebGL } from "../lib/gpu";
import { useDocumentTitle } from "../lib/hooks";
import { useContent, useLang } from "../lib/i18n";
import { useIssues } from "../lib/issues";
import { analyze, ISSUE_TYPES, readSheet } from "../lib/sheet";
import { useToast } from "../lib/toast";
import { btn, card, focusRing, iconBtn } from "../lib/ui";

/* ──────────────────────────────────────────────────────────────
   CONFIGURACIÓN
   ────────────────────────────────────────────────────────────── */

// Vite: define VITE_API_URL en tu .env (ej. http://localhost:8000)
const API_URL = import.meta.env.VITE_API_URL ?? "";
const ENDPOINT = `${API_URL}/api/datarefine/clean`;

const ACCEPTED = [".xlsx", ".xls", ".csv"];
// Límites de la demo pública: deben coincidir con los del backend (.env)
const MAX_MB = 1;
const MAX_BYTES = MAX_MB * 1024 * 1024;
const MAX_ROWS = 300;
const PER_HOUR = 5;

const extOf = (name) =>
  name.includes(".") ? name.split(".").pop().toUpperCase() : "";

// Devuelve el mensaje de error, o "" si el archivo es válido
const validate = (file, errors) => {
  const dot = file.name.lastIndexOf(".");
  const ext = dot === -1 ? "" : file.name.slice(dot).toLowerCase();
  if (!ACCEPTED.includes(ext)) return errors.format;
  if (file.size === 0) return errors.empty;
  if (file.size > MAX_BYTES) return errors.size(MAX_MB);
  return "";
};

// Problemas detectados, en texto: "2 filas duplicadas, 4 celdas vacías"
const describe = (analysis, issues) =>
  ISSUE_TYPES.filter((t) => analysis.counts[t] > 0)
    .map((t) => `${analysis.counts[t]} ${issues[t].label.toLowerCase()}`)
    .join(", ");

/* ──────────────────────────────────────────────────────────────
   PIEZAS DE LA INTERFAZ
   ────────────────────────────────────────────────────────────── */

const FileCard = ({ file, onRemove, removeLabel }) => (
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
        aria-label={removeLabel}
        className={iconBtn}
      >
        <XIcon className="h-5 w-5" />
      </button>
    )}
  </div>
);

// Diagnóstico del archivo, hecho en el navegador antes de enviarlo
const Diagnosis = ({ preview, focus, onFocus, words }) => {
  if (preview.status === "loading") {
    return (
      <div className="mt-6 flex justify-center py-12 text-[color:var(--soft)]">
        <LatticeLoader
          label={words.checking}
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
        {words.noPreview}
      </p>
    );
  }

  const { analysis } = preview;
  return (
    <div className="mt-6">
      <div className="grid grid-cols-3 gap-3">
        <Stat value={analysis.rows.length} label={words.rows} />
        <Stat value={analysis.headers.length} label={words.columns} />
        <Stat value={analysis.total} label={words.problems} accent />
      </div>

      {analysis.total > 0 ? (
        <div className="mt-7 grid items-start gap-6 lg:grid-cols-[18rem_minmax(0,1fr)]">
          <div>
            <SubTitle>{words.found}</SubTitle>
            <IssueList analysis={analysis} onFocus={onFocus} />
          </div>
          <div className="min-w-0">
            <SubTitle>{words.preview}</SubTitle>
            <PreviewTable
              key={focus ?? "all"}
              analysis={analysis}
              focus={focus}
              caption={words.previewIssues}
            />
          </div>
        </div>
      ) : (
        <div className="mt-7">
          <p className="mb-4 text-sm text-[color:var(--soft)]">
            {words.noProblems}
          </p>
          <PreviewTable analysis={analysis} caption={words.previewFile} />
        </div>
      )}
    </div>
  );
};

// Mientras la IA trabaja: cargador y lo que se va a corregir
const Working = ({ analysis, elapsed, glow, words, issues }) => (
  <div className="mt-5 space-y-5">
    <div className="rounded-xl border border-[color:var(--line)] bg-[color:var(--ink)] p-4 md:p-5">
      <div className="text-[color:var(--text)]">
        <LatticeLoader
          label={words.cleaning}
          pattern="orbit"
          color="#D4B27A"
          glow
          glowColor="#D4B27A"
          fontSize={15}
        />
      </div>
      {analysis?.total > 0 && (
        <ul aria-label={words.fixing} className="mt-4 flex flex-wrap gap-2">
          {ISSUE_TYPES.filter((t) => analysis.counts[t] > 0).map((t) => (
            <li
              key={t}
              className="inline-flex items-center gap-2 rounded-full border border-[color:var(--line)] px-3 py-1 text-xs text-[color:var(--soft)]"
            >
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: issues[t].color }}
              />
              {analysis.counts[t]} · {issues[t].label.toLowerCase()}
            </li>
          ))}
        </ul>
      )}
      <p className="mt-4 text-sm text-[color:var(--muted)]">
        {elapsed >= 20 ? words.slow : words.wait}
      </p>
    </div>

    {analysis && (
      <Charged glow={glow} on strong radius={12}>
        <PreviewTable
          analysis={analysis}
          scanning
          footer={false}
          caption={words.scanning}
        />
      </Charged>
    )}
  </div>
);

// Resultado: cifras reales de antes y después, comparación y descarga
const Result = ({
  result,
  baseName,
  duration,
  before,
  after,
  onReset,
  words,
  issues,
}) => {
  const [view, setView] = useState("after");
  const fileName = `${baseName}_${words.cleanSuffix}.xlsx`;
  const noAI = result.ai === "unavailable" || result.ai === "limited";
  const shown = view === "before" && before ? before : after;

  return (
    <div>
      <div className="py-2 text-center">
        <span className="pop mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[color:var(--clean-line)] bg-[color:var(--clean-bg)] text-[color:var(--clean)]">
          <CheckIcon className="h-7 w-7" />
        </span>
        <h2 className="mt-5 font-display text-2xl font-semibold md:text-3xl">
          {words.cleanTitle}
        </h2>
        <p className="mt-2 text-[color:var(--soft)]">
          {fileName}, {formatSize(result.size)}
        </p>
        <div className="mt-4 flex justify-center">
          <ThoughtLine
            working={false}
            elapsed={duration}
            doneLabel={words.readyIn}
            steps={words.doneSteps(noAI)}
            color="#BCC1CB"
            glyphColor="#7BDDB5"
            fontSize={14}
          />
        </div>
        {noAI && (
          <p className="mx-auto mt-4 max-w-md text-sm text-[color:var(--muted)]">
            {result.ai === "limited" ? words.aiLimited : words.aiBusy}
          </p>
        )}
      </div>

      {after && (
        <>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {before && (
              <Stat
                value={Math.max(0, before.total - after.total)}
                label={words.fixed}
                detail={words.ofDetected(before.total)}
                accent
              />
            )}
            <Stat
              value={after.rows.length}
              label={words.finalRows}
              detail={before ? words.ofOriginal(before.rows.length) : undefined}
            />
            <Stat
              value={after.total}
              label={words.toReview}
              detail={
                after.total
                  ? `${describe(after, issues)}${after.counts.empty ? words.inYellow : ""}`
                  : words.allGood
              }
            />
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
            <SubTitle>{words.preview}</SubTitle>
            {before && (
              <div
                role="group"
                aria-label={words.compare}
                className="mb-3 inline-flex rounded-full border border-[color:var(--line)] bg-[color:var(--ink)] p-1"
              >
                {[
                  ["before", words.before],
                  ["after", words.after],
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
            caption={shown === after ? words.cleanFile : words.originalFile}
          />
        </>
      )}

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Magnet>
          <a href={result.url} download={fileName} className={btn("primary")}>
            <DownloadIcon /> {words.download}
          </a>
        </Magnet>
        <button type="button" onClick={onReset} className={btn("secondary")}>
          {words.another}
        </button>
      </div>
    </div>
  );
};

/* ──────────────────────────────────────────────────────────────
   PÁGINA
   ────────────────────────────────────────────────────────────── */

const DataLab = () => {
  const {
    DATA_LAB: words,
    DATAREFINE_FIXES,
    PROJECT,
    UI,
    makeSampleFile,
  } = useContent();
  const lang = useLang();
  const issues = useIssues();
  useDocumentTitle(words.title);
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

  // En hosting gratuito el backend se duerme: se despierta al abrir la demo,
  // mientras el visitante elige su archivo
  useEffect(() => {
    fetch(`${API_URL}/api/health`).catch(() => {});
  }, []);

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

    const problem = validate(candidate, words.errors);
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
    notify(words.sampleLoaded, words.sampleDetail);
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

      // ?lang=: la hoja de resumen del Excel y los errores, en el idioma de la página
      const res = await fetch(`${ENDPOINT}?lang=${lang}`, {
        method: "POST",
        body,
        signal: controller.signal,
      });

      // 400, 413, 422 y 429 traen un mensaje claro; el resto, genérico
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const clear = [400, 413, 422, 429].includes(res.status);
        throw new Error(
          clear && typeof data.detail === "string"
            ? data.detail
            : words.errors.generic,
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
        // "unavailable" (IA saturada) o "limited" (tope diario): sólo reglas
        ai: res.headers.get("X-DataRefine-AI"),
      });
      setStatus("done");
      notify(
        words.toastClean,
        original && checked
          ? words.toastFixed(Math.max(0, original.total - checked.total))
          : words.toastReady,
      );
    } catch (err) {
      if (err.name === "AbortError") {
        setStatus("idle"); // el usuario canceló: sin mensaje de error
        return;
      }
      setStatus("error");
      setError(err instanceof TypeError ? words.errors.network : err.message);
    }
  };

  const baseName = file ? file.name.replace(/\.[^.]+$/, "") : "archivo";
  const step = status === "done" ? 3 : file ? 2 : 1;
  const original = before.status === "ready" ? before.analysis : null;
  const tooManyRows = Boolean(original && original.rows.length > MAX_ROWS);

  return (
    <div className="grain font-body min-h-screen bg-[color:var(--ink)] text-[color:var(--text)]">
      <LabHeader />

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
              text={words.heading}
              className="balance mt-4 max-w-3xl font-display text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl"
            />
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[color:var(--soft)]">
              {words.intro}
            </p>
            <ul
              className="mt-6 flex flex-wrap gap-2"
              aria-label={UI.common.details}
            >
              {words.facts(MAX_ROWS).map((fact) => (
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
            aria-label={words.workArea}
            className={`${card} p-5 md:p-8`}
          >
            <Stepper current={step} activity={status} words={words} />

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
                  words={words}
                  issues={issues}
                />
              )}

              {/* Paso 1: subir */}
              {!file && status !== "done" && (
                <>
                  <Dropzone
                    dragging={dragging}
                    setDragging={setDragging}
                    onFiles={(files) => pickFile(files?.[0])}
                    glow={glow}
                    onArm={armGlow}
                    words={words}
                    accept={ACCEPTED}
                    note={words.limits(MAX_MB, MAX_ROWS)}
                  />
                  {error && <ErrorAlert>{error}</ErrorAlert>}
                  <p className="mt-5 text-center text-sm text-[color:var(--muted)]">
                    {words.noFile}{" "}
                    <button
                      type="button"
                      onClick={loadSample}
                      className={`rounded font-medium text-[color:var(--accent)] underline underline-offset-4 transition-colors hover:text-[color:var(--text)] ${focusRing}`}
                    >
                      {words.sample}
                    </button>
                  </p>
                </>
              )}

              {/* Paso 2: revisar y limpiar */}
              {file && (status === "idle" || status === "error") && (
                <>
                  <FileCard
                    file={file}
                    onRemove={resetAll}
                    removeLabel={words.remove}
                  />
                  {error && <ErrorAlert>{error}</ErrorAlert>}
                  <Diagnosis
                    preview={before}
                    focus={focus}
                    onFocus={setFocus}
                    words={words}
                  />
                  {tooManyRows && (
                    <div className="mt-6 rounded-xl border border-[color:var(--accent-line)] bg-[color:var(--accent-bg)] p-4 text-sm leading-relaxed text-[color:var(--text)]">
                      {words.tooManyRows(original.rows.length, MAX_ROWS)}
                    </div>
                  )}
                  <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-[color:var(--line)] pt-6">
                    <Magnet>
                      <button
                        type="button"
                        onClick={handleProcess}
                        disabled={before.status === "loading" || tooManyRows}
                        className={`${btn("primary")} disabled:cursor-not-allowed disabled:opacity-60`}
                      >
                        {status === "error" ? words.retry : words.clean}
                        <ArrowRightIcon className="h-4 w-4" />
                      </button>
                    </Magnet>
                    <p className="text-sm text-[color:var(--muted)]">
                      {words.willFix(original?.total ?? 0)}
                    </p>
                  </div>
                </>
              )}

              {file && status === "processing" && (
                <>
                  <FileCard file={file} />
                  <Working
                    analysis={original}
                    elapsed={elapsed}
                    glow={glow}
                    words={words}
                    issues={issues}
                  />
                  <div className="mt-6">
                    <button
                      type="button"
                      onClick={cancel}
                      className={btn("secondary")}
                    >
                      {words.cancel}
                    </button>
                  </div>
                </>
              )}
            </div>
          </section>

          {/* Información */}
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <SpotlightCard className={`${card} p-6`}>
              <h2 className="font-display text-lg font-semibold">
                {words.whatItFixes}
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
                {words.beforeUpload}
              </h2>
              <dl className="mt-4 space-y-3 text-sm">
                {words
                  .rules(ACCEPTED.join(", "), MAX_MB, MAX_ROWS, PER_HOUR)
                  .map(([term, value]) => (
                    <div key={term} className="flex justify-between gap-4">
                      <dt className="text-[color:var(--muted)]">{term}</dt>
                      <dd className="text-right text-[color:var(--soft)]">
                        {value}
                      </dd>
                    </div>
                  ))}
              </dl>
              <p className="mt-5 text-sm leading-relaxed text-[color:var(--muted)]">
                {words.publicDemo}
              </p>
            </SpotlightCard>

            <SpotlightCard className={`${card} flex flex-col p-6`}>
              <h2 className="font-display text-lg font-semibold">
                {words.forBusiness}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-[color:var(--soft)]">
                {words.forBusinessText}
              </p>
              <div className="mt-auto flex flex-wrap gap-2 pt-6">
                <TalkButton />
                <VideoButton
                  url={PROJECT.video}
                  label={UI.common.watchVideo}
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
