/* Color de cada profesional de la clínica. El dorado del portfolio se reserva
   para las citas del visitante, así se distinguen de un vistazo. */

const PRO_COLORS = ["#7FC8D8", "#C9B6F2"];
const FALLBACK = "#BCC1CB";

export const proIndex = (business, name) =>
  (business?.profesionales ?? []).findIndex((p) => p.nombre === name);

export const proColor = (business, name) =>
  PRO_COLORS[proIndex(business, name)] ?? FALLBACK;
