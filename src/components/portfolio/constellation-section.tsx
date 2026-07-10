"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { readColorVar } from "@/lib/color-utils";
import {
  SKILL_NODES,
  SKILL_EDGES,
  SKILL_GROUPS,
  type SkillNode,
} from "@/lib/portfolio-data";

interface SimNode extends SkillNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  tx: number; // target
  ty: number;
  r: number;
  glow: number;
}

// Map each skill group to a signal color token. Resolved live from the
// theme so the graph reads correctly in both dark and light modes.
const EMBER_FALLBACK = "255, 138, 76";
const AURORA_FALLBACK = "94, 224, 184";
const EMBER_GROUPS = new Set(["language", "backend", "data"]);
const groupColor = (group: string, ember: string, aurora: string) =>
  EMBER_GROUPS.has(group) ? ember : aurora;

/**
 * A living skill constellation. Nodes are clustered by group, drift on
 * a gentle physics simulation, and brighten under the cursor — which
 * also lights up their direct connections. No progress bars: the graph
 * IS the proficiency map.
 */
export function ConstellationSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [active, setActive] = useState<string | null>(null);
  const [activeLabel, setActiveLabel] = useState<string>("");
  const activeRef = useRef<string | null>(null);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let raf = 0;
    let t = 0;
    const start = performance.now();

    // Resolve signal colors from the active theme; re-read on theme change.
    let ember = readColorVar("--ember", EMBER_FALLBACK);
    let aurora = readColorVar("--aurora", AURORA_FALLBACK);
    const themeObserver = new MutationObserver(() => {
      ember = readColorVar("--ember", EMBER_FALLBACK);
      aurora = readColorVar("--aurora", AURORA_FALLBACK);
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    const mouse = { x: -9999, y: -9999, active: false };

    let nodes: SimNode[] = [];

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = wrap.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      layout();
    };

    const layout = () => {
      nodes = SKILL_NODES.map((n) => ({
        ...n,
        x: w / 2,
        y: h / 2,
        vx: 0,
        vy: 0,
        tx: w / 2,
        ty: h / 2,
        r: 4 + n.level * 1.1,
        glow: 0,
      }));

      // Position each group in a ring around the center.
      const cx = w / 2;
      const cy = h / 2;
      const isMobile = w < 700;
      const groupRingR = Math.min(w, h) * (isMobile ? 0.34 : 0.32);
      const innerRingR = Math.min(w, h) * (isMobile ? 0.16 : 0.14);

      SKILL_GROUPS.forEach((g, gi) => {
        const ga = (gi / SKILL_GROUPS.length) * Math.PI * 2 - Math.PI / 2;
        const gx = cx + Math.cos(ga) * groupRingR;
        const gy = cy + Math.sin(ga) * groupRingR;
        const members = nodes.filter((n) => n.group === g.id);
        members.forEach((m, i) => {
          const ma = (i / members.length) * Math.PI * 2;
          m.tx = gx + Math.cos(ma) * innerRingR;
          m.ty = gy + Math.sin(ma) * innerRingR;
        });
      });
    };

    const nodeById = (id: string) => nodes.find((n) => n.id === id);

    const draw = (now: number) => {
      t = (now - start) / 1000;
      ctx.clearRect(0, 0, w, h);

      const hoveredId = activeRef.current;
      const hovered = hoveredId ? nodeById(hoveredId) : null;
      // neighbors of hovered
      const neighborIds = new Set<string>();
      if (hovered) {
        for (const e of SKILL_EDGES) {
          if (e.from === hovered.id) neighborIds.add(e.to);
          if (e.to === hovered.id) neighborIds.add(e.from);
        }
      }

      // Update physics
      for (const p of nodes) {
        // spring to target with breathing
        const breath = reduced
          ? 0
          : Math.sin(t * 0.6 + (p.x + p.y) * 0.003) * 4;
        p.vx += (p.tx + breath - p.x) * 0.012;
        p.vy += (p.ty + breath - p.y) * 0.012;

        // cursor attraction (subtle) when not hovering a specific node
        if (mouse.active && !hovered) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 18000 && d2 > 1) {
            const d = Math.sqrt(d2);
            const f = (1 - d / 134) * 0.5;
            p.vx += (dx / d) * f;
            p.vy += (dy / d) * f;
          }
        }

        p.vx *= 0.9;
        p.vy *= 0.9;
        p.x += p.vx;
        p.y += p.vy;

        // glow target
        const isHovered = hovered === p;
        const isNeighbor = neighborIds.has(p.id);
        const targetGlow =
          !hovered || isHovered || isNeighbor ? 1 : 0.2;
        p.glow += (targetGlow - p.glow) * 0.12;
      }

      // Draw edges
      for (const e of SKILL_EDGES) {
        const a = nodeById(e.from);
        const b = nodeById(e.to);
        if (!a || !b) continue;
        const involved =
          hovered && (hovered.id === e.from || hovered.id === e.to);
        const baseAlpha = involved ? 0.6 : hovered ? 0.05 : 0.16;
        const col = involved
          ? ember
          : a.group === b.group
          ? groupColor(a.group, ember, aurora)
          : "160, 160, 160";
        ctx.strokeStyle = `rgba(${col}, ${baseAlpha})`;
        ctx.lineWidth = involved ? 1.4 : 0.7;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }

      // Draw group center labels
      ctx.font = "500 11px var(--font-geist-mono), monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      SKILL_GROUPS.forEach((g, gi) => {
        const ga = (gi / SKILL_GROUPS.length) * Math.PI * 2 - Math.PI / 2;
        const cx = w / 2;
        const cy = h / 2;
        const isMobile = w < 700;
        const groupRingR = Math.min(w, h) * (isMobile ? 0.34 : 0.32);
        const lx = cx + Math.cos(ga) * (groupRingR + 34);
        const ly = cy + Math.sin(ga) * (groupRingR + 34);
        const col = g.accent === "ember" ? ember : aurora;
        ctx.fillStyle = `rgba(${col}, 0.7)`;
        ctx.fillText(g.label.toUpperCase(), lx, ly);
      });

      // Draw nodes
      for (const p of nodes) {
        const col = groupColor(p.group, ember, aurora);
        const isHovered = hovered === p;
        const r = p.r * (isHovered ? 1.5 : 1) * (0.8 + p.glow * 0.4);

        // glow halo
        ctx.fillStyle = `rgba(${col}, ${0.1 * p.glow})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r * 4, 0, Math.PI * 2);
        ctx.fill();

        // ring
        ctx.strokeStyle = `rgba(${col}, ${0.4 * p.glow})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r * 1.8, 0, Math.PI * 2);
        ctx.stroke();

        // core
        ctx.fillStyle = `rgba(${col}, ${0.95 * p.glow})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fill();

        // label on hover
        if (isHovered) {
          ctx.font = "600 13px var(--font-geist-sans), sans-serif";
          ctx.fillStyle = "rgba(245, 241, 234, 0.95)";
          ctx.fillText(p.label, p.x, p.y - r - 12);
        }
      }

      raf = requestAnimationFrame(draw);
    };

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;

      // hit-test
      let hit: SimNode | null = null;
      for (const p of nodes) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        if (dx * dx + dy * dy < (p.r * 2.4) ** 2) {
          hit = p;
          break;
        }
      }
      if (hit) {
        if (activeRef.current !== hit.id) {
          activeRef.current = hit.id;
          setActive(hit.id);
          setActiveLabel(hit.label);
        }
        canvas.style.cursor = "pointer";
      } else {
        if (activeRef.current) {
          activeRef.current = null;
          setActive(null);
          setActiveLabel("");
        }
        canvas.style.cursor = "default";
      }
    };
    const onLeave = () => {
      mouse.active = false;
      mouse.x = -9999;
      mouse.y = -9999;
      if (activeRef.current) {
        activeRef.current = null;
        setActive(null);
        setActiveLabel("");
      }
    };

    resize();
    raf = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      themeObserver.disconnect();
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
    };
  }, [reduced]);

  return (
    <section
      id="constellation"
      className="relative overflow-hidden py-28 md:py-36"
    >
      <div className="mx-auto w-full max-w-7xl px-6 md:px-10">
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="font-mono text-xs tracking-widest text-aurora">
              02 / CONSTELLATION
            </div>
            <h2 className="mt-3 font-display text-fluid-xl font-medium tracking-tightest text-foreground">
              The skill graph
            </h2>
            <p className="mt-3 max-w-md text-muted-foreground">
              Not a list of bars — a living network. Hover any node to
              trace what it connects to. Every edge is a real pairing I
              reach for in production.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            {SKILL_GROUPS.map((g) => (
              <div
                key={g.id}
                className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground"
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{
                    backgroundColor:
                      g.accent === "ember" ? "var(--ember)" : "var(--aurora)",
                  }}
                />
                {g.label}
              </div>
            ))}
          </div>
        </div>

        <div
          ref={wrapRef}
          className="relative aspect-[16/10] w-full overflow-hidden rounded-3xl border border-border bg-surface/40 md:aspect-[16/9]"
        >
          <canvas
            ref={canvasRef}
            className="absolute inset-0 h-full w-full"
            aria-label="Interactive skill constellation graph"
            role="img"
          />
          {/* Hover readout */}
          <div className="pointer-events-none absolute left-4 top-4 flex items-center gap-2 rounded-full border border-border bg-surface/70 px-3 py-1.5 backdrop-blur">
            <span className="h-1.5 w-1.5 animate-signal-pulse rounded-full bg-ember" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              {active ? activeLabel : "hover a node"}
            </span>
          </div>
          <div className="pointer-events-none absolute bottom-4 right-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground/60">
            {SKILL_NODES.length} nodes · {SKILL_EDGES.length} edges
          </div>
        </div>
      </div>
    </section>
  );
}
