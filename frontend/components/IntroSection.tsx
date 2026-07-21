"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { intro } from "../content";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function IntroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const stack = stackRef.current;
      const body = bodyRef.current;
      if (!section || !stack || !body) return;

      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduce) {
        gsap.set(stack, { y: -44 });
        gsap.set(body, { autoAlpha: 1, y: 0 });
        return;
      }

      gsap.set(stack, { y: 0 });
      gsap.set(body, { autoAlpha: 0, y: 140 });

      gsap
        .timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=80%",
            pin: true,
            scrub: 0.4,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        })
        // Título breve → texto entra → hold corto
        .to(stack, { y: -44, duration: 0.7 }, 0.45)
        .to(body, { autoAlpha: 1, y: 0, duration: 0.7 }, 0.45)
        .to({}, { duration: 0.7 });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id={intro.id}
      className="intro-surface relative isolate"
    >
      <div className="intro-grain" aria-hidden />

      <div className="relative z-10 flex h-[100svh] items-center justify-center px-6">
        <div
          ref={stackRef}
          className="relative w-full max-w-xl text-center will-change-transform"
        >
          <h2 className="intro-title text-[clamp(1.75rem,4.5vw,2.75rem)] font-medium tracking-[0.14em] text-intro-ink uppercase">
            {intro.title}
          </h2>
          <p
            ref={bodyRef}
            className="intro-body absolute top-full right-0 left-0 mt-10 text-[0.95rem] leading-[1.75] font-light text-intro-ink md:mt-12 md:text-base md:leading-[1.8]"
            style={{ opacity: 0, visibility: "hidden" }}
          >
            {intro.body}
          </p>
        </div>
      </div>
    </section>
  );
}
