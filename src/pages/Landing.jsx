import { motion, useInView, useReducedMotion } from "framer-motion";
import {
  lazy,
  startTransition,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Link } from "react-router-dom";
import AgentDemo from "../components/AgentDemo";
import CleaningDemo from "../components/CleaningDemo";
import Deferred from "../components/Deferred";
import Faq from "../components/Faq";
import Header from "../components/Header";
import VideoButton from "../components/VideoButton";
import StaticBadge from "../components/StaticBadge";
import AnimatedContent from "../components/reactbits/AnimatedContent";
import BlurText from "../components/reactbits/BlurText";
import CountUp from "../components/reactbits/CountUp";
import GradientText from "../components/reactbits/GradientText";
import Magnet from "../components/reactbits/Magnet";
import StarBorder from "../components/reactbits/StarBorder";
import RotatingText from "../components/reactbits/RotatingText";
import ScrollReveal from "../components/reactbits/ScrollReveal";
import ScrollVelocity from "../components/reactbits/ScrollVelocity";
import ShinyText from "../components/reactbits/ShinyText";
import Squares from "../components/reactbits/Squares";
import StatusMark from "../components/reactbits/StatusMark";
import TiltedCard from "../components/reactbits/TiltedCard";
import VariableProximity from "../components/reactbits/VariableProximity";
import {
  Eyebrow,
  Section,
  SectionHeading,
  SocialLink,
  Tag,
} from "../components/shared";
import {
  ArrowRightIcon,
  ArrowUpIcon,
  ArrowUpRightIcon,
  CheckIcon,
  CopyIcon,
  GithubIcon,
  LinkedinIcon,
  MailIcon,
} from "../components/icons";
import {
  ABOUT,
  AGENDA_PROJECT,
  CONTACT,
  DATAREFINE_FIXES,
  HERO,
  INTERESTS,
  MANIFESTO,
  MARQUEE,
  NAV_LINKS,
  PROCESS,
  PROFILE,
  PROJECT,
  PROJECT_DOCS,
  PROJECT_METRICS,
  PROJECT_TAGS,
  STEPS,
} from "../content";
import { hasHardwareWebGL } from "../lib/gpu";
import { useDocumentTitle, useIdle, useMediaQuery } from "../lib/hooks";
import { useToast } from "../lib/toast";
import { btn, card, delay, focusRing } from "../lib/ui";

// three.js pesa: la credencial 3D llega en un archivo aparte, sin frenar el texto
const Lanyard = lazy(() => import("../components/Lanyard"));

// Widgets de más abajo: su código se descarga cuando están por verse
const TechLogos = lazy(() => import("../components/TechLogos"));
const Calculator = lazy(() => import("../components/Calculator"));
const MoreProjects = lazy(() => import("../components/MoreProjects"));
const ServicesBento = lazy(() => import("../components/ServicesBento"));
const Showcase = lazy(() => import("../components/Showcase"));
const Folder = lazy(() => import("../components/reactbits/Folder"));
const ToolExplorer = lazy(() => import("../components/ToolExplorer"));
const ProjectBrief = lazy(() => import("../components/ProjectBrief"));
const Crosshair = lazy(() => import("../components/reactbits/Crosshair"));
const DevMode = lazy(() => import("../components/DevMode"));

const pad = (n) => String(n).padStart(2, "0");

const label =
  "font-mono text-xs uppercase tracking-[0.18em] text-[color:var(--muted)]";

/* ── Hero ─────────────────────────────────────────────────── */

const Hero = () => {
  // La credencial se monta cuando el navegador queda libre (el texto pinta
  // primero) y, sin GPU, se usa la versión ligera en lugar de la escena 3D
  const idle = useIdle();
  // El borde animado del botón gira solo en equipos con mouse y cuando la página
  // ya cargó: en celulares dibujarlo en cada cuadro costaba ~1 s de CPU
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");
  const badge = useMemo(
    () => (idle ? (hasHardwareWebGL() ? "3d" : "static") : null),
    [idle],
  );
  return (
    <section
      id="inicio"
      className="relative flex min-h-[100svh] items-center overflow-hidden px-6 pb-24 pt-28 md:px-20"
    >
      {/* Halo de luz detrás de la credencial: el único gesto "grande" de color */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage:
            "radial-gradient(55% 70% at 78% 42%, rgba(212,178,122,0.17) 0%, rgba(212,178,122,0.05) 45%, rgba(212,178,122,0) 70%)",
        }}
      />

      {/* Capa 3D a pantalla completa */}
      {badge === "static" && <StaticBadge />}
      {badge === "3d" && (
        <div className="absolute inset-0 z-0 h-full w-full cursor-grab active:cursor-grabbing">
          <Suspense fallback={null}>
            <Lanyard
              frontImage="/irving-card.jpg"
              backImage="/card-back.svg"
              strapColor="#040009"
              cardColor="#fbfdff"
              finish="matte"
              metal="silver"
              breeze={0.9}
              interactive={true}
              anchor="right"
            />
          </Suspense>
        </div>
      )}

      {/* Velo para que el texto siempre se lea sobre el 3D */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1] md:hidden"
        style={{ background: "rgba(8,9,12,0.62)" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1] hidden md:block"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(8,9,12,0.95) 0%, rgba(8,9,12,0.78) 42%, rgba(8,9,12,0) 72%)",
        }}
      />

      {/* Texto: pointer-events-none en el contenedor, auto en cada bloque */}
      <div className="pointer-events-none relative z-10 flex w-full flex-col items-start md:w-[58%] lg:w-[54%]">
        <p
          className="rise pointer-events-auto mb-7 inline-flex items-center gap-2.5 rounded-full border border-[color:var(--line)] bg-[color:var(--glass)] px-3.5 py-1.5 text-sm backdrop-blur"
          style={delay(0)}
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[color:var(--clean)] opacity-75 motion-reduce:animate-none" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[color:var(--clean)]" />
          </span>
          <ShinyText text={HERO.badge} />
        </p>

        <p
          className="rise pointer-events-auto mb-4 font-mono text-xs uppercase tracking-[0.2em] text-[color:var(--accent)]"
          style={delay(1)}
        >
          <span className="max-sm:hidden">{PROFILE.shortName} — </span>
          {HERO.eyebrow}
        </p>

        <BlurText
          as="h1"
          text={HERO.title}
          highlight={HERO.highlight}
          highlightClassName="gradient-text text-brass"
          delay={70}
          className="balance pointer-events-auto font-display text-[2.6rem] font-semibold leading-[1.02] tracking-[-0.03em] text-[color:var(--text)] sm:text-[3.4rem] lg:text-[4.1rem] xl:text-[4.5rem]"
        />

        <p
          className="rise pointer-events-auto mt-7 flex flex-wrap items-center gap-x-3 gap-y-2 font-display text-xl text-[color:var(--soft)] md:text-2xl"
          style={delay(4)}
        >
          <span>{HERO.rotatingPrefix}</span>
          <RotatingText
            texts={HERO.rotating}
            className="rounded-lg border border-[color:var(--accent-line)] bg-[color:var(--accent-bg)] px-3 py-0.5 font-semibold text-[color:var(--accent)]"
          />
        </p>

        <p
          className="rise pointer-events-auto mt-6 max-w-xl text-lg leading-relaxed text-[color:var(--soft)]"
          style={delay(5)}
        >
          {HERO.lead}
        </p>

        <div
          className="rise pointer-events-auto mt-9 flex flex-wrap items-center gap-3"
          style={delay(6)}
        >
          <Magnet>
            <Link to="/demo/datarefine" className={btn("primary")}>
              Probar DataRefine <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </Magnet>
          <Magnet>
            <StarBorder
              as="a"
              href="#contacto"
              color="#D4B27A"
              backgroundColor="rgba(16,18,23,0.72)"
              textColor="#F1F3F6"
              borderColor="rgba(255,255,255,0.16)"
              radius={10}
              cruise={finePointer && idle}
              className={`h-12 px-6 text-[15px] font-semibold backdrop-blur ${focusRing}`}
            >
              Hablemos de tu proyecto
            </StarBorder>
          </Magnet>
        </div>

        <div
          className="rise pointer-events-auto mt-9 flex items-center gap-3"
          style={delay(7)}
        >
          <SocialLink href={PROFILE.github} label="GitHub">
            <GithubIcon />
          </SocialLink>
          <SocialLink href={PROFILE.linkedin} label="LinkedIn">
            <LinkedinIcon />
          </SocialLink>
        </div>
      </div>

      {/* Fundido suave hacia la siguiente sección */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-40"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, rgba(8,9,12,0), var(--ink))",
        }}
      />

      {badge === "3d" && (
        <p className="pointer-events-none absolute bottom-6 right-6 z-10 hidden font-mono text-xs uppercase tracking-[0.18em] text-[color:var(--muted)] md:block">
          Arrástrala o haz clic para girarla ↗
        </p>
      )}
    </section>
  );
};

/* ── Franja en movimiento ─────────────────────────────────── */

const Marquee = () => (
  <div className="border-y border-[color:var(--line)] py-5">
    <ScrollVelocity
      velocity={45}
      rows={[
        {
          text: MARQUEE[0],
          className:
            "py-1 font-display text-4xl font-semibold tracking-tight text-[color:var(--text)] md:text-6xl",
        },
      ]}
    />
    <Deferred minHeight="3.5rem" rootMargin="300px 0px" className="mt-5">
      <TechLogos />
    </Deferred>
  </div>
);

/* ── Manifiesto ───────────────────────────────────────────── */

const Manifesto = () => (
  <Section size="md" className="cv cv-s">
    <ScrollReveal
      text={MANIFESTO.text}
      highlight={MANIFESTO.highlight}
      className="balance max-w-5xl font-display text-3xl font-semibold leading-[1.18] tracking-tight md:text-5xl"
    />
  </Section>
);

/* ── Calculadora ──────────────────────────────────────────── */

const CostCalculator = () => (
  <div className="cv cv-m border-t border-[color:var(--line)]">
    <Section id="calculadora">
      <Deferred minHeight="40rem">
        <Calculator />
      </Deferred>
    </Section>
  </div>
);

/* ── Servicios ────────────────────────────────────────────── */

const Services = () => (
  <Section id="servicios" className="cv cv-l">
    <SectionHeading
      index="01"
      eyebrow="Servicios"
      title="Lo que puedo resolver para tu equipo."
      intro="Soluciones a la medida para operaciones que dependen de hojas de cálculo, tareas repetitivas y sistemas que no se hablan entre sí."
    />

    <Deferred minHeight="30rem" className="mt-14">
      <ServicesBento />
    </Deferred>
  </Section>
);

/* ── Caso de estudio ──────────────────────────────────────── */

const Project = () => (
  <div id="proyecto" className="border-t border-[color:var(--line)]">
    {/* Apertura: la demo crece a pantalla completa y presenta el proyecto */}
    <Deferred minHeight="250vh" rootMargin="400px 0px">
      <Showcase />
    </Deferred>

    <div className="cv cv-xl">
      <Section className="pt-12! md:pt-16!">
        <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <div>
            <dl className="space-y-7">
              <div>
                <dt className={label}>El reto</dt>
                <dd className="mt-2 leading-relaxed text-[color:var(--soft)]">
                  {PROJECT.challenge}
                </dd>
              </div>
              <div>
                <dt className={label}>La solución</dt>
                <dd className="mt-2 leading-relaxed text-[color:var(--soft)]">
                  {PROJECT.solution}
                </dd>
              </div>
            </dl>

            <ul className="mt-8 space-y-3 text-[color:var(--soft)]">
              {DATAREFINE_FIXES.map((fix) => (
                <li key={fix} className="flex gap-3">
                  <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-[color:var(--accent)]" />
                  <span>{fix}</span>
                </li>
              ))}
            </ul>

            <ul
              className="mt-8 flex flex-wrap gap-2"
              aria-label="Tecnologías del proyecto"
            >
              {PROJECT_TAGS.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </ul>
          </div>

          <AnimatedContent blur distance={24}>
            <CleaningDemo />
          </AnimatedContent>
        </div>

        {/* Cifras */}
        <ul className="mt-20 grid divide-y divide-[color:var(--line)] overflow-hidden rounded-2xl border border-[color:var(--line)] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {PROJECT_METRICS.map((metric, i) => (
            <li key={metric.label} className="bg-[color:var(--glass)] p-7">
              <p className="font-display text-5xl font-semibold tracking-tight text-[color:var(--text)] md:text-6xl">
                <CountUp to={metric.value} delay={i * 0.15} />
                {metric.unit && (
                  <span className="ml-1.5 text-2xl text-[color:var(--accent)] md:text-3xl">
                    {metric.unit}
                  </span>
                )}
              </p>
              <p className="mt-3 font-medium text-[color:var(--text)]">
                {metric.label}
              </p>
              <p className="mt-1 text-sm text-[color:var(--muted)]">
                {metric.detail}
              </p>
            </li>
          ))}
        </ul>

        <h3 className="mt-24 font-display text-2xl font-semibold text-[color:var(--text)]">
          Cómo funciona
        </h3>
        <ol className="mt-8 grid gap-8 border-t border-[color:var(--line)] pt-8 md:grid-cols-3 md:gap-10">
          {STEPS.map((step, i) => (
            <AnimatedContent as="li" key={step.title} delay={i * 0.1}>
              <span className="font-mono text-sm text-[color:var(--accent)]">
                {pad(i + 1)}
              </span>
              <h4 className="mt-3 font-display text-xl font-semibold text-[color:var(--text)]">
                {step.title}
              </h4>
              <p className="mt-2 max-w-sm leading-relaxed text-[color:var(--soft)]">
                {step.text}
              </p>
            </AnimatedContent>
          ))}
        </ol>

        <UnderTheHood />
      </Section>
    </div>
  </div>
);

/* Carpeta con las fichas técnicas del proyecto */
const UnderTheHood = () => {
  const wide = useMediaQuery("(min-width: 640px)");
  return (
    <div className="mt-24 grid grid-cols-[minmax(0,1fr)] items-center gap-10 border-t border-[color:var(--line)] pt-16 lg:grid-cols-[0.9fr_1.1fr]">
      <div>
        <Eyebrow>Documentación técnica</Eyebrow>
        <h3 className="mt-4 font-display text-3xl font-semibold text-[color:var(--text)]">
          Bajo el capó
        </h3>
        <p className="mt-4 max-w-md leading-relaxed text-[color:var(--soft)]">
          Arquitectura, validaciones y manejo de errores de DataRefine,
          resumidos en tres fichas. Abre la carpeta y haz clic en una ficha para
          ampliarla.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Magnet>
            <Link to="/demo/datarefine" className={btn("primary")}>
              Probar la demo en vivo <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </Magnet>
          <VideoButton url={PROJECT.video} />
        </div>
      </div>
      <Deferred
        minHeight="24rem"
        className="flex min-h-[24rem] items-center justify-center"
      >
        <Folder
          label="DataRefine"
          items={PROJECT_DOCS}
          color="#D4B27A"
          paperColor="#F1F3F6"
          size={wide ? 1.5 : 1.15}
        />
      </Deferred>
    </div>
  );
};

/* ── Caso de estudio: AgendaFlow ──────────────────────────── */

const AgendaCase = () => (
  <div className="cv cv-xl border-t border-[color:var(--line)]">
    <Section id="agenda">
      <SectionHeading
        index="03"
        eyebrow="Caso de estudio"
        title={AGENDA_PROJECT.name}
        intro={AGENDA_PROJECT.tagline}
      />

      <div className="mt-14 grid grid-cols-[minmax(0,1fr)] items-start gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
        <div>
          <dl className="space-y-7">
            <div>
              <dt className={label}>El reto</dt>
              <dd className="mt-2 leading-relaxed text-[color:var(--soft)]">
                {AGENDA_PROJECT.challenge}
              </dd>
            </div>
            <div>
              <dt className={label}>La solución</dt>
              <dd className="mt-2 leading-relaxed text-[color:var(--soft)]">
                {AGENDA_PROJECT.solution}
              </dd>
            </div>
          </dl>

          <ul className="mt-8 space-y-3 text-[color:var(--soft)]">
            {AGENDA_PROJECT.highlights.map((item) => (
              <li key={item} className="flex gap-3">
                <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-[color:var(--accent)]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <ul
            className="mt-8 flex flex-wrap gap-2"
            aria-label="Tecnologías del proyecto"
          >
            {AGENDA_PROJECT.tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </ul>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Magnet>
              <Link to="/demo/agenda" className={btn("primary")}>
                Probar el agente en vivo <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </Magnet>
            <VideoButton url={AGENDA_PROJECT.video} />
          </div>
        </div>

        <AnimatedContent blur distance={24}>
          <AgentDemo />
        </AnimatedContent>
      </div>

      {/* Cifras */}
      <ul className="mt-20 grid divide-y divide-[color:var(--line)] overflow-hidden rounded-2xl border border-[color:var(--line)] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {AGENDA_PROJECT.metrics.map((metric, i) => (
          <li key={metric.label} className="bg-[color:var(--glass)] p-7">
            <p className="font-display text-5xl font-semibold tracking-tight text-[color:var(--text)] md:text-6xl">
              <CountUp to={metric.value} delay={i * 0.15} />
              {metric.unit && (
                <span className="ml-1.5 text-2xl text-[color:var(--accent)] md:text-3xl">
                  {metric.unit}
                </span>
              )}
            </p>
            <p className="mt-3 font-medium text-[color:var(--text)]">
              {metric.label}
            </p>
            <p className="mt-1 text-sm text-[color:var(--muted)]">
              {metric.detail}
            </p>
          </li>
        ))}
      </ul>

      <h3 className="mt-24 font-display text-2xl font-semibold text-[color:var(--text)]">
        Cómo funciona
      </h3>
      <ol className="mt-8 grid gap-8 border-t border-[color:var(--line)] pt-8 md:grid-cols-3 md:gap-10">
        {AGENDA_PROJECT.steps.map((step, i) => (
          <AnimatedContent as="li" key={step.title} delay={i * 0.1}>
            <span className="font-mono text-sm text-[color:var(--accent)]">
              {pad(i + 1)}
            </span>
            <h4 className="mt-3 font-display text-xl font-semibold text-[color:var(--text)]">
              {step.title}
            </h4>
            <p className="mt-2 max-w-sm leading-relaxed text-[color:var(--soft)]">
              {step.text}
            </p>
          </AnimatedContent>
        ))}
      </ol>
    </Section>
  </div>
);

/* ── Más proyectos ────────────────────────────────────────── */

const Projects = () => (
  <div className="cv cv-m border-t border-[color:var(--line)]">
    <Section id="proyectos">
      <SectionHeading
        index="04"
        eyebrow="Más proyectos"
        title="También construyo plataformas completas."
        intro="Sistemas de punta a punta, de la base de datos a la red. Así se ve por dentro uno de ellos."
      />
      <Deferred minHeight="60rem" className="mt-12">
        <MoreProjects />
      </Deferred>
    </Section>
  </div>
);

/* ── Proceso ──────────────────────────────────────────────── */

// Cada paso pasa de pendiente → en curso → completado, en cascada
const PROCESS_TICKS = PROCESS.length * 2;

const stepStatus = (phase, i) =>
  phase >= i * 2 + 2 ? "done" : phase >= i * 2 + 1 ? "running" : "pending";

const Process = () => {
  const reduce = useReducedMotion();
  const listRef = useRef(null);
  const inView = useInView(listRef, { once: true, amount: 0.5 });
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!inView || reduce) return undefined;
    const id = setInterval(
      () => setTick((t) => (t >= PROCESS_TICKS ? t : t + 1)),
      520,
    );
    return () => clearInterval(id);
  }, [inView, reduce]);

  const phase = reduce && inView ? PROCESS_TICKS : tick;

  return (
    <div className="cv cv-m border-t border-[color:var(--line)]">
      <Section id="proceso">
        <SectionHeading
          index="05"
          eyebrow="Proceso"
          title="Un proceso claro, de la idea a producción."
          intro="Sin sorpresas: sabes qué se va a construir, cuándo se entrega y cómo vamos a medir el resultado."
        />

        <div className="relative mt-16">
          {/* Línea de tiempo que se dibuja al entrar en pantalla */}
          <motion.span
            aria-hidden="true"
            className="absolute left-0 right-0 top-[11px] hidden h-px origin-left bg-[color:var(--accent-line)] md:block"
            initial={reduce ? false : { scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 1.4, ease: [0.2, 0.7, 0.2, 1] }}
          />
          <ol ref={listRef} className="grid gap-10 md:grid-cols-4 md:gap-8">
            {PROCESS.map((step, i) => (
              <AnimatedContent
                as="li"
                key={step.title}
                delay={0.2 + i * 0.15}
                className="relative border-l border-[color:var(--line)] pl-6 md:border-l-0 md:pl-0"
              >
                <span
                  aria-hidden="true"
                  className="absolute -left-[12px] top-0 flex rounded-full bg-[color:var(--ink)] p-[2px] md:left-0"
                >
                  <StatusMark
                    status={stepStatus(phase, i)}
                    size={20}
                    color="#D4B27A"
                    doneColor="#7BDDB5"
                    strike={false}
                  />
                </span>
                <span className="block font-mono text-sm text-[color:var(--accent)] md:mt-8">
                  {pad(i + 1)}
                </span>
                <h3 className="mt-2 font-display text-xl font-semibold text-[color:var(--text)]">
                  {step.title}
                </h3>
                <p className="mt-2 leading-relaxed text-[color:var(--soft)]">
                  {step.text}
                </p>
              </AnimatedContent>
            ))}
          </ol>
        </div>
      </Section>
    </div>
  );
};

/* ── Sobre mí ─────────────────────────────────────────────── */

const About = () => (
  <div className="cv cv-xl border-t border-[color:var(--line)]">
    <Section id="sobre-mi">
      <Eyebrow index="06">Sobre mí</Eyebrow>
      {/* Firma: cada letra gana peso al acercar el cursor */}
      <h2 className="mt-6 select-none whitespace-nowrap font-display text-[clamp(3.2rem,12.5vw,10.5rem)] leading-[0.9] tracking-[-0.04em] text-[color:var(--text)]">
        <VariableProximity label={PROFILE.shortName} />
      </h2>
      <div className="mt-14 grid grid-cols-[minmax(0,1fr)] items-start gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <AnimatedContent className="lg:sticky lg:top-28">
          <TiltedCard
            imageSrc="/irving-about.jpg"
            altText="Retrato de Irving Dávila"
            captionText={PROFILE.shortName}
            className="mx-auto max-w-sm"
            overlayContent={
              <div className="flex items-center justify-between gap-3 rounded-xl border border-[color:var(--line-strong)] bg-[rgba(8,9,12,0.7)] px-4 py-3 backdrop-blur-md">
                <div>
                  <p className="font-display font-semibold text-[color:var(--text)]">
                    {PROFILE.shortName}
                  </p>
                  <p className="text-xs text-[color:var(--soft)]">
                    Full-stack · IA aplicada
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--clean-bg)] px-2.5 py-1 text-xs font-medium text-[color:var(--clean)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--clean)]" />
                  Disponible
                </span>
              </div>
            }
          />
        </AnimatedContent>

        <div>
          <p className="balance font-display text-3xl font-semibold leading-tight tracking-tight text-[color:var(--text)] md:text-4xl">
            {ABOUT.title}
          </p>
          <div className="mt-6 space-y-5 text-lg leading-relaxed text-[color:var(--soft)]">
            {ABOUT.bio.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
          </div>

          <ul className="mt-10 grid gap-6 border-t border-[color:var(--line)] pt-8 sm:grid-cols-3">
            {ABOUT.principles.map(({ title, text }) => (
              <li key={title}>
                <p className="font-display text-lg font-semibold text-[color:var(--text)]">
                  {title}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-[color:var(--muted)]">
                  {text}
                </p>
              </li>
            ))}
          </ul>

          <div id="stack" className="mt-16">
            <Eyebrow>Herramientas</Eyebrow>
            <Deferred minHeight="20rem" className="mt-6">
              <ToolExplorer />
            </Deferred>
          </div>

          <div className="mt-16">
            <Eyebrow>Fuera de la terminal</Eyebrow>
            <ul className="mt-6 divide-y divide-[color:var(--line)] border-y border-[color:var(--line)]">
              {INTERESTS.map(({ title, text }) => (
                <li key={title} className="gap-8 py-5 md:flex">
                  <h3 className="shrink-0 font-display text-lg font-semibold text-[color:var(--text)] md:w-36">
                    {title}
                  </h3>
                  <p className="mt-1 leading-relaxed text-[color:var(--soft)] md:mt-0">
                    {text}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Section>
  </div>
);

/* ── Preguntas frecuentes ─────────────────────────────────── */

const Questions = () => (
  <div className="cv cv-m border-t border-[color:var(--line)]">
    <Section id="preguntas">
      <div className="grid grid-cols-[minmax(0,1fr)] gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <SectionHeading
          index="07"
          eyebrow="Preguntas frecuentes"
          title="Lo que suelen preguntarme antes de empezar."
          intro="Si tu duda no está aquí, escríbeme: respondo personalmente."
        />
        <Faq />
      </div>
    </Section>
  </div>
);

/* ── Contacto ─────────────────────────────────────────────── */

const useCopy = (text) => {
  const [copied, setCopied] = useState(false);
  const timer = useRef(null);
  const notify = useToast();

  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      notify("Correo copiado", text);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      // Sin permiso de portapapeles: abre el cliente de correo
      window.location.href = `mailto:${text}`;
    }
  };

  return [copied, copy];
};

const Contact = () => {
  const [copied, copyEmail] = useCopy(PROFILE.email);
  const areaRef = useRef(null);
  // La mira sólo tiene sentido con mouse: en pantallas táctiles ni se descarga
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");

  return (
    <div
      ref={areaRef}
      className="cv cv-m relative isolate overflow-hidden border-t border-[color:var(--line)]"
    >
      <Squares className="-z-10" />
      {finePointer && (
        <Deferred rootMargin="200px 0px">
          <Crosshair
            containerRef={areaRef}
            color="#D4B27A"
            opacity={0.6}
            fade={0.7}
            smoothing={0.3}
          />
        </Deferred>
      )}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "radial-gradient(50% 90% at 10% 100%, rgba(212,178,122,0.12) 0%, rgba(212,178,122,0) 70%)",
        }}
      />
      <Section id="contacto">
        <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div className="lg:pt-6">
            <Eyebrow index="08">Contacto</Eyebrow>
            <h2 className="balance mt-5 max-w-3xl font-display text-4xl font-semibold leading-[1.05] tracking-tight text-[color:var(--text)] md:text-6xl">
              {CONTACT.title} <GradientText>{CONTACT.highlight}</GradientText>
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-[color:var(--soft)]">
              {CONTACT.text}
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Magnet>
                <a href={`mailto:${PROFILE.email}`} className={btn("primary")}>
                  <MailIcon className="h-[18px] w-[18px]" /> Escríbeme
                </a>
              </Magnet>
              <Magnet>
                <button
                  type="button"
                  onClick={copyEmail}
                  className={btn("secondary")}
                >
                  {copied ? (
                    <CheckIcon className="h-5 w-5 text-[color:var(--clean)]" />
                  ) : (
                    <CopyIcon />
                  )}
                  {copied ? "Correo copiado" : "Copiar correo"}
                </button>
              </Magnet>
              <span className="sr-only" role="status">
                {copied ? "Correo copiado al portapapeles" : ""}
              </span>

              <div className="flex items-center gap-3 sm:ml-2">
                <SocialLink href={PROFILE.linkedin} label="LinkedIn">
                  <LinkedinIcon />
                </SocialLink>
                <SocialLink href={PROFILE.github} label="GitHub">
                  <GithubIcon />
                </SocialLink>
              </div>
            </div>
          </div>

          <Deferred
            minHeight="26rem"
            className={`${card} bg-[rgba(16,18,23,0.8)] p-5 backdrop-blur-md md:p-6`}
          >
            <ProjectBrief />
          </Deferred>
        </div>
      </Section>
    </div>
  );
};

/* ── Footer ───────────────────────────────────────────────── */

const footerLink = `inline-flex items-center gap-1.5 rounded-md text-[color:var(--soft)] transition-colors hover:text-[color:var(--text)] ${focusRing}`;

const Footer = () => (
  <footer className="cv cv-m relative overflow-hidden border-t border-[color:var(--line)]">
    <div className="mx-auto max-w-6xl px-6 pt-16 md:px-10">
      <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="sm:col-span-2 md:col-span-1">
          <p className="font-display text-lg font-semibold text-[color:var(--text)]">
            {PROFILE.shortName}
          </p>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-[color:var(--muted)]">
            {PROFILE.role}. Herramientas que convierten trabajo manual en
            procesos automatizados.
          </p>
        </div>

        <nav aria-label="Pie de página">
          <p className={label}>Navegación</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} className={footerLink}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className={label}>Conecta</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <a href={`mailto:${PROFILE.email}`} className={footerLink}>
                Correo
              </a>
            </li>
            <li>
              <a
                href={PROFILE.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className={footerLink}
              >
                LinkedIn <ArrowUpRightIcon className="h-3.5 w-3.5" />
              </a>
            </li>
            <li>
              <a
                href={PROFILE.github}
                target="_blank"
                rel="noopener noreferrer"
                className={footerLink}
              >
                GitHub <ArrowUpRightIcon className="h-3.5 w-3.5" />
              </a>
            </li>
          </ul>
        </div>
      </div>

      <Deferred minHeight="9rem" className="mb-16 mt-14">
        <DevMode />
      </Deferred>
    </div>

    <div className="border-t border-[color:var(--line)]">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-6 py-6 text-sm text-[color:var(--muted)] md:flex-row md:items-center md:px-10">
        <p>
          © {new Date().getFullYear()} {PROFILE.name}. Todos los derechos
          reservados.
        </p>
        <a href="#inicio" className={footerLink}>
          <ArrowUpIcon className="h-4 w-4" /> Volver arriba
        </a>
      </div>
    </div>
  </footer>
);

/* ── Página ───────────────────────────────────────────────── */

// Datos estructurados de la persona (buscadores y vistas previas)
const PERSON = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Person",
  name: PROFILE.name,
  alternateName: PROFILE.shortName,
  url: import.meta.env.VITE_SITE_URL || undefined,
  jobTitle: PROFILE.role,
  email: `mailto:${PROFILE.email}`,
  sameAs: [PROFILE.github, PROFILE.linkedin],
  knowsAbout: [
    "Automatización de procesos",
    "FastAPI",
    "React",
    "Linux",
    "Proxmox",
    "AWS",
    "APIs de IA",
  ],
});

/* Primero se pinta lo que se ve al abrir (Hero y marquesina); el resto de las
   secciones se monta enseguida como transición, que React reparte en tareas
   cortas en vez de un solo bloque. Si el enlace apunta a una sección
   (/#contacto), se monta todo de una vez para poder llegar a ella. */
const BELOW_THE_FOLD = [
  Manifesto,
  CostCalculator,
  Services,
  Project,
  AgendaCase,
  Projects,
  Process,
  About,
  Questions,
  Contact,
];

const useRestOfPage = () => {
  const [ready, setReady] = useState(() => Boolean(window.location.hash));
  useEffect(() => {
    if (!ready) startTransition(() => setReady(true));
  }, [ready]);
  return ready;
};

const Landing = () => {
  useDocumentTitle(
    "Irving Dávila — Automatización con IA y desarrollo full-stack",
  );
  const rest = useRestOfPage();

  return (
    <div className="grain font-body bg-[color:var(--ink)] text-[color:var(--text)]">
      <a
        href="#contenido"
        className="fixed left-4 top-4 z-[60] -translate-y-24 rounded-lg bg-[color:var(--btn)] px-4 py-2 text-sm font-semibold text-[color:var(--btn-ink)] transition-transform focus:translate-y-0"
      >
        Saltar al contenido
      </a>
      <Header />
      <main id="contenido">
        <Hero />
        <Marquee />
        {rest && BELOW_THE_FOLD.map((Section, i) => <Section key={i} />)}
      </main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: PERSON }}
      />
      {rest && <Footer />}
    </div>
  );
};

export default Landing;
