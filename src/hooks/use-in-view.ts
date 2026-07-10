"use client";

import { useEffect, useRef, useState } from "react";

interface Options extends IntersectionObserverInit {
  once?: boolean;
}

/**
 * Thin wrapper around IntersectionObserver with sensible defaults.
 */
export function useInView<T extends Element = HTMLDivElement>(
  options: Options = {}
) {
  const { once = true, threshold = 0.2, rootMargin = "0px 0px -10% 0px" } =
    options;
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) obs.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold, rootMargin }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [once, threshold, rootMargin]);

  return { ref, inView };
}
