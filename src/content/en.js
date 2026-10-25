/* ──────────────────────────────────────────────────────────────
   ENGLISH CONTENT — same shape as es.js (the Spanish version).
   Keys and ids are never translated; only the words are. If you
   add or rename something here, do it in es.js too.
   ────────────────────────────────────────────────────────────── */

export const PROFILE = {
  name: "Irving de Jesús Dávila Torres",
  shortName: "Irving Dávila",
  role: "Full-stack developer · AI automation",
  email: "irvingdevv26@hotmail.com",
  github: "https://github.com/IrvingDevv26",
  linkedin: "https://www.linkedin.com/in/irving-de-jesus-davila-torres",
};

// The section ids stay the same in both languages (/en#contacto works)
export const NAV_LINKS = [
  { href: "#servicios", label: "Services" },
  { href: "#precios", label: "Rates" },
  { href: "#proyecto", label: "Projects" },
  { href: "#proceso", label: "Process" },
  { href: "#sobre-mi", label: "About" },
  { href: "#contacto", label: "Contact" },
];

/* ── Hero ───────────────────────────────────────────────────── */

export const HERO = {
  badge: "Available for new projects",
  eyebrow: "Full-stack · Applied AI",
  title: "I turn manual work into systems that run on their own.",
  highlight: ["run", "on", "their", "own"],
  rotatingPrefix: "Specialized in",
  rotating: [
    "AI appointment agents",
    "FastAPI backends",
    "data cleaning",
    "AI workflows",
    "Linux servers",
  ],
  lead: "I design and build B2B tools that turn hours of repetitive work into automated data flows: from the API to the interface, ready for production on AWS or on your own Linux servers.",
  // Main buttons: the AI agent demo and the FastAPI services with rates
  ctas: [
    { label: "See the AI agent", to: "/demo/agenda" },
    { label: "FastAPI services and rates", to: "/#precios" },
  ],
};

// Moving strips below the hero
export const MARQUEE = [
  "Automation ✦ Data cleaning ✦ AI APIs ✦ Linux servers ✦ Networking ✦",
  "FastAPI · Python · React · Tailwind CSS · AWS · Linux · Proxmox · AI APIs ·",
];

/* ── Services ───────────────────────────────────────────────── */

export const SERVICES = [
  {
    icon: "workflow",
    title: "Process automation",
    text: "I find the repetitive tasks in your operation —data entry, reconciliation, reports— and turn them into workflows that run on their own and alert you when something needs attention.",
    tags: ["Workflows", "Integrations", "Reports"],
  },
  {
    icon: "table",
    title: "Data cleaning and structuring",
    text: "I standardize formats, remove duplicates and flag missing data in Excel and CSV files with AI models, so your decisions start from reliable information.",
    short: "Consistent formats, duplicates removed and missing data flagged, with help from AI.",
    tags: ["Excel / CSV", "Normalization", "AI"],
  },
  {
    icon: "code",
    title: "Full-stack applications",
    text: "I build APIs with FastAPI or CodeIgniter and interfaces in React or Vue, and integrate AI APIs so your tools analyze, classify and transform information for you.",
    short: "FastAPI or CodeIgniter APIs, React or Vue interfaces and built-in AI APIs.",
    tags: ["FastAPI", "React", "Vue", "AI APIs"],
  },
  {
    icon: "server",
    title: "Servers and infrastructure",
    text: "I run Linux servers, Proxmox virtual environments and MikroTik networks with WireGuard tunnels, and deploy to AWS when it makes sense: your app runs where it fits best.",
    short: "Linux servers, Proxmox virtualization and MikroTik networks with WireGuard.",
    tags: ["Linux", "Proxmox", "MikroTik", "AWS"],
  },
];

/* ── Case study: DataRefine ─────────────────────────────────── */

export const PROJECT = {
  name: "DataRefine",
  video: "", // Loom link with the demo walkthrough (https://www.loom.com/share/...)
  tagline: "AI data cleaning for teams that live in Excel.",
  summary:
    "Upload a messy Excel or CSV file and get back a clean, consistent one, without fixing cells by hand.",
  challenge:
    "Operations teams lose hours fixing misspelled names, dates in different formats and duplicate records before they can even use their own data.",
  solution:
    "A FastAPI service that detects what each column holds, fixes dates, amounts and duplicates with pandas rules, and uses AI to polish names and text without touching your numbers. Anything missing is flagged for review, and a React interface does it all in seconds.",
};

// What the real backend does (DataRefine repository)
export const DATAREFINE_FIXES = [
  "Unifies date, text and amount formats",
  "Detects and merges duplicate records",
  "Flags missing data for review",
];

export const PROJECT_TAGS = ["FastAPI", "Python", "pandas", "React", "AWS", "AI APIs"];

// Real numbers of the demo (see DataLab.jsx)
export const PROJECT_METRICS = [
  { value: 3, label: "input formats", detail: ".xlsx, .xls and .csv" },
  { value: 300, label: "rows per file in the demo", detail: "no limit in your version" },
  { value: 3, label: "steps from start to finish", detail: "upload, clean and download" },
];

// Technical sheets inside the folder (Folder in the case study)
export const PROJECT_DOCS = [
  { title: "Architecture", description: "React → FastAPI → pandas rules + AI → formatted .xlsx with a summary." },
  { title: "Validation", description: "Public demo: up to 1 MB, 300 rows and 5 tries per hour per person. Every AI correction is validated." },
  { title: "Resilience", description: "If an AI model is overloaded it tries another; if they all fail, it delivers the file cleaned by the rules." },
];

export const STEPS = [
  {
    title: "You upload your file",
    text: "Drag in an Excel or CSV file (up to 300 rows in the demo). No accounts or setup.",
  },
  {
    title: "Rules and AI clean it",
    text: "Automatic rules fix dates, amounts, spaces and duplicates; AI polishes names and text without touching your numbers.",
  },
  {
    title: "You download the result",
    text: "You get a clean .xlsx, ready for your analysis or to load into your system.",
  },
];

/* ── Demo showcase (ScrollExpand) ───────────────────────────── */
// "video": path to an .mp4 in public/ (Loom lets you download it). Without a
// video the screenshot is shown.

export const SHOWCASE = {
  poster: "/demo-datarefine.jpg",
  video: "",
};

/* ── More projects (ScrollStack) ────────────────────────────── */

export const PROJECTS = [
  {
    name: "VillaNet",
    kind: "SaaS platform · Networking",
    summary:
      "Management for wireless internet providers (WISPs): customer sign-ups, automatic provisioning on MikroTik routers, billing through payment gateways and network monitoring.",
    highlights: [
      "Configures MikroTik routers through the RouterOS API over WireGuard tunnels",
      "Multi-tenant with JWT and AES-256 encrypted credentials",
      "CI on GitHub Actions: PHPUnit, Vitest and secret scanning with gitleaks",
    ],
    tags: ["CodeIgniter 4", "Vue 3", "MySQL", "MikroTik", "WireGuard"],
    // Draggable cards (Stack): real diagrams of the project
    gallery: [
      { src: "/project-villanet.jpg", caption: "Deployment: local server, WireGuard relay and MikroTik nodes" },
      { src: "/villanet-alta.jpg", caption: "Customer sign-up: from the interface to the router in one flow" },
      { src: "/villanet-pago.jpg", caption: "Billing: payment gateway webhook and service reactivation" },
    ],
    note: "Private repository: I'll walk you through the code and the running system on a call.",
    video: "", // Loom link (https://www.loom.com/share/...)
  },
];

/* ── Case study and demo: AgendaFlow (/en/demo/agenda) ──────── */

export const AGENDA_PROJECT = {
  name: "AgendaFlow",
  video: "", // Loom link with the demo walkthrough
  tagline:
    "An AI agent that books, reschedules and cancels appointments over WhatsApp, with no double bookings or made-up times.",
  challenge:
    "Clinics, salons and repair shops lose hours answering booking messages, and one mistake in the calendar ends in double bookings or no-shows.",
  solution:
    "An agent that chats with the patient and runs the calendar through tools the backend validates: it understands dates in plain language, only offers real open times and confirms every appointment with a code.",
  tags: ["FastAPI", "Python", "Tool calling", "Gemini", "React"],
  metrics: [
    { value: 5, label: "validated tools", detail: "check, book, look up, reschedule and cancel" },
    { value: 3, unit: "s", label: "per reply", detail: "on average, with free AI models" },
    { value: 60, label: "automated tests", detail: "rules, agent, API and both languages" },
  ],
  steps: [
    {
      title: "You write like on WhatsApp",
      text: "The patient asks in their own words: “Thursday afternoon”, “the 4 o'clock one”.",
    },
    {
      title: "The AI picks a tool",
      text: "It checks open times, books, reschedules or cancels; if something isn't possible, it explains why and offers another option.",
    },
    {
      title: "The backend validates everything",
      text: "Hours, conflicts and notice are checked in code: the AI never writes to the calendar directly.",
    },
  ],
  highlights: [
    "The AI talks; the backend decides: hours, conflicts and notice are validated in code",
    "Every action of the agent is logged and visible, just like in a real system",
    "Each visitor gets their own sandbox calendar; nothing is shared or stored",
  ],
  forBusiness: [
    "It can answer your WhatsApp Business 24/7",
    "It syncs with Google Calendar or your booking system",
    "It sends reminders and confirms attendance the day before",
  ],
};

/* ── FacturaCheck case study (/en/demo/cfdi) ────────────────── */

export const FACTURA_PROJECT = {
  name: "FacturaCheck",
  video: "", // Loom link of the demo walkthrough
  tagline:
    "Upload a month of Mexican invoices and in seconds you know which ones were cancelled, came twice or come from an issuer the tax authority has flagged.",
  challenge:
    "At month end, accounting firms in Mexico check every e-invoice (CFDI) by hand on the SAT's portal, the tax authority's site. A cancelled or fake invoice that slips through ends in a rejected deduction and hours of paperwork.",
  solution:
    "FacturaCheck reads the XML files or the ZIP the SAT portal downloads, checks each invoice with the SAT's official service and returns an Excel file with the issues and the tax totals, ready for the books.",
  tags: ["FastAPI", "Python", "XML", "SAT", "openpyxl", "React"],
  cta: "Try FacturaCheck",
  catchesTitle: "What it catches",
  // tone: color of the issue (danger, warn, accent, soft or muted)
  catches: [
    { tone: "danger", title: "Cancelled", text: "The issuer cancelled it at the SAT: it can't be deducted anymore." },
    { tone: "warn", title: "Not on record", text: "The SAT doesn't have it: it may be fake." },
    { tone: "danger", title: "69-B list", text: "Issuers the SAT flags for invoicing simulated operations." },
    { tone: "accent", title: "Cancellation pending", text: "The issuer asked to cancel it and is waiting for your answer." },
    { tone: "soft", title: "Duplicates", text: "The same invoice in two files: counted once." },
    { tone: "muted", title: "Drafts", text: "XML that was never stamped and has no fiscal folio: not a valid invoice." },
  ],
  metrics: [
    { value: 6, label: "SAT checks at a time", detail: "half a second per invoice; if the SAT doesn't answer, the review goes on" },
    { value: 4, label: "sheets in the Excel file", detail: "summary, invoices, totals per RFC and issues" },
    { value: 37, label: "automated tests", detail: "XML and ZIP reading, SAT checks and the API" },
  ],
  steps: [
    {
      title: "Upload your invoices",
      text: "Loose XML files or the ZIP as the SAT portal downloads it, CFDI 4.0 and 3.3.",
    },
    {
      title: "Each one is checked with the SAT",
      text: "Through the same service the QR code uses: valid, cancelled, not on record or from an issuer on the 69-B list.",
    },
    {
      title: "Get the report",
      text: "An Excel file with what needs your attention, the totals in pesos and the detail per RFC, in English or Spanish.",
    },
  ],
};

// Animation of a review for the case study (no real SAT: the live demo is at
// /en/demo/cfdi). Invoices taken from the demo's samples
export const FACTURA_DEMO = {
  file: "september_invoices.zip",
  files: (n) => `${n} XML`,
  replay: "Replay",
  listLabel: "Reviewed invoices",
  queued: "Queued",
  checking: "Checking SAT",
  states: { active: "Valid", cancelled: "Cancelled", not_found: "Not found" },
  summary: (n, flagged) => `${n} invoices · ${flagged} to review`,
  excel: "CFDI_Review.xlsx",
  caption: "Animation with the sample invoices. Try your own in the live demo.",
  rows: [
    { number: "R-09", issuer: "Maria Olivia Martinez", amount: "MX$19,066.67", state: "active", alert: "Cancellation pending", tone: "accent" },
    { number: "A-101", issuer: "Indistria Iluminadora", amount: "MX$21,460.00", state: "active" },
    { number: "CAP-2208", issuer: "Universidad Robotica", amount: "MX$13,920.00", state: "cancelled" },
    { number: "A-102", issuer: "Indistria Iluminadora", amount: "MX$8,410.00", state: "active" },
    { number: "A-102", issuer: "Indistria Iluminadora", amount: "MX$8,410.00", state: "active", alert: "Duplicate", tone: "soft" },
    { number: "XI-5531", issuer: "Xenon Industrial", amount: "US$1,450.00", state: "active" },
    { number: "M-777", issuer: "Karla Fuente Nolasco", amount: "MX$5,568.00", state: "not_found" },
    { number: "HE-310", issuer: "Herreria & Electricos", amount: "MX$11,136.00", state: "active", alert: "69-B list", tone: "danger" },
  ],
};

/* ── Cost of manual work calculator ────────────────────────── */

export const CALCULATOR = {
  title: "How much is manual work costing you today?",
  intro:
    "Move the sliders with your team's numbers. It's a quick estimate to size the problem, not a quote.",
  // Currency it starts with; the visitor can switch it
  currency: "USD",
  locale: "en-US",
  weeksPerYear: 48, // working weeks per year
  // Cost per hour in each currency: starting value and slider range
  currencies: {
    MXN: { start: 150, min: 50, max: 1000, step: 10 },
    USD: { start: 25, min: 5, max: 150, step: 5 },
  },
};

/* ── How I work ─────────────────────────────────────────────── */

export const PROCESS = [
  {
    title: "Discovery",
    text: "We review the current process together: what's done by hand, how much time it takes and where errors creep in.",
  },
  {
    title: "Proposal",
    text: "I define scope, architecture and deliverables with clear timelines, before writing a single line of code.",
  },
  {
    title: "Build",
    text: "I work in short iterations with frequent demos, so you validate progress with your real data.",
  },
  {
    title: "Delivery and support",
    text: "I deploy to your server or the cloud, document the system and support your team through adoption.",
  },
];

/* ── Stack ──────────────────────────────────────────────────── */

// Tool explorer (BranchedMenu in "About")
export const STACK = [
  {
    area: "Backend",
    items: [
      { name: "FastAPI", text: "Fast, typed APIs with automatic docs. It powers DataRefine and AgendaFlow." },
      { name: "Python", text: "Data processing, task automation and geospatial analysis." },
      { name: "CodeIgniter 4", text: "VillaNet's REST API in PHP 8: JWT, role-based filters and PHPUnit tests." },
      { name: "MySQL", text: "Multi-tenant modeling of customers, services, routers and invoices." },
    ],
  },
  {
    area: "Frontend",
    items: [
      { name: "React", text: "Interactive interfaces and reusable components, like this site and its live demos." },
      { name: "Vue 3", text: "VillaNet's SPA with Pinia and Vite, tested with Vitest." },
      { name: "Tailwind CSS", text: "Consistent styling and responsive design without slowing development down." },
    ],
  },
  {
    area: "Infrastructure",
    items: [
      { name: "Linux", text: "Server administration: configuration, services and application deployment." },
      { name: "Proxmox", text: "Virtualization to host several isolated services on one physical server." },
      { name: "MikroTik", text: "Automatic customer provisioning through the RouterOS API." },
      { name: "WireGuard", text: "Encrypted tunnels to field nodes, with a VPS as relay." },
      { name: "AWS", text: "Cloud deployment and hosting when the project calls for it." },
    ],
  },
  {
    area: "Data and AI",
    items: [
      { name: "AI APIs", text: "Language models integrated through APIs to analyze, classify and clean data." },
      { name: "NumPy", text: "Numerical computing and large-scale data analysis." },
    ],
  },
];

/* ── About ──────────────────────────────────────────────────── */

export const ABOUT = {
  title: "Technology that works for your operation.",
  bio: [
    "I'm Irving Dávila, a full-stack developer focused on AI-powered automation. I specialize in finding the processes that eat up hours of manual work and turning them into reliable tools that are easy to use and ready for production.",
    "I've built everything from a SaaS platform that configures MikroTik routers automatically to tools that clean data with AI. I work end to end: from data modeling and FastAPI APIs to the React interface and deployment on Linux servers or AWS. I care as much about solid code as I do about the people using it understanding what's going on.",
  ],
  principles: [
    { title: "Clarity", text: "I explain every technical decision in business terms." },
    { title: "Pragmatism", text: "I choose the simplest solution that solves the problem." },
    { title: "Quality", text: "Maintainable, documented code that's ready to grow." },
  ],
};

export const INTERESTS = [
  {
    title: "German",
    text: "I study it for fun and practice whenever I can. Learning a language is also training consistency.",
  },
  {
    title: "The outdoors",
    text: "Discovering new trails clears my head and sends me back to the keyboard with better ideas.",
  },
  {
    title: "Formula 1",
    text: "I follow the strategy and telemetry of every race: it's also about reading data to make better decisions.",
  },
];

/* ── Developer mode (CodeSlots in the footer) ───────────────────
   The PIN is printed on the back of the 3D badge (public/card-back.svg). */

export const DEV_MODE = {
  pin: "1024",
  title: "Found the PIN?",
  hint: "Click the badge at the top of the page to flip it: the access code is on the back.",
  build: [
    ["Framework", "React 19 + Vite"],
    ["Styles", "Tailwind CSS 4"],
    ["3D", "Three.js (badge)"],
    ["Animation", "framer-motion"],
    ["Components", "React Bits"],
    ["Typography", "Bricolage Grotesque · Instrument Sans · JetBrains Mono"],
  ],
};

/* ── Project brief (Stepper in Contact) ─────────────────────── */

export const BRIEF = {
  title: "Put together your brief in a minute",
  intro: "Three quick questions and I'll leave the email ready to send.",
  areas: [
    "Reports",
    "Data cleaning",
    "Manual data entry",
    "Connecting systems",
    "Other",
  ],
  tools: ["Excel / Google Sheets", "ERP", "CRM", "Database", "In-house system"],
  hours: ["Less than 5 h", "5 to 20 h", "More than 20 h", "Not sure"],
};

/* ── Direct contact ─────────────────────────────────────────── */

// Message that arrives already written on WhatsApp, by the page it comes from
// (the number and the booking link live in src/content/contact.js)
export const WHATSAPP_MESSAGES = {
  general: "Hi Irving, I saw your portfolio and I'd like to talk about a project.",
  agenda: "Hi Irving, I saw the AgendaFlow demo and I'm interested in the AI appointment agent.",
  contadores: "Hi Irving, I'm an accountant and I saw FacturaCheck. I'd like to check my clients' invoices.",
  consultorios: "Hi Irving, I run a clinic and I saw AgendaFlow. I'm interested in the WhatsApp appointment agent.",
  fastapi: "Hi Irving, I saw your portfolio and I need help with a FastAPI backend.",
};

/* ── Starting rates ─────────────────────────────────────────── */

// "to": the package's page; "topic": WhatsApp message (WHATSAPP_MESSAGES)
export const PRICING = {
  eyebrow: "Rates",
  title: "Starting rates, no surprises.",
  intro: "Every project gets a fixed-price proposal after a 15-minute call. These are the starting points.",
  from: "From",
  note: "Prices in US dollars. The monthly fee covers hosting, the paid AI tier when it applies and support.",
  packages: [
    {
      name: "AI appointment agent",
      audience: "Clinics and service businesses",
      price: "US$450",
      extra: "setup + from US$70 a month",
      includes: [
        "Books, reschedules and cancels over WhatsApp or web chat",
        "Your services, hours and rules",
        "Reminders the day before each appointment",
      ],
      cta: "Try the demo",
      to: "/demo/agenda",
      topic: "agenda",
    },
    {
      name: "FastAPI backends and integrations",
      audience: "Teams that need an API or a data pipeline",
      price: "US$35 / hour",
      extra: "or fixed-price projects from US$600",
      includes: [
        "Typed APIs with tests and documentation",
        "AI APIs, spreadsheets and third-party integrations",
        "Deployed on your cloud or your Linux servers",
      ],
      cta: "Tell me about your API",
      to: "/#contacto",
      topic: "fastapi",
    },
    {
      name: "Custom automation",
      audience: "Manual work with spreadsheets, reports or data entry",
      price: "US$500",
      extra: "per project, at a fixed price",
      includes: [
        "Diagnosis and proposal before any work starts",
        "Data cleaning, reports and integrations",
        "Documentation and hand-holding at delivery",
      ],
      cta: "Tell me about your process",
      to: "/#contacto",
      topic: "general",
    },
  ],
};

/* ── Privacy notice (/en/privacidad) ────────────────────────── */

// Follows Mexico's personal data law (LFPDPPP). The address lives in
// src/content/contact.js
export const PRIVACY = {
  title: "Privacy notice",
  updated: "Last updated: October 18, 2026",
  intro: (name, address) =>
    `${name}, with address at ${address}, is responsible for the use and protection of your personal data under Mexico's Federal Law on the Protection of Personal Data Held by Private Parties. This notice explains what data this site and its demos collect, what it is used for and how to exercise your rights. If this English version and the Spanish one differ, the Spanish one prevails.`,
  sections: [
    {
      title: "What data I collect",
      items: [
        "If you contact me by email, WhatsApp, the brief or the booking page: your name, email, phone, company and what you tell me about your project.",
        "If you use the demos: the files and invoices you upload and the messages you type in the chat. They are processed in memory to show you the result and are not stored.",
        "Technical data: your IP address, only to limit the number of tries per person. It is kept in memory and discarded when the server restarts.",
        "I don't collect sensitive data. In the demos, please don't type or upload health information or real data about patients or clients.",
      ],
    },
    {
      title: "What I use it for",
      items: [
        "Answering you, preparing a proposal and, if you hire me, providing the service and support.",
        "Showing you the result of the demos.",
        "I don't use your data for advertising and I don't sell it.",
      ],
    },
    {
      title: "Who it is shared with",
      text: "Only with the providers that make the site and the demos work, and only for that:",
      items: [
        "Cloudflare, which hosts the site, and Render, which hosts the demo servers.",
        "AI providers on their free tier (Google Gemini, Groq and OpenRouter), which process the texts of the DataRefine and AgendaFlow demos. Their terms let them use that data to improve their services, which is why the demos ask for made-up data. With clients I use paid tiers that don't use the data to train models.",
        "The SAT, Mexico's tax authority, to check the status of the invoices you upload to FacturaCheck: only the fiscal folio, the tax IDs and the total, the same data as the invoice's QR code.",
        "WhatsApp (Meta), Cal.com or your email provider, if you contact me through them.",
        "Beyond that, I don't share your data unless an authority requires it by law.",
      ],
    },
    {
      title: "Your rights",
      text: "You can access, correct or delete your data or object to its use (ARCO rights), and you can withdraw your consent or limit its use.",
      items: [
        "Write to {email} with your name, the right you want to exercise and the data it refers to.",
        "I'll answer within 20 business days.",
      ],
    },
    {
      title: "Cookies and storage",
      items: [
        "The site doesn't use tracking or advertising cookies.",
        "Your browser stores the language and currency you pick, only to remember them on your next visit.",
      ],
    },
    {
      title: "Changes to this notice",
      items: ["If this notice changes, I'll publish the new version on this page with its date."],
    },
  ],
  pending: "Address pending",
};

/* ── FAQ ────────────────────────────────────────────────────── */

export const FAQ = [
  {
    // If you change the prices in PRICING, change them here too
    q: "How much does a project cost?",
    a: "There are starting rates: AI appointment agents from US$450, FastAPI work from US$35 an hour or fixed-price projects from US$600, and custom automation from US$500. After a 15-minute call you get a fixed-price proposal with deliverables and timeline.",
  },
  {
    q: "How long does it take?",
    a: "Timelines are set in the proposal. I work in short iterations, so you see working progress from the start, not just at the end.",
  },
  {
    q: "Do I need technical knowledge?",
    a: "No. We talk in terms of your operation: what you do today, how long it takes and what result you expect. I take care of turning that into technology.",
  },
  {
    q: "Where is the solution hosted?",
    a: "Wherever makes the most sense for you: on your own Linux servers, in a Proxmox virtual environment or on AWS. Always documented, so you don't depend on me.",
  },
  {
    q: "What happens to my data?",
    a: "It's used only for the project, as the privacy notice explains. The demos use the AI's free tier, which is why they ask for made-up data; with clients I use the paid tier, whose terms don't allow your data to be used to train models, and you'll see it in writing in the proposal.",
  },
  {
    q: "Is there support after delivery?",
    a: "Yes. I support your team through adoption, and we can agree on ongoing support and improvements as you need them.",
  },
];

/* ── Manifesto (ScrollReveal) ───────────────────────────────── */

export const MANIFESTO = {
  text: "Every hour your team spends copying, pasting and fixing data is an hour it doesn't spend deciding. My job is to hand those hours back with tools that just work.",
  highlight: ["hand", "those", "hours", "back"],
};

/* ── Contact ────────────────────────────────────────────────── */

export const CONTACT = {
  title: "Got a manual process eating up",
  highlight: "hours every week?",
  text: "Tell me what you do by hand today and I'll explain, with no commitment, how I'd automate it.",
};

/* ── Animated example on the landing page (illustrative) ────────
   bad[i]    → cell i has a problem before cleaning
   merged    → the row is a duplicate merged into another one
   review[i] → after cleaning, the cell stays flagged for review */
export const DEMO_FILE = "customers_december.xlsx";
export const DEMO_COLUMNS = ["customer", "date", "amount"];

export const DEMO_ROWS = [
  {
    before: ["  john smith ", "03/12/24", "$1,200.50"],
    after: ["John Smith", "2024-12-03", "1,200.50"],
    bad: [true, true, true],
  },
  {
    before: ["JOHN SMITH", "2024-12-03", "1200.5"],
    merged: true,
    bad: [true, false, true],
  },
  {
    before: ["mary  lopez", "12 mar 24", "(empty)"],
    after: ["Mary Lopez", "2024-03-12", "—"],
    bad: [true, true, true],
    review: [false, false, true],
  },
  {
    before: ["CARLOS RUIZ", "5-jan-2025", "950"],
    after: ["Carlos Ruiz", "2025-01-05", "950.00"],
    bad: [true, true, true],
  },
];

/* ── Sample file for the demo ──────────────────────────────────
   Lets anyone try DataRefine without an Excel file at hand. Dates go
   day first, like the cleaner reads them. */
const SAMPLE_CSV = `customer,date,amount
"  john smith ",03/12/24,"$1,200.50"
JOHN SMITH,2024-12-03,1200.5
mary  lopez,12 mar 24,
CARLOS RUIZ,5-jan-2025,950
anna  taylor,2025/01/15,"$2,310.00"
Anna Taylor,15-01-2025,2310
LUKE  harris ,20 feb 25,"$780.9"
sophia MARTIN,2025-02-28,N/A
peter  green,1/3/25,1.540
`;

export const makeSampleFile = () =>
  new File([SAMPLE_CSV], "customers_sample.csv", { type: "text/csv" });

/* ──────────────────────────────────────────────────────────────
   INTERFACE — buttons, labels and messages of each screen
   ────────────────────────────────────────────────────────────── */

export const UI = {
  lang: {
    label: "Language",
    // What visitors on the other language's page are offered
    offer: "This site is also available in English.",
    switchTo: "View in English",
    dismiss: "Stay in Spanish",
  },
  contact: {
    whatsapp: "Message me on WhatsApp",
    whatsappShort: "WhatsApp",
    booking: "Book a 15-min call",
  },
  common: {
    liveDemo: "Live demo",
    backToPortfolio: "Back to portfolio",
    tryLiveDemo: "Try the live demo",
    watchVideo: "Watch the video",
    watchWalkthrough: "Watch the video walkthrough",
    closeVideo: "Close video",
    letsTalk: "Let's talk",
    details: "Details",
    skipToContent: "Skip to content",
    close: "Close",
    projectTech: "Project technologies",
    tech: "Technologies",
  },
  header: {
    nav: "Main",
    talk: "Let's talk",
    menu: "Menu",
    close: "Close",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    menuPanel: "Navigation menu",
    mobileNav: "Mobile",
  },
  landing: {
    title: "Irving Dávila — AI automation and full-stack development",
    // Proxmox and MikroTik in the logo strip: they speak to recruiters
    showInfraLogos: true,
    tryDataRefine: "Try DataRefine",
    talk: "Tell me about your project",
    dragHint: "Drag it or click to flip it ↗",
    badgeFront: "Show the front of the badge",
    badgeBack: "Show the back of the badge",
    services: {
      eyebrow: "Services",
      title: "What I can solve for your team.",
      intro:
        "Custom solutions for operations that run on spreadsheets, repetitive tasks and systems that don't talk to each other.",
    },
    caseStudy: "Case study",
    challenge: "The challenge",
    solution: "The solution",
    howItWorks: "How it works",
    tryAgent: "Try the agent live",
    showcase: {
      alt: "DataRefine demo cleaning a file with AI",
      title: "See it in action",
      hint: "Scroll ↓",
    },
    underTheHood: {
      eyebrow: "Technical docs",
      title: "Under the hood",
      text: "DataRefine's architecture, validation and error handling, summed up in three sheets. Open the folder and click a sheet to enlarge it.",
    },
    projects: {
      eyebrow: "More projects",
      title: "I also build complete platforms.",
      intro:
        "End-to-end systems, from the database to the network. Here's a look inside one of them.",
    },
    process: {
      eyebrow: "Process",
      title: "A clear process, from idea to production.",
      intro:
        "No surprises: you know what will be built, when it ships and how we'll measure the result.",
    },
    about: {
      eyebrow: "About me",
      photoAlt: "Portrait of Irving Dávila",
      role: "Full-stack · Applied AI",
      available: "Available",
      tools: "Tools",
      outside: "Away from the terminal",
    },
    faq: {
      eyebrow: "FAQ",
      title: "What people usually ask me before we start.",
      intro: "If your question isn't here, write to me: I answer personally.",
    },
    contact: {
      eyebrow: "Contact",
      write: "Email me",
      copy: "Copy email",
      copied: "Email copied",
      copiedStatus: "Email copied to the clipboard",
    },
    footer: {
      tagline: "Tools that turn manual work into automated processes.",
      navLabel: "Footer",
      nav: "Navigation",
      connect: "Connect",
      email: "Email",
      rights: "All rights reserved.",
      top: "Back to top",
      privacy: "Privacy notice",
    },
    knowsAbout: [
      "Process automation",
      "FastAPI",
      "React",
      "Linux",
      "Proxmox",
      "AWS",
      "AI APIs",
    ],
    techLogos: "Technologies I work with",
  },
  calculator: {
    eyebrow: "Calculator",
    people: "People doing the task",
    peopleValue: (n) => `${n} ${n === 1 ? "person" : "people"}`,
    hours: "Hours per week, per person",
    rate: "Cost per hour",
    currency: "Currency",
    share: "Share that could be automated",
    perYear: "Every year, your team spends",
    cost: "on this process, at an approximate cost of",
    recover: (share) => `If you automate ${share} %, you could get back`,
    weeks: (n) => `Assumes ${n} working weeks per year.`,
    cta: "I want that time back",
  },
  bento: {
    log: [
      "sales_report.xlsx received",
      "Data validated and normalized",
      "Summary generated with AI",
      "Sent to management ✓",
    ],
    clicks: "0 manual clicks",
    clean: [
      ["  john smith ", "John Smith"],
      ["03/12/24", "2024-12-03"],
      ["$1,200.50", "1200.50"],
    ],
    servers: ["proxmox-01", "mikrotik-north", "wg0 · tunnel"],
    active: "up",
  },
  moreProjects: {
    dragHint: "Drag or tap →",
    compareHint: "Hover or tap the image to compare.",
    tryDemo: "Try the demo",
    code: "See the code on GitHub",
  },
  devMode: {
    eyebrow: "Developer mode",
    pin: "Access PIN",
    checking: "Checking access…",
    granted: "Access granted in",
    steps: ["PIN verified", "Opening the developer panel"],
    thanks: "# Thanks for exploring with curiosity: that's how I start every project.",
  },
  brief: {
    steps: ["Process", "Context", "About you"],
    areas: "What would you like to automate?",
    describe: "Describe it in one sentence (optional)",
    describePlaceholder: "E.g. Every Monday we merge 4 Excel files for the sales report.",
    tools: "What do you work with today?",
    hours: "How much time does it take each week?",
    name: "Name",
    namePlaceholder: "Your name",
    company: "Company (optional)",
    companyPlaceholder: "Company name",
    back: "Back",
    next: "Continue",
    complete: "Write the message",
    ready: "Your message is ready",
    readyText: (email) => `Open it in your email app, or copy it and send it to ${email}.`,
    open: "Open in my email",
    whatsapp: "Send on WhatsApp",
    copy: "Copy message",
    edit: "Edit answers",
    needArea: "Pick at least one option or describe it in a sentence.",
    needName: "Write your name to sign the message.",
    copied: "Message copied",
    copiedDetail: (email) => `Paste it into an email to ${email}`,
    to: "To",
    subjectLabel: "Subject",
    subject: (company) => `Automation project${company ? ` · ${company}` : ""}`,
    body: ({ name, company, areas, detail, tools, hours }) =>
      [
        "Hi Irving,",
        "",
        `I'm ${name}${company ? `, from ${company}` : ""}.`,
        "",
        `I'd like to automate: ${areas || "—"}`,
        ...(detail ? [`Details: ${detail}`] : []),
        `Tools we use today: ${tools || "—"}`,
        `Time we spend on it each week: ${hours || "—"}`,
        "",
        "Can we talk?",
      ].join("\n"),
  },
  cleaningDemo: {
    state: "Data state",
    before: "Before",
    after: "After",
    table: "Sample data before and after cleaning",
    aiSteps: [
      "Normalizing names",
      "Unifying dates and amounts",
      "Merging duplicates",
      "Flagging missing data",
    ],
    working: "Cleaning with AI…",
    done: "Cleaned in",
    fixed: (n) => `${n} cells fixed`,
    merged: (n) => `${n} ${n === 1 ? "duplicate merged" : "duplicates merged"}`,
    review: (n) => `${n} to review`,
    problems: (n) => `${n} cells with problems`,
    caption: "Illustrative example of how the data is transformed.",
  },
  notFound: {
    title: "Page not found — Irving Dávila",
    eyebrow: "Error · Page not found",
    heading: "This page doesn't exist",
    text: "The address may be misspelled or the page may have moved. Let's get back on familiar ground.",
    home: "Go to the home page",
  },
  // Default texts of the React Bits components
  bits: {
    step: "Step",
    folder: "Folder",
    slider: "Slider",
    loading: "Loading",
    readyIn: "Done in",
    failedAfter: "Failed after",
    inProgress: "in progress",
    thinking: "Thinking…",
    code: "Code",
    codeAccepted: "Code accepted",
    digits: (filled, length) => `${filled} of ${length} digits`,
    status: {
      pending: "Pending",
      running: "In progress",
      done: "Done",
      failed: "Failed",
    },
  },
};

/* ── AgendaFlow animation on the landing page ──────────────────
   A sample conversation that plays by itself (no real AI). */

export const AGENT_DEMO = {
  clinic: "Sonrisa Dental Clinic",
  role: "AI assistant",
  typing: "typing…",
  replay: "Replay",
  day: "Calendar · Thursday 22",
  free: "open",
  booked: "Laura · Dental cleaning",
  tools: "Tools",
  toolsLabel: "Tools the agent ran",
  rule: "Rule",
  caption: "Animation of a real conversation. Try it yourself in the live demo.",
  script: [
    { kind: "user", text: "Hi, do you have a cleaning on Thursday afternoon?", wait: 900 },
    { kind: "tool", name: "ver_disponibilidad", detail: "cleaning · Thursday 22", ok: true, wait: 1000 },
    { kind: "agent", text: "Sure! On Thursday the 22nd I have 15:00, 16:00 and 17:00. Which one works for you?", wait: 1800 },
    { kind: "user", text: "The 4 o'clock one. I'm Laura, 555 876 5432", wait: 900 },
    { kind: "tool", name: "agendar_cita", detail: "Thursday 22, 16:00 · C-3924", ok: true, wait: 1000 },
    {
      kind: "agent",
      text: "All set, Laura! You're booked for Thursday at 16:00 with Dr. Ana Torres. Your code is C-3924.",
      wait: 2000,
    },
    { kind: "user", text: "Actually, move it to Sunday", wait: 900 },
    {
      kind: "tool",
      name: "reprogramar_cita",
      detail: "Sunday 25",
      ok: false,
      error: "The clinic is closed on Sunday.",
      wait: 1000,
    },
    { kind: "agent", text: "We're closed on Sundays. Shall I move it to Saturday the 24th at 10:00?", wait: 0 },
  ],
  // Thursday afternoon: what was already booked and the open slots
  slots: [
    { time: "15:00" },
    { time: "15:30", busy: "General checkup" },
    { time: "16:00" },
    { time: "16:30", busy: "Cavity filling" },
    { time: "17:00" },
    { time: "17:30", busy: "Teeth whitening" },
  ],
};

/* ── DataRefine demo (/en/demo/datarefine) ──────────────────── */

export const DATA_LAB = {
  title: "DataRefine — Live demo · Irving Dávila",
  heading: "Upload a messy Excel file. Get it back clean.",
  intro:
    "First you see, right in your browser, what problems your file has. Then AI fixes them and gives you back an .xlsx ready to use. No accounts or setup.",
  facts: (rows) => ["CSV, XLSX and XLS", `Up to ${rows} rows`, "Diagnosis in your browser", "Result as .xlsx"],
  errors: {
    format: "Unsupported format. Upload an .xlsx, .xls or .csv file.",
    size: (mb) => `The demo accepts files up to ${mb} MB. Upload a smaller one.`,
    empty: "The file is empty. Upload one that has data.",
    generic: "The file couldn't be processed. Check the format or try again.",
    network: "Couldn't reach the server. Check your connection and try again.",
  },
  steps: ["Upload file", "Review and clean", "Download"],
  progress: "Progress",
  workArea: "File cleaning",
  drop: "Drop the file to load it",
  drag: "Drag your file here",
  or: "or",
  choose: "choose one from your computer",
  formats: "Supported formats",
  limits: (mb, rows) => `Up to ${mb} MB and ${rows} rows`,
  remove: "Remove file",
  noFile: "Don't have a file at hand?",
  sample: "Try it with sample data",
  sampleLoaded: "Sample data loaded",
  sampleDetail: "A CSV with typical data entry errors.",
  checking: "Checking the file",
  noPreview:
    "The preview is available for .csv and .xlsx files. DataRefine processes your file anyway.",
  rows: "Rows",
  columns: "Columns",
  problems: "Problems",
  found: "What we found",
  preview: "Preview",
  previewIssues: "Preview of the original file with its problems highlighted",
  previewFile: "File preview",
  noProblems: "We don't see obvious problems; the AI will review the content in depth.",
  tooManyRows: (rows, max) =>
    `Your file has ${rows.toLocaleString("en-US")} rows and the demo handles up to ${max}. Try with part of the file.`,
  clean: "Clean with AI",
  retry: "Try again",
  willFix: (n) =>
    n
      ? `Fixes ${n === 1 ? "the problem" : `the ${n} problems`} and gives you back an .xlsx.`
      : "Gives you back a clean, consistent .xlsx.",
  cancel: "Cancel",
  cleaning: "Cleaning with AI",
  fixing: "What's being fixed",
  slow: "This is taking longer than usual. You can cancel and try again.",
  wait: "It can take a few seconds, depending on the file size.",
  scanning: "Original file while it's being cleaned",
  cleanSuffix: "clean",
  cleanTitle: "Your file is clean",
  readyIn: "Cleaned in",
  doneSteps: (noAI) => [
    "File reviewed in your browser",
    "Dates, amounts and duplicates fixed",
    noAI ? "AI text review skipped" : "Text reviewed with AI",
    "Clean Excel file generated",
  ],
  aiLimited: "The AI reached its daily limit in the demo: the automatic rules were applied.",
  aiBusy:
    "The AI is overloaded right now: the automatic rules were applied. Try again in a few minutes to have the text reviewed too.",
  fixed: "Problems fixed",
  ofDetected: (n) => `of ${n} found`,
  finalRows: "Final rows",
  ofOriginal: (n) => `of ${n} original`,
  toReview: "To review",
  inYellow: ", in yellow in the Excel file",
  allGood: "All good",
  compare: "Compare versions",
  before: "Before",
  after: "After",
  cleanFile: "Clean file",
  originalFile: "Original file",
  download: "Download clean file",
  another: "Clean another file",
  toastClean: "File cleaned",
  toastFixed: (n) => `${n} problems fixed.`,
  toastReady: "Ready to download.",
  whatItFixes: "What DataRefine fixes",
  beforeUpload: "Before you upload",
  rules: (formats, mb, rows, perHour) => [
    ["Formats", formats],
    ["Max size", `${mb} MB`],
    ["Rows per file", `up to ${rows}`],
    ["Tries", `${perHour} per hour`],
    ["Result", "clean .xlsx"],
  ],
  publicDemo:
    "This is a public demo: don't upload sensitive data. The version for your company has none of these limits.",
  forBusiness: "Need it for your business?",
  forBusinessText:
    "I adapt it to your files: your operation's rules, more columns or a direct connection to your system.",
};

// Name and explanation of each problem type (colors live in lib/sheet.js)
export const ISSUE_TEXT = {
  all: { label: "All problems", hint: "Highlighted in the table" },
  dup: { label: "Duplicate rows", hint: "The same record, written differently" },
  empty: { label: "Empty cells", hint: "No value or N/A" },
  format: { label: "Mixed formats", hint: "Inconsistent dates and amounts" },
  case: { label: "Mixed capitalization", hint: "UPPERCASE and lowercase" },
  spaces: { label: "Extra spaces", hint: "At the start, at the end or doubled" },
};

export const SHEET_PREVIEW = {
  empty: "empty",
  shown: (shown, matching, total, issue) =>
    `${shown} of ${matching} ${matching === 1 ? "row" : "rows"}${
      issue ? ` with ${issue.toLowerCase()}` : ""
    }${total > matching ? ` (${total} in total)` : ""}`,
  spaces: " · «·» = extra space",
  more: "Show more rows",
  less: "Show less",
};

/* ── AgendaFlow demo (/en/demo/agenda) ──────────────────────── */

export const AGENDA_LAB = {
  title: "AgendaFlow — Live demo · Irving Dávila",
  heading: "An AI agent that books appointments for you.",
  intro:
    "Text it like you would on WhatsApp: check open times, book, reschedule or cancel. As you chat, the clinic's calendar updates and you see every action the agent runs.",
  facts: [
    "Sample clinic",
    "Uses made-up data",
    "Books, reschedules and cancels",
    "Rules validated in the backend",
  ],
  tabs: { label: "Demo view", chat: "Chat", agenda: "Calendar", actions: "Actions" },
  errors: {
    network: "Couldn't reach the server. Check your connection and try again.",
    generic: "Something went wrong. Please try again.",
    asleep: "The demo server didn't wake up in time. Try again in a moment.",
    expired: "This conversation expired. Press “Restart” to start a new one.",
  },
  chat: {
    label: "Chat with the clinic's assistant",
    fallbackName: "Sonrisa Dental Clinic",
    online: "online · AI assistant",
    typing: "typing…",
    connecting: "connecting…",
    offline: "offline",
    restart: "Restart",
    messages: "Messages",
    today: "Today",
    read: "Read",
    typingLabel: "The assistant is typing",
    see: "View",
    rule: "Rule",
    retry: "Try again",
    waking: "Waking up the server",
    connectingLabel: "Connecting",
    sleepy:
      "The free server sleeps when nobody uses it; the first time it can take up to a minute.",
    inputLabel: "Write a message",
    placeholder: "Text it like on WhatsApp…",
    placeholderOff: "Connecting…",
    send: "Send",
    remaining: (n) => `${n} messages left in this demo`,
    fakeData: "Sample clinic: don't type real data.",
    suggestions: [
      "What services do you offer and how much are they?",
      "I'd like a cleaning on Thursday afternoon",
      "Do you have parking?",
      "I want to change my appointment",
    ],
  },
  calendar: {
    label: "Clinic calendar",
    title: "Clinic calendar",
    subtitle: "Updates with every action of the agent",
    previous: "Previous week",
    next: "Next week",
    thisWeek: "This week",
    appointments: "Appointments",
    occupancy: "Occupancy",
    yours: "Yours",
    closed: "Closed",
    day: "Day",
    today: "today",
    hasYours: "You have an appointment",
    dayLabel: (weekday, day) => `Appointments on ${weekday} ${day}`,
    note: "The other appointments belong to made-up patients. Each visitor gets their own copy of the calendar; nothing is shared or stored.",
  },
  actions: {
    label: "Agent actions",
    title: "What the agent did",
    count: (n, blocked) =>
      `${n} ${n === 1 ? "action" : "actions"}${
        blocked ? ` · ${blocked} stopped by rules` : ""
      }`,
    empty:
      "Here you'll see every tool the agent runs behind the chat. They all go through the backend's rules; the AI can't skip them.",
    tools: "Agent tools",
    rule: "Backend rule",
  },
  clinic: {
    label: "Clinic details",
    sample: "Sample business · made-up data",
    services: "Services",
    hours: "Hours",
    team: "Team",
    closed: "Closed",
    details: "Clinic services, prices and hours",
  },
  cards: {
    behind: "What's behind it",
    business: "In your business",
    want: "Want it for your business?",
    wantText:
      "Clinics, salons, repair shops or offices: I adapt it to your services, hours and team, and connect it to your WhatsApp.",
  },
};


/* ── FacturaCheck demo (/en/demo/cfdi) ──────────────────────── */

export const CFDI_LAB = {
  title: "FacturaCheck — Live demo · Irving Dávila",
  heading: "Upload your invoices. See which ones need a look.",
  intro:
    "Drop the XML files of your CFDI (Mexican e-invoices) or the ZIP the SAT portal downloads. Every invoice is checked with the SAT, Mexico's tax authority, and you get an Excel file with valid, cancelled and duplicate invoices and the tax totals.",
  facts: (max) => ["XML or the SAT's ZIP", `Up to ${max} invoices`, "Status checked with the SAT", "Excel report"],
  errors: {
    format: (name) => `"${name}" isn't XML or ZIP. Upload your CFDI as .xml files or in a .zip.`,
    size: (mb) => `The demo reviews up to ${mb} MB at a time. Remove some files.`,
    count: (max) => `The demo reviews up to ${max} files at a time.`,
    generic: "The invoices couldn't be reviewed. Try again.",
    network: "Couldn't reach the server. Check your connection and try again.",
  },
  steps: ["Upload invoices", "Check with the SAT", "Download report"],
  progress: "Progress",
  workArea: "Invoice review",
  drop: "Drop your invoices",
  drag: "Drag your XML files or the ZIP here",
  or: "or",
  choose: "pick them from your computer",
  formats: "Accepted formats",
  limits: (max, mb) => `Up to ${max} invoices and ${mb} MB`,
  noFiles: "No invoices at hand?",
  sample: "Try 12 sample invoices",
  sampleZip: "download the sample ZIP",
  sampleLoaded: "Sample invoices loaded",
  sampleDetail: "September purchases with a few cases to review.",
  sampleFailed: "The sample invoices couldn't be loaded. Try again.",
  selected: (n) => `${n} ${n === 1 ? "file" : "files"} ready to review`,
  zip: "ZIP",
  add: "Add files",
  remove: (name) => `Remove ${name}`,
  clear: "Remove all",
  review: "Check with the SAT",
  retry: "Try again",
  willCheck:
    "Each invoice is checked with the SAT's public service, the same one the invoice's QR code uses.",
  cancel: "Cancel",
  checking: "Checking with the SAT",
  workingSteps: [
    "Reading the XML files",
    "Checking each invoice with the SAT",
    "Looking for duplicates and issues",
    "Building the Excel file",
  ],
  slow: "The free server sleeps when nobody uses it: the first review can take up to a minute.",
  wait: "It usually takes a few seconds.",
  doneTitle: "Review ready",
  readyIn: "Review ready in",
  doneSteps: (n) => [
    `${n} ${n === 1 ? "invoice" : "invoices"} read`,
    "Status checked with the SAT",
    "Duplicates and issues found",
    "Excel file built",
  ],
  simulated:
    "The sample invoices are made up, so their SAT status is simulated. With your own XML files, the status is checked with the SAT.",
  period: (from, to) => `Invoices from ${from} to ${to}`,
  stats: {
    invoices: "Invoices",
    active: "Valid",
    cancelled: "Cancelled",
    flagged: "To review",
  },
  duplicatesLeft: (n) => `not counting ${n} ${n === 1 ? "duplicate" : "duplicates"}`,
  notFoundToo: (n) => `and ${n} the SAT doesn't have`,
  flaggedDetail: (n) => `${n} ${n === 1 ? "issue" : "issues"} in total`,
  allClear: "All in order",
  totalsTitle: "Totals in Mexican pesos",
  totalsNote: "Valid income invoices minus credit notes, without duplicates.",
  totals: {
    net: "Subtotal",
    iva: "IVA (VAT) charged",
    iva_withheld: "IVA withheld",
    isr_withheld: "ISR (income tax) withheld",
    total: "Total",
  },
  attention: "What needs your attention",
  nothingToCheck: "No invoice needs a second look.",
  alerts: {
    cancelled: { label: "Cancelled", text: "The SAT has it as cancelled: it can't be deducted." },
    not_found: {
      label: "Not at the SAT",
      text: "The SAT has no record of it: it may be fake (or just stamped).",
    },
    efos: {
      label: "69-B list",
      text: "The issuer is on the SAT's list of companies that invoice simulated operations.",
    },
    cancellation_pending: {
      label: "Cancellation pending",
      text: "The issuer asked to cancel it and is waiting for your answer.",
    },
    duplicate: { label: "Duplicate", text: (file) => `Same invoice as ${file}: counted once.` },
    unavailable: { label: "No answer from the SAT", text: "The SAT didn't answer: check it again later." },
    unreadable: { label: "Not a stamped CFDI" },
  },
  unreadable: {
    not_xml: "Not a valid XML file.",
    not_cfdi: "It's XML, but not a CFDI.",
    version: "Unsupported CFDI version (3.3 and 4.0 are read).",
    not_stamped: "Not stamped: it's a draft with no fiscal folio.",
    bad_data: "Required data is missing or an amount is invalid.",
  },
  table: {
    title: "Reviewed invoices",
    filter: "Show",
    all: "All",
    flagged: "With issues",
    invoice: "Invoice",
    issuer: "Issuer",
    date: "Date",
    total: "Total",
    status: "SAT status",
    paid: "paid",
  },
  states: {
    active: "Valid",
    cancelled: "Cancelled",
    not_found: "Not found",
    unavailable: "No answer",
  },
  kinds: { I: "Income", E: "Credit note", P: "Payment", N: "Payroll", T: "Transfer" },
  download: "Download Excel report",
  another: "Review other invoices",
  toastDone: "Review ready",
  toastDetail: (n) => (n ? `${n} ${n === 1 ? "invoice needs" : "invoices need"} a look.` : "All in order."),
  whatItChecks: "What FacturaCheck checks",
  checks: [
    "Whether each invoice is still valid or was cancelled",
    "Invoices the SAT has no record of",
    "Issuers on the SAT's 69-B list",
    "Cancellations waiting for your answer",
    "Duplicate files and drafts that were never stamped",
    "IVA, withheld ISR and totals per RFC (tax ID)",
  ],
  beforeUpload: "Before you upload",
  rules: (max, mb, perHour) => [
    ["Formats", ".xml and .zip"],
    ["Invoices per review", `up to ${max}`],
    ["Max size", `${mb} MB`],
    ["Reviews", `${perHour} per hour`],
    ["Result", "Excel with 4 sheets"],
  ],
  privacy:
    "Your files are read in memory and never stored. The SAT only gets what each invoice's QR code holds: fiscal folio, RFCs and total.",
  forBusiness: "Want it for your firm or company?",
  forBusinessText:
    "I connect it to the SAT's bulk download so it reviews every month on its own, with your deduction rules and email alerts.",
};
// Calendar dates: short weekday and month names, and time format
export const DATES = {
  locale: "en-US",
  weekdays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  // For the hours summary, Monday to Sunday ("Mon–Fri")
  days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  shortDate: (day, month) => `${month} ${day}`,
};
