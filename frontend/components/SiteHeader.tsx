import { nav } from "../content";

/**
 * Navegación accesible sin competir con la composición del hero
 * (ubicación + marca viven en Hero).
 */
export function SiteHeader() {
  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-20">
      <nav
        aria-label="Principal"
        className="sr-only"
      >
        {nav.links.map((link) => (
          <a key={link.href} href={link.href} className="pointer-events-auto">
            {link.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
