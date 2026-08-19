"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scheduleScrollRefresh } from "../lib/scrollRefresh";
import { unitIsometrics } from "../content";
import {
  goToTour,
  ISOMETRIC_EVENT,
  type IsometricEventDetail,
} from "../lib/goToTour";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type StackImage = {
  src: string;
  alt: string;
  stack: { x: number; y: number };
};

type Hotspot = {
  label: string;
  x: number;
  y: number;
};

type Unit = {
  id: string;
  label: string;
  title: string;
  interior: string;
  exterior: string;
  rooms: readonly string[];
  amenities: readonly string[];
  status: string;
  image?: { src: string; alt: string };
  images?: readonly StackImage[];
  flipped?: boolean;
  hotspots?: readonly Hotspot[];
};

const units = unitIsometrics.units as readonly Unit[];

function EyeIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path
        d="M2.5 12s3.8-7 9.5-7 9.5 7 9.5 7-3.8 7-9.5 7-9.5-7-9.5-7Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle
        cx="12"
        cy="12"
        r="2.75"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function IsometricVisual({ unit }: { unit: Unit }) {
  const flipped = unit.flipped ?? false;

  return (
    <div
      className={[
        "relative mx-auto aspect-[5760/3652] w-full max-w-[min(560px,78vw)] md:max-w-none md:flex-1",
        flipped ? "-scale-x-100" : "",
      ].join(" ")}
    >
      {unit.image ? (
        <Image
          src={unit.image.src}
          alt={unit.image.alt}
          fill
          sizes="(max-width: 768px) 88vw, 52vw"
          className="object-contain object-bottom"
          priority
          onLoad={scheduleScrollRefresh}
        />
      ) : unit.images ? (
        unit.images.map((img, layerIndex) => (
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
              sizes="(max-width: 768px) 88vw, 52vw"
              className="object-contain object-bottom"
              onLoad={scheduleScrollRefresh}
            />
          </div>
        ))
      ) : null}

      {unit.hotspots?.map((spot) => {
        const x = flipped ? 100 - spot.x : spot.x;
        return (
          <button
            key={spot.label}
            type="button"
            onClick={() => goToTour(unit.id)}
            className="absolute cursor-pointer"
            style={{ left: `${x}%`, top: `${spot.y}%` }}
            aria-label={`Ver recorrido — ${spot.label}`}
          >
            <span className="absolute bottom-[calc(100%+0.55rem)] left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-[#f3f0e8]/92 px-2.5 py-1 text-[0.62rem] font-medium tracking-[0.14em] text-[#1c1c16] uppercase md:text-[0.68rem]">
              {spot.label}
            </span>
            <span className="absolute top-0 left-1/2 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--hero-green-deep)] text-white shadow-[0_1px_6px_rgba(0,0,0,0.28)] transition-transform hover:scale-110 md:h-9 md:w-9">
              <EyeIcon />
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function IsometricSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const [unitId, setUnitId] = useState(units[0]?.id ?? "depto-101");

  useEffect(() => {
    const applyUnit = (nextId: string | null) => {
      if (!nextId) return;
      if (units.some((u) => u.id === nextId)) setUnitId(nextId);
    };

    const applyUnitFromUrl = () => {
      applyUnit(new URLSearchParams(window.location.search).get("unit"));
    };

    const onIsometric = (event: Event) => {
      applyUnit(
        (event as CustomEvent<IsometricEventDetail>).detail?.unitId ?? null,
      );
    };

    applyUnitFromUrl();
    window.addEventListener(ISOMETRIC_EVENT, onIsometric);
    window.addEventListener("popstate", applyUnitFromUrl);
    return () => {
      window.removeEventListener(ISOMETRIC_EVENT, onIsometric);
      window.removeEventListener("popstate", applyUnitFromUrl);
    };
  }, []);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const visual = visualRef.current;
      const panel = panelRef.current;
      if (!section || !visual || !panel) return;

      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduce) {
        gsap.set([visual, panel], { autoAlpha: 1, y: 0 });
        return;
      }

      gsap.set([visual, panel], { autoAlpha: 0, y: 24 });

      gsap
        .timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            id: "isometrico",
            trigger: section,
            start: "top top",
            end: "+=140%",
            pin: true,
            scrub: true,
            anticipatePin: 1,
          },
        })
        .to(visual, { autoAlpha: 1, y: 0, duration: 0.45 })
        .to(panel, { autoAlpha: 1, y: 0, duration: 0.4 }, "-=0.25")
        .to({}, { duration: 0.9 });
    },
    { scope: sectionRef },
  );

  const unit = useMemo(
    () => units.find((u) => u.id === unitId) ?? units[0],
    [unitId],
  );

  const selectUnit = useCallback((nextId: string) => {
    setUnitId(nextId);
  }, []);

  if (!unit) return null;

  return (
    <section
      ref={sectionRef}
      id={unitIsometrics.id}
      className="iso-surface relative isolate overflow-hidden"
      aria-label="Isométricos por unidad"
    >
      <div className="flex h-[100svh] flex-col px-5 pt-20 pb-24 md:flex-row md:items-center md:gap-10 md:px-10 md:pt-6 md:pb-16 lg:gap-16 lg:px-14">
        <div
          ref={visualRef}
          className="flex min-h-0 flex-1 items-end justify-center md:items-center md:justify-end md:pr-4"
        >
          <IsometricVisual unit={unit} />
        </div>

        <div
          ref={panelRef}
          className="mt-6 w-full shrink-0 md:mt-0 md:w-[min(22rem,34vw)] lg:w-[min(24rem,30vw)]"
        >
          <h2 className="text-[clamp(1.5rem,3vw,2.35rem)] leading-none font-medium tracking-[0.1em] text-compare-ink uppercase">
            {unit.title}
          </h2>

          <div className="mt-5 space-y-1 text-[0.82rem] leading-snug font-medium text-compare-ink md:text-[0.9rem]">
            <p>{unit.interior} interiores</p>
            <p>{unit.exterior} exteriores</p>
          </div>

          <p className="mt-5 text-[0.72rem] leading-[1.65] font-light text-compare-ink/80 md:text-[0.78rem]">
            {unit.rooms.join(" | ")}
          </p>
          <p className="mt-2 text-[0.72rem] leading-[1.65] font-light text-compare-ink/80 md:text-[0.78rem]">
            {unit.amenities.join(" | ")}
          </p>

          <div className="mt-8 border-t border-compare-ink/25 pt-4">
            <p className="text-[0.72rem] tracking-[0.18em] text-compare-ink/70 uppercase md:text-[0.78rem]">
              {unit.status}
            </p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-5 z-10 flex flex-col items-start gap-2.5 md:bottom-8 md:left-8">
        {units.map((u) => {
          const selected = u.id === unitId;
          return (
            <button
              key={u.id}
              type="button"
              onClick={() => selectUnit(u.id)}
              className={[
                "rounded-full border px-4 py-1.5 text-[0.7rem] tracking-[0.08em] transition-colors md:text-xs",
                selected
                  ? "border-compare-ink bg-compare-ink/10 text-compare-ink"
                  : "border-compare-ink/55 text-compare-ink/85 hover:border-compare-ink hover:bg-compare-ink/5",
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
