import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useContent } from "../lib/i18n";
import { btn, iconBtn } from "../lib/ui";
import { PlayIcon, XIcon } from "./icons";

/* Botón que abre un video (Loom o YouTube) en un modal. Si no hay enlace no
   se muestra nada, así que los proyectos pueden tener el campo vacío. */

const toEmbed = (url) => {
  try {
    const u = new URL(url);
    if (u.hostname.endsWith("loom.com")) {
      const id = u.pathname.split("/").filter(Boolean).pop();
      return `https://www.loom.com/embed/${id}?hide_owner=true&hide_share=true&hide_title=true&hideEmbedTopBar=true`;
    }
    if (u.hostname.includes("youtube.com") || u.hostname === "youtu.be") {
      const id =
        u.hostname === "youtu.be"
          ? u.pathname.slice(1)
          : u.searchParams.get("v");
      return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1`;
    }
    return url;
  } catch {
    return url;
  }
};

const VideoButton = ({
  url,
  label,
  variant = "secondary",
  size = "md",
  className = "",
}) => {
  const words = useContent().UI.common;
  const text = label ?? words.watchWalkthrough;
  const [open, setOpen] = useState(false);
  const closeRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const trigger = triggerRef.current;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
      trigger?.focus();
    };
  }, [open]);

  if (!url) return null;

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        className={`${btn(variant, size)} ${className}`}
      >
        <PlayIcon className="h-4 w-4 text-[color:var(--accent)]" /> {text}
      </button>

      {createPortal(
        <AnimatePresence>
          {open && (
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={text}
              className="fixed inset-0 z-[95] grid place-items-center bg-black/80 p-4 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            >
              <motion.div
                className="relative w-full max-w-4xl"
                initial={{ scale: 0.96, y: 12 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.96, y: 12 }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  ref={closeRef}
                  type="button"
                  aria-label={words.closeVideo}
                  onClick={() => setOpen(false)}
                  className={`${iconBtn} absolute -top-11 right-0 text-white`}
                >
                  <XIcon />
                </button>
                <div className="aspect-video overflow-hidden rounded-xl border border-[color:var(--line)] bg-black">
                  <iframe
                    src={toEmbed(url)}
                    title={text}
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                    className="h-full w-full"
                  />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  );
};

export default VideoButton;
