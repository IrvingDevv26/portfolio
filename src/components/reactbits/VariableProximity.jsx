import { useEffect, useMemo, useRef } from "react";

/* React Bits · VariableProximity
   Cada letra cambia su peso (eje variable de la fuente) según qué tan
   cerca está el cursor. Requiere una fuente variable (Bricolage Grotesque). */

const parse = (settings) =>
  new Map(
    settings.split(",").map((part) => {
      const [axis, value] = part.trim().split(/\s+/);
      return [axis.replace(/['"]/g, ""), parseFloat(value)];
    }),
  );

const VariableProximity = ({
  label,
  from = "'wght' 300",
  to = "'wght' 800",
  radius = 180,
  className = "",
}) => {
  const rootRef = useRef(null);
  const letters = useRef([]);

  const axes = useMemo(() => {
    const a = parse(from);
    const b = parse(to);
    return [...a.keys()].map((axis) => ({
      axis,
      from: a.get(axis),
      to: b.get(axis) ?? a.get(axis),
    }));
  }, [from, to]);

  useEffect(() => {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!finePointer.matches || reduce.matches) return undefined;

    let frame = 0;
    let pointer = null;

    const update = () => {
      frame = 0;
      letters.current.forEach((el) => {
        if (!el) return;
        if (!pointer) {
          el.style.fontVariationSettings = from;
          return;
        }
        const r = el.getBoundingClientRect();
        const d = Math.hypot(
          pointer.x - (r.left + r.width / 2),
          pointer.y - (r.top + r.height / 2),
        );
        const t = Math.max(0, 1 - d / radius); // caída lineal
        el.style.fontVariationSettings = axes
          .map(({ axis, from: f, to: v }) => `'${axis}' ${f + (v - f) * t}`)
          .join(", ");
      });
    };

    const onMove = (e) => {
      pointer = { x: e.clientX, y: e.clientY };
      if (!frame) frame = requestAnimationFrame(update);
    };
    const onLeave = () => {
      pointer = null;
      if (!frame) frame = requestAnimationFrame(update);
    };

    const root = rootRef.current;
    root?.addEventListener("pointermove", onMove);
    root?.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      root?.removeEventListener("pointermove", onMove);
      root?.removeEventListener("pointerleave", onLeave);
    };
  }, [axes, from, radius]);

  const words = label.split(" ").map((word, w, all) => ({
    word,
    start: all.slice(0, w).join("").length,
  }));

  return (
    <span ref={rootRef} className={className}>
      <span className="sr-only">{label}</span>
      <span aria-hidden="true">
        {words.map(({ word, start }, w) => (
          <span key={w} className="inline-block whitespace-nowrap">
            {Array.from(word).map((char, c) => (
              <span
                key={c}
                ref={(el) => {
                  letters.current[start + c] = el;
                }}
                className="inline-block transition-[font-variation-settings] duration-150 ease-out"
                style={{ fontVariationSettings: from }}
              >
                {char}
              </span>
            ))}
            {w < words.length - 1 && <span className="inline-block">&nbsp;</span>}
          </span>
        ))}
      </span>
    </span>
  );
};

export default VariableProximity;
