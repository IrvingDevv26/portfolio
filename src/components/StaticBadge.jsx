import { useState } from "react";

/* Versión ligera de la credencial (sin WebGL) para equipos sin aceleración
   gráfica: correa, broche y tarjeta con un balanceo suave hecho con CSS.
   Se voltea al pasar el cursor o al tocarla, para ver el reverso. */

const StaticBadge = () => {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="pointer-events-none absolute inset-y-0 right-[9%] z-0 hidden w-[min(30vw,320px)] md:block">
      <div className="badge-swing absolute left-1/2 top-0 flex -translate-x-1/2 flex-col items-center">
        <div
          aria-hidden="true"
          className="h-[20vh] w-7 bg-gradient-to-r from-[#040009] via-[#15121c] to-[#040009] shadow-[0_0_0_1px_rgba(255,255,255,0.04)]"
        />
        <div
          aria-hidden="true"
          className="relative -mt-1 h-7 w-12 rounded-md bg-gradient-to-b from-[#e5e7eb] via-[#9ca3af] to-[#6b7280] shadow-[0_6px_14px_-6px_rgba(0,0,0,0.8)]"
        >
          <span className="absolute left-1/2 top-full h-4 w-4 -translate-x-1/2 rounded-full border-[3px] border-[#9ca3af]" />
        </div>

        <button
          type="button"
          aria-label={flipped ? "Ver el frente de la credencial" : "Ver el reverso de la credencial"}
          aria-pressed={flipped}
          onClick={() => setFlipped((f) => !f)}
          className="badge-card group pointer-events-auto mt-4 aspect-[1.6/2.25] w-[clamp(180px,21vw,290px)] cursor-pointer rounded-[18px] [perspective:1200px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[color:var(--accent)]"
        >
          <span
            className={`relative block h-full w-full rounded-[18px] transition-transform duration-700 [transform-style:preserve-3d] motion-reduce:transition-none group-hover:[transform:rotateY(180deg)] ${
              flipped ? "[transform:rotateY(180deg)]" : ""
            }`}
          >
            <img
              src="/irving-card.jpg"
              alt=""
              decoding="async"
              className="absolute inset-0 h-full w-full rounded-[18px] border border-white/60 object-cover shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9),0_0_60px_-10px_rgba(212,178,122,0.25)] [backface-visibility:hidden]"
            />
            <img
              src="/card-back.svg"
              alt=""
              decoding="async"
              className="absolute inset-0 h-full w-full rounded-[18px] border border-white/10 object-cover [backface-visibility:hidden] [transform:rotateY(180deg)]"
            />
          </span>
        </button>
      </div>
    </div>
  );
};

export default StaticBadge;
