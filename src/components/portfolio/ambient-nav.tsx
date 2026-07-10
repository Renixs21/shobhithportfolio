"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Command, Terminal } from "lucide-react";
import { NAV_LINKS, PROFILE } from "@/lib/portfolio-data";
import { useScrollSpy } from "@/hooks/use-scroll-spy";
import { useEffect, useState } from "react";
import { EASE, DURATION } from "@/lib/motion-tokens";

interface AmbientNavProps {
  onOpenCommand: () => void;
}

export function AmbientNav({ onOpenCommand }: AmbientNavProps) {
  const ids = NAV_LINKS.map((l) => l.id);
  const { active } = useScrollSpy(ids);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setShow(window.scrollY > window.innerHeight * 0.6);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.nav
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: DURATION.normal, ease: EASE.signal }}
          className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2"
          aria-label="Section navigation"
        >
          <div className="glass-strong flex items-center gap-1 rounded-full p-1.5 shadow-2xl">
            {/* Monogram */}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              data-cursor
              data-cursor-label="top"
              className="grid h-9 w-9 place-items-center rounded-full font-mono text-xs font-bold text-ember transition-colors hover:bg-ember-soft"
              aria-label="Back to top"
            >
              SB
            </button>

            <div className="mx-1 h-5 w-px bg-hairline" />

            {/* Section links — hidden on small screens */}
            <div className="hidden items-center gap-0.5 md:flex">
              {NAV_LINKS.map((l) => {
                const isActive = active === l.id;
                return (
                  <button
                    key={l.id}
                    onClick={() => scrollTo(l.id)}
                    data-cursor
                    data-cursor-label={l.hint}
                    className="relative rounded-full px-3.5 py-2 text-xs font-medium transition-colors"
                    style={{
                      color: isActive
                        ? "var(--foreground)"
                        : "var(--muted-foreground)",
                    }}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-0 rounded-full bg-ember-soft"
                        transition={{ duration: 0.4, ease: EASE.signal }}
                      />
                    )}
                    <span className="relative z-10">{l.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Mobile: active section only */}
            <div className="flex items-center md:hidden">
              <span className="rounded-full bg-ember-soft px-3.5 py-2 text-xs font-medium text-foreground">
                {NAV_LINKS.find((l) => l.id === active)?.label ?? "Menu"}
              </span>
            </div>

            <div className="mx-1 h-5 w-px bg-hairline" />

            {/* Command palette trigger */}
            <button
              onClick={onOpenCommand}
              data-cursor
              data-cursor-label="⌘K"
              className="flex items-center gap-1.5 rounded-full px-3 py-2 text-xs text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
              aria-label="Open command palette"
            >
              <Command className="h-3.5 w-3.5" />
              <span className="hidden font-mono text-[10px] uppercase tracking-widest sm:inline">
                ⌘K
              </span>
            </button>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
