import { nav, site } from "../content";

export function SiteHeader() {
  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-20">
      <div className="mx-auto flex w-[var(--content)] items-center justify-between py-6 md:py-8">
        <a
          href="#top"
          className="pointer-events-auto font-display text-lg tracking-[0.04em] text-hero-ink"
        >
          {site.brand}
          <span className="ml-2 font-sans text-xs font-medium tracking-[0.18em] uppercase opacity-70">
            {site.tagline}
          </span>
        </a>
        <nav
          aria-label="Principal"
          className="pointer-events-auto hidden items-center gap-8 text-sm text-hero-ink/85 md:flex"
        >
          {nav.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="transition-opacity hover:opacity-100 opacity-80"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
