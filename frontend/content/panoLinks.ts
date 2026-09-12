/**
 * Enlaces de navegación dentro del recorrido 360.
 * Posición en esferas: yaw/pitch en el panorama (no % de pantalla).
 * Townhouse y departamentos tienen grafos distintos.
 */

export type PanoNavLink = {
  spaceId: string;
  label: string;
  /** Azimut absoluto en radianes (mismo sistema que `space.yaw`). */
  yaw: number;
  /** Elevación en radianes (0 = horizonte, positivo = arriba). */
  pitch: number;
};

type SphericalPose = {
  /** Desplazamiento azimutal respecto al yaw inicial del espacio. */
  yawOffset: number;
  pitch: number;
};

type Connection = {
  a: string;
  b: string;
  /** Hotspot en el espacio `a` hacia `b`. */
  fromA: SphericalPose;
  /** Hotspot en el espacio `b` hacia `a`. */
  fromB: SphericalPose;
};

/**
 * Conexiones townhouse 201–202 (afinadas sobre los renders TH).
 */
const TOWNHOUSE_CONNECTIONS: readonly Connection[] = [
  {
    a: "recamara-01",
    b: "bano-01",
    fromA: { yawOffset: 2.1, pitch: -0.15 },
    fromB: { yawOffset: -3.0, pitch: -0.04 },
  },
  {
    a: "sala-tv",
    b: "recamara-01",
    fromA: { yawOffset: 0.15, pitch: -0.05 },
    fromB: { yawOffset: 2.75, pitch: -0.1 },
  },
  {
    a: "sala-tv",
    b: "recamara-02",
    fromA: { yawOffset: 2.85, pitch: -0.05 },
    fromB: { yawOffset: 0.95, pitch: 0.0 },
  },
  {
    a: "sala-tv",
    b: "bano-02",
    fromA: { yawOffset: -1.45, pitch: -0.05 },
    fromB: { yawOffset: 1.55, pitch: -0.04 },
  },
  {
    a: "sala-comedor",
    b: "cocina",
    fromA: { yawOffset: 3.25, pitch: -0.04 },
    fromB: { yawOffset: 1.65, pitch: -0.04 },
  },
  {
    a: "recamara-03",
    b: "cocina",
    fromA: { yawOffset: 0.95, pitch: 0.0 },
    fromB: { yawOffset: -1.5, pitch: -0.04 },
  },
  {
    a: "bano-03",
    b: "cocina",
    fromA: { yawOffset: 1.55, pitch: -0.04 },
    fromB: { yawOffset: -1.8, pitch: -0.08 },
  },
  {
    a: "sala-tv",
    b: "cocina",
    fromA: { yawOffset: -0.85, pitch: 0.05 },
    fromB: { yawOffset: 2.1, pitch: -0.25 },
  },
  {
    a: "roof-garden",
    b: "cocina",
    fromA: { yawOffset: 2.25, pitch: -0.1 },
    fromB: { yawOffset: 3.6, pitch: 0.05 },
  },
];

/**
 * Conexiones Depto 102 (renders DP).
 * Depto 101 parte de la misma copia; ajustar por separado.
 */
const DEPTO_102_CONNECTIONS: readonly Connection[] = [
  {
    a: "recamara-01",
    b: "bano-01",
    fromA: { yawOffset: -1.4, pitch: -0.05 },
    fromB: { yawOffset: 2.5, pitch: -0.04 },
  },
  {
    a: "recamara-02",
    b: "cocina",
    fromA: { yawOffset: 0.95, pitch: 0.0 },
    fromB: { yawOffset: -0.7, pitch: -0.04 },
  },
  {
    a: "recamara-02",
    b: "bano-02",
    fromA: { yawOffset: 0.7, pitch: -0.05 },
    fromB: { yawOffset: 1.55, pitch: -0.04 },
  },
  {
    a: "sala-comedor",
    b: "cocina",
    fromA: { yawOffset: 3.25, pitch: -0.04 },
    fromB: { yawOffset: -1.65, pitch: -0.04 },
  },
  {
    a: "recamara-01",
    b: "cocina",
    fromA: { yawOffset: -1.85, pitch: -0.05 },
    fromB: { yawOffset: 1.5, pitch: 0.0 },
  },
  {
    a: "recamara-02",
    b: "cocina",
    fromA: { yawOffset: -1.85, pitch: -0.05 },
    fromB: { yawOffset: 1.25, pitch: -0.15 },
  },
  {
    a: "bano-01",
    b: "cocina",
    fromA: { yawOffset: -2.9, pitch: -0.05 },
    fromB: { yawOffset: 1.5, pitch: -0.20 },
  },
];

/** Copia inicial de 102 — modificar sin afectar 102. */
const DEPTO_101_CONNECTIONS: readonly Connection[] = [
  {
    a: "recamara-01",
    b: "bano-01",
    fromA: { yawOffset: -1.4, pitch: -0.05 },
    fromB: { yawOffset: 2.5, pitch: -0.04 },
  },
  {
    a: "recamara-02",
    b: "bano-02",
    fromA: { yawOffset: 0.7, pitch: -0.05 },
    fromB: { yawOffset: -0.7, pitch: -0.04 },
  },
  {
    a: "sala-comedor",
    b: "cocina",
    fromA: { yawOffset: 3.25, pitch: -0.04 },
    fromB: { yawOffset: -1.65, pitch: -0.04 },
  },
  {
    a: "recamara-01",
    b: "cocina",
    fromA: { yawOffset: -1.85, pitch: -0.05 },
    fromB: { yawOffset: 1.5, pitch: -0.05 },
  },
  {
    a: "bano-01",
    b: "cocina",
    fromA: { yawOffset: -2.9, pitch: -0.05 },
    fromB: { yawOffset: 1.25, pitch: -0.15 },
  },
];

type SpaceRef = { id: string; title: string };

function connectionsForUnit(unitId: string): readonly Connection[] {
  if (unitId.startsWith("townhouse")) return TOWNHOUSE_CONNECTIONS;
  if (unitId === "depto-101") return DEPTO_101_CONNECTIONS;
  return DEPTO_102_CONNECTIONS;
}

/** Hotspots hacia espacios conectados, anclados al panorama (yaw/pitch). */
export function getPanoLinks(
  unitId: string,
  spaceId: string,
  spaces: readonly SpaceRef[],
  baseYaw = 0,
): PanoNavLink[] {
  const byId = new Map(spaces.map((s) => [s.id, s]));
  if (!byId.has(spaceId)) return [];

  const links: PanoNavLink[] = [];

  for (const conn of connectionsForUnit(unitId)) {
    if (conn.a === spaceId && byId.has(conn.b)) {
      const target = byId.get(conn.b)!;
      links.push({
        spaceId: target.id,
        label: target.title,
        yaw: baseYaw + conn.fromA.yawOffset,
        pitch: conn.fromA.pitch,
      });
    } else if (conn.b === spaceId && byId.has(conn.a)) {
      const target = byId.get(conn.a)!;
      links.push({
        spaceId: target.id,
        label: target.title,
        yaw: baseYaw + conn.fromB.yawOffset,
        pitch: conn.fromB.pitch,
      });
    }
  }

  return links;
}

/**
 * Punto en el interior de la cúpula donde el centro del frame
 * muestra esa dirección (mismo sistema que `cameraPosition` + lookAt origen).
 */
export function panoLinkWorldPosition(
  yaw: number,
  pitch: number,
  radius = 80,
): [number, number, number] {
  const cp = Math.cos(pitch);
  return [
    -Math.sin(yaw) * cp * radius,
    Math.sin(pitch) * radius,
    -Math.cos(yaw) * cp * radius,
  ];
}
