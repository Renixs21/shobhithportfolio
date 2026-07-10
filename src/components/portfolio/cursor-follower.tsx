"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useMediaQuery } from "@/hooks/use-media-query";

/**
 * A concentric custom cursor — a small ember ball enclosed within a
 * thin ember ring. The pair move together (always centered) and grow
 * smoothly when hovering interactive/clickable elements. Disabled on
 * touch devices and when reduced motion is requested.
 *
 * Matches the reference: default = small dot inside thin ring; hover
 * over clickable = the whole ball grows with a smooth animation.
 */
export function CursorFollower() {
  const reduced = useReducedMotion();
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");
  const enabled = finePointer && !reduced;
  const wrapRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;
    const wrap = wrapRef.current;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!wrap || !dot || !ring) return;

    // The target cursor position (exact pointer).
    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 2;
    // The smoothed position (both dot + ring share this so they stay
    // perfectly concentric while easing toward the pointer).
    let cx = tx;
    let cy = ty;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;

      const target = e.target as HTMLElement;
      const interactive = target.closest(
        'a, button, [role="button"], input, textarea, select, [data-cursor]'
      );
      if (interactive) {
        wrap.setAttribute("data-state", "hover");
        const l = interactive.getAttribute("data-cursor-label");
        setLabel(l);
      } else {
        wrap.setAttribute("data-state", "default");
        setLabel(null);
      }
    };

    const onDown = () => wrap.setAttribute("data-pressed", "true");
    const onUp = () => wrap.removeAttribute("data-pressed");

    const tick = () => {
      // Ease both toward the target — dot and ring share the same
      // position so the dot always sits dead-center in the ring.
      cx += (tx - cx) * 0.22;
      cy += (ty - cy) * 0.22;
      const tf = `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -50%)`;
      wrap.style.transform = tf;
      if (labelRef.current) {
        labelRef.current.style.transform = `${tf} translateY(2.25rem) translate(-50%, 0)`;
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
      {/* Wrapper carries the shared position so dot + ring stay concentric.
          data-state drives the smooth scale animation on hover. */}
      <div
        ref={wrapRef}
        data-state="default"
        className="absolute left-0 top-0 transition-transform duration-300 ease-out"
        style={{ willChange: "transform" }}
      >
        {/* Outer ring — thin ember circle */}
        <div
          ref={ringRef}
          className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full border transition-[width,height,border-width] duration-300 ease-out"
          style={{
            width: "2.25rem",
            height: "2.25rem",
            borderWidth: "1.5px",
            borderColor: "color-mix(in oklch, var(--ember) 70%, transparent)",
          }}
        />
        {/* Inner ball — small filled ember dot, centered inside the ring */}
        <div
          ref={dotRef}
          className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full transition-[width,height] duration-300 ease-out"
          style={{
            width: "0.4rem",
            height: "0.4rem",
            backgroundColor: "var(--ember)",
            boxShadow:
              "0 0 10px color-mix(in oklch, var(--ember) 80%, transparent)",
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

      {/* Hover-state scaling: when over a clickable element, the ring +
          dot both grow smoothly. Pressed shrinks slightly for feedback. */}
      <style>{`
        [data-state="hover"] > div {
          width: 3.5rem !important;
          height: 3.5rem !important;
        }
        [data-state="hover"] > div:nth-child(2) {
          width: 0.55rem !important;
          height: 0.55rem !important;
        }
        [data-state="default"][data-pressed] > div {
          width: 1.75rem !important;
          height: 1.75rem !important;
        }
        [data-state="default"][data-pressed] > div:nth-child(2) {
          width: 0.3rem !important;
          height: 0.3rem !important;
        }
      `}</style>
    </div>
  );
}
