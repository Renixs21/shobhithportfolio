"use client";

import { motion, AnimatePresence, useMotionValue } from "framer-motion";
import { useState, type ReactNode } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Boxes,
  Github,
  LayoutGrid,
  Layers,
  type LucideIcon,
} from "lucide-react";
import { PROJECTS, type Project, type ProjectMode } from "@/lib/portfolio-data";
import { SpotlightCard } from "./spotlight-card";
import { Magnetic } from "./magnetic-button";
import { EASE, DURATION, SPRING } from "@/lib/motion-tokens";

type Mode = ProjectMode;

const MODES: { id: Mode; label: string; icon: LucideIcon; hint: string }[] = [
  { id: "immersive", label: "Immersive", icon: Layers, hint: "case study" },
  { id: "spatial", label: "Spatial", icon: Boxes, hint: "drag gallery" },
  { id: "grid", label: "Grid", icon: LayoutGrid, hint: "compact" },
];

function accentColor(accent: Project["accent"]) {
  // Use the theme tokens so colors adapt to light/dark mode.
  return accent === "ember" ? "var(--ember)" : "var(--aurora)";
}
function accentSoft(accent: Project["accent"]) {
  return accent === "ember" ? "bg-ember-soft" : "bg-aurora-soft";
}

function StatusBadge({ status }: { status: Project["status"] }) {
  const map = {
    shipped: { label: "Shipped", color: "var(--aurora)" },
    exploration: { label: "Exploration", color: "oklch(0.78 0.16 90)" },
    collaboration: { label: "Collaboration", color: "var(--ember)" },
  } as const;
  const s = map[status];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest"
      style={{
        borderColor: `color-mix(in oklch, ${s.color} 30%, transparent)`,
        color: s.color,
      }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: s.color }}
      />
      {s.label}
    </span>
  );
}

function MetricRow({ project }: { project: Project }) {
  const c = accentColor(project.accent);
  return (
    <div className="grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-border">
      {project.metrics.map((m) => (
        <div key={m.label} className="bg-surface/60 px-4 py-3 text-center">
          <div
            className="font-display text-xl font-semibold"
            style={{ color: c }}
          >
            {m.value}
          </div>
          <div className="mt-1 font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
            {m.label}
          </div>
        </div>
      ))}
    </div>
  );
}

function DetailBlock({
  label,
  children,
  accent,
}: {
  label: string;
  children: ReactNode;
  accent: Project["accent"];
}) {
  const c = accentColor(accent);
  return (
    <div>
      <div
        className="mb-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em]"
        style={{ color: c }}
      >
        <span className="h-1 w-1 rounded-full" style={{ backgroundColor: c }} />
        {label}
      </div>
      <p className="text-sm leading-relaxed text-foreground/75">{children}</p>
    </div>
  );
}

/* ---------- Mode 1: Immersive case study ---------- */
function ImmersiveMode() {
  const [index, setIndex] = useState(0);
  const project = PROJECTS[index];
  const c = accentColor(project.accent);

  const go = (dir: number) => {
    setIndex((i) => (i + dir + PROJECTS.length) % PROJECTS.length);
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {PROJECTS.map((p, i) => (
            <button
              key={p.id}
              onClick={() => setIndex(i)}
              className="group relative h-1.5 overflow-hidden rounded-full bg-hairline transition-all"
              style={{ width: i === index ? 40 : 16 }}
              aria-label={`Go to ${p.name}`}
            >
              {i === index && (
                <motion.div
                  layoutId="immersive-bar"
                  className="absolute inset-0"
                  style={{ backgroundColor: c }}
                />
              )}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <Magnetic
            as="button"
            strength={0.5}
            onClick={() => go(-1)}
            cursorLabel="prev"
            className="grid h-10 w-10 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
            aria-label="Previous project"
          >
            <ArrowLeft className="h-4 w-4" />
          </Magnetic>
          <Magnetic
            as="button"
            strength={0.5}
            onClick={() => go(1)}
            cursorLabel="next"
            className="grid h-10 w-10 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
            aria-label="Next project"
          >
            <ArrowRight className="h-4 w-4" />
          </Magnetic>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.article
          key={project.id}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: DURATION.normal, ease: EASE.signal }}
          className="relative overflow-hidden rounded-3xl border border-border bg-surface/40"
        >
          {/* Hero band */}
          <div className="relative overflow-hidden border-b border-border px-8 py-10 md:px-12 md:py-14">
            <div
              className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full opacity-30 blur-[100px]"
              style={{ backgroundColor: c }}
              aria-hidden
            />
            <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <span
                    className="font-mono text-5xl font-bold leading-none"
                    style={{ color: c }}
                  >
                    {project.index}
                  </span>
                  <StatusBadge status={project.status} />
                </div>
                <h3 className="mt-4 font-display text-fluid-xl font-medium tracking-tightest text-foreground">
                  {project.name}
                </h3>
                <p className="mt-2 max-w-xl text-muted-foreground">
                  {project.tagline}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {project.stack.map((s) => (
                  <span
                    key={s}
                    className="rounded-full border border-border bg-surface/60 px-3 py-1 font-mono text-[11px] text-foreground/80"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Detail grid */}
          <div className="grid grid-cols-1 gap-8 px-8 py-10 md:grid-cols-2 md:px-12">
            <DetailBlock label="Problem" accent={project.accent}>
              {project.problem}
            </DetailBlock>
            <DetailBlock label="Process" accent={project.accent}>
              {project.process}
            </DetailBlock>
            <DetailBlock label="Architecture" accent={project.accent}>
              {project.architecture}
            </DetailBlock>
            <DetailBlock label="Challenges" accent={project.accent}>
              {project.challenges}
            </DetailBlock>
            <DetailBlock label="Impact" accent={project.accent}>
              {project.impact}
            </DetailBlock>
            <DetailBlock label="Lessons" accent={project.accent}>
              {project.lessons}
            </DetailBlock>
          </div>

          {/* Footer */}
          <div className="flex flex-col gap-6 border-t border-border px-8 py-8 md:flex-row md:items-center md:justify-between md:px-12">
            <div className="max-w-sm">
              <MetricRow project={project} />
            </div>
            <div className="flex items-center gap-4">
              <Magnetic
                as="a"
                href={project.github}
                target="_blank"
                rel="noreferrer"
                strength={0.3}
                cursorLabel="repo"
                className="group inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-medium text-foreground transition-colors hover:border-ember/60 hover:text-ember"
              >
                <Github className="h-4 w-4" />
                GitHub
              </Magnetic>
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                <span>{project.year}</span>
                <span className="text-ember">/</span>
                <span>case study · {index + 1} of {PROJECTS.length}</span>
              </div>
            </div>
          </div>
        </motion.article>
      </AnimatePresence>
    </div>
  );
}

/* ---------- Mode 2: Spatial draggable gallery ---------- */
function SpatialMode() {
  const [active, setActive] = useState(0);
  const x = useMotionValue(0);

  const project = PROJECTS[active];
  const c = accentColor(project.accent);

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            drag · click to focus
          </div>
        </div>
        <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          {active + 1} / {PROJECTS.length}
        </div>
      </div>

      <div
        className="relative overflow-hidden rounded-3xl border border-border bg-surface/30"
        style={{ perspective: "1400px" }}
      >
        <div className="relative flex min-h-[26rem] items-center justify-center gap-6 px-8 py-12">
          {PROJECTS.map((p, i) => {
            const offset = i - active;
            const isActive = i === active;
            const abs = Math.abs(offset);
            const pc = accentColor(p.accent);
            return (
              <motion.button
                key={p.id}
                onClick={() => setActive(i)}
                animate={{
                  x: offset * 180,
                  rotateY: offset * -22,
                  scale: isActive ? 1 : 0.78,
                  opacity: abs > 2 ? 0 : 1 - abs * 0.28,
                  zIndex: isActive ? 20 : 10 - abs,
                  filter: isActive
                    ? "blur(0px)"
                    : `blur(${abs * 1.5}px)`,
                }}
                transition={SPRING.gentle}
                className="absolute h-[24rem] w-72 shrink-0 overflow-hidden rounded-2xl border bg-surface/70 text-left"
                style={{
                  borderColor: isActive ? pc : "var(--hairline)",
                  transformStyle: "preserve-3d",
                  boxShadow: isActive
                    ? `0 30px 80px -20px color-mix(in oklch, ${pc} 22%, transparent)`
                    : "0 10px 30px -10px color-mix(in oklch, var(--foreground) 18%, transparent)",
                }}
                aria-label={`Focus ${p.name}`}
              >
                <div
                  className="relative h-40 overflow-hidden border-b border-border"
                  style={{
                    background: `radial-gradient(120% 80% at 30% 20%, color-mix(in oklch, ${pc} 22%, transparent), transparent), linear-gradient(135deg, var(--surface), var(--surface-2))`,
                  }}
                >
                  <div className="absolute inset-0 grid-lines opacity-30" />
                  <span
                    className="absolute left-4 top-4 font-mono text-3xl font-bold"
                    style={{ color: pc }}
                  >
                    {p.index}
                  </span>
                  <div className="absolute bottom-3 right-3">
                    <StatusBadge status={p.status} />
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-display text-base font-medium leading-snug text-foreground">
                    {p.name}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    {p.tagline}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {p.stack.slice(0, 3).map((s) => (
                      <span
                        key={s}
                        className="rounded-full border border-border px-2 py-0.5 font-mono text-[9px] text-foreground/70"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Active detail */}
      <motion.div
        key={project.id}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATION.normal, ease: EASE.signal }}
        className="mt-6 rounded-2xl border border-border bg-surface/40 p-6"
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <DetailBlock label="Problem" accent={project.accent}>
            {project.problem}
          </DetailBlock>
          <DetailBlock label="Architecture" accent={project.accent}>
            {project.architecture}
          </DetailBlock>
          <DetailBlock label="Impact" accent={project.accent}>
            {project.impact}
          </DetailBlock>
        </div>
        <div className="mt-6 flex justify-end">
          <Magnetic
            as="a"
            href={project.github}
            target="_blank"
            rel="noreferrer"
            strength={0.3}
            cursorLabel="repo"
            className="group inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-medium text-foreground transition-colors hover:border-ember/60 hover:text-ember"
          >
            <Github className="h-4 w-4" />
            GitHub
          </Magnetic>
        </div>
      </motion.div>
    </div>
  );
}

/* ---------- Mode 3: Compact grid ---------- */
function GridMode() {
  const [expanded, setExpanded] = useState<string | null>(PROJECTS[0].id);
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {PROJECTS.map((p) => {
        const isOpen = expanded === p.id;
        const c = accentColor(p.accent);
        return (
          <SpotlightCard
            key={p.id}
            className="rounded-2xl border border-border bg-surface/40"
            color={`color-mix(in oklch, ${c} 16%, transparent)`}
          >
            <button
              onClick={() => setExpanded(isOpen ? null : p.id)}
              className="relative z-10 w-full p-6 text-left"
              data-cursor
              data-cursor-label={isOpen ? "collapse" : "expand"}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span
                    className="font-mono text-3xl font-bold"
                    style={{ color: c }}
                  >
                    {p.index}
                  </span>
                  <div>
                    <h3 className="font-display text-base font-medium text-foreground">
                      {p.name}
                    </h3>
                    <div className="mt-0.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      {p.year} · {p.stack[0]}
                    </div>
                  </div>
                </div>
                <ArrowUpRight
                  className="h-4 w-4 text-muted-foreground transition-transform duration-300"
                  style={{ transform: isOpen ? "rotate(45deg)" : "none" }}
                />
              </div>

              <p className="mt-3 text-sm text-muted-foreground">{p.tagline}</p>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {p.stack.map((s) => (
                  <span
                    key={s}
                    className="rounded-full border border-border px-2 py-0.5 font-mono text-[9px] text-foreground/70"
                  >
                    {s}
                  </span>
                ))}
              </div>

              <motion.div
                initial={false}
                animate={{
                  height: isOpen ? "auto" : 0,
                  opacity: isOpen ? 1 : 0,
                }}
                transition={{ duration: DURATION.normal, ease: EASE.signal }}
                className="overflow-hidden"
              >
                <div className="mt-5 space-y-4 border-t border-border pt-5">
                  <DetailBlock label="Problem" accent={p.accent}>
                    {p.problem}
                  </DetailBlock>
                  <DetailBlock label="Impact" accent={p.accent}>
                    {p.impact}
                  </DetailBlock>
                  <DetailBlock label="Lessons" accent={p.accent}>
                    {p.lessons}
                  </DetailBlock>
                  <div className="pt-2">
                    <MetricRow project={p} />
                  </div>
                  <div className="pt-4">
                    <a
                      href={p.github}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      data-cursor
                      data-cursor-label="repo"
                      className="group inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-medium text-foreground transition-colors hover:border-ember/60 hover:text-ember"
                    >
                      <Github className="h-4 w-4" />
                      GitHub
                    </a>
                  </div>
                </div>
              </motion.div>
            </button>
          </SpotlightCard>
        );
      })}
    </div>
  );
}

export function BuildsSection() {
  const [mode, setMode] = useState<Mode>("immersive");

  return (
    <section id="builds" className="relative overflow-hidden py-28 md:py-36">
      <div className="mx-auto w-full max-w-7xl px-6 md:px-10">
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <div className="font-mono text-xs tracking-widest text-aurora">
              04 / BUILDS
            </div>
            <h2 className="mt-3 font-display text-fluid-xl font-medium tracking-tightest text-foreground">
              Selected work
            </h2>
            <p className="mt-3 text-muted-foreground">
              Three ways to read the same body of work. Switch lenses —
              the projects stay the same, the perspective shifts.
            </p>
          </div>

          {/* Mode toggle */}
          <div className="flex items-center gap-1 rounded-full border border-border bg-surface/50 p-1 backdrop-blur">
            {MODES.map((m) => {
              const Icon = m.icon;
              const isActive = mode === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className="relative rounded-full px-4 py-2 text-xs font-medium transition-colors"
                  data-cursor
                  data-cursor-label={m.hint}
                  style={{ color: isActive ? "var(--obsidian)" : "var(--muted-foreground)" }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="mode-pill"
                      className="absolute inset-0 rounded-full bg-foreground"
                      transition={SPRING.snappy}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    <Icon className="h-3.5 w-3.5" />
                    {m.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: DURATION.normal, ease: EASE.signal }}
          >
            {mode === "immersive" && <ImmersiveMode />}
            {mode === "spatial" && <SpatialMode />}
            {mode === "grid" && <GridMode />}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
