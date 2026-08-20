"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { place } from "../content";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function PlaceSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const title = titleRef.current;
      const subtitle = subtitleRef.current;
      const body = bodyRef.current;
      if (!section || !title || !subtitle || !body) return;

      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const desktop = window.matchMedia("(min-width: 768px)").matches;

      if (reduce) {
        gsap.set([title, subtitle, body], { autoAlpha: 1, y: 0 });
        return;
      }

      gsap.set([title, subtitle, body], { autoAlpha: 0, y: 28 });

      gsap
        .timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: desktop ? "+=120%" : "+=55%",
            pin: true,
            scrub: 0.4,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        })
        .to(title, { autoAlpha: 1, y: 0, duration: 0.35 }, 0.15)
        .to(subtitle, { autoAlpha: 1, y: 0, duration: 0.3 }, 0.3)
        .to(body, { autoAlpha: 1, y: 0, duration: 0.35 }, 0.45)
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
        <div className="absolute inset-0 z-10 flex items-end px-[max(1.25rem,calc((100%-var(--content))/2))] pt-22 pb-10 md:items-center md:py-0">
          <div className="place-copy w-full max-w-lg md:w-[min(46%,32rem)]">
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
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
