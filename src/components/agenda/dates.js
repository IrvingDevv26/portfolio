/* Fechas y horas de la demo de AgendaFlow. Todo se maneja como texto
   ("AAAA-MM-DD", "HH:MM") en la hora de la clínica que manda el backend, así
   no depende de la zona horaria del visitante. */

export const WEEKDAYS = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];

// Nombres de los días como los usa el backend en el horario del negocio
export const DAY_NAMES = [
  "domingo",
  "lunes",
  "martes",
  "miércoles",
  "jueves",
  "viernes",
  "sábado",
];

const MONTHS = [
  "ene",
  "feb",
  "mar",
  "abr",
  "may",
  "jun",
  "jul",
  "ago",
  "sep",
  "oct",
  "nov",
  "dic",
];

const noon = (iso) => new Date(`${iso}T12:00:00Z`);

export const addDays = (iso, days) => {
  const date = noon(iso);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
};

export const weekdayOf = (iso) => noon(iso).getUTCDay();

export const daysBetween = (from, to) =>
  Math.round((noon(to) - noon(from)) / 864e5);

export const shortDate = (iso) =>
  `${Number(iso.slice(8, 10))} ${MONTHS[Number(iso.slice(5, 7)) - 1]}`;

// "09:30" → 570 minutos desde la medianoche
export const toMinutes = (hhmm) =>
  Number(hhmm.slice(0, 2)) * 60 + Number(hhmm.slice(3, 5));

// "2026-10-16T16:46:35-06:00" → 1006
export const minutesOf = (iso) => toMinutes(iso.slice(11, 16));

// 570 → "9:30"
export const clock = (minutes) =>
  `${Math.floor(minutes / 60)}:${String(minutes % 60).padStart(2, "0")}`;

// Hora del visitante para los mensajes del chat ("16:46")
export const timeNow = () =>
  new Date().toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

// Rangos abiertos de un día en minutos: [[540, 840], [900, 1140]]
export const openRanges = (horario, iso) =>
  (horario?.[DAY_NAMES[weekdayOf(iso)]] ?? []).map(([from, to]) => [
    toMinutes(from),
    toMinutes(to),
  ]);

// Primera apertura y último cierre de la semana, redondeados a la hora
export const openingHours = (horario) => {
  const ranges = Object.values(horario ?? {}).flat();
  if (ranges.length === 0) return [9 * 60, 19 * 60];
  const first = Math.min(...ranges.map(([from]) => toMinutes(from)));
  const last = Math.max(...ranges.map(([, to]) => toMinutes(to)));
  return [Math.floor(first / 60) * 60, Math.ceil(last / 60) * 60];
};

// Horario resumido por grupos de días iguales: "Lun–Vie 9:00–14:00 · 15:00–19:00"
const ORDER = DAY_NAMES.slice(1).concat(DAY_NAMES[0]);
const SHORT = {
  lunes: "Lun",
  martes: "Mar",
  miércoles: "Mié",
  jueves: "Jue",
  viernes: "Vie",
  sábado: "Sáb",
  domingo: "Dom",
};

export const scheduleSummary = (horario) => {
  const groups = [];
  for (const day of ORDER) {
    const ranges = horario?.[day] ?? [];
    const key = JSON.stringify(ranges);
    const last = groups.at(-1);
    if (last && last.key === key) last.to = day;
    else groups.push({ key, from: day, to: day, ranges });
  }
  return groups.map((group) => ({
    days:
      group.from === group.to
        ? SHORT[group.from]
        : `${SHORT[group.from]}–${SHORT[group.to]}`,
    hours: group.ranges.length
      ? group.ranges.map(([from, to]) => `${from}–${to}`).join(" · ")
      : "Cerrado",
  }));
};
