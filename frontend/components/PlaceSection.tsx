"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { place } from "../content";
import { NeighborhoodMap } from "./NeighborhoodMap";

gsap.registerPlugin(useGSAP, ScrollTrigger);

function notifyMapResize() {
  window.dispatchEvent(new Event("place-map-resize"));
}

export function PlaceSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const pinsRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  const allPlaces: ReadonlyArray<{
    id: string;
    label: string;
    walk: string;
    lat: number;
    lng: number;
  }> = place.categories.flatMap((category) => [...category.places]);
  const [selectedId, setSelectedId] = useState<string>(place.map.home.id);

  const mapPins = [
    { ...place.map.home, home: true as const },
    ...allPlaces.map((item) => ({
      id: item.id,
      label: item.label,
      walk: item.walk,
      lat: item.lat,
      lng: item.lng,
    })),
  ];

  useGSAP(
    () => {
      const section = sectionRef.current;
      const frame = frameRef.current;
      const pins = pinsRef.current;
      const panel = panelRef.current;
      const title = titleRef.current;
      const subtitle = subtitleRef.current;
      const body = bodyRef.current;
      if (!section || !frame || !pins || !panel || !title || !subtitle || !body)
        return;

      const mm = gsap.matchMedia();

      // Solo limpia props del morph del mapa (nunca del panel).
      const clearFrameMorph = () => {
        gsap.set(frame, {
          clearProps:
            "top,left,right,bottom,width,height,borderRadius,transform",
        });
      };

      mm.add("(prefers-reduced-motion: reduce)", () => {
        clearFrameMorph();
        gsap.set([title, subtitle, body, pins, panel], { autoAlpha: 1, y: 0 });
        notifyMapResize();
      });

      mm.add(
        "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
        () => {
          const endFrame = {
            top: "6%",
            left: "3%",
            width: "46%",
            height: "88%",
            borderRadius: "1.75rem",
          };

          // top/left/width/height sin right/bottom (evita pelear con inset)
          gsap.set(frame, {
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            borderRadius: 0,
            clearProps: "right,bottom",
          });
          gsap.set([title, subtitle, body, panel], { autoAlpha: 0, y: 24 });
          gsap.set(pins, { opacity: 0 });

          const settle = 0.35;
          gsap
            .timeline({
              defaults: { ease: "none" },
              scrollTrigger: {
                trigger: section,
                start: "top top",
                end: "+=200%",
                pin: true,
                pinType: "fixed",
                scrub: 0.4,
                anticipatePin: 1,
                invalidateOnRefresh: true,
                onEnter: notifyMapResize,
                onEnterBack: notifyMapResize,
                onRefresh: notifyMapResize,
                onUpdate: notifyMapResize,
              },
            })
            .to({}, { duration: settle })
            .to(
              frame,
              {
                ...endFrame,
                duration: 1,
                onUpdate: notifyMapResize,
              },
              settle,
            )
            .to(panel, { autoAlpha: 1, y: 0, duration: 0.35 }, settle + 0.35)
            .to(title, { autoAlpha: 1, y: 0, duration: 0.3 }, settle + 0.4)
            .to(subtitle, { autoAlpha: 1, y: 0, duration: 0.28 }, settle + 0.5)
            .to(body, { autoAlpha: 1, y: 0, duration: 0.35 }, settle + 0.6)
            .to(pins, { opacity: 1, duration: 0.3 }, settle + 0.75)
            .to({}, { duration: 1 });
        },
      );

      mm.add(
        "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
        () => {
          clearFrameMorph();
          gsap.set([title, subtitle, body, panel], { autoAlpha: 0, y: 18 });
          gsap.set(pins, { opacity: 0 });
          notifyMapResize();

          gsap
            .timeline({
              defaults: { ease: "none" },
              scrollTrigger: {
                trigger: section,
                start: "top top",
                end: "+=75%",
                pin: true,
                pinType: "fixed",
                scrub: 0.3,
                anticipatePin: 1,
                invalidateOnRefresh: true,
                onEnter: notifyMapResize,
                onEnterBack: notifyMapResize,
                onRefresh: notifyMapResize,
                onUpdate: notifyMapResize,
              },
            })
            .to(panel, { autoAlpha: 1, y: 0, duration: 0.25 }, 0)
            .to(title, { autoAlpha: 1, y: 0, duration: 0.22 }, 0.02)
            .to(subtitle, { autoAlpha: 1, y: 0, duration: 0.2 }, 0.06)
            .to(body, { autoAlpha: 1, y: 0, duration: 0.25 }, 0.1)
            .to(pins, { opacity: 1, duration: 0.2 }, 0.14)
            .to({}, { duration: 0.45 });
        },
      );

      return () => mm.revert();
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

      <div className="relative flex min-h-[100svh] w-full flex-col gap-3 px-4 py-3 md:block md:gap-0 md:px-0 md:py-0">
        {/*
          Desktop: absolute top/left/w/h (sin inset-0) para que GSAP pueda
          morphar sin pelear con right/bottom.
          Móvil: franja superior en flujo de columna.
        */}
        <div
          ref={frameRef}
          className="relative z-0 h-[min(34svh,15.5rem)] w-full shrink-0 overflow-hidden rounded-[1.25rem] will-change-[top,left,width,height,border-radius] md:absolute md:top-0 md:left-0 md:z-20 md:h-full md:w-full md:rounded-none"
        >
          <NeighborhoodMap
            center={place.map.center}
            zoom={place.map.zoom}
            pins={mapPins}
            selectedId={selectedId}
            onSelect={setSelectedId}
            pinsRef={pinsRef}
          />
        </div>

        <div
          ref={panelRef}
          className="relative z-10 flex min-h-0 w-full flex-1 flex-col md:absolute md:inset-y-[6%] md:right-[3%] md:left-auto md:w-[46%] md:max-h-none"
          style={{ opacity: 0, visibility: "hidden" }}
        >
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[1.25rem] border border-place-ink/35 px-4 py-4 md:rounded-[1.75rem] md:px-8 md:py-9">
            <h2
              ref={titleRef}
              className="text-[clamp(1.35rem,6vw,2.45rem)] leading-[1.12] font-medium tracking-[0.1em] text-place-ink uppercase md:text-[clamp(1.55rem,3.4vw,2.45rem)]"
            >
              {place.title}
            </h2>
            <p
              ref={subtitleRef}
              className="mt-2 text-[0.62rem] font-medium tracking-[0.18em] text-place-ink/85 uppercase md:mt-4 md:text-[0.72rem] md:tracking-[0.2em]"
            >
              {place.subtitle}
            </p>

            <div
              ref={bodyRef}
              className="mt-3 min-h-0 flex-1 overflow-y-auto overscroll-contain md:mt-7"
            >
              <div className="divide-y divide-place-ink/25 border-t border-place-ink/30">
                {place.categories.map((category) => (
                  <div key={category.id} className="py-3.5 md:py-6">
                    <h3 className="text-[0.65rem] font-medium tracking-[0.18em] text-place-ink uppercase md:text-[0.72rem]">
                      {category.title}
                    </h3>
                    <ul className="mt-2.5 space-y-2 md:mt-3.5 md:space-y-3">
                      {category.places.map((item) => {
                        const selected = item.id === selectedId;
                        return (
                          <li key={item.id}>
                            <button
                              type="button"
                              onClick={() => setSelectedId(item.id)}
                              aria-pressed={selected}
                              className={`flex w-full min-h-10 items-baseline gap-2 text-left text-[0.8rem] leading-snug transition-opacity md:text-[0.9rem] ${
                                selected
                                  ? "text-place-ink"
                                  : "text-place-ink/80 hover:text-place-ink"
                              }`}
                            >
                              <span className="shrink-0">{item.label}</span>
                              <span
                                aria-hidden
                                className="mb-[0.3em] min-h-0 min-w-4 flex-1 border-b border-dotted border-place-ink/45"
                              />
                              <span className="shrink-0 tracking-[0.04em]">
                                {item.walk}
                              </span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>

              <p className="mt-1 pb-1 text-[0.6rem] leading-relaxed text-place-ink/70 italic md:text-[0.68rem]">
                {place.footnote}
              </p>
              <a
                href={place.directions.href}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex min-h-11 items-center text-[0.62rem] font-medium tracking-[0.18em] text-place-ink uppercase transition-opacity hover:opacity-70 md:mt-3 md:text-[0.7rem] md:tracking-[0.2em]"
              >
                {place.directions.label}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
