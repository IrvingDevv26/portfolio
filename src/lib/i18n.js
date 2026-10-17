import { createContext, useContext } from "react";
import * as en from "../content/en";
import * as es from "../content/es";

/* Idiomas del sitio. El español vive en la raíz (/, /demo/agenda…) y el
   inglés bajo /en (/en, /en/demo/agenda…). El idioma sale de la URL, así cada
   enlace se puede compartir en el idioma que se ve.

   Todos los textos están en src/content/es.js y src/content/en.js, con la
   misma forma: los componentes los piden con useContent(). */

export const LANGUAGES = ["es", "en"];
const CONTENT = { es, en };

// Cómo se guarda la elección del visitante (para no volver a sugerirle idioma)
export const LANGUAGE_KEY = "lang";

/** "/en/demo/agenda" → "en"; cualquier otra ruta es español. */
export const languageOf = (pathname) =>
  /^\/en(\/|$)/.test(pathname) ? "en" : "es";

/** "/en/demo/agenda" → "/demo/agenda" (la ruta sin el idioma). */
export const stripLanguage = (pathname) =>
  pathname.replace(/^\/en(?=\/|$)/, "") || "/";

/** La misma página en otro idioma: localize("/demo/agenda", "en") →
    "/en/demo/agenda"; también conserva el #sección ("/#contacto" → "/en#contacto"). */
export const localize = (path, lang) => {
  const [pathname, hash] = path.split("#");
  const bare = stripLanguage(pathname || "/");
  const base = lang === "en" ? (bare === "/" ? "/en" : `/en${bare}`) : bare;
  return hash ? `${base}#${hash}` : base;
};

// App.jsx lo llena con el idioma de la URL
export const LanguageContext = createContext("es");

export const useLang = () => useContext(LanguageContext);

/** Los textos del idioma actual (todo lo que exporta src/content/<idioma>.js). */
export const useContent = () => CONTENT[useLang()];

/** Para enlaces internos: const to = useLocalize(); <Link to={to("/demo/agenda")}> */
export const useLocalize = () => {
  const lang = useLang();
  return (path) => localize(path, lang);
};

/** Los textos de un idioma en particular (la sugerencia se escribe en el otro). */
export const contentFor = (lang) => CONTENT[lang];

/** Idioma que eligió el visitante ("es", "en" o null si nunca eligió). */
export const chosenLanguage = () => {
  try {
    const value = localStorage.getItem(LANGUAGE_KEY);
    return LANGUAGES.includes(value) ? value : null;
  } catch {
    return null;
  }
};

export const rememberLanguage = (lang) => {
  try {
    localStorage.setItem(LANGUAGE_KEY, lang);
  } catch {
    // Sin almacenamiento (modo privado): solo no se recuerda
  }
};

/** El primer idioma del navegador que el sitio tiene ("es", "en" o null). */
export const browserLanguage = () => {
  const list = navigator.languages?.length
    ? navigator.languages
    : [navigator.language];
  for (const tag of list) {
    const code = String(tag).slice(0, 2).toLowerCase();
    if (LANGUAGES.includes(code)) return code;
  }
  return null;
};
