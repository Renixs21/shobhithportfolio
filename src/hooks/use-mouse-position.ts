"use client";

import { useEffect, useRef } from "react";

export interface MousePosition {
  x: number;
  y: number;
  /** Normalized -1..1 relative to viewport center */
  nx: number;
  ny: number;
}

/**
 * Tracks the pointer with rAF-throttling. Returns a ref so consumers
 * can read the latest position inside their own animation loops without
 * triggering React re-renders.
 */
export function useMousePosition() {
  const pos = useRef<MousePosition>({
    x: 0,
    y: 0,
    nx: 0,
    ny: 0,
  });
  const target = useRef<MousePosition>({ x: 0, y: 0, nx: 0, ny: 0 });
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      target.current = {
        x: e.clientX,
        y: e.clientY,
        nx: (e.clientX / window.innerWidth) * 2 - 1,
        ny: (e.clientY / window.innerHeight) * 2 - 1,
      };
    };
    window.addEventListener("mousemove", handle, { passive: true });

    const tick = () => {
      // Lerp toward target for buttery smoothing
      pos.current.x += (target.current.x - pos.current.x) * 0.18;
      pos.current.y += (target.current.y - pos.current.y) * 0.18;
      pos.current.nx += (target.current.nx - pos.current.nx) * 0.18;
      pos.current.ny += (target.current.ny - pos.current.ny) * 0.18;
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", handle);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  return pos;
}
