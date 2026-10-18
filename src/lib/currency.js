/* Moneda de la calculadora. Se usa la que eligió el visitante; si nunca
   eligió, la del idioma (pesos en español, dólares en inglés), salvo que en
   español se ve en dólares desde fuera de México: así quien escribe desde
   Bogotá, Madrid o Miami no tiene que convertir pesos. */

export const CURRENCIES = ["MXN", "USD"];
const CURRENCY_KEY = "currency";

// Zonas horarias de México (base de datos IANA)
const MEXICO =
  /^America\/(Mexico_City|Monterrey|Merida|Cancun|Matamoros|Chihuahua|Ciudad_Juarez|Ojinaga|Mazatlan|Bahia_Banderas|Hermosillo|Tijuana)$/;

const inMexico = () => {
  try {
    return MEXICO.test(Intl.DateTimeFormat().resolvedOptions().timeZone);
  } catch {
    return true; // Sin zona horaria: se queda la moneda del idioma
  }
};

/** La moneda con la que empieza la calculadora; `preferred` es la del idioma. */
export const startingCurrency = (preferred) => {
  try {
    const saved = localStorage.getItem(CURRENCY_KEY);
    if (CURRENCIES.includes(saved)) return saved;
  } catch {
    // Sin almacenamiento (modo privado): se decide por la zona horaria
  }
  if (preferred === "MXN" && !inMexico()) return "USD";
  return preferred;
};

export const rememberCurrency = (code) => {
  try {
    localStorage.setItem(CURRENCY_KEY, code);
  } catch {
    // Sin almacenamiento: solo no se recuerda
  }
};
