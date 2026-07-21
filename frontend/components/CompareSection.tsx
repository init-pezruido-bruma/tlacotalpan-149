"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { compare } from "../content";

gsap.registerPlugin(useGSAP, ScrollTrigger);

function goToTour(unitId: string) {
  const url = new URL(window.location.href);
  url.searchParams.set("unit", unitId);
  url.hash = "recorridos";
  window.history.pushState({}, "", url.toString());
  window.dispatchEvent(new PopStateEvent("popstate"));
  document.getElementById("recorridos")?.scrollIntoView({ behavior: "smooth" });
}

export function CompareSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

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
            end: "+=180%",
            pin: true,
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
      <div className="flex h-[100svh] flex-col justify-center overflow-y-auto px-[max(1.25rem,calc((100%-var(--content))/2))] py-10 md:overflow-hidden md:py-12">
        <h2 className="compare-title text-center text-[clamp(1.15rem,2.6vw,1.75rem)] font-medium tracking-[0.16em] text-compare-ink uppercase">
          {compare.title}
        </h2>

        <div className="mt-10 grid min-h-0 flex-1 grid-cols-1 content-center gap-10 sm:mt-12 sm:grid-cols-2 sm:gap-0 lg:mt-14 lg:grid-cols-4 lg:content-center">
          {compare.items.map((item, i) => (
            <article
              key={item.id}
              className={[
                "compare-col flex flex-col items-center px-4 text-center sm:px-6 lg:px-5",
                i > 0 ? "sm:border-l sm:border-compare-ink/20" : "",
              ].join(" ")}
            >
              <div className="relative aspect-[5760/3652] w-full max-w-[200px] lg:max-w-[220px]">
                <Image
                  src={compare.image.src}
                  alt={compare.image.alt}
                  fill
                  sizes="220px"
                  className="object-contain"
                  onLoad={() => ScrollTrigger.refresh()}
                />
              </div>

              <h3 className="mt-6 text-[0.8rem] font-medium tracking-[0.18em] text-compare-ink uppercase md:mt-8 md:text-[0.85rem]">
                {item.title}
              </h3>

              <ul className="mt-4 space-y-1.5 text-[0.75rem] leading-relaxed font-light text-compare-ink/75 md:mt-5 md:text-[0.8rem]">
                {item.features.map((line, idx) => (
                  <li key={`${item.id}-${idx}`}>{line}</li>
                ))}
              </ul>

              <div className="mt-6 flex w-full max-w-[11.5rem] flex-col gap-2.5 md:mt-8">
                <a
                  href={`/?unit=${encodeURIComponent(item.unitId)}#recorridos`}
                  onClick={(e) => {
                    e.preventDefault();
                    goToTour(item.unitId);
                  }}
                  className="rounded-full border border-compare-ink/70 px-4 py-2 text-[0.65rem] tracking-[0.1em] text-compare-ink uppercase transition-colors hover:border-compare-ink hover:bg-compare-ink/5"
                >
                  {compare.tourCta}
                </a>
                <a
                  href={compare.visitHref}
                  className="rounded-full bg-[linear-gradient(105deg,var(--hero-green-mid),var(--hero-green-deep))] px-4 py-2 text-[0.65rem] tracking-[0.1em] text-hero-ink uppercase transition-opacity hover:opacity-90"
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
