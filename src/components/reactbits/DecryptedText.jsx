import { useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/* React Bits · DecryptedText
   Al entrar en pantalla, el texto aparece "descifrándose" de izquierda a
   derecha: las letras pendientes muestran caracteres aleatorios. */

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+=<>/";

const scramble = (text, revealed) =>
  Array.from(text)
    .map((char, i) =>
      i < revealed || char === " "
        ? char
        : GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
    )
    .join("");

const DecryptedText = ({
  text,
  speed = 45,
  className = "",
  encryptedClassName = "text-[color:var(--faint)]",
}) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.8 });
  const reduce = useReducedMotion();
  const [frame, setFrame] = useState({ shown: text, revealed: text.length });

  useEffect(() => {
    if (!inView || reduce) return undefined;
    let revealed = 0;
    // Dos cuadros por letra: primero se agita, luego se fija
    let tick = 0;
    const id = setInterval(() => {
      tick += 1;
      if (tick % 2 === 0) revealed += 1;
      setFrame({ shown: scramble(text, revealed), revealed });
      if (revealed >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [inView, reduce, text, speed]);

  return (
    <span ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {Array.from(frame.shown).map((char, i) => (
          <span
            key={i}
            className={i < frame.revealed ? undefined : encryptedClassName}
          >
            {char}
          </span>
        ))}
      </span>
    </span>
  );
};

export default DecryptedText;
