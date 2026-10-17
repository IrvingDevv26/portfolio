import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  browserLanguage,
  chosenLanguage,
  contentFor,
  localize,
  rememberLanguage,
  useLang,
} from "../lib/i18n";
import { focusRing } from "../lib/ui";
import { XIcon } from "./icons";

/* Sugerencia discreta de idioma: si el navegador está en inglés y la página en
   español (o al revés), ofrece el otro idioma, escrito en ese idioma. No
   redirige a nadie: aparece un momento, se va sola y, si la persona elige o
   la cierra, no vuelve a salir. */

const SHOW_AFTER = 1500;
const HIDE_AFTER = 14000;

const LanguageHint = () => {
  const lang = useLang();
  const { pathname, hash } = useLocation();
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const other = lang === "es" ? "en" : "es";
  const words = contentFor(other).UI.lang;

  useEffect(() => {
    if (chosenLanguage() || browserLanguage() !== other) return undefined;
    const show = setTimeout(() => setVisible(true), SHOW_AFTER);
    const hide = setTimeout(() => setVisible(false), SHOW_AFTER + HIDE_AFTER);
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
    };
  }, [other]);

  const choose = (code) => {
    rememberLanguage(code);
    setVisible(false);
    if (code !== lang) navigate(`${localize(pathname, code)}${hash}`);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.aside
          lang={other}
          aria-label={words.label}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-x-4 bottom-4 z-[70] mx-auto flex max-w-md items-center gap-3 rounded-2xl border border-[color:var(--line-strong)] bg-[rgba(16,18,23,0.92)] py-2.5 pl-4 pr-2 text-sm text-[color:var(--soft)] shadow-[0_24px_48px_-24px_rgba(0,0,0,0.8)] backdrop-blur-md sm:inset-x-auto sm:right-6"
        >
          <p className="min-w-0 flex-1">{words.offer}</p>
          <button
            type="button"
            onClick={() => choose(other)}
            className={`shrink-0 rounded-full bg-[color:var(--btn)] px-3 py-1.5 text-xs font-semibold text-[color:var(--btn-ink)] ${focusRing}`}
          >
            {words.switchTo}
          </button>
          <button
            type="button"
            onClick={() => choose(lang)}
            aria-label={words.dismiss}
            title={words.dismiss}
            className={`shrink-0 rounded-full p-1.5 text-[color:var(--muted)] transition-colors hover:text-[color:var(--text)] ${focusRing}`}
          >
            <XIcon className="h-4 w-4" />
          </button>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};

export default LanguageHint;
