import Image from "next/image";
import { spaces } from "../content";

export function SpacesSection() {
  return (
    <section
      id={spaces.id}
      className="bg-background px-[max(1.25rem,calc((100%-var(--content))/2))] py-[var(--section-pad)]"
    >
      <div className="reveal max-w-2xl">
        <p className="text-xs font-medium tracking-[0.2em] text-muted uppercase">
          {spaces.eyebrow}
        </p>
        <h2 className="mt-4 font-display text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.1] tracking-[-0.02em]">
          {spaces.headline}
        </h2>
      </div>

      <div className="mt-14 grid gap-12 md:mt-20 md:grid-cols-12 md:gap-10">
        <ul className="reveal flex flex-col gap-10 md:col-span-5">
          {spaces.items.map((item) => (
            <li key={item.title} className="border-t border-line pt-6">
              <h3 className="font-display text-2xl tracking-[-0.01em]">
                {item.title}
              </h3>
              <p className="mt-3 max-w-sm text-base leading-relaxed text-muted">
                {item.body}
              </p>
            </li>
          ))}
        </ul>
        <div className="reveal relative aspect-[3/4] overflow-hidden md:col-span-7 md:aspect-auto md:min-h-[32rem]">
          <Image
            src={spaces.image.src}
            alt={spaces.image.alt}
            fill
            sizes="(max-width: 768px) 100vw, 58vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
