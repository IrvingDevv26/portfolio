import { useRef } from "react";

/* React Bits · SpotlightCard
   Un foco de luz y un filo de borde que siguen al cursor dentro de la
   tarjeta (estilos en GlobalStyles). */

const SpotlightCard = ({
  as: Tag = "div",
  children,
  className = "",
  spotlightColor = "rgba(212,178,122,0.10)",
  borderColor = "rgba(212,178,122,0.55)",
}) => {
  const ref = useRef(null);

  const handleMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
  };

  return (
    <Tag
      ref={ref}
      onPointerMove={handleMove}
      className={`card-spotlight ${className}`}
      style={{
        "--spotlight-color": spotlightColor,
        "--spotlight-border": borderColor,
      }}
    >
      {children}
    </Tag>
  );
};

export default SpotlightCard;
