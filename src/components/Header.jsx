import { motion, useScroll, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import { useContent } from "../lib/i18n";
import { btn, focusRing } from "../lib/ui";
import { ArrowRightIcon, GithubIcon, LinkedinIcon } from "./icons";
import LanguageSwitch from "./LanguageSwitch";
import StaggeredMenu from "./reactbits/StaggeredMenu";
import { SocialLink } from "./shared";

const Logo = ({ name }) => (
  <a
    href="#inicio"
    className={`pointer-events-auto group flex items-center gap-2.5 rounded-md ${focusRing}`}
  >
    <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-[color:var(--accent-line)] bg-[color:var(--accent-bg)] font-display text-[13px] font-bold tracking-tight text-[color:var(--accent)] transition-colors group-hover:bg-[color:var(--accent)] group-hover:text-[color:var(--btn-ink)]">
      ID
    </span>
    <span className="whitespace-nowrap font-display text-base font-semibold text-[color:var(--text)] max-[380px]:hidden">
      {name}
    </span>
  </a>
);

const Header = () => {
  const { NAV_LINKS, PROFILE, UI } = useContent();
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");
  const [hovered, setHovered] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // Barra de progreso de lectura
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 30,
    restDelta: 0.001,
  });

  // Fondo del header al hacer scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Sección activa: la que cruza la línea central de la pantalla. Los ids son
  // los mismos en los dos idiomas
  useEffect(() => {
    const elements = [
      "servicios",
      "precios",
      "proyecto",
      "proceso",
      "sobre-mi",
      "contacto",
    ]
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setActive((current) =>
            entry.isIntersecting
              ? entry.target.id
              : current === entry.target.id
                ? ""
                : current,
          );
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // La píldora sigue al cursor y, si no hay cursor, a la sección activa
  const pill = hovered ?? active;
  const solid = scrolled && !menuOpen;

  // Sobre el hero el header deja pasar el mouse para poder agarrar la credencial
  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color] duration-300 ${
        solid
          ? "border-[color:var(--line)] bg-[rgba(8,9,12,0.72)] backdrop-blur-md"
          : "pointer-events-none border-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-3.5 md:px-10">
        <Logo name={PROFILE.shortName} />

        <nav
          aria-label={UI.header.nav}
          className="pointer-events-auto hidden lg:block"
        >
          <ul
            onMouseLeave={() => setHovered(null)}
            className="flex items-center gap-0.5 rounded-full border border-[color:var(--line)] bg-[rgba(16,18,23,0.6)] p-1 text-sm backdrop-blur-md"
          >
            {NAV_LINKS.map((link) => {
              const id = link.href.slice(1);
              const isActive = active === id;
              return (
                <li key={link.href} className="relative">
                  {pill === id && (
                    <motion.span
                      layoutId="nav-pill"
                      aria-hidden="true"
                      className="absolute inset-0 rounded-full bg-[rgba(255,255,255,0.08)]"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 32,
                      }}
                    />
                  )}
                  <a
                    href={link.href}
                    onMouseEnter={() => setHovered(id)}
                    onFocus={() => setHovered(id)}
                    onBlur={() => setHovered(null)}
                    aria-current={isActive ? "location" : undefined}
                    className={`relative z-10 block rounded-full px-4 py-1.5 transition-colors ${
                      pill === id
                        ? "text-[color:var(--text)]"
                        : "text-[color:var(--soft)] hover:text-[color:var(--text)]"
                    } ${focusRing}`}
                  >
                    {link.label}
                    {isActive && (
                      <span
                        aria-hidden="true"
                        className="absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-[color:var(--accent)]"
                      />
                    )}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="pointer-events-auto flex items-center gap-2">
          <LanguageSwitch />
          <a
            href="#contacto"
            className={`${btn("primary", "sm")} max-sm:hidden`}
          >
            {UI.header.talk} <ArrowRightIcon className="h-4 w-4" />
          </a>
          <StaggeredMenu
            items={NAV_LINKS}
            open={menuOpen}
            onOpenChange={setMenuOpen}
            footer={
              <div className="space-y-5 border-t border-[color:var(--line)] pt-6">
                <a
                  href={`mailto:${PROFILE.email}`}
                  className={`block rounded-md text-lg text-[color:var(--soft)] transition-colors hover:text-[color:var(--text)] ${focusRing}`}
                >
                  {PROFILE.email}
                </a>
                <div className="flex items-center gap-3">
                  <SocialLink href={PROFILE.github} label="GitHub">
                    <GithubIcon />
                  </SocialLink>
                  <SocialLink href={PROFILE.linkedin} label="LinkedIn">
                    <LinkedinIcon />
                  </SocialLink>
                </div>
              </div>
            }
          />
        </div>
      </div>

      {solid && (
        <motion.div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-[-1px] h-px origin-left bg-[color:var(--accent)]"
          style={{ scaleX: progress }}
        />
      )}
    </header>
  );
};

export default Header;
