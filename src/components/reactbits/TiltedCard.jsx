import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { useRef } from "react";

/* React Bits · TiltedCard
   Imagen que se inclina en 3D siguiendo al cursor, con una etiqueta
   flotante que lo acompaña y contenido superpuesto en relieve. */

const SPRING = { damping: 30, stiffness: 100, mass: 2 };

const TiltedCard = ({
  imageSrc,
  altText,
  captionText,
  overlayContent = null,
  rotateAmplitude = 10,
  scaleOnHover = 1.04,
  className = "",
}) => {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(0, SPRING);
  const rotateY = useSpring(0, SPRING);
  const scale = useSpring(1, SPRING);
  const opacity = useSpring(0);
  const rotateCaption = useSpring(0, { stiffness: 350, damping: 30, mass: 1 });
  const lastY = useRef(0);

  const onMove = (e) => {
    if (reduce || e.pointerType !== "mouse" || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;
    rotateX.set((offsetY / (rect.height / 2)) * -rotateAmplitude);
    rotateY.set((offsetX / (rect.width / 2)) * rotateAmplitude);
    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);
    rotateCaption.set(-(offsetY - lastY.current) * 0.6);
    lastY.current = offsetY;
  };

  const onEnter = (e) => {
    if (reduce || e.pointerType !== "mouse") return;
    scale.set(scaleOnHover);
    opacity.set(1);
  };

  const onLeave = () => {
    opacity.set(0);
    scale.set(1);
    rotateX.set(0);
    rotateY.set(0);
    rotateCaption.set(0);
  };

  return (
    <figure
      ref={ref}
      onPointerMove={onMove}
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
      className={`relative [perspective:900px] ${className}`}
    >
      <motion.div
        className="relative [transform-style:preserve-3d]"
        style={{ rotateX, rotateY, scale }}
      >
        <img
          src={imageSrc}
          alt={altText}
          loading="lazy"
          decoding="async"
          className="aspect-[4/5] w-full rounded-2xl border border-[color:var(--line)] object-cover shadow-[0_40px_80px_-30px_rgba(0,0,0,0.8)] [transform:translateZ(0)]"
        />
        {overlayContent && (
          <div className="absolute inset-x-4 bottom-4 [transform:translateZ(40px)]">
            {overlayContent}
          </div>
        )}
      </motion.div>

      {captionText && (
        <motion.figcaption
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 z-10 hidden rounded-md bg-[color:var(--btn)] px-2.5 py-1 text-xs font-medium text-[color:var(--btn-ink)] sm:block"
          style={{ x, y, opacity, rotate: rotateCaption }}
        >
          {captionText}
        </motion.figcaption>
      )}
    </figure>
  );
};

export default TiltedCard;
