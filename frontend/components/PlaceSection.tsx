"use client";

import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { place } from "../content";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function PlaceSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      const image = sectionRef.current?.querySelector(".place-image");
      const copy = sectionRef.current?.querySelectorAll(
        ".place-eyebrow, .place-headline, .place-body",
      );

      if (!image || !copy?.length) return;

      if (reduce) {
        gsap.set([image, ...copy], { opacity: 1, y: 0, scale: 1 });
        return;
      }

      gsap.set(image, { opacity: 0, scale: 0.94 });
      gsap.set(copy, { opacity: 0, y: 32 });

      const tl = gsap.timeline({
        defaults: { ease: "power2.out" },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=120%",
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
        },
      });

      tl.to(image, { opacity: 1, scale: 1, duration: 0.35 })
        .to(".place-eyebrow", { opacity: 1, y: 0, duration: 0.18 }, "+=0.08")
        .to(".place-headline", { opacity: 1, y: 0, duration: 0.22 })
        .to(".place-body", { opacity: 1, y: 0, duration: 0.18 });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id={place.id}
      className="bg-surface px-[max(1.25rem,calc((100%-var(--content))/2))] py-[var(--section-pad)]"
    >
      <div className="grid min-h-[70svh] items-center gap-10 md:min-h-[75svh] md:grid-cols-12 md:gap-12">
        <div className="md:col-span-5">
          <p className="place-eyebrow text-xs font-medium tracking-[0.2em] text-muted uppercase">
            {place.eyebrow}
          </p>
          <h2 className="place-headline mt-4 font-display text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.1] tracking-[-0.02em]">
            {place.headline}
          </h2>
          <p className="place-body mt-6 max-w-sm text-base leading-relaxed text-muted">
            {place.body}
          </p>
        </div>
        <div className="place-image relative aspect-[4/5] overflow-hidden md:col-span-7 md:aspect-[5/4]">
          <Image
            src={place.image.src}
            alt={place.image.alt}
            fill
            sizes="(max-width: 768px) 100vw, 58vw"
            className="object-cover"
            onLoad={() => ScrollTrigger.refresh()}
          />
        </div>
      </div>
    </section>
  );
}
