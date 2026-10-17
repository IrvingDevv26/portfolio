import { Link, useLocation } from "react-router-dom";
import {
  LANGUAGES,
  localize,
  rememberLanguage,
  useContent,
  useLang,
} from "../lib/i18n";
import { focusRing } from "../lib/ui";

/* Selector ES / EN: lleva a la misma página en el otro idioma (y conserva la
   sección, si la URL tiene una) y recuerda la elección. */

const LanguageSwitch = ({ className = "" }) => {
  const lang = useLang();
  const { UI } = useContent();
  const { pathname, hash } = useLocation();

  return (
    <div
      role="group"
      aria-label={UI.lang.label}
      className={`inline-flex rounded-full border border-[color:var(--line-strong)] bg-[rgba(16,18,23,0.7)] p-0.5 text-xs font-semibold backdrop-blur ${className}`}
    >
      {LANGUAGES.map((code) => (
        <Link
          key={code}
          to={`${localize(pathname, code)}${hash}`}
          hrefLang={code}
          lang={code}
          aria-current={code === lang ? "true" : undefined}
          onClick={() => rememberLanguage(code)}
          className={`rounded-full px-2.5 py-1 uppercase transition-colors ${focusRing} ${
            code === lang
              ? "bg-[color:var(--btn)] text-[color:var(--btn-ink)]"
              : "text-[color:var(--soft)] hover:text-[color:var(--text)]"
          }`}
        >
          {code}
        </Link>
      ))}
    </div>
  );
};

export default LanguageSwitch;
