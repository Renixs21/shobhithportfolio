/**
 * Motion tokens — the rhythm of the experience.
 * Cinematic pacing: energy → silence → movement → pause → surprise → rest.
 */

export const EASE = {
  // Signature easing — a confident, slightly-anticipated deceleration
  signal: [0.16, 1, 0.3, 1] as [number, number, number, number],
  ember: [0.34, 1.56, 0.64, 1] as [number, number, number, number], // gentle overshoot
  aurora: [0.22, 0.61, 0.36, 1] as [number, number, number, number],
  sharp: [0.85, 0, 0.15, 1] as [number, number, number, number],
  linear: [0, 0, 1, 1] as [number, number, number, number],
};

export const DURATION = {
  instant: 0.12,
  fast: 0.24,
  normal: 0.48,
  slow: 0.8,
  hero: 1.4,
  page: 0.6,
  scroll: 0.9,
};

export const SPRING = {
  // Soft, organic — for magnetic + physical interactions
  magnetic: { type: "spring", stiffness: 180, damping: 14, mass: 0.4 },
  gentle: { type: "spring", stiffness: 120, damping: 18, mass: 0.6 },
  snappy: { type: "spring", stiffness: 320, damping: 22, mass: 0.5 },
  bouncy: { type: "spring", stiffness: 260, damping: 12, mass: 0.7 },
  slow: { type: "spring", stiffness: 60, damping: 16, mass: 1 },
} as const;

export const STAGGER = {
  tight: 0.04,
  normal: 0.07,
  loose: 0.12,
  cinematic: 0.16,
};

/** Standard reveal variants for scroll-triggered entrances */
export const revealVariants = {
  hidden: { opacity: 0, y: 28, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: DURATION.slow, ease: EASE.signal },
  },
};

export const revealLineVariants = {
  hidden: { opacity: 0, y: "110%" },
  visible: {
    opacity: 1,
    y: "0%",
    transition: { duration: DURATION.hero, ease: EASE.signal },
  },
};
