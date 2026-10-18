/* ──────────────────────────────────────────────────────────────
   PÁGINAS POR TIPO DE CLIENTE (/contadores y /consultorios).
   Solo existen en español: son para pymes en México. El selector de
   idioma lleva desde aquí a la portada en inglés.

   widget: animación de la página ("invoice" de FacturaCheck o "agent"
   de AgendaFlow). video: enlace de Loom o YouTube; sin enlace, el botón
   no aparece. topic: mensaje de WhatsApp (WHATSAPP_MESSAGES en es.js).
   Si cambias un precio, cámbialo también en PRICING y en FAQ (es.js).
   ────────────────────────────────────────────────────────────── */

export const CLIENT_PAGES = {
  contadores: {
    title: "Revisión de facturas CFDI para despachos contables · Irving Dávila",
    eyebrow: "Para despachos contables",
    heading:
      "Encuentra las facturas canceladas antes de que el SAT te rechace la deducción.",
    highlight: ["canceladas"],
    lead: "Revisar los CFDI de cada cliente uno por uno en el portal del SAT se come días del cierre. FacturaCheck consulta todas las facturas del mes en minutos y te dice cuáles necesitan tu atención.",
    topic: "contadores",
    demo: { to: "/demo/cfdi", label: "Probar con facturas de ejemplo" },
    facts: [
      "Consulta oficial del SAT",
      "CFDI 4.0 y 3.3",
      "Excel listo para el cierre",
    ],
    problemTitle: "Lo que pasa hoy en el cierre",
    problems: [
      {
        title: "Horas en el portal",
        text: "Descargar, abrir y verificar cada factura en el SAT, cliente por cliente, mes con mes.",
      },
      {
        title: "Canceladas que se cuelan",
        text: "Una factura cancelada después del pago termina en una deducción rechazada y en aclaraciones.",
      },
      {
        title: "Proveedores de riesgo",
        text: "Un emisor en la lista 69-B del SAT pone en riesgo la deducción y te obliga a demostrar la operación.",
      },
    ],
    demoTitle: "Así se ve la revisión",
    demoText:
      "Subes los XML o el ZIP que descargas del SAT. Cada factura se consulta en el servicio oficial y recibes un Excel con las alertas, los totales de IVA e ISR y el detalle por RFC.",
    widget: "invoice",
    video: "", // Loom del recorrido de FacturaCheck
    videoLabel: "Ver el recorrido en video",
    offerTitle: "Lo que puedo instalar en tu despacho",
    offer: [
      "Descarga automática de los CFDI de tus clientes desde el SAT, con su e.firma",
      "Revisión mensual en automático: canceladas, no registradas, lista 69-B y duplicadas",
      "Un Excel por cliente y un aviso por correo o WhatsApp cuando algo necesita atención",
      "Tus reglas de deducibilidad y el formato de reporte que ya usas",
    ],
    price: {
      label: "Precio de entrada",
      from: "Desde $5,000 MXN",
      extra: "de instalación + desde $900 MXN al mes",
      note: "La mensualidad cubre el servidor, las consultas al SAT y el soporte. El precio final depende de cuántos RFC revises al mes.",
    },
    privacyTitle: "Tus datos y los de tus clientes",
    privacy: [
      "La revisión no usa IA: las facturas solo se consultan en el SAT, con los mismos datos que trae su código QR.",
      "En tu versión, los archivos se quedan en tu servidor o en uno dedicado a tu despacho, nunca compartido.",
      "Puedo firmar un convenio de confidencialidad y te doy el aviso de privacidad para tus clientes.",
    ],
    faqTitle: "Preguntas de contadores",
    faq: [
      {
        q: "¿Tengo que instalar algo?",
        a: "No. Lo usas desde el navegador o te llega el Excel por correo; yo me encargo del servidor.",
      },
      {
        q: "¿Funciona con la e.firma de mis clientes?",
        a: "Sí. La descarga masiva del SAT pide la e.firma de cada RFC; se guarda cifrada y solo se usa para descargar sus facturas.",
      },
      {
        q: "¿Puedo probarlo antes de contratar?",
        a: "Sí. La demo acepta tus propios XML y te devuelve el Excel en segundos. Los archivos no se guardan.",
      },
    ],
    ctaTitle: "¿Lo probamos con las facturas de un cliente?",
    ctaText:
      "Escríbeme por WhatsApp o agenda 15 minutos y lo vemos con tus archivos.",
  },

  consultorios: {
    title: "Agente de citas por WhatsApp para consultorios · Irving Dávila",
    eyebrow: "Para consultorios y clínicas",
    heading: "Tu WhatsApp agenda citas solo, aunque estés con un paciente.",
    highlight: ["solo,"],
    lead: "Un asistente con IA contesta por WhatsApp, ofrece solo horarios libres, agenda, cambia y cancela citas y te deja todo en tu agenda. Tú solo atiendes.",
    topic: "consultorios",
    demo: { to: "/demo/agenda", label: "Probar el agente" },
    facts: [
      "Contesta a toda hora",
      "Sin choques de horario",
      "Recordatorio un día antes",
    ],
    problemTitle: "Lo que pasa hoy en tu consultorio",
    problems: [
      {
        title: "Mensajes a toda hora",
        text: "Contestar para agendar interrumpe consultas, y lo que llega de noche se queda sin respuesta.",
      },
      {
        title: "Citas que chocan",
        text: "Un error al anotar termina en dos pacientes a la misma hora o en huecos que nadie ocupa.",
      },
      {
        title: "Pacientes que no llegan",
        text: "Sin recordatorio, parte de las citas no se presenta y ese espacio se pierde.",
      },
    ],
    demoTitle: "Así conversa con tus pacientes",
    demoText:
      "Entiende «el jueves en la tarde», consulta tu agenda real y confirma con un código. Si algo no se puede, lo explica y propone otra opción. Las reglas las revisa el sistema, no la IA.",
    widget: "agent",
    video: "", // video del agente funcionando dentro de WhatsApp (60–90 s)
    videoLabel: "Ver el agente en WhatsApp",
    offerTitle: "Lo que instalo en tu consultorio",
    offer: [
      "Tu número de WhatsApp Business conectado al agente",
      "Tus servicios, precios, horarios y reglas (anticipación, días de descanso)",
      "Sincronización con Google Calendar o con tu sistema de citas",
      "Recordatorio y confirmación un día antes de cada cita",
    ],
    price: {
      label: "Precio de entrada",
      from: "Desde $7,500 MXN",
      extra: "de instalación + desde $1,200 MXN al mes",
      note: "La mensualidad cubre el servidor, la IA de pago y el soporte. Los recordatorios de WhatsApp tienen un costo pequeño por mensaje que cobra Meta.",
    },
    privacyTitle: "Tus datos y los de tus pacientes",
    privacy: [
      "Con pacientes reales uso el plan de pago de la IA, cuyos términos no permiten usar las conversaciones para entrenar modelos. La demo usa el plan gratuito; por eso pide datos inventados.",
      "El agente solo pide nombre, teléfono y servicio: no pregunta datos de salud.",
      "La agenda y las conversaciones viven en un servidor dedicado a tu consultorio, con el aviso de privacidad para tus pacientes.",
    ],
    faqTitle: "Preguntas de consultorios",
    faq: [
      {
        q: "¿Funciona con mi número de WhatsApp?",
        a: "Sí. Se conecta a la plataforma oficial de WhatsApp Business; en la llamada te explico las opciones para tu número.",
      },
      {
        q: "¿Y si el paciente quiere hablar con una persona?",
        a: "El agente puede avisarte para que tú contestes, y tú puedes tomar la conversación cuando quieras.",
      },
      {
        q: "¿Cuánto tarda en estar listo?",
        a: "Una o dos semanas: primero tus servicios y horarios, luego pruebas con tu equipo y al final lo conectamos a tu WhatsApp.",
      },
    ],
    ctaTitle: "¿Lo vemos funcionando con tus horarios?",
    ctaText:
      "Escríbeme por WhatsApp o agenda 15 minutos y lo configuramos con un servicio de tu consultorio.",
  },
};

// Rutas de las páginas que solo existen en español
export const SPANISH_ONLY = ["/contadores", "/consultorios"];
