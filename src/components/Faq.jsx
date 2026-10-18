import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useId, useState } from "react";
import { useContent } from "../lib/i18n";
import { focusRing } from "../lib/ui";

/* Preguntas frecuentes en acordeón. También publica los datos estructurados
   FAQPage para que los buscadores puedan mostrarlas como resultado enriquecido. */

const structured = (faq) =>
  JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  });

const Item = ({ q, a, open, onToggle }) => {
  const id = useId();
  const reduce = useReducedMotion();
  return (
    <li className="border-b border-[color:var(--line)]">
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={onToggle}
          className={`group flex w-full items-center justify-between gap-6 rounded-md py-5 text-left ${focusRing}`}
        >
          <span
            className={`font-display text-lg font-semibold transition-colors md:text-xl ${
              open
                ? "text-[color:var(--text)]"
                : "text-[color:var(--soft)] group-hover:text-[color:var(--text)]"
            }`}
          >
            {q}
          </span>
          <span
            aria-hidden="true"
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-[transform,border-color,color] duration-300 ${
              open
                ? "rotate-45 border-[color:var(--accent-line)] text-[color:var(--accent)]"
                : "border-[color:var(--line-strong)] text-[color:var(--muted)]"
            }`}
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
          </span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={id}
            role="region"
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduce ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="overflow-hidden"
          >
            <p className="max-w-2xl pb-6 leading-relaxed text-[color:var(--soft)]">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
};

// `items`: otra lista de preguntas (las páginas para pymes tienen la suya)
const Faq = ({ items }) => {
  const { FAQ } = useContent();
  const list = items ?? FAQ;
  const [open, setOpen] = useState(0);
  return (
    <>
      <ul className="border-t border-[color:var(--line)]">
        {list.map((item, i) => (
          <Item
            key={item.q}
            {...item}
            open={open === i}
            onToggle={() => setOpen((current) => (current === i ? -1 : i))}
          />
        ))}
      </ul>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: structured(list) }}
      />
    </>
  );
};

export default Faq;
