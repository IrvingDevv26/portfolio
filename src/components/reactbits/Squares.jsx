import { useEffect, useRef } from "react";

/* React Bits · Squares
   Cuadrícula que se desplaza lentamente; la celda bajo el cursor se
   ilumina. Sólo anima mientras está en pantalla. */

const Squares = ({
  direction = "diagonal", // right | left | up | down | diagonal
  speed = 0.35,
  squareSize = 44,
  borderColor = "rgba(255,255,255,0.06)",
  hoverFillColor = "rgba(212,178,122,0.10)",
  fadeColor = "#08090C",
  className = "",
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const host = canvas?.parentElement;
    if (!canvas || !ctx || !host) return undefined;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const offset = { x: 0, y: 0 };
    let hovered = null;
    let width = 0;
    let height = 0;
    let frame = 0;
    let visible = false;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const startX = Math.floor(offset.x / squareSize) * squareSize;
      const startY = Math.floor(offset.y / squareSize) * squareSize;

      ctx.lineWidth = 1;
      for (let x = startX; x < width + squareSize; x += squareSize) {
        for (let y = startY; y < height + squareSize; y += squareSize) {
          const sx = x - (offset.x % squareSize);
          const sy = y - (offset.y % squareSize);
          const col = Math.floor((x - startX) / squareSize);
          const row = Math.floor((y - startY) / squareSize);
          if (hovered && hovered.col === col && hovered.row === row) {
            ctx.fillStyle = hoverFillColor;
            ctx.fillRect(sx, sy, squareSize, squareSize);
          }
          ctx.strokeStyle = borderColor;
          ctx.strokeRect(sx + 0.5, sy + 0.5, squareSize, squareSize);
        }
      }

      // Viñeta: los bordes se funden con el fondo de la página
      const gradient = ctx.createRadialGradient(
        width / 2,
        height / 2,
        0,
        width / 2,
        height / 2,
        Math.sqrt(width ** 2 + height ** 2) / 2,
      );
      gradient.addColorStop(0, "rgba(8,9,12,0)");
      gradient.addColorStop(1, fadeColor);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    };

    const step = () => {
      const s = Math.max(speed, 0.1);
      if (direction === "right") offset.x = (offset.x - s + squareSize) % squareSize;
      if (direction === "left") offset.x = (offset.x + s + squareSize) % squareSize;
      if (direction === "up") offset.y = (offset.y + s + squareSize) % squareSize;
      if (direction === "down") offset.y = (offset.y - s + squareSize) % squareSize;
      if (direction === "diagonal") {
        offset.x = (offset.x - s + squareSize) % squareSize;
        offset.y = (offset.y - s + squareSize) % squareSize;
      }
      draw();
      frame = visible ? requestAnimationFrame(step) : 0;
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    };

    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      // offset siempre está en [0, squareSize), así que la celda es directa
      hovered = {
        col: Math.floor((e.clientX - rect.left + offset.x) / squareSize),
        row: Math.floor((e.clientY - rect.top + offset.y) / squareSize),
      };
      if (reduce) draw();
    };
    const onLeave = () => {
      hovered = null;
      if (reduce) draw();
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !frame && !reduce) frame = requestAnimationFrame(step);
    });

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    io.observe(canvas);
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      io.disconnect();
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
    };
  }, [direction, speed, squareSize, borderColor, hoverFillColor, fadeColor]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
};

export default Squares;
