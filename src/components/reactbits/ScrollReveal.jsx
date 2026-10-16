import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRef } from "react";

/* React Bits · ScrollReveal (versión con framer-motion, sin GSAP)
   Las palabras se encienden una a una conforme el párrafo recorre la
   pantalla: pasan de un gris legible (contraste ≥ 3:1) a su color final. */

const DIM = "#6B707B";

const Word = ({ progress, range, color, children }) => {
  const tone = useTransform(progress, range, [DIM, color]);
  return <motion.span style={{ color: tone }}>{children}</motion.span>;
};

const ScrollReveal = ({
  text,
  highlight = [],
  color = "#F1F3F6",
  highlightColor = "#D4B27A",
  className = "",
}) => {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.5"],
  });
  const words = text.split(" ");

  return (
    <p ref={ref} className={className}>
      {words.map((word, i) => {
        const clean = word.replace(/[.,;:!?]/g, "");
        const tone = highlight.includes(clean) ? highlightColor : color;
        const start = i / words.length;
        const end = Math.min(1, start + 2 / words.length);
        return (
          <span key={`${word}-${i}`}>
            {reduce ? (
              <span style={{ color: tone }}>{word}</span>
            ) : (
              <Word progress={scrollYProgress} range={[start, end]} color={tone}>
                {word}
              </Word>
            )}
            {i < words.length - 1 && " "}
          </span>
        );
      })}
    </p>
  );
};

export default ScrollReveal;
