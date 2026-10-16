/* ──────────────────────────────────────────────────────────────
   CONTENIDO — edita aquí, no en los componentes
   ────────────────────────────────────────────────────────────── */

export const PROFILE = {
  name: "Irving de Jesús Dávila Torres",
  shortName: "Irving Dávila",
  role: "Desarrollador full-stack · Automatización con IA",
  email: "irvingdevv26@hotmail.com",
  github: "https://github.com/IrvingDevv26",
  linkedin: "https://www.linkedin.com/in/irving-de-jesus-davila-torres",
};

export const NAV_LINKS = [
  { href: "#servicios", label: "Servicios" },
  { href: "#proyecto", label: "Proyectos" },
  { href: "#proceso", label: "Proceso" },
  { href: "#sobre-mi", label: "Sobre mí" },
  { href: "#contacto", label: "Contacto" },
];

/* ── Hero ───────────────────────────────────────────────────── */

export const HERO = {
  badge: "Disponible para nuevos proyectos",
  eyebrow: "Full-stack · IA aplicada",
  title: "Convierto trabajo manual en sistemas que trabajan solos.",
  highlight: ["trabajan", "solos"],
  rotatingPrefix: "Especializado en",
  rotating: [
    "limpieza de datos",
    "APIs con FastAPI",
    "flujos con IA",
    "servidores Linux",
    "redes MikroTik",
  ],
  lead: "Diseño y desarrollo herramientas B2B que transforman horas de trabajo repetitivo en flujos de datos automatizados: de la API a la interfaz, listas para producción en AWS o en tus propios servidores Linux.",
};

// Franjas en movimiento debajo del hero
export const MARQUEE = [
  "Automatización ✦ Limpieza de datos ✦ APIs de IA ✦ Servidores Linux ✦ Redes ✦",
  "FastAPI · Python · React · Tailwind CSS · AWS · Linux · Proxmox · APIs de IA ·",
];

/* ── Servicios ──────────────────────────────────────────────── */

export const SERVICES = [
  {
    icon: "workflow",
    title: "Automatización de procesos",
    text: "Identifico las tareas repetitivas de tu operación —captura, conciliación, reportes— y las convierto en flujos que corren solos y te avisan cuando algo necesita atención.",
    tags: ["Flujos", "Integraciones", "Reportes"],
  },
  {
    icon: "table",
    title: "Limpieza y estructuración de datos",
    text: "Normalizo formatos, elimino duplicados y detecto datos faltantes en archivos Excel y CSV con modelos de IA, para que tus decisiones partan de información confiable.",
    short: "Formatos unificados, duplicados fuera y datos faltantes marcados, con ayuda de IA.",
    tags: ["Excel / CSV", "Normalización", "IA"],
  },
  {
    icon: "code",
    title: "Aplicaciones full-stack",
    text: "Construyo APIs con FastAPI o CodeIgniter e interfaces en React o Vue, e integro APIs de IA para que tus herramientas analicen, clasifiquen y transformen información por ti.",
    short: "APIs en FastAPI o CodeIgniter, interfaces en React o Vue y APIs de IA integradas.",
    tags: ["FastAPI", "React", "Vue", "APIs de IA"],
  },
  {
    icon: "server",
    title: "Servidores e infraestructura",
    text: "Administro servidores Linux, entornos virtualizados con Proxmox y redes MikroTik con túneles WireGuard, y despliego en AWS cuando conviene: tu aplicación corre donde tiene más sentido.",
    short: "Servidores Linux, virtualización con Proxmox y redes MikroTik con WireGuard.",
    tags: ["Linux", "Proxmox", "MikroTik", "AWS"],
  },
];

/* ── Caso de estudio: DataRefine ────────────────────────────── */

export const PROJECT = {
  name: "DataRefine",
  video: "", // enlace de Loom con el recorrido de la demo (https://www.loom.com/share/...)
  tagline: "Limpieza de datos con IA para equipos que viven en Excel.",
  summary:
    "Sube un Excel o CSV con datos desordenados y recibe un archivo limpio y consistente, sin corregir celdas a mano.",
  challenge:
    "Los equipos de operación pierden horas corrigiendo nombres mal escritos, fechas en formatos distintos y registros duplicados antes de poder usar sus propios datos.",
  solution:
    "Un servicio en FastAPI que detecta qué contiene cada columna, corrige fechas, montos y duplicados con reglas en pandas y usa IA para pulir nombres y textos sin tocar tus cifras. Lo que falta queda marcado para revisión, y una interfaz en React lo hace todo en segundos.",
};

// Lo que hace el backend real (repositorio DataRefine)
export const DATAREFINE_FIXES = [
  "Unifica formatos de fecha, texto y montos",
  "Detecta y fusiona registros duplicados",
  "Marca los datos faltantes para revisión",
];

export const PROJECT_TAGS = ["FastAPI", "Python", "pandas", "React", "AWS", "APIs de IA"];

// Cifras reales de la demo (ver DataLab.jsx)
export const PROJECT_METRICS = [
  { value: 3, label: "formatos de entrada", detail: ".xlsx, .xls y .csv" },
  { value: 300, label: "filas por archivo en la demo", detail: "sin límite en tu versión" },
  { value: 3, label: "pasos de principio a fin", detail: "subir, limpiar y descargar" },
];

// Fichas técnicas dentro de la carpeta (Folder en el caso de estudio)
export const PROJECT_DOCS = [
  { title: "Arquitectura", description: "React → FastAPI → reglas en pandas + IA → .xlsx con formato y resumen." },
  { title: "Validaciones", description: "Demo pública: hasta 1 MB, 300 filas y 5 pruebas por hora por persona. Cada corrección de la IA se valida." },
  { title: "Resiliencia", description: "Si un modelo de IA está saturado prueba otro; si todos fallan, entrega el archivo con las reglas." },
];

export const STEPS = [
  {
    title: "Subes tu archivo",
    text: "Arrastra un Excel o CSV (en la demo, hasta 300 filas). Sin cuentas ni configuraciones.",
  },
  {
    title: "Reglas e IA lo limpian",
    text: "Reglas automáticas corrigen fechas, montos, espacios y duplicados; la IA pule nombres y textos sin tocar tus cifras.",
  },
  {
    title: "Descargas el resultado",
    text: "Recibes un .xlsx limpio, listo para tu análisis o para cargarlo a tu sistema.",
  },
];

/* ── Vitrina de la demo (ScrollExpand) ─────────────────────── */
// "video": ruta a un .mp4 en public/ (Loom permite descargarlo). Sin video se
// muestra la captura.

export const SHOWCASE = {
  poster: "/demo-datarefine.jpg",
  video: "",
};

/* ── Más proyectos (ScrollStack) ────────────────────────────── */

export const PROJECTS = [
  {
    name: "VillaNet",
    kind: "Plataforma SaaS · Redes",
    summary:
      "Gestión para proveedores de internet inalámbrico (WISP): altas de clientes, aprovisionamiento automático en routers MikroTik, facturación con pasarelas de pago y monitoreo de la red.",
    highlights: [
      "Configura routers MikroTik por la API de RouterOS, a través de túneles WireGuard",
      "Multi-tenant con JWT y credenciales cifradas con AES-256",
      "CI en GitHub Actions: PHPUnit, Vitest y búsqueda de secretos con gitleaks",
    ],
    tags: ["CodeIgniter 4", "Vue 3", "MySQL", "MikroTik", "WireGuard"],
    // Tarjetas arrastrables (Stack): diagramas reales del proyecto
    gallery: [
      { src: "/project-villanet.jpg", caption: "Despliegue: servidor local, relay WireGuard y nodos MikroTik" },
      { src: "/villanet-alta.jpg", caption: "Alta de cliente: de la interfaz al router en un solo flujo" },
      { src: "/villanet-pago.jpg", caption: "Cobro: webhook de la pasarela de pago y reactivación del servicio" },
    ],
    note: "Repositorio privado: te muestro el código y el sistema funcionando en una llamada.",
    video: "", // enlace de Loom (https://www.loom.com/share/...)
  },
];

/* ── Calculadora de costo del trabajo manual ───────────────── */

export const CALCULATOR = {
  title: "¿Cuánto te cuesta hoy el trabajo manual?",
  intro:
    "Mueve los valores con los datos de tu equipo. Es una estimación rápida para dimensionar el problema, no una cotización.",
  currency: "MXN",
  weeksPerYear: 48, // semanas laborales al año
};

/* ── Proceso de trabajo ─────────────────────────────────────── */

export const PROCESS = [
  {
    title: "Diagnóstico",
    text: "Revisamos juntos el proceso actual: qué se hace a mano, cuánto tiempo consume y dónde se generan los errores.",
  },
  {
    title: "Propuesta",
    text: "Defino alcance, arquitectura y entregables con tiempos claros, antes de escribir una sola línea de código.",
  },
  {
    title: "Construcción",
    text: "Desarrollo en iteraciones cortas con demos frecuentes, para que valides el avance con tus datos reales.",
  },
  {
    title: "Entrega y soporte",
    text: "Despliego en tu servidor o en la nube, documento el sistema y acompaño a tu equipo durante la adopción.",
  },
];

/* ── Stack ──────────────────────────────────────────────────── */

// Explorador de herramientas (BranchedMenu en "Sobre mí")
export const STACK = [
  {
    area: "Backend",
    items: [
      { name: "FastAPI", text: "APIs rápidas, tipadas y con documentación automática. Es el motor de DataRefine." },
      { name: "Python", text: "Procesamiento de datos, automatización de tareas y análisis geoespacial." },
      { name: "CodeIgniter 4", text: "API REST de VillaNet en PHP 8: JWT, filtros por rol y pruebas con PHPUnit." },
      { name: "MySQL", text: "Modelado multi-tenant de clientes, servicios, routers y facturas." },
    ],
  },
  {
    area: "Frontend",
    items: [
      { name: "React", text: "Interfaces interactivas y componentes reutilizables, como este sitio y la demo de DataRefine." },
      { name: "Vue 3", text: "SPA de VillaNet con Pinia y Vite, probada con Vitest." },
      { name: "Tailwind CSS", text: "Estilos consistentes y diseño responsivo sin perder velocidad de desarrollo." },
    ],
  },
  {
    area: "Infraestructura",
    items: [
      { name: "Linux", text: "Administración de servidores: configuración, servicios y despliegue de aplicaciones." },
      { name: "Proxmox", text: "Virtualización para alojar varios servicios aislados en un mismo servidor físico." },
      { name: "MikroTik", text: "Aprovisionamiento automático de clientes por la API de RouterOS." },
      { name: "WireGuard", text: "Túneles cifrados hacia nodos en campo, con un VPS como relay." },
      { name: "AWS", text: "Despliegue y alojamiento de aplicaciones en la nube cuando el proyecto lo pide." },
    ],
  },
  {
    area: "Datos e IA",
    items: [
      { name: "APIs de IA", text: "Integración de modelos de lenguaje vía API para analizar, clasificar y limpiar datos." },
      { name: "NumPy", text: "Cálculos numéricos y análisis de datos a gran escala." },
    ],
  },
];

/* ── Sobre mí ───────────────────────────────────────────────── */

export const ABOUT = {
  title: "Tecnología al servicio de la operación.",
  bio: [
    "Soy Irving Dávila, desarrollador full-stack enfocado en automatización con inteligencia artificial. Me especializo en encontrar los procesos que consumen horas de trabajo manual y convertirlos en herramientas confiables, fáciles de usar y listas para producción.",
    "He construido desde una plataforma SaaS que configura routers MikroTik de forma automática hasta herramientas que limpian datos con IA. Trabajo de punta a punta: del modelado de datos y las APIs en FastAPI a la interfaz en React y el despliegue en servidores Linux o en AWS. Me importa tanto que el código sea sólido como que la persona que lo usa entienda qué está pasando.",
  ],
  principles: [
    { title: "Claridad", text: "Explico cada decisión técnica en lenguaje de negocio." },
    { title: "Pragmatismo", text: "Elijo la solución más simple que resuelve el problema." },
    { title: "Calidad", text: "Código mantenible, documentado y listo para crecer." },
  ],
};

export const INTERESTS = [
  {
    title: "Alemán",
    text: "Lo estudio por gusto y lo practico siempre que puedo. Aprender un idioma también es entrenar la constancia.",
  },
  {
    title: "Aire libre",
    text: "Descubrir rutas nuevas me ayuda a despejarme y volver al teclado con mejores ideas.",
  },
  {
    title: "Fórmula 1",
    text: "Sigo la estrategia y la telemetría de cada carrera: ahí también se trata de leer datos para decidir mejor.",
  },
];

/* ── Modo desarrollador (CodeSlots en el pie de página) ─────────
   El PIN está impreso en el reverso de la credencial 3D (public/card-back.svg). */

export const DEV_MODE = {
  pin: "1024",
  title: "¿Encontraste el PIN?",
  hint: "Haz clic en la credencial del inicio para girarla: el código de acceso está en el reverso.",
  build: [
    ["Framework", "React 19 + Vite"],
    ["Estilos", "Tailwind CSS 4"],
    ["3D", "Three.js (credencial)"],
    ["Animación", "framer-motion"],
    ["Componentes", "React Bits"],
    ["Tipografía", "Bricolage Grotesque · Instrument Sans · JetBrains Mono"],
  ],
};

/* ── Brief de proyecto (Stepper en Contacto) ────────────────── */

export const BRIEF = {
  title: "Arma tu brief en un minuto",
  intro: "Tres preguntas rápidas y te dejo el correo listo para enviar.",
  areas: [
    "Reportes",
    "Limpieza de datos",
    "Captura manual",
    "Integración entre sistemas",
    "Otro",
  ],
  tools: ["Excel / Google Sheets", "ERP", "CRM", "Base de datos", "Sistema propio"],
  hours: ["Menos de 5 h", "De 5 a 20 h", "Más de 20 h", "No lo sé"],
};

/* ── Preguntas frecuentes ───────────────────────────────────── */

export const FAQ = [
  {
    q: "¿Cuánto cuesta un proyecto?",
    a: "Depende del alcance. Después de una primera conversación sin compromiso recibes una propuesta con precio, entregables y tiempos definidos, para que decidas con toda la información.",
  },
  {
    q: "¿Cuánto tiempo toma?",
    a: "Los tiempos quedan definidos en la propuesta. Trabajo en iteraciones cortas, así que ves avances funcionando desde el inicio y no solo al final.",
  },
  {
    q: "¿Necesito conocimientos técnicos?",
    a: "No. Hablamos en términos de tu operación: qué haces hoy, cuánto tiempo te toma y qué resultado esperas. Yo me encargo de traducirlo a tecnología.",
  },
  {
    q: "¿Dónde se aloja la solución?",
    a: "Donde tenga más sentido para ti: en tus propios servidores Linux, en un entorno virtualizado con Proxmox o en AWS. Siempre con documentación, para que no dependas de mí.",
  },
  {
    q: "¿Qué pasa con mis datos?",
    a: "Se usan solo para el proyecto. Si una solución envía información a servicios de IA, lo verás explicado en la propuesta antes de implementarlo.",
  },
  {
    q: "¿Hay soporte después de la entrega?",
    a: "Sí. Acompaño a tu equipo durante la adopción y podemos acordar soporte y mejoras continuas según lo que necesites.",
  },
];

/* ── Manifiesto (ScrollReveal) ──────────────────────────────── */

export const MANIFESTO = {
  text: "Cada hora que tu equipo pasa copiando, pegando y corrigiendo datos es una hora que no dedica a decidir. Mi trabajo es devolverte ese tiempo con herramientas que simplemente funcionan.",
  highlight: ["devolverte", "ese", "tiempo"],
};

/* ── Contacto ───────────────────────────────────────────────── */

export const CONTACT = {
  title: "¿Tienes un proceso manual que te roba",
  highlight: "horas cada semana?",
  text: "Cuéntame qué haces hoy a mano y te explico, sin compromiso, cómo lo automatizaría.",
};

/* ── Ejemplo animado de la landing (ilustrativo) ───────────────
   bad[i]    → la celda i tiene un problema antes de limpiar
   merged    → la fila es un duplicado que se fusiona con otra
   review[i] → después de limpiar, la celda queda marcada para revisión */
export const DEMO_FILE = "clientes_diciembre.xlsx";

export const DEMO_ROWS = [
  {
    before: ["  juan pérez ", "03/12/24", "$1,200.50"],
    after: ["Juan Pérez", "2024-12-03", "1,200.50"],
    bad: [true, true, true],
  },
  {
    before: ["JUAN PEREZ", "2024-12-03", "1200.5"],
    merged: true,
    bad: [true, false, true],
  },
  {
    before: ["maría  lópez", "12 mar 24", "(vacío)"],
    after: ["María López", "2024-03-12", "—"],
    bad: [true, true, true],
    review: [false, false, true],
  },
  {
    before: ["CARLOS RUIZ", "5-ene-2025", "950"],
    after: ["Carlos Ruiz", "2025-01-05", "950.00"],
    bad: [true, true, true],
  },
];

/* ── Archivo de ejemplo para la demo ───────────────────────────
   Permite que cualquiera pruebe DataRefine sin tener un Excel a la mano. */
const SAMPLE_CSV = `cliente,fecha,monto
"  juan pérez ",03/12/24,"$1,200.50"
JUAN PEREZ,2024-12-03,1200.5
maría  lópez,12 mar 24,
CARLOS RUIZ,5-ene-2025,950
ana  torres,2025/01/15,"$2,310.00"
Ana Torres,15-01-2025,2310
LUIS  hernández ,20 feb 25,"$780.9"
sofía MARTÍNEZ,2025-02-28,N/A
pedro  gómez,1/3/25,1.540
`;

export const makeSampleFile = () =>
  new File([SAMPLE_CSV], "clientes_ejemplo.csv", { type: "text/csv" });
