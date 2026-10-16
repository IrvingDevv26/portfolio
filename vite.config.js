import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

/* Vista previa propia para cada demo al compartir su enlace (WhatsApp,
   LinkedIn, X…). Esos servicios no ejecutan JavaScript: leen las etiquetas
   del HTML tal cual llega. Al compilar, index.html se copia como
   demo/<nombre>.html con su título, descripción e imagen, y Cloudflare Pages
   lo sirve en /demo/<nombre>; la app carga igual que en cualquier otra ruta. */
const DEMO_PAGES = [
  {
    path: "demo/agenda",
    title: "AgendaFlow — Demo en vivo · Irving Dávila",
    description:
      "Un agente de IA que agenda, cambia y cancela citas como por WhatsApp. Pruébalo con una clínica de ejemplo y mira la agenda actualizarse en vivo.",
    image: "og-agenda.jpg",
  },
  {
    path: "demo/datarefine",
    title: "DataRefine — Demo en vivo · Irving Dávila",
    description:
      "Sube un Excel o CSV desordenado y descárgalo limpio: fechas, montos, nombres y duplicados corregidos con reglas e IA, en segundos.",
    image: "og-datarefine.jpg",
  },
];

const escape = (text) =>
  text.replace(
    /[&<>"]/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c],
  );

// Cambia el valor de un atributo en la etiqueta que lo contiene. Falla si no
// la encuentra, para no publicar en silencio una vista previa incompleta
const replace = (html, pattern, value) => {
  if (!pattern.test(html))
    throw new Error(`demo-previews: no encontré ${pattern}`);
  return html.replace(pattern, (_, start, end) => start + value + end);
};

const meta = (key) =>
  new RegExp(`(<meta\\s+(?:name|property)="${key}"\\s+content=")[^"]*(")`);

function demoPreviews() {
  let outDir;
  return {
    name: "demo-previews",
    apply: "build",
    configResolved(config) {
      outDir = resolve(config.root, config.build.outDir);
    },
    closeBundle() {
      const index = readFileSync(resolve(outDir, "index.html"), "utf8");
      // La URL pública sale de la propia página (VITE_SITE_URL ya aplicado)
      const site = index.match(
        /<meta\s+property="og:url"\s+content="([^"]*?)\/?"/,
      )[1];
      for (const page of DEMO_PAGES) {
        const url = `${site}/${page.path}`;
        const image = `${site}/${page.image}`;
        let html = index;
        html = replace(html, /(<title>)[^<]*(<\/title>)/, escape(page.title));
        html = replace(html, meta("description"), escape(page.description));
        html = replace(html, /(<link rel="canonical" href=")[^"]*(")/, url);
        html = replace(html, meta("og:url"), url);
        html = replace(html, meta("og:title"), escape(page.title));
        html = replace(html, meta("og:description"), escape(page.description));
        html = replace(html, meta("og:image"), image);
        html = replace(html, meta("twitter:image"), image);
        const file = resolve(outDir, `${page.path}.html`);
        mkdirSync(dirname(file), { recursive: true });
        writeFileSync(file, html);
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), demoPreviews()],
});
