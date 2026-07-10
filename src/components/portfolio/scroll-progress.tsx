"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/**
 * A slim signal progress bar pinned to the top of the viewport.
 * Ember→aurora gradient tracks scroll position through the document.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 26,
    mass: 0.4,
  });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed left-0 top-0 z-[90] h-[2px] w-full origin-left"
      aria-hidden="true"
    >
      <div
        className="h-full w-full"
        style={{
          background:
            "linear-gradient(90deg, var(--ember), oklch(0.8 0.16 95), var(--aurora))",
          boxShadow: "0 0 12px color-mix(in oklch, var(--ember) 60%, transparent)",
        }}
      />
    </motion.div>
  );
}
