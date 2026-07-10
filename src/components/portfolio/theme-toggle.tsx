"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useIsClient } from "@/hooks/use-is-client";
import { EASE, DURATION } from "@/lib/motion-tokens";

interface ThemeToggleProps {
  className?: string;
}

/**
 * Sun/moon theme toggle. Uses next-themes; mounts gracefully (no
 * hydration flash) by waiting for the client flag. The icon cross-
 * fades + rotates on switch.
 */
export function ThemeToggle({ className = "" }: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const mounted = useIsClient();

  const current = theme === "system" ? resolvedTheme : theme;
  const isDark = current === "dark";

  const toggle = () => setTheme(isDark ? "light" : "dark");

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      data-cursor
      data-cursor-label={isDark ? "light" : "dark"}
      className={`relative grid h-9 w-9 place-items-center overflow-hidden rounded-full text-foreground transition-colors hover:bg-foreground/5 hover:text-ember ${className}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        {mounted && isDark ? (
          <motion.span
            key="moon"
            initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
            transition={{ duration: DURATION.fast, ease: EASE.signal }}
            className="absolute"
          >
            <Moon className="h-[18px] w-[18px]" />
          </motion.span>
        ) : (
          <motion.span
            key="sun"
            initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
            transition={{ duration: DURATION.fast, ease: EASE.signal }}
            className="absolute"
          >
            <Sun className="h-[18px] w-[18px]" />
          </motion.span>
        )}
      </AnimatePresence>
      {/* Placeholder until mounted to avoid layout shift */}
      {!mounted && <Sun className="h-[18px] w-[18px] opacity-0" />}
    </button>
  );
}
