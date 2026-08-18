import { ScrollTrigger } from "gsap/ScrollTrigger";

type ScrubTimeline = {
  fromTo: (
    target: object,
    fromVars: object,
    toVars: object,
    position?: number | string,
  ) => unknown;
};

function prefersLiteVideo() {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(max-width: 767px)").matches) return true;
  const connection = (
    navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string };
    }
  ).connection;
  return (
    connection?.saveData === true ||
    connection?.effectiveType === "2g" ||
    connection?.effectiveType === "slow-2g"
  );
}

export function pickVideoSrc(src: string, srcMobile: string) {
  return encodeURI(prefersLiteVideo() ? srcMobile : src);
}

function clampToBuffered(video: HTMLVideoElement, time: number) {
  const { buffered } = video;
  if (!buffered.length) return 0;

  for (let i = 0; i < buffered.length; i++) {
    const start = buffered.start(i);
    const end = buffered.end(i);
    if (time >= start && time <= end) return time;
  }

  let nearest = buffered.end(0);
  let dist = Math.abs(time - nearest);
  for (let i = 0; i < buffered.length; i++) {
    const start = buffered.start(i);
    const end = buffered.end(i);
    const dEnd = Math.abs(time - end);
    const dStart = Math.abs(time - start);
    if (dEnd < dist) {
      dist = dEnd;
      nearest = end;
    }
    if (dStart < dist) {
      dist = dStart;
      nearest = start;
    }
  }
  return nearest;
}

export function prepareScrubVideo({
  video,
  src,
  timeline,
  scrubDuration,
  position = 0,
  isLocked,
  trigger,
  start = "top bottom+=90%",
  eager = false,
}: {
  video: HTMLVideoElement;
  src: string;
  timeline: ScrubTimeline;
  scrubDuration: number;
  position?: number | string;
  isLocked?: () => boolean;
  trigger: Element;
  start?: string;
  eager?: boolean;
}) {
  const proxy = { time: 0 };
  let target = 0;
  let attached = false;
  let started = false;

  const apply = () => {
    if (isLocked?.()) return;
    if (video.readyState < 2 && video.buffered.length === 0) return;
    const next = clampToBuffered(video, target);
    if (Math.abs(video.currentTime - next) >= 1 / 60) {
      video.currentTime = next;
    }
  };

  const attach = () => {
    if (attached) return;
    if (!Number.isFinite(video.duration) || video.duration <= 0) return;
    attached = true;
    timeline.fromTo(
      proxy,
      { time: 0 },
      {
        time: video.duration,
        duration: scrubDuration,
        ease: "none",
        onUpdate: () => {
          target = proxy.time;
          apply();
        },
      },
      position,
    );
    target = proxy.time;
    apply();
    ScrollTrigger.refresh();
  };

  const begin = () => {
    if (started) return;
    started = true;
    video.preload = "auto";
    if (video.getAttribute("src") !== src) {
      video.src = src;
    }
    video.load();
  };

  video.addEventListener("loadedmetadata", attach);
  video.addEventListener("durationchange", attach);
  video.addEventListener("progress", apply);
  video.addEventListener("canplay", apply);

  const preload = ScrollTrigger.create({
    trigger,
    start,
    once: true,
    onEnter: begin,
  });

  let idle = 0;
  let idleCallback = 0;
  if (eager) {
    const requestIdle = window.requestIdleCallback?.bind(window);
    if (requestIdle) {
      idleCallback = requestIdle(() => begin(), { timeout: 1200 });
    } else {
      idle = window.setTimeout(begin, 250);
    }
  }

  return () => {
    window.clearTimeout(idle);
    window.cancelIdleCallback?.(idleCallback);
    preload.kill();
    video.removeEventListener("loadedmetadata", attach);
    video.removeEventListener("durationchange", attach);
    video.removeEventListener("progress", apply);
    video.removeEventListener("canplay", apply);
  };
}
