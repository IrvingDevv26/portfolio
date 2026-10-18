import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

/* Una página HTML por ruta e idioma, cada una con su propia vista previa al
   compartir el enlace (WhatsApp, LinkedIn, X…). Esos servicios no ejecutan
   JavaScript: leen las etiquetas del HTML tal cual llega. Al compilar,
   index.html (la portada en español) se copia como en.html,
   demo/agenda.html, en/demo/agenda.html… con su título, descripción, imagen
   e idioma, y todas se enlazan entre sí con hreflang para que los buscadores
   muestren el idioma correcto. Cloudflare Pages sirve cada archivo en su ruta
   (/en, /demo/agenda…) y la app carga igual que en cualquier otra. */
const PAGES = [
  // La portada en español es index.html: sólo se le agregan los enlaces hreflang
  { path: "", lang: "es", group: "home" },
  {
    path: "en",
    lang: "en",
    group: "home",
    title: "Irving Dávila — AI automation and full-stack development",
    description:
      "Irving Dávila designs and builds B2B tools that turn manual work into automated data flows with AI APIs, FastAPI, React and Linux servers.",
    image: "og-image-en.jpg",
  },
  {
    path: "demo/agenda",
    lang: "es",
    group: "agenda",
    title: "AgendaFlow — Demo en vivo · Irving Dávila",
    description:
      "Un agente de IA que agenda, cambia y cancela citas como por WhatsApp. Pruébalo con una clínica de ejemplo y mira la agenda actualizarse en vivo.",
    image: "og-agenda.jpg",
  },
  {
    path: "en/demo/agenda",
    lang: "en",
    group: "agenda",
    title: "AgendaFlow — Live demo · Irving Dávila",
    description:
      "An AI agent that books, reschedules and cancels appointments over WhatsApp. Try it with a sample clinic and watch the calendar update live.",
    image: "og-agenda-en.jpg",
  },
  {
    path: "demo/datarefine",
    lang: "es",
    group: "datarefine",
    title: "DataRefine — Demo en vivo · Irving Dávila",
    description:
      "Sube un Excel o CSV desordenado y descárgalo limpio: fechas, montos, nombres y duplicados corregidos con reglas e IA, en segundos.",
    image: "og-datarefine.jpg",
  },
  {
    path: "en/demo/datarefine",
    lang: "en",
    group: "datarefine",
    title: "DataRefine — Live demo · Irving Dávila",
    description:
      "Upload a messy Excel or CSV file and download it clean: dates, amounts, names and duplicates fixed with rules and AI, in seconds.",
    image: "og-datarefine-en.jpg",
  },
  {
    path: "demo/cfdi",
    lang: "es",
    group: "cfdi",
    title: "FacturaCheck — Demo en vivo · Irving Dávila",
    description:
      "Sube tus CFDI en XML o el ZIP del SAT: cada factura se consulta en el SAT y recibes un Excel con canceladas, duplicadas, lista 69-B y totales de IVA.",
    image: "og-cfdi.jpg",
  },
  {
    path: "en/demo/cfdi",
    lang: "en",
    group: "cfdi",
    title: "FacturaCheck — Live demo · Irving Dávila",
    description:
      "Upload Mexican e-invoices (CFDI) as XML or the SAT's ZIP: each one is checked with the SAT and you get an Excel file with cancelled and duplicate invoices and tax totals.",
    image: "og-cfdi-en.jpg",
  },
];

// Textos fijos de index.html que cambian en inglés (pantalla de carga y aviso
// sin JavaScript)
const ENGLISH_SHELL = [
  ['aria-label="Cargando"', 'aria-label="Loading"'],
  [
    "Irving Dávila — Automatización con IA y desarrollo full-stack. Activa JavaScript para ver el sitio.",
    "Irving Dávila — AI automation and full-stack development. Turn on JavaScript to see the site.",
  ],
];

const escape = (text) =>
  text.replace(
    /[&<>"]/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c],
  );

// Cambia el valor de un atributo en la etiqueta que lo contiene. Falla si no
// la encuentra, para no publicar en silencio una página incompleta
const replace = (html, pattern, value) => {
  if (!pattern.test(html))
    throw new Error(`page-previews: no encontré ${pattern}`);
  return html.replace(pattern, (_, start, end) => start + value + end);
};

const swap = (html, from, to) => {
  if (!html.includes(from))
    throw new Error(`page-previews: no encontré ${from}`);
  return html.replace(from, to);
};

const meta = (key) =>
  new RegExp(`(<meta\\s+(?:name|property)="${key}"\\s+content=")[^"]*(")`);

// La misma página en los dos idiomas (y la española como opción por defecto)
const alternates = (page, site) => {
  const urlOf = (p) => `${site}/${p.path}`.replace(/\/$/, "/");
  const family = PAGES.filter((p) => p.group === page.group);
  const links = family.map(
    (p) => `<link rel="alternate" hreflang="${p.lang}" href="${urlOf(p)}" />`,
  );
  const spanish = family.find((p) => p.lang === "es");
  links.push(
    `<link rel="alternate" hreflang="x-default" href="${urlOf(spanish)}" />`,
  );
  return `    ${links.join("\n    ")}\n  </head>`;
};

function pagePreviews() {
  let outDir;
  return {
    name: "page-previews",
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
      for (const page of PAGES) {
        let html = index;
        if (page.title) {
          const url = `${site}/${page.path}`;
          const image = `${site}/${page.image}`;
          html = replace(html, /(<title>)[^<]*(<\/title>)/, escape(page.title));
          html = replace(html, meta("description"), escape(page.description));
          html = replace(html, /(<link rel="canonical" href=")[^"]*(")/, url);
          html = replace(html, meta("og:url"), url);
          html = replace(html, meta("og:title"), escape(page.title));
          html = replace(
            html,
            meta("og:description"),
            escape(page.description),
          );
          html = replace(html, meta("og:image"), image);
          html = replace(html, meta("twitter:image"), image);
        }
        if (page.lang === "en") {
          html = swap(html, '<html lang="es">', '<html lang="en">');
          for (const [from, to] of ENGLISH_SHELL) html = swap(html, from, to);
        }
        html = swap(html, "</head>", alternates(page, site));
        const file = resolve(outDir, `${page.path || "index"}.html`);
        mkdirSync(dirname(file), { recursive: true });
        writeFileSync(file, html);
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), pagePreviews()],
});
