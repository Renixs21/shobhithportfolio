"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const SEQUENCE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

/**
 * Konami code easter egg. On the classic sequence, detonates a burst
 * of ember/aurora confetti and a hidden acknowledgement. A reward for
 * the curious — exactly the kind of micro-interaction the brief asks for.
 */
export function KonamiEasterEgg() {
  const [active, setActive] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let buffer: string[] = [];
    const onKey = (e: KeyboardEvent) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      buffer.push(key);
      if (buffer.length > SEQUENCE.length) buffer = buffer.slice(-SEQUENCE.length);

      let matched = 0;
      for (let i = 0; i < buffer.length; i++) {
        if (buffer[i] === SEQUENCE[i]) matched++;
        else {
          matched = 0;
          break;
        }
      }
      setProgress(matched);

      if (matched === SEQUENCE.length) {
        buffer = [];
        setActive(true);
        window.setTimeout(() => setActive(false), 3600);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const pieces = Array.from({ length: 60 });

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="pointer-events-none fixed inset-0 z-[120] overflow-hidden"
          aria-hidden="true"
        >
          {pieces.map((_, i) => {
            const left = Math.random() * 100;
            const delay = Math.random() * 0.4;
            const dur = 1.6 + Math.random() * 1.2;
            const col =
              i % 3 === 0
                ? "oklch(0.74 0.2 45)"
                : i % 3 === 1
                ? "oklch(0.82 0.13 165)"
                : "oklch(0.8 0.16 95)";
            const size = 6 + Math.random() * 8;
            return (
              <motion.span
                key={i}
                initial={{ y: -40, x: 0, opacity: 1, rotate: 0 }}
                animate={{
                  y: "110vh",
                  x: (Math.random() - 0.5) * 200,
                  rotate: Math.random() * 720 - 360,
                  opacity: [1, 1, 0],
                }}
                transition={{ duration: dur, delay, ease: "easeIn" }}
                className="absolute top-0"
                style={{
                  left: `${left}%`,
                  width: size,
                  height: size * 1.4,
                  backgroundColor: col,
                  borderRadius: i % 2 === 0 ? "50%" : "2px",
                }}
              />
            );
          })}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center"
          >
            <div className="font-display text-fluid-2xl font-bold text-signal-gradient">
              You found it.
            </div>
            <div className="mt-2 font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
              signal unlocked · 30 lives granted
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
