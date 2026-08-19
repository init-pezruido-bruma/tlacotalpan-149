"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scheduleScrollRefresh } from "../lib/scrollRefresh";
import { panoramas } from "../content";
import {
  exitTourToCompare,
  TOUR_EVENT,
  type TourEventDetail,
} from "../lib/goToTour";

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
  src: string;
  yaw?: number;
};

type Sheet = {
  title: string;
  summary: readonly string[];
  stats: readonly { label: string; value: string }[];
  highlights: readonly string[];
  cta: { label: string; href: string };
  plan: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
};

type Unit = {
  id: string;
  label: string;
  spaces: readonly Space[];
  sheet: Sheet;
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
  const panoWrapRef = useRef<HTMLDivElement>(null);
  const frostRef = useRef<HTMLDivElement>(null);
  const tourUiRef = useRef<HTMLDivElement>(null);
  const sheetUiRef = useRef<HTMLDivElement>(null);
  const compareRef = useRef<HTMLAnchorElement>(null);

  const [active, setActive] = useState(false);
  const [sheetMode, setSheetMode] = useState(false);

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

  useEffect(() => {
    if (sheetMode) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      exitTourToCompare();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [sheetMode]);

  useEffect(() => {
    const applyUnit = (unitKey: string | null) => {
      if (!unitKey) return;
      const match = units.find((u) => u.id === unitKey);
      if (!match) return;
      setUnitId(match.id);
      setSpaceIndex(0);
      setSpaceId(match.spaces[0]?.id ?? null);
      setActive(true);
    };

    const applyUnitFromUrl = () => {
      applyUnit(new URLSearchParams(window.location.search).get("unit"));
    };

    const onTour = (event: Event) => {
      applyUnit((event as CustomEvent<TourEventDetail>).detail?.unitId ?? null);
    };

    applyUnitFromUrl();
    window.addEventListener(TOUR_EVENT, onTour);
    window.addEventListener("hashchange", applyUnitFromUrl);
    window.addEventListener("popstate", applyUnitFromUrl);
    return () => {
      window.removeEventListener(TOUR_EVENT, onTour);
      window.removeEventListener("hashchange", applyUnitFromUrl);
      window.removeEventListener("popstate", applyUnitFromUrl);
    };
  }, []);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const panoWrap = panoWrapRef.current;
      const frost = frostRef.current;
      const tourUi = tourUiRef.current;
      const sheetUi = sheetUiRef.current;
      const compare = compareRef.current;
      if (!section || !panoWrap || !frost || !tourUi || !sheetUi || !compare)
        return;

      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduce) {
        gsap.set(panoWrap, { filter: "blur(18px) saturate(0.85)" });
        gsap.set(frost, { autoAlpha: 1 });
        gsap.set(tourUi, { autoAlpha: 0 });
        gsap.set(sheetUi, { autoAlpha: 1 });
        gsap.set(compare, { autoAlpha: 1 });
        setSheetMode(true);
        return;
      }

      gsap.set(panoWrap, { filter: "blur(0px) saturate(1)" });
      gsap.set(frost, { autoAlpha: 0 });
      gsap.set(tourUi, { autoAlpha: 1 });
      gsap.set(sheetUi, { autoAlpha: 0 });
      gsap.set(compare, { autoAlpha: 0 });
      setSheetMode(false);

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          id: "recorridos",
          trigger: section,
          start: "top top",
          end: "+=320%",
          pin: true,
          scrub: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            const next = self.progress > 0.42;
            setSheetMode((prev) => (prev === next ? prev : next));
          },
        },
      });

      // Hold recorrido 360
      tl.to({}, { duration: 0.9 });

      // Transición a ficha / plano (cristal)
      tl.to(
        panoWrap,
        { filter: "blur(22px) saturate(0.8)", duration: 0.7 },
        ">",
      );
      tl.to(frost, { autoAlpha: 1, duration: 0.7 }, "<");
      tl.to(tourUi, { autoAlpha: 0, duration: 0.45 }, "<+=0.1");
      tl.to(sheetUi, { autoAlpha: 1, duration: 0.55 }, "<+=0.15");
      tl.to(compare, { autoAlpha: 1, duration: 0.4 }, "<+=0.1");

      // Hold ficha
      tl.to({}, { duration: 1.1 });
    },
    { scope: sectionRef },
  );

  const unit = useMemo(
    () => units.find((u) => u.id === unitId) ?? initialUnit,
    [unitId, initialUnit],
  );

  const spaces = unit.spaces;
  const index = resolveSpaceIndex(unit, spaceId, spaceIndex);
  const space = spaces[index] ?? spaces[0];
  const prev = spaces.length
    ? spaces[(index - 1 + spaces.length) % spaces.length]
    : null;
  const next = spaces.length
    ? spaces[(index + 1) % spaces.length]
    : null;
  const sheet = unit.sheet;

  const goSpace = useCallback(
    (nextIndex: number) => {
      if (!spaces.length || sheetMode) return;
      const wrapped = (nextIndex + spaces.length) % spaces.length;
      setSpaceIndex(wrapped);
      setSpaceId(spaces[wrapped].id);
    },
    [spaces, sheetMode],
  );

  const selectUnit = useCallback(
    (nextUnit: Unit) => {
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
      aria-label="Recorrido 360 y fichas"
    >
      <div
        ref={panoWrapRef}
        className={`absolute inset-0 will-change-[filter] ${sheetMode ? "pointer-events-none" : ""}`}
      >
        {active ? (
          <PanoramaCanvas
            src={space.src}
            yaw={space.yaw}
            interactionEnabled={!sheetMode}
          />
        ) : (
          <div className="absolute inset-0 bg-[#0c0e0a]" aria-hidden />
        )}
      </div>

      {/* Cristal / viñeta */}
      <div
        ref={frostRef}
        className="pointer-events-none absolute inset-0 bg-[rgba(8,10,6,0.48)] backdrop-blur-[2px]"
        aria-hidden
      />
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

      {/* UI recorrido 360 */}
      <div ref={tourUiRef} className="pointer-events-none absolute inset-0 z-10">
        <div className="absolute top-0 left-0 max-w-[min(24rem,calc(100vw-2.5rem))] px-5 pt-24 md:max-w-[min(22rem,70vw)] md:px-8 md:pt-28">
          <h2 className="text-[clamp(1.15rem,2.4vw,1.65rem)] leading-tight font-medium tracking-[0.14em] text-white uppercase">
            {space.title}
          </h2>
          <p className="mt-3 max-w-[18rem] text-[0.72rem] leading-relaxed tracking-[0.08em] text-white/78 md:text-[0.78rem]">
            Arrastra para explorar. Usa salir para recuperar el scroll.
          </p>
        </div>

        <div className="absolute top-5 right-5 md:top-7 md:right-7">
          <button
            type="button"
            onClick={exitTourToCompare}
            className="pointer-events-auto inline-flex min-h-11 items-center rounded-full border border-white/70 bg-black/18 px-4 py-2 text-[0.68rem] font-medium tracking-[0.14em] text-white uppercase backdrop-blur-sm transition-colors hover:border-white hover:bg-black/28 md:text-[0.72rem]"
            aria-label="Salir del recorrido 360 y volver al scroll"
            tabIndex={sheetMode ? -1 : 0}
          >
            Salir del render
          </button>
        </div>

        {spaces.length > 1 && prev && next && (
          <>
            <button
              type="button"
              onClick={() => goSpace(index - 1)}
              className="pointer-events-auto absolute left-3 bottom-26 flex min-h-11 items-center gap-2 rounded-full border border-white/35 bg-black/18 px-3 py-2 text-left text-white/95 backdrop-blur-sm transition-colors hover:border-white hover:bg-black/28 md:top-1/2 md:bottom-auto md:left-4 md:-translate-y-1/2 md:flex-col md:items-center md:gap-2 md:border-transparent md:bg-transparent md:px-2 md:py-3"
              aria-label={`Ir a ${prev.title}`}
              tabIndex={sheetMode ? -1 : 0}
            >
              <span className="text-[0.66rem] font-medium tracking-[0.16em] uppercase md:[writing-mode:vertical-rl] md:rotate-180 md:text-xs">
                {prev.title}
              </span>
              <ChevronSide direction="prev" />
            </button>

            <button
              type="button"
              onClick={() => goSpace(index + 1)}
              className="pointer-events-auto absolute right-3 bottom-26 flex min-h-11 items-center gap-2 rounded-full border border-white/35 bg-black/18 px-3 py-2 text-right text-white/95 backdrop-blur-sm transition-colors hover:border-white hover:bg-black/28 md:top-1/2 md:bottom-auto md:right-4 md:-translate-y-1/2 md:flex-col md:items-center md:gap-2 md:border-transparent md:bg-transparent md:px-2 md:py-3"
              aria-label={`Ir a ${next.title}`}
              tabIndex={sheetMode ? -1 : 0}
            >
              <span className="text-[0.66rem] font-medium tracking-[0.16em] uppercase md:[writing-mode:vertical-rl] md:rotate-180 md:text-xs">
                {next.title}
              </span>
              <ChevronSide direction="next" />
            </button>
          </>
        )}
      </div>

      {/* UI ficha / plano */}
      <div
        ref={sheetUiRef}
        className={`absolute inset-0 z-20 ${sheetMode ? "" : "pointer-events-none"}`}
        aria-hidden={!sheetMode}
      >
        <div className="flex h-full flex-col overflow-y-auto px-5 pt-18 pb-28 md:justify-center md:overflow-hidden md:px-10 md:pt-6 md:pb-16 lg:px-14">
          <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-8 md:h-full md:flex-row md:items-center md:justify-center md:gap-10 lg:gap-14">
            <div
              className="relative h-[min(48svh,420px)] w-[calc(min(48svh,420px)*var(--ph)/var(--pw))] shrink-0 md:h-[80svh] md:w-[calc(80svh*var(--ph)/var(--pw))]"
              style={
                {
                  "--pw": sheet.plan.width,
                  "--ph": sheet.plan.height,
                } as CSSProperties
              }
            >
              <Image
                src={sheet.plan.src}
                alt={sheet.plan.alt}
                width={sheet.plan.width}
                height={sheet.plan.height}
                className="absolute top-1/2 left-1/2 h-auto w-[min(48svh,420px)] max-w-none -translate-x-1/2 -translate-y-1/2 rotate-90 object-contain brightness-0 invert md:w-[80svh]"
                sizes="80vh"
                onLoad={scheduleScrollRefresh}
              />
            </div>

            <div className="w-full max-w-md text-white md:max-w-lg">
              <h2 className="text-[clamp(1.35rem,2.8vw,2rem)] leading-tight font-medium tracking-[0.12em] uppercase">
                {sheet.title}
              </h2>
              <div className="mt-3 space-y-1 text-[0.72rem] leading-[1.55] font-light tracking-[0.04em] text-white/75 md:text-[0.8rem]">
                {sheet.summary.map((line, idx) => (
                  <p key={`${sheet.title}-summary-${idx}`}>{line}</p>
                ))}
              </div>

              <dl className="mt-8 grid grid-cols-3 gap-3 border-t border-white/25 pt-5 md:mt-10 md:gap-5">
                {sheet.stats.map((stat) => (
                  <div key={stat.label}>
                    <dt className="text-[0.6rem] tracking-[0.18em] text-white/55 uppercase md:text-[0.65rem]">
                      {stat.label}
                    </dt>
                    <dd className="mt-1.5 text-[0.85rem] font-medium tracking-[0.04em] text-white md:text-[0.95rem]">
                      {stat.value}
                    </dd>
                  </div>
                ))}
              </dl>

              <ul className="mt-6 space-y-1 text-[0.72rem] leading-snug font-light text-white/80 md:mt-8 md:text-[0.78rem]">
                {sheet.highlights.map((line, idx) => (
                  <li key={`${sheet.title}-highlight-${idx}`}>- {line}</li>
                ))}
              </ul>

              <a
                href={sheet.cta.href}
                className="mt-7 inline-flex min-h-11 items-center rounded-full border border-white/80 px-5 py-2 text-[0.7rem] tracking-[0.12em] text-white uppercase transition-colors hover:border-white hover:bg-white/10 md:mt-8 md:text-xs"
                tabIndex={sheetMode ? 0 : -1}
              >
                {sheet.cta.label}
              </a>
            </div>
          </div>
        </div>

        <span className="pointer-events-none absolute top-1/2 left-3 hidden -translate-y-1/2 [writing-mode:vertical-rl] rotate-180 text-[0.65rem] tracking-[0.22em] text-white/50 uppercase md:left-5 md:block md:text-[0.7rem]">
          Baño
        </span>
        <span className="pointer-events-none absolute top-1/2 right-3 hidden -translate-y-1/2 [writing-mode:vertical-rl] rotate-180 text-[0.65rem] tracking-[0.22em] text-white/50 uppercase md:right-5 md:block md:text-[0.7rem]">
          {panoramas.brandSide}
        </span>
      </div>

      <a
        ref={compareRef}
        href={panoramas.compare.href}
        className="absolute bottom-7 left-1/2 z-30 flex min-h-11 -translate-x-1/2 flex-col items-center justify-center gap-1 rounded-full px-3 text-white/75 transition-opacity hover:text-white"
        tabIndex={sheetMode ? 0 : -1}
      >
        <span className="text-[0.65rem] tracking-[0.28em] uppercase md:text-[0.7rem]">
          {panoramas.compare.label}
        </span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          aria-hidden
        >
          <path
            d="M3.5 5.25 L7 8.75 L10.5 5.25"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </a>

      {/* Selector de unidad — ambas fases */}
      <div className="absolute bottom-6 left-5 z-30 flex flex-col items-start gap-2.5 md:bottom-8 md:left-8">
        {units.map((u) => {
          const selected = u.id === unitId;
          return (
            <button
              key={u.id}
              type="button"
              onClick={() => selectUnit(u)}
              className={[
                "min-h-11 rounded-full border px-4 py-1.5 text-[0.7rem] tracking-[0.08em] transition-colors md:text-xs",
                selected
                  ? "border-white bg-white/15 text-white"
                  : "border-white/70 text-white/90 hover:border-white hover:bg-white/10",
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
