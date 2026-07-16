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
    <footer className="border-t border-line/40 bg-background px-[max(1.25rem,calc((100%-var(--content))/2))] py-8">
      <div className="flex flex-col gap-2 text-sm text-muted md:flex-row md:items-center md:justify-between">
        <p className="font-display text-foreground">{footer.brand}</p>
        <p>{footer.legal}</p>
      </div>
    </footer>
  );
}
