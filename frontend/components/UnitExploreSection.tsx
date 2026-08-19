"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { panoramas, unitIsometrics } from "../content";
import {
  exitTourToCompare,
  ISOMETRIC_EVENT,
  setIsoScrollProgress,
  setTourScrollProgress,
  TOUR_EVENT,
  UNIT_SECTION_ID,
  type IsometricEventDetail,
  type TourEventDetail,
} from "../lib/goToTour";
import { scheduleScrollRefresh } from "../lib/scrollRefresh";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const PanoramaCanvas = dynamic(
  () => import("./PanoramaCanvas").then((mod) => mod.PanoramaCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 bg-[#0c0e0a]" aria-hidden />
    ),
  },
);

type StackImage = {
  src: string;
  alt: string;
  label?: string;
  stack: { x: number; y: number };
};

type IsoUnit = {
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
};

type Space = {
  id: string;
  title: string;
  src: string;
  yaw?: number;
};

type PlanImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
  label?: string;
};

type Sheet = {
  title: string;
  summary: readonly string[];
  stats: readonly { label: string; value: string }[];
  highlights: readonly string[];
  cta: { label: string; href: string };
  plan: PlanImage;
  plans?: readonly PlanImage[];
};

type TourUnit = {
  id: string;
  label: string;
  spaces: readonly Space[];
  sheet: Sheet;
};

type Phase = "iso" | "tour" | "sheet";

const isoUnits = unitIsometrics.units as readonly IsoUnit[];
const tourUnits = panoramas.units as readonly TourUnit[];

function resolveSpaceIndex(
  unit: TourUnit,
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

/** Bandas verticales (0–1) para detectar hover por piso en el stack. */
const TOWNHOUSE_FLOOR_BANDS = [
  { max: 0.34, index: 2 },
  { max: 0.58, index: 1 },
  { max: 1, index: 0 },
] as const;

function floorIndexFromPointer(yRatio: number) {
  for (const band of TOWNHOUSE_FLOOR_BANDS) {
    if (yRatio <= band.max) return band.index;
  }
  return 0;
}

function StackedIsometricVisual({
  images,
}: {
  images: readonly StackImage[];
}) {
  const stackRef = useRef<HTMLDivElement>(null);
  const [activeFloor, setActiveFloor] = useState<number | null>(null);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const pickFloor = useCallback((clientY: number) => {
    const el = stackRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.height <= 0) return;
    const yRatio = (clientY - rect.top) / rect.height;
    if (yRatio < 0 || yRatio > 1) {
      setActiveFloor(null);
      return;
    }
    setActiveFloor(floorIndexFromPointer(yRatio));
  }, []);

  const activeLabel =
    activeFloor !== null ? images[activeFloor]?.label : null;

  return (
    <div
      ref={stackRef}
      className="absolute inset-0 cursor-default"
      onMouseMove={(event) => pickFloor(event.clientY)}
      onMouseLeave={() => setActiveFloor(null)}
    >
      {images.map((img, layerIndex) => {
        const isActive = activeFloor === layerIndex;
        const isDimmed = activeFloor !== null && !isActive;
        const lift =
          isActive && !reduceMotion
            ? " translateY(-3.5%) scale-[1.035]"
            : "";

        return (
          <div
            key={img.src}
            className={[
              "pointer-events-none absolute inset-0 origin-bottom transition-[transform,opacity,filter] duration-300 ease-out",
              isDimmed ? "opacity-[0.62] brightness-[0.94] saturate-[0.88]" : "",
              isActive
                ? "brightness-[1.05] drop-shadow-[0_14px_28px_rgba(0,0,0,0.2)]"
                : "",
            ].join(" ")}
            style={{
              zIndex: isActive ? 20 : layerIndex,
              transform: `translate(${img.stack.x}%, ${img.stack.y}%)${lift}`,
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
        );
      })}

      <div
        className={[
          "pointer-events-none absolute top-[8%] left-1/2 -translate-x-1/2 rounded-md bg-[#f3f0e8]/94 px-3 py-1.5 text-[0.62rem] font-medium tracking-[0.16em] text-[#1c1c16] uppercase transition-[opacity,transform] duration-200 md:text-[0.68rem]",
          activeLabel ? "translate-y-0 opacity-100" : "-translate-y-1 opacity-0",
        ].join(" ")}
        aria-hidden={!activeLabel}
      >
        {activeLabel}
      </div>
    </div>
  );
}

function IsometricVisual({ unit }: { unit: IsoUnit }) {
  const isStacked = Boolean(unit.images?.length);
  const sharedWidth =
    "mx-auto w-full max-w-[min(560px,78vw)] md:max-w-none md:flex-1";

  if (!isStacked && unit.image) {
    return (
      <div className={`relative ${sharedWidth} aspect-[5760/3652]`}>
        <Image
          src={unit.image.src}
          alt={unit.image.alt}
          fill
          sizes="(max-width: 768px) 88vw, 52vw"
          className="object-contain object-bottom"
          priority
          onLoad={scheduleScrollRefresh}
        />
      </div>
    );
  }

  if (!unit.images?.length) return null;

  return (
    <div className={`relative ${sharedWidth}`}>
      <div className="relative w-full aspect-[5760/5150]">
        <div className="absolute inset-x-0 bottom-0 aspect-[5760/3652]">
          <StackedIsometricVisual images={unit.images} />
        </div>
      </div>
    </div>
  );
}

function IsoPanelCopy({ unit }: { unit: IsoUnit }) {
  return (
    <>
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
    </>
  );
}

function SheetPlan({ plan }: { plan: PlanImage }) {
  const isLandscape = plan.width >= plan.height;

  return (
    <div
      className="relative mx-auto w-[min(82vw,320px)] shrink-0 snap-center md:h-[86svh] md:w-[calc(86svh*var(--ph)/var(--pw))]"
      style={
        {
          "--pw": plan.width,
          "--ph": plan.height,
        } as CSSProperties
      }
    >
      <div
        className={[
          "relative w-full md:hidden",
          isLandscape ? "aspect-[var(--pw)/var(--ph)]" : "aspect-[var(--ph)/var(--pw)]",
        ].join(" ")}
      >
        <Image
          src={plan.src}
          alt={plan.alt}
          fill
          className="object-contain brightness-0 invert"
          sizes="(max-width: 767px) 82vw, 86vh"
          onLoad={scheduleScrollRefresh}
        />
      </div>

      <Image
        src={plan.src}
        alt={plan.alt}
        width={plan.width}
        height={plan.height}
        className="absolute top-1/2 left-1/2 hidden h-auto w-[86svh] max-w-none -translate-x-1/2 -translate-y-1/2 rotate-90 object-contain brightness-0 invert md:block"
        sizes="86vh"
        onLoad={scheduleScrollRefresh}
      />
      {plan.label ? (
        <p className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[0.6rem] tracking-[0.18em] text-white/55 uppercase md:text-[0.65rem]">
          {plan.label}
        </p>
      ) : null}
    </div>
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

export function UnitExploreSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const isoLayerRef = useRef<HTMLDivElement>(null);
  const isoVisualRef = useRef<HTMLDivElement>(null);
  const isoPanelRef = useRef<HTMLDivElement>(null);
  const incomingVisualRef = useRef<HTMLDivElement>(null);
  const outgoingVisualRef = useRef<HTMLDivElement>(null);
  const incomingPanelRef = useRef<HTMLDivElement>(null);
  const outgoingPanelRef = useRef<HTMLDivElement>(null);
  const tourLayerRef = useRef<HTMLDivElement>(null);
  const panoWrapRef = useRef<HTMLDivElement>(null);
  const frostRef = useRef<HTMLDivElement>(null);
  const tourUiRef = useRef<HTMLDivElement>(null);
  const sheetUiRef = useRef<HTMLDivElement>(null);
  const compareRef = useRef<HTMLAnchorElement>(null);

  const initialTourUnit =
    tourUnits.find((u) => u.spaces.length > 0) ?? tourUnits[0];

  const [phase, setPhase] = useState<Phase>("iso");
  const [active, setActive] = useState(false);
  const [sheetMode, setSheetMode] = useState(false);
  const [unitId, setUnitId] = useState(initialTourUnit.id);
  const [leavingId, setLeavingId] = useState<string | null>(null);
  const [spaceIndex, setSpaceIndex] = useState(0);
  const [spaceId, setSpaceId] = useState<string | null>(
    initialTourUnit.spaces[0]?.id ?? null,
  );
  const [mountPano, setMountPano] = useState(false);
  const mobilePhaseRef = useRef<Phase>("iso");

  const applyUnit = useCallback((unitKey: string | null) => {
    if (!unitKey) return;
    const match = tourUnits.find((u) => u.id === unitKey);
    if (!match) return;
    setLeavingId(null);
    setUnitId(match.id);
    setSpaceIndex(0);
    setSpaceId(match.spaces[0]?.id ?? null);
    setActive(true);
  }, []);

  useEffect(() => {
    const applyUnitFromUrl = () => {
      applyUnit(new URLSearchParams(window.location.search).get("unit"));
    };

    const onTour = (event: Event) => {
      applyUnit(
        (event as CustomEvent<TourEventDetail>).detail?.unitId ?? null,
      );
    };

    const onIsometric = (event: Event) => {
      applyUnit(
        (event as CustomEvent<IsometricEventDetail>).detail?.unitId ?? null,
      );
    };

    applyUnitFromUrl();
    window.addEventListener(TOUR_EVENT, onTour);
    window.addEventListener(ISOMETRIC_EVENT, onIsometric);
    window.addEventListener("hashchange", applyUnitFromUrl);
    window.addEventListener("popstate", applyUnitFromUrl);
    return () => {
      window.removeEventListener(TOUR_EVENT, onTour);
      window.removeEventListener(ISOMETRIC_EVENT, onIsometric);
      window.removeEventListener("hashchange", applyUnitFromUrl);
      window.removeEventListener("popstate", applyUnitFromUrl);
    };
  }, [applyUnit]);

  useEffect(() => {
    if (phase !== "tour" || sheetMode) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      exitTourToCompare();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [phase, sheetMode]);

  useEffect(() => {
    if (!active || sheetMode) {
      const id = window.setTimeout(() => setMountPano(false), 0);
      return () => window.clearTimeout(id);
    }

    const desktop = window.matchMedia("(min-width: 768px)").matches;
    if (desktop) {
      const id = window.requestAnimationFrame(() => setMountPano(true));
      return () => cancelAnimationFrame(id);
    }

    const id = window.setTimeout(() => setMountPano(true), 280);
    return () => window.clearTimeout(id);
  }, [active, sheetMode]);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const bg = bgRef.current;
      const isoLayer = isoLayerRef.current;
      const isoVisual = isoVisualRef.current;
      const isoPanel = isoPanelRef.current;
      const tourLayer = tourLayerRef.current;
      const panoWrap = panoWrapRef.current;
      const frost = frostRef.current;
      const tourUi = tourUiRef.current;
      const sheetUi = sheetUiRef.current;
      const compare = compareRef.current;

      if (
        !section ||
        !bg ||
        !isoLayer ||
        !isoVisual ||
        !isoPanel ||
        !tourLayer ||
        !panoWrap ||
        !frost ||
        !tourUi ||
        !sheetUi ||
        !compare
      ) {
        return;
      }

      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduce) {
        gsap.set(bg, { backgroundColor: "#0c0e0a" });
        gsap.set(isoLayer, { autoAlpha: 0 });
        gsap.set(tourLayer, { autoAlpha: 1 });
        gsap.set(panoWrap, { filter: "blur(18px) saturate(0.85)" });
        gsap.set(frost, { autoAlpha: 1 });
        gsap.set(tourUi, { autoAlpha: 0 });
        gsap.set(sheetUi, { autoAlpha: 1 });
        gsap.set(compare, { autoAlpha: 1 });
        setPhase("sheet");
        setSheetMode(true);
        setActive(true);
        return;
      }

      const desktop = window.matchMedia("(min-width: 768px)").matches;

      if (!desktop) {
        gsap.set(bg, { backgroundColor: "#e8e4d9" });
        gsap.set(isoLayer, { autoAlpha: 1 });
        gsap.set(isoVisual, { autoAlpha: 1, y: 0 });
        gsap.set(isoPanel, { autoAlpha: 1, y: 0 });
        gsap.set(tourLayer, { autoAlpha: 1 });
        gsap.set(panoWrap, { filter: "blur(0px) saturate(1)" });
        gsap.set(frost, { autoAlpha: 0 });
        gsap.set(tourUi, { autoAlpha: 1 });
        gsap.set(sheetUi, { autoAlpha: 1 });
        gsap.set(compare, { autoAlpha: 1 });
        setPhase("iso");
        setSheetMode(false);
        setActive(false);

        const tourStartProgress = 0.34;
        const sheetStartProgress = 0.68;
        const tourBackProgress = 0.24;
        const sheetBackProgress = 0.58;
        mobilePhaseRef.current = "iso";

        ScrollTrigger.create({
          id: UNIT_SECTION_ID,
          trigger: section,
          start: "top top",
          end: "+=220%",
          scrub: true,
          pin: false,
          onUpdate: (self) => {
            const p = self.progress;
            let next = mobilePhaseRef.current;

            if (mobilePhaseRef.current === "iso") {
              if (p >= tourStartProgress) next = "tour";
            } else if (mobilePhaseRef.current === "tour") {
              if (p < tourBackProgress) next = "iso";
              else if (p >= sheetStartProgress) next = "sheet";
            } else if (p < sheetBackProgress) {
              next = "tour";
            }

            if (next === mobilePhaseRef.current) return;
            mobilePhaseRef.current = next;

            if (next === "iso") {
              setPhase("iso");
              setActive(false);
              setSheetMode(false);
            } else if (next === "tour") {
              setPhase("tour");
              setActive(true);
              setSheetMode(false);
            } else {
              setPhase("sheet");
              setActive(true);
              setSheetMode(true);
            }
          },
        });

        setTourScrollProgress(0.42);
        setIsoScrollProgress(0.18);
        return;
      }

      gsap.set(bg, { backgroundColor: "#e8e4d9" });
      gsap.set(isoLayer, { autoAlpha: 1 });
      gsap.set(isoVisual, { autoAlpha: 0, y: 24 });
      gsap.set(isoPanel, { autoAlpha: 0, y: 24 });
      gsap.set(tourLayer, { autoAlpha: 0 });
      gsap.set(panoWrap, { filter: "blur(0px) saturate(1)" });
      gsap.set(frost, { autoAlpha: 0 });
      gsap.set(tourUi, { autoAlpha: 1 });
      gsap.set(sheetUi, { autoAlpha: 0 });
      gsap.set(compare, { autoAlpha: 0 });
      setPhase("iso");
      setSheetMode(false);

      let tourStartProgress = 0.3;
      let sheetStartProgress = 0.58;

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          id: UNIT_SECTION_ID,
          trigger: section,
          start: "top top",
          end: "+=460%",
          pin: true,
          scrub: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            const p = self.progress;
            if (p < tourStartProgress) {
              setPhase((prev) => (prev === "iso" ? prev : "iso"));
              setActive((prev) => (prev ? false : prev));
            } else if (p < sheetStartProgress) {
              setPhase((prev) => (prev === "tour" ? prev : "tour"));
              setActive(true);
              setSheetMode((prev) => (prev ? false : prev));
            } else {
              setPhase((prev) => (prev === "sheet" ? prev : "sheet"));
              setActive(true);
              setSheetMode(true);
            }
          },
        },
      });

      tl.to(isoVisual, { autoAlpha: 1, y: 0, duration: 0.45 })
        .to(isoPanel, { autoAlpha: 1, y: 0, duration: 0.4 }, "-=0.25")
        .to({}, { duration: 0.55 })
        .addLabel("isoSettled")
        .to({}, { duration: 0.35 })
        .addLabel("tourStart")
        .to(isoLayer, { autoAlpha: 0, duration: 0.55 })
        .to(tourLayer, { autoAlpha: 1, duration: 0.55 }, "<")
        .to(
          bg,
          { backgroundColor: "#0c0e0a", duration: 0.55 },
          "<",
        )
        .to({}, { duration: 0.45 })
        .addLabel("tourSettled")
        .to({}, { duration: 0.45 })
        .addLabel("sheetStart")
        .to(
          panoWrap,
          { filter: "blur(22px) saturate(0.8)", duration: 0.7 },
          ">",
        )
        .to(frost, { autoAlpha: 1, duration: 0.7 }, "<")
        .to(tourUi, { autoAlpha: 0, duration: 0.45 }, "<+=0.1")
        .to(sheetUi, { autoAlpha: 1, duration: 0.55 }, "<+=0.15")
        .to(compare, { autoAlpha: 1, duration: 0.4 }, "<+=0.1")
        .to({}, { duration: 1.1 });

      tourStartProgress =
        tl.labels.tourStart !== undefined
          ? tl.labels.tourStart / tl.duration()
          : tourStartProgress;
      sheetStartProgress =
        tl.labels.sheetStart !== undefined
          ? tl.labels.sheetStart / tl.duration()
          : sheetStartProgress;
      setTourScrollProgress(
        tl.labels.tourSettled !== undefined
          ? tl.labels.tourSettled / tl.duration()
          : tourStartProgress,
      );
      setIsoScrollProgress(
        tl.labels.isoSettled !== undefined
          ? tl.labels.isoSettled / tl.duration()
          : tourStartProgress * 0.72,
      );
    },
    { scope: sectionRef },
  );

  useGSAP(
    () => {
      if (!leavingId) return;

      const incoming = incomingVisualRef.current;
      const outgoing = outgoingVisualRef.current;
      const incomingPanel = incomingPanelRef.current;
      const outgoingPanel = outgoingPanelRef.current;

      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduce) {
        setLeavingId(null);
        return;
      }

      gsap.set(incoming, { autoAlpha: 0 });
      gsap.set(incomingPanel, { autoAlpha: 0 });
      gsap.set(outgoing, { autoAlpha: 1 });
      gsap.set(outgoingPanel, { autoAlpha: 1 });

      let alive = true;
      const tl = gsap.timeline({
        defaults: { duration: 0.4, ease: "sine.inOut" },
        onComplete: () => {
          if (alive) setLeavingId(null);
        },
      });

      if (outgoing) tl.to(outgoing, { autoAlpha: 0 }, 0);
      if (incoming) tl.to(incoming, { autoAlpha: 1 }, 0);
      if (outgoingPanel) tl.to(outgoingPanel, { autoAlpha: 0 }, 0);
      if (incomingPanel) tl.to(incomingPanel, { autoAlpha: 1 }, 0);

      return () => {
        alive = false;
        tl.kill();
      };
    },
    { dependencies: [unitId, leavingId], scope: sectionRef },
  );

  const isoUnit = useMemo(
    () => isoUnits.find((u) => u.id === unitId) ?? isoUnits[0],
    [unitId],
  );

  const tourUnit = useMemo(
    () => tourUnits.find((u) => u.id === unitId) ?? initialTourUnit,
    [unitId, initialTourUnit],
  );

  const spaces = tourUnit.spaces;
  const index = resolveSpaceIndex(tourUnit, spaceId, spaceIndex);
  const space = spaces[index] ?? spaces[0];
  const prev = spaces.length
    ? spaces[(index - 1 + spaces.length) % spaces.length]
    : null;
  const next = spaces.length
    ? spaces[(index + 1) % spaces.length]
    : null;
  const sheet = tourUnit.sheet;

  const leavingUnit = useMemo(
    () => isoUnits.find((u) => u.id === leavingId) ?? null,
    [leavingId],
  );

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
    (nextId: string) => {
      const match = tourUnits.find((u) => u.id === nextId);
      if (!match || match.id === unitId) return;
      setLeavingId(unitId);
      const nextIndex = resolveSpaceIndex(match, spaceId, spaceIndex);
      setUnitId(match.id);
      setSpaceIndex(nextIndex);
      setSpaceId(match.spaces[nextIndex]?.id ?? null);
    },
    [spaceId, spaceIndex, unitId],
  );

  const darkUi = phase !== "iso";
  const isTourInteractive = phase === "tour" && !sheetMode;
  const hideMobileIso = phase !== "iso";
  const hideMobileTour = phase !== "tour" || sheetMode;
  const hideMobileSheet = !sheetMode;

  const unitSelectorButtons = isoUnits.map((u) => {
    const selected = u.id === unitId;
    return (
      <button
        key={u.id}
        type="button"
        onClick={() => selectUnit(u.id)}
        className={[
          "min-h-11 shrink-0 rounded-full border px-4 py-1.5 text-[0.7rem] tracking-[0.08em] transition-colors md:text-xs",
          darkUi
            ? selected
              ? "border-white bg-white/15 text-white"
              : "border-white/70 text-white/90 hover:border-white hover:bg-white/10"
            : selected
              ? "border-compare-ink bg-compare-ink/10 text-compare-ink"
              : "border-compare-ink/55 text-compare-ink/85 hover:border-compare-ink hover:bg-compare-ink/5",
        ].join(" ")}
      >
        {u.label}
      </button>
    );
  });

  if (!isoUnit || !space) return null;

  return (
    <section
      ref={sectionRef}
      id={UNIT_SECTION_ID}
      className="relative isolate h-[100svh] overflow-hidden max-md:h-auto max-md:overflow-x-hidden"
      aria-label="Isométricos y recorrido 360"
    >
      <div ref={bgRef} className="absolute inset-0" aria-hidden />

      {/* Fase isométrica */}
      <div
        ref={isoLayerRef}
        className={[
          "absolute inset-0 z-[1]",
          "max-md:relative max-md:min-h-[100svh] max-md:bg-[#e8e4d9]",
          hideMobileIso ? "max-md:hidden" : "",
        ].join(" ")}
        aria-hidden={phase !== "iso"}
      >
        <div className="flex h-full flex-col px-5 pt-20 pb-24 max-md:gap-6 max-md:overflow-visible md:flex-row md:items-center md:gap-10 md:px-10 md:pt-6 md:pb-16 lg:gap-16 lg:px-14">
          <div
            ref={isoVisualRef}
            className="flex max-h-[36svh] min-h-[180px] shrink-0 items-center justify-center max-md:max-h-[36svh] md:max-h-none md:min-h-0 md:flex-1 md:justify-end md:pr-4"
          >
            <div className="relative w-full">
              {leavingUnit && (
                <div
                  ref={outgoingVisualRef}
                  className="pointer-events-none absolute inset-x-0 bottom-0 z-[1]"
                  aria-hidden
                >
                  <IsometricVisual unit={leavingUnit} />
                </div>
              )}
              <div
                ref={incomingVisualRef}
                className="relative z-[2]"
                style={leavingUnit ? { opacity: 0 } : undefined}
              >
                <IsometricVisual unit={isoUnit} />
              </div>
            </div>
          </div>

          <div
            ref={isoPanelRef}
            className="relative mt-6 w-full shrink-0 md:mt-0 md:w-[min(22rem,34vw)] lg:w-[min(24rem,30vw)]"
          >
            {leavingUnit && (
              <div
                ref={outgoingPanelRef}
                className="pointer-events-none absolute inset-0"
                aria-hidden
              >
                <IsoPanelCopy unit={leavingUnit} />
              </div>
            )}
            <div
              ref={incomingPanelRef}
              style={leavingUnit ? { opacity: 0 } : undefined}
            >
              <IsoPanelCopy unit={isoUnit} />
            </div>
          </div>
        </div>
      </div>

      {/* Fase recorrido 360 + ficha */}
      <div
        ref={tourLayerRef}
        className={[
          "absolute inset-0 z-[2]",
          "max-md:relative max-md:bg-[#0c0e0a]",
          hideMobileTour && hideMobileSheet ? "max-md:hidden" : "",
          hideMobileSheet ? "max-md:min-h-[100svh] max-md:overflow-hidden" : "",
          phase === "iso" ? "pointer-events-none" : "",
        ].join(" ")}
        aria-hidden={phase === "iso" && hideMobileSheet}
      >
        <div
          ref={panoWrapRef}
          className={[
            "absolute inset-0 will-change-[filter]",
            sheetMode ? "pointer-events-none max-md:hidden" : "",
          ].join(" ")}
        >
          {mountPano ? (
            <PanoramaCanvas
              src={space.src}
              yaw={space.yaw}
              interactionEnabled={isTourInteractive}
            />
          ) : (
            <div className="absolute inset-0 bg-[#0c0e0a]" aria-hidden />
          )}
        </div>

        <div
          ref={frostRef}
          className="pointer-events-none absolute inset-0 max-md:hidden bg-[rgba(8,10,6,0.48)] backdrop-blur-[2px]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 max-md:hidden bg-[radial-gradient(ellipse_at_center,transparent_42%,rgba(8,10,6,0.45)_100%)]"
          aria-hidden
        />
        <div
          className={[
            "pointer-events-none absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-black/55 to-transparent",
            sheetMode ? "max-md:hidden" : "",
          ].join(" ")}
          aria-hidden
        />
        <div
          className={[
            "pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/50 to-transparent",
            sheetMode ? "max-md:hidden" : "",
          ].join(" ")}
          aria-hidden
        />

        <div
          ref={tourUiRef}
          className={[
            "pointer-events-none absolute inset-0 z-10",
            sheetMode ? "max-md:hidden" : "",
          ].join(" ")}
        >
          <div className="absolute top-0 left-0 max-w-[min(24rem,calc(100vw-2.5rem))] px-5 pt-24 md:max-w-[min(22rem,70vw)] md:px-8 md:pt-28">
            <h2 className="text-[clamp(1.15rem,2.4vw,1.65rem)] leading-tight font-medium tracking-[0.14em] text-white uppercase">
              {space.title}
            </h2>
            <p className="mt-3 max-w-[18rem] text-[0.72rem] leading-relaxed tracking-[0.08em] text-white/78 md:text-[0.78rem]">
              Arrastra para explorar. Usa el botón de salida para volver al
              scroll.
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
              Volver al recorrido
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

        <div
          ref={sheetUiRef}
          className={[
            "absolute inset-0 z-20",
            "max-md:relative max-md:min-h-[100svh] max-md:bg-[#0c0e0a]",
            hideMobileSheet ? "max-md:hidden" : "",
            sheetMode ? "" : "pointer-events-none",
          ].join(" ")}
          aria-hidden={!sheetMode}
        >
          <div className="sticky top-0 z-30 flex gap-2 overflow-x-auto border-b border-white/10 bg-[#0c0e0a] px-4 py-3 [-ms-overflow-style:none] [scrollbar-width:none] md:hidden [&::-webkit-scrollbar]:hidden">
            {unitSelectorButtons}
          </div>

          <div className="flex h-full flex-col overflow-y-auto px-5 pt-4 pb-10 md:justify-center md:overflow-hidden md:px-10 md:pt-6 md:pb-16 lg:px-14">
            <div className="mx-auto flex w-full max-w-6xl flex-col items-stretch gap-8 md:h-full md:flex-row md:items-center md:justify-center md:gap-8 lg:gap-12">
              <div className="flex w-full shrink-0 snap-x snap-mandatory gap-4 overflow-x-auto pb-2 pt-1 [-ms-overflow-style:none] [scrollbar-width:none] max-md:justify-start md:w-auto md:items-end md:justify-center md:overflow-visible md:pb-0 md:pt-0 md:gap-5 [&::-webkit-scrollbar]:hidden">
                {(sheet.plans ?? [sheet.plan]).map((plan) => (
                  <SheetPlan key={plan.src} plan={plan} />
                ))}
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

                <a
                  href={panoramas.compare.href}
                  className="mt-6 inline-flex min-h-11 items-center gap-2 text-[0.68rem] tracking-[0.2em] text-white/75 uppercase transition-colors hover:text-white md:hidden"
                  tabIndex={sheetMode ? 0 : -1}
                >
                  {panoramas.compare.label}
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                    <path
                      d="M3.5 5.25 L7 8.75 L10.5 5.25"
                      stroke="currentColor"
                      strokeWidth="1.25"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
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
          className="absolute bottom-7 left-1/2 z-30 hidden min-h-11 -translate-x-1/2 flex-col items-center justify-center gap-1 rounded-full px-3 text-white/75 transition-opacity hover:text-white md:flex"
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
      </div>

      {/* Selector — desktop + mobile iso; en ficha mobile va dentro del sheet */}
      <div
        className={[
          "absolute bottom-6 left-5 z-40 flex flex-col items-start gap-2.5 md:bottom-8 md:left-8",
          phase === "tour" && !sheetMode ? "max-md:hidden" : "",
          sheetMode ? "max-md:hidden" : "",
          !sheetMode && phase !== "tour"
            ? "max-md:top-3 max-md:bottom-auto max-md:left-0 max-md:w-full max-md:flex-row max-md:overflow-x-auto max-md:border-b max-md:border-compare-ink/15 max-md:bg-[#e8e4d9]/96 max-md:px-4 max-md:py-3"
            : "",
        ].join(" ")}
      >
        {unitSelectorButtons}
      </div>
    </section>
  );
}
