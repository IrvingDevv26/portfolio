import { Link } from "react-router-dom";
import { useContent, useLocalize } from "../lib/i18n";
import { focusRing } from "../lib/ui";

/* Pie corto de las páginas fuera de la portada (pymes y aviso de privacidad) */

const link = `rounded text-[color:var(--soft)] transition-colors hover:text-[color:var(--text)] ${focusRing}`;

const PageFooter = () => {
  const { PROFILE, UI } = useContent();
  const to = useLocalize();
  return (
    <footer className="border-t border-[color:var(--line)]">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-6 py-8 text-sm text-[color:var(--muted)] md:flex-row md:items-center md:px-10">
        <p>
          © {new Date().getFullYear()} {PROFILE.name}.{" "}
          {UI.landing.footer.rights}
        </p>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <Link to={to("/privacidad")} className={link}>
            {UI.landing.footer.privacy}
          </Link>
          <Link to={to("/")} className={link}>
            {UI.common.backToPortfolio}
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default PageFooter;
