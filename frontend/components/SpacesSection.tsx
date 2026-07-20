"use client";

import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { spaces } from "../content";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function SpacesSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      const image = sectionRef.current?.querySelector(".spaces-image");
      const copy = sectionRef.current?.querySelectorAll(
        ".spaces-eyebrow, .spaces-headline, .spaces-item",
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
          end: "+=150%",
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
        },
      });

      tl.to(image, { opacity: 1, scale: 1, duration: 0.35 })
        .to(".spaces-eyebrow", { opacity: 1, y: 0, duration: 0.16 }, "+=0.08")
        .to(".spaces-headline", { opacity: 1, y: 0, duration: 0.2 })
        .to(".spaces-item", { opacity: 1, y: 0, duration: 0.14, stagger: 0.12 });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id={spaces.id}
      className="bg-background px-[max(1.25rem,calc((100%-var(--content))/2))] py-[var(--section-pad)]"
    >
      <div className="grid min-h-[70svh] items-center gap-10 md:min-h-[75svh] md:grid-cols-12 md:gap-12">
        <div className="md:col-span-5">
          <p className="spaces-eyebrow text-xs font-medium tracking-[0.2em] text-muted uppercase">
            {spaces.eyebrow}
          </p>
          <h2 className="spaces-headline mt-4 font-display text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.1] tracking-[-0.02em]">
            {spaces.headline}
          </h2>
          <ul className="mt-10 flex flex-col gap-8 md:mt-12 md:gap-10">
            {spaces.items.map((item) => (
              <li
                key={item.title}
                className="spaces-item border-t border-line pt-6"
              >
                <h3 className="font-display text-2xl tracking-[-0.01em]">
                  {item.title}
                </h3>
                <p className="mt-3 max-w-sm text-base leading-relaxed text-muted">
                  {item.body}
                </p>
              </li>
            ))}
          </ul>
        </div>
        <div className="spaces-image relative aspect-[3/4] overflow-hidden md:col-span-7 md:aspect-auto md:min-h-[32rem]">
          <Image
            src={spaces.image.src}
            alt={spaces.image.alt}
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
