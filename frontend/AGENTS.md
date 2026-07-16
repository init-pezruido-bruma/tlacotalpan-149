<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Tlacotalpan 149 — Frontend

Landing inmobiliaria de un solo scroll: presentar el producto completo en una página, con narrativa visual estilo Apple (secciones en secuencia, pin/scrub, tipografía limpia).

## Stack

- **Next.js** (App Router) + **React** + **TypeScript**
- **Tailwind CSS** para UI ligera (sin librerías de componentes pesadas)
- **GSAP** + ScrollTrigger para animaciones al scroll
- Preferir `@gsap/react` (`useGSAP`) cuando se escriba código de animación

## Principios

1. **Una página, una historia** — el visitante baja y entiende el proyecto sin navegar a subpáginas para el pitch principal.
2. **Limpieza** — poco ruido visual; una idea por sección; tipografía y espacio hacen el trabajo.
3. **Velocidad** — LCP/INP primero: imágenes optimizadas (`next/image`), JS mínimo, animar solo `transform`/`opacity`.
4. **Componentes ligeros** — Tailwind utilitario; sin cards decorativas ni UI tipo dashboard.

## Dónde mirar

- Reglas del agente: `../.cursor/rules/` (visión, diseño, rendimiento, GSAP)
- Docs Next locales: `node_modules/next/dist/docs/`
