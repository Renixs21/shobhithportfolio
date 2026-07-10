"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { RevealText } from "./reveal-text";
import { PROFILE } from "@/lib/portfolio-data";
import { EASE, DURATION } from "@/lib/motion-tokens";

interface Chapter {
  num: string;
  title: string;
  body: string;
  /** which side the giant number sits on */
  numSide: "left" | "right";
}

const CHAPTERS: Chapter[] = [
  {
    num: "01",
    title: "Systems that think.",
    body: "I don't just build interfaces — I build layered systems where the model, the API, and the pixel all belong to the same idea. AI is not a feature. It is the material.",
    numSide: "left",
  },
  {
    num: "02",
    title: "Motion is meaning.",
    body: "Every transition is a sentence. Every easing curve carries intent. Interfaces should feel like they're breathing — not busy, not still, but alive with rhythm.",
    numSide: "right",
  },
  {
    num: "03",
    title: "Ship, then refine.",
    body: "I ship end-to-end — from React 18 + TypeScript on the front to Django, DRF, Flask, and LLM pipelines on the back. Ownership over polish. Then polish over polish.",
    numSide: "left",
  },
  {
    num: "04",
    title: "The craft is the moat.",
    body: "Anyone can wire an API. Fewer can make it feel inevitable. Craft — in typography, timing, tension — is the last differentiator worth pursuing.",
    numSide: "right",
  },
];

function ChapterBlock({ chapter, index }: { chapter: Chapter; index: number }) {
  const numLeft = chapter.numSide === "left";
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12% 0px" }}
      transition={{ duration: DURATION.slow, ease: EASE.signal, delay: index * 0.05 }}
      className="relative grid grid-cols-1 items-center gap-8 border-t border-hairline py-16 md:grid-cols-2 md:gap-12 md:py-24"
    >
      {/* Giant ember number — alternating sides */}
      <div
        className={`relative ${numLeft ? "md:order-1" : "md:order-2"} flex items-center`}
      >
        <span
          className="font-italic-accent select-none leading-[0.8] text-ember"
          style={{ fontSize: "clamp(7rem, 18vw, 16rem)" }}
          aria-hidden
        >
          {chapter.num}
        </span>
      </div>

      {/* Text */}
      <div className={`${numLeft ? "md:order-2" : "md:order-1"}`}>
        <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-ember" />
          Chapter · {chapter.num}
        </div>
        <h3 className="mt-4 font-display text-fluid-xl font-medium leading-[1.05] tracking-tightest text-foreground">
          {chapter.title}
        </h3>
        <p className="mt-5 max-w-md text-fluid-base leading-relaxed text-muted-foreground">
          {chapter.body}
        </p>
      </div>
    </motion.div>
  );
}

export function ManifestoSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const yGlow = useTransform(scrollYProgress, [0, 1], [80, -80]);

  // The resume summary split into the reference's subheading.
  const subheading =
    "Full-stack, multi-stack engineering student with a strong AI/ML foundation. I move fluidly between Python backends, modern JS frontends, and CMS platforms — shipping end-to-end products, from wireframe to deploy.";

  return (
    <section
      ref={ref}
      id="manifesto"
      className="scope-dark relative overflow-hidden bg-obsidian py-28 md:py-40"
    >
      {/* Subtle ember glow that drifts with scroll */}
      <motion.div
        style={{ y: yGlow }}
        className="pointer-events-none absolute -left-40 top-1/4 h-[36rem] w-[36rem] rounded-full bg-ember-soft opacity-40 blur-[140px]"
        aria-hidden
      />

      <div className="relative mx-auto w-full max-w-6xl px-6 md:px-10">
        {/* Intro — CORE BELIEFS + headline + subheading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-12% 0px" }}
          transition={{ duration: DURATION.slow, ease: EASE.signal }}
          className="max-w-3xl"
        >
          <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-ember" />
            Core beliefs
          </div>
          <h2 className="mt-5 font-display text-fluid-2xl font-medium leading-[1.02] tracking-tightest text-foreground">
            Four principles I bring to{" "}
            <span className="font-italic-accent text-ember">every</span>{" "}
            system I build.
          </h2>
          <p className="mt-6 max-w-xl text-fluid-base leading-relaxed text-muted-foreground">
            {subheading}
          </p>
        </motion.div>

        {/* Chapters */}
        <div className="mt-8">
          {CHAPTERS.map((c, i) => (
            <ChapterBlock key={c.num} chapter={c} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
