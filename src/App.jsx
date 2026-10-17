import { lazy, Suspense, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import GlobalStyles from "./styles/GlobalStyles";
import ClickSpark from "./components/reactbits/ClickSpark";
import LatticeLoader from "./components/reactbits/LatticeLoader";
import { ToastProvider } from "./components/Toast";
import { scrollToSection } from "./lib/scroll";
import { WarmTooltipGroup } from "./components/reactbits/WarmTooltip";
import Landing from "./pages/Landing";

// Las páginas secundarias se descargan sólo cuando se visitan
const DataLab = lazy(() => import("./pages/DataLab"));
const AgendaLab = lazy(() => import("./pages/AgendaLab"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Mientras llega el código de una página secundaria
const PageLoader = () => (
  <div className="font-body flex min-h-screen items-center justify-center bg-[color:var(--ink)] text-[color:var(--soft)]">
    <LatticeLoader
      label="Cargando"
      pattern="orbit"
      color="#D4B27A"
      showTimer={false}
    />
  </div>
);

const sectionFor = (hash) =>
  hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null;

// Al cambiar de página: arriba, o a la sección del enlace (ej. /#contacto).
// Los enlaces internos (#servicios) también pasan por scrollToSection para
// llegar justo a su sección aunque la página siga cargando partes
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    const target = sectionFor(window.location.hash);
    if (!target) {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      return undefined;
    }
    let stop = () => {};
    const id = requestAnimationFrame(() => {
      stop = scrollToSection(target);
    });
    return () => {
      cancelAnimationFrame(id);
      stop();
    };
  }, [pathname]);

  useEffect(() => {
    let stop = () => {};
    const onClick = (event) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
        return;
      const href = event.target.closest?.('a[href^="#"]')?.getAttribute("href");
      const target = href && sectionFor(href);
      if (!target) return;
      event.preventDefault();
      window.history.pushState(null, "", href);
      stop();
      stop = scrollToSection(target, {
        smooth: !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      });
    };
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("click", onClick);
      stop();
    };
  }, []);
  return null;
};

function App() {
  return (
    <Router>
      <GlobalStyles />
      <ScrollToTop />
      <ClickSpark />
      <ToastProvider>
        {/* Un solo grupo de tooltips: se miden una vez y pasan de uno a otro al instante */}
        <WarmTooltipGroup>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/demo/datarefine" element={<DataLab />} />
              <Route path="/demo/agenda" element={<AgendaLab />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </WarmTooltipGroup>
      </ToastProvider>
    </Router>
  );
}

export default App;
