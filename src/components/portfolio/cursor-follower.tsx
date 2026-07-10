"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useMediaQuery } from "@/hooks/use-media-query";

/**
 * A dual-ring custom cursor. The outer ring lags and snaps toward
 * interactive elements; the inner dot tracks precisely. Disabled on
 * touch devices and when reduced motion is requested.
 */
export function CursorFollower() {
  const reduced = useReducedMotion();
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");
  const enabled = finePointer && !reduced;
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [down, setDown] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`;

      const target = e.target as HTMLElement;
      const interactive = target.closest(
        'a, button, [role="button"], [data-cursor], input, textarea, select, [data-cursor-label]'
      );
      if (interactive) {
        setHovering(true);
        const l = interactive.getAttribute("data-cursor-label");
        setLabel(l);
      } else {
        setHovering(false);
        setLabel(null);
      }
    };

    const onDown = () => setDown(true);
    const onUp = () => setDown(false);

    const tick = () => {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
      if (labelRef.current) {
        labelRef.current.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, 0) translateY(2rem)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      cancelAnimationFrame(raf);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[100] hidden md:block"
      aria-hidden="true"
    >
      <div
        ref={ringRef}
        className="absolute left-0 top-0 rounded-full border transition-[width,height,background-color,border-color] duration-300"
        style={{
          borderColor: hovering
            ? "color-mix(in oklch, var(--aurora) 80%, transparent)"
            : "color-mix(in oklch, var(--ember) 55%, transparent)",
          backgroundColor: hovering
            ? "color-mix(in oklch, var(--aurora) 10%, transparent)"
            : "transparent",
          width: down ? "1.5rem" : hovering ? "3rem" : "2rem",
          height: down ? "1.5rem" : hovering ? "3rem" : "2rem",
        }}
      />
      <div
        ref={dotRef}
        className="absolute left-0 top-0 h-1.5 w-1.5 rounded-full"
        style={{
          backgroundColor: "var(--ember)",
          boxShadow:
            "0 0 12px color-mix(in oklch, var(--ember) 80%, transparent)",
        }}
      />
      <div
        ref={labelRef}
        className="absolute left-0 top-0 whitespace-nowrap rounded-full border border-border bg-popover/90 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-foreground opacity-0 backdrop-blur transition-opacity duration-200"
        style={{ opacity: label ? 1 : 0 }}
      >
        {label}
      </div>
    </div>
  );
}
