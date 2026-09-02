"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { place } from "../content";
import { NeighborhoodMap } from "./NeighborhoodMap";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function PlaceSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const pinsRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const [selectedId, setSelectedId] = useState<string>(place.pins[0].id);
  const selected =
    place.pins.find((pin) => pin.id === selectedId) ?? place.pins[0];

  useGSAP(
    () => {
      const section = sectionRef.current;
      const frame = frameRef.current;
      const pins = pinsRef.current;
      const title = titleRef.current;
      const subtitle = subtitleRef.current;
      const body = bodyRef.current;
      if (!section || !frame || !pins || !title || !subtitle || !body) return;

      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const desktop = window.matchMedia("(min-width: 768px)").matches;
      const endFrame = desktop
        ? { top: "8%", left: "52%", width: "46%", height: "84%" }
        : { top: "4%", left: "5%", width: "90%", height: "30%" };

      if (reduce) {
        gsap.set(frame, endFrame);
        gsap.set([title, subtitle, body, pins], { autoAlpha: 1, y: 0 });
        return;
      }

      gsap.set(frame, { top: 0, left: 0, width: "100%", height: "100%" });
      gsap.set([title, subtitle, body], { autoAlpha: 0, y: 28 });
      gsap.set(pins, { autoAlpha: 0 });

      const settle = 0.4;
      gsap
        .timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: desktop ? "+=220%" : "+=140%",
            pin: true,
            scrub: 0.4,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        })
        .to({}, { duration: settle })
        .to(frame, { ...endFrame, duration: 1 }, settle)
        .to(title, { autoAlpha: 1, y: 0, duration: 0.35 }, settle + 0.25)
        .to(subtitle, { autoAlpha: 1, y: 0, duration: 0.3 }, settle + 0.4)
        .to(body, { autoAlpha: 1, y: 0, duration: 0.35 }, settle + 0.55)
        .to(pins, { autoAlpha: 1, duration: 0.3 }, settle + 0.7)
        .to({}, { duration: 1.1 });
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

      <div className="relative min-h-[100svh] w-full">
        <div className="absolute inset-0 z-10 flex items-end px-[max(1.25rem,calc((100%-var(--content))/2))] pt-16 pb-8 max-md:pb-8 md:items-center md:py-0">
          <div className="place-copy w-full max-w-lg max-md:max-h-[45svh] max-md:overflow-y-auto md:w-[min(46%,32rem)] md:max-h-none md:overflow-visible">
            <h2
              ref={titleRef}
              className="text-[clamp(1.65rem,3.8vw,2.65rem)] leading-[1.15] font-medium tracking-[0.08em] text-place-ink uppercase"
            >
              <span className="max-md:whitespace-normal md:whitespace-nowrap">
                {place.title}
              </span>
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
              {"home" in selected ? null : (
                <p aria-live="polite">{selected.note}</p>
              )}
              <a
                href={place.directions.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 items-center text-[0.68rem] font-medium tracking-[0.22em] text-place-ink uppercase transition-opacity hover:opacity-70 md:text-[0.75rem]"
              >
                {place.directions.label}
              </a>
            </div>
          </div>
        </div>

        <div
          ref={frameRef}
          className="absolute top-0 left-0 z-20 h-full w-full overflow-hidden will-change-[top,left,width,height]"
        >
          <NeighborhoodMap
            pins={place.pins}
            selectedId={selectedId}
            onSelect={setSelectedId}
            pinsRef={pinsRef}
          />
        </div>
      </div>
    </section>
  );
}
