"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { place } from "../content";
import { pickVideoSrc, prepareScrubVideo } from "../lib/scrubVideo";
import { scheduleScrollRefresh } from "../lib/scrollRefresh";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function PlaceSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const frame = frameRef.current;
      const video = videoRef.current;
      const title = titleRef.current;
      const subtitle = subtitleRef.current;
      const body = bodyRef.current;
      if (!section || !frame || !video || !title || !subtitle || !body) return;

      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      const desktop = window.matchMedia("(min-width: 768px)").matches;
      const endFrame = { top: "10%", left: "54%", width: "42%", height: "80%" };

      video.pause();
      video.muted = true;

      if (reduce) {
        if (desktop) {
          gsap.set(frame, endFrame);
        } else {
          gsap.set(frame, { clearProps: "top,left,width,height" });
        }
        gsap.set([title, subtitle, body], { autoAlpha: 1, y: 0 });
        return;
      }

      if (!desktop) {
        gsap.set(frame, { clearProps: "top,left,width,height" });
        gsap.set([title, subtitle, body], { autoAlpha: 1, y: 0 });

        const src = pickVideoSrc(place.video.src, place.video.srcMobile);
        if (video.src !== src) {
          video.src = src;
          video.load();
        }
        video.loop = true;
        void video.play().catch(() => {});

        return;
      }

      gsap.set(frame, { top: 0, left: 0, width: "100%", height: "100%" });
      gsap.set([title, subtitle, body], { autoAlpha: 0, y: 28 });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=280%",
          pin: true,
          scrub: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      const settle = 0.4;
      tl.to({}, { duration: settle });
      tl.to(frame, { ...endFrame, duration: 1 }, settle);
      tl.to(title, { autoAlpha: 1, y: 0, duration: 0.35 }, settle + 0.25);
      tl.to(subtitle, { autoAlpha: 1, y: 0, duration: 0.3 }, settle + 0.4);
      tl.to(body, { autoAlpha: 1, y: 0, duration: 0.35 }, settle + 0.55);
      tl.to({}, { duration: 1.2 });

      const scrub = prepareScrubVideo({
        video,
        src: pickVideoSrc(place.video.src, place.video.srcMobile),
        timeline: tl,
        scrubDuration: tl.duration(),
        trigger: section,
        start: "top bottom+=180%",
        eager: true,
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
      id={place.id}
      className="place-surface relative isolate overflow-hidden"
    >
      <div className="place-grain" aria-hidden />

      <div className="relative min-h-[100svh] w-full max-md:flex max-md:flex-col max-md:min-h-0">
        <div
          ref={frameRef}
          className="place-frame absolute top-0 left-0 z-20 h-full w-full overflow-hidden will-change-[top,left,width,height] max-md:relative max-md:order-1 max-md:h-[28svh] max-md:min-h-[180px] max-md:max-h-[240px] max-md:shrink-0"
        >
          <video
            ref={videoRef}
            className="pointer-events-none absolute inset-0 h-full w-full object-cover"
            poster={place.video.poster}
            muted
            playsInline
            preload="none"
            aria-hidden
            disablePictureInPicture
            onLoadedMetadata={scheduleScrollRefresh}
          />
        </div>

        <div className="absolute inset-0 z-10 flex items-end px-[max(1.25rem,calc((100%-var(--content))/2))] pt-22 pb-10 max-md:relative max-md:order-2 max-md:inset-auto max-md:items-start max-md:py-8 md:items-center md:py-0">
          <div className="place-copy w-full max-w-lg md:w-[min(46%,32rem)]">
            <h2
              ref={titleRef}
              className="text-[clamp(1.65rem,3.8vw,2.65rem)] leading-[1.15] font-medium tracking-[0.08em] text-place-ink uppercase"
            >
              <span className="max-md:whitespace-normal md:whitespace-nowrap">{place.title}</span>
              <br />
              {place.titleLine2}
            </h2>
            <p
              ref={subtitleRef}
              className="mt-6 text-[0.7rem] font-medium tracking-[0.22em] text-place-ink uppercase md:mt-10 md:text-xs"
            >
              {place.subtitle}
            </p>
            <div
              ref={bodyRef}
              className="mt-6 max-w-sm space-y-4 text-[0.9rem] leading-[1.72] font-light text-place-ink md:mt-10 md:space-y-5 md:text-[0.95rem] md:leading-[1.8]"
            >
              {place.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
