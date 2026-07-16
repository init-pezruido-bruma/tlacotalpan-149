import Image from "next/image";
import { place } from "../content";

export function PlaceSection() {
  return (
    <section
      id={place.id}
      className="bg-surface px-[max(1.25rem,calc((100%-var(--content))/2))] py-[var(--section-pad)]"
    >
      <div className="grid items-end gap-10 md:grid-cols-12 md:gap-12">
        <div className="reveal md:col-span-5">
          <p className="text-xs font-medium tracking-[0.2em] text-muted uppercase">
            {place.eyebrow}
          </p>
          <h2 className="mt-4 font-display text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.1] tracking-[-0.02em]">
            {place.headline}
          </h2>
          <p className="mt-6 max-w-sm text-base leading-relaxed text-muted">
            {place.body}
          </p>
        </div>
        <div className="reveal relative aspect-[4/5] overflow-hidden md:col-span-7 md:aspect-[5/4]">
          <Image
            src={place.image.src}
            alt={place.image.alt}
            fill
            sizes="(max-width: 768px) 100vw, 58vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
