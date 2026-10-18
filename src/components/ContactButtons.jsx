import {
  bookingUrl,
  hasBooking,
  hasWhatsApp,
  whatsappUrl,
} from "../lib/contact";
import { useContent } from "../lib/i18n";
import { btn } from "../lib/ui";
import { CalendarIcon, WhatsappIcon } from "./icons";

/* Contacto directo: WhatsApp con un mensaje ya escrito según la página
   (`topic`, una llave de WHATSAPP_MESSAGES) y la llamada de 15 minutos en
   Cal.com. Sin número o sin agenda configurados (src/content/contact.js), el
   botón correspondiente no se muestra. */

export const WhatsAppButton = ({
  topic = "general",
  variant = "whatsapp",
  size = "md",
  label,
  className = "",
}) => {
  const { UI, WHATSAPP_MESSAGES } = useContent();
  if (!hasWhatsApp) return null;
  return (
    <a
      href={whatsappUrl(WHATSAPP_MESSAGES[topic] ?? WHATSAPP_MESSAGES.general)}
      target="_blank"
      rel="noopener noreferrer"
      className={`${btn(variant, size)} ${className}`}
    >
      <WhatsappIcon
        className={`${size === "sm" ? "h-4 w-4" : "h-[18px] w-[18px]"} ${
          variant === "whatsapp" ? "" : "text-[#25D366]"
        }`}
      />
      {label ??
        (size === "sm" ? UI.contact.whatsappShort : UI.contact.whatsapp)}
    </a>
  );
};

export const BookingButton = ({ size = "md", label, className = "" }) => {
  const { UI } = useContent();
  if (!hasBooking) return null;
  return (
    <a
      href={bookingUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`${btn("secondary", size)} ${className}`}
    >
      <CalendarIcon
        className={size === "sm" ? "h-4 w-4" : "h-[18px] w-[18px]"}
      />
      {label ?? UI.contact.booking}
    </a>
  );
};

/** WhatsApp y agenda juntos; no ocupa espacio si ninguno está configurado. */
const ContactButtons = ({ topic, size = "md", className = "" }) =>
  hasWhatsApp || hasBooking ? (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      <WhatsAppButton topic={topic} size={size} />
      <BookingButton size={size} />
    </div>
  ) : null;

export default ContactButtons;
