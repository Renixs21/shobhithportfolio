"use client";

import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { PROFILE } from "@/lib/portfolio-data";
import { EASE, DURATION } from "@/lib/motion-tokens";

const TECH_STACK = [
  "FRAUNCES",
  "INSTRUMENT SERIF",
  "GEIST",
  "REACT",
  "NEXT.JS",
  "FRAMER MOTION",
  "TAILWIND",
];

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="scope-dark relative overflow-hidden bg-obsidian pt-24 md:pt-32">
      {/* Tiny ember dot, top-left accent (like the reference) */}
      <span
        className="absolute left-6 top-6 h-1.5 w-1.5 rounded-full bg-ember md:left-10"
        aria-hidden
      />

      <div className="relative mx-auto w-full max-w-7xl px-6 md:px-10">
        {/* Main grid — End. headline + ELSEWHERE + SAY HELLO */}
        <div className="grid grid-cols-1 gap-16 pb-20 md:grid-cols-12 md:gap-10">
          {/* Left — massive "End." with ember dot */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: DURATION.hero, ease: EASE.signal }}
            className="md:col-span-6"
          >
            <h2 className="font-display text-[clamp(5rem,22vw,16rem)] font-medium leading-[0.85] tracking-tightest text-foreground">
              End
              <span className="inline-block h-[0.18em] w-[0.18em] translate-y-[0.04em] rounded-full bg-ember align-baseline" />
            </h2>
          </motion.div>

          {/* Center — ELSEWHERE links */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{
              duration: DURATION.slow,
              ease: EASE.signal,
              delay: 0.12,
            }}
            className="md:col-span-3 md:pt-4"
          >
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              ELSEWHERE
            </div>
            <ul className="mt-5 space-y-3">
              <li>
                <a
                  href={PROFILE.github}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor
                  data-cursor-label="github"
                  className="group inline-flex items-baseline gap-1 text-fluid-base text-foreground transition-colors hover:text-ember"
                >
                  GitHub
                  <span className="text-muted-foreground transition-colors group-hover:text-ember">
                    /
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={PROFILE.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor
                  data-cursor-label="linkedin"
                  className="group inline-flex items-baseline gap-1 text-fluid-base text-foreground transition-colors hover:text-ember"
                >
                  LinkedIn
                  <span className="text-muted-foreground transition-colors group-hover:text-ember">
                    /
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="/shobhith-bj-resume.pdf"
                  download="shobhith-bj-resume.pdf"
                  data-cursor
                  data-cursor-label="download"
                  className="group inline-flex items-center gap-1.5 text-fluid-base text-foreground transition-colors hover:text-ember"
                >
                  Resume (PDF)
                  <ArrowDown className="h-4 w-4 text-ember transition-transform duration-300 group-hover:translate-y-0.5" />
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Right — SAY HELLO contact */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{
              duration: DURATION.slow,
              ease: EASE.signal,
              delay: 0.2,
            }}
            className="md:col-span-3 md:pt-4"
          >
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              SAY HELLO
            </div>
            <ul className="mt-5 space-y-3 text-fluid-base text-foreground">
              <li>
                <a
                  href={`mailto:${PROFILE.email}`}
                  data-cursor
                  data-cursor-label="email"
                  className="transition-colors hover:text-ember"
                >
                  {PROFILE.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${PROFILE.phone.replace(/\s/g, "")}`}
                  data-cursor
                  data-cursor-label="call"
                  className="transition-colors hover:text-ember"
                >
                  {PROFILE.phone}
                </a>
              </li>
              <li className="text-muted-foreground">{PROFILE.location}</li>
            </ul>
          </motion.div>
        </div>

        {/* Hairline divider */}
        <div className="h-px w-full bg-hairline" />

        {/* Bottom row — copyright + tech stack */}
        <div className="flex flex-col items-start justify-between gap-3 py-8 md:flex-row md:items-center">
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            © {year} {PROFILE.name} — HANDCRAFTED IN BANGALORE.
          </div>
          <div className="flex flex-wrap gap-x-2 gap-y-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/70">
            {TECH_STACK.map((t, i) => (
              <span key={t} className="flex items-center gap-2">
                {t}
                {i < TECH_STACK.length - 1 && (
                  <span className="text-muted-foreground/40">·</span>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
