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

  // Until mounted, the theme is unknown — render a neutral placeholder
  // so server and first client render match (avoids hydration mismatch).
  const current = theme === "system" ? resolvedTheme : theme;
  const isDark = current === "dark";

  const toggle = () => {
    if (!mounted) return;
    setTheme(isDark ? "light" : "dark");
  };

  // Stable labels until mounted; switch to theme-aware after mount.
  const ariaLabel = mounted
    ? isDark
      ? "Switch to light mode"
      : "Switch to dark mode"
    : "Toggle theme";
  const cursorLabel = mounted ? (isDark ? "light" : "dark") : "theme";

  return (
    <button
      onClick={toggle}
      aria-label={ariaLabel}
      data-cursor
      data-cursor-label={cursorLabel}
      className={`relative grid h-9 w-9 place-items-center overflow-hidden rounded-full text-foreground transition-colors hover:bg-foreground/5 hover:text-ember ${className}`}
    >
      {!mounted ? (
        // Neutral placeholder (invisible) until the theme resolves —
        // identical on server and client to prevent hydration mismatch.
        <Sun className="h-[18px] w-[18px] opacity-0" aria-hidden />
      ) : (
        <AnimatePresence mode="wait" initial={false}>
          {isDark ? (
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
      )}
    </button>
  );
}
