/** Modo edición de coordenadas: activar con `?edit-hotspots=1` en dev. */
export function isHotspotEditMode(): boolean {
  if (process.env.NODE_ENV === "production") return false;
  if (typeof window === "undefined") return false;

  const params = new URLSearchParams(window.location.search);
  return params.get("edit-hotspots") === "1";
}
