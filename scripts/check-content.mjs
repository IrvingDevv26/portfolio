// Verifica que src/content/es.js y en.js tengan la misma forma: mismas
// exportaciones, mismas llaves, listas del mismo largo y funciones en los
// mismos lugares. Así ningún texto falta en un idioma. Corre en el CI.
import * as en from "../src/content/en.js";
import * as es from "../src/content/es.js";

const problems = [];

// Listas que pueden medir distinto en cada idioma: palabras resaltadas
const FREE_LENGTH = /\.highlight$/;

const kind = (value) =>
  Array.isArray(value) ? "array" : value === null ? "null" : typeof value;

const compare = (a, b, path) => {
  if (kind(a) !== kind(b)) {
    problems.push(`${path}: ${kind(a)} en es, ${kind(b)} en en`);
    return;
  }
  if (Array.isArray(a)) {
    if (FREE_LENGTH.test(path)) return;
    if (a.length !== b.length) {
      problems.push(`${path}: ${a.length} elementos en es, ${b.length} en en`);
    }
    a.slice(0, b.length).forEach((item, i) => compare(item, b[i], `${path}[${i}]`));
  } else if (kind(a) === "object") {
    const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
    for (const key of keys) {
      if (!(key in a)) problems.push(`${path}.${key}: falta en es`);
      else if (!(key in b)) problems.push(`${path}.${key}: falta en en`);
      else compare(a[key], b[key], `${path}.${key}`);
    }
  } else if (typeof a === "function" && a.length !== b.length) {
    problems.push(`${path}: recibe ${a.length} valores en es y ${b.length} en en`);
  }
};

compare({ ...es }, { ...en }, "content");

if (problems.length) {
  console.error(`El contenido en inglés y en español no coincide:\n- ${problems.join("\n- ")}`);
  process.exit(1);
}
console.log("Contenido en español e inglés con la misma forma.");
