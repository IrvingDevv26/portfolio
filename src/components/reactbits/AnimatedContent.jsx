import { motion, useReducedMotion } from "framer-motion";

/* React Bits · AnimatedContent
   Hace aparecer el contenido al entrar en pantalla (desplazamiento,
   opacidad y, opcionalmente, desenfoque). */

const TAGS = {
  div: motion.div,
  li: motion.li,
  article: motion.article,
  figure: motion.figure,
};

const AnimatedContent = ({
  as = "div",
  children,
  className = "",
  distance = 36,
  direction = "vertical",
  reverse = false,
  delay = 0,
  duration = 0.8,
  blur = false,
  threshold = 0.2,
}) => {
  const reduce = useReducedMotion();
  const Tag = TAGS[as] ?? TAGS.div;
  const axis = direction === "horizontal" ? "x" : "y";
  const offset = reverse ? -distance : distance;

  const hidden = { opacity: 0, [axis]: offset };
  const shown = { opacity: 1, [axis]: 0 };
  if (blur) {
    hidden.filter = "blur(8px)";
    shown.filter = "blur(0px)";
  }

  return (
    <Tag
      className={className}
      initial={reduce ? false : hidden}
      whileInView={shown}
      viewport={{ once: true, amount: threshold }}
      transition={{ duration, delay, ease: [0.2, 0.7, 0.2, 1] }}
    >
      {children}
    </Tag>
  );
};

export default AnimatedContent;
