"use client";

import { useEffect } from "react";

/**
 * La portada marca el documento como ocupado hasta que termina la animación.
 * En estas páginas el scroll ya está libre por CSS; aquí solo se quita ese aviso.
 */
export function ReleasePageBoot() {
  useEffect(() => {
    document.documentElement.removeAttribute("aria-busy");
  }, []);

  return null;
}
