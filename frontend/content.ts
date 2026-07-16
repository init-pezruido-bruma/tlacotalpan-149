/**
 * Contenido editable de la plantilla.
 * Sustituye textos, CTAs e imágenes al adaptar un proyecto real.
 */
export const site = {
  brand: "Horizonte",
  tagline: "Residencias",
  title: "Horizonte — Residencias",
  description:
    "Plantilla de presentación inmobiliaria. Un solo scroll, narrativa clara.",
} as const;

export const nav = {
  links: [
    { label: "El lugar", href: "#lugar" },
    { label: "Espacios", href: "#espacios" },
    { label: "Contacto", href: "#contacto" },
  ],
} as const;

export const hero = {
  brand: site.brand,
  headline: "Vivir con calma,\nmirar lejos.",
  support:
    "Un desarrollo pensado para quien busca luz, proporción y silencio — sin ruido de más.",
  cta: { label: "Conocer el proyecto", href: "#lugar" },
  image: {
    src: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2400&q=80",
    alt: "Fachada de residencia contemporánea con vegetación",
  },
} as const;

export const place = {
  id: "lugar",
  eyebrow: "El lugar",
  headline: "Orientado al paisaje.",
  body: "Cada volumen se abre hacia el horizonte. Materiales honestos, sombras largas y un ritmo que invita a quedarse.",
  image: {
    src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=80",
    alt: "Interior luminoso con vista al exterior",
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
    src: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2000&q=80",
    alt: "Detalle arquitectónico de terraza y vegetación",
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
  legal: "Plantilla de presentación · Lista para tu proyecto",
} as const;
