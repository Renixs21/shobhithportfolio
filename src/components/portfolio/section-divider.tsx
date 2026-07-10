"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { EASE, DURATION } from "@/lib/motion-tokens";

interface SectionDividerProps {
  label?: string;
  index?: string;
  accent?: "ember" | "aurora";
}

/**
 * An animated chapter break: a hairline that draws itself across the
 * viewport, with an optional index/label monogram. Acts as the rhythm
 * between cinematic sections.
 */
export function SectionDivider({
  label,
  index,
  accent = "ember",
}: SectionDividerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const accentColor =
    accent === "ember"
      ? "oklch(0.74 0.2 45)"
      : "oklch(0.82 0.13 165)";

  return (
    <div
      ref={ref}
      className="relative mx-auto flex w-full max-w-7xl items-center gap-6 px-6 py-12 md:px-10"
      aria-hidden="true"
    >
      {index && (
        <motion.span
          initial={{ opacity: 0, x: -12 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: DURATION.normal, ease: EASE.signal }}
          className="font-mono text-xs tracking-widest text-muted-foreground"
        >
          {index}
        </motion.span>
      )}
      <div className="relative h-px flex-1 overflow-hidden bg-hairline">
        <motion.div
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: DURATION.scroll, ease: EASE.signal }}
          style={{
            transformOrigin: "left",
            background: `linear-gradient(90deg, ${accentColor}, transparent)`,
          }}
          className="absolute inset-0"
        />
      </div>
      {label && (
        <motion.span
          initial={{ opacity: 0, x: 12 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{
            duration: DURATION.normal,
            ease: EASE.signal,
            delay: 0.2,
          }}
          className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground"
        >
          {label}
        </motion.span>
      )}
    </div>
  );
}
