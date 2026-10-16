/* React Bits · GradientText
   Degradado animado recortado al texto. Por defecto, la gama de latón
   de la paleta (estilos en GlobalStyles). */

const BRASS = ["#D4B27A", "#F3E3C3", "#B8925A", "#F3E3C3", "#D4B27A"];

const GradientText = ({
  children,
  colors = BRASS,
  speed = 8,
  className = "",
}) => (
  <span
    className={`gradient-text ${className}`}
    style={{
      backgroundImage: `linear-gradient(to right, ${colors.join(", ")})`,
      animationDuration: `${speed}s`,
    }}
  >
    {children}
  </span>
);

export default GradientText;
