import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";

/* React Bits · BlurText
   Revela el texto palabra por palabra, saliendo de un desenfoque.
   `highlight` recibe palabras que se pintan con `highlightClassName`. */

const FROM = { filter: "blur(10px)", opacity: 0, y: -40 };
const TO = {
  filter: ["blur(10px)", "blur(4px)", "blur(0px)"],
  opacity: [0, 0.5, 1],
  y: [-40, 4, 0],
};

const BlurText = ({
  text,
  as: Tag = "p",
  className = "",
  highlight = [],
  highlightClassName = "",
  delay = 110,
  stepDuration = 0.35,
  startDelay = 0,
}) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const reduce = useReducedMotion();
  const words = text.split(" ");

  return (
    <Tag ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, i) => {
          const clean = word.replace(/[.,;:!?¿¡]/g, "");
          const isHighlight = highlight.includes(clean);
          return (
            <span key={`${word}-${i}`}>
              <motion.span
                className={`inline-block will-change-[transform,filter,opacity] ${
                  isHighlight ? highlightClassName : ""
                }`}
                initial={reduce ? false : FROM}
                animate={reduce || inView ? TO : FROM}
                transition={{
                  duration: stepDuration * 2,
                  times: [0, 0.5, 1],
                  delay: startDelay + (i * delay) / 1000,
                  ease: "easeOut",
                }}
              >
                {word}
              </motion.span>
              {i < words.length - 1 && " "}
            </span>
          );
        })}
      </span>
    </Tag>
  );
};

export default BlurText;
