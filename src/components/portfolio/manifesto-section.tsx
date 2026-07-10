"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { RevealText } from "./reveal-text";
import { PROFILE } from "@/lib/portfolio-data";
import { EASE, DURATION } from "@/lib/motion-tokens";

export function ManifestoSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const yBg = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const yQuote = useTransform(scrollYProgress, [0, 1], [80, -40]);
  const rotateGlow = useTransform(scrollYProgress, [0, 1], [0, 120]);

  const paragraphs = PROFILE.summary.split(". ").filter(Boolean);

  return (
    <section
      ref={ref}
      id="manifesto"
      className="relative overflow-hidden py-28 md:py-40"
    >
      {/* Parallax glow */}
      <motion.div
        style={{ y: yBg, rotate: rotateGlow }}
        className="pointer-events-none absolute -left-40 top-20 h-[40rem] w-[40rem] rounded-full opacity-40 blur-[120px]"
        aria-hidden
      >
        <div className="h-full w-full rounded-full bg-ember-soft" />
      </motion.div>
      <motion.div
        style={{ y: yBg }}
        className="pointer-events-none absolute -right-40 bottom-0 h-[34rem] w-[34rem] rounded-full opacity-40 blur-[120px]"
        aria-hidden
      >
        <div className="h-full w-full rounded-full bg-aurora-soft" />
      </motion.div>

      <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 gap-16 px-6 md:grid-cols-12 md:px-10">
        {/* Left rail — index + label */}
        <div className="md:col-span-3">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-15% 0px" }}
            transition={{ duration: DURATION.normal, ease: EASE.signal }}
            className="sticky top-32"
          >
            <div className="font-mono text-xs tracking-widest text-ember">
              01 / MANIFESTO
            </div>
            <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              who & why
            </div>
          </motion.div>
        </div>

        {/* Right — editorial content */}
        <div className="md:col-span-9">
          <motion.blockquote
            style={{ y: yQuote }}
            className="font-display text-fluid-2xl font-medium leading-[1.05] tracking-tightest text-foreground"
          >
            <RevealText as="span" className="block">
              Signal over noise.
            </RevealText>
            <RevealText
              as="span"
              delay={0.12}
              className="block font-italic-accent text-muted-foreground"
            >
              Always ship. Learn in public.
            </RevealText>
          </motion.blockquote>

          <div className="mt-14 grid grid-cols-1 gap-10 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-15% 0px" }}
              transition={{ duration: DURATION.slow, ease: EASE.signal }}
            >
              <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.3em] text-aurora">
                the short version
              </div>
              <p className="text-fluid-base leading-relaxed text-foreground/85">
                {paragraphs[0]}.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-15% 0px" }}
              transition={{
                duration: DURATION.slow,
                ease: EASE.signal,
                delay: 0.12,
              }}
            >
              <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.3em] text-ember">
                the longer version
              </div>
              <p className="text-fluid-base leading-relaxed text-muted-foreground">
                {paragraphs.slice(1).join(". ")}.
              </p>
            </motion.div>
          </div>

          {/* Philosophy pull-quote */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15% 0px" }}
            transition={{ duration: DURATION.slow, ease: EASE.signal }}
            className="mt-16 border-l-2 border-ember/60 pl-6"
          >
            <p className="font-italic-accent text-fluid-lg text-foreground/90">
              “{PROFILE.philosophy}”
            </p>
            <div className="mt-4 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              <span className="h-px w-8 bg-ember/60" />
              operating principle
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
