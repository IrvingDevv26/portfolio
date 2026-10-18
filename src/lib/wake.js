/* Los servidores de las demos (plan gratuito de Render) se duermen tras 15
   minutos sin uso y tardan cerca de un minuto en despertar. Al abrir la
   portada o una página para pymes se les manda un ping, una vez por visita:
   cuando el visitante llega a la demo, el servidor ya está despierto. */

const APIS = [
  import.meta.env.VITE_API_URL,
  import.meta.env.VITE_AGENDA_API_URL,
].filter(Boolean);
const KEY = "demos-woken";

export const wakeDemos = () => {
  if (import.meta.env.DEV) return; // en local las APIs se arrancan a mano
  try {
    if (sessionStorage.getItem(KEY)) return;
    sessionStorage.setItem(KEY, "1");
  } catch {
    // Sin almacenamiento: se despiertan igual, solo puede repetirse
  }
  for (const api of APIS) {
    fetch(`${api}/api/health`, { cache: "no-store" }).catch(() => {});
  }
};
