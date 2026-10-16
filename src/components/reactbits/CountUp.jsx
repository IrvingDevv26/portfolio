import {
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { useEffect, useRef } from "react";

/* React Bits · CountUp
   Cuenta con un resorte desde `from` hasta `to` al entrar en pantalla. */

const CountUp = ({ to, from = 0, duration = 2, delay = 0, className = "" }) => {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const value = useMotionValue(from);
  const spring = useSpring(value, {
    damping: 20 + 40 * (1 / duration),
    stiffness: 100 * (1 / duration),
  });
  const inView = useInView(ref, { once: true, amount: 0.6 });

  useEffect(() => {
    if (!inView) return undefined;
    if (reduce) {
      if (ref.current) ref.current.textContent = String(to);
      return undefined;
    }
    const id = setTimeout(() => value.set(to), delay * 1000);
    return () => clearTimeout(id);
  }, [inView, reduce, to, delay, value]);

  useEffect(
    () =>
      spring.on("change", (latest) => {
        if (ref.current) ref.current.textContent = String(Math.round(latest));
      }),
    [spring],
  );

  return (
    <>
      <span className="sr-only">{to}</span>
      <span ref={ref} aria-hidden="true" className={className}>
        {from}
      </span>
    </>
  );
};

export default CountUp;
