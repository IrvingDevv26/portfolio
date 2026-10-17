import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useContent } from "../../lib/i18n";
import { focusRing } from "../../lib/ui";

/* React Bits · StaggeredMenu
   Menú a pantalla completa: capas de color que barren desde la derecha y
   enlaces grandes que suben en cascada. Accesible: Escape cierra, el foco
   queda atrapado dentro y vuelve al botón al cerrar. */

const LAYERS = ["#1A1712", "#D4B27A"];
const EASE = [0.76, 0, 0.24, 1];

const StaggeredMenu = ({ items, footer, open, onOpenChange }) => {
  const buttonRef = useRef(null);
  const panelRef = useRef(null);
  const reduce = useReducedMotion();
  const words = useContent().UI.header;

  // Bloquea el scroll, gestiona teclado y foco mientras está abierto
  useEffect(() => {
    if (!open) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e) => {
      if (e.key === "Escape") {
        onOpenChange(false);
        buttonRef.current?.focus();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const focusables = [
        buttonRef.current,
        ...panelRef.current.querySelectorAll("a[href], button"),
      ].filter(Boolean);
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKey);
    const focusTimer = setTimeout(
      () => panelRef.current?.querySelector("a[href]")?.focus(),
      reduce ? 0 : 450,
    );
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
      clearTimeout(focusTimer);
    };
  }, [open, onOpenChange, reduce]);

  // Si la ventana pasa a escritorio, el menú móvil se cierra solo
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = (e) => e.matches && onOpenChange(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [onOpenChange]);

  const t = (delay, duration = 0.6) =>
    reduce ? { duration: 0 } : { duration, delay, ease: EASE };

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls="menu-movil"
        aria-label={open ? words.closeMenu : words.openMenu}
        onClick={() => onOpenChange(!open)}
        className={`relative inline-flex h-9 items-center gap-2 rounded-full border border-[color:var(--line-strong)] bg-[rgba(16,18,23,0.7)] pl-4 pr-3 text-sm font-medium text-[color:var(--text)] backdrop-blur lg:hidden ${focusRing}`}
      >
        <span
          aria-hidden="true"
          className="relative block h-5 w-[3.4rem] overflow-hidden text-left"
        >
          <motion.span
            className="absolute inset-x-0 top-0 flex flex-col"
            animate={{ y: open ? "-50%" : "0%" }}
            transition={t(0, 0.4)}
          >
            <span className="h-5 leading-5">{words.menu}</span>
            <span className="h-5 leading-5">{words.close}</span>
          </motion.span>
        </span>
        <motion.svg
          viewBox="0 0 24 24"
          className="h-4 w-4"
          aria-hidden="true"
          animate={{ rotate: open ? 225 : 0 }}
          transition={t(0, 0.5)}
        >
          <path
            d="M12 4v16M4 12h16"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </motion.svg>
      </button>

      {createPortal(
        <AnimatePresence>
          {open && (
            <motion.div
              key="menu"
              id="menu-movil"
              role="dialog"
              aria-modal="true"
              aria-label={words.menuPanel}
              className="fixed inset-0 z-[45] lg:hidden"
              exit={{ opacity: reduce ? 0 : 1 }}
              transition={{ duration: reduce ? 0 : 0.5 }}
            >
              {LAYERS.map((color, i) => (
                <motion.div
                  key={color}
                  aria-hidden="true"
                  className="absolute inset-0"
                  style={{ background: color }}
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%", transition: t(0.12 - i * 0.06, 0.45) }}
                  transition={t(i * 0.07, 0.5)}
                />
              ))}

              <motion.div
                ref={panelRef}
                className="absolute inset-0 flex flex-col overflow-y-auto bg-[color:var(--raised)] px-6 pb-10 pt-28"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%", transition: t(0, 0.45) }}
                transition={t(0.14, 0.55)}
              >
                <nav aria-label={words.mobileNav}>
                  <ul className="space-y-1">
                    {items.map((item, i) => (
                      <li key={item.href} className="overflow-hidden">
                        <motion.a
                          href={item.href}
                          onClick={() => onOpenChange(false)}
                          className={`group flex items-baseline gap-4 rounded-md py-1 font-display text-[2.6rem] font-semibold leading-tight tracking-tight text-[color:var(--text)] ${focusRing}`}
                          initial={{ y: "110%" }}
                          animate={{ y: 0 }}
                          exit={{ y: "110%", transition: t(0, 0.25) }}
                          transition={t(0.32 + i * 0.06, 0.7)}
                        >
                          <span className="font-mono text-xs font-normal text-[color:var(--accent)]">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span className="transition-colors group-hover:text-[color:var(--accent)]">
                            {item.label}
                          </span>
                        </motion.a>
                      </li>
                    ))}
                  </ul>
                </nav>

                <motion.div
                  className="mt-auto pt-12"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, transition: t(0, 0.2) }}
                  transition={t(0.6, 0.5)}
                >
                  {footer}
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  );
};

export default StaggeredMenu;
