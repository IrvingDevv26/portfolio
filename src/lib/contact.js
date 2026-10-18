import { BOOKING_URL, WHATSAPP } from "../content/contact";

/* Enlaces de contacto directo. Los textos de cada mensaje están en
   WHATSAPP_MESSAGES (src/content/es.js y en.js) y los datos, en
   src/content/contact.js. */

export const hasWhatsApp = /^\d{10,15}$/.test(WHATSAPP);
export const hasBooking = /^https:\/\//.test(BOOKING_URL);

/** Chat de WhatsApp con el mensaje ya escrito (el visitante solo lo envía). */
export const whatsappUrl = (text) =>
  `https://wa.me/${WHATSAPP}${text ? `?text=${encodeURIComponent(text)}` : ""}`;

export const bookingUrl = BOOKING_URL;
