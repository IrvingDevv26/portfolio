import { Link } from "react-router-dom";
import { PROJECT, SHOWCASE } from "../content";
import { useMediaQuery } from "../lib/hooks";
import { btn } from "../lib/ui";
import { ArrowRightIcon } from "./icons";
import ScrollExpand from "./reactbits/ScrollExpand";
import { Eyebrow } from "./shared";
import VideoButton from "./VideoButton";

/* Apertura del caso de estudio (ScrollExpand de React Bits): la captura de la
   demo (o el video, si existe) crece hasta ocupar la pantalla y termina en la
   presentación del proyecto. */

const Showcase = () => {
  const wide = useMediaQuery("(min-width: 768px)");
  const video = Boolean(SHOWCASE.video);

  return (
    <ScrollExpand
      useWindowScroll
      mediaType={video ? "video" : "image"}
      src={video ? SHOWCASE.video : SHOWCASE.poster}
      poster={SHOWCASE.poster}
      alt="Demo de DataRefine limpiando un archivo con IA"
      title={
        <span className="font-display font-semibold tracking-tight">
          Mírala funcionando
        </span>
      }
      scrollHint={
        <span className="font-mono text-xs uppercase tracking-[0.2em]">
          Desliza ↓
        </span>
      }
      startWidth={wide ? 46 : 86}
      startHeight={wide ? 56 : 46}
      startRadius={22}
      mediaZoom={1.2}
      scrollDistance={1.1}
      holdDistance={0.45}
      overlayScrim={0.78}
      className="showcase"
    >
      <div className="mx-auto max-w-2xl rounded-3xl border border-[color:var(--line-strong)] bg-[#08090C]/92 px-6 py-10 text-center shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)] backdrop-blur-md md:px-12 md:py-12">
        <div className="flex justify-center">
          <Eyebrow index="02">Caso de estudio</Eyebrow>
        </div>
        <h2 className="mt-5 font-display text-4xl font-semibold tracking-tight text-white md:text-6xl">
          {PROJECT.name}
        </h2>
        <p className="balance mt-3 font-display text-lg text-[color:var(--accent)] md:text-xl">
          {PROJECT.tagline}
        </p>
        <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-[color:var(--soft)] md:text-lg">
          {PROJECT.summary}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/demo/datarefine" className={btn("primary")}>
            Probar la demo en vivo <ArrowRightIcon className="h-4 w-4" />
          </Link>
          <VideoButton url={PROJECT.video} label="Ver el video" />
        </div>
      </div>
    </ScrollExpand>
  );
};

export default Showcase;
