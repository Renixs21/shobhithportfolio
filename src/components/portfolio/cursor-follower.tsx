"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useMediaQuery } from "@/hooks/use-media-query";

/**
 * A concentric custom cursor — a small ember ball enclosed within a
 * thin ember ring. The pair move together (always centered) and the
 * whole ball smoothly RESCALES (transform: scale) from small to big
 * when hovering interactive/clickable elements. Disabled on touch
 * devices and when reduced motion is requested.
 */
export function CursorFollower() {
  const reduced = useReducedMotion();
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");
  const enabled = finePointer && !reduced;
  const wrapRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;
    const wrap = wrapRef.current;
    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!wrap || !ring || !dot) return;

    // Target cursor position (exact pointer).
    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 2;
    // Smoothed position (shared by ring + dot so they stay concentric).
    let cx = tx;
    let cy = ty;
    // Current scale (eased toward target for a smooth rescale).
    let scale = 1;
    let targetScale = 1;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;

      const target = e.target as HTMLElement;
      const interactive = target.closest(
        'a, button, [role="button"], input, textarea, select, [data-cursor]'
      );
      if (interactive) {
        targetScale = 1.6;
        const l = interactive.getAttribute("data-cursor-label");
        setLabel(l);
      } else {
        targetScale = 1;
        setLabel(null);
      }
    };

    const onDown = () => {
      targetScale = 0.8;
    };
    const onUp = () => {
      targetScale = 1;
    };

    const tick = () => {
      // Ease position toward the pointer — ring + dot share this so
      // the dot always sits dead-center in the ring.
      cx += (tx - cx) * 0.22;
      cy += (ty - cy) * 0.22;
      // Ease scale toward target for a smooth small↔big rescale.
      scale += (targetScale - scale) * 0.18;

      wrap.style.transform = `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -50%)`;
      const s = scale.toFixed(4);
      ring.style.transform = `translate(-50%, -50%) scale(${s})`;
      dot.style.transform = `translate(-50%, -50%) scale(${s})`;
      if (labelRef.current) {
        labelRef.current.style.transform = `translate3d(${cx}px, ${cy}px, 0) translate(-50%, 0) translateY(2.25rem)`;
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
      {/* Wrapper carries the shared position so dot + ring stay concentric. */}
      <div
        ref={wrapRef}
        className="absolute left-0 top-0"
        style={{ willChange: "transform" }}
      >
        {/* Outer ring — thin ember circle (fixed base size, scales via transform) */}
        <div
          ref={ringRef}
          className="absolute left-0 top-0 rounded-full border"
          style={{
            width: "2.25rem",
            height: "2.25rem",
            borderWidth: "1.5px",
            borderColor: "color-mix(in oklch, var(--ember) 70%, transparent)",
            willChange: "transform",
          }}
        />
        {/* Inner ball — small filled ember dot, centered inside the ring */}
        <div
          ref={dotRef}
          className="absolute left-0 top-0 rounded-full"
          style={{
            width: "0.4rem",
            height: "0.4rem",
            backgroundColor: "var(--ember)",
            boxShadow:
              "0 0 10px color-mix(in oklch, var(--ember) 80%, transparent)",
            willChange: "transform",
          }}
        />
      </div>

      {/* Hover label (optional) */}
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
