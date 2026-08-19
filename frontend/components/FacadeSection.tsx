"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { facade } from "../content";
import { goToIsometric } from "../lib/goToTour";
import { pickVideoSrc, prepareScrubVideo } from "../lib/scrubVideo";
import { scheduleScrollRefresh } from "../lib/scrollRefresh";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const VIDEO_W = 1920;
const VIDEO_H = 1312;

function EyeIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path
        d="M2.5 12s3.8-7 9.5-7 9.5 7 9.5 7-3.8 7-9.5 7-9.5-7-9.5-7Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle
        cx="12"
        cy="12"
        r="2.75"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export function FacadeSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hotspotsRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const video = videoRef.current;
      const hotspots = hotspotsRef.current;
      if (!section || !video || !hotspots) return;

      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const desktop = window.matchMedia("(min-width: 768px)").matches;

      video.pause();
      video.muted = true;

      if (reduce) {
        gsap.set(hotspots, { autoAlpha: 1 });
        video.currentTime = Number.isFinite(video.duration) ? video.duration : 0;
        return;
      }

      gsap.set(hotspots, { autoAlpha: 0 });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          id: "fachada",
          trigger: section,
          start: "top top",
          end: desktop ? "+=420%" : "+=240%",
          pin: true,
          scrub: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onEnterBack: () => {
            delete section.dataset.tourLock;
          },
        },
      });

      // El video ocupa el primer beat; los vínculos entran al terminar.
      tl.to({}, { duration: 1 });
      tl.to(hotspots, { autoAlpha: 1, duration: 0.18 });
      tl.to({}, { duration: 0.5 });

      const scrub = prepareScrubVideo({
        video,
        src: pickVideoSrc(facade.video.src, facade.video.srcMobile),
        timeline: tl,
        scrubDuration: 1,
        isLocked: () => section.dataset.tourLock === "1",
        trigger: section,
        start: "top bottom+=120%",
      });

      const unlock = () => {
        void video
          .play()
          .then(() => {
            video.pause();
          })
          .catch(() => {});
      };
      window.addEventListener("touchstart", unlock, {
        once: true,
        passive: true,
      });

      return () => {
        scrub();
        window.removeEventListener("touchstart", unlock);
      };
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id={facade.id}
      className="relative isolate min-h-[100svh] overflow-hidden bg-[#7eafd4]"
    >
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: `max(100vw, calc(100svh * ${VIDEO_W} / ${VIDEO_H}))`,
          height: `max(100svh, calc(100vw * ${VIDEO_H} / ${VIDEO_W}))`,
        }}
      >
        <video
          ref={videoRef}
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
          poster={facade.video.poster}
          muted
          playsInline
          preload="none"
          aria-hidden
          disablePictureInPicture
          onLoadedMetadata={scheduleScrollRefresh}
        />

        <div
          ref={hotspotsRef}
          className="absolute inset-0 z-10"
        >
          {facade.hotspots.map((spot) => (
            <button
              key={spot.id}
              type="button"
              onClick={() => goToIsometric(spot.unitId)}
              className="absolute cursor-pointer rounded-full focus-visible:outline-white"
              style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
              aria-label={`Ver recorrido de ${spot.label}`}
            >
              <span className="absolute bottom-[calc(100%+0.55rem)] left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-[#f3f0e8]/92 px-2.5 py-1 text-[0.62rem] font-medium tracking-[0.14em] text-[#1c1c16] uppercase md:text-[0.68rem]">
                {spot.label}
              </span>
              <span className="absolute left-1/2 top-0 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--hero-green-deep)] text-white shadow-[0_1px_6px_rgba(0,0,0,0.28)] transition-transform hover:scale-110 md:h-9 md:w-9">
                <EyeIcon />
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
