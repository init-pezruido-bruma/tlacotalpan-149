import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { lastSeekableTime } from "./scrubVideo";

gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);

export const TOUR_EVENT = "tl149:goto-tour";
export const ISOMETRIC_EVENT = "tl149:goto-isometric";

export const UNIT_SECTION_ID = "recorridos";

/** Ids compartibles en URL: `/#depto-101` (también acepta `?unit=` legacy). */
export const UNIT_IDS = [
  "depto-101",
  "depto-102",
  "townhouse-201",
  "townhouse-202",
] as const;

export type UnitId = (typeof UNIT_IDS)[number];

export type TourEventDetail = {
  unitId: string;
  spaceId?: string;
};

export type IsometricEventDetail = {
  unitId: string;
};

let tourScrollProgress = 0.3;
let isoScrollProgress = 0.18;

/** Velocidad base del scroll fachada → iso (px/s aprox.); se clampea a un rango cómodo. */
const ISO_SCROLL_PX_PER_SEC = 2100;
const ISO_SCROLL_DURATION_MIN = 1.6;
const ISO_SCROLL_DURATION_MAX = 2.8;

export function setTourScrollProgress(progress: number) {
  tourScrollProgress = progress;
}

export function setIsoScrollProgress(progress: number) {
  isoScrollProgress = progress;
}

export function isUnitId(id: string): id is UnitId {
  return (UNIT_IDS as readonly string[]).includes(id);
}

/** Lee unidad desde `#depto-101` (prioridad) o `?unit=` legacy. */
export function getUnitFromUrl(href = window.location.href): UnitId | null {
  const url = new URL(href, window.location.origin);

  const fromHash = url.hash.replace(/^#/, "").trim();
  if (fromHash && isUnitId(fromHash)) return fromHash;

  const fromQuery = url.searchParams.get("unit");
  if (fromQuery && isUnitId(fromQuery)) return fromQuery;

  return null;
}

function lockFacadeVideo() {
  const section = document.getElementById("fachada");
  const video = section?.querySelector("video");
  if (!section || !video) return;

  section.dataset.tourLock = "1";
  const last = lastSeekableTime(video) || video.currentTime;
  if (video.readyState >= 2) {
    video.currentTime = last;
  }
}

function getSectionScrollY(sectionId: string, progress = 0) {
  const el = document.getElementById(sectionId);
  const fromRect = el
    ? window.scrollY + el.getBoundingClientRect().top
    : window.scrollY;

  const st =
    ScrollTrigger.getById(sectionId) ??
    ScrollTrigger.getAll().find(
      (trigger) =>
        (trigger.trigger as HTMLElement | undefined)?.id === sectionId,
    );

  if (st) {
    return st.start + (st.end - st.start) * progress;
  }

  return fromRect;
}

function scrollToSectionProgress(sectionId: string, progress: number) {
  const st =
    ScrollTrigger.getById(sectionId) ??
    ScrollTrigger.getAll().find(
      (trigger) =>
        (trigger.trigger as HTMLElement | undefined)?.id === sectionId,
    );
  const scroller = document.scrollingElement ?? document.documentElement;
  const y = st
    ? st.start + (st.end - st.start) * progress
    : getSectionScrollY(sectionId, progress);
  scroller.scrollTop = y;
  return y;
}

/** Instant jump that can leave an active ScrollTrigger pin. `gsap.set(window, { scrollTo })` is ignored while pinned. */
function jumpToSection(sectionId: string, progress: number) {
  gsap.killTweensOf(window);

  const pins = ScrollTrigger.getAll().filter((st) => st.isActive && st.pin);
  pins.forEach((st) => st.disable(false));

  scrollToSectionProgress(sectionId, progress);
  pins.forEach((st) => st.enable(false));
  scrollToSectionProgress(sectionId, progress);
  ScrollTrigger.update();
  return scrollToSectionProgress(sectionId, progress);
}

/**
 * Scroll animado manteniendo pines activos.
 * Arranca de inmediato (ease-out) y dura según la distancia → fluido, sin precipitarse.
 */
function animateToSection(sectionId: string, progress: number) {
  const reduce = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (reduce) {
    jumpToSection(sectionId, progress);
    return;
  }

  const scroller = document.scrollingElement ?? document.documentElement;
  gsap.killTweensOf(window);
  gsap.killTweensOf(scroller);

  const start = scroller.scrollTop;
  const end = getSectionScrollY(sectionId, progress);
  const distance = Math.abs(end - start);
  const duration = gsap.utils.clamp(
    ISO_SCROLL_DURATION_MIN,
    ISO_SCROLL_DURATION_MAX,
    distance / ISO_SCROLL_PX_PER_SEC,
  );

  gsap.to(window, {
    scrollTo: { y: end, autoKill: false },
    duration,
    // Sin ease-in: el movimiento empieza en el click; frena suave al llegar
    ease: "power2.out",
    overwrite: true,
    onComplete: () => {
      scrollToSectionProgress(sectionId, progress);
      ScrollTrigger.update();
    },
  });
}

/** Solo hash: `/#townhouse-201` (limpia `?unit=` si venía de un link viejo). */
function setUnitRef(unitId: string) {
  const url = new URL(window.location.href);
  url.searchParams.delete("unit");
  const search = url.searchParams.toString();
  window.history.pushState(
    {},
    "",
    `${url.pathname}${search ? `?${search}` : ""}#${unitId}`,
  );
}

/** Selecciona unidad + scroll al isométrico (carga con `/#depto-101`). */
export function jumpToUnit(unitId: string) {
  if (!isUnitId(unitId)) return false;

  setUnitRef(unitId);
  window.dispatchEvent(
    new CustomEvent<IsometricEventDetail>(ISOMETRIC_EVENT, {
      detail: { unitId },
    }),
  );
  jumpToSection(UNIT_SECTION_ID, isoScrollProgress);
  return true;
}

export function goToIsometric(unitId: string) {
  lockFacadeVideo();
  // Scroll primero: respuesta inmediata al click (URL/evento después)
  animateToSection(UNIT_SECTION_ID, isoScrollProgress);
  setUnitRef(unitId);
  window.dispatchEvent(
    new CustomEvent<IsometricEventDetail>(ISOMETRIC_EVENT, {
      detail: { unitId },
    }),
  );
}

export function goToTour(unitId: string, spaceId?: string) {
  lockFacadeVideo();
  const y = jumpToSection(UNIT_SECTION_ID, tourScrollProgress);
  setUnitRef(unitId);
  window.dispatchEvent(
    new CustomEvent<TourEventDetail>(TOUR_EVENT, {
      detail: { unitId, spaceId },
    }),
  );
  requestAnimationFrame(() => {
    const scroller = document.scrollingElement ?? document.documentElement;
    if (Math.abs(scroller.scrollTop - y) > 24) {
      jumpToSection(UNIT_SECTION_ID, tourScrollProgress);
    }
  });
}

export function exitTourToCompare() {
  jumpToSection(UNIT_SECTION_ID, 1);
}

/** Salto a `#id` o unidad (`#depto-101`) respetando pines. */
export function jumpToHash(hash = window.location.hash) {
  const id = hash.replace(/^#/, "").trim();
  if (!id || id === "top") {
    window.scrollTo(0, 0);
    ScrollTrigger.update();
    return false;
  }

  if (isUnitId(id)) {
    return jumpToUnit(id);
  }

  const el = document.getElementById(id);
  if (!el) return false;

  jumpToSection(id, 0);
  return true;
}

/** Deep link al boot: unidad (`#` / `?unit=` legacy) o ancla de sección. */
export function applyBootDeepLink() {
  const unit = getUnitFromUrl();
  if (unit) return jumpToUnit(unit);
  if (window.location.hash) return jumpToHash(window.location.hash);
  return false;
}
