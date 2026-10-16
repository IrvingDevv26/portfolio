import { strFromU8, unzipSync } from "fflate";

/* Lectura y diagnóstico de hojas de cálculo en el navegador: la demo muestra
   una vista previa del archivo y cuenta los problemas típicos antes y después
   de limpiarlo. Lee CSV y XLSX; los .xls (formato binario antiguo) no tienen
   vista previa, pero DataRefine los procesa igual. Nada sale del navegador. */

const MAX_ROWS = 5000; // filas que se analizan como máximo

/* ── CSV ──────────────────────────────────────────────────── */

// UTF-8 si es válido; si no, la codificación clásica de Excel en Windows
const decode = (buffer) => {
  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(buffer);
  } catch {
    return new TextDecoder("windows-1252").decode(buffer);
  }
};

const detectDelimiter = (line) =>
  [",", ";", "\t"]
    .map((d) => [d, line.split(d).length])
    .sort((a, b) => b[1] - a[1])[0][0];

export const parseCSV = (input) => {
  const text = input.replace(/^\uFEFF/, "");
  const delimiter = detectDelimiter(text.split(/\r?\n/, 1)[0]);
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;

  for (let i = 0; i < text.length && rows.length <= MAX_ROWS; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch !== '"') field += ch;
      else if (text[i + 1] === '"') {
        field += '"';
        i++;
      } else quoted = false;
    } else if (ch === '"' && field === "") quoted = true;
    else if (ch === delimiter) {
      row.push(field);
      field = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else field += ch;
  }
  if (field || row.length) rows.push([...row, field]);
  return rows;
};

/* ── XLSX ─────────────────────────────────────────────────── */

const xml = (bytes) =>
  new DOMParser().parseFromString(strFromU8(bytes), "application/xml");
const all = (node, tag) => Array.from(node.getElementsByTagNameNS("*", tag));
// Texto de una celda o cadena compartida (sin la guía fonética <rPh>)
const textOf = (node) =>
  all(node, "t")
    .filter((t) => t.parentNode.localName !== "rPh")
    .map((t) => t.textContent)
    .join("");

const colIndex = (ref) => {
  let n = 0;
  for (const ch of ref.replace(/\d+$/, "")) n = n * 26 + ch.charCodeAt(0) - 64;
  return n - 1;
};

// Ruta de la primera hoja según el libro; si falla, la primera que exista
const firstSheet = (files) => {
  try {
    const sheet = all(xml(files["xl/workbook.xml"]), "sheet")[0];
    const id = Array.from(sheet.attributes).find(
      (a) => a.localName === "id",
    )?.value;
    const target = all(xml(files["xl/_rels/workbook.xml.rels"]), "Relationship")
      .find((r) => r.getAttribute("Id") === id)
      ?.getAttribute("Target");
    const path = target?.startsWith("/") ? target.slice(1) : `xl/${target}`;
    if (files[path]) return path;
  } catch {
    /* se usa la primera hoja que exista */
  }
  return Object.keys(files)
    .filter((k) => /^xl\/worksheets\/sheet\d+\.xml$/.test(k))
    .sort()[0];
};

// Estilos de celda: cuáles son fechas (Excel guarda las fechas como números)
// y cuáles muestran decimales fijos ("#,##0.00"), para verlos como en Excel
const BUILTIN_DATES = new Set([14, 15, 16, 17, 18, 19, 20, 21, 22, 45, 46, 47]);
const BUILTIN_DECIMALS = { 2: "0.00", 4: "#,##0.00" };
const cellStyles = (files) => {
  const dates = new Set();
  const decimals = new Map(); // índice de estilo → { places, grouping }
  if (!files["xl/styles.xml"]) return { dates, decimals };
  const doc = xml(files["xl/styles.xml"]);
  const custom = new Map(
    all(doc, "numFmt").map((n) => [
      Number(n.getAttribute("numFmtId")),
      n.getAttribute("formatCode") ?? "",
    ]),
  );
  const xfs = all(doc, "cellXfs")[0];
  Array.from(xfs?.children ?? []).forEach((xf, i) => {
    const id = Number(xf.getAttribute("numFmtId") ?? 0);
    const code = custom.get(id);
    const isDate =
      code === undefined
        ? BUILTIN_DATES.has(id)
        : /[dy]/i.test(code.replace(/\[[^\]]*\]|"[^"]*"/g, ""));
    if (isDate) dates.add(i);
    const number = (code ?? BUILTIN_DECIMALS[id] ?? "").match(/0\.(0+)/);
    if (!isDate && number) {
      decimals.set(i, {
        places: number[1].length,
        grouping: /#,##0|0,0/.test(code ?? BUILTIN_DECIMALS[id]),
      });
    }
  });
  return { dates, decimals };
};

const fromSerial = (serial) => {
  const date = new Date(Date.UTC(1899, 11, 30) + Math.round(serial * 864e5));
  return date.toISOString().slice(0, 10);
};

export const parseXLSX = (buffer) => {
  const files = unzipSync(new Uint8Array(buffer), {
    filter: (f) => f.name.startsWith("xl/") && /\.(xml|rels)$/.test(f.name),
  });
  const shared = files["xl/sharedStrings.xml"]
    ? all(xml(files["xl/sharedStrings.xml"]), "si").map(textOf)
    : [];
  const { dates, decimals } = cellStyles(files);
  const path = firstSheet(files);
  if (!path) return [];

  const rows = [];
  for (const rowEl of all(xml(files[path]), "row")) {
    if (rows.length > MAX_ROWS) break;
    const row = [];
    let next = 0;
    for (const c of all(rowEl, "c")) {
      const ref = c.getAttribute("r");
      const col = ref ? colIndex(ref) : next;
      next = col + 1;
      const type = c.getAttribute("t");
      const v = all(c, "v")[0]?.textContent ?? "";
      if (type === "s") row[col] = shared[Number(v)] ?? "";
      else if (type === "inlineStr") row[col] = textOf(c);
      else if (type === "b") row[col] = v === "1" ? "VERDADERO" : "FALSO";
      else if (type === "str" || type === "e" || v === "") row[col] = v;
      else {
        const style = Number(c.getAttribute("s") ?? -1);
        const fixed = decimals.get(style);
        if (dates.has(style)) row[col] = fromSerial(Number(v));
        else if (fixed) {
          // Como lo muestra Excel: "1,200.50"
          row[col] = Number(v).toLocaleString("en-US", {
            minimumFractionDigits: fixed.places,
            maximumFractionDigits: fixed.places,
            useGrouping: fixed.grouping,
          });
        } else row[col] = Number(v); // número con tipo: ya está limpio
      }
    }
    rows.push(Array.from(row, (x) => x ?? ""));
  }
  return rows;
};

/** Filas del archivo (texto, o números si la celda de Excel es numérica), o
    null si no se puede previsualizar (.xls o archivo dañado). */
export const readSheet = async (blob, name = blob.name) => {
  const ext = name.split(".").pop().toLowerCase();
  try {
    if (ext === "csv") return parseCSV(decode(await blob.arrayBuffer()));
    if (ext === "xlsx") return parseXLSX(await blob.arrayBuffer());
  } catch {
    /* sin vista previa */
  }
  return null;
};

/* ── Diagnóstico ──────────────────────────────────────────── */

const PLACEHOLDERS = new Set([
  "",
  "n/a",
  "na",
  "null",
  "none",
  "nan",
  "-",
  "--",
  "—",
  "?",
  "#n/a",
  "sin dato",
  "sin datos",
  "vacio",
  "vacío",
  "(vacío)",
  "(vacio)",
]);
const MONTHS = {
  ene: 1,
  jan: 1,
  feb: 2,
  mar: 3,
  abr: 4,
  apr: 4,
  may: 5,
  jun: 6,
  jul: 7,
  ago: 8,
  aug: 8,
  sep: 9,
  oct: 10,
  nov: 11,
  dic: 12,
  dec: 12,
};

const plain = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
const isBlank = (v) => PLACEHOLDERS.has(v.trim().toLowerCase());
const pad2 = (n) => String(n).padStart(2, "0");

const buildDate = (y, m, d) => {
  const year = y < 100 ? 2000 + y : y;
  // Día y mes al revés (formato de EE. UU.) cuando no hay otra lectura válida
  if (m > 12 && d <= 12) [m, d] = [d, m];
  if (m < 1 || m > 12 || d < 1 || d > 31) return null;
  return `${year}-${pad2(m)}-${pad2(d)}`;
};

/** Fecha reconocida → "AAAA-MM-DD"; null si no parece fecha. Día primero,
    como se escribe en México. */
export const toISODate = (raw) => {
  const s = plain(raw.trim());
  let m = s.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/);
  if (m) return buildDate(+m[1], +m[2], +m[3]);
  m = s.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{2}|\d{4})$/);
  if (m) return buildDate(+m[3], +m[2], +m[1]);
  m = s.match(
    /^(\d{1,2})[\s-]*(?:de\s+)?([a-z]{3,})\.?[\s-]*(?:de\s+|del\s+)?(\d{2}|\d{4})$/,
  );
  const month = m && MONTHS[m[2].slice(0, 3)];
  return month ? buildDate(+m[3], month, +m[1]) : null;
};

/** Monto o número reconocido; null si no lo es. */
export const toNumber = (raw) => {
  const s = raw.trim().replace(/\s|\$|€|mxn|usd/gi, "");
  if (!/^-?[\d.,]*\d[\d.,]*$/.test(s)) return null;
  const comma = s.lastIndexOf(",");
  const dot = s.lastIndexOf(".");
  let normal = s;
  if (comma > -1 && dot > -1) {
    normal =
      comma > dot
        ? s.replace(/\./g, "").replace(",", ".")
        : s.replace(/,/g, "");
  } else if (comma > -1) {
    normal = /^-?\d{1,3}(,\d{3})+$/.test(s)
      ? s.replace(/,/g, "")
      : s.replace(",", ".");
  }
  const n = Number(normal);
  return Number.isFinite(n) ? n : null;
};

const hasLetters = (v) => /[a-záéíóúñü]/i.test(v);
const isWordy = (v) => hasLetters(v) && !/[\d@/\\]/.test(v);
const text = (v) => (typeof v === "number" ? String(v) : v);

// Estilo de mayúsculas de un texto
const PARTICLES = new Set([
  "de",
  "del",
  "la",
  "las",
  "los",
  "y",
  "e",
  "da",
  "van",
  "von",
]);
const caseOf = (v) => {
  const words = v.trim().split(/\s+/);
  if (v === v.toUpperCase()) return "upper";
  if (v === v.toLowerCase()) return "lower";
  const title = words.every(
    (w, i) =>
      (i > 0 && PARTICLES.has(w)) ||
      (w[0] === w[0].toUpperCase() && w.slice(1) === w.slice(1).toLowerCase()),
  );
  return title ? "title" : "mixed";
};

// Forma de una fecha ("99/99/99", "9999-99-99"…) o de un monto (moneda y
// decimales): dentro de una columna, todas deberían escribirse igual
const ISO_SHAPE = "9999-99-99";
const shapeOf = (v, kind) => {
  if (typeof v === "number") return "typed";
  const s = plain(v.trim());
  if (kind === "date") return s.replace(/\d/g, "9").replace(/[a-z]+/g, "a");
  const decimals = s.match(/[.,](\d{1,2})$/);
  return `${/[$€]|mxn|usd/.test(s) ? "$" : ""}${decimals ? decimals[1].length : 0}`;
};
const dominant = (shapes) => {
  const tally = new Map();
  shapes.forEach((x) => tally.set(x, (tally.get(x) ?? 0) + 1));
  return [...tally].sort(
    (a, b) => b[1] - a[1] || (b[0] === ISO_SHAPE) - (a[0] === ISO_SHAPE),
  )[0]?.[0];
};

// Tipo dominante de una columna (≥ 60 % de sus valores con dato)
const columnKind = (values) => {
  const filled = values.filter((v) => !isBlank(v));
  if (!filled.length) return "empty";
  const share = (test) => filled.filter(test).length / filled.length;
  if (share((v) => toISODate(v) !== null) >= 0.6) return "date";
  if (share((v) => toNumber(v) !== null) >= 0.6) return "number";
  if (share(isWordy) >= 0.6) return "text";
  return "other";
};

/** Tipos de problema, en el orden en que se muestran. */
export const ISSUE_TYPES = ["dup", "empty", "format", "case", "spaces"];

/** Nombre, explicación y color de cada tipo de problema. */
export const ISSUES = {
  dup: {
    label: "Filas duplicadas",
    hint: "El mismo registro, escrito distinto",
    color: "#FF9AA8",
  },
  empty: {
    label: "Celdas vacías",
    hint: "Sin dato o con N/A",
    color: "#F2906B",
  },
  format: {
    label: "Formatos mixtos",
    hint: "Fechas y montos dispares",
    color: "#D4B27A",
  },
  case: {
    label: "Mayúsculas mezcladas",
    hint: "MAYÚSCULAS y minúsculas",
    color: "#C9B6F2",
  },
  spaces: {
    label: "Espacios sobrantes",
    hint: "Al inicio, al final o dobles",
    color: "#BCC1CB",
  },
};

/**
 * Diagnóstico de un archivo: encabezados, filas y problemas por celda.
 * - empty: celdas vacías o con marcadores como "N/A"
 * - spaces: espacios al inicio, al final o dobles
 * - case: mayúsculas mezcladas en una columna de texto
 * - format: fechas o montos escritos de forma distinta al resto de su columna
 * - dup: filas repetidas (comparando los valores ya normalizados)
 */
export const analyze = (allRows) => {
  const table = allRows.map((r) => r.map(text));
  const filled = (r) => r.some((v) => v.trim() !== "");
  const start = table.findIndex(filled);
  if (start === -1) return null;
  const headers = table[start].map((h, i) => h.trim() || `Columna ${i + 1}`);
  const width = headers.length;
  const raw = allRows
    .slice(start + 1)
    .filter((_, i) => filled(table[start + 1 + i]))
    .slice(0, MAX_ROWS)
    .map((r) => Array.from({ length: width }, (_, i) => r[i] ?? ""));
  const rows = raw.map((r) => r.map(text));

  const kinds = headers.map((_, c) => columnKind(rows.map((r) => r[c])));
  const usual = kinds.map((kind, c) =>
    kind === "date" || kind === "number"
      ? dominant(
          raw
            .map((r) => r[c])
            .filter((v) => !isBlank(text(v)))
            .map((v) => shapeOf(v, kind)),
        )
      : null,
  );
  // Columnas de texto con estilos de mayúsculas mezclados
  const mixedCase = kinds.map((kind, c) => {
    if (kind !== "text") return false;
    const styles = new Set(
      rows
        .map((r) => r[c])
        .filter((v) => !isBlank(v) && isWordy(v))
        .map(caseOf),
    );
    return styles.size > 1;
  });

  const flags = rows.map(() => Array.from({ length: width }, () => []));
  const counts = Object.fromEntries(ISSUE_TYPES.map((t) => [t, 0]));
  const flag = (r, c, type) => {
    flags[r][c].push(type);
    counts[type] += 1;
  };

  const normalize = (v, c) => {
    if (isBlank(v)) return "";
    if (kinds[c] === "date") return toISODate(v) ?? plain(v.trim());
    if (kinds[c] === "number") return String(toNumber(v) ?? plain(v.trim()));
    return plain(v).trim().replace(/\s+/g, " ");
  };

  const seen = new Set();
  const dupRows = new Set();
  rows.forEach((row, r) => {
    row.forEach((v, c) => {
      if (isBlank(v)) {
        flag(r, c, "empty");
        return;
      }
      if (v !== v.trim() || / {2,}/.test(v)) flag(r, c, "spaces");
      const shape = usual[c] && shapeOf(raw[r][c], kinds[c]);
      if (shape && shape !== "typed" && shape !== usual[c])
        flag(r, c, "format");
      if (mixedCase[c] && isWordy(v) && caseOf(v.trim()) !== "title")
        flag(r, c, "case");
    });
    const key = row.map(normalize).join("\u0001");
    if (seen.has(key)) {
      dupRows.add(r);
      counts.dup += 1;
    } else seen.add(key);
  });

  const total = ISSUE_TYPES.reduce((sum, t) => sum + counts[t], 0);
  return { headers, rows, flags, dupRows, counts, total, kinds };
};
