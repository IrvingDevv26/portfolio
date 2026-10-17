/* Llevar la vista a una sección (/#contacto o un enlace del menú).

   Las secciones fuera de pantalla usan content-visibility: mientras no se
   dibujan ocupan un alto estimado y, al dibujarse, cambian de tamaño y mueven
   el destino. Antes de saltar se dibujan todas (clase "cv-measure") para que el
   navegador conozca y recuerde su alto real. Después, durante un momento, se
   corrige la posición si algo termina de cargar (bloques diferidos, imágenes),
   salvo que la persona ya se esté moviendo por su cuenta. */

const SETTLE_MS = 1500; // tras llegar, tiempo que se vigila que nada la mueva
const MAX_MS = 5000; // tope, por si un scroll suave es muy largo
const STILL_FRAMES = 4; // cuadros sin moverse para dar por terminado el scroll
const STOP_EVENTS = ["wheel", "touchstart", "keydown", "pointerdown"];

export function scrollToSection(target, { smooth = false } = {}) {
  const root = document.documentElement;
  const started = performance.now();
  let frame = 0;
  let lastY = window.scrollY;
  let still = 0;
  let settledAt = null; // cuándo llegó por primera vez

  root.classList.add("cv-measure");
  target.scrollIntoView({ behavior: smooth ? "smooth" : "instant" });

  const stop = () => {
    cancelAnimationFrame(frame);
    STOP_EVENTS.forEach((type) => window.removeEventListener(type, stop));
    root.classList.remove("cv-measure");
  };

  const check = () => {
    const now = performance.now();
    // El scroll (suave o no) terminó cuando la página deja de moverse unos cuadros
    still = window.scrollY === lastY ? still + 1 : 0;
    lastY = window.scrollY;
    if (still >= STILL_FRAMES) {
      settledAt ??= now;
      const offset = parseFloat(getComputedStyle(root).scrollPaddingTop) || 0;
      const drift = target.getBoundingClientRect().top - offset;
      // Cerca del final de la página no siempre se puede subir más
      const atBottom =
        window.scrollY + root.clientHeight >= root.scrollHeight - 1;
      if (Math.abs(drift) > 2 && !(drift > 0 && atBottom)) {
        target.scrollIntoView({ behavior: "instant" });
      } else if (now - settledAt > SETTLE_MS) {
        stop();
        return;
      }
    }
    if (now - started > MAX_MS) {
      stop();
      return;
    }
    frame = requestAnimationFrame(check);
  };

  STOP_EVENTS.forEach((type) =>
    window.addEventListener(type, stop, { passive: true }),
  );
  frame = requestAnimationFrame(check);
  return stop;
}
