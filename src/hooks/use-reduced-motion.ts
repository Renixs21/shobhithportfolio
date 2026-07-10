"use client";

import { useMediaQuery } from "./use-media-query";

/**
 * Respects prefers-reduced-motion. Components should use this to
 * gracefully degrade heavy animation into lighter alternatives.
 */
export function useReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}
