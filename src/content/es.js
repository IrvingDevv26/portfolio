/* ──────────────────────────────────────────────────────────────
   CONTENIDO EN ESPAÑOL — edita aquí, no en los componentes.
   La versión en inglés está en en.js y tiene la misma forma: si
   agregas o renombras algo aquí, hazlo también allá.
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
  { href: "#precios", label: "Precios" },
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
    "agentes de WhatsApp",
    "revisión de facturas",
    "limpieza de datos",
    "APIs con FastAPI",
    "flujos con IA",
  ],
  lead: "Hago herramientas para despachos contables, consultorios y pymes que convierten horas de trabajo repetitivo en procesos automáticos: revisión de facturas contra el SAT, citas por WhatsApp y reportes que se arman solos.",
  // Botones principales: uno por tipo de cliente
  ctas: [
    { label: "Soy contador", to: "/contadores" },
    { label: "Tengo un consultorio", to: "/consultorios" },
  ],
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

/* ── Caso de estudio y demo de AgendaFlow (/demo/agenda) ────── */

export const AGENDA_PROJECT = {
  name: "AgendaFlow",
  video: "", // enlace de Loom del recorrido de la demo
  tagline:
    "Un agente de IA que agenda, cambia y cancela citas como por WhatsApp, sin choques ni horarios inventados.",
  challenge:
    "Consultorios, salones y talleres pierden horas contestando mensajes para agendar, y un error al anotar una cita termina en choques de horario o pacientes que no llegan.",
  solution:
    "Un agente que conversa con el paciente y opera la agenda con herramientas que valida el backend: entiende fechas en lenguaje natural, ofrece solo horarios reales y confirma cada cita con un código.",
  tags: ["FastAPI", "Python", "Tool calling", "Gemini", "React"],
  metrics: [
    { value: 5, label: "herramientas validadas", detail: "consultar, agendar, buscar, cambiar y cancelar" },
    { value: 3, unit: "s", label: "por respuesta", detail: "en promedio, con IA gratuita" },
    { value: 60, label: "pruebas automáticas", detail: "reglas, agente, API y ambos idiomas" },
  ],
  steps: [
    {
      title: "Escribes como en WhatsApp",
      text: "El paciente pide su cita con sus palabras: «el jueves en la tarde», «la de las 4».",
    },
    {
      title: "La IA elige una herramienta",
      text: "Consulta horarios, agenda, cambia o cancela; si algo no se puede, lo explica y propone otra opción.",
    },
    {
      title: "El backend valida todo",
      text: "Horarios, choques y anticipación se revisan en código: la IA nunca escribe directo en la agenda.",
    },
  ],
  highlights: [
    "La IA conversa; el backend decide: horarios, choques y anticipación se validan en código",
    "Cada acción del agente queda registrada y visible, igual que en un sistema real",
    "Cada visitante tiene su propia agenda de prueba; nada se comparte ni se guarda",
  ],
  forBusiness: [
    "Puede atender tu WhatsApp Business las 24 horas",
    "Se sincroniza con Google Calendar o con tu sistema de citas",
    "Envía recordatorios y confirma asistencia un día antes",
  ],
};

/* ── Caso de estudio de FacturaCheck (/demo/cfdi) ───────────── */

export const FACTURA_PROJECT = {
  name: "FacturaCheck",
  video: "", // enlace de Loom del recorrido de la demo
  tagline:
    "Sube las facturas del mes y en segundos sabes cuáles están canceladas, duplicadas o vienen de un emisor que el SAT tiene en la mira.",
  challenge:
    "Al cierre de mes, los despachos contables revisan los CFDI uno por uno en el portal del SAT. Una factura cancelada o apócrifa que se cuela termina en una deducción rechazada y en horas de aclaraciones.",
  solution:
    "FacturaCheck lee los XML o el ZIP que descarga el SAT, consulta cada factura en el servicio oficial del SAT y entrega un Excel con las alertas y los totales de IVA e ISR, listo para la contabilidad.",
  tags: ["FastAPI", "Python", "XML", "SAT", "openpyxl", "React"],
  cta: "Probar FacturaCheck",
  catchesTitle: "Lo que detecta",
  // tone: color de la alerta (danger, warn, accent, soft o muted)
  catches: [
    { tone: "danger", title: "Canceladas", text: "El emisor la canceló en el SAT: ya no es deducible." },
    { tone: "warn", title: "No registradas", text: "El SAT no la tiene: puede ser apócrifa." },
    { tone: "danger", title: "Lista 69-B", text: "Emisores que el SAT señala por facturar operaciones simuladas." },
    { tone: "accent", title: "Cancelación pendiente", text: "El emisor pidió cancelarla y espera tu respuesta." },
    { tone: "soft", title: "Duplicadas", text: "La misma factura en dos archivos: se cuenta una sola vez." },
    { tone: "muted", title: "Borradores", text: "XML sin timbrar ni folio fiscal: no es una factura válida." },
  ],
  metrics: [
    { value: 6, label: "consultas al SAT a la vez", detail: "medio segundo por factura; si el SAT no responde, la revisión sigue" },
    { value: 4, label: "hojas en el Excel", detail: "resumen, comprobantes, totales por RFC y alertas" },
    { value: 37, label: "pruebas automáticas", detail: "lectura de XML, ZIP, consultas al SAT y API" },
  ],
  steps: [
    {
      title: "Subes tus facturas",
      text: "Los XML sueltos o el ZIP tal como lo descargas del portal del SAT, en versiones 4.0 y 3.3.",
    },
    {
      title: "Se consultan en el SAT",
      text: "Cada factura pasa por el mismo servicio del código QR: vigente, cancelada, no registrada o de un emisor en la lista 69-B.",
    },
    {
      title: "Recibes el reporte",
      text: "Un Excel con lo que necesita tu atención, los totales en pesos y el detalle por RFC, en español o inglés.",
    },
  ],
};

// Animación de la revisión para el caso de estudio (sin SAT real: la demo en
// vivo está en /demo/cfdi). Facturas tomadas de los ejemplos de la demo
export const FACTURA_DEMO = {
  file: "facturas_septiembre.zip",
  files: (n) => `${n} XML`,
  replay: "Ver otra vez",
  listLabel: "Facturas revisadas",
  queued: "En cola",
  checking: "Consultando SAT",
  states: { active: "Vigente", cancelled: "Cancelada", not_found: "No encontrada" },
  summary: (n, flagged) => `${n} facturas · ${flagged} por revisar`,
  excel: "Revision_CFDI.xlsx",
  caption: "Animación con las facturas de ejemplo. Prueba con las tuyas en la demo en vivo.",
  rows: [
    { number: "R-09", issuer: "Maria Olivia Martinez", amount: "$19,066.67", state: "active", alert: "Cancelación pendiente", tone: "accent" },
    { number: "A-101", issuer: "Indistria Iluminadora", amount: "$21,460.00", state: "active" },
    { number: "CAP-2208", issuer: "Universidad Robotica", amount: "$13,920.00", state: "cancelled" },
    { number: "A-102", issuer: "Indistria Iluminadora", amount: "$8,410.00", state: "active" },
    { number: "A-102", issuer: "Indistria Iluminadora", amount: "$8,410.00", state: "active", alert: "Duplicada", tone: "soft" },
    { number: "XI-5531", issuer: "Xenon Industrial", amount: "US$1,450.00", state: "active" },
    { number: "M-777", issuer: "Karla Fuente Nolasco", amount: "$5,568.00", state: "not_found" },
    { number: "HE-310", issuer: "Herreria & Electricos", amount: "$11,136.00", state: "active", alert: "Lista 69-B", tone: "danger" },
  ],
};

/* ── Calculadora de costo del trabajo manual ───────────────── */

export const CALCULATOR = {
  title: "¿Cuánto te cuesta hoy el trabajo manual?",
  intro:
    "Mueve los valores con los datos de tu equipo. Es una estimación rápida para dimensionar el problema, no una cotización.",
  // Moneda con la que empieza (fuera de México empieza en dólares, ver
  // src/lib/currency.js); el visitante puede cambiarla
  currency: "MXN",
  locale: "es-MX",
  weeksPerYear: 48, // semanas laborales al año
  // Costo por hora en cada moneda: valor inicial y rango del control
  currencies: {
    MXN: { start: 150, min: 50, max: 1000, step: 10 },
    USD: { start: 15, min: 5, max: 150, step: 5 },
  },
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
      { name: "FastAPI", text: "APIs rápidas, tipadas y con documentación automática. Es el motor de DataRefine y AgendaFlow." },
      { name: "Python", text: "Procesamiento de datos, automatización de tareas y análisis geoespacial." },
      { name: "CodeIgniter 4", text: "API REST de VillaNet en PHP 8: JWT, filtros por rol y pruebas con PHPUnit." },
      { name: "MySQL", text: "Modelado multi-tenant de clientes, servicios, routers y facturas." },
    ],
  },
  {
    area: "Frontend",
    items: [
      { name: "React", text: "Interfaces interactivas y componentes reutilizables, como este sitio y sus demos en vivo." },
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

/* ── Contacto directo ───────────────────────────────────────── */

// Mensaje que llega escrito en WhatsApp según la página desde la que te
// escriben (el número y la agenda están en src/content/contact.js)
export const WHATSAPP_MESSAGES = {
  general: "Hola Irving, vi tu portfolio y quiero platicar de un proyecto.",
  datarefine: "Hola Irving, vi la demo de DataRefine y quiero limpiar los datos de mi empresa.",
  agenda: "Hola Irving, vi la demo de AgendaFlow y me interesa el agente de citas por WhatsApp.",
  cfdi: "Hola Irving, vi la demo de FacturaCheck y me interesa revisar facturas con el SAT.",
  contadores: "Hola Irving, soy contador y vi FacturaCheck. Me interesa revisar las facturas de mis clientes.",
  consultorios: "Hola Irving, tengo un consultorio y vi AgendaFlow. Me interesa el agente de citas por WhatsApp.",
  fastapi: "Hola Irving, vi tu portfolio y necesito ayuda con una API en FastAPI.",
};

/* ── Precios de entrada ─────────────────────────────────────── */

// "to": página del paquete; "topic": mensaje de WhatsApp (WHATSAPP_MESSAGES)
export const PRICING = {
  eyebrow: "Precios",
  title: "Precios de entrada, sin sorpresas.",
  intro: "Cada proyecto se cotiza con precio cerrado después de una llamada de 15 minutos. Estos son los puntos de partida.",
  from: "Desde",
  note: "Precios en pesos mexicanos. La mensualidad cubre el servidor, la IA de pago cuando aplica y el soporte.",
  packages: [
    {
      name: "Agente de citas por WhatsApp",
      audience: "Consultorios, clínicas y salones",
      price: "$7,500 MXN",
      extra: "de instalación + desde $1,200 MXN al mes",
      includes: [
        "Agenda, cambia y cancela citas en tu WhatsApp Business",
        "Tus servicios, horarios y reglas",
        "Recordatorios un día antes de cada cita",
      ],
      cta: "Ver cómo funciona",
      to: "/consultorios",
      topic: "consultorios",
    },
    {
      name: "Revisión de facturas CFDI",
      audience: "Despachos contables y administración",
      price: "$5,000 MXN",
      extra: "de instalación + desde $900 MXN al mes",
      includes: [
        "Revisión mensual de tus RFC contra el SAT",
        "Canceladas, no registradas, lista 69-B y duplicadas",
        "Excel por cliente listo para el cierre",
      ],
      cta: "Ver cómo funciona",
      to: "/contadores",
      topic: "contadores",
    },
    {
      name: "Automatización a la medida",
      audience: "Procesos con Excel, reportes o captura manual",
      price: "$8,000 MXN",
      extra: "por proyecto, con precio cerrado",
      includes: [
        "Diagnóstico y propuesta antes de empezar",
        "Limpieza de datos, reportes e integraciones",
        "Documentación y acompañamiento al entregar",
      ],
      cta: "Cuéntame tu proceso",
      to: "/#contacto",
      topic: "general",
    },
  ],
};

/* ── Aviso de privacidad (/privacidad) ──────────────────────── */

// Sigue la Ley Federal de Protección de Datos Personales en Posesión de los
// Particulares. El domicilio está en src/content/contact.js
export const PRIVACY = {
  title: "Aviso de privacidad",
  updated: "Última actualización: 18 de octubre de 2026",
  intro: (name, address) =>
    `${name}, con domicilio en ${address}, es responsable del uso y la protección de tus datos personales, conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares. Este aviso explica qué datos recabo en este sitio y en sus demos, para qué los uso y cómo puedes ejercer tus derechos.`,
  sections: [
    {
      title: "Qué datos recabo",
      items: [
        "Si me contactas por correo, WhatsApp, el brief o la agenda: tu nombre, correo, teléfono, empresa y lo que me cuentes de tu proyecto.",
        "Si usas las demos: los archivos y facturas que subes y los mensajes que escribes en el chat. Se procesan en memoria para mostrarte el resultado y no se guardan.",
        "Datos técnicos: tu dirección IP, solo para limitar el número de pruebas por persona. Se guarda en memoria y se descarta al reiniciar el servidor.",
        "No recabo datos sensibles. En las demos te pido no escribir ni subir información de salud ni datos reales de pacientes o clientes.",
      ],
    },
    {
      title: "Para qué los uso",
      items: [
        "Responderte, preparar una propuesta y, si me contratas, prestar el servicio y darte soporte.",
        "Mostrarte el resultado de las demos.",
        "No uso tus datos para publicidad ni los vendo.",
      ],
    },
    {
      title: "Con quién se comparten",
      text: "Solo con los proveedores que hacen posible el sitio y las demos, y únicamente para eso:",
      items: [
        "Cloudflare, que aloja el sitio, y Render, que aloja los servidores de las demos.",
        "Proveedores de IA en su plan gratuito (Google Gemini, Groq y OpenRouter), que procesan los textos de las demos de DataRefine y AgendaFlow. Sus términos les permiten usar esos datos para mejorar sus servicios; por eso las demos piden datos inventados. Con clientes uso planes de pago que no usan los datos para entrenar modelos.",
        "El SAT, para consultar el estatus de las facturas que subes a FacturaCheck: solo el folio fiscal, los RFC y el total, lo mismo que trae el código QR de la factura.",
        "WhatsApp (Meta), Cal.com o tu proveedor de correo, si me contactas por esos medios.",
        "Fuera de esto, no comparto tus datos, salvo que una autoridad lo pida conforme a la ley.",
      ],
    },
    {
      title: "Tus derechos",
      text: "Puedes acceder a tus datos, rectificarlos, cancelarlos u oponerte a su uso (derechos ARCO), así como revocar tu consentimiento o limitar su uso.",
      items: [
        "Escríbeme a {email} con tu nombre, el derecho que quieres ejercer y los datos a los que se refiere.",
        "Te respondo en un máximo de 20 días hábiles.",
      ],
    },
    {
      title: "Cookies y almacenamiento",
      items: [
        "El sitio no usa cookies de rastreo ni de publicidad.",
        "Tu navegador guarda el idioma y la moneda que eliges, solo para recordarlos en tu siguiente visita.",
      ],
    },
    {
      title: "Cambios a este aviso",
      items: ["Si este aviso cambia, publicaré la nueva versión en esta página con su fecha."],
    },
  ],
  pending: "Domicilio pendiente",
};

/* ── Preguntas frecuentes ───────────────────────────────────── */

export const FAQ = [
  {
    // Si cambias los precios de PRICING, cámbialos también aquí
    q: "¿Cuánto cuesta un proyecto?",
    a: "Hay precios de entrada: el agente de citas por WhatsApp desde $7,500 MXN, la revisión de facturas CFDI desde $5,000 MXN y las automatizaciones a la medida desde $8,000 MXN. Después de una llamada de 15 minutos recibes una propuesta con precio cerrado, entregables y tiempos.",
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
    a: "Se usan solo para el proyecto, como explica el aviso de privacidad. Las demos usan el plan gratuito de la IA, por eso piden datos inventados; con clientes uso el plan de pago, cuyos términos no permiten usar tus datos para entrenar modelos, y lo verás por escrito en la propuesta.",
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
export const DEMO_COLUMNS = ["cliente", "fecha", "monto"];

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

/* ──────────────────────────────────────────────────────────────
   INTERFAZ — botones, etiquetas y avisos de cada pantalla
   (misma forma en en.js; los nombres de las llaves no se traducen)
   ────────────────────────────────────────────────────────────── */

export const UI = {
  lang: {
    label: "Idioma",
    // Lo que se ofrece a quien llega a la página en el otro idioma
    offer: "Este sitio también está en español.",
    switchTo: "Ver en español",
    dismiss: "Seguir en inglés",
  },
  contact: {
    whatsapp: "Escríbeme por WhatsApp",
    whatsappShort: "WhatsApp",
    booking: "Agenda 15 min",
  },
  common: {
    liveDemo: "Demo en vivo",
    backToPortfolio: "Volver al portfolio",
    tryLiveDemo: "Probar la demo en vivo",
    watchVideo: "Ver el video",
    watchWalkthrough: "Ver el recorrido en video",
    closeVideo: "Cerrar video",
    letsTalk: "Platiquemos",
    details: "Detalles",
    skipToContent: "Saltar al contenido",
    close: "Cerrar",
    projectTech: "Tecnologías del proyecto",
    tech: "Tecnologías",
  },
  header: {
    nav: "Principal",
    talk: "Hablemos",
    menu: "Menú",
    close: "Cerrar",
    openMenu: "Abrir menú",
    closeMenu: "Cerrar menú",
    menuPanel: "Menú de navegación",
    mobileNav: "Móvil",
  },
  landing: {
    title: "Irving Dávila — Automatización con IA y desarrollo full-stack",
    // Proxmox y MikroTik en la cinta de logos: útiles para reclutadores, no para una pyme
    showInfraLogos: false,
    tryDataRefine: "Probar DataRefine",
    talk: "Hablemos de tu proyecto",
    dragHint: "Arrástrala o haz clic para girarla ↗",
    badgeFront: "Ver el frente de la credencial",
    badgeBack: "Ver el reverso de la credencial",
    services: {
      eyebrow: "Servicios",
      title: "Lo que puedo resolver para tu equipo.",
      intro:
        "Soluciones a la medida para operaciones que dependen de hojas de cálculo, tareas repetitivas y sistemas que no se hablan entre sí.",
    },
    caseStudy: "Caso de estudio",
    challenge: "El reto",
    solution: "La solución",
    howItWorks: "Cómo funciona",
    tryAgent: "Probar el agente en vivo",
    showcase: {
      alt: "Demo de DataRefine limpiando un archivo con IA",
      title: "Mírala funcionando",
      hint: "Desliza ↓",
    },
    underTheHood: {
      eyebrow: "Documentación técnica",
      title: "Bajo el capó",
      text: "Arquitectura, validaciones y manejo de errores de DataRefine, resumidos en tres fichas. Abre la carpeta y haz clic en una ficha para ampliarla.",
    },
    projects: {
      eyebrow: "Más proyectos",
      title: "También construyo plataformas completas.",
      intro:
        "Sistemas de punta a punta, de la base de datos a la red. Así se ve por dentro uno de ellos.",
    },
    process: {
      eyebrow: "Proceso",
      title: "Un proceso claro, de la idea a producción.",
      intro:
        "Sin sorpresas: sabes qué se va a construir, cuándo se entrega y cómo vamos a medir el resultado.",
    },
    about: {
      eyebrow: "Sobre mí",
      photoAlt: "Retrato de Irving Dávila",
      role: "Full-stack · IA aplicada",
      available: "Disponible",
      tools: "Herramientas",
      outside: "Fuera de la terminal",
    },
    faq: {
      eyebrow: "Preguntas frecuentes",
      title: "Lo que suelen preguntarme antes de empezar.",
      intro: "Si tu duda no está aquí, escríbeme: respondo personalmente.",
    },
    contact: {
      eyebrow: "Contacto",
      write: "Escríbeme",
      copy: "Copiar correo",
      copied: "Correo copiado",
      copiedStatus: "Correo copiado al portapapeles",
    },
    footer: {
      tagline:
        "Herramientas que convierten trabajo manual en procesos automatizados.",
      navLabel: "Pie de página",
      nav: "Navegación",
      connect: "Conecta",
      email: "Correo",
      rights: "Todos los derechos reservados.",
      top: "Volver arriba",
      privacy: "Aviso de privacidad",
    },
    knowsAbout: [
      "Automatización de procesos",
      "FastAPI",
      "React",
      "Linux",
      "Proxmox",
      "AWS",
      "APIs de IA",
    ],
    techLogos: "Tecnologías con las que trabajo",
  },
  calculator: {
    eyebrow: "Calculadora",
    people: "Personas que hacen la tarea",
    peopleValue: (n) => `${n} ${n === 1 ? "persona" : "personas"}`,
    hours: "Horas por semana, por persona",
    rate: "Costo por hora",
    currency: "Moneda",
    share: "Parte que se podría automatizar",
    perYear: "Al año, tu equipo dedica",
    cost: "a este proceso, con un costo aproximado de",
    recover: (share) => `Si automatizas el ${share} %, podrías recuperar`,
    weeks: (n) => `Considera ${n} semanas laborales al año.`,
    cta: "Quiero recuperar ese tiempo",
  },
  bento: {
    log: [
      "Llegó reporte_ventas.xlsx",
      "Datos validados y normalizados",
      "Resumen generado con IA",
      "Enviado a dirección ✓",
    ],
    clicks: "0 clics manuales",
    clean: [
      ["  juan pérez ", "Juan Pérez"],
      ["03/12/24", "2024-12-03"],
      ["$1,200.50", "1200.50"],
    ],
    servers: ["proxmox-01", "mikrotik-norte", "wg0 · túnel"],
    active: "activo",
  },
  moreProjects: {
    dragHint: "Arrastra o toca →",
    compareHint: "Pasa el cursor o toca la imagen para comparar.",
    tryDemo: "Probar la demo",
    code: "Ver el código en GitHub",
  },
  devMode: {
    eyebrow: "Modo desarrollador",
    pin: "PIN de acceso",
    checking: "Verificando acceso…",
    granted: "Acceso concedido en",
    steps: ["PIN verificado", "Abriendo el panel de desarrollo"],
    thanks: "# Gracias por explorar con curiosidad: así empiezo cada proyecto.",
  },
  brief: {
    steps: ["Proceso", "Contexto", "Tus datos"],
    areas: "¿Qué te gustaría automatizar?",
    describe: "Descríbelo en una frase (opcional)",
    describePlaceholder:
      "Ej. Cada lunes unimos 4 Excel para el reporte de ventas.",
    tools: "¿Con qué trabajan hoy?",
    hours: "¿Cuánto tiempo le dedican por semana?",
    name: "Nombre",
    namePlaceholder: "Tu nombre",
    company: "Empresa (opcional)",
    companyPlaceholder: "Nombre de la empresa",
    back: "Atrás",
    next: "Continuar",
    complete: "Generar mensaje",
    ready: "Tu mensaje está listo",
    readyText: (email) => `Ábrelo en tu correo o cópialo y envíalo a ${email}.`,
    open: "Abrir en mi correo",
    whatsapp: "Enviar por WhatsApp",
    copy: "Copiar mensaje",
    edit: "Editar respuestas",
    needArea: "Elige al menos una opción o descríbelo en una frase.",
    needName: "Escribe tu nombre para firmar el mensaje.",
    copied: "Mensaje copiado",
    copiedDetail: (email) => `Pégalo en un correo para ${email}`,
    to: "Para",
    subjectLabel: "Asunto",
    subject: (company) =>
      `Proyecto de automatización${company ? ` · ${company}` : ""}`,
    body: ({ name, company, areas, detail, tools, hours }) =>
      [
        "Hola Irving,",
        "",
        `Soy ${name}${company ? `, de ${company}` : ""}.`,
        "",
        `Me gustaría automatizar: ${areas || "—"}`,
        ...(detail ? [`Detalle: ${detail}`] : []),
        `Herramientas que usamos hoy: ${tools || "—"}`,
        `Tiempo que le dedicamos por semana: ${hours || "—"}`,
        "",
        "¿Lo platicamos?",
      ].join("\n"),
  },
  cleaningDemo: {
    state: "Estado de los datos",
    before: "Antes",
    after: "Después",
    table: "Ejemplo de datos antes y después de la limpieza",
    aiSteps: [
      "Normalizando nombres",
      "Unificando fechas y montos",
      "Fusionando duplicados",
      "Marcando datos faltantes",
    ],
    working: "Limpiando con IA…",
    done: "Limpieza lista en",
    fixed: (n) => `${n} celdas corregidas`,
    merged: (n) => `${n} ${n === 1 ? "duplicado fusionado" : "duplicados fusionados"}`,
    review: (n) => `${n} por revisar`,
    problems: (n) => `${n} celdas con problemas`,
    caption: "Ejemplo ilustrativo de cómo se transforman los datos.",
  },
  notFound: {
    title: "Página no encontrada — Irving Dávila",
    eyebrow: "Error · Ruta no encontrada",
    heading: "Esta página no existe",
    text: "Puede que la dirección esté mal escrita o que la página se haya movido. Volvamos a terreno conocido.",
    home: "Ir al inicio",
  },
  // Textos por defecto de los componentes de React Bits
  bits: {
    step: "Paso",
    folder: "Carpeta",
    slider: "Control deslizante",
    loading: "Cargando",
    readyIn: "Listo en",
    failedAfter: "Falló tras",
    inProgress: "en curso",
    thinking: "Pensando…",
    code: "Código",
    codeAccepted: "Código aceptado",
    digits: (filled, length) => `${filled} de ${length} dígitos`,
    status: {
      pending: "Pendiente",
      running: "En curso",
      done: "Completado",
      failed: "Falló",
    },
  },
};

/* ── Animación de AgendaFlow en la portada ─────────────────────
   Una conversación de ejemplo que se reproduce sola (sin IA real). */

export const AGENT_DEMO = {
  clinic: "Clínica Dental Sonrisa",
  role: "asistente con IA",
  typing: "escribiendo…",
  replay: "Ver otra vez",
  day: "Agenda · jueves 22",
  free: "libre",
  booked: "Laura · Limpieza dental",
  tools: "Herramientas",
  toolsLabel: "Herramientas que ejecutó el agente",
  rule: "Regla",
  caption: "Animación de una conversación real. Pruébalo tú en la demo en vivo.",
  script: [
    { kind: "user", text: "Hola, ¿tienen una limpieza el jueves en la tarde?", wait: 900 },
    { kind: "tool", name: "ver_disponibilidad", detail: "limpieza · jueves 22", ok: true, wait: 1000 },
    { kind: "agent", text: "¡Claro! El jueves 22 tengo 15:00, 16:00 y 17:00. ¿Cuál prefieres?", wait: 1800 },
    { kind: "user", text: "La de las 4. Soy Laura, 55 8765 4321", wait: 900 },
    { kind: "tool", name: "agendar_cita", detail: "jueves 22, 16:00 · C-3924", ok: true, wait: 1000 },
    {
      kind: "agent",
      text: "¡Listo, Laura! Quedó el jueves a las 16:00 con la Dra. Ana Torres. Tu código es C-3924.",
      wait: 2000,
    },
    { kind: "user", text: "Mejor cámbiala al domingo", wait: 900 },
    {
      kind: "tool",
      name: "reprogramar_cita",
      detail: "domingo 25",
      ok: false,
      error: "La clínica no abre el domingo.",
      wait: 1000,
    },
    { kind: "agent", text: "Los domingos cerramos. ¿Te la paso al sábado 24 a las 10:00?", wait: 0 },
  ],
  // Tarde del jueves: lo que ya estaba ocupado y los huecos libres
  slots: [
    { time: "15:00" },
    { time: "15:30", busy: "Revisión general" },
    { time: "16:00" },
    { time: "16:30", busy: "Resina para caries" },
    { time: "17:00" },
    { time: "17:30", busy: "Blanqueamiento" },
  ],
};

/* ── Demo de DataRefine (/demo/datarefine) ──────────────────── */

export const DATA_LAB = {
  title: "DataRefine — Demo en vivo · Irving Dávila",
  heading: "Sube un Excel desordenado. Recíbelo limpio.",
  intro:
    "Primero ves, en tu navegador, qué problemas tiene tu archivo. Después la IA los corrige y te devuelve un .xlsx listo para usar. Sin cuentas ni configuraciones.",
  facts: (rows) => ["CSV, XLSX y XLS", `Hasta ${rows} filas`, "Diagnóstico en tu navegador", "Resultado en .xlsx"],
  errors: {
    format: "Formato no compatible. Sube un archivo .xlsx, .xls o .csv.",
    size: (mb) => `La demo acepta archivos de hasta ${mb} MB. Sube uno más pequeño.`,
    empty: "El archivo está vacío. Sube uno que tenga datos.",
    generic: "No se pudo procesar el archivo. Verifica el formato o inténtalo de nuevo.",
    network: "No se pudo conectar con el servidor. Revisa tu conexión e inténtalo de nuevo.",
  },
  steps: ["Subir archivo", "Revisar y limpiar", "Descargar"],
  progress: "Progreso",
  workArea: "Limpieza de archivo",
  drop: "Suelta el archivo para cargarlo",
  drag: "Arrastra tu archivo aquí",
  or: "o",
  choose: "elige uno de tu equipo",
  formats: "Formatos admitidos",
  limits: (mb, rows) => `Hasta ${mb} MB y ${rows} filas`,
  remove: "Quitar archivo",
  noFile: "¿No tienes un archivo a la mano?",
  sample: "Prueba con datos de ejemplo",
  sampleLoaded: "Datos de ejemplo cargados",
  sampleDetail: "Un CSV con errores típicos de captura.",
  checking: "Revisando el archivo",
  noPreview:
    "La vista previa está disponible para archivos .csv y .xlsx. DataRefine procesa tu archivo igual.",
  rows: "Filas",
  columns: "Columnas",
  problems: "Problemas",
  found: "Qué encontramos",
  preview: "Vista previa",
  previewIssues: "Vista previa del archivo original con los problemas resaltados",
  previewFile: "Vista previa del archivo",
  noProblems: "No vemos problemas evidentes; la IA revisará el contenido a fondo.",
  tooManyRows: (rows, max) => [
    `Tu archivo tiene ${rows.toLocaleString("es-MX")} filas y la demo procesa hasta ${max}. Prueba con una parte o `,
    "escríbeme",
    " y lo limpio completo para tu empresa.",
  ],
  clean: "Limpiar con IA",
  retry: "Reintentar",
  willFix: (n) =>
    n
      ? `Corrige ${n === 1 ? "el problema" : `los ${n} problemas`} y te devuelve un .xlsx.`
      : "Te devuelve un .xlsx limpio y consistente.",
  cancel: "Cancelar",
  cleaning: "Limpiando con IA",
  fixing: "Qué se está corrigiendo",
  slow: "Está tardando más de lo normal. Puedes cancelar e intentarlo de nuevo.",
  wait: "Puede tardar unos segundos, según el tamaño del archivo.",
  scanning: "Archivo original mientras se limpia",
  cleanSuffix: "limpio",
  cleanTitle: "Tu archivo está limpio",
  readyIn: "Limpieza lista en",
  doneSteps: (noAI) => [
    "Archivo revisado en tu navegador",
    "Fechas, montos y duplicados corregidos",
    noAI ? "Revisión de textos con IA omitida" : "Textos revisados con IA",
    "Excel limpio generado",
  ],
  aiLimited: "La IA llegó a su límite diario en la demo: se aplicaron las reglas automáticas.",
  aiBusy:
    "La IA está saturada en este momento: se aplicaron las reglas automáticas. Inténtalo de nuevo en unos minutos para revisar también los textos.",
  fixed: "Problemas corregidos",
  ofDetected: (n) => `de ${n} detectados`,
  finalRows: "Filas finales",
  ofOriginal: (n) => `de ${n} originales`,
  toReview: "Por revisar",
  inYellow: ", en amarillo en el Excel",
  allGood: "Todo en orden",
  compare: "Comparar versiones",
  before: "Antes",
  after: "Después",
  cleanFile: "Archivo limpio",
  originalFile: "Archivo original",
  download: "Descargar archivo limpio",
  another: "Limpiar otro archivo",
  toastClean: "Archivo limpio",
  toastFixed: (n) => `${n} problemas corregidos.`,
  toastReady: "Listo para descargar.",
  whatItFixes: "Qué corrige DataRefine",
  beforeUpload: "Antes de subir",
  rules: (formats, mb, rows, perHour) => [
    ["Formatos", formats],
    ["Tamaño máximo", `${mb} MB`],
    ["Filas por archivo", `hasta ${rows}`],
    ["Pruebas", `${perHour} por hora`],
    ["Resultado", ".xlsx limpio"],
  ],
  publicDemo:
    "Es una demo pública: no subas datos sensibles. La versión para tu empresa no tiene estos límites.",
  forBusiness: "¿Lo necesitas para tu negocio?",
  forBusinessText:
    "Lo adapto a tus archivos: reglas de tu operación, más columnas o conexión directa con tu sistema. En una llamada te digo cómo quedaría.",
};

// Nombre y explicación de cada tipo de problema (los colores están en lib/sheet.js)
export const ISSUE_TEXT = {
  all: { label: "Todos los problemas", hint: "Resaltados en la tabla" },
  dup: { label: "Filas duplicadas", hint: "El mismo registro, escrito distinto" },
  empty: { label: "Celdas vacías", hint: "Sin dato o con N/A" },
  format: { label: "Formatos mixtos", hint: "Fechas y montos dispares" },
  case: { label: "Mayúsculas mezcladas", hint: "MAYÚSCULAS y minúsculas" },
  spaces: { label: "Espacios sobrantes", hint: "Al inicio, al final o dobles" },
};

export const SHEET_PREVIEW = {
  empty: "vacía",
  shown: (shown, matching, total, issue) =>
    `${shown} de ${matching} ${matching === 1 ? "fila" : "filas"}${
      issue ? ` con ${issue.toLowerCase()}` : ""
    }${total > matching ? ` (${total} en total)` : ""}`,
  spaces: " · «·» = espacio sobrante",
  more: "Ver más filas",
  less: "Ver menos",
};

/* ── Demo de AgendaFlow (/demo/agenda) ──────────────────────── */

export const AGENDA_LAB = {
  title: "AgendaFlow — Demo en vivo · Irving Dávila",
  heading: "Un agente de IA que agenda citas por ti.",
  intro:
    "Escríbele como a WhatsApp: consulta horarios, agenda, cambia o cancela. Mientras conversan, la agenda de la clínica se actualiza y ves cada acción que ejecuta el agente.",
  facts: [
    "Clínica de ejemplo",
    "Usa datos inventados",
    "Agenda, cambia y cancela",
    "Reglas validadas en el backend",
  ],
  tabs: { label: "Vista de la demo", chat: "Chat", agenda: "Agenda", actions: "Acciones" },
  errors: {
    network: "No se pudo conectar con el servidor. Revisa tu conexión e inténtalo de nuevo.",
    generic: "Algo salió mal. Inténtalo de nuevo.",
    asleep: "El servidor de la demo no despertó a tiempo. Inténtalo de nuevo en un momento.",
    expired: "La conversación expiró. Pulsa «Reiniciar» para empezar otra.",
  },
  chat: {
    label: "Chat con el asistente de la clínica",
    fallbackName: "Clínica Dental Sonrisa",
    online: "en línea · asistente con IA",
    typing: "escribiendo…",
    connecting: "conectando…",
    offline: "sin conexión",
    restart: "Reiniciar",
    messages: "Mensajes",
    today: "Hoy",
    read: "Leído",
    typingLabel: "El asistente está escribiendo",
    see: "Ver",
    rule: "Regla",
    retry: "Reintentar",
    waking: "Despertando el servidor",
    connectingLabel: "Conectando",
    sleepy:
      "El servidor gratuito se duerme cuando nadie lo usa; la primera vez puede tardar hasta un minuto.",
    inputLabel: "Escribe un mensaje",
    placeholder: "Escribe como en WhatsApp…",
    placeholderOff: "Conectando…",
    send: "Enviar",
    remaining: (n) => `${n} mensajes restantes en esta demo`,
    fakeData: "Clínica de ejemplo: no escribas datos reales.",
    suggestions: [
      "¿Qué servicios tienen y cuánto cuestan?",
      "Quiero una limpieza el jueves en la tarde",
      "¿Tienen estacionamiento?",
      "Quiero cambiar mi cita",
    ],
  },
  calendar: {
    label: "Agenda de la clínica",
    title: "Agenda de la clínica",
    subtitle: "Se actualiza con cada acción del agente",
    previous: "Semana anterior",
    next: "Semana siguiente",
    thisWeek: "Esta semana",
    appointments: "Citas",
    occupancy: "Ocupación",
    yours: "Tus citas",
    closed: "Sin servicio",
    day: "Día",
    today: "hoy",
    hasYours: "Tienes una cita",
    dayLabel: (weekday, day) => `Citas del ${weekday} ${day}`,
    note: "Las demás citas son de pacientes ficticios. Cada visitante tiene su propia copia de la agenda; nada se comparte ni se guarda.",
  },
  actions: {
    label: "Acciones del agente",
    title: "Lo que hizo el agente",
    count: (n, blocked) =>
      `${n} ${n === 1 ? "acción" : "acciones"}${
        blocked ? ` · ${blocked} ${blocked === 1 ? "frenada" : "frenadas"} por reglas` : ""
      }`,
    empty:
      "Aquí verás cada herramienta que ejecuta el agente detrás del chat. Todas pasan por reglas del backend; la IA no puede saltárselas.",
    tools: "Herramientas del agente",
    rule: "Regla del backend",
  },
  clinic: {
    label: "Datos de la clínica",
    sample: "Negocio de ejemplo · datos ficticios",
    services: "Servicios",
    hours: "Horario",
    team: "Equipo",
    closed: "Cerrado",
    details: "Servicios, precios y horario de la clínica",
  },
  cards: {
    behind: "Qué hay detrás",
    business: "En tu negocio",
    want: "¿Lo quieres para tu negocio?",
    wantText:
      "Consultorios, salones, talleres o despachos: lo adapto a tus servicios, horarios y equipo, y lo conecto a tu WhatsApp.",
  },
};

/* ── Demo de FacturaCheck (/demo/cfdi) ──────────────────────── */

export const CFDI_LAB = {
  title: "FacturaCheck — Demo en vivo · Irving Dávila",
  heading: "Sube tus facturas. Te digo cuáles revisar.",
  intro:
    "Arrastra los XML de tus CFDI o el ZIP que descargas del portal del SAT. Cada factura se consulta en el SAT y recibes un Excel con vigentes, canceladas, duplicadas y los totales de IVA.",
  facts: (max) => ["XML o ZIP del SAT", `Hasta ${max} facturas`, "Estatus consultado en el SAT", "Reporte en Excel"],
  errors: {
    format: (name) => `«${name}» no es XML ni ZIP. Sube tus CFDI en .xml o en un .zip.`,
    size: (mb) => `La demo revisa hasta ${mb} MB por vez. Quita algunos archivos.`,
    count: (max) => `La demo revisa hasta ${max} archivos por vez.`,
    generic: "No se pudieron revisar las facturas. Inténtalo de nuevo.",
    network: "No se pudo conectar con el servidor. Revisa tu conexión e inténtalo de nuevo.",
  },
  steps: ["Subir facturas", "Consultar en el SAT", "Descargar reporte"],
  progress: "Progreso",
  workArea: "Revisión de facturas",
  drop: "Suelta tus facturas",
  drag: "Arrastra tus XML o el ZIP aquí",
  or: "o",
  choose: "elígelos de tu equipo",
  formats: "Formatos admitidos",
  limits: (max, mb) => `Hasta ${max} facturas y ${mb} MB`,
  noFiles: "¿No tienes facturas a la mano?",
  sample: "Prueba con 12 facturas de ejemplo",
  sampleZip: "descargar el ZIP de ejemplo",
  sampleLoaded: "Facturas de ejemplo cargadas",
  sampleDetail: "Compras de septiembre con casos para revisar.",
  sampleFailed: "No se pudieron cargar las facturas de ejemplo. Inténtalo de nuevo.",
  selected: (n) => `${n} ${n === 1 ? "archivo listo" : "archivos listos"} para revisar`,
  zip: "ZIP",
  add: "Agregar archivos",
  remove: (name) => `Quitar ${name}`,
  clear: "Quitar todos",
  review: "Consultar en el SAT",
  retry: "Reintentar",
  willCheck:
    "Cada factura se consulta en el servicio público del SAT, el mismo que usa el código QR de la factura.",
  cancel: "Cancelar",
  checking: "Consultando el SAT",
  workingSteps: [
    "Leyendo los XML",
    "Consultando cada factura en el SAT",
    "Buscando duplicados y alertas",
    "Armando el Excel",
  ],
  slow: "El servidor gratuito se duerme cuando nadie lo usa: la primera revisión puede tardar hasta un minuto.",
  wait: "Suele tardar unos segundos.",
  doneTitle: "Revisión lista",
  readyIn: "Revisión lista en",
  doneSteps: (n) => [
    `${n} ${n === 1 ? "factura leída" : "facturas leídas"}`,
    "Estatus consultado en el SAT",
    "Duplicados y alertas detectados",
    "Excel generado",
  ],
  simulated:
    "Las facturas de ejemplo son inventadas, así que su estatus en el SAT es simulado. Con tus propios XML, el estatus se consulta en el SAT.",
  period: (from, to) => `Facturas del ${from} al ${to}`,
  stats: {
    invoices: "Facturas",
    active: "Vigentes",
    cancelled: "Canceladas",
    flagged: "Por revisar",
  },
  duplicatesLeft: (n) => `sin contar ${n} ${n === 1 ? "duplicada" : "duplicadas"}`,
  notFoundToo: (n) => `y ${n} que el SAT no tiene`,
  flaggedDetail: (n) => `${n} ${n === 1 ? "alerta" : "alertas"} en total`,
  allClear: "Todo en orden",
  totalsTitle: "Totales en pesos",
  totalsNote: "Facturas de ingreso vigentes menos notas de crédito, sin duplicados.",
  totals: {
    net: "Subtotal",
    iva: "IVA trasladado",
    iva_withheld: "IVA retenido",
    isr_withheld: "ISR retenido",
    total: "Total",
  },
  attention: "Lo que necesita tu atención",
  nothingToCheck: "Ninguna factura necesita revisión.",
  alerts: {
    cancelled: { label: "Cancelada", text: "El SAT la tiene cancelada: no es deducible." },
    not_found: {
      label: "No está en el SAT",
      text: "El SAT no la tiene registrada: podría ser apócrifa (o recién timbrada).",
    },
    efos: {
      label: "Lista 69-B",
      text: "El emisor está en la lista del SAT de empresas que facturan operaciones simuladas.",
    },
    cancellation_pending: {
      label: "Cancelación pendiente",
      text: "El emisor pidió cancelarla y espera tu respuesta en el buzón tributario.",
    },
    duplicate: { label: "Duplicada", text: (file) => `Es la misma factura que ${file}: se cuenta una sola vez.` },
    unavailable: { label: "Sin respuesta del SAT", text: "El SAT no respondió: vuelve a consultarla más tarde." },
    unreadable: { label: "No es un CFDI timbrado" },
  },
  unreadable: {
    not_xml: "No es un XML válido.",
    not_cfdi: "Es un XML, pero no es un CFDI.",
    version: "Versión de CFDI no compatible (se leen 3.3 y 4.0).",
    not_stamped: "No está timbrada: es un borrador sin folio fiscal.",
    bad_data: "Le faltan datos obligatorios o tiene montos inválidos.",
  },
  table: {
    title: "Facturas revisadas",
    filter: "Mostrar",
    all: "Todas",
    flagged: "Con alertas",
    invoice: "Factura",
    issuer: "Emisor",
    date: "Fecha",
    total: "Total",
    status: "Estatus SAT",
    paid: "pagado",
  },
  states: {
    active: "Vigente",
    cancelled: "Cancelada",
    not_found: "No encontrada",
    unavailable: "Sin respuesta",
  },
  kinds: { I: "Ingreso", E: "Nota de crédito", P: "Pago", N: "Nómina", T: "Traslado" },
  download: "Descargar reporte en Excel",
  another: "Revisar otras facturas",
  toastDone: "Revisión lista",
  toastDetail: (n) =>
    n ? `${n} ${n === 1 ? "factura necesita" : "facturas necesitan"} revisión.` : "Todo en orden.",
  whatItChecks: "Qué revisa FacturaCheck",
  checks: [
    "Si cada factura sigue vigente o ya la cancelaron",
    "Facturas que el SAT no tiene registradas",
    "Emisores en la lista 69-B del SAT",
    "Cancelaciones que esperan tu respuesta",
    "Archivos duplicados y borradores sin timbrar",
    "IVA, ISR retenido y totales por RFC",
  ],
  beforeUpload: "Antes de subir",
  rules: (max, mb, perHour) => [
    ["Formatos", ".xml y .zip"],
    ["Facturas por revisión", `hasta ${max}`],
    ["Tamaño máximo", `${mb} MB`],
    ["Revisiones", `${perHour} por hora`],
    ["Resultado", "Excel con 4 hojas"],
  ],
  privacy:
    "Tus archivos se leen en memoria y no se guardan. Al SAT solo se envía lo que trae el código QR de cada factura: folio fiscal, RFC y total.",
  forBusiness: "¿Lo quieres para tu despacho o empresa?",
  forBusinessText:
    "Lo conecto a la descarga masiva del SAT para revisar cada mes en automático, con tus reglas de deducibilidad y avisos por correo.",
};

// Fechas de la agenda: días y meses abreviados, y formato de hora
export const DATES = {
  locale: "es-MX",
  weekdays: ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"],
  // Para el horario resumido, de lunes a domingo ("Lun–Vie")
  days: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
  months: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"],
  shortDate: (day, month) => `${day} ${month}`,
};
