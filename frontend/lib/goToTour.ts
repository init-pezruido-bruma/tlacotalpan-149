import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);

export const TOUR_EVENT = "tl149:goto-tour";
export const ISOMETRIC_EVENT = "tl149:goto-isometric";

export const UNIT_SECTION_ID = "recorridos";

export type TourEventDetail = {
  unitId: string;
};

export type IsometricEventDetail = {
  unitId: string;
};

let tourScrollProgress = 0.3;
let isoScrollProgress = 0.18;

export function setTourScrollProgress(progress: number) {
  tourScrollProgress = progress;
}

export function setIsoScrollProgress(progress: number) {
  isoScrollProgress = progress;
}

function lockFacadeVideo() {
  const section = document.getElementById("fachada");
  const video = section?.querySelector("video");
  if (!section || !video) return;

  section.dataset.tourLock = "1";
  const last =
    Number.isFinite(video.duration) && video.duration > 0
      ? video.duration
      : video.currentTime;
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

function getTourScrollY() {
  return getSectionScrollY(UNIT_SECTION_ID, tourScrollProgress);
}

function getIsometricScrollY() {
  return getSectionScrollY(UNIT_SECTION_ID, isoScrollProgress);
}

function scrollToIsometric() {
  const reduce = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (reduce) {
    gsap.set(window, {
      scrollTo: { y: getIsometricScrollY(), autoKill: false },
    });
    return;
  }

  gsap.to(window, {
    scrollTo: { y: getIsometricScrollY(), autoKill: false },
    duration: 3.2,
    ease: "power2.inOut",
  });
}

function setUnitParam(unitId: string) {
  const url = new URL(window.location.href);
  url.searchParams.set("unit", unitId);
  url.hash = "";
  window.history.pushState({}, "", `${url.pathname}${url.search}`);
}

export function goToIsometric(unitId: string) {
  lockFacadeVideo();
  setUnitParam(unitId);
  window.dispatchEvent(
    new CustomEvent<IsometricEventDetail>(ISOMETRIC_EVENT, {
      detail: { unitId },
    }),
  );

  requestAnimationFrame(() => {
    scrollToIsometric();
  });
}

export function goToTour(unitId: string) {
  lockFacadeVideo();
  setUnitParam(unitId);
  window.dispatchEvent(
    new CustomEvent<TourEventDetail>(TOUR_EVENT, { detail: { unitId } }),
  );

  requestAnimationFrame(() => {
    gsap.set(window, { scrollTo: { y: getTourScrollY(), autoKill: false } });
  });
}
