import { nav } from "../content";

/**
 * Navegación accesible sin competir con la composición del hero
 * (ubicación + marca viven en Hero).
 */
export function SiteHeader() {
  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-20">
      <a href="#contenido-principal" className="skip-link pointer-events-auto">
        Saltar al contenido
      </a>
      <nav
        aria-label="Principal"
        className="sr-only"
      >
        {nav.links.map((link) => {
          const newPage = link.href.startsWith("/");
          return (
            <a
              key={link.href}
              href={link.href}
              className="pointer-events-auto"
              {...(newPage
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
            >
              {link.label}
              {newPage ? (
                <span className="sr-only"> (se abre en otra pestaña)</span>
              ) : null}
            </a>
          );
        })}
      </nav>
    </header>
  );
}
