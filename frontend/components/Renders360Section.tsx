"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { panoramas } from "../content";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const PanoramaCanvas = dynamic(
  () =>
    import("./PanoramaCanvas").then((mod) => mod.PanoramaCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 bg-[#0c0e0a]" aria-hidden />
    ),
  },
);

type Space = {
  id: string;
  title: string;
  body: string;
  src: string;
};

type Unit = {
  id: string;
  label: string;
  spaces: readonly Space[];
};

const units = panoramas.units as readonly Unit[];

function resolveSpaceIndex(
  unit: Unit,
  preferredId: string | null,
  fallbackIndex: number,
): number {
  if (!unit.spaces.length) return 0;
  if (preferredId) {
    const match = unit.spaces.findIndex((s) => s.id === preferredId);
    if (match >= 0) return match;
  }
  return Math.min(fallbackIndex, unit.spaces.length - 1);
}

export function Renders360Section() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(false);

  const initialUnit =
    units.find((u) => u.spaces.length > 0) ?? units[0];

  const [unitId, setUnitId] = useState(initialUnit.id);
  const [spaceIndex, setSpaceIndex] = useState(0);
  const [spaceId, setSpaceId] = useState<string | null>(
    initialUnit.spaces[0]?.id ?? null,
  );

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setActive(true);
      },
      { rootMargin: "200px 0px", threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      if (reduce) return;

      gsap
        .timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=200%",
            pin: true,
            scrub: true,
            anticipatePin: 1,
          },
        })
        .to({}, { duration: 1 });
    },
    { scope: sectionRef },
  );

  const unit = useMemo(
    () => units.find((u) => u.id === unitId) ?? initialUnit,
    [unitId, initialUnit],
  );

  const spaces = unit.spaces;
  const index = resolveSpaceIndex(unit, spaceId, spaceIndex);
  const space = spaces[index];
  const prev = spaces[(index - 1 + spaces.length) % spaces.length];
  const next = spaces[(index + 1) % spaces.length];

  const goSpace = useCallback(
    (nextIndex: number) => {
      if (!spaces.length) return;
      const wrapped = (nextIndex + spaces.length) % spaces.length;
      setSpaceIndex(wrapped);
      setSpaceId(spaces[wrapped].id);
    },
    [spaces],
  );

  const selectUnit = useCallback(
    (nextUnit: Unit) => {
      if (!nextUnit.spaces.length) return;
      const nextIndex = resolveSpaceIndex(nextUnit, spaceId, spaceIndex);
      setUnitId(nextUnit.id);
      setSpaceIndex(nextIndex);
      setSpaceId(nextUnit.spaces[nextIndex]?.id ?? null);
    },
    [spaceId, spaceIndex],
  );

  if (!space) return null;

  return (
    <section
      ref={sectionRef}
      id={panoramas.id}
      className="relative isolate h-[100svh] overflow-hidden bg-[#0c0e0a]"
      aria-label="Recorrido 360"
    >
      <div className="absolute inset-0">
        {active ? (
          <PanoramaCanvas src={space.src} />
        ) : (
          <div className="absolute inset-0 bg-[#0c0e0a]" aria-hidden />
        )}
      </div>

      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_42%,rgba(8,10,6,0.45)_100%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-black/55 to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/50 to-transparent"
        aria-hidden
      />

      <div className="pointer-events-none absolute top-0 left-0 z-10 max-w-[min(22rem,70vw)] px-5 pt-24 md:px-8 md:pt-28">
        <h2 className="text-[clamp(1.15rem,2.4vw,1.65rem)] leading-tight font-medium tracking-[0.14em] text-white uppercase">
          {space.title}
        </h2>
        <p className="mt-4 max-w-xs text-[0.8rem] leading-[1.7] font-light text-white/80 md:text-[0.85rem]">
          {space.body}
        </p>
      </div>

      {spaces.length > 1 && prev && next && (
        <>
          <button
            type="button"
            onClick={() => goSpace(index - 1)}
            className="absolute top-1/2 left-2 z-10 flex -translate-y-1/2 flex-col items-center gap-2 px-1 py-3 text-white/90 transition-opacity hover:opacity-100 md:left-4"
            aria-label={`Ir a ${prev.title}`}
          >
            <span className="[writing-mode:vertical-rl] rotate-180 text-[0.7rem] font-medium tracking-[0.22em] uppercase md:text-xs">
              {prev.title}
            </span>
            <ChevronSide direction="prev" />
          </button>

          <button
            type="button"
            onClick={() => goSpace(index + 1)}
            className="absolute top-1/2 right-2 z-10 flex -translate-y-1/2 flex-col items-center gap-2 px-1 py-3 text-white/90 transition-opacity hover:opacity-100 md:right-4"
            aria-label={`Ir a ${next.title}`}
          >
            <span className="[writing-mode:vertical-rl] rotate-180 text-[0.7rem] font-medium tracking-[0.22em] uppercase md:text-xs">
              {next.title}
            </span>
            <ChevronSide direction="next" />
          </button>
        </>
      )}

      <div className="absolute bottom-6 left-5 z-10 flex flex-col items-start gap-2.5 md:bottom-8 md:left-8">
        {units.map((u) => {
          const available = u.spaces.length > 0;
          const selected = u.id === unitId;
          return (
            <button
              key={u.id}
              type="button"
              disabled={!available}
              title={available ? undefined : "Renders próximamente"}
              onClick={() => selectUnit(u)}
              className={[
                "rounded-full border px-4 py-1.5 text-[0.7rem] tracking-[0.08em] transition-colors md:text-xs",
                selected
                  ? "border-white bg-white/15 text-white"
                  : available
                    ? "border-white/70 text-white/90 hover:border-white hover:bg-white/10"
                    : "cursor-not-allowed border-white/25 text-white/35",
              ].join(" ")}
            >
              {u.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}

function ChevronSide({ direction }: { direction: "prev" | "next" }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden
      className={direction === "prev" ? "rotate-90" : "-rotate-90"}
    >
      <path
        d="M3.5 5.25 L7 8.75 L10.5 5.25"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
