"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { ArrowDown, Github, Linkedin, Mail, Sparkles } from "lucide-react";
import { useRef } from "react";
import { ParticleField } from "./particle-field";
import { Magnetic } from "./magnetic-button";
import { RevealText } from "./reveal-text";
import { PROFILE, HERO_STATS } from "@/lib/portfolio-data";
import { EASE, DURATION } from "@/lib/motion-tokens";

export function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-5% 0px" });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);

  return (
    <section
      ref={ref}
      id="overture"
      className="relative flex min-h-[100svh] flex-col overflow-hidden"
    >
      {/* Particle atmosphere */}
      <motion.div
        style={{ opacity, scale }}
        className="absolute inset-0"
      >
        <ParticleField className="absolute inset-0" />
      </motion.div>

      {/* Vignette + grid overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 40%, transparent 40%, oklch(0.1 0.008 75 / 0.6) 100%)",
        }}
      />
      <div className="grid-lines pointer-events-none absolute inset-0 opacity-[0.4]" />

      {/* Top status bar */}
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: DURATION.normal, ease: EASE.signal, delay: 0.2 }}
        className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-6 pt-8 md:px-10"
      >
        <div className="flex items-center gap-3">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-signal-pulse rounded-full bg-ember" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-ember" />
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
            {PROFILE.availability}
          </span>
        </div>
        <div className="hidden font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground md:block">
          {PROFILE.location}
        </div>
      </motion.header>

      {/* Main content */}
      <motion.div
        style={{ y, opacity }}
        className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-6 py-16 md:px-10"
      >
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: DURATION.normal, ease: EASE.signal, delay: 0.35 }}
          className="mb-6 flex items-center gap-3"
        >
          <Sparkles className="h-4 w-4 text-ember" />
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
            {PROFILE.role}
          </span>
        </motion.div>

        {/* The name — editorial, massive */}
        <h1 className="font-display tracking-tightest text-fluid-hero font-medium leading-[0.9]">
          <RevealText
            as="span"
            delay={0.5}
            className="block text-foreground"
          >
            {PROFILE.firstName}
          </RevealText>
          <RevealText
            as="span"
            delay={0.66}
            className="block text-signal-gradient"
          >
            {PROFILE.lastName}
          </RevealText>
        </h1>

        {/* Philosophy — word-by-word emergence */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: DURATION.slow, delay: 1.1 }}
          className="mt-8 max-w-2xl text-fluid-lg text-muted-foreground"
        >
          <RevealText
            as="span"
            word
            delay={1.1}
            className="text-foreground/90"
          >
            I build intelligent systems that feel magical.
          </RevealText>{" "}
          <motion.span
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: DURATION.slow, delay: 1.9 }}
            className="text-muted-foreground"
          >
            The kind that hide a hundred decisions behind a single, inevitable interaction.
          </motion.span>
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: DURATION.normal, ease: EASE.signal, delay: 2.1 }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <Magnetic
            as="a"
            href="#builds"
            cursorLabel="explore"
            strength={0.5}
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-ember px-7 py-3.5 text-sm font-medium text-obsidian"
          >
            <span className="relative z-10">View the builds</span>
            <ArrowDown className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:translate-y-1" />
            <span className="absolute inset-0 -translate-x-full bg-aurora transition-transform duration-500 group-hover:translate-x-0" />
            <span className="absolute inset-0 z-[5] flex items-center gap-2 px-7 text-obsidian opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              View the builds <ArrowDown className="h-4 w-4" />
            </span>
          </Magnetic>

          <Magnetic
            as="a"
            href="#transmit"
            cursorLabel="contact"
            strength={0.4}
            className="inline-flex items-center gap-2 rounded-full border border-border px-7 py-3.5 text-sm font-medium text-foreground transition-colors hover:border-ember/60 hover:text-ember"
          >
            Transmit a message
          </Magnetic>

          {/* Socials */}
          <div className="ml-2 flex items-center gap-1">
            {[
              { icon: Github, href: PROFILE.github, label: "GitHub" },
              { icon: Linkedin, href: PROFILE.linkedin, label: "LinkedIn" },
              { icon: Mail, href: `mailto:${PROFILE.email}`, label: "Email" },
            ].map(({ icon: Icon, href, label }) => (
              <Magnetic
                key={label}
                as="a"
                href={href}
                target="_blank"
                rel="noreferrer"
                cursorLabel={label}
                strength={0.6}
                className="grid h-11 w-11 place-items-center rounded-full text-muted-foreground transition-colors hover:text-ember"
                aria-label={label}
              >
                <Icon className="h-[18px] w-[18px]" />
              </Magnetic>
            ))}
          </div>
        </motion.div>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: DURATION.normal, ease: EASE.signal, delay: 2.4 }}
          className="mt-16 grid max-w-2xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border sm:grid-cols-4"
        >
          {HERO_STATS.map((s) => (
            <div
              key={s.label}
              className="glass px-5 py-4"
            >
              <div className="font-display text-2xl font-semibold text-foreground">
                {s.value}
              </div>
              <div className="mt-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {s.label}
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-6 pb-8 md:px-10"
      >
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          [ scroll to descend ]
        </div>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="flex h-9 w-5 items-start justify-center rounded-full border border-border p-1"
        >
          <span className="h-1.5 w-1 rounded-full bg-ember" />
        </motion.div>
      </motion.div>
    </section>
  );
}
