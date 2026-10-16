import { useEffect, useRef } from "react";

/* React Bits · FuzzyText
   Texto dibujado en canvas cuyas filas de píxeles vibran de lado a lado;
   la vibración aumenta al pasar el cursor por encima. */

const FUZZ_RANGE = 30;
const MARGIN = 40;

const FuzzyText = ({
  text,
  fontSize = "clamp(6rem, 22vw, 14rem)",
  fontWeight = 800,
  fontFamily = '"Bricolage Grotesque Variable", system-ui, sans-serif',
  color = "#D4B27A",
  baseIntensity = 0.16,
  hoverIntensity = 0.5,
  className = "",
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return undefined;

    let frame = 0;
    let cancelled = false;
    let hovering = false;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      hovering =
        e.clientX >= rect.left + MARGIN &&
        e.clientX <= rect.right - MARGIN &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;
    };
    const onLeave = () => {
      hovering = false;
    };

    const init = async () => {
      // Medimos con la fuente real: hay que esperar a que cargue
      await document.fonts?.load(`${fontWeight} 100px ${fontFamily}`).catch(() => {});
      if (cancelled) return;

      const probe = document.createElement("span");
      probe.style.fontSize = fontSize;
      document.body.appendChild(probe);
      const px = parseFloat(getComputedStyle(probe).fontSize);
      probe.remove();

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const font = `${fontWeight} ${px * dpr}px ${fontFamily}`;

      const off = document.createElement("canvas");
      const offCtx = off.getContext("2d");
      offCtx.font = font;
      const m = offCtx.measureText(text);
      const left = m.actualBoundingBoxLeft ?? 0;
      const ascent = m.actualBoundingBoxAscent ?? px * dpr;
      const descent = m.actualBoundingBoxDescent ?? px * dpr * 0.2;
      const textW = Math.ceil(left + (m.actualBoundingBoxRight ?? m.width)) + 10;
      const textH = Math.ceil(ascent + descent);

      off.width = textW;
      off.height = textH;
      offCtx.font = font;
      offCtx.fillStyle = color;
      offCtx.fillText(text, 5 - left, ascent);

      const margin = MARGIN * dpr;
      canvas.width = textW + margin * 2;
      canvas.height = textH;
      // Sólo el ancho: con height:auto el canvas conserva su proporción
      // aunque max-w-full lo encoja en pantallas pequeñas
      canvas.style.width = `${canvas.width / dpr}px`;

      const render = () => {
        if (cancelled) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const intensity = hovering ? hoverIntensity : baseIntensity;
        for (let row = 0; row < textH; row++) {
          const dx = reduce
            ? 0
            : Math.floor(intensity * (Math.random() - 0.5) * FUZZ_RANGE * dpr);
          ctx.drawImage(off, 0, row, textW, 1, margin + dx, row, textW, 1);
        }
        if (!reduce) frame = requestAnimationFrame(render);
      };
      render();
    };

    init();
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [text, fontSize, fontWeight, fontFamily, color, baseIntensity, hoverIntensity]);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label={text}
      className={`mx-auto block h-auto max-w-full ${className}`}
    />
  );
};

export default FuzzyText;
