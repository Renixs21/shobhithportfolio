"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { readColorVar, deviconUrl } from "@/lib/color-utils";
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
  img?: HTMLImageElement;
  imgReady: boolean;
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

    /** Rounded-rectangle path helper for the hover label pill. */
    const roundRect = (
      c: CanvasRenderingContext2D,
      x: number,
      y: number,
      width: number,
      height: number,
      radius: number
    ) => {
      const r = Math.min(radius, width / 2, height / 2);
      c.beginPath();
      c.moveTo(x + r, y);
      c.arcTo(x + width, y, x + width, y + height, r);
      c.arcTo(x + width, y + height, x, y + height, r);
      c.arcTo(x, y + height, x, y, r);
      c.arcTo(x, y, x + width, y, r);
      c.closePath();
    };

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
      nodes = SKILL_NODES.map((n) => {
        const sim: SimNode = {
          ...n,
          x: w / 2,
          y: h / 2,
          vx: 0,
          vy: 0,
          tx: w / 2,
          ty: h / 2,
          r: 13 + n.level * 2.2,
          glow: 0,
          imgReady: false,
        };
        // Lazy-load the technology logo for this node.
        if (n.icon && !sim.img) {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.onload = () => {
            sim.img = img;
            sim.imgReady = true;
          };
          img.onerror = () => {
            sim.imgReady = false;
          };
          img.src = deviconUrl(n.icon.name, n.icon.variant);
        } else if (sim.img) {
          sim.imgReady = true;
        }
        return sim;
      });

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

      // Draw nodes — technology logos clipped into circular badges.
      for (const p of nodes) {
        const col = groupColor(p.group, ember, aurora);
        const isHovered = hovered === p;
        const r = p.r * (isHovered ? 1.32 : 1) * (0.85 + p.glow * 0.3);

        // badge background disc (gives logos a consistent surface)
        ctx.fillStyle = "rgba(255, 255, 255, 0.96)";
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fill();

        // accent ring
        ctx.strokeStyle = `rgba(${col}, ${isHovered ? 0.95 : 0.5 * p.glow})`;
        ctx.lineWidth = isHovered ? 2.4 : 1.4;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.stroke();

        // logo image clipped to the circle, or initials fallback
        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, r * 0.72, 0, Math.PI * 2);
        ctx.clip();
        if (p.imgReady && p.img) {
          const size = r * 1.5;
          ctx.drawImage(p.img, p.x - size / 2, p.y - size / 2, size, size);
        } else {
          // initials fallback
          ctx.fillStyle = `rgba(${col}, 0.9)`;
          ctx.font = `600 ${Math.round(r * 0.7)}px var(--font-geist-sans), sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(p.initials, p.x, p.y + 1);
        }
        ctx.restore();

        // label appears ONLY on hover
        if (isHovered) {
          ctx.font = "600 13px var(--font-geist-sans), sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          const label = p.label;
          const padX = 10;
          const tw = ctx.measureText(label).width;
          const bx = p.x - tw / 2 - padX;
          const by = p.y - r - 30;
          const bw = tw + padX * 2;
          const bh = 24;
          // pill background
          ctx.fillStyle = "rgba(10, 10, 10, 0.92)";
          roundRect(ctx, bx, by, bw, bh, 12);
          ctx.fill();
          ctx.strokeStyle = `rgba(${col}, 0.6)`;
          ctx.lineWidth = 1;
          roundRect(ctx, bx, by, bw, bh, 12);
          ctx.stroke();
          ctx.fillStyle = "rgba(245, 241, 234, 0.97)";
          ctx.fillText(label, p.x, by + bh / 2);
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

    // Click a node → open its official page in a new tab.
    const onClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      for (const p of nodes) {
        const dx = p.x - mx;
        const dy = p.y - my;
        if (dx * dx + dy * dy < (p.r * 1.4) ** 2) {
          window.open(p.url, "_blank", "noopener,noreferrer");
          break;
        }
      }
    };

    // Keyboard: when the canvas is focused, Enter/Space opens the
    // currently-hovered (active) node's official page.
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      const id = activeRef.current;
      if (!id) return;
      const node = nodes.find((n) => n.id === id);
      if (node) {
        e.preventDefault();
        window.open(node.url, "_blank", "noopener,noreferrer");
      }
    };

    resize();
    raf = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseleave", onLeave);
    canvas.addEventListener("click", onClick);
    canvas.addEventListener("keydown", onKey);

    return () => {
      cancelAnimationFrame(raf);
      themeObserver.disconnect();
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
      canvas.removeEventListener("click", onClick);
      canvas.removeEventListener("keydown", onKey);
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
              Not a list of bars — a living network of the tools I
              reach for. Hover any logo to see its name and connections;
              click to open its official page.
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
            tabIndex={0}
            className="absolute inset-0 h-full w-full outline-none focus-visible:ring-2 focus-visible:ring-ember/60"
            aria-label="Interactive skill constellation graph. Hover a technology logo to see its name; click to open its official page."
            role="img"
          />
          {/* Hover readout */}
          <div className="pointer-events-none absolute left-4 top-4 flex items-center gap-2 rounded-full border border-border bg-surface/70 px-3 py-1.5 backdrop-blur">
            <span className="h-1.5 w-1.5 animate-signal-pulse rounded-full bg-ember" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              {active ? activeLabel : "hover a logo · click to open"}
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
