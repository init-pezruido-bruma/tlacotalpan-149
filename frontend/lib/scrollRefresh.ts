import { ScrollTrigger } from "gsap/ScrollTrigger";

let timer: ReturnType<typeof setTimeout> | null = null;

type RefreshSnapshot = {
  scrollY: number;
  pinned: {
    trigger: ScrollTrigger;
    progress: number;
  } | null;
};

function snapshotScroll(): RefreshSnapshot {
  const scrollY = window.scrollY;
  const pinnedActive = ScrollTrigger.getAll().find(
    (trigger) => trigger.pin && trigger.isActive,
  );

  return {
    scrollY,
    pinned: pinnedActive
      ? { trigger: pinnedActive, progress: pinnedActive.progress }
      : null,
  };
}

function restoreScroll(snapshot: RefreshSnapshot) {
  if (snapshot.pinned) {
    const { trigger, progress } = snapshot.pinned;
    const target = trigger.start + (trigger.end - trigger.start) * progress;
    if (Number.isFinite(target)) {
      trigger.scroll(target);
      ScrollTrigger.update();
      return;
    }
  }

  window.scrollTo(0, snapshot.scrollY);
  ScrollTrigger.update();
}

/**
 * Refresca ScrollTrigger sin perder la posición del scroll.
 * Solo restaura el pin activo; si no hay pin, restaura scrollY.
 * Debounce más largo al boot para no encadenar refreshes (stutter).
 */
export function scheduleScrollRefresh() {
  if (typeof window === "undefined") return;

  if (timer) clearTimeout(timer);
  const bootMs =
    typeof performance !== "undefined" && performance.now() < 2500
      ? 700
      : 400;
  timer = setTimeout(() => {
    timer = null;

    const snapshot = snapshotScroll();

    ScrollTrigger.refresh();
    restoreScroll(snapshot);
  }, bootMs);
}
