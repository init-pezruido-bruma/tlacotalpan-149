"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function PageMotion({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduce) {
        gsap.set(
          [
            ".hero-brand",
            ".hero-headline",
            ".hero-support",
            ".hero-cta",
            ".reveal",
          ],
          { opacity: 1, y: 0 },
        );
        return;
      }

      const heroTl = gsap.timeline({ defaults: { ease: "power2.out" } });
      heroTl
        .from(".hero-brand", { opacity: 0, y: 16, duration: 0.7 }, 0.15)
        .from(".hero-headline", { opacity: 0, y: 28, duration: 0.9 }, 0.28)
        .from(".hero-support", { opacity: 0, y: 20, duration: 0.75 }, 0.45)
        .from(".hero-cta", { opacity: 0, y: 14, duration: 0.6 }, 0.62);

      gsap.utils.toArray<HTMLElement>(".reveal").forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: 36,
          duration: 0.9,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            toggleActions: "play none none none",
          },
        });
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className="flex min-h-full flex-col">
      {children}
    </div>
  );
}
