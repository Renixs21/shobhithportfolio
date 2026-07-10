"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { SPRING } from "@/lib/motion-tokens";

interface MagneticProps {
  children: ReactNode;
  strength?: number;
  className?: string;
  as?: "div" | "button" | "a" | "span";
  href?: string;
  cursorLabel?: string;
  onClick?: () => void;
}

/**
 * Magnetic wrapper — element drifts toward the cursor while hovered,
 * then springs back on exit. GPU-friendly transforms only.
 */
export function Magnetic({
  children,
  strength = 0.4,
  className,
  as = "div",
  href,
  cursorLabel,
  onClick,
}: MagneticProps) {
  const ref = useRef<HTMLElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, SPRING.magnetic);
  const sy = useSpring(y, SPRING.magnetic);

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * strength);
    y.set((e.clientY - cy) * strength);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const MotionTag = motion[as] as typeof motion.div;

  return (
    <MotionTag
      ref={ref as never}
      href={href}
      onClick={onClick}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ x: sx, y: sy }}
      className={className}
      data-cursor
      data-cursor-label={cursorLabel}
    >
      {children}
    </MotionTag>
  );
}
