"use client";

import { useSyncExternalStore } from "react";

/**
 * SSR-safe "are we on the client?" flag. Built on useSyncExternalStore
 * to avoid the setState-in-effect pattern. Returns false during SSR
 * and the first client render, true thereafter.
 */
export function useIsClient(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}
