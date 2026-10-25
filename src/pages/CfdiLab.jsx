import { useCallback, useEffect, useRef, useState } from "react";
import {
  AlertIcon,
  ArrowRightIcon,
  CheckIcon,
  DownloadIcon,
  FileIcon,
  XIcon,
} from "../components/icons";
import {
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
import { Stat } from "../components/SheetPreview";
import VideoButton from "../components/VideoButton";
import { formatSize } from "../lib/files";
import { hasHardwareWebGL } from "../lib/gpu";
import { useDocumentTitle } from "../lib/hooks";
import { useContent, useLang } from "../lib/i18n";
import { useToast } from "../lib/toast";
import { btn, card, focusRing, iconBtn, STATE_CHIP } from "../lib/ui";

/* FacturaCheck: el visitante sube sus CFDI (XML o el ZIP del SAT), el backend
   consulta cada factura en el SAT y devuelve la revisión en JSON con el Excel
   adentro. La página muestra las alertas, los totales y la lista de facturas. */

/* ──────────────────────────────────────────────────────────────
   CONFIGURACIÓN
   ────────────────────────────────────────────────────────────── */

const API_URL = import.meta.env.VITE_API_URL ?? "";
const ENDPOINT = `${API_URL}/api/cfdi/review`;
const XLSX =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

const ACCEPTED = [".xml", ".zip"];
// Límites de la demo pública: deben coincidir con los del backend (.env)
const MAX_FILES = 50;
const MAX_MB = 3;
const MAX_BYTES = MAX_MB * 1024 * 1024;
const PER_HOUR = 10;

// Facturas de ejemplo (public/samples/cfdi), hechas con
// scripts/make_cfdi_samples.py del backend. El backend reconoce sus folios y
// les da un estatus simulado: el SAT no las conoce
const SAMPLE_DIR = "/samples/cfdi/";
const SAMPLE_ZIP = `${SAMPLE_DIR}facturas_ejemplo.zip`;
const SAMPLE_FILES = [
  "R-09.xml",
  "A-101.xml",
  "CAP-2208.xml",
  "A-102.xml",
  "H-48.xml",
  "XI-5531.xml",
  "NC-15.xml",
  "M-777.xml",
  "HE-310.xml",
  "P-31.xml",
  "A-103 (borrador).xml",
  "A-102 (1).xml",
];

// Orden de las alertas: de la más grave a la más leve (igual que el backend)
const ALERTS = [
  "cancelled",
  "not_found",
  "efos",
  "cancellation_pending",
  "duplicate",
  "unavailable",
  "unreadable",
];
const ALERT_COLOR = {
  cancelled: "var(--danger)",
  efos: "var(--danger)",
  not_found: "var(--warn)",
  cancellation_pending: "var(--accent)",
  duplicate: "var(--soft)",
  unavailable: "var(--muted)",
  unreadable: "var(--muted)",
};
// Alertas que el estatus ya dice ("Cancelada"): la tabla no las repite
const SAID_BY_STATE = new Set(["cancelled", "not_found", "unavailable"]);

const extensionOf = (name) => {
  const dot = name.lastIndexOf(".");
  return dot === -1 ? "" : name.slice(dot).toLowerCase();
};

// Agrega los archivos nuevos a los elegidos (sin repetir) y revisa los límites
const merge = (current, incoming, errors) => {
  const files = [...current];
  for (const file of incoming) {
    if (!ACCEPTED.includes(extensionOf(file.name))) {
      return { files: current, error: errors.format(file.name) };
    }
    if (!files.some((f) => f.name === file.name && f.size === file.size)) {
      files.push(file);
    }
  }
  if (files.length > MAX_FILES) {
    return { files: current, error: errors.count(MAX_FILES) };
  }
  if (files.reduce((sum, f) => sum + f.size, 0) > MAX_BYTES) {
    return { files: current, error: errors.size(MAX_MB) };
  }
  return { files, error: "" };
};

// "2026-09-03T10:14:22" → fecha local (sin pasar por UTC, que la movería un día)
const dayOf = (iso) => {
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  return new Date(y, m - 1, d);
};

const base64ToBlob = (text, type) => {
  const binary = atob(text);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type });
};

// Formatos de montos y fechas en el idioma de la página
const formatters = (locale) => {
  const money = {};
  const amount = (value, currency = "MXN") => {
    money[currency] ??= new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
    });
    return money[currency].format(value);
  };
  const date = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
  });
  const longDate = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const dayMonth = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
  });
  return {
    amount,
    date: (iso) => date.format(dayOf(iso)),
    // El año una sola vez si ambas fechas son del mismo año
    range: (from, to) => [
      (from.slice(0, 4) === to.slice(0, 4) ? dayMonth : longDate).format(
        dayOf(from),
      ),
      longDate.format(dayOf(to)),
    ],
  };
};

// Todo lo que pide atención: alertas de cada factura y archivos que no se leyeron
const attentionOf = (result) => {
  const items = [];
  for (const invoice of result.invoices) {
    for (const code of invoice.alerts) {
      items.push({ code, invoice, key: `${invoice.file}-${code}` });
    }
  }
  for (const file of result.unreadable) {
    items.push({ code: "unreadable", file, key: `${file.file}-unreadable` });
  }
  return items.sort((a, b) => ALERTS.indexOf(a.code) - ALERTS.indexOf(b.code));
};

/* ──────────────────────────────────────────────────────────────
   PIEZAS DE LA INTERFAZ
   ────────────────────────────────────────────────────────────── */

const FileList = ({ files, onRemove, words }) => (
  <ul className="max-h-72 space-y-2 overflow-y-auto pr-1">
    {files.map((file) => (
      <li
        key={`${file.name}-${file.size}`}
        className="flex items-center gap-3 rounded-xl border border-[color:var(--line)] bg-[color:var(--ink)] px-3 py-2"
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[color:var(--clean-bg)] text-[color:var(--clean)]">
          <FileIcon className="h-4 w-4" />
        </span>
        <p className="min-w-0 flex-1 truncate text-sm text-[color:var(--text)]">
          {file.name}
        </p>
        <span className="shrink-0 rounded bg-[color:var(--glass)] px-1.5 py-0.5 text-[11px] font-semibold uppercase text-[color:var(--soft)]">
          {extensionOf(file.name).slice(1)}
        </span>
        <span className="w-14 shrink-0 text-right text-xs text-[color:var(--muted)]">
          {formatSize(file.size)}
        </span>
        {onRemove && (
          <button
            type="button"
            onClick={() => onRemove(file)}
            aria-label={words.remove(file.name)}
            className={iconBtn}
          >
            <XIcon className="h-4 w-4" />
          </button>
        )}
      </li>
    ))}
  </ul>
);

const StateChip = ({ state, words }) => (
  <span
    className={`inline-flex whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-medium ${STATE_CHIP[state]}`}
  >
    {words.states[state]}
  </span>
);

const KindTag = ({ kind, words }) =>
  kind === "I" ? null : (
    <span className="ml-2 rounded bg-[color:var(--glass)] px-1.5 py-0.5 align-middle text-[11px] font-medium text-[color:var(--soft)]">
      {words.kinds[kind] ?? kind}
    </span>
  );

// Alertas de la factura que su estatus no dice ya
const ExtraAlerts = ({ invoice, words, className }) => {
  const extra = invoice.alerts.filter((code) => !SAID_BY_STATE.has(code));
  return extra.length ? (
    <span className={`text-xs text-[color:var(--muted)] ${className}`}>
      {extra.map((code) => words.alerts[code].label).join(" · ")}
    </span>
  ) : null;
};

// Total de una factura: dólares con su equivalente en pesos, pagos con lo pagado
const Amount = ({ invoice, format, words }) => {
  if (invoice.kind === "P") {
    return (
      <>
        {format.amount(invoice.payments)}{" "}
        <span className="text-[color:var(--muted)]">{words.table.paid}</span>
      </>
    );
  }
  if (invoice.currency !== "MXN" && invoice.currency !== "XXX") {
    return (
      <>
        {format.amount(invoice.total, invoice.currency)}
        <span className="block text-xs text-[color:var(--muted)]">
          {format.amount(invoice.total_mxn)}
        </span>
      </>
    );
  }
  return format.amount(invoice.total);
};

const Attention = ({ items, format, words }) => (
  <div>
    <SubTitle>{words.attention}</SubTitle>
    {items.length === 0 ? (
      <p className="flex items-center gap-3 rounded-xl border border-[color:var(--clean-line)] bg-[color:var(--clean-bg)] p-4 text-sm text-[color:var(--clean)]">
        <CheckIcon className="h-5 w-5 shrink-0" />
        {words.nothingToCheck}
      </p>
    ) : (
      <ul className="space-y-2.5">
        {items.map(({ code, invoice, file, key }) => {
          const alert = words.alerts[code];
          const text =
            code === "unreadable"
              ? words.unreadable[file.error]
              : typeof alert.text === "function"
                ? alert.text(invoice.duplicate_of)
                : alert.text;
          return (
            <li
              key={key}
              className="rounded-xl border border-[color:var(--line)] bg-[color:var(--ink)] p-4"
            >
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span
                  className="inline-flex items-center gap-2 text-sm font-semibold"
                  style={{ color: ALERT_COLOR[code] }}
                >
                  <span
                    aria-hidden="true"
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: ALERT_COLOR[code] }}
                  />
                  {alert.label}
                </span>
                <span className="min-w-0 truncate font-mono text-xs text-[color:var(--muted)]">
                  {invoice ? invoice.file : file.file}
                </span>
              </div>
              {invoice && (
                <p className="mt-1.5 text-sm text-[color:var(--text)]">
                  {invoice.issuer.name || invoice.issuer.rfc} ·{" "}
                  <Amount invoice={invoice} format={format} words={words} />
                </p>
              )}
              <p className="mt-1 text-sm leading-relaxed text-[color:var(--soft)]">
                {text}
              </p>
            </li>
          );
        })}
      </ul>
    )}
  </div>
);

const Totals = ({ totals, format, words }) => (
  <div className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--raised)] p-5 md:p-6">
    <SubTitle>{words.totalsTitle}</SubTitle>
    <dl className="space-y-2.5 text-sm">
      {Object.entries(words.totals).map(([key, label]) => (
        <div
          key={key}
          className={`flex items-baseline justify-between gap-4 ${
            key === "total"
              ? "border-t border-[color:var(--line)] pt-3 font-semibold"
              : ""
          }`}
        >
          <dt
            className={
              key === "total"
                ? "text-[color:var(--text)]"
                : "text-[color:var(--soft)]"
            }
          >
            {label}
          </dt>
          <dd className="font-mono tabular-nums text-[color:var(--text)]">
            {format.amount(totals[key])}
          </dd>
        </div>
      ))}
    </dl>
    <p className="mt-4 text-xs leading-relaxed text-[color:var(--muted)]">
      {words.totalsNote}
    </p>
  </div>
);

const InvoiceTable = ({ invoices, format, words }) => {
  const [onlyFlagged, setOnlyFlagged] = useState(false);
  const flagged = invoices.filter((invoice) => invoice.alerts.length);
  const shown = onlyFlagged ? flagged : invoices;
  const t = words.table;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SubTitle>{t.title}</SubTitle>
        {flagged.length > 0 && (
          <div
            role="group"
            aria-label={t.filter}
            className="mb-3 inline-flex rounded-full border border-[color:var(--line)] bg-[color:var(--ink)] p-1"
          >
            {[
              [false, `${t.all} · ${invoices.length}`],
              [true, `${t.flagged} · ${flagged.length}`],
            ].map(([value, label]) => (
              <button
                key={label}
                type="button"
                aria-pressed={onlyFlagged === value}
                onClick={() => setOnlyFlagged(value)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  onlyFlagged === value
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

      {/* Pantallas anchas: tabla */}
      <div className="hidden overflow-hidden rounded-xl border border-[color:var(--line)] md:block">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">{t.title}</caption>
          <thead className="bg-[color:var(--glass)] text-xs uppercase tracking-wider text-[color:var(--muted)]">
            <tr>
              <th scope="col" className="px-4 py-3 font-medium">
                {t.invoice}
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                {t.issuer}
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                {t.date}
              </th>
              <th scope="col" className="px-4 py-3 text-right font-medium">
                {t.total}
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                {t.status}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[color:var(--line)]">
            {shown.map((invoice) => (
              <tr key={invoice.file} className="align-top">
                <td className="px-4 py-3">
                  <span className="font-medium text-[color:var(--text)]">
                    {invoice.number || invoice.uuid.slice(0, 8)}
                  </span>
                  <KindTag kind={invoice.kind} words={words} />
                  <span className="block truncate font-mono text-xs text-[color:var(--muted)]">
                    {invoice.file}
                  </span>
                </td>
                <td className="max-w-[16rem] px-4 py-3">
                  <span className="block truncate text-[color:var(--text)]">
                    {invoice.issuer.name || "—"}
                  </span>
                  <span className="font-mono text-xs text-[color:var(--muted)]">
                    {invoice.issuer.rfc}
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-[color:var(--soft)]">
                  {format.date(invoice.issued)}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-right font-mono tabular-nums text-[color:var(--text)]">
                  <Amount invoice={invoice} format={format} words={words} />
                </td>
                <td className="px-4 py-3">
                  <StateChip state={invoice.state} words={words} />
                  <ExtraAlerts
                    invoice={invoice}
                    words={words}
                    className="mt-1 block"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pantallas angostas: tarjetas */}
      <ul className="space-y-2.5 md:hidden" aria-label={t.title}>
        {shown.map((invoice) => (
          <li
            key={invoice.file}
            className="rounded-xl border border-[color:var(--line)] bg-[color:var(--ink)] p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="font-medium text-[color:var(--text)]">
                {invoice.number || invoice.uuid.slice(0, 8)}
                <KindTag kind={invoice.kind} words={words} />
              </p>
              <StateChip state={invoice.state} words={words} />
            </div>
            <p className="mt-1 truncate text-sm text-[color:var(--soft)]">
              {invoice.issuer.name || invoice.issuer.rfc}
            </p>
            <div className="mt-2 flex items-end justify-between gap-3 text-sm">
              <span className="text-[color:var(--muted)]">
                {format.date(invoice.issued)}
              </span>
              <span className="text-right font-mono tabular-nums text-[color:var(--text)]">
                <Amount invoice={invoice} format={format} words={words} />
              </span>
            </div>
            <ExtraAlerts
              invoice={invoice}
              words={words}
              className="mt-2 block"
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

// Resultado: cifras, alertas, totales, facturas y descarga
const Result = ({ result, excelUrl, duration, onReset, words, locale }) => {
  const format = formatters(locale);
  const { counts } = result;
  const items = attentionOf(result);
  const flaggedFiles =
    result.invoices.filter((invoice) => invoice.alerts.length).length +
    result.unreadable.length;

  return (
    <div>
      <div className="py-2 text-center">
        <span className="pop mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[color:var(--clean-line)] bg-[color:var(--clean-bg)] text-[color:var(--clean)]">
          <CheckIcon className="h-7 w-7" />
        </span>
        <h2 className="mt-5 font-display text-2xl font-semibold md:text-3xl">
          {words.doneTitle}
        </h2>
        {result.period && (
          <p className="mt-2 text-[color:var(--soft)]">
            {words.period(...format.range(...result.period))}
          </p>
        )}
        <div className="mt-4 flex justify-center">
          <ThoughtLine
            working={false}
            elapsed={duration}
            doneLabel={words.readyIn}
            steps={words.doneSteps(counts.invoices)}
            color="#BCC1CB"
            glyphColor="#7BDDB5"
            fontSize={14}
          />
        </div>
      </div>

      {result.simulated && (
        <p className="mx-auto mt-5 flex max-w-2xl gap-3 rounded-xl border border-[color:var(--accent-line)] bg-[color:var(--accent-bg)] p-4 text-sm leading-relaxed text-[color:var(--text)]">
          <AlertIcon className="mt-0.5 h-5 w-5 shrink-0 text-[color:var(--accent)]" />
          {words.simulated}
        </p>
      )}

      <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat
          value={counts.invoices}
          label={words.stats.invoices}
          detail={
            counts.duplicates
              ? words.duplicatesLeft(counts.duplicates)
              : undefined
          }
        />
        <Stat value={counts.active} label={words.stats.active} />
        <Stat
          value={counts.cancelled}
          label={words.stats.cancelled}
          detail={
            counts.not_found ? words.notFoundToo(counts.not_found) : undefined
          }
        />
        <Stat
          value={flaggedFiles}
          label={words.stats.flagged}
          detail={
            items.length ? words.flaggedDetail(items.length) : words.allClear
          }
          accent
        />
      </div>

      <div className="mt-8 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <Attention items={items} format={format} words={words} />
        <Totals totals={result.totals} format={format} words={words} />
      </div>

      {result.invoices.length > 0 && (
        <div className="mt-8">
          <InvoiceTable
            invoices={result.invoices}
            format={format}
            words={words}
          />
        </div>
      )}

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Magnet>
          <a
            href={excelUrl}
            download={result.filename}
            className={btn("primary")}
          >
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

const CfdiLab = () => {
  const { CFDI_LAB: words, DATES, FACTURA_PROJECT, UI } = useContent();
  const lang = useLang();
  const notify = useToast();
  useDocumentTitle(words.title);

  // Borde eléctrico: WebGL se comprueba la primera vez que hace falta
  const [glow, setGlow] = useState(false);
  const armedRef = useRef(false);
  const armGlow = useCallback(() => {
    if (armedRef.current) return;
    armedRef.current = true;
    setGlow(hasHardwareWebGL());
  }, []);

  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | processing | done | error
  const [result, setResult] = useState(null);
  const [excelUrl, setExcelUrl] = useState("");
  const [dragging, setDragging] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [duration, setDuration] = useState(0);
  const abortRef = useRef(null);
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

  // Cancela una revisión en curso al salir de la página
  useEffect(() => () => abortRef.current?.abort(), []);

  // En hosting gratuito el backend se duerme: se despierta al abrir la demo
  useEffect(() => {
    fetch(`${API_URL}/api/health`).catch(() => {});
  }, []);

  // Libera la URL del Excel cuando cambia o al salir
  useEffect(
    () => () => {
      if (excelUrl) URL.revokeObjectURL(excelUrl);
    },
    [excelUrl],
  );

  // Al empezar y al terminar, el área de trabajo vuelve a la vista
  useEffect(() => {
    if (status !== "processing" && status !== "done") return;
    const el = workRef.current;
    if (!el || el.getBoundingClientRect().top >= 0) return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }, [status]);

  // Contador de segundos mientras se revisa
  useEffect(() => {
    if (status !== "processing") return undefined;
    const started = Date.now();
    const id = setInterval(
      () => setElapsed(Math.floor((Date.now() - started) / 1000)),
      1000,
    );
    return () => clearInterval(id);
  }, [status]);

  const addFiles = (incoming) => {
    if (!incoming?.length) return;
    const next = merge(files, incoming, words.errors);
    setFiles(next.files);
    setError(next.error);
    setStatus("idle");
  };

  const removeFile = (file) => {
    setFiles((list) => list.filter((f) => f !== file));
    setError("");
  };

  const loadSamples = async () => {
    setStatus("loading");
    setError("");
    try {
      const loaded = await Promise.all(
        SAMPLE_FILES.map(async (name) => {
          const res = await fetch(SAMPLE_DIR + encodeURIComponent(name));
          if (!res.ok) throw new Error(name);
          return new File([await res.blob()], name, { type: "text/xml" });
        }),
      );
      setFiles(loaded);
      setStatus("idle");
      notify(words.sampleLoaded, words.sampleDetail);
    } catch {
      setStatus("idle");
      setError(words.sampleFailed);
    }
  };

  const resetAll = () => {
    abortRef.current?.abort();
    setFiles([]);
    setError("");
    setResult(null);
    setExcelUrl("");
    setStatus("idle");
  };

  const cancel = () => abortRef.current?.abort();

  const handleReview = async () => {
    if (!files.length) return;
    const controller = new AbortController();
    abortRef.current = controller;
    const startedAt = performance.now();
    setElapsed(0);
    setStatus("processing");
    setError("");

    try {
      const body = new FormData();
      files.forEach((file) => body.append("files", file, file.name));
      // ?lang=: el Excel y los errores, en el idioma de la página
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

      const data = await res.json();
      setDuration((performance.now() - startedAt) / 1000);
      setExcelUrl(URL.createObjectURL(base64ToBlob(data.excel, XLSX)));
      setResult(data);
      setStatus("done");
      const flagged =
        data.invoices.filter((invoice) => invoice.alerts.length).length +
        data.unreadable.length;
      notify(words.toastDone, words.toastDetail(flagged));
    } catch (err) {
      if (err.name === "AbortError") {
        setStatus("idle"); // el visitante canceló: sin mensaje de error
        return;
      }
      setStatus("error");
      setError(err instanceof TypeError ? words.errors.network : err.message);
    }
  };

  const step = status === "done" ? 3 : files.length ? 2 : 1;
  const totalSize = files.reduce((sum, file) => sum + file.size, 0);

  return (
    <div className="grain font-body min-h-screen bg-[color:var(--ink)] text-[color:var(--text)]">
      <LabHeader topic="cfdi" />

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
            <Eyebrow>FacturaCheck</Eyebrow>
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
              {words.facts(MAX_FILES).map((fact) => (
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
              {/* Paso 3: revisión lista */}
              {status === "done" && result && (
                <Result
                  result={result}
                  excelUrl={excelUrl}
                  duration={duration}
                  onReset={resetAll}
                  words={words}
                  locale={DATES.locale}
                />
              )}

              {/* Paso 1: subir */}
              {!files.length && status !== "done" && (
                <>
                  <Dropzone
                    dragging={dragging}
                    setDragging={setDragging}
                    onFiles={addFiles}
                    glow={glow}
                    onArm={armGlow}
                    words={words}
                    accept={ACCEPTED}
                    multiple
                    note={words.limits(MAX_FILES, MAX_MB)}
                  />
                  {error && <ErrorAlert>{error}</ErrorAlert>}
                  <p className="mt-5 text-center text-sm text-[color:var(--muted)]">
                    {words.noFiles}{" "}
                    <button
                      type="button"
                      onClick={loadSamples}
                      disabled={status === "loading"}
                      className={`rounded font-medium text-[color:var(--accent)] underline underline-offset-4 transition-colors hover:text-[color:var(--text)] disabled:opacity-60 ${focusRing}`}
                    >
                      {words.sample}
                    </button>{" "}
                    ·{" "}
                    <a
                      href={SAMPLE_ZIP}
                      download
                      className={`rounded underline underline-offset-4 transition-colors hover:text-[color:var(--text)] ${focusRing}`}
                    >
                      {words.sampleZip}
                    </a>
                  </p>
                </>
              )}

              {/* Paso 2: archivos elegidos */}
              {files.length > 0 &&
                (status === "idle" ||
                  status === "loading" ||
                  status === "error") && (
                  <>
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                      <p className="text-sm text-[color:var(--soft)]">
                        {words.selected(files.length)} · {formatSize(totalSize)}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <label
                          className={`${btn("secondary", "sm")} cursor-pointer focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[color:var(--accent)]`}
                        >
                          <input
                            type="file"
                            accept={ACCEPTED.join(",")}
                            multiple
                            className="sr-only"
                            onChange={(e) => {
                              addFiles(e.target.files);
                              e.target.value = "";
                            }}
                          />
                          {words.add}
                        </label>
                        <button
                          type="button"
                          onClick={resetAll}
                          className={btn("secondary", "sm")}
                        >
                          {words.clear}
                        </button>
                      </div>
                    </div>
                    <FileList
                      files={files}
                      onRemove={removeFile}
                      words={words}
                    />
                    {error && <ErrorAlert>{error}</ErrorAlert>}
                    <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-[color:var(--line)] pt-6">
                      <Magnet>
                        <button
                          type="button"
                          onClick={handleReview}
                          className={btn("primary")}
                        >
                          {status === "error" ? words.retry : words.review}
                          <ArrowRightIcon className="h-4 w-4" />
                        </button>
                      </Magnet>
                      <p className="max-w-md text-sm text-[color:var(--muted)]">
                        {words.willCheck}
                      </p>
                    </div>
                  </>
                )}

              {/* Revisando */}
              {status === "processing" && (
                <div className="space-y-5">
                  <div className="rounded-xl border border-[color:var(--line)] bg-[color:var(--ink)] p-4 md:p-5">
                    <div className="text-[color:var(--text)]">
                      <LatticeLoader
                        label={words.checking}
                        pattern="orbit"
                        color="#D4B27A"
                        glow
                        glowColor="#D4B27A"
                        fontSize={15}
                      />
                    </div>
                    <ul className="mt-4 space-y-1.5 text-sm text-[color:var(--soft)]">
                      {words.workingSteps.map((text) => (
                        <li key={text} className="flex items-center gap-2.5">
                          <span
                            aria-hidden="true"
                            className="h-1.5 w-1.5 rounded-full bg-[color:var(--accent)]"
                          />
                          {text}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-4 text-sm text-[color:var(--muted)]">
                      {elapsed >= 15 ? words.slow : words.wait}
                    </p>
                  </div>
                  <FileList files={files} words={words} />
                  <button
                    type="button"
                    onClick={cancel}
                    className={btn("secondary")}
                  >
                    {words.cancel}
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* Información */}
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <SpotlightCard className={`${card} p-6`}>
              <h2 className="font-display text-lg font-semibold">
                {words.whatItChecks}
              </h2>
              <ul className="mt-4 space-y-3 text-sm text-[color:var(--soft)]">
                {words.checks.map((check) => (
                  <li key={check} className="flex gap-3">
                    <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--accent)]" />
                    <span>{check}</span>
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
                  .rules(MAX_FILES, MAX_MB, PER_HOUR)
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
                {words.privacy}
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
                <TalkButton topic="cfdi" />
                <VideoButton
                  url={FACTURA_PROJECT.video}
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

export default CfdiLab;
