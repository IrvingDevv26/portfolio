/* Estilos reutilizables (clases de Tailwind compuestas) */

export const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--accent)]";

const BTN_BASE =
  "inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-[10px] font-semibold tracking-[-0.005em] transition duration-200 active:translate-y-px motion-reduce:transition-none disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none";

const BTN_SIZE = {
  md: "h-12 px-6 text-[15px]",
  sm: "h-9 px-4 text-sm",
};

const BTN_VARIANT = {
  // Marfil con filo de luz y un halo de latón muy leve debajo
  primary:
    "bg-[color:var(--btn)] text-[color:var(--btn-ink)] shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_1px_2px_rgba(0,0,0,0.5),0_14px_32px_-14px_rgba(212,178,122,0.55)] hover:bg-[color:var(--btn-hover)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,1),0_1px_2px_rgba(0,0,0,0.5),0_18px_38px_-14px_rgba(212,178,122,0.8)] disabled:hover:bg-[color:var(--btn)]",
  // Cristal con borde; al pasar el mouse toma el latón
  secondary:
    "border border-[color:var(--line-strong)] bg-[color:var(--glass)] text-[color:var(--text)] backdrop-blur hover:border-[color:var(--accent-line)] hover:bg-[color:var(--accent-bg)]",
  // Verde de WhatsApp: se reconoce al instante
  whatsapp:
    "bg-[#25D366] text-[#05210f] shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_14px_32px_-14px_rgba(37,211,102,0.6)] hover:bg-[#3ee27d]",
};

export const btn = (variant = "primary", size = "md") =>
  `${BTN_BASE} ${BTN_SIZE[size]} ${BTN_VARIANT[variant]} ${focusRing}`;

export const iconBtn = `inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] text-[color:var(--muted)] transition hover:bg-[color:var(--glass)] hover:text-[color:var(--text)] ${focusRing}`;

export const card =
  "rounded-2xl border border-[color:var(--line)] bg-[color:var(--raised)] shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_24px_48px_-24px_rgba(0,0,0,0.6)]";

export const delay = (i) => ({ animationDelay: `${i * 90}ms` });

// Estatus de una factura en el SAT (FacturaCheck): borde, fondo y texto
export const STATE_CHIP = {
  active:
    "border-[color:var(--clean-line)] bg-[color:var(--clean-bg)] text-[color:var(--clean)]",
  cancelled:
    "border-[color:var(--danger-line)] bg-[color:var(--danger-bg)] text-[color:var(--danger)]",
  not_found:
    "border-[color:var(--accent-line)] bg-[color:var(--accent-bg)] text-[color:var(--accent)]",
  unavailable:
    "border-[color:var(--line-strong)] bg-[color:var(--glass)] text-[color:var(--soft)]",
};

// Color de cada tipo de alerta, de la más grave a la más leve
export const TONE_COLOR = {
  danger: "var(--danger)",
  warn: "var(--warn)",
  accent: "var(--accent)",
  soft: "var(--soft)",
  muted: "var(--muted)",
};
