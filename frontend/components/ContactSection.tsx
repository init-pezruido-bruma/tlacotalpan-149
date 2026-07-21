import { contact, footer } from "../content";

export function ContactSection() {
  return (
    <section
      id={contact.id}
      className="bg-accent px-[max(1.25rem,calc((100%-var(--content))/2))] py-[var(--section-pad)] text-hero-ink"
    >
      <div className="reveal max-w-2xl">
        <h2 className="font-display text-[clamp(2.25rem,5vw,3.75rem)] leading-[1.08] tracking-[-0.02em]">
          {contact.headline}
        </h2>
        <p className="mt-6 max-w-md text-base leading-relaxed text-hero-ink/80 md:text-lg">
          {contact.body}
        </p>
        <a
          href={contact.cta.href}
          className="mt-10 inline-flex border-b border-hero-ink/45 pb-1 text-sm tracking-wide transition-[border-color] hover:border-hero-ink"
        >
          {contact.cta.label}
        </a>
        <p className="mt-8 text-xs tracking-wide text-hero-ink/55">
          {contact.note}
        </p>
      </div>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer className="footer-surface relative isolate overflow-hidden">
      <div className="relative z-10 mx-auto flex min-h-[min(52svh,28rem)] w-[var(--content)] flex-col justify-end gap-10 pt-24 pb-10 md:min-h-[min(48svh,26rem)] md:flex-row md:items-end md:justify-between md:gap-12 md:pt-28 md:pb-12">
        <div className="max-w-3xl">
          <p className="text-[0.68rem] font-medium tracking-[0.28em] text-hero-ink/90 uppercase md:text-[0.72rem]">
            {footer.location}
          </p>
          <p className="mt-4 text-[clamp(1.85rem,5.5vw,3.5rem)] leading-[1.05] font-medium tracking-[0.06em] text-hero-ink uppercase md:mt-5">
            {footer.brand}
          </p>
          <p className="mt-4 max-w-md text-[0.85rem] leading-relaxed font-light text-hero-ink/80 md:mt-5 md:text-[0.95rem]">
            {footer.tagline}
          </p>
        </div>

        <a
          href={footer.privacy.href}
          className="shrink-0 self-start text-[0.8rem] text-hero-ink/85 underline decoration-hero-ink/35 underline-offset-[5px] transition-[text-decoration-color,color] hover:text-hero-ink hover:decoration-hero-ink/70 md:self-end md:text-[0.85rem]"
        >
          {footer.privacy.label}
        </a>
      </div>
    </footer>
  );
}
