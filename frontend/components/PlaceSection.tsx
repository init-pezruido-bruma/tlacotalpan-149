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

      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const desktop = window.matchMedia("(min-width: 768px)").matches;
      const endFrame = desktop
        ? {
            top: "6%",
            left: "3%",
            width: "46%",
            height: "88%",
            borderRadius: "1.75rem",
          }
        : {
            top: "3.5%",
            left: "4%",
            width: "92%",
            height: "34%",
            borderRadius: "1.25rem",
          };

      if (reduce) {
        gsap.set(frame, endFrame);
        gsap.set([title, subtitle, body, pins, panel], { autoAlpha: 1, y: 0 });
        notifyMapResize();
        return;
      }

      gsap.set(frame, {
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        borderRadius: 0,
      });
      // Panel/copy: autoAlpha OK. El mapa nunca usa visibility:hidden.
      gsap.set([title, subtitle, body, panel], { autoAlpha: 0, y: 24 });
      gsap.set(pins, { opacity: 0 });

      const settle = 0.35;
      gsap
        .timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: desktop ? "+=200%" : "+=130%",
            pin: true,
            // fixed evita transform en el pin (MapLibre + WebGL)
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
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id={place.id}
      className="place-surface relative isolate overflow-hidden"
    >
      <div className="place-grain" aria-hidden />

      <div className="relative min-h-[100svh] w-full">
        <div
          ref={panelRef}
          className="absolute inset-x-[4%] top-[40%] z-10 flex max-h-[56svh] flex-col md:inset-y-[6%] md:right-[3%] md:left-auto md:max-h-none md:w-[46%]"
        >
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[1.25rem] border border-place-ink/35 px-5 py-6 md:rounded-[1.75rem] md:px-8 md:py-9">
            <h2
              ref={titleRef}
              className="text-[clamp(1.55rem,3.4vw,2.45rem)] leading-[1.12] font-medium tracking-[0.1em] text-place-ink uppercase"
            >
              {place.title}
            </h2>
            <p
              ref={subtitleRef}
              className="mt-3 text-[0.65rem] font-medium tracking-[0.2em] text-place-ink/85 uppercase md:mt-4 md:text-[0.72rem]"
            >
              {place.subtitle}
            </p>

            <div
              ref={bodyRef}
              className="mt-5 min-h-0 flex-1 overflow-y-auto md:mt-7"
            >
              <div className="divide-y divide-place-ink/25 border-t border-place-ink/30">
                {place.categories.map((category) => (
                  <div key={category.id} className="py-5 md:py-6">
                    <h3 className="text-[0.68rem] font-medium tracking-[0.18em] text-place-ink uppercase md:text-[0.72rem]">
                      {category.title}
                    </h3>
                    <ul className="mt-3 space-y-2.5 md:mt-3.5 md:space-y-3">
                      {category.places.map((item) => {
                        const selected = item.id === selectedId;
                        return (
                          <li key={item.id}>
                            <button
                              type="button"
                              onClick={() => setSelectedId(item.id)}
                              aria-pressed={selected}
                              className={`flex w-full min-h-10 items-baseline gap-2 text-left text-[0.82rem] leading-snug transition-opacity md:text-[0.9rem] ${
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

              <p className="mt-1 pb-1 text-[0.62rem] leading-relaxed text-place-ink/70 italic md:text-[0.68rem]">
                {place.footnote}
              </p>
              <a
                href={place.directions.href}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex min-h-11 items-center text-[0.65rem] font-medium tracking-[0.2em] text-place-ink uppercase transition-opacity hover:opacity-70 md:text-[0.7rem]"
              >
                {place.directions.label}
              </a>
            </div>
          </div>
        </div>

        <div
          ref={frameRef}
          className="absolute top-0 left-0 z-20 h-full w-full overflow-hidden will-change-[top,left,width,height,border-radius]"
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
      </div>
    </section>
  );
}
