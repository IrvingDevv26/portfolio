import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

/* React Bits · RotatingText
   Rota entre frases; cada letra entra desde abajo con un leve escalonado.
   El texto visible es decorativo: los lectores de pantalla reciben la
   lista completa una sola vez. */

const RotatingText = ({
  texts,
  interval = 2600,
  stagger = 0.022,
  className = "",
}) => {
  const [index, setIndex] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce || texts.length < 2) return undefined;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % texts.length),
      interval,
    );
    return () => clearInterval(id);
  }, [texts.length, interval, reduce]);

  // Índice de la primera letra de cada palabra, para escalonar la entrada
  const words = texts[index].split(" ").map((word, w, all) => ({
    word,
    start: all.slice(0, w).join("").length,
  }));

  return (
    <>
      <span className="sr-only">{texts.join(", ")}</span>
      <motion.span
        layout
        aria-hidden="true"
        transition={{ type: "spring", damping: 30, stiffness: 400 }}
        className={`relative inline-flex overflow-hidden whitespace-nowrap align-bottom ${className}`}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span key={index} layout className="inline-flex">
            {words.map(({ word, start }, w) => (
              <span key={w} className="inline-flex">
                {Array.from(word).map((char, c) => {
                  const i = start + c;
                  return (
                    <motion.span
                      key={i}
                      className="inline-block"
                      initial={{ y: "110%", opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: "-120%", opacity: 0 }}
                      transition={{
                        type: "spring",
                        damping: 30,
                        stiffness: 400,
                        delay: i * stagger,
                      }}
                    >
                      {char}
                    </motion.span>
                  );
                })}
                {w < words.length - 1 && <span className="inline-block">&nbsp;</span>}
              </span>
            ))}
          </motion.span>
        </AnimatePresence>
      </motion.span>
    </>
  );
};

export default RotatingText;
