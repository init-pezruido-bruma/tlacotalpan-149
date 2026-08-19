"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scheduleScrollRefresh } from "../lib/scrollRefresh";
import { compare } from "../content";
import { goToTour } from "../lib/goToTour";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function CompareSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const desktop = window.matchMedia("(min-width: 768px)").matches;

      const title = section.querySelector(".compare-title");
      const cols = section.querySelectorAll(".compare-col");

      if (reduce) {
        gsap.set([title, cols], { autoAlpha: 1, y: 0 });
        return;
      }

      gsap.set([title, cols], { autoAlpha: 0, y: 20 });

      gsap
        .timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: desktop ? "+=180%" : "+=60%",
            pin: desktop,
            scrub: true,
            anticipatePin: 1,
          },
        })
        .to(title, { autoAlpha: 1, y: 0, duration: 0.35 })
        .to(
          cols,
          { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.06 },
          "-=0.15",
        )
        .to({}, { duration: 1 });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id={compare.id}
      className="compare-surface relative isolate overflow-hidden"
    >
      <div className="flex min-h-[100svh] flex-col justify-center overflow-y-auto px-[max(1.25rem,calc((100%-var(--content))/2))] py-8 md:h-[100svh] md:overflow-hidden md:py-8">
        <h2 className="compare-title text-center text-[clamp(1.15rem,2.6vw,1.75rem)] font-medium tracking-[0.16em] text-compare-ink uppercase">
          {compare.title}
        </h2>

        <div className="mt-6 grid min-h-0 flex-1 grid-cols-1 content-center gap-8 sm:mt-8 sm:grid-cols-2 sm:items-stretch sm:gap-0 lg:mt-10 lg:grid-cols-3">
          {compare.items.map((item, i) => (
            <article
              key={item.id}
              className={[
                "compare-col flex min-h-0 flex-col items-center px-4 text-center sm:px-5 lg:px-4",
                i > 0 ? "sm:border-l sm:border-compare-ink/20" : "",
              ].join(" ")}
            >
              <div className="relative mx-auto aspect-[5760/3652] w-full max-w-[min(200px,24vw)] shrink-0 lg:max-w-[220px]">
                {"images" in item ? (
                  item.images.map((img, layerIndex) => (
                    <div
                      key={img.src}
                      className="absolute inset-0 origin-bottom"
                      style={{
                        zIndex: layerIndex,
                        transform: `translate(${img.stack.x}%, ${img.stack.y}%)`,
                      }}
                    >
                      <Image
                        src={img.src}
                        alt={img.alt}
                        fill
                        sizes="220px"
                        className="object-contain object-bottom"
                        onLoad={scheduleScrollRefresh}
                      />
                    </div>
                  ))
                ) : (
                  <Image
                    src={item.image.src}
                    alt={item.image.alt}
                    fill
                    sizes="220px"
                    className="object-contain object-bottom"
                    onLoad={scheduleScrollRefresh}
                  />
                )}
              </div>

              <h3 className="mt-4 text-[0.8rem] font-medium tracking-[0.18em] text-compare-ink uppercase md:text-[0.85rem]">
                {item.title}
              </h3>

              <ul className="mt-3 flex-1 space-y-1 text-[0.72rem] leading-snug font-light text-compare-ink/75 md:text-[0.78rem]">
                {item.features.map((line, idx) => (
                  <li key={`${item.id}-${idx}`}>{line}</li>
                ))}
              </ul>

              <div className="mt-4 flex w-full max-w-[11.5rem] shrink-0 flex-col gap-2 md:mt-5">
                <button
                  type="button"
                  onClick={() => goToTour(item.unitId)}
                  className="min-h-11 cursor-pointer rounded-full border border-compare-ink/70 px-4 py-2 text-[0.65rem] tracking-[0.1em] text-compare-ink uppercase transition-colors hover:border-compare-ink hover:bg-compare-ink/5"
                >
                  {compare.tourCta}
                </button>
                <a
                  href={compare.visitHref}
                  className="inline-flex min-h-11 items-center justify-center rounded-full bg-[linear-gradient(105deg,var(--hero-green-mid),var(--hero-green-deep))] px-4 py-2 text-[0.65rem] tracking-[0.1em] text-hero-ink uppercase transition-opacity hover:opacity-90"
                >
                  {compare.visitCta}
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
