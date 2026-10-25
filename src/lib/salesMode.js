import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/* Modo venta de las demos.

   Los links de las demos se mandan en propuestas de Workana, que castiga
   compartir datos de contacto. Por eso una demo abierta directo desde su link
   no lleva a ningún dato: ni enlace a la portada ni botones de contacto.

   El modo venta (enlace a la portada y contacto) se activa:
   - al pasar por el propio sitio en esa pestaña (portada, páginas para pymes):
     quien viene de ahí ya vio tus datos;
   - con ?ref=directo en el link, para prospectos fuera de Workana.
   Dura lo que dure la pestaña (sessionStorage). */

const KEY = "modo-venta";
export const SALES_PARAM = "ref=directo";

const remembered = () => {
  try {
    return sessionStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
};

const remember = () => {
  try {
    sessionStorage.setItem(KEY, "1");
  } catch {
    // Sin almacenamiento: el modo venta dura solo esta página
  }
};

/** Para las páginas del sitio: quien pasa por aquí ve las demos en modo venta. */
export const useMarkSalesMode = () => {
  useEffect(() => remember(), []);
};

/** En las demos: true si se muestran el enlace a la portada y el contacto. */
export const useSalesMode = () => {
  const { search } = useLocation();
  const fromLink = new URLSearchParams(search).get("ref") === "directo";
  useEffect(() => {
    if (fromLink) remember();
  }, [fromLink]);
  return fromLink || remembered();
};
