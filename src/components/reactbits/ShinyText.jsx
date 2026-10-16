/* React Bits · ShinyText
   Un destello de luz que recorre el texto (estilos en GlobalStyles). */

const ShinyText = ({ text, speed = 4, className = "" }) => (
  <span
    className={`shiny-text ${className}`}
    style={{ animationDuration: `${speed}s` }}
  >
    {text}
  </span>
);

export default ShinyText;
