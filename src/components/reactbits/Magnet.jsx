import { useEffect, useRef } from "react";

/* React Bits · Magnet
   El contenido se deja "atraer" por el cursor cuando éste se acerca.
   Se desactiva en pantallas táctiles y con movimiento reducido. */

const Magnet = ({
  children,
  padding = 50,
  strength = 5,
  className = "",
}) => {
  const ref = useRef(null);
  const innerRef = useRef(null);

  useEffect(() => {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!finePointer.matches || reduce.matches) return undefined;

    let active = false;
    const onMove = (e) => {
      const el = ref.current;
      const inner = innerRef.current;
      if (!el || !inner) return;
      const { left, top, width, height } = el.getBoundingClientRect();
      const cx = left + width / 2;
      const cy = top + height / 2;
      const near =
        Math.abs(cx - e.clientX) < width / 2 + padding &&
        Math.abs(cy - e.clientY) < height / 2 + padding;

      if (near) {
        active = true;
        inner.style.transition = "transform 0.3s ease-out";
        inner.style.transform = `translate3d(${(e.clientX - cx) / strength}px, ${
          (e.clientY - cy) / strength
        }px, 0)`;
      } else if (active) {
        active = false;
        inner.style.transition = "transform 0.5s ease-in-out";
        inner.style.transform = "translate3d(0, 0, 0)";
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [padding, strength]);

  return (
    <div ref={ref} className={`relative inline-block ${className}`}>
      <div ref={innerRef} className="will-change-transform">
        {children}
      </div>
    </div>
  );
};

export default Magnet;
