"use client";

import { motion, useInView } from "framer-motion";
import { useRef, type ElementType } from "react";
import { EASE, DURATION } from "@/lib/motion-tokens";

interface RevealTextProps {
  children: string;
  as?: ElementType;
  className?: string;
  delay?: number;
  /** split into per-word masks */
  word?: boolean;
  once?: boolean;
}

/**
 * Reveals text from behind a mask as it scrolls into view.
 * Lines rise; words stagger. Editorial, cinematic.
 */
export function RevealText({
  children,
  as: Tag = "span",
  className,
  delay = 0,
  word = false,
  once = true,
}: RevealTextProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once, margin: "-12% 0px" });

  if (!word) {
    return (
      <Tag
        ref={ref}
        className={className}
        style={{ overflow: "hidden", display: "block" }}
      >
        <motion.span
          style={{ display: "block", willChange: "transform" }}
          initial={{ y: "115%" }}
          animate={inView ? { y: "0%" } : { y: "115%" }}
          transition={{ duration: DURATION.hero, ease: EASE.signal, delay }}
        >
          {children}
        </motion.span>
      </Tag>
    );
  }

  const words = children.split(" ");
  return (
    <Tag ref={ref} className={className} aria-label={children}>
      {words.map((w, i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            overflow: "hidden",
            verticalAlign: "top",
          }}
        >
          <motion.span
            style={{ display: "inline-block", willChange: "transform" }}
            initial={{ y: "115%" }}
            animate={inView ? { y: "0%" } : { y: "115%" }}
            transition={{
              duration: DURATION.slow,
              ease: EASE.signal,
              delay: delay + i * 0.06,
            }}
          >
            {w}
            {i < words.length - 1 ? "\u00A0" : ""}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
