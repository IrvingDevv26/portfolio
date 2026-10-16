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
import { WarmTooltipGroup } from "./components/reactbits/WarmTooltip";
import Landing from "./pages/Landing";

// Las páginas secundarias se descargan sólo cuando se visitan
const DataLab = lazy(() => import("./pages/DataLab"));
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

// Al cambiar de página: arriba, o a la sección del enlace (ej. /#contacto)
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    const { hash } = window.location;
    const target =
      hash && document.getElementById(decodeURIComponent(hash.slice(1)));
    if (!target) {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      return undefined;
    }
    const id = requestAnimationFrame(() =>
      target.scrollIntoView({ behavior: "instant" }),
    );
    return () => cancelAnimationFrame(id);
  }, [pathname]);
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
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </WarmTooltipGroup>
      </ToastProvider>
    </Router>
  );
}

export default App;
