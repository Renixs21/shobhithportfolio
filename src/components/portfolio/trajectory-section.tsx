"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { MILESTONES, type Milestone } from "@/lib/portfolio-data";
import { EASE, DURATION } from "@/lib/motion-tokens";

function TimelineRow({ m, index }: { m: Milestone; index: number }) {
  const accent =
    m.accent === "ember" ? "var(--ember)" : "var(--aurora)";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-15% 0px" }}
      transition={{
        duration: DURATION.slow,
        ease: EASE.signal,
        delay: index * 0.08,
      }}
      className="relative grid grid-cols-[auto_1fr] gap-x-6 py-7 md:grid-cols-[8rem_1fr] md:gap-x-10"
    >
      {/* Date column (left of rail) */}
      <div className="pt-1 text-right md:text-left">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
          {m.period}
        </span>
      </div>

      {/* Dot on the rail */}
      <div
        className="absolute left-[6.5rem] top-9 h-2.5 w-2.5 -translate-x-1/2 rounded-full ring-4 ring-obsidian md:left-[12.5rem]"
        style={{ backgroundColor: accent }}
        aria-hidden
      />

      {/* Content column (right of rail) */}
      <div className="pl-6 md:pl-12">
        <h3 className="font-display text-fluid-lg font-medium leading-snug text-foreground md:text-2xl">
          {m.title}
        </h3>
        {m.tag && (
          <div className="mt-1.5 font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
            {m.tag}
          </div>
        )}
        {m.subtitle && (
          <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground/80">
            {m.subtitle}
          </div>
        )}
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
          {m.detail}
        </p>
      </div>
    </motion.div>
  );
}

export function TrajectorySection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 65%", "end 75%"],
  });
  // The ember rail fills from top to bottom as the section scrolls past.
  const railScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section
      ref={ref}
      id="trajectory"
      className="scope-dark relative overflow-hidden bg-obsidian py-28 md:py-36"
    >
      <div className="relative mx-auto w-full max-w-5xl px-6 md:px-10">
        {/* Heading — "A short, deliberate trajectory." */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-12% 0px" }}
          transition={{ duration: DURATION.slow, ease: EASE.signal }}
          className="mb-20 max-w-3xl"
        >
          <div className="font-mono text-xs tracking-widest text-ember">
            03 / TRAJECTORY
          </div>
          <h2 className="mt-3 font-display text-fluid-2xl font-medium leading-[1] tracking-tightest text-foreground">
            A short,{" "}
            <span className="font-italic-accent text-ember">deliberate</span>{" "}
            trajectory.
          </h2>
          <p className="mt-4 max-w-md text-muted-foreground">
            Education, arenas, and shipments — in the order they happened,
            most recent first.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Static rail (hairline) */}
          <div className="absolute bottom-0 left-[6.5rem] top-2 w-px bg-hairline md:left-[12.5rem]" />
          {/* Animated ember fill on top of the rail */}
          <motion.div
            style={{ scaleY: railScale, transformOrigin: "top" }}
            className="absolute left-[6.5rem] top-2 bottom-0 w-px md:left-[12.5rem]"
          >
            <div
              className="h-full w-full"
              style={{
                background:
                  "linear-gradient(180deg, var(--ember), oklch(0.8 0.16 95), var(--aurora))",
              }}
            />
          </motion.div>

          {MILESTONES.map((m, i) => (
            <TimelineRow key={m.id} m={m} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
