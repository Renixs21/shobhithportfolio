"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { EASE, DURATION, STAGGER } from "@/lib/motion-tokens";

interface AnimatedSectionProps {
  id?: string;
  children: ReactNode;
  className?: string;
  /** stagger children with the section container */
  stagger?: keyof typeof STAGGER;
  as?: "section" | "div";
}

const containerVariants = (stagger: number): Variants => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: stagger, delayChildren: 0.05 },
  },
});

export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: DURATION.slow, ease: EASE.signal },
  },
};

/**
 * Reveals its staggered children when scrolled into view.
 * Children must use `motion.*` with `variants={itemVariants}`.
 */
export function AnimatedSection({
  id,
  children,
  className,
  stagger = "normal",
  as = "section",
}: AnimatedSectionProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px" });
  const MotionTag = motion[as];

  return (
    <MotionTag
      ref={ref}
      id={id}
      className={className}
      variants={containerVariants(STAGGER[stagger])}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
    >
      {children}
    </MotionTag>
  );
}
