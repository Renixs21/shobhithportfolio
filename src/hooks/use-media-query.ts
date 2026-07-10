"use client";

import { useSyncExternalStore } from "react";

/**
 * SSR-safe media query hook built on useSyncExternalStore — avoids the
 * setState-in-effect cascade by subscribing to the browser as an external
 * store. Returns `false` during SSR and on the server snapshot.
 */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia(query).matches,
    () => false
  );
}
