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

export const contact = {
  id: "contacto",
  headline: "Agenda una visita.",
  body: "Cuéntanos qué buscas. Te compartimos disponibilidad, planos y el siguiente paso.",
  cta: { label: "Escribirnos", href: "mailto:hola@ejemplo.com" },
  note: "Reemplaza este correo y los textos en content.ts",
} as const;

export const footer = {
  brand: site.brand,
  legal: "Tlacotalpan 149 · La Roma, Ciudad de México",
} as const;
