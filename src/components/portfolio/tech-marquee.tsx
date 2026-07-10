"use client";

interface MarqueeItem {
  text: string;
  /** outline = stroked/hollow; fill = solid */
  style: "outline" | "fill";
}

const MARQUEE_ITEMS: MarqueeItem[] = [
  { text: "Engineering", style: "outline" },
  { text: "Intelligence", style: "fill" },
  { text: "Interaction", style: "outline" },
  { text: "Systems", style: "fill" },
  { text: "Machine Learning", style: "outline" },
  { text: "Interfaces", style: "fill" },
  { text: "Full-Stack", style: "outline" },
  { text: "Generative AI", style: "fill" },
];

interface TechMarqueeProps {
  direction?: "left" | "right";
  speed?: number; // seconds per loop
  className?: string;
}

/**
 * A premium kinetic divider — large serif terms scrolling infinitely,
 * alternating between hollow (stroked) and filled, separated by 4-point
 * star glyphs. Echoes the reference: editorial, confident, cinematic.
 * Pure CSS animation, GPU-friendly translateX.
 */
export function TechMarquee({
  direction = "left",
  speed = 42,
  className = "",
}: TechMarqueeProps) {
  // Duplicate the set so the loop is seamless.
  const loop = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  return (
    <div
      className={`relative overflow-hidden border-y border-border bg-obsidian py-7 md:py-10 ${className}`}
      aria-hidden="true"
    >
      <div
        className="signal-marquee-track flex w-max items-center whitespace-nowrap"
        style={{
          animation: `signal-marquee-${direction} ${speed}s linear infinite`,
        }}
      >
        {loop.map((item, i) => (
          <span key={i} className="flex items-center">
            <span
              className={
                item.style === "outline"
                  ? "font-display text-4xl font-medium tracking-tight text-transparent md:text-6xl lg:text-7xl"
                  : "font-display text-4xl font-medium tracking-tight md:text-6xl lg:text-7xl"
              }
              style={
                item.style === "outline"
                  ? {
                      WebkitTextStroke: "1.5px oklch(0.94 0.012 80)",
                      textStroke: "1.5px oklch(0.94 0.012 80)",
                    }
                  : { color: "oklch(0.94 0.012 80)" }
              }
            >
              {item.text}
            </span>
            {/* 4-point star separator — bright ember accent */}
            <svg
              viewBox="0 0 100 100"
              className="mx-8 h-5 w-5 shrink-0 md:mx-12 md:h-7 md:w-7 lg:mx-16 lg:h-9 lg:w-9"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M50 0 L61 39 L100 50 L61 61 L50 100 L39 61 L0 50 L39 39 Z"
                fill="oklch(0.74 0.2 45)"
              />
            </svg>
          </span>
        ))}
      </div>

      {/* Edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-obsidian to-transparent md:w-40" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-obsidian to-transparent md:w-40" />

      <style>{`
        @keyframes signal-marquee-left {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes signal-marquee-right {
          from { transform: translateX(-50%); }
          to { transform: translateX(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .signal-marquee-track { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
