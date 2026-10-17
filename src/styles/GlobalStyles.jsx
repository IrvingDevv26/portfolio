/* Paleta y animaciones. Las fuentes se importan en main.jsx (Fontsource). */

const GlobalStyles = () => (
  <style>{`
    /* ── Paleta: grafito, plata y latón ─────────────────────────
       Neutros fríos que acompañan la tarjeta plateada y un único
       acento cálido (latón) que contrasta con el metal, como en un
       reloj. Sin azul. El botón principal es marfil, no de color. */
    :root {
      --ink: #08090C;                 /* fondo de página */
      --raised: #101217;              /* tarjetas y superficies */
      --glass: rgba(255,255,255,0.035);
      --line: rgba(255,255,255,0.08);
      --line-strong: rgba(255,255,255,0.16);

      --text: #F1F3F6;                /* blanco frío (≈ tarjeta) */
      --soft: #BCC1CB;                /* plata: texto secundario */
      --muted: #8A909C;               /* apoyos y etiquetas */
      --faint: #565C68;               /* solo decorativo */

      --accent: #D4B27A;              /* latón: enlaces, nombre, foco */
      --accent-bg: rgba(212,178,122,0.10);
      --accent-line: rgba(212,178,122,0.50);

      --btn: #F1F3F6;                 /* botón principal: marfil frío */
      --btn-hover: #FFFFFF;
      --btn-ink: #08090C;

      --clean: #7BDDB5;               /* dato limpio / listo */
      --clean-bg: rgba(123,221,181,0.10);
      --clean-line: rgba(123,221,181,0.40);
      --warn: #F2906B;                /* dato con problema (coral) */
      --warn-bg: rgba(242,144,107,0.12);
      --danger: #FF9AA8;
      --danger-bg: rgba(255,154,168,0.08);
      --danger-line: rgba(255,154,168,0.35);
    }

    html {
      scroll-behavior: smooth;
      scroll-padding-top: 5rem;
      background: var(--ink);
      color-scheme: dark;
    }
    ::selection { background: rgba(212,178,122,0.30); color: #fff; }

    * { scrollbar-width: thin; scrollbar-color: #2A2E37 transparent; }
    *::-webkit-scrollbar { width: 10px; height: 10px; }
    *::-webkit-scrollbar-thumb { background: #2A2E37; border-radius: 999px; border: 2px solid var(--ink); }
    *::-webkit-scrollbar-track { background: transparent; }

    .font-display { font-family: "Bricolage Grotesque Variable", system-ui, sans-serif; }
    .font-body { font-family: "Instrument Sans Variable", system-ui, sans-serif; -webkit-font-smoothing: antialiased; }
    .balance { text-wrap: balance; }

    /* Entrada del hero */
    @keyframes rise {
      from { opacity: 0; transform: translateY(14px); }
      to   { opacity: 1; transform: none; }
    }
    .rise { opacity: 0; animation: rise .7s cubic-bezier(.2,.7,.2,1) forwards; }

    /* Línea que recorre la tabla mientras la IA limpia el archivo (demo) */
    @keyframes scan {
      from { transform: translateY(-100%); }
      to   { transform: translateY(100%); }
    }
    .scan-line {
      position: absolute;
      inset: 0;
      pointer-events: none;
      background: linear-gradient(to bottom, rgba(212,178,122,0) 70%, rgba(212,178,122,0.14) 96%, rgba(243,227,195,0.55) 99.5%, rgba(212,178,122,0) 100%);
      animation: scan 2.4s cubic-bezier(.45,0,.55,1) infinite;
    }

    /* Aparición del check de "archivo listo" */
    @keyframes pop {
      from { opacity: 0; transform: scale(.7); }
      to   { opacity: 1; transform: none; }
    }
    .pop { animation: pop .45s cubic-bezier(.2,.9,.3,1.2) both; }

    /* Credencial ligera (sin WebGL): balanceo suave desde la correa */
    @keyframes badge-swing {
      0%, 100% { transform: translateX(-50%) rotate(-2.2deg); }
      50%      { transform: translateX(-50%) rotate(2.2deg); }
    }
    .badge-swing { transform-origin: top center; animation: badge-swing 6s ease-in-out infinite; }
    @media (prefers-reduced-motion: reduce) { .badge-swing { animation: none; } }

    /* Vitrina: oscurecimiento uniforme con el tono de la página */
    .showcase .scroll-expand__scrim { background: #08090C; }

    /* ScrollStack de proyectos: sin márgenes laterales propios */
    .projects-stack .scroll-stack__inner { padding-inline: 0; }

    /* Secciones fuera de pantalla: el navegador no las maqueta ni pinta
       hasta que se acercan (auto recuerda su alto real tras verlas) */
    /* Las secciones fuera de pantalla no se dibujan hasta acercarse. Mientras,
       ocupan una altura estimada: si se aleja mucho de la real, la página
       "brinca" al hacer scroll. Por eso cada sección declara su tamaño
       aproximado en móvil, tablet y escritorio (medido). */
    .cv { content-visibility: auto; contain-intrinsic-size: auto var(--cv-h, 900px); }
    /* Al saltar a una sección se dibujan todas para medir su alto real (src/lib/scroll.js) */
    .cv-measure .cv { content-visibility: visible; }
    .cv-s { --cv-h: 450px; }
    .cv-m { --cv-h: 1250px; }
    .cv-l { --cv-h: 1750px; }
    .cv-xl { --cv-h: 3300px; }
    @media (min-width: 768px) {
      .cv-s { --cv-h: 550px; }
      .cv-m { --cv-h: 1150px; }
      .cv-l { --cv-h: 1000px; }
      .cv-xl { --cv-h: 2500px; }
    }
    @media (min-width: 1024px) {
      .cv-s { --cv-h: 450px; }
      .cv-m { --cv-h: 850px; }
      .cv-l { --cv-h: 1000px; }
      .cv-xl { --cv-h: 1950px; }
    }

    /* Grano sutil sobre toda la página: quita lo "plano" del negro */
    .grain::after {
      content: "";
      position: fixed;
      inset: 0;
      z-index: 80;
      pointer-events: none;
      opacity: .035;
      background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
    }

    /* ── React Bits: ShinyText ── */
    .shiny-text {
      display: inline-block;
      color: rgba(188,193,203,0.78);
      background-image: linear-gradient(120deg, rgba(255,255,255,0) 40%, rgba(255,255,255,0.95) 50%, rgba(255,255,255,0) 60%);
      background-size: 200% 100%;
      -webkit-background-clip: text;
      background-clip: text;
      animation: shine 4s linear infinite;
    }
    @keyframes shine {
      0%   { background-position: 100%; }
      100% { background-position: -100%; }
    }

    /* ── React Bits: GradientText ── */
    .gradient-text {
      background-size: 300% 100%;
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      animation: gradient-pan 8s linear infinite;
    }
    .text-brass {
      background-image: linear-gradient(to right, #D4B27A, #F3E3C3, #B8925A, #F3E3C3, #D4B27A);
    }
    @keyframes gradient-pan {
      0%   { background-position: 0% 50%; }
      50%  { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }

    /* ── React Bits: SpotlightCard (+ borde que sigue al cursor) ── */
    .card-spotlight {
      position: relative;
      isolation: isolate;
      --mouse-x: 50%;
      --mouse-y: 50%;
    }
    .card-spotlight::before,
    .card-spotlight::after {
      content: "";
      position: absolute;
      inset: 0;
      border-radius: inherit;
      pointer-events: none;
      opacity: 0;
      transition: opacity .45s ease;
    }
    .card-spotlight::before {
      z-index: -1;
      background: radial-gradient(420px circle at var(--mouse-x) var(--mouse-y), var(--spotlight-color), transparent 70%);
    }
    .card-spotlight::after {
      padding: 1px;
      background: radial-gradient(260px circle at var(--mouse-x) var(--mouse-y), var(--spotlight-border), transparent 70%);
      -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
    }
    .card-spotlight:hover::before,
    .card-spotlight:focus-within::before,
    .card-spotlight:hover::after,
    .card-spotlight:focus-within::after { opacity: 1; }

    /* React Bits · Folder: que el título de la ficha nunca se encoja y
       que la descripción se lea bien sobre el papel claro */
    .folder-root .folder-doc-title { flex: none; font-size: calc(12px * var(--folder-scale)); }
    .folder-root .folder-doc-text { color: #4A4F59; margin-top: 0; }

    /* Texto con contorno (franja de velocidad) */
    .text-outline {
      color: transparent;
      -webkit-text-stroke: 1px rgba(241,243,246,0.28);
    }

    @media (prefers-reduced-motion: reduce) {
      html { scroll-behavior: auto; }
      .rise { animation: none; opacity: 1; }
      .scan-line { animation: none; display: none; }
      .pop { animation: none; }
      .shiny-text, .gradient-text { animation: none; }
    }
  `}</style>
);

export default GlobalStyles;
