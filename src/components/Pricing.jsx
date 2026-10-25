import { Link } from "react-router-dom";
import { useContent, useLocalize } from "../lib/i18n";
import { btn, card } from "../lib/ui";
import { WhatsAppButton } from "./ContactButtons";
import { ArrowRightIcon, CheckIcon } from "./icons";
import AnimatedContent from "./reactbits/AnimatedContent";
import SpotlightCard from "./reactbits/SpotlightCard";

/* Precios de entrada por paquete (PRICING en content): en español, pesos y
   paquetes para pymes; en inglés, dólares, el agente de IA y FastAPI. */

// "/#contacto" es una sección de esta misma página: enlace normal con #
const PackageLink = ({ to, children }) => {
  const localize = useLocalize();
  const className = btn("primary", "sm");
  return to.startsWith("/#") ? (
    <a href={to.slice(1)} className={className}>
      {children}
    </a>
  ) : (
    <Link to={localize(to)} className={className}>
      {children}
    </Link>
  );
};

const Pricing = () => {
  const { PRICING } = useContent();
  return (
    <>
      <ul className="mt-12 grid gap-4 md:grid-cols-3">
        {PRICING.packages.map((item, i) => (
          <AnimatedContent
            as="li"
            key={item.name}
            delay={i * 0.08}
            className="h-full"
          >
            <SpotlightCard className={`${card} flex h-full flex-col p-6`}>
              {/* Dos renglones reservados: los precios quedan alineados */}
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[color:var(--accent)] md:min-h-[2.1rem]">
                {item.audience}
              </p>
              <h3 className="mt-3 font-display text-xl font-semibold text-[color:var(--text)]">
                {item.name}
              </h3>
              <p className="mt-5 text-sm text-[color:var(--muted)]">
                {PRICING.from}
              </p>
              <p className="font-display text-4xl font-semibold tracking-tight text-[color:var(--text)]">
                {item.price}
              </p>
              <p className="mt-1 text-sm text-[color:var(--soft)]">
                {item.extra}
              </p>
              <ul className="mt-6 space-y-2.5 border-t border-[color:var(--line)] pt-5 text-sm text-[color:var(--soft)]">
                {item.includes.map((line) => (
                  <li key={line} className="flex gap-2.5">
                    <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--accent)]" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-auto flex flex-wrap gap-2 pt-7">
                <PackageLink to={item.to}>
                  {item.cta} <ArrowRightIcon className="h-4 w-4" />
                </PackageLink>
                <WhatsAppButton topic={item.topic} size="sm" />
              </div>
            </SpotlightCard>
          </AnimatedContent>
        ))}
      </ul>
      <p className="mt-6 text-sm text-[color:var(--muted)]">{PRICING.note}</p>
    </>
  );
};

export default Pricing;
