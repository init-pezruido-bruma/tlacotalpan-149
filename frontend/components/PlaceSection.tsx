"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { place } from "../content";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function PlaceSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const frame = frameRef.current;
      const title = titleRef.current;
      const subtitle = subtitleRef.current;
      const body = bodyRef.current;
      if (!section || !frame || !title || !subtitle || !body) return;

      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      const desktop = window.matchMedia("(min-width: 768px)").matches;
      const endFrame = desktop
        ? { top: "10%", left: "54%", width: "42%", height: "80%" }
        : { top: "5%", left: "6%", width: "88%", height: "38%" };

      if (reduce) {
        gsap.set(frame, endFrame);
        gsap.set([title, subtitle, body], { autoAlpha: 1, y: 0 });
        return;
      }

      gsap.set(frame, { top: 0, left: 0, width: "100%", height: "100%" });
      gsap.set([title, subtitle, body], { autoAlpha: 0, y: 28 });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          // Un poco más de recorrido: hold inicial + transición + hold final
          end: "+=240%",
          pin: true,
          // Scrub directo: sin lag que deje el texto a medias al pasar a planos
          scrub: true,
          fastScrollEnd: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Hold breve con la imagen full-bleed antes de encoger el frame
      const settle = 0.4;
      tl.to({}, { duration: settle });
      tl.to(frame, { ...endFrame, duration: 1 }, settle);
      tl.to(title, { autoAlpha: 1, y: 0, duration: 0.35 }, settle + 0.25);
      tl.to(subtitle, { autoAlpha: 1, y: 0, duration: 0.3 }, settle + 0.4);
      tl.to(body, { autoAlpha: 1, y: 0, duration: 0.35 }, settle + 0.55);
      // Hold con composición final ya armada
      tl.to({}, { duration: 1.2 });
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

      <div className="relative h-[100svh] w-full">
        <div className="absolute inset-0 z-10 flex items-end px-[max(1.25rem,calc((100%-var(--content))/2))] pt-24 pb-14 md:items-center md:py-0">
          <div className="place-copy w-full max-w-lg md:w-[min(46%,32rem)]">
            <h2
              ref={titleRef}
              className="text-[clamp(1.65rem,3.8vw,2.65rem)] leading-[1.15] font-medium tracking-[0.08em] text-place-ink uppercase"
            >
              <span className="whitespace-nowrap">{place.title}</span>
              <br />
              {place.titleLine2}
            </h2>
            <p
              ref={subtitleRef}
              className="mt-8 text-[0.7rem] font-medium tracking-[0.22em] text-place-ink uppercase md:mt-10 md:text-xs"
            >
              {place.subtitle}
            </p>
            <p
              ref={bodyRef}
              className="mt-8 max-w-sm text-[0.9rem] leading-[1.75] font-light text-place-ink md:mt-10 md:text-[0.95rem] md:leading-[1.8]"
            >
              {place.body}
            </p>
          </div>
        </div>

        <div
          ref={frameRef}
          className="place-frame absolute top-0 left-0 z-20 h-full w-full overflow-hidden will-change-[top,left,width,height]"
        >
          <Image
            src={place.image.src}
            alt={place.image.alt}
            fill
            priority
            sizes="(max-width: 767px) 88vw, 42vw"
            className="object-cover"
            onLoad={() => ScrollTrigger.refresh()}
          />
        </div>
      </div>
    </section>
  );
}
