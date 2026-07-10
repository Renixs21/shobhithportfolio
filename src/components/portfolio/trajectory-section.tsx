"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { MILESTONES, type Milestone, PROFILE } from "@/lib/portfolio-data";
import { EASE, DURATION } from "@/lib/motion-tokens";

function TimelineRow({ m, index }: { m: Milestone; index: number }) {
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
      className="relative grid grid-cols-1 gap-1 py-6 md:grid-cols-[1fr_auto] md:gap-10"
    >
      {/* Content (left on desktop, full width on mobile) */}
      <div className="md:pr-6">
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

      {/* Year/date — RIGHT column on desktop */}
      <div className="mt-2 md:mt-1 md:text-right">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
          {m.period}
        </span>
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
        {/* Heading — name + email beside it, then the title */}
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
          <div className="mt-3 flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <h2 className="font-display text-fluid-2xl font-medium leading-[1] tracking-tightest text-foreground">
              A short,{" "}
              <span className="font-italic-accent text-ember">
                deliberate
              </span>{" "}
              trajectory.
            </h2>
          </div>
          {/* Email beside the name */}
          <a
            href={`mailto:${PROFILE.email}`}
            data-cursor
            data-cursor-label="email"
            className="mt-3 inline-block font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-ember"
          >
            {PROFILE.email}
          </a>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Static rail (hairline) — clean, no dots */}
          <div className="absolute bottom-0 left-0 top-2 hidden w-px bg-hairline md:block" />
          {/* Animated ember fill on top of the rail */}
          <motion.div
            style={{ scaleY: railScale, transformOrigin: "top" }}
            className="absolute left-0 top-2 bottom-0 hidden w-px md:block"
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
            <div key={m.id} className="relative md:pl-10">
              <TimelineRow m={m} index={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
