"use client";

import { useEffect, useRef, useState, type Ref } from "react";

export type MapPin = {
  id: string;
  label: string;
  walk?: string;
  lat: number;
  lng: number;
  home?: boolean;
};

type ScreenPos = { left: number; top: number; visible: boolean };

const OLIVE = {
  bg: "#3d442c",
  land: "#454d32",
  park: "#55623a",
  water: "#2a3020",
  building: "#50583a",
  road: "#d0d4c0",
};

const MAPLIBRE_JS = "https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.js";
const MAPLIBRE_CSS = "https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.css";

type MapInstance = {
  on: (event: string, cb: (e?: unknown) => void) => void;
  off: (event: string, cb: (e?: unknown) => void) => void;
  remove: () => void;
  resize: () => void;
  triggerRepaint: () => void;
  project: (lngLat: [number, number]) => { x: number; y: number };
  getContainer: () => HTMLElement;
  getStyle: () => { layers?: Array<{ id: string; type: string }> };
  setLayoutProperty: (id: string, prop: string, value: unknown) => void;
  setPaintProperty: (id: string, prop: string, value: unknown) => void;
  getPaintProperty: (id: string, prop: string) => unknown;
};

type MapLibreNS = {
  Map: new (options: Record<string, unknown>) => MapInstance;
};

declare global {
  interface Window {
    maplibregl?: MapLibreNS;
  }
}

function loadMapLibre(): Promise<MapLibreNS> {
  if (window.maplibregl) return Promise.resolve(window.maplibregl);

  if (!document.querySelector(`link[href="${MAPLIBRE_CSS}"]`)) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = MAPLIBRE_CSS;
    document.head.appendChild(link);
  }

  const existing = document.querySelector<HTMLScriptElement>(
    `script[src="${MAPLIBRE_JS}"]`,
  );
  if (existing) {
    return new Promise((resolve, reject) => {
      if (window.maplibregl) {
        resolve(window.maplibregl);
        return;
      }
      existing.addEventListener("load", () => {
        if (window.maplibregl) resolve(window.maplibregl);
        else reject(new Error("maplibre missing after load"));
      });
      existing.addEventListener("error", () =>
        reject(new Error("maplibre script failed")),
      );
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = MAPLIBRE_JS;
    script.async = true;
    script.onload = () => {
      if (window.maplibregl) resolve(window.maplibregl);
      else reject(new Error("maplibre missing after load"));
    };
    script.onerror = () => reject(new Error("maplibre script failed"));
    document.head.appendChild(script);
  });
}

function stylizePlaceMap(map: MapInstance) {
  const layers = map.getStyle().layers ?? [];

  for (const layer of layers) {
    const id = layer.id;

    if (layer.type === "symbol") {
      map.setLayoutProperty(id, "visibility", "none");
      continue;
    }

    if (layer.type === "background") {
      map.setPaintProperty(id, "background-color", OLIVE.bg);
      continue;
    }

    if (layer.type === "fill") {
      const key = id.toLowerCase();
      try {
        if (key.includes("water")) {
          map.setPaintProperty(id, "fill-color", OLIVE.water);
        } else if (
          key.includes("park") ||
          key.includes("wood") ||
          key.includes("grass")
        ) {
          map.setPaintProperty(id, "fill-color", OLIVE.park);
          map.setPaintProperty(id, "fill-opacity", 0.65);
        } else if (key.includes("building")) {
          map.setPaintProperty(id, "fill-color", OLIVE.building);
          map.setPaintProperty(id, "fill-opacity", 0.45);
        } else if (
          key.includes("landcover") ||
          key.includes("landuse") ||
          key.includes("residential")
        ) {
          map.setPaintProperty(id, "fill-color", OLIVE.land);
          map.setPaintProperty(id, "fill-opacity", 0.4);
        }
      } catch {
        /* ignore */
      }
    }

    if (layer.type === "line") {
      try {
        map.setPaintProperty(id, "line-color", OLIVE.road);
        map.setPaintProperty(id, "line-opacity", 0.55);
        const width = map.getPaintProperty(id, "line-width");
        if (typeof width === "number") {
          map.setPaintProperty(id, "line-width", Math.max(0.3, width * 0.55));
        }
      } catch {
        /* ignore */
      }
    }

    if (layer.type === "fill-extrusion") {
      map.setLayoutProperty(id, "visibility", "none");
    }
  }
}

function projectPins(
  map: MapInstance,
  pins: readonly MapPin[],
): Record<string, ScreenPos> {
  const { clientWidth: w, clientHeight: h } = map.getContainer();
  const next: Record<string, ScreenPos> = {};

  for (const pin of pins) {
    const point = map.project([pin.lng, pin.lat]);
    const pad = 8;
    const visible =
      point.x >= -pad &&
      point.y >= -pad &&
      point.x <= w + pad &&
      point.y <= h + pad;

    next[pin.id] = {
      left: (point.x / w) * 100,
      top: (point.y / h) * 100,
      visible,
    };
  }

  return next;
}

export function NeighborhoodMap({
  center,
  zoom,
  pins,
  selectedId,
  onSelect,
  pinsRef,
}: {
  /** [lat, lng] */
  center: readonly [number, number];
  zoom: number;
  pins: readonly MapPin[];
  selectedId: string;
  onSelect: (id: string) => void;
  pinsRef?: Ref<HTMLDivElement>;
}) {
  const mapElRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapInstance | null>(null);
  const pinsDataRef = useRef(pins);
  pinsDataRef.current = pins;

  const [positions, setPositions] = useState<Record<string, ScreenPos>>({});

  useEffect(() => {
    const el = mapElRef.current;
    if (!el) return;

    let cancelled = false;
    let ro: ResizeObserver | null = null;
    let onPlaceResize: (() => void) | null = null;
    let syncPositions: (() => void) | null = null;
    let io: IntersectionObserver | null = null;
    let started = false;

    const [lat, lng] = center;

    const startMap = () => {
      if (cancelled || started) return;
      started = true;

      void (async () => {
        try {
          const maplibregl = await loadMapLibre();
          if (cancelled || !mapElRef.current) return;

          while (
            !cancelled &&
            mapElRef.current &&
            (mapElRef.current.clientWidth < 8 ||
              mapElRef.current.clientHeight < 8)
          ) {
            await new Promise((r) => requestAnimationFrame(r));
          }
          if (cancelled || !mapElRef.current) return;

          const map = new maplibregl.Map({
            container: mapElRef.current,
            style: "https://tiles.openfreemap.org/styles/positron",
            center: [lng, lat],
            zoom,
            maxZoom: 16,
            interactive: false,
            attributionControl: { compact: true },
            fadeDuration: 0,
          });

          mapRef.current = map;

          syncPositions = () => {
            if (cancelled || !mapRef.current) return;
            setPositions(projectPins(mapRef.current, pinsDataRef.current));
          };

          const apply = () => {
            if (cancelled) return;
            stylizePlaceMap(map);
            map.resize();
            map.triggerRepaint();
            syncPositions?.();
          };

          map.on("load", apply);
          map.on("resize", () => syncPositions?.());
          map.on("error", (e) => {
            console.error("[NeighborhoodMap]", e);
          });

          requestAnimationFrame(() => {
            map.resize();
            syncPositions?.();
          });
          window.setTimeout(() => {
            map.resize();
            syncPositions?.();
          }, 600);

          ro = new ResizeObserver(() => {
            map.resize();
            syncPositions?.();
          });
          ro.observe(mapElRef.current);

          onPlaceResize = () => {
            map.resize();
            syncPositions?.();
          };
          window.addEventListener("place-map-resize", onPlaceResize);
        } catch (err) {
          console.error("[NeighborhoodMap] init failed", err);
        }
      })();
    };

    // No cargar MapLibre en el primer paint: espera a que la sección se acerque
    if (typeof IntersectionObserver === "undefined") {
      startMap();
    } else {
      io = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            io?.disconnect();
            io = null;
            startMap();
          }
        },
        { rootMargin: "40% 0px", threshold: 0 },
      );
      io.observe(el);
    }

    return () => {
      cancelled = true;
      io?.disconnect();
      ro?.disconnect();
      if (onPlaceResize) {
        window.removeEventListener("place-map-resize", onPlaceResize);
      }
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [center, zoom]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    setPositions(projectPins(map, pins));
  }, [pins]);

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      role="group"
      aria-label="Mapa del entorno en Roma Sur"
    >
      <div ref={mapElRef} className="place-map-embed h-full w-full" />

      <div ref={pinsRef} className="pointer-events-none absolute inset-0 z-10">
        {pins.map((pin) => {
          const selected = pin.id === selectedId;
          const pos = positions[pin.id];
          if (!pos?.visible) return null;

          return (
            <button
              key={pin.id}
              type="button"
              onClick={() => onSelect(pin.id)}
              aria-pressed={selected}
              aria-label={
                pin.walk ? `${pin.label}, ${pin.walk} a pie` : pin.label
              }
              className={
                pin.home
                  ? // Ancla en la puntita inferior del pin, no en el centro del diamante
                    "pointer-events-auto absolute -translate-x-1/2 -translate-y-full cursor-pointer"
                  : "pointer-events-auto absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer"
              }
              style={{ left: `${pos.left}%`, top: `${pos.top}%` }}
            >
              {pin.home ? (
                <span className="relative flex flex-col items-center">
                  <span className="mb-1 max-w-[9rem] truncate whitespace-nowrap rounded-md bg-place-ink/95 px-2 py-0.5 text-[0.55rem] font-medium tracking-[0.1em] text-place-surface uppercase md:mb-1.5 md:max-w-none md:px-2.5 md:py-1 md:text-[0.68rem] md:tracking-[0.12em]">
                    {pin.label}
                  </span>
                  <span className="relative flex flex-col items-center">
                    <span className="block h-2.5 w-2.5 rotate-45 rounded-[2px] bg-place-ink md:h-3 md:w-3" />
                    <span
                      className="-mt-px h-2 w-px bg-place-ink md:h-2.5"
                      aria-hidden
                    />
                  </span>
                </span>
              ) : (
                <>
                  {selected ? (
                    <span className="absolute bottom-[calc(100%+0.35rem)] left-1/2 max-w-[9rem] -translate-x-1/2 truncate whitespace-nowrap rounded-md bg-place-ink/95 px-2 py-0.5 text-[0.55rem] font-medium tracking-[0.1em] text-place-surface uppercase md:bottom-[calc(100%+0.4rem)] md:max-w-none md:px-2.5 md:py-1 md:text-[0.68rem] md:tracking-[0.12em]">
                      {pin.label}
                    </span>
                  ) : null}
                  <span className="flex h-9 w-9 items-center justify-center md:h-10 md:w-10">
                    <span
                      className={
                        selected
                          ? "block h-2.5 w-2.5 rounded-full border-[1.5px] border-place-ink bg-place-ink/30 md:h-3 md:w-3"
                          : "block h-2 w-2 rounded-full border border-place-ink/80 bg-transparent md:h-2.5 md:w-2.5"
                      }
                    />
                  </span>
                </>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
