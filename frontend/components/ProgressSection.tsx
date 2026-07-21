"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { progress } from "../content";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const RADIUS = 46;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function ProgressSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const ringRef = useRef<SVGCircleElement>(null);
  const valueRef = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const ring = ringRef.current;
      const value = valueRef.current;
      if (!section || !ring || !value) return;

      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      const targetOffset =
        CIRCUMFERENCE * (1 - progress.percent / 100);

      if (reduce) {
        gsap.set(ring, { strokeDashoffset: targetOffset });
        value.textContent = `${progress.percent}%`;
        return;
      }

      gsap.set(ring, { strokeDashoffset: CIRCUMFERENCE });
      value.textContent = "0%";

      const proxy = { p: 0 };

      gsap
        .timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=120%",
            pin: true,
            scrub: true,
            anticipatePin: 1,
          },
        })
        .to(ring, { strokeDashoffset: targetOffset, duration: 1 }, 0)
        .to(
          proxy,
          {
            p: progress.percent,
            duration: 1,
            onUpdate: () => {
              value.textContent = `${Math.round(proxy.p)}%`;
            },
          },
          0,
        )
        .to({}, { duration: 0.35 });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id={progress.id}
      className="progress-surface relative isolate overflow-hidden"
    >
      <div className="progress-grain" aria-hidden />

      <div className="relative z-10 flex h-[100svh] items-center justify-center px-6">
        <div className="flex items-center gap-6 md:gap-12 lg:gap-16">
          <p className="text-[0.65rem] font-medium tracking-[0.28em] text-plans-ink uppercase md:text-xs">
            {progress.left}
          </p>

          <div className="relative size-[min(52vw,280px)] md:size-[320px]">
            <svg
              viewBox="0 0 100 100"
              className="size-full -rotate-90"
              aria-hidden
            >
              <circle
                cx="50"
                cy="50"
                r={RADIUS}
                fill="none"
                stroke="currentColor"
                strokeWidth="0.55"
                className="text-plans-ink/25"
              />
              <circle
                ref={ringRef}
                cx="50"
                cy="50"
                r={RADIUS}
                fill="none"
                stroke="currentColor"
                strokeWidth="0.55"
                strokeLinecap="butt"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={CIRCUMFERENCE}
                className="text-plans-ink"
              />
            </svg>
            <p
              ref={valueRef}
              className="absolute inset-0 flex items-center justify-center text-[clamp(2.5rem,8vw,4.25rem)] font-light tracking-tight text-plans-ink"
            >
              {progress.percent}%
            </p>
          </div>

          <p className="text-[0.65rem] font-medium tracking-[0.28em] text-plans-ink uppercase md:text-xs">
            {progress.right}
          </p>
        </div>
      </div>
    </section>
  );
}
