"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { NAV_LINKS } from "@/lib/portfolio-data";
import { useScrollSpy } from "@/hooks/use-scroll-spy";
import { ThemeToggle } from "./theme-toggle";
import { EASE, DURATION } from "@/lib/motion-tokens";

/**
 * Short labels shown in the top bar (matching the reference image's
 * WORK / ABOUT / SKILLS / PATH / CONTACT vocabulary).
 */
const NAV_SHORT: Record<string, string> = {
  overture: "WORK",
  manifesto: "ABOUT",
  constellation: "SKILLS",
  trajectory: "PATH",
  builds: "BUILD",
  transmit: "CONTACT",
};

const NAV_ORDER = [
  "manifesto",
  "constellation",
  "trajectory",
  "builds",
  "transmit",
] as const;

interface TopNavProps {
  onOpenCommand: () => void;
}

/**
 * Glassmorphic top navigation — a frosted floating pill that condenses
 * on scroll. Logo on the left (with an ember dot accent, echoing the
 * reference), centered section links, and a theme toggle on the right.
 */
export function TopNav({ onOpenCommand }: TopNavProps) {
  const ids = NAV_LINKS.map((l) => l.id);
  const { active } = useScrollSpy(ids);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMobileOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: DURATION.normal, ease: EASE.signal, delay: 0.1 }}
        className="fixed inset-x-0 top-0 z-[80] flex justify-center px-3 pt-3 md:px-6 md:pt-4"
      >
        <nav
          aria-label="Primary"
          className={`glass-nav flex w-full max-w-5xl items-center justify-between gap-3 rounded-full py-2 pl-4 pr-2 transition-all duration-500 ${
            scrolled ? "md:py-1.5" : "md:py-2"
          }`}
        >
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            data-cursor
            data-cursor-label="top"
            className="group flex shrink-0 items-center gap-1 font-display text-base font-semibold tracking-tight text-foreground"
            aria-label="Back to top"
          >
            <span className="relative">
              Shobhith
              <span className="absolute -right-2 top-1 h-1.5 w-1.5 rounded-full bg-ember transition-transform duration-300 group-hover:scale-150" />
            </span>
          </button>

          {/* Centered links — desktop */}
          <div className="hidden items-center gap-0.5 md:flex">
            {NAV_ORDER.map((id) => {
              const isActive = active === id;
              return (
                <button
                  key={id}
                  onClick={() => scrollTo(id)}
                  data-cursor
                  data-cursor-label={NAV_SHORT[id].toLowerCase()}
                  className="relative rounded-full px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] transition-colors"
                  style={{
                    color: isActive
                      ? "var(--foreground)"
                      : "var(--muted-foreground)",
                  }}
                >
                  {isActive && (
                    <motion.span
                      layoutId="topnav-active"
                      className="absolute inset-0 rounded-full bg-ember-soft"
                      transition={{
                        type: "spring",
                        stiffness: 320,
                        damping: 28,
                      }}
                    />
                  )}
                  <span className="relative z-10">{NAV_SHORT[id]}</span>
                </button>
              );
            })}
          </div>

          {/* Right cluster */}
          <div className="flex shrink-0 items-center gap-1.5">
            <button
              onClick={onOpenCommand}
              data-cursor
              data-cursor-label="⌘K"
              className="hidden h-9 items-center gap-1.5 rounded-full border border-border px-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground sm:flex"
              aria-label="Open command palette"
            >
              ⌘K
            </button>
            <ThemeToggle />
            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
              data-cursor
              className="grid h-9 w-9 place-items-center rounded-full border border-border text-foreground transition-colors hover:border-ember/50 hover:text-ember md:hidden"
            >
              {mobileOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile dropdown sheet */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DURATION.fast }}
            className="fixed inset-0 z-[75] md:hidden"
          >
            <div
              className="absolute inset-0 bg-foreground/30 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.nav
              initial={{ y: -16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -16, opacity: 0 }}
              transition={{ duration: DURATION.normal, ease: EASE.signal }}
              className="glass-nav absolute inset-x-3 top-20 rounded-3xl p-3"
              aria-label="Mobile"
            >
              {NAV_LINKS.filter((l) => l.id !== "overture").map((l, i) => (
                <button
                  key={l.id}
                  onClick={() => scrollTo(l.id)}
                  className="flex w-full items-center justify-between rounded-2xl px-4 py-3.5 text-left transition-colors hover:bg-ember-soft"
                >
                  <span className="font-display text-lg font-medium text-foreground">
                    {l.label}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </button>
              ))}
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
