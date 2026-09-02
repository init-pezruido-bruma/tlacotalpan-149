/**
 * Coordenadas de hotspots isométricos — archivo solo cliente.
 * Editar aquí evita recargar layout/content y romper GSAP en dev.
 */
export type UnitHotspot = {
  label: string;
  spaceId: string;
  x: number;
  y: number;
  /** Stack townhouse: 0 = nivel 1, 1 = nivel 2, 2 = roof */
  floor?: number;
};

export const unitHotspots: Record<string, UnitHotspot[]> = {
  "depto-101": [
    { label: "Recámara", spaceId: "recamara-01", x: 34, y: 32 },
    { label: "Baño", spaceId: "bano", x: 44, y: 38 },
    { label: "Cocina", spaceId: "cocina", x: 52, y: 54 },
    { label: "Sala comedor", spaceId: "sala-comedor", x: 62, y: 65 },
  ],
  "depto-102": [
    { label: "Recámara Principal", spaceId: "recamara-01", x: 34, y: 32 },
    { label: "Baño Principal", spaceId: "bano", x: 42, y: 42 },
    { label: "Recámara 02", spaceId: "recamara-02", x: 48, y: 26 },
    { label: "Baño 02", spaceId: "bano-02", x: 58, y: 36 },
    { label: "Cocina", spaceId: "cocina", x: 52, y: 48 },
    { label: "Sala comedor", spaceId: "sala-comedor", x: 58, y: 60 },
  ],
  "townhouse-201": [
    { label: "Recámara principal", spaceId: "recamara-01", floor: 0, x: 63, y: 68 },
    { label: "Baño principal", spaceId: "bano", floor: 0, x: 52, y: 56 },
    { label: "Recámara 02", spaceId: "recamara-02", floor: 0, x: 34, y: 32 },
    { label: "Baño 02", spaceId: "bano-02", floor: 0, x: 36, y: 48 },
    { label: "Sala TV", spaceId: "sala-tv", floor: 0, x: 46, y: 44 },
    { label: "Sala comedor", spaceId: "sala-comedor", floor: 1, x: 56, y: 55 },
    { label: "Recámara 03", spaceId: "recamara-03", floor: 1, x: 34, y: 32 },
    { label: "Baño 03", spaceId: "bano-03", floor: 1, x: 36, y: 48 },
    { label: "Cocina", spaceId: "cocina", floor: 1, x: 45, y: 44 },
    { label: "Roof garden", spaceId: "roof-garden", floor: 2, x: 40, y: 43 },
  ],
  "townhouse-202": [
    { label: "Recámara principal", spaceId: "recamara-01", floor: 0, x: 63, y: 68 },
    { label: "Baño principal", spaceId: "bano", floor: 0, x: 52, y: 56 },
    { label: "Recámara 02", spaceId: "recamara-02", floor: 0, x: 34, y: 32 },
    { label: "Baño 02", spaceId: "bano-02", floor: 0, x: 36, y: 48 },
    { label: "Sala TV", spaceId: "sala-tv", floor: 0, x: 46, y: 44 },
    { label: "Sala comedor", spaceId: "sala-comedor", floor: 1, x: 56, y: 55 },
    { label: "Recámara 03", spaceId: "recamara-03", floor: 1, x: 34, y: 32 },
    { label: "Baño 03", spaceId: "bano-03", floor: 1, x: 36, y: 48 },
    { label: "Cocina", spaceId: "cocina", floor: 1, x: 45, y: 44 },
    { label: "Roof garden", spaceId: "roof-garden", floor: 2, x: 40, y: 43 },
  ],
};
