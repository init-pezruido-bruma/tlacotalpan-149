"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { intro } from "../content";
import { pickVideoSrc } from "../lib/scrubVideo";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function IntroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const stack = stackRef.current;
      const video = videoRef.current;
      if (!section || !stack || !video) return;

      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const desktop = window.matchMedia("(min-width: 768px)").matches;

      video.muted = true;
      video.playsInline = true;
      video.loop = false;

      let inView = false;
      let started = false;
      let goingBack = false;
      let reverseTween: gsap.core.Tween | null = null;
      let idle = 0;
      let idleCallback = 0;

      const stopReverse = () => {
        reverseTween?.kill();
        reverseTween = null;
      };

      const goForward = () => {
        if (reduce || !inView) return;
        goingBack = false;
        stopReverse();
        if (
          Number.isFinite(video.duration) &&
          video.currentTime >= video.duration - 0.05
        ) {
          video.currentTime = 0;
        }
        void video.play().catch(() => {});
      };

      const goBack = () => {
        if (reduce || !inView) return;
        goingBack = true;
        video.pause();
        const from = video.currentTime;
        if (!Number.isFinite(from) || from <= 0.03) {
          goForward();
          return;
        }
        reverseTween = gsap.to(video, {
          currentTime: 0,
          duration: from,
          ease: "none",
          overwrite: true,
          onComplete: () => {
            reverseTween = null;
            goingBack = false;
            goForward();
          },
        });
      };

      const playVideo = () => {
        if (reduce || !inView) return;
        if (goingBack) {
          if (reverseTween) {
            reverseTween.resume();
            return;
          }
          goBack();
          return;
        }
        goForward();
      };

      const pauseVideo = () => {
        video.pause();
        reverseTween?.pause();
      };

      const begin = () => {
        if (reduce) return;
        if (!started) {
          started = true;
          const src = pickVideoSrc(intro.video.src, intro.video.srcMobile);
          video.preload = "auto";
          if (video.getAttribute("src") !== src) {
            video.src = src;
          }
          video.load();
        }
        playVideo();
      };

      if (!reduce) {
        const requestIdle = window.requestIdleCallback?.bind(window);
        if (requestIdle) {
          idleCallback = requestIdle(begin, { timeout: 1200 });
        } else {
          idle = window.setTimeout(begin, 250);
        }
      }

      const videoTrigger = ScrollTrigger.create({
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        onEnter: () => {
          inView = true;
          begin();
        },
        onEnterBack: () => {
          inView = true;
          playVideo();
        },
        onLeave: () => {
          inView = false;
          pauseVideo();
        },
        onLeaveBack: () => {
          inView = false;
          pauseVideo();
        },
      });

      video.addEventListener("canplay", playVideo);
      video.addEventListener("ended", goBack);

      const unlock = () => playVideo();
      window.addEventListener("touchstart", unlock, {
        once: true,
        passive: true,
      });

      const cleanupVideo = () => {
        window.clearTimeout(idle);
        window.cancelIdleCallback?.(idleCallback);
        stopReverse();
        videoTrigger.kill();
        video.removeEventListener("canplay", playVideo);
        video.removeEventListener("ended", goBack);
        window.removeEventListener("touchstart", unlock);
      };

      if (reduce) {
        gsap.set(stack, { autoAlpha: 1 });
        return cleanupVideo;
      }

      gsap.set(stack, { autoAlpha: 0 });

      gsap
        .timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: desktop ? "+=100%" : "+=55%",
            pin: true,
            scrub: 0.4,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        })
        .to({}, { duration: 0.9 })
        .to(stack, { autoAlpha: 1, duration: 0.7 })
        .to({}, { duration: 0.8 });

      return cleanupVideo;
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id={intro.id}
      className="intro-surface relative isolate min-h-[100svh] md:h-[100svh] md:overflow-hidden"
    >
      <figure className="absolute inset-0">
        <video
          ref={videoRef}
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
          poster={intro.video.poster}
          muted
          playsInline
          preload="none"
          aria-hidden
          disablePictureInPicture
        />
        <figcaption className="sr-only">{intro.video.alt}</figcaption>
      </figure>

      <div className="relative z-10 flex min-h-[100svh] items-center justify-center px-6 py-12 max-md:py-12 md:py-0">
        <div
          ref={stackRef}
          className="relative w-full max-w-xl will-change-[opacity,transform]"
          style={{ opacity: 0, visibility: "hidden" }}
        >
          <div className="bg-intro-surface/92 px-6 py-8 text-center backdrop-blur-md supports-[backdrop-filter]:bg-intro-surface/85 max-md:px-6 max-md:py-8 md:px-12 md:py-12">
            <h2 className="intro-title text-[clamp(1.75rem,4.5vw,2.75rem)] font-medium tracking-[0.14em] text-intro-ink uppercase">
              {intro.title}
            </h2>
            <p className="intro-body mt-8 text-[0.95rem] leading-[1.75] font-light text-intro-ink md:text-base md:leading-[1.8]">
              {intro.body}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
