"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import {
  Award,
  BookOpen,
  Flag,
  GraduationCap,
  type LucideIcon,
} from "lucide-react";
import { MILESTONES, type Milestone } from "@/lib/portfolio-data";
import { EASE, DURATION } from "@/lib/motion-tokens";

const KIND_ICON: Record<Milestone["kind"], LucideIcon> = {
  education: GraduationCap,
  certification: Award,
  activity: Flag,
  project: BookOpen,
};

function MilestoneCard({ m, index }: { m: Milestone; index: number }) {
  const isLeft = index % 2 === 0;
  const Icon = KIND_ICON[m.kind];
  const accent =
    m.accent === "ember"
      ? "oklch(0.74 0.2 45)"
      : "oklch(0.82 0.13 165)";
  const accentSoft =
    m.accent === "ember" ? "bg-ember-soft" : "bg-aurora-soft";

  return (
    <div
      className={`relative flex w-full flex-col gap-4 md:w-1/2 ${
        isLeft ? "md:pr-12" : "md:ml-auto md:pl-12"
      }`}
    >
      {/* Node dot on the rail */}
      <div
        className={`absolute top-2 hidden h-4 w-4 -translate-x-1/2 rounded-full border-2 border-obsidian md:block ${
          isLeft
            ? "right-0 translate-x-1/2"
            : "left-0 -translate-x-1/2"
        }`}
        style={{ backgroundColor: accent }}
        aria-hidden
      />

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-12% 0px" }}
        transition={{ duration: DURATION.slow, ease: EASE.signal }}
        whileHover={{ y: -4 }}
        className="group relative overflow-hidden rounded-2xl border border-border bg-surface/50 p-6 backdrop-blur transition-colors hover:border-foreground/20"
      >
        <div
          className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
          style={{ backgroundColor: accent }}
        />
        <div className="relative flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`grid h-9 w-9 place-items-center rounded-xl ${accentSoft}`}
            >
              <Icon className="h-4 w-4" style={{ color: accent }} />
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                {m.era} · {m.period}
              </div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/70">
                {m.kind}
              </div>
            </div>
          </div>
          {m.metric && (
            <span
              className="rounded-full border px-2.5 py-1 font-mono text-[11px] font-medium"
              style={{
                borderColor: `${accent}40`,
                color: accent,
                backgroundColor: `${accent.slice(0, -2)}0d)`,
              }}
            >
              {m.metric}
            </span>
          )}
        </div>

        <h3 className="relative mt-4 font-display text-lg font-medium leading-snug text-foreground">
          {m.title}
        </h3>
        <div className="relative mt-1 text-sm text-muted-foreground">
          {m.org}
        </div>
        <p className="relative mt-3 text-sm leading-relaxed text-foreground/70">
          {m.detail}
        </p>
      </motion.div>
    </div>
  );
}

export function TrajectorySection() {
  const ref = useRef<HTMLElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 70%", "end 80%"],
  });
  const railScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section
      ref={ref}
      id="trajectory"
      className="relative overflow-hidden py-28 md:py-36"
    >
      <div className="mx-auto w-full max-w-7xl px-6 md:px-10">
        <div className="mb-16 max-w-2xl">
          <div className="font-mono text-xs tracking-widest text-ember">
            03 / TRAJECTORY
          </div>
          <h2 className="mt-3 font-display text-fluid-xl font-medium tracking-tightest text-foreground">
            The timeline so far
          </h2>
          <p className="mt-3 text-muted-foreground">
            Education, credentials, and the arenas where I learned to
            ship under pressure — woven into a single descent.
          </p>
        </div>

        <div className="relative">
          {/* Center rail */}
          <div className="absolute left-4 top-0 h-full w-px bg-hairline md:left-1/2 md:-translate-x-1/2">
            <motion.div
              ref={railRef}
              style={{ scaleY: railScale, transformOrigin: "top" }}
              className="absolute inset-0"
            >
              <div
                className="h-full w-full"
                style={{
                  background:
                    "linear-gradient(180deg, oklch(0.74 0.2 45), oklch(0.82 0.13 165))",
                }}
              />
            </motion.div>
          </div>

          {/* Mobile rail dot */}
          <div className="absolute left-4 top-2 h-3 w-3 -translate-x-1/2 rounded-full bg-ember md:hidden" />

          <div className="space-y-8 md:space-y-12">
            {MILESTONES.map((m, i) => (
              <div key={m.id} className="relative pl-12 md:pl-0">
                <MilestoneCard m={m} index={i} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
