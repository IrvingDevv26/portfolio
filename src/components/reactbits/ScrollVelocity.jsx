import {
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import { useLayoutEffect, useRef, useState } from "react";

/* React Bits · ScrollVelocity
   Franjas de texto en bucle infinito que aceleran (y cambian de sentido)
   con la velocidad del scroll. */

const wrap = (min, max, v) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

const useElementWidth = (ref) => {
  const [width, setWidth] = useState(0);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const observer = new ResizeObserver(([entry]) =>
      setWidth(entry.target.offsetWidth),
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);
  return width;
};

const VelocityRow = ({ children, baseVelocity, className, copies = 4 }) => {
  const rowRef = useRef(null);
  const copyRef = useRef(null);
  const reduce = useReducedMotion();
  const inView = useInView(rowRef);
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), {
    damping: 50,
    stiffness: 400,
  });
  const factor = useTransform(velocity, [0, 1000], [0, 5], { clamp: false });
  const copyWidth = useElementWidth(copyRef);
  const direction = useRef(1);

  const x = useTransform(baseX, (v) =>
    copyWidth === 0 ? "0px" : `${wrap(-copyWidth, 0, v)}px`,
  );

  useAnimationFrame((_, delta) => {
    if (reduce || !inView) return;
    let moveBy = direction.current * baseVelocity * (delta / 1000);
    const f = factor.get();
    if (f < 0) direction.current = -1;
    else if (f > 0) direction.current = 1;
    moveBy += direction.current * moveBy * f;
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div ref={rowRef} className="relative overflow-hidden">
      <motion.div className="flex whitespace-nowrap" style={{ x }}>
        {Array.from({ length: copies }, (_, i) => (
          <span
            key={i}
            ref={i === 0 ? copyRef : undefined}
            className={`shrink-0 ${className}`}
          >
            {/* &nbsp; final: un espacio normal se perdería al unir copias */}
            {children}&nbsp;
          </span>
        ))}
      </motion.div>
    </div>
  );
};

const ScrollVelocity = ({ rows, velocity = 60 }) => (
  <div aria-hidden="true" className="space-y-2 py-2">
    {rows.map(({ text, className }, i) => (
      <VelocityRow
        key={i}
        baseVelocity={i % 2 === 0 ? velocity : -velocity}
        className={className}
      >
        {text}
      </VelocityRow>
    ))}
  </div>
);

export default ScrollVelocity;
