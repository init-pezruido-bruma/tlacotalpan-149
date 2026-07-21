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
  body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
} as const;

export const place = {
  id: "lugar",
  title: "Tlacotalpan 149,",
  titleLine2: "Roma Sur",
  subtitle: "Ciudad de México · CP 06760",
  body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  image: {
    src: "/renders/TL149_D201_202_COCINA.jpg",
    alt: "Cocina y comedor de Tlacotalpan 149",
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

const planBody =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

export const plans = {
  id: "planos",
  eyebrow: "Programa arquitectónico",
  label: "Tipologías",
  items: [
    {
      title: "Semisótano",
      body: planBody,
      src: "/planos/viewer/plan-00.png",
      width: 1600,
      height: 1049,
    },
    {
      title: "Nivel 01 — Deptos. 101 y 102",
      body: planBody,
      src: "/planos/viewer/plan-01.png",
      width: 1600,
      height: 572,
    },
    {
      title: "Nivel 02 — Deptos. 101 y 102",
      body: planBody,
      src: "/planos/viewer/plan-02.png",
      width: 1600,
      height: 476,
    },
    {
      title: "Town houses 201 y 202 — Nivel 01",
      body: planBody,
      src: "/planos/viewer/plan-03.png",
      width: 1600,
      height: 333,
    },
    {
      title: "Town houses 201 y 202 — Nivel 02",
      body: planBody,
      src: "/planos/viewer/plan-04.png",
      width: 1600,
      height: 352,
    },
    {
      title: "Town houses 201 y 202 — Roof garden",
      body: planBody,
      src: "/planos/viewer/plan-05.png",
      width: 1600,
      height: 362,
    },
    {
      title: "Tipología A",
      body: planBody,
      src: "/planos/viewer/plan-06.png",
      width: 1600,
      height: 664,
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

const panoramaBody =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.";

const sheetBody =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

/** Espacios 360 del depto / townhouse 201–202 (assets actuales). */
const spaces201_202 = [
  {
    id: "fachada",
    title: "Fachada",
    body: panoramaBody,
    src: "/360renders/TL149_EXTERIOR_FACHADA.png",
  },
  {
    id: "estudio",
    title: "Estudio",
    body: panoramaBody,
    src: "/360renders/TL149_ESTACIONAMIENTO_ESTUDIO.jpg",
  },
  {
    id: "sala-comedor",
    title: "Sala comedor",
    body: panoramaBody,
    src: "/360renders/TL149_D201_202_SALA COMEDOR.png",
  },
  {
    id: "cocina",
    title: "Cocina",
    body: panoramaBody,
    src: "/360renders/TL149_D201_202_COCINA.jpg",
  },
  {
    id: "sala-tv",
    title: "Sala TV",
    body: panoramaBody,
    src: "/360renders/TL149_D201_202_SALA TV.png",
  },
  {
    id: "recamara-01",
    title: "Habitación principal",
    body: panoramaBody,
    src: "/360renders/TL149_D201_202_RECAMARA 01.jpg",
  },
  {
    id: "bano",
    title: "Baño",
    body: panoramaBody,
    src: "/360renders/TL149_D201_202_BAÑO REC. PRINCIPAL.png",
  },
  {
    id: "recamara-02",
    title: "Recámara 02",
    body: panoramaBody,
    src: "/360renders/TL149_D201_202_RECAMARA 02.jpg",
  },
  {
    id: "roof-garden",
    title: "Roof garden",
    body: panoramaBody,
    src: "/360renders/TL149_D201_202_ROOF GARDEN.jpg",
  },
] as const;

/** Comunes mientras llegan los 360 del 102. */
const spacesDepto102 = [
  spaces201_202[0],
  spaces201_202[1],
] as const;

export const panoramas = {
  id: "recorridos",
  brandSide: "Tlacotalpan 149",
  compare: { label: "Compara", href: "#compara" },
  units: [
    {
      id: "depto-102",
      label: "Depto 102",
      spaces: spacesDepto102,
      sheet: {
        title: "Depto 102",
        summary:
          "Departamento · 2 recámaras · 2 baños · terraza",
        stats: [
          { label: "Habitable", value: "86.4 m²" },
          { label: "Terraza", value: "12.0 m²" },
          { label: "Recámaras", value: "2" },
        ],
        body: sheetBody,
        cta: { label: "Agenda visita", href: "#contacto" },
        plan: {
          src: "/planos/viewer/plan-01.png",
          alt: "Planta nivel 01 — departamentos 101 y 102",
          width: 1600,
          height: 572,
        },
      },
    },
    {
      id: "townhouse-201",
      label: "Townhouse 201",
      spaces: spaces201_202,
      sheet: {
        title: "Town House 201",
        summary:
          "Town House triplex · 148.80 m² habitables + 28.20 m² terraza · 3 recámaras · 3 baños · roof garden privado",
        stats: [
          { label: "Habitable", value: "148.8 m²" },
          { label: "Terraza", value: "28.2 m²" },
          { label: "Recámaras", value: "3" },
        ],
        body: sheetBody,
        cta: { label: "Agenda visita", href: "#contacto" },
        plan: {
          src: "/planos/viewer/plan-06.png",
          alt: "Planta tipología A — town house 201",
          width: 1600,
          height: 664,
        },
      },
    },
    {
      id: "townhouse-202",
      label: "Townhouse 202",
      spaces: spaces201_202,
      sheet: {
        title: "Town House 202",
        summary:
          "Town House triplex · 148.80 m² habitables + 28.20 m² terraza · 3 recámaras · 3 baños · roof garden privado",
        stats: [
          { label: "Habitable", value: "148.8 m²" },
          { label: "Terraza", value: "28.2 m²" },
          { label: "Recámaras", value: "3" },
        ],
        body: sheetBody,
        cta: { label: "Agenda visita", href: "#contacto" },
        plan: {
          src: "/planos/viewer/plan-06.png",
          alt: "Planta tipología A — town house 202",
          width: 1600,
          height: 664,
        },
      },
    },
  ],
} as const;

export const compare = {
  id: "compara",
  title: "Sigue explorando Tlacotalpan 149",
  image: {
    src: "/isometricos/TL149_N2_DEPA.png",
    alt: "Isométrico de tipología residencial Tlacotalpan 149",
    width: 5760,
    height: 3652,
  },
  items: [
    {
      id: "depto-101",
      title: "Depto 101",
      unitId: "depto-102",
      features: [
        "Lorem ipsum",
        "Lorem ipsum",
        "Lorem ipsum",
        "Lorem ipsum",
      ],
    },
    {
      id: "depto-102",
      title: "Depto 102",
      unitId: "depto-102",
      features: [
        "Lorem ipsum",
        "Lorem ipsum",
        "Lorem ipsum",
        "Lorem ipsum",
      ],
    },
    {
      id: "townhouse-201",
      title: "Townhouse 201",
      unitId: "townhouse-201",
      features: [
        "Lorem ipsum",
        "Lorem ipsum",
        "Lorem ipsum",
        "Lorem ipsum",
      ],
    },
    {
      id: "townhouse-202",
      title: "Townhouse 202",
      unitId: "townhouse-202",
      features: [
        "Lorem ipsum",
        "Lorem ipsum",
        "Lorem ipsum",
        "Lorem ipsum",
      ],
    },
  ],
  tourCta: "Ver recorrido",
  visitCta: "Agenda visita",
  visitHref: "#contacto",
} as const;

export const contact = {
  id: "contacto",
  headline: "Agenda una visita.",
  body: "Cuéntanos qué buscas. Te compartimos disponibilidad, planos y el siguiente paso.",
  cta: { label: "Escribirnos", href: "mailto:hola@ejemplo.com" },
  note: "Reemplaza este correo y los textos en content.ts",
} as const;

export const footer = {
  location: "La Roma · Ciudad de México",
  brand: site.brand,
  tagline: site.description,
  privacy: {
    label: "Aviso de privacidad",
    href: "#",
  },
} as const;
