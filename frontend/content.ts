/**
 * Contenido editable del proyecto Tlacotalpan 149.
 */
export const site = {
  brand: "Tlacotalpan 149",
  tagline: "La Roma",
  title: "Tlacotalpan 149 — La Roma, Ciudad de México",
  description:
    "Una colección íntima de residencias en el corazón de la Roma.",
} as const;

export const nav = {
  links: [
    { label: "El lugar", href: "#lugar" },
    { label: "Planos", href: "#planos" },
    { label: "Recorridos", href: "#recorridos" },
    { label: "Contacto", href: "#contacto" },
  ],
} as const;

export const hero = {
  location: "La Roma · Ciudad de México",
  brand: "Tlacotalpan 149",
  support:
    "Una colección íntima de residencias en el corazón de la Roma.",
  cta: { label: "Explora proyecto", href: "#intro" },
  plan: {
    src: "/planos/planta-estacionamiento-overlay.png",
    alt: "Planta de estacionamiento Tlacotalpan 149",
  },
} as const;

export const intro = {
  id: "intro",
  title: "Tlacotalpan 149",
  body: "Desarrollo residencial boutique en el corazón de Roma Sur, diseñado para quienes valoran la arquitectura, la privacidad y la calidad de vida. Con solo ocho unidades entre residencias y estudios, cada espacio fue concebido para aprovechar la luz natural, extender la vida hacia el exterior y ofrecer una experiencia de vivienda contemporánea en una de las colonias con mayor riqueza cultural de la Ciudad de México.",
} as const;

export const place = {
  id: "lugar",
  title: "Tlacotalpan 149,",
  titleLine2: "Roma Sur",
  subtitle: "Ciudad de México · CP 06760",
  body: [
    "Vivir en Roma Sur significa estar rodeado de cultura, gastronomía y espacios verdes, sin renunciar a la tranquilidad de un entorno residencial. Tlacotalpan 149 se encuentra en una de las zonas con mayor valor urbano de la Ciudad de México, con acceso inmediato a parques, cafeterías, galerías, restaurantes y una amplia oferta cultural que hacen de cada recorrido una extensión de tu hogar.",
    "Ubicado en Roma Sur, Tlacotalpan 149 conecta con parques, espacios culturales, gastronomía, servicios y transporte, manteniendo la tranquilidad de una zona residencial.",
  ],
  video: {
    src: "/videos/TL149_FC_FACHADA_DIANOCHE.mp4",
    alt: "Fachada de Tlacotalpan 149, de día a noche",
  },
} as const;

export const spaces = {
  id: "espacios",
  eyebrow: "Espacios",
  headline: "Lo esencial, bien resuelto.",
  items: [
    {
      title: "Estar",
      body: "Dobles alturas y aberturas generosas. El día entra sin esfuerzo.",
    },
    {
      title: "Privacidad",
      body: "Recámaras apartadas del flujo social, con su propia luz y terraza.",
    },
    {
      title: "Exterior",
      body: "Terrazas y jardín como extensión natural de la planta baja.",
    },
  ],
  image: {
    src: "/renders/TL149_D201_202_COCINA.jpg",
    alt: "Espacio interior de Tlacotalpan 149",
  },
} as const;

export const plans = {
  id: "planos",
  eyebrow: "Programa arquitectónico",
  label: "Tipologías",
  items: [
    {
      title: "Semisótano",
      src: "/planos/viewer/sheet/plan-00.png",
      width: 878,
      height: 400,
    },
    {
      title: "Depto 102",
      src: "/planos/viewer/sheet/plan-01.png",
      width: 595,
      height: 253,
    },
    {
      title: "Depto 101",
      src: "/planos/viewer/sheet/plan-02.png",
      width: 595,
      height: 169,
    },
    {
      title: "Townhouses 201 y 202 — Nivel 2",
      src: "/planos/viewer/sheet/plan-03.png",
      width: 627,
      height: 212,
    },
    {
      title: "Townhouses 201 y 202 — Nivel 3",
      src: "/planos/viewer/sheet/plan-04.png",
      width: 626,
      height: 211,
    },
    {
      title: "Townhouses 201 y 202 — Roof garden",
      src: "/planos/viewer/sheet/plan-05.png",
      width: 379,
      height: 214,
    },
  ],
} as const;

export const progress = {
  id: "avance",
  left: "Avance de",
  right: "La obra",
  percent: 75,
} as const;

export const isometric = {
  id: "isometrico",
  full: {
    src: "/isometricos/iso-general.webp",
    alt: "Isométrico general de Tlacotalpan 149 con contexto urbano",
  },
  cut: {
    src: "/isometricos/iso-general-01.webp",
    alt: "Isométrico de Tlacotalpan 149",
  },
} as const;

export const facade = {
  id: "fachada",
  video: {
    src: "/videos/VIDEO_FINAL.mp4",
    poster: "/videos/VIDEO_FINAL_last.jpg",
    alt: "Recorrido hacia la fachada de Tlacotalpan 149",
  },
  hotspots: [
    {
      id: "townhouse-201",
      label: "Townhouse 201",
      unitId: "townhouse-201",
      x: 40,
      y: 30,
    },
    {
      id: "townhouse-202",
      label: "Townhouse 202",
      unitId: "townhouse-202",
      x: 58,
      y: 28,
    },
    {
      id: "depto-102",
      label: "Depto 102",
      unitId: "depto-102",
      x: 42,
      y: 48,
    },
    {
      id: "depto-101",
      label: "Depto 101",
      unitId: "depto-101",
      x: 57,
      y: 50,
    },
  ],
} as const;

/** Espacios 360 del depto / townhouse 201–202 (assets actuales). */
const spaces201_202 = [
  {
    id: "fachada",
    title: "Fachada",
    src: "/360renders/TL149_EXTERIOR_FACHADA.png",
    // Azimut en radianes. 0 mira a -Z (u≈0.75). La fachada queda en u≈0.52.
    yaw: (0.75 - 0.52) * Math.PI * 2,
  },
  {
    id: "estudio",
    title: "Estudio",
    src: "/360renders/TL149_ESTACIONAMIENTO_ESTUDIO.jpg",
    yaw: (0.75 - 0.52) * Math.PI * 2,
  },
  {
    id: "sala-comedor",
    title: "Sala comedor",
    src: "/360renders/TL149_D201_202_SALA COMEDOR.png",
    yaw: (0.75 - 0.52) * Math.PI * 2,
  },
  {
    id: "cocina",
    title: "Cocina",
    src: "/360renders/TL149_D201_202_COCINA.jpg",
    yaw: (0.75 - 0.52) * Math.PI * 2,
  },
  {
    id: "sala-tv",
    title: "Sala TV",
    src: "/360renders/TL149_D201_202_SALA TV.png",
    yaw: (0.75 - 0.52) * Math.PI * 2,
  },
  {
    id: "recamara-01",
    title: "Habitación principal",
    src: "/360renders/TL149_D201_202_RECAMARA 01.jpg",
    yaw: (0.75 - 0.52) * Math.PI * 2,
  },
  {
    id: "bano",
    title: "Baño",
    src: "/360renders/TL149_D201_202_BAÑO REC. PRINCIPAL.png",
    yaw: (0.75 - 0.52) * Math.PI * 2,
  },
  {
    id: "recamara-02",
    title: "Recámara 02",
    src: "/360renders/TL149_D201_202_RECAMARA 02.jpg",
    yaw: (0.75 - 0.52) * Math.PI * 2,
  },
  {
    id: "roof-garden",
    title: "Roof garden",
    src: "/360renders/TL149_D201_202_ROOF GARDEN.jpg",
    yaw: (0.75 - 0.52) * Math.PI * 2,
  },
] as const;

const spacesDepto101 = [
  spaces201_202[0], // Fachada
  spaces201_202[5], // Recámara principal
  spaces201_202[6], // Baño
  spaces201_202[2], // Sala comedor
  spaces201_202[3], // Cocina
] as const;

const spacesDepto102 = [
  spaces201_202[0], // Fachada
  spaces201_202[5], // Recámara principal
  spaces201_202[7], // Recámara 02
  spaces201_202[6], // Baño
  spaces201_202[2], // Sala comedor
  spaces201_202[3], // Cocina
] as const;

const visitCta = { label: "Agenda visita", href: "#contacto" } as const;

const depto101Features = [
  "1 recámara",
  "1 baño completo",
  "Cocina, Sala, Comedor",
  "Bodega, Closet de lavado",
  "Interior: 55.80 m²",
  "Exterior: 5.20 m²",
  "✓ Terraza Privada",
] as const;

const depto102Features = [
  "2 recámaras",
  "2 baños completos",
  "Cocina, Sala, Comedor",
  "Bodega, Closet de lavado",
  "Interior: 69.00 m²",
  "Exterior: 5.20 m²",
  "✓ Terraza Privada",
] as const;

const townhouseFeatures = [
  "3 recámaras",
  "3 baños completos",
  "Cocina, Sala, Comedor",
  "Vestidor, Cuarto de lavado",
  "Balcones, Bodega",
  "Interior: 148.80 m²",
  "Exterior: 28.20 m²",
  "✓ Terraza",
  "✓ Roof Garden Privado",
  "✓ Sala de TV",
] as const;

const townhouseIsometricStack = [
  {
    src: "/isometricos/TL149_N2_DEPA.png",
    alt: "Primer nivel Townhouse 201-202",
    label: "Nivel 1",
    stack: { x: 0, y: 0 },
  },
  {
    src: "/isometricos/TL149_N3_DEPA.png",
    alt: "Segundo nivel Townhouse 201-202",
    label: "Nivel 2",
    stack: { x: -2.6, y: -20.5 },
  },
  {
    src: "/isometricos/TL149_ROOF_DEPA.png",
    alt: "Roof garden Townhouse 201-202",
    label: "Roof garden",
    stack: { x: -2.6, y: -41 },
  },
] as const;

const townhousePlans = [
  {
    src: "/planos/viewer/sheet/plan-03.png",
    alt: "Planta nivel 2 — townhouses 201 y 202",
    label: "Nivel 2",
    width: 627,
    height: 212,
  },
  {
    src: "/planos/viewer/sheet/plan-04.png",
    alt: "Planta nivel 3 — townhouses 201 y 202",
    label: "Nivel 3",
    width: 626,
    height: 211,
  },
] as const;

const unitSpecs = {
  "depto-101": {
    title: "Depto 101",
    label: "Depto 101",
    compareFeatures: depto101Features,
    isometric: {
      image: {
        src: "/isometricos/TL149_N1_DEPA.png",
        alt: "Isométrico Depto 101",
      },
      interior: "55.80 m²",
      exterior: "5.20 m²",
      rooms: ["1 Recámara", "1 Baño Completo"],
      amenities: [
        "Cocina",
        "Comedor",
        "Terraza Privada",
        "Bodega",
        "Closet de lavado",
      ],
      status: "Disponible",
    },
    sheet: {
      summary: [
        "55.80 m² habitables + 5.20 m² terraza/área descubierta",
        "• 1 recámara • 1 baño completo • cocina • comedor • sala de estar",
      ],
      stats: [
        { label: "Habitable", value: "55.80 m²" },
        { label: "Terraza", value: "5.20 m²" },
        { label: "Recámaras", value: "1" },
      ],
      highlights: [
        "Cocina",
        "Comedor",
        "Sala de estar",
        "Cuarto de lavado",
        "Terraza",
      ],
    },
    plan: {
      src: "/planos/viewer/sheet/plan-02.png",
      alt: "Planta departamento 101",
      width: 595,
      height: 169,
    },
  },
  "depto-102": {
    title: "Depto 102",
    label: "Depto 102",
    compareFeatures: depto102Features,
    isometric: {
      image: {
        src: "/isometricos/TL149_N1_DEPA_2.png",
        alt: "Isométrico Depto 102",
      },
      interior: "69.00 m²",
      exterior: "5.20 m²",
      rooms: ["2 Recámaras", "2 Baños Completos"],
      amenities: [
        "Cocina",
        "Comedor",
        "Terraza Privada",
        "Bodega",
        "Closet de lavado",
      ],
      status: "Disponible",
    },
    sheet: {
      summary: [
        "69.00 m² habitables + 5.20 m² terraza/área descubierta",
        "• 2 recámaras • 2 baños completos • cocina • comedor • sala de estar",
      ],
      stats: [
        { label: "Habitable", value: "69.00 m²" },
        { label: "Terraza", value: "5.20 m²" },
        { label: "Recámaras", value: "2" },
      ],
      highlights: [
        "Cocina",
        "Comedor",
        "Sala de estar",
        "Cuarto de lavado",
        "Terraza",
      ],
    },
    plan: {
      src: "/planos/viewer/sheet/plan-01.png",
      alt: "Planta departamento 102",
      width: 595,
      height: 253,
    },
  },
  "townhouse-201": {
    title: "Town House 201",
    label: "Townhouse 201",
    compareFeatures: townhouseFeatures,
    isometric: {
      images: townhouseIsometricStack,
      interior: "148.80 m²",
      exterior: "28.20 m²",
      rooms: ["3 Recámaras", "3 Baños Completos"],
      amenities: [
        "Cocina",
        "Comedor",
        "Vestidor",
        "Terraza",
        "Roof Garden",
        "Sala de TV",
      ],
      status: "Disponible",
    },
    sheet: {
      summary: [
        "148.80 m² habitables + 28.20 m² terraza/área descubierta",
        "• 3 recámaras • 3 baños completos • cocina • comedor • sala de estar",
      ],
      stats: [
        { label: "Habitable", value: "148.80 m²" },
        { label: "Terraza", value: "28.20 m²" },
        { label: "Recámaras", value: "3" },
      ],
      highlights: [
        "Vestidor",
        "Cuarto de lavado",
        "Balcones",
        "Bodega",
        "Terraza",
        "Roof Garden",
        "Sala de TV",
      ],
    },
    plan: townhousePlans[0],
    plans: townhousePlans,
  },
  "townhouse-202": {
    title: "Town House 202",
    label: "Townhouse 202",
    compareFeatures: townhouseFeatures,
    isometric: {
      images: townhouseIsometricStack,
      interior: "148.80 m²",
      exterior: "28.20 m²",
      rooms: ["3 Recámaras", "3 Baños Completos"],
      amenities: [
        "Cocina",
        "Comedor",
        "Vestidor",
        "Terraza",
        "Roof Garden",
        "Sala de TV",
      ],
      status: "Disponible",
    },
    sheet: {
      summary: [
        "148.80 m² habitables + 28.20 m² terraza/área descubierta",
        "• 3 recámaras • 3 baños completos • cocina • comedor • sala de estar",
      ],
      stats: [
        { label: "Habitable", value: "148.80 m²" },
        { label: "Terraza", value: "28.20 m²" },
        { label: "Recámaras", value: "3" },
      ],
      highlights: [
        "Vestidor",
        "Cuarto de lavado",
        "Balcones",
        "Bodega",
        "Terraza",
        "Roof Garden",
        "Sala de TV",
      ],
    },
    plan: townhousePlans[0],
    plans: townhousePlans,
  },
} as const;

export const unitIsometrics = {
  id: "isometrico",
  units: [
    {
      id: "depto-101",
      label: unitSpecs["depto-101"].label,
      title: unitSpecs["depto-101"].title,
      ...unitSpecs["depto-101"].isometric,
    },
    {
      id: "depto-102",
      label: unitSpecs["depto-102"].label,
      title: unitSpecs["depto-102"].title,
      ...unitSpecs["depto-102"].isometric,
    },
    {
      id: "townhouse-201",
      label: unitSpecs["townhouse-201"].label,
      title: unitSpecs["townhouse-201"].title,
      ...unitSpecs["townhouse-201"].isometric,
    },
    {
      id: "townhouse-202",
      label: unitSpecs["townhouse-202"].label,
      title: unitSpecs["townhouse-202"].title,
      ...unitSpecs["townhouse-202"].isometric,
    },
  ],
} as const;

export const panoramas = {
  id: "recorridos",
  brandSide: "Tlacotalpan 149",
  compare: { label: "Compara", href: "#compara" },
  units: [
    {
      id: "depto-101",
      label: unitSpecs["depto-101"].label,
      spaces: spacesDepto101,
      sheet: {
        title: unitSpecs["depto-101"].title,
        ...unitSpecs["depto-101"].sheet,
        cta: visitCta,
        plan: unitSpecs["depto-101"].plan,
      },
    },
    {
      id: "depto-102",
      label: unitSpecs["depto-102"].label,
      spaces: spacesDepto102,
      sheet: {
        title: unitSpecs["depto-102"].title,
        ...unitSpecs["depto-102"].sheet,
        cta: visitCta,
        plan: unitSpecs["depto-102"].plan,
      },
    },
    {
      id: "townhouse-201",
      label: unitSpecs["townhouse-201"].label,
      spaces: spaces201_202,
      sheet: {
        title: unitSpecs["townhouse-201"].title,
        ...unitSpecs["townhouse-201"].sheet,
        cta: visitCta,
        plan: unitSpecs["townhouse-201"].plan,
        plans: unitSpecs["townhouse-201"].plans,
      },
    },
    {
      id: "townhouse-202",
      label: unitSpecs["townhouse-202"].label,
      spaces: spaces201_202,
      sheet: {
        title: unitSpecs["townhouse-202"].title,
        ...unitSpecs["townhouse-202"].sheet,
        cta: visitCta,
        plan: unitSpecs["townhouse-202"].plan,
        plans: unitSpecs["townhouse-202"].plans,
      },
    },
  ],
} as const;

export const compare = {
  id: "compara",
  title: "Sigue explorando Tlacotalpan 149",
  items: [
    {
      id: "depto-101",
      title: unitSpecs["depto-101"].title,
      unitId: "depto-101",
      image: {
        src: "/isometricos/TL149_N1_DEPA.png",
        alt: "Isométrico Depto 101",
      },
      features: unitSpecs["depto-101"].compareFeatures,
    },
    {
      id: "depto-102",
      title: unitSpecs["depto-102"].title,
      unitId: "depto-102",
      image: {
        src: "/isometricos/TL149_N1_DEPA_2.png",
        alt: "Isométrico Depto 102",
      },
      features: unitSpecs["depto-102"].compareFeatures,
    },
    {
      id: "townhouse",
      title: "Townhouse 201-202",
      unitId: "townhouse-201",
      images: townhouseIsometricStack,
      features: townhouseFeatures,
    },
  ],
  tourCta: "Ver recorrido",
  visitCta: visitCta.label,
  visitHref: visitCta.href,
} as const;

const contactEmail = "hola@ejemplo.com";

export const contact = {
  id: "contacto",
  headline: "Agenda una visita.",
  body: "Cuéntanos qué buscas. Te compartimos disponibilidad, planos y el siguiente paso.",
  cta: { label: "Escribirnos", href: `mailto:${contactEmail}` },
  note: "Reemplaza este correo y los textos en content.ts",
} as const;

export const privacy = {
  path: "/aviso-de-privacidad",
  label: "Aviso de privacidad",
  title: "Aviso de privacidad",
  eyebrow: "Información legal",
  metaDescription:
    "Aviso de privacidad de Tlacotalpan 149: qué datos recabamos, para qué los usamos y cómo ejercer tus derechos.",
  updatedLabel: "Última actualización",
  updated: "17 de agosto de 2026",
  backLabel: "Volver al proyecto",
  backHref: "/",
  lead:
    "Este aviso explica qué datos personales recabamos a través del sitio de Tlacotalpan 149, para qué los usamos y cómo puedes ejercer tus derechos. Lo publicamos para cumplir la legislación mexicana en materia de protección de datos personales.",
  responsable: {
    // Sustituir por la razón social de la persona moral responsable.
    identity:
      "la persona moral que desarrolla y comercializa el proyecto Tlacotalpan 149",
    address:
      "Tlacotalpan 149, Colonia Roma Sur, Alcaldía Cuauhtémoc, Ciudad de México, C.P. 06760",
    email: contactEmail,
  },
  sections: [
    {
      title: "Identidad y domicilio del responsable",
      paragraphs: [
        `El responsable del tratamiento de tus datos personales es la persona moral que desarrolla y comercializa el proyecto Tlacotalpan 149 (en adelante, el “Responsable”), con domicilio para oír y recibir notificaciones en Tlacotalpan 149, Colonia Roma Sur, Alcaldía Cuauhtémoc, Ciudad de México, C.P. 06760.`,
        `Para cualquier asunto relacionado con este aviso o con tus datos personales, puedes escribir a ${contactEmail}.`,
      ],
    },
    {
      title: "Datos personales que recabamos",
      paragraphs: [
        "Recabamos únicamente los datos necesarios para atender una solicitud de información o una visita al proyecto. No creamos cuentas de usuario ni pedimos datos sensibles (salud, biométricos, origen racial o étnico, creencias o afiliación política) como parte del sitio.",
      ],
      items: [
        "Datos de identificación y contacto: nombre, correo electrónico, teléfono y el contenido del mensaje que nos envíes.",
        "Datos de la solicitud: tipo de unidad de interés, disponibilidad, fechas de visita u otras precisiones que decidas compartir.",
        "Datos técnicos de navegación: dirección IP, tipo de navegador, páginas visitadas y fecha y hora de acceso, en la medida en que el hospedaje del sitio los registre para operar y proteger el servicio.",
      ],
      afterItems: [
        "Si nos escribes por correo e incluyes datos adicionales de forma voluntaria, los trataremos solo para la finalidad de esa comunicación.",
      ],
    },
    {
      title: "Finalidades del tratamiento",
      paragraphs: [
        "Las finalidades primarias —necesarias para la relación que solicitas— son:",
      ],
      items: [
        "Atender solicitudes de información sobre Tlacotalpan 149, incluyendo disponibilidad, planos y condiciones comerciales.",
        "Agendar y confirmar visitas al inmueble.",
        "Dar seguimiento a la conversación que hayas iniciado.",
        "Cumplir obligaciones legales aplicables al Responsable.",
      ],
      afterItems: [
        "Las finalidades secundarias, que no son estrictamente necesarias para atender tu solicitud, son enviarte actualizaciones del proyecto (nuevas unidades, avances de obra o invitaciones) y elaborar estadísticas agregadas de uso del sitio para mejorar su contenido.",
        `Si no deseas que usemos tus datos para finalidades secundarias, indícalo al escribirnos o envía un correo a ${contactEmail} con el asunto “Límite de uso de datos”. La negativa no afectará la atención de tu solicitud principal.`,
      ],
    },
    {
      title: "Transferencias",
      paragraphs: [
        "No vendemos tus datos personales. Podemos compartirlos solo en estos casos:",
      ],
      items: [
        "Proveedores que nos ayudan a operar el sitio o el correo (hospedaje, mensajería), bajo obligaciones de confidencialidad y solo para el servicio contratado.",
        "Cuando lo exija una autoridad competente o una disposición legal.",
        "Si el proyecto o los derechos sobre este sitio se transmiten a otra entidad, quien asumirá este aviso o publicará uno equivalente.",
      ],
    },
    {
      title: "Derechos ARCO y revocación del consentimiento",
      paragraphs: [
        "Puedes acceder, rectificar, cancelar u oponerte al tratamiento de tus datos personales (derechos ARCO), así como revocar el consentimiento que hayas otorgado, en la medida que la ley lo permita.",
        `Para ejercerlos, envía un correo a ${contactEmail} con tu nombre completo, el derecho que solicitas, una descripción clara de tu petición y un documento que acredite tu identidad o representación. Si la solicitud no es clara o está incompleta, te lo haremos saber para que la completes.`,
        "Daremos respuesta en los plazos que establece la legislación mexicana vigente. Si consideras que tu derecho a la protección de datos ha sido vulnerado, puedes presentar una denuncia ante la autoridad mexicana competente.",
      ],
    },
    {
      title: "Cookies y tecnologías similares",
      paragraphs: [
        "Este sitio puede usar cookies o almacenamiento local estrictamente técnicos para funcionar (por ejemplo, preferencias de sesión o recursos que el navegador necesita para mostrar la página). No utilizamos cookies de publicidad ni perfiles de marketing de terceros.",
        "Puedes configurar tu navegador para bloquear o eliminar cookies. Si lo haces, algunas funciones del sitio podrían dejar de verse con normalidad.",
      ],
    },
    {
      title: "Conservación y medidas de seguridad",
      paragraphs: [
        "Conservamos tus datos solo durante el tiempo necesario para las finalidades descritas y, en su caso, durante los plazos legales de conservación o defensa de derechos.",
        "Aplicamos medidas administrativas, técnicas y físicas razonables para proteger los datos contra daño, pérdida, alteración o uso no autorizado, en función del tipo de información y de los medios con los que operamos este sitio.",
      ],
    },
    {
      title: "Cambios a este aviso",
      paragraphs: [
        "Cualquier cambio a este aviso se publicará en esta misma página, con la fecha de actualización visible. El uso continuado del sitio después de un cambio implica que conoces la versión vigente.",
        "Al navegar el sitio o al enviarnos datos de contacto, reconoces haber leído este aviso de privacidad.",
      ],
    },
  ],
} as const;

export const footer = {
  location: "La Roma · Ciudad de México",
  brand: site.brand,
  tagline: site.description,
  privacy: {
    label: privacy.label,
    href: privacy.path,
  },
} as const;
