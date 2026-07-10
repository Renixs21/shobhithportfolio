/**
 * Read a CSS custom property (color token) and return it as an
 * "r, g, b" string suitable for canvas `rgba()` templates. Reads the
 * computed value from the active theme, so it adapts when the theme
 * class flips on <html>.
 *
 * Falls back to the provided default if the token can't be resolved
 * (e.g. during SSR or if the var is missing).
 */
export function readColorVar(name: string, fallback: string): string {
  if (typeof document === "undefined") return fallback;
  const probe = document.createElement("span");
  probe.style.display = "none";
  document.body.appendChild(probe);
  probe.style.color = `var(${name})`;
  const v = getComputedStyle(probe).color;
  probe.remove();
  const m = v.match(/rgba?\(([^)]+)\)/);
  const parts = m ? m[1].split(",").map((s) => s.trim()) : null;
  if (parts && parts.length >= 3) {
    return `${parts[0]}, ${parts[1]}, ${parts[2]}`;
  }
  return fallback;
}
