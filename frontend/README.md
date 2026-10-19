# Frontend — plantilla inmobiliaria

Landing de un solo scroll (estilo presentación de producto) para proyectos inmobiliarios.

## Arranque

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Personalizar

1. Edita **`content.ts`** — marca, copy, CTAs e URLs de imagen.
2. Ajusta tokens en **`app/globals.css`** (color, ritmo).
3. Sustituye fotos de Unsplash por assets propios en `public/` cuando tengas material real.

## Brochure

El formulario vive en `/contacto`. `brochureDelivery` en `content.ts` elige el envío: `mailto` abre el correo de quien visita con el asunto y el texto listos; `resend` lo manda el sitio. Para Resend, copia `.env.example` a `.env.local`, pega la llave y verifica el dominio del remitente.

## Stack

Next.js (App Router) · Tailwind CSS · GSAP (`@gsap/react` + ScrollTrigger)
