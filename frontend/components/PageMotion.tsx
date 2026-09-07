"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { applyBootDeepLink } from "../lib/goToTour";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const BOOT_TIMEOUT_MS = 8000;

function whenPageReady(): Promise<void> {
  const fonts = document.fonts?.ready ?? Promise.resolve();

  const windowLoad =
    document.readyState === "complete"
      ? Promise.resolve()
      : new Promise<void>((resolve) => {
          window.addEventListener("load", () => resolve(), { once: true });
        });

  const timeout = new Promise<void>((resolve) => {
    window.setTimeout(resolve, BOOT_TIMEOUT_MS);
  });

  return Promise.race([
    Promise.all([fonts, windowLoad]).then(() => undefined),
    timeout,
  ]).then(
    () =>
      new Promise<void>((resolve) => {
        // Deja que los useGSAP hermanos registren pines antes del unlock
        requestAnimationFrame(() => {
          requestAnimationFrame(() => resolve());
        });
      }),
  );
}

function lockScroll() {
  const { body } = document;
  document.documentElement.classList.add("page-booting");
  document.documentElement.setAttribute("aria-busy", "true");
  // Siempre anclar en 0: el scroll nativo al hash es incorrecto sin pin-spacers
  body.dataset.scrollLockY = "0";
  body.style.position = "fixed";
  body.style.top = "0";
  body.style.left = "0";
  body.style.right = "0";
  body.style.width = "100%";
  window.scrollTo(0, 0);
}

function unlockScroll() {
  const { body } = document;
  document.documentElement.classList.remove("page-booting");
  document.documentElement.removeAttribute("aria-busy");
  body.style.position = "";
  body.style.top = "";
  body.style.left = "";
  body.style.right = "";
  body.style.width = "";
  delete body.dataset.scrollLockY;
  window.scrollTo(0, 0);
}

function revealHeroInstant() {
  gsap.set(
    [
      ".hero-brand",
      ".hero-headline",
      ".hero-support",
      ".hero-cta",
      ".hero-plan",
      ".reveal",
    ],
    { opacity: 1, y: 0, clearProps: "transform" },
  );
}

export function PageMotion({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      ScrollTrigger.config({
        autoRefreshEvents: "visibilitychange,resize",
      });

      if ("scrollRestoration" in history) {
        history.scrollRestoration = "manual";
      }

      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const hasDeepLink = Boolean(
        window.location.hash ||
          new URLSearchParams(window.location.search).get("unit"),
      );

      lockScroll();

      const blockScrollKeys = (event: KeyboardEvent) => {
        const keys = [
          " ",
          "ArrowUp",
          "ArrowDown",
          "PageUp",
          "PageDown",
          "Home",
          "End",
        ];
        if (keys.includes(event.key)) event.preventDefault();
      };
      const blockWheel = (event: Event) => event.preventDefault();

      window.addEventListener("keydown", blockScrollKeys, { passive: false });
      window.addEventListener("wheel", blockWheel, { passive: false });
      window.addEventListener("touchmove", blockWheel, { passive: false });

      let cancelled = false;

      const release = () => {
        if (cancelled) return;
        cancelled = true;

        window.removeEventListener("keydown", blockScrollKeys);
        window.removeEventListener("wheel", blockWheel);
        window.removeEventListener("touchmove", blockWheel);

        unlockScroll();
        ScrollTrigger.refresh();

        if (ScrollTrigger.isTouch > 0) {
          ScrollTrigger.normalizeScroll(true);
        }

        const landedOnDeepLink = hasDeepLink && applyBootDeepLink();

        // Por si el refresh de pines movió starts/ends tras el primer salto
        if (landedOnDeepLink) {
          requestAnimationFrame(() => {
            ScrollTrigger.refresh();
            applyBootDeepLink();
          });
        }

        if (reduce || landedOnDeepLink) {
          revealHeroInstant();
          return;
        }

        gsap.set(".hero-brand", { y: 16 });
        gsap.set(".hero-headline", { y: 28 });
        gsap.set(".hero-support", { y: 20 });
        gsap.set(".hero-cta", { y: 14 });

        gsap
          .timeline({ defaults: { ease: "power2.out" } })
          .to(".hero-plan", { opacity: 1, duration: 1.2 }, 0)
          .to(".hero-brand", { opacity: 1, y: 0, duration: 0.7 }, 0.2)
          .to(".hero-headline", { opacity: 1, y: 0, duration: 0.9 }, 0.35)
          .to(".hero-support", { opacity: 1, y: 0, duration: 0.75 }, 0.5)
          .to(".hero-cta", { opacity: 1, y: 0, duration: 0.6 }, 0.68);

        gsap.utils.toArray<HTMLElement>(".reveal").forEach((el) => {
          gsap.fromTo(
            el,
            { opacity: 0, y: 36 },
            {
              opacity: 1,
              y: 0,
              duration: 0.9,
              ease: "power2.out",
              scrollTrigger: {
                trigger: el,
                start: "top 88%",
                toggleActions: "play none none none",
              },
            },
          );
        });
      };

      void whenPageReady().then(release);

      return () => {
        cancelled = true;
        window.removeEventListener("keydown", blockScrollKeys);
        window.removeEventListener("wheel", blockWheel);
        window.removeEventListener("touchmove", blockWheel);
        unlockScroll();
      };
    },
    { scope: root },
  );

  return (
    <div ref={root} className="flex min-h-full flex-col">
      {children}
    </div>
  );
}
