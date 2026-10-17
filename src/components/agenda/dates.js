/* Fechas y horas de la demo de AgendaFlow. Todo se maneja como texto
   ("AAAA-MM-DD", "HH:MM") en la hora de la clínica que manda el backend, así
   no depende de la zona horaria del visitante. Los nombres que se muestran
   (días, meses) vienen de DATES, en src/content, según el idioma. */

// Llaves del horario que manda el backend: en español en los dos idiomas
export const DAY_NAMES = [
  "domingo",
  "lunes",
  "martes",
  "miércoles",
  "jueves",
  "viernes",
  "sábado",
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

// "2026-10-22" → "22 oct" / "Oct 22"
export const shortDate = (iso, dates) =>
  dates.shortDate(
    Number(iso.slice(8, 10)),
    dates.months[Number(iso.slice(5, 7)) - 1],
  );

// "09:30" → 570 minutos desde la medianoche
export const toMinutes = (hhmm) =>
  Number(hhmm.slice(0, 2)) * 60 + Number(hhmm.slice(3, 5));

// "2026-10-16T16:46:35-06:00" → 1006
export const minutesOf = (iso) => toMinutes(iso.slice(11, 16));

// 570 → "9:30"
export const clock = (minutes) =>
  `${Math.floor(minutes / 60)}:${String(minutes % 60).padStart(2, "0")}`;

// Hora del visitante para los mensajes del chat ("16:46")
export const timeNow = (locale) =>
  new Date().toLocaleTimeString(locale, {
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
// (de lunes a domingo; dates.days trae los nombres cortos en ese orden)
const ORDER = DAY_NAMES.slice(1).concat(DAY_NAMES[0]);

export const scheduleSummary = (horario, dates, closed) => {
  const groups = [];
  ORDER.forEach((day, index) => {
    const ranges = horario?.[day] ?? [];
    const key = JSON.stringify(ranges);
    const last = groups.at(-1);
    if (last && last.key === key) last.to = index;
    else groups.push({ key, from: index, to: index, ranges });
  });
  return groups.map((group) => ({
    days:
      group.from === group.to
        ? dates.days[group.from]
        : `${dates.days[group.from]}–${dates.days[group.to]}`,
    hours: group.ranges.length
      ? group.ranges.map(([from, to]) => `${from}–${to}`).join(" · ")
      : closed,
  }));
};
