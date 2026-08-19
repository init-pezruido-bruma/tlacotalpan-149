"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scheduleScrollRefresh } from "../lib/scrollRefresh";
import { plans } from "../content";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function PlansSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const track = trackRef.current;
      if (!section || !track) return;

      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const desktop = window.matchMedia("(min-width: 768px)").matches;

      const getEndGutter = () =>
        parseFloat(getComputedStyle(track).paddingRight) || 20;

      const getScrollDistance = () => {
        const last = track.querySelector(".plans-item:last-child");
        if (!(last instanceof HTMLElement)) return 0;
        const currentX = Number(gsap.getProperty(track, "x")) || 0;
        const lastRight = last.getBoundingClientRect().right - currentX;
        return Math.max(0, lastRight - window.innerWidth + getEndGutter());
      };

      const getHold = () => Math.round(window.innerHeight * 0.12);

      if (reduce || !desktop) {
        gsap.set(track, { x: 0 });
        return;
      }

      const imgs = Array.from(track.querySelectorAll("img"));
      Promise.all(
        imgs.map((img) =>
          img.complete
            ? Promise.resolve()
            : new Promise<void>((resolve) => {
                img.addEventListener("load", () => resolve(), { once: true });
                img.addEventListener("error", () => resolve(), { once: true });
              }),
        ),
      ).then(() => scheduleScrollRefresh());

      gsap
        .timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${getScrollDistance() + getHold()}`,
            pin: true,
            scrub: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        })
        .to({}, { duration: 0.08 })
        .to(track, {
          x: () => -getScrollDistance(),
          duration: 1,
        });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id={plans.id}
      className="plans-surface relative isolate overflow-hidden"
    >
      <div className="plans-grain" aria-hidden />

      <div className="relative flex min-h-[100svh] flex-col">
        <header className="relative z-10 flex shrink-0 flex-col items-start justify-between gap-2 px-[max(1.25rem,calc((100%-var(--content))/2))] pt-10 pb-5 md:flex-row md:items-end md:gap-6 md:pt-12 md:pb-6">
          <h2 className="text-[0.7rem] font-medium tracking-[0.28em] text-plans-ink uppercase md:text-xs">
            {plans.eyebrow}
          </h2>
          <p className="text-[0.7rem] font-medium tracking-[0.28em] text-plans-ink/70 uppercase md:text-xs">
            {plans.label}
          </p>
        </header>
        <div className="mx-[max(1.25rem,calc((100%-var(--content))/2))] h-px shrink-0 bg-plans-ink/25" />

        <div className="relative flex min-h-0 flex-1 items-center overflow-x-auto pb-4 md:overflow-hidden md:pb-0">
          <div
            ref={trackRef}
            className="plans-track flex items-start gap-10 pr-5 will-change-transform snap-x snap-mandatory md:gap-28 md:pr-0 md:snap-none"
            style={{
              paddingLeft:
                "max(1.25rem, calc((100% - var(--content)) / 2))",
              paddingRight: "1.25rem",
            }}
          >
            {plans.items.map((item) => (
              <article
                key={item.src}
                className="plans-item flex shrink-0 snap-start flex-col"
              >
                <div className="relative flex h-[40vh] items-end justify-start md:h-[50vh]">
                  <Image
                    src={item.src}
                    alt={item.title}
                    width={item.width}
                    height={item.height}
                    className="h-full w-auto max-w-[var(--content)] object-contain object-left-bottom"
                    sizes="var(--content)"
                  />
                </div>
                <h3 className="mt-6 max-w-[18rem] text-[0.8rem] leading-snug font-medium tracking-[0.14em] text-plans-ink uppercase md:mt-10 md:text-[0.9rem]">
                  {item.title}
                </h3>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
