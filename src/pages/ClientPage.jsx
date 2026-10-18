import { useEffect } from "react";
import { Link } from "react-router-dom";
import AgentDemo from "../components/AgentDemo";
import ContactButtons, { WhatsAppButton } from "../components/ContactButtons";
import Faq from "../components/Faq";
import InvoiceDemo from "../components/InvoiceDemo";
import { ArrowRightIcon, CheckIcon, ShieldIcon } from "../components/icons";
import { LabHeader } from "../components/LabParts";
import PageFooter from "../components/PageFooter";
import AnimatedContent from "../components/reactbits/AnimatedContent";
import BlurText from "../components/reactbits/BlurText";
import Squares from "../components/reactbits/Squares";
import VideoButton from "../components/VideoButton";
import { Eyebrow, h2, Section } from "../components/shared";
import { CLIENT_PAGES } from "../content/clientes";
import { hasWhatsApp } from "../lib/contact";
import { useDocumentTitle } from "../lib/hooks";
import { useContent } from "../lib/i18n";
import { btn, card, focusRing } from "../lib/ui";
import { wakeDemos } from "../lib/wake";

/* Página por tipo de cliente (/contadores, /consultorios): el problema, la
   demo, lo que incluye, el precio de entrada, la privacidad y el contacto
   directo. Los textos están en src/content/clientes.js (solo español). */

const WIDGETS = { invoice: InvoiceDemo, agent: AgentDemo };

const ClientPage = ({ kind }) => {
  const page = CLIENT_PAGES[kind];
  const { UI } = useContent();
  useDocumentTitle(page.title);
  const Widget = WIDGETS[page.widget];

  // La demo de esta página queda despierta para cuando el visitante la abra
  useEffect(() => wakeDemos(), []);

  // Sin WhatsApp configurado, la demo es el botón principal
  const demoLink = (
    <Link
      to={page.demo.to}
      className={btn(hasWhatsApp ? "secondary" : "primary")}
    >
      {page.demo.label} <ArrowRightIcon className="h-4 w-4" />
    </Link>
  );

  return (
    <div className="grain font-body min-h-screen bg-[color:var(--ink)] text-[color:var(--text)]">
      <LabHeader topic={page.topic} badge={false} />

      <main>
        {/* Presentación */}
        <div className="relative isolate overflow-hidden">
          <Squares className="-z-10" squareSize={48} speed={0.25} />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              backgroundImage:
                "radial-gradient(45% 60% at 85% 0%, rgba(212,178,122,0.14) 0%, rgba(212,178,122,0) 70%), linear-gradient(to bottom, rgba(8,9,12,0) 55%, #08090C 100%)",
            }}
          />
          <div className="mx-auto max-w-6xl px-6 pb-14 pt-14 md:px-10 md:pb-20 md:pt-20">
            <Eyebrow>{page.eyebrow}</Eyebrow>
            <BlurText
              as="h1"
              text={page.heading}
              highlight={page.highlight}
              highlightClassName="gradient-text text-brass"
              className="balance mt-5 max-w-4xl font-display text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl"
            />
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[color:var(--soft)]">
              {page.lead}
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <WhatsAppButton topic={page.topic} />
              {demoLink}
            </div>
            <ul
              className="mt-8 flex flex-wrap gap-2"
              aria-label={UI.common.details}
            >
              {page.facts.map((fact) => (
                <li
                  key={fact}
                  className="inline-flex items-center gap-2 rounded-full border border-[color:var(--line)] bg-[color:var(--ink)]/70 px-3 py-1 text-xs text-[color:var(--soft)] backdrop-blur"
                >
                  <CheckIcon className="h-3.5 w-3.5 text-[color:var(--accent)]" />
                  {fact}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* El problema */}
        <Section size="md" className="border-t border-[color:var(--line)]">
          <h2 className={h2}>{page.problemTitle}</h2>
          <ol className="mt-10 grid gap-4 md:grid-cols-3">
            {page.problems.map((problem, i) => (
              <AnimatedContent
                as="li"
                key={problem.title}
                delay={i * 0.08}
                className="h-full"
              >
                <div className={`${card} h-full p-6`}>
                  <span className="font-mono text-sm text-[color:var(--accent)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-3 font-display text-xl font-semibold text-[color:var(--text)]">
                    {problem.title}
                  </h3>
                  <p className="mt-2 leading-relaxed text-[color:var(--soft)]">
                    {problem.text}
                  </p>
                </div>
              </AnimatedContent>
            ))}
          </ol>
        </Section>

        {/* La demo: en celular, la animación antes que el texto */}
        <Section size="md" className="border-t border-[color:var(--line)]">
          <div className="grid grid-cols-[minmax(0,1fr)] items-center gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
            <div>
              <h2 className={h2}>{page.demoTitle}</h2>
              <p className="mt-5 text-lg leading-relaxed text-[color:var(--soft)]">
                {page.demoText}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link to={page.demo.to} className={btn("primary")}>
                  {page.demo.label} <ArrowRightIcon className="h-4 w-4" />
                </Link>
                <VideoButton url={page.video} label={page.videoLabel} />
              </div>
            </div>
            <div className="max-lg:order-first">
              <AnimatedContent blur distance={24}>
                <Widget />
              </AnimatedContent>
            </div>
          </div>
        </Section>

        {/* Lo que incluye y el precio de entrada */}
        <Section size="md" className="border-t border-[color:var(--line)]">
          <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
            <div>
              <h2 className={h2}>{page.offerTitle}</h2>
              <ul className="mt-8 space-y-4 text-lg text-[color:var(--soft)]">
                {page.offer.map((item) => (
                  <li key={item} className="flex gap-3">
                    <CheckIcon className="mt-1 h-5 w-5 shrink-0 text-[color:var(--accent)]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className={`${card} p-7 md:p-8`}>
              <p className="font-mono text-xs uppercase tracking-[0.16em] text-[color:var(--accent)]">
                {page.price.label}
              </p>
              <p className="mt-4 font-display text-4xl font-semibold tracking-tight text-[color:var(--text)]">
                {page.price.from}
              </p>
              <p className="mt-1 text-[color:var(--soft)]">
                {page.price.extra}
              </p>
              <p className="mt-5 border-t border-[color:var(--line)] pt-5 text-sm leading-relaxed text-[color:var(--muted)]">
                {page.price.note}
              </p>
              <ContactButtons topic={page.topic} size="sm" className="mt-6" />
            </div>
          </div>
        </Section>

        {/* Privacidad */}
        <Section size="md" className="border-t border-[color:var(--line)]">
          <h2 className={h2}>{page.privacyTitle}</h2>
          <ul className="mt-10 grid gap-4 md:grid-cols-3">
            {page.privacy.map((item) => (
              <li key={item} className={`${card} flex gap-3 p-6`}>
                <ShieldIcon className="mt-0.5 h-5 w-5 shrink-0 text-[color:var(--clean)]" />
                <span className="leading-relaxed text-[color:var(--soft)]">
                  {item}
                </span>
              </li>
            ))}
          </ul>
          <Link
            to="/privacidad"
            className={`mt-6 inline-flex rounded text-sm text-[color:var(--muted)] underline underline-offset-4 transition-colors hover:text-[color:var(--text)] ${focusRing}`}
          >
            {UI.landing.footer.privacy}
          </Link>
        </Section>

        {/* Preguntas */}
        <Section size="md" className="border-t border-[color:var(--line)]">
          <h2 className={`${h2} mb-10`}>{page.faqTitle}</h2>
          <Faq items={page.faq} />
        </Section>

        {/* Contacto */}
        <div className="border-t border-[color:var(--line)] bg-[color:var(--raised)]">
          <Section size="md" className="text-center">
            <h2 className={`${h2} mx-auto max-w-3xl`}>{page.ctaTitle}</h2>
            <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-[color:var(--soft)]">
              {page.ctaText}
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <ContactButtons topic={page.topic} />
              {!hasWhatsApp && demoLink}
            </div>
          </Section>
        </div>
      </main>

      <PageFooter />
    </div>
  );
};

export default ClientPage;
