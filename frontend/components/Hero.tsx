import Image from "next/image";
import { hero } from "../content";

export function Hero() {
  return (
    <section
      id="top"
      className="relative isolate min-h-[100svh] overflow-hidden bg-foreground"
    >
      <Image
        src={hero.image.src}
        alt={hero.image.alt}
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/35 to-black/25"
        aria-hidden
      />

      <div className="relative z-10 mx-auto flex min-h-[100svh] w-[var(--content)] flex-col justify-end pb-16 pt-28 md:pb-24">
        <p className="hero-brand mb-4 font-sans text-xs font-medium tracking-[0.22em] text-hero-ink/80 uppercase">
          {hero.brand}
        </p>
        <h1 className="hero-headline max-w-3xl font-display text-[clamp(2.75rem,8vw,5.5rem)] leading-[1.02] tracking-[-0.02em] text-hero-ink whitespace-pre-line">
          {hero.headline}
        </h1>
        <p className="hero-support mt-6 max-w-md text-base leading-relaxed text-hero-ink/85 md:text-lg">
          {hero.support}
        </p>
        <div className="hero-cta mt-10">
          <a
            href={hero.cta.href}
            className="inline-flex items-center border-b border-hero-ink/50 pb-1 text-sm tracking-wide text-hero-ink transition-[border-color] hover:border-hero-ink"
          >
            {hero.cta.label}
          </a>
        </div>
      </div>
    </section>
  );
}
