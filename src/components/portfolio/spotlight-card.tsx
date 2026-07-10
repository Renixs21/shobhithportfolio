"use client";

import { useRef, type ReactNode } from "react";

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
  radius?: number;
  color?: string;
}

/**
 * A card that renders a soft radial spotlight following the cursor,
 * layered above the content with a mix-blend. Pure CSS — no rAF.
 */
export function SpotlightCard({
  children,
  className = "",
  radius = 320,
  color = "oklch(0.74 0.2 45 / 18%)",
}: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      className={`group/spotlight relative overflow-hidden ${className}`}
      data-cursor
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/spotlight:opacity-100"
        style={{
          background: `radial-gradient(${radius}px circle at var(--mx, 50%) var(--my, 50%), ${color}, transparent 70%)`,
        }}
      />
      {children}
    </div>
  );
}
