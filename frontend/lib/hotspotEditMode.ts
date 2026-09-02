/** Modo edición de hotspots: visible en dev para que HMR de content.ts sea usable. */
export function isHotspotEditMode(): boolean {
  if (process.env.NODE_ENV === "production") return false;
  if (typeof window === "undefined") return false;

  const params = new URLSearchParams(window.location.search);
  if (params.get("edit-hotspots") === "0") return false;
  if (params.has("edit-hotspots")) return true;

  return true;
}
