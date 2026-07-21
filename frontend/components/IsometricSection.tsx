"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { isometric } from "../content";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function IsometricSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const fullRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const full = fullRef.current;
      if (!section || !full) return;

      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduce) {
        gsap.set(full, { autoAlpha: 0 });
        return;
      }

      gsap.set(full, { autoAlpha: 1 });

      gsap
        .timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=160%",
            pin: true,
            scrub: true,
            anticipatePin: 1,
          },
        })
        .to({}, { duration: 0.25 })
        .to(full, { autoAlpha: 0, duration: 1 })
        .to({}, { duration: 0.35 });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id={isometric.id}
      className="iso-surface relative isolate overflow-hidden"
    >
      <div className="relative flex h-[100svh] items-center justify-center px-4 md:px-10">
        <div className="relative aspect-[2200/1394] w-full max-w-6xl">
          {/* Base: isométrico recortado (solo el proyecto) */}
          <Image
            src={isometric.cut.src}
            alt={isometric.cut.alt}
            fill
            unoptimized
            priority
            sizes="(max-width: 1024px) 100vw, 1152px"
            className="object-contain"
            onLoad={() => ScrollTrigger.refresh()}
          />

          {/* Capa superior: contexto completo — se difumina con el scroll */}
          <div
            ref={fullRef}
            className="absolute inset-0"
          >
            <Image
              src={isometric.full.src}
              alt={isometric.full.alt}
              fill
              unoptimized
              sizes="(max-width: 1024px) 100vw, 1152px"
              className="object-contain"
              priority
              onLoad={() => ScrollTrigger.refresh()}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
