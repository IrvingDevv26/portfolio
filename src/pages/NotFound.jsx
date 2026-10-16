import { Link } from "react-router-dom";
import { ArrowLeftIcon } from "../components/icons";
import FuzzyText from "../components/reactbits/FuzzyText";
import { useDocumentTitle } from "../lib/hooks";
import { btn } from "../lib/ui";

const NotFound = () => {
  useDocumentTitle("Página no encontrada — Irving Dávila");

  return (
    <div className="grain font-body relative isolate flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[color:var(--ink)] px-6 text-center text-[color:var(--text)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "radial-gradient(45% 45% at 50% 40%, rgba(212,178,122,0.12) 0%, rgba(212,178,122,0) 70%)",
        }}
      />

      <FuzzyText text="404" />

      <p className="mt-6 font-mono text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
        Error · Ruta no encontrada
      </p>
      <h1 className="mt-4 font-display text-3xl font-semibold md:text-4xl">
        Esta página no existe
      </h1>
      <p className="mt-3 max-w-sm leading-relaxed text-[color:var(--soft)]">
        Puede que la dirección esté mal escrita o que la página se haya
        movido. Volvamos a terreno conocido.
      </p>
      <div className="mt-9 flex flex-wrap justify-center gap-3">
        <Link to="/" className={btn("primary")}>
          <ArrowLeftIcon className="h-4 w-4" /> Ir al inicio
        </Link>
        <Link to="/demo/datarefine" className={btn("secondary")}>
          Probar DataRefine
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
