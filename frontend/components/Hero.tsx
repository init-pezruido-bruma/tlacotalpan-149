import Image from "next/image";
import { hero } from "../content";

export function Hero() {
  return (
    <section
      id="top"
      className="hero-surface relative isolate min-h-[100svh] overflow-hidden"
    >
      <div className="hero-grain" aria-hidden />

      {/*
        Zoom cercano (> mitad de pantalla). Pegado a top/right:
        translate(30%, -15%) recorta ~30% derecha y ~15% arriba.
      */}
      <div
        className="hero-plan pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden
      >
        <Image
          src={hero.plan.src}
          alt=""
          width={2000}
          height={1294}
          priority
          sizes="220vw"
          className="absolute top-0 right-0 h-auto w-[min(200vw,2400px)] max-w-none opacity-[0.92]"
          style={{ transform: "translate(38%, -18%)" }}
        />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[100svh] w-[var(--content)] flex-col pt-9 pb-10 md:pt-11 md:pb-12">
        <p className="hero-brand text-[0.68rem] font-medium tracking-[0.3em] text-hero-ink uppercase md:text-[0.75rem]">
          {hero.location}
        </p>

        <div className="mt-auto max-w-3xl">
          <h1 className="hero-headline text-[clamp(2.4rem,7vw,4.85rem)] leading-[1.04] font-medium tracking-[0.035em] text-hero-ink uppercase">
            {hero.brand}
          </h1>
          <p className="hero-support mt-4 max-w-[22rem] text-[0.95rem] leading-relaxed font-light text-hero-ink/90 md:mt-5 md:max-w-md md:text-base">
            {hero.support}
          </p>
          <div className="hero-cta mt-8 md:mt-10">
            <a
              href={hero.cta.href}
              className="inline-flex items-center gap-2.5 text-[0.68rem] font-medium tracking-[0.26em] text-hero-ink uppercase transition-opacity hover:opacity-70 md:text-[0.75rem]"
            >
              {hero.cta.label}
              <span
                aria-hidden
                className="translate-y-px text-[0.85rem] leading-none font-light"
              >
                ∨
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
