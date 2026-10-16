<div align="center">

# Irving Dávila — Portfolio

**Full-stack developer · AI automation.**
A Spanish-language portfolio that sells by showing: a live AI data-cleaning demo, a 3D badge you can grab, and real projects.

[![CI](https://github.com/IrvingDevv26/portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/IrvingDevv26/portfolio/actions/workflows/ci.yml)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![three.js](https://img.shields.io/badge/three.js-000000?logo=threedotjs&logoColor=white)
![Lighthouse](https://img.shields.io/badge/Lighthouse-100_a11y_·_100_SEO-0CCE6B?logo=lighthouse&logoColor=white)

</div>

![Hero with the interactive 3D badge](docs/screenshots/hero.jpg)

> **Resumen en español.** Portfolio de Irving Dávila, desarrollador full-stack
> especializado en automatización con IA. Incluye una demo en vivo de
> **DataRefine** (sube un Excel desordenado y recíbelo limpio), una credencial 3D
> interactiva, calculadora del costo del trabajo manual, proyectos reales y un
> brief de proyecto para contacto. Hecho con React 19, Vite, Tailwind CSS 4 y
> 40 componentes de React Bits. Ver [Resumen en español](#resumen-en-español).

| Services | Live demo | Projects |
| --- | --- | --- |
| ![Services bento grid](docs/screenshots/services.jpg) | ![DataRefine live demo](public/demo-datarefine.jpg) | ![VillaNet project](docs/screenshots/projects.jpg) |

## Highlights

- **Live DataRefine demo** (`/demo/datarefine`): the file is diagnosed in the
  browser first (duplicates, empty cells, mixed formats, casing and spaces,
  highlighted cell by cell), then cleaned by the
  [DataRefine API](#related) and compared before and after. Public-demo limits
  are handled gracefully.
- **Interactive 3D badge** built with three.js and react-three-fiber, with a
  lightweight CSS fallback when the browser has no hardware WebGL.
- **Sales-oriented content**: manual-work cost calculator, case study with real
  numbers, process timeline, FAQ and a 3-step project brief.
- **Accessible and fast**: Lighthouse 100 for accessibility, best practices and
  SEO; 98 performance on desktop. `prefers-reduced-motion` is respected
  everywhere.
- **All copy in one file**: every text, link and project lives in
  `src/content.js`.

## Tech stack

| Area | Tools |
| --- | --- |
| UI | React 19, React Router 7, Tailwind CSS 4, framer-motion |
| 3D | three.js, @react-three/fiber, @react-three/drei |
| Components | [React Bits](https://reactbits.dev) (adapted to the site palette) |
| Data | fflate (reads `.xlsx` in the browser for the demo preview) |
| Tooling | Vite 8, ESLint, GitHub Actions |

## Getting started

Requires Node.js 22 or newer.

```bash
npm install
cp .env.example .env     # Windows: copy .env.example .env
npm run dev              # http://localhost:5173
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build in `dist/` |
| `npm run preview` | Serves the production build |
| `npm run lint` | ESLint |

### Environment variables

| Variable | Purpose |
| --- | --- |
| `VITE_API_URL` | DataRefine API used by the live demo (e.g. `http://localhost:8000`) |
| `VITE_SITE_URL` | Public site URL without trailing `/`, used for the canonical URL and social previews |

## Project structure

```
src/
  content.js            Every text, link, service and project
  pages/
    Landing.jsx         Home page sections
    DataLab.jsx         DataRefine live demo
    NotFound.jsx        404 page
  components/
    reactbits/          React Bits components adapted to the site
    Lanyard.jsx         3D badge (three.js)
    SheetPreview.jsx    Demo preview table and detected problems
    ...
  lib/
    sheet.js            In-browser CSV/XLSX reader and diagnosis
    hooks.js, gpu.js    Shared hooks and WebGL detection
  styles/
    GlobalStyles.jsx    Palette, fonts and global animations
public/                 Images, icons, social preview and manifest
```

## Performance

- Self-hosted fonts (Fontsource), no render-blocking Google Fonts CSS.
- Sections below the fold are lazy-loaded when they are about to be seen
  (`src/components/Deferred.jsx`) and use `content-visibility: auto`.
- The 3D badge mounts when the browser is idle and compiles its shaders in
  parallel; heavy WebGL effects in the demo are only created when needed.

## React Bits components

Adapted to the site palette and to `prefers-reduced-motion`, in
`src/components/reactbits/`:

| Component | Where |
| --- | --- |
| Lanyard | 3D badge in the hero |
| BlurText, RotatingText, ShinyText, GradientText, DecryptedText | Headlines, highlights and section labels |
| ScrollVelocity, ScrollReveal, AnimatedContent | Scroll-driven text and reveals |
| MagicBento | Services bento grid with mini visuals |
| ScrollExpand | Case study opening: the demo grows to full screen |
| CountUp, Counter, ElasticSlider | Case study numbers and cost calculator |
| Folder | Technical sheets of DataRefine |
| Stack, ScrollStack, GlareHover, PixelTransition | Projects section |
| TiltedCard, VariableProximity, BranchedMenu | About section |
| StatusMark, Stepper, ThoughtLine | Process timeline, project brief and demo steps |
| Squares, Crosshair | Backgrounds of contact and demo |
| ElectricBorder, AnimatedList, LatticeLoader | Live demo |
| StaggeredMenu, Magnet, StarBorder, ClickSpark | Navigation and buttons |
| SwipeToast, WarmTooltip, LogoLoop, CodeSlots, FuzzyText | Toasts, tooltips, stack logos, dev mode and 404 |

## Deployment

Static site, deployed on [Cloudflare Pages](https://pages.cloudflare.com):

| Setting | Value |
| --- | --- |
| Build command | `npm run build` |
| Output directory | `dist` |
| Environment | `VITE_API_URL`, `VITE_SITE_URL` |

Client-side routes such as `/demo/datarefine` work out of the box: without a
top-level `404.html`, Pages serves the app for every path.

## Related

- **DataRefine API** (private): FastAPI + pandas backend behind the live demo,
  with deterministic cleaning rules, free AI providers with validation and
  caching, and public-demo limits.

## Resumen en español

- **Qué es:** el portfolio de Irving Dávila, en español, pensado para vender
  servicios de automatización y desarrollo full-stack.
- **Lo más importante:** la demo en vivo de DataRefine
  (`/demo/datarefine`). Primero diagnostica tu archivo en el navegador y luego
  lo limpia con el backend, mostrando el antes y el después.
- **Cómo correrlo:** `npm install`, copia `.env.example` como `.env` y ejecuta
  `npm run dev`.
- **Dónde editar:** todos los textos, enlaces y proyectos están en
  `src/content.js`; la paleta y las animaciones globales en
  `src/styles/GlobalStyles.jsx`.

## License

© 2026 Irving de Jesús Dávila Torres. All rights reserved. The source code is
public for reference only; see [LICENSE](LICENSE). Third-party components keep
their own licenses (React Bits, Simple Icons, Fontsource fonts).
