import { useState } from "react";
import { Link } from "react-router-dom";
import { useMediaQuery } from "../lib/hooks";
import { useContent, useLocalize } from "../lib/i18n";
import { btn, focusRing } from "../lib/ui";
import { ArrowRightIcon, ArrowUpRightIcon, CheckIcon } from "./icons";
import GlareHover from "./reactbits/GlareHover";
import PixelTransition from "./reactbits/PixelTransition";
import ScrollStack, { ScrollStackItem } from "./reactbits/ScrollStack";
import Stack from "./reactbits/Stack";
import { Tag } from "./shared";
import VideoButton from "./VideoButton";

/* Más proyectos. Con un solo proyecto se muestra como tarjeta destacada; con
   dos o más, las tarjetas se apilan al hacer scroll (ScrollStack). */

const Labeled = ({ src, alt, label }) => (
  <div className="relative h-full w-full">
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      className="h-full w-full object-cover"
    />
    <span className="absolute left-3 top-3 rounded-full bg-[#08090C]/80 px-2.5 py-1 font-mono text-xs text-[color:var(--text)] backdrop-blur">
      {label}
    </span>
  </div>
);

// Galería de diagramas: tarjetas que se arrastran o se mandan atrás con un clic
const Gallery = ({ project }) => {
  const words = useContent().UI.moreProjects;
  const [front, setFront] = useState(0);
  const cards = project.gallery.map((item) => (
    <img
      key={item.src}
      src={item.src}
      alt={`${project.name}: ${item.caption}`}
      loading="lazy"
      decoding="async"
      draggable={false}
      className="h-full w-full object-cover"
    />
  ));
  return (
    <figure className="flex flex-col gap-3">
      <div className="relative aspect-[16/10] w-full">
        <Stack
          cards={cards}
          layout="fan"
          spread={0.35}
          depth={0.5}
          radius={16}
          tilt={18}
          sendToBackOnClick
          onChange={(top) => setFront(typeof top === "number" ? top : 0)}
        />
      </div>
      <figcaption className="flex items-start justify-between gap-4 text-xs text-[color:var(--muted)]">
        <span>
          {project.gallery[front]?.caption ?? project.gallery[0].caption}
        </span>
        <span className="shrink-0 font-mono">{words.dragHint}</span>
      </figcaption>
    </figure>
  );
};

// Portada: galería, comparación antes/después o imagen con destello
const ProjectMedia = ({ project }) => {
  const words = useContent().UI.moreProjects;
  if (project.gallery) return <Gallery project={project} />;
  const { compare } = project;
  if (compare) {
    return (
      <figure className="flex flex-col gap-2">
        <PixelTransition
          firstContent={
            <Labeled
              {...compare.before}
              alt={`${project.name}: ${compare.before.label}`}
            />
          }
          secondContent={
            <Labeled
              {...compare.after}
              alt={`${project.name}: ${compare.after.label}`}
            />
          }
          gridSize={14}
          pixelColor="#D4B27A"
          animationStepDuration={0.45}
          aspectRatio="16 / 10"
          className="w-full! border border-[color:var(--line)]"
        />
        <figcaption className="text-xs text-[color:var(--muted)]">
          {words.compareHint}
        </figcaption>
      </figure>
    );
  }
  return (
    // Proporción fija (16:10, como las capturas) para que no se recorte
    <GlareHover
      width="100%"
      height="auto"
      borderRadius="16px"
      borderColor="rgba(255,255,255,0.08)"
      glareColor="#F3E3C3"
      glareOpacity={0.35}
      className="aspect-[16/10] self-center overflow-hidden"
    >
      <img
        src={project.image}
        alt={project.imageAlt}
        loading="lazy"
        decoding="async"
        width="1200"
        height="750"
        className="h-full w-full bg-[#08090C] object-cover"
      />
    </GlareHover>
  );
};

const ProjectCard = ({ project, index }) => {
  const { UI } = useContent();
  const to = useLocalize();
  const words = UI.moreProjects;
  return (
    <article className="grid h-full gap-8 md:grid-cols-[1fr_1.1fr] md:gap-10">
      <div className="flex flex-col">
        <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.18em] text-[color:var(--accent)]">
          <span className="text-[color:var(--muted)]">
            {String(index + 1).padStart(2, "0")}
          </span>
          {project.kind}
        </p>
        <h3 className="mt-3 font-display text-2xl font-semibold text-[color:var(--text)] md:text-3xl">
          {project.name}
        </h3>
        <p className="mt-3 leading-relaxed text-[color:var(--soft)]">
          {project.summary}
        </p>
        <ul className="mt-5 space-y-2 text-sm text-[color:var(--soft)]">
          {project.highlights.map((item) => (
            <li key={item} className="flex gap-2.5">
              <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--accent)]" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <ul className="mt-5 flex flex-wrap gap-2" aria-label={UI.common.tech}>
          {project.tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </ul>

        <div className="mt-auto pt-6">
          <div className="flex flex-wrap gap-2">
            {project.demo && (
              <Link to={to(project.demo)} className={btn("primary", "sm")}>
                {words.tryDemo} <ArrowRightIcon className="h-4 w-4" />
              </Link>
            )}
            <VideoButton
              url={project.video}
              label={UI.common.watchVideo}
              size="sm"
              className="w-fit"
            />
          </div>
          {project.note && (
            <p className="mt-4 flex items-start gap-2.5 text-sm text-[color:var(--muted)]">
              <span
                aria-hidden="true"
                className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--accent)]"
              />
              {project.note}
            </p>
          )}
          {project.href && (
            <a
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`mt-4 inline-flex w-fit items-center gap-1.5 rounded-md text-sm font-medium text-[color:var(--text)] underline-offset-4 hover:text-[color:var(--accent)] hover:underline ${focusRing}`}
            >
              {words.code} <ArrowUpRightIcon className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>

      <ProjectMedia project={project} />
    </article>
  );
};

const CARD =
  "rounded-[28px] border border-[color:var(--line)] bg-[#101217] p-6 text-[color:var(--text)] md:p-8";

const MoreProjects = () => {
  const { PROJECTS } = useContent();
  // En pantallas angostas las tarjetas son más altas que la ventana y el
  // apilado taparía su parte inferior: ahí se muestran como lista normal
  const stack =
    useMediaQuery("(min-width: 768px) and (min-height: 640px)") &&
    PROJECTS.length > 1;

  if (!stack) {
    return (
      <div className="space-y-6">
        {PROJECTS.map((project, i) => (
          <div key={project.name} className={CARD}>
            <ProjectCard project={project} index={i} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <ScrollStack
      useWindowScroll
      smoothScroll={false}
      itemDistance={80}
      itemStackDistance={28}
      stackPosition="14%"
      baseScale={0.86}
      itemScale={0.04}
      dimAmount={0.35}
      holdDistance={120}
      className="projects-stack"
    >
      {PROJECTS.map((project, i) => (
        <ScrollStackItem
          key={project.name}
          itemClassName="h-auto! bg-[#101217]! p-6! md:p-8! text-[color:var(--text)]! border border-[color:var(--line)]"
        >
          <ProjectCard project={project} index={i} />
        </ScrollStackItem>
      ))}
    </ScrollStack>
  );
};

export default MoreProjects;
