"use client";

const TECH_TERMS = [
  "Python",
  "React",
  "Next.js",
  "TypeScript",
  "Django",
  "Flask",
  "PyTorch",
  "NLP",
  "Generative AI",
  "Tailwind CSS",
  "REST APIs",
  "MySQL",
  "Scikit-learn",
  "Pandas",
  "NumPy",
  "Linux",
  "Git",
  "Deep Learning",
];

interface TechMarqueeProps {
  direction?: "left" | "right";
  speed?: number; // seconds per loop
  className?: string;
}

/**
 * An infinite marquee of technology terms — a kinetic divider that
 * reads as a transmission log. Pure CSS animation, no JS loop.
 */
export function TechMarquee({
  direction = "left",
  speed = 38,
  className = "",
}: TechMarqueeProps) {
  const items = [...TECH_TERMS, ...TECH_TERMS];
  return (
    <div
      className={`relative overflow-hidden border-y border-border py-5 ${className}`}
      aria-hidden="true"
    >
      <div
        className="flex w-max gap-10 whitespace-nowrap"
        style={{
          animation: `marquee-${direction} ${speed}s linear infinite`,
        }}
      >
        {items.map((t, i) => (
          <span
            key={i}
            className="flex items-center gap-10 font-display text-2xl font-medium tracking-tight text-muted-foreground/70 transition-colors hover:text-ember md:text-3xl"
          >
            {t}
            <span className="text-ember/70">✦</span>
          </span>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent" />

      <style>{`
        @keyframes marquee-left { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes marquee-right { from { transform: translateX(-50%); } to { transform: translateX(0); } }
      `}</style>
    </div>
  );
}
