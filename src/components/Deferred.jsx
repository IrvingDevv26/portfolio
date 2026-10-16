import { Suspense, useEffect, useRef, useState } from "react";

/* Monta su contenido sólo cuando está por entrar en pantalla. Con
   componentes React.lazy, además, su código se descarga en ese momento y no
   en la carga inicial. `minHeight` reserva el espacio mientras tanto. */

const Deferred = ({
  children,
  minHeight,
  rootMargin = "600px 0px",
  className = "",
}) => {
  const ref = useRef(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || show) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShow(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [show, rootMargin]);

  const reserve = <div aria-hidden="true" style={{ minHeight }} />;

  return (
    <div ref={ref} className={className}>
      {show ? <Suspense fallback={reserve}>{children}</Suspense> : reserve}
    </div>
  );
};

export default Deferred;
