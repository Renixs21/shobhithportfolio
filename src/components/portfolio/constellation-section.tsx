"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { readColorVar, deviconUrl } from "@/lib/color-utils";
import { SKILL_NODES, type SkillNode } from "@/lib/portfolio-data";

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

const EMBER_FALLBACK = "255, 138, 76";
const AURORA_FALLBACK = "94, 224, 184";
const EMBER_GROUPS = new Set(["language", "backend", "data"]);
const groupColor = (group: string, ember: string, aurora: string) =>
  EMBER_GROUPS.has(group) ? ember : aurora;

/**
 * A constellation, not a checklist. Technology logos scatter in an
 * organic ring around a central heading; nearby nodes connect in a web.
 * Hover a logo to focus its cluster + reveal its name; click to open
 * the official page. Solid dark band, like the reference.
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
      const cx = w / 2;
      const cy = h / 2;
      const isMobile = w < 700;
      // Reserve a central ellipse for the heading text — nodes scatter
      // around it in an organic ring.
      const ringRx = Math.min(w, h) * (isMobile ? 0.36 : 0.4);
      const ringRy = Math.min(w, h) * (isMobile ? 0.3 : 0.34);
      // The heading box (approx) — nodes avoid this central region.
      const holeRx = isMobile ? w * 0.34 : w * 0.28;
      const holeRy = isMobile ? h * 0.14 : h * 0.13;

      nodes = SKILL_NODES.map((n, i) => {
        // Distribute around the ring with a golden-angle jitter for an
        // organic (non-grid) scatter.
        const golden = 2.39996;
        const baseAngle = (i * golden) % (Math.PI * 2);
        const jitter = Math.sin(i * 12.9898) * 0.18;
        const angle = baseAngle + jitter;
        const radiusMul = 0.82 + ((i * 0.37) % 1) * 0.36;
        const tx = cx + Math.cos(angle) * ringRx * radiusMul;
        const ty = cy + Math.sin(angle) * ringRy * radiusMul;

        const sim: SimNode = {
          ...n,
          x: cx + (Math.random() - 0.5) * w * 0.3,
          y: cy + (Math.random() - 0.5) * h * 0.3,
          vx: 0,
          vy: 0,
          tx,
          ty,
          r: isMobile ? 14 + n.level * 1.2 : 16 + n.level * 1.6,
          glow: 0,
          imgReady: false,
        };
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

      // stash hole dims for draw
      (layout as unknown as { _hole: { rx: number; ry: number } })._hole = {
        rx: holeRx,
        ry: holeRy,
      };
    };

    const nodeById = (id: string) => nodes.find((n) => n.id === id);

    // Distance-based connections: each node connects to its nearest
    // 2–3 neighbors, forming a web. Lines never cross the central hole.
    const neighborPairs: [SimNode, SimNode][] = [];
    const buildNeighbors = () => {
      neighborPairs.length = 0;
      const maxD = Math.min(w, h) * 0.34;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        // distances to all others
        const scored: { n: SimNode; d: number }[] = [];
        for (let j = 0; j < nodes.length; j++) {
          if (i === j) continue;
          const b = nodes[j];
          const dx = a.tx - b.tx;
          const dy = a.ty - b.ty;
          scored.push({ n: b, d: Math.sqrt(dx * dx + dy * dy) });
        }
        scored.sort((x, y) => x.d - y.d);
        const picks = scored.slice(0, 3);
        for (const p of picks) {
          if (p.d > maxD) continue;
          // avoid duplicate pairs
          const exists = neighborPairs.some(
            ([x, y]) =>
              (x === a && y === p.n) || (x === p.n && y === a)
          );
          if (!exists) neighborPairs.push([a, p.n]);
        }
      }
    };

    const draw = (now: number) => {
      t = (now - start) / 1000;
      ctx.clearRect(0, 0, w, h);

      const hoveredId = activeRef.current;
      const hovered = hoveredId ? nodeById(hoveredId) : null;
      const neighborIds = new Set<string>();
      if (hovered) {
        for (const [a, b] of neighborPairs) {
          if (a === hovered) neighborIds.add(b.id);
          if (b === hovered) neighborIds.add(a.id);
        }
      }

      // Update physics
      for (const p of nodes) {
        const breath = reduced
          ? 0
          : Math.sin(t * 0.5 + (p.x + p.y) * 0.003) * 3;
        p.vx += (p.tx + breath - p.x) * 0.012;
        p.vy += (p.ty + breath - p.y) * 0.012;

        if (mouse.active && !hovered) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 16000 && d2 > 1) {
            const d = Math.sqrt(d2);
            const f = (1 - d / 126) * 0.4;
            p.vx += (dx / d) * f;
            p.vy += (dy / d) * f;
          }
        }

        p.vx *= 0.9;
        p.vy *= 0.9;
        p.x += p.vx;
        p.y += p.vy;

        const isHovered = hovered === p;
        const isNeighbor = neighborIds.has(p.id);
        const targetGlow = !hovered || isHovered || isNeighbor ? 1 : 0.28;
        p.glow += (targetGlow - p.glow) * 0.12;
      }

      // Draw connection web (lines avoid crossing center visually by
      // being drawn behind the heading; the central hole has no nodes)
      for (const [a, b] of neighborPairs) {
        const involved =
          hovered && (hovered === a || hovered === b);
        const baseAlpha = involved ? 0.55 : hovered ? 0.04 : 0.16;
        const col = involved
          ? ember
          : a.group === b.group
          ? groupColor(a.group, ember, aurora)
          : "160, 160, 160";
        ctx.strokeStyle = `rgba(${col}, ${baseAlpha})`;
        ctx.lineWidth = involved ? 1.6 : 0.7;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }

      // Draw nodes — clean logo badges, no glow
      for (const p of nodes) {
        const col = groupColor(p.group, ember, aurora);
        const isHovered = hovered === p;
        const r = p.r * (isHovered ? 1.32 : 1) * (0.85 + p.glow * 0.3);

        // badge background disc
        ctx.fillStyle = `rgba(255, 255, 255, ${0.92 * p.glow + 0.08})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fill();

        // accent ring
        ctx.strokeStyle = `rgba(${col}, ${isHovered ? 0.95 : 0.5 * p.glow + 0.15})`;
        ctx.lineWidth = isHovered ? 2.4 : 1.4;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.stroke();

        // logo clipped to circle
        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, r * 0.72, 0, Math.PI * 2);
        ctx.clip();
        if (p.imgReady && p.img) {
          const size = r * 1.5;
          ctx.drawImage(p.img, p.x - size / 2, p.y - size / 2, size, size);
        } else {
          ctx.fillStyle = `rgba(${col}, 0.9)`;
          ctx.font = `600 ${Math.round(r * 0.7)}px var(--font-geist-sans), sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(p.initials, p.x, p.y + 1);
        }
        ctx.restore();

        // hover label pill
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

      let hit: SimNode | null = null;
      for (const p of nodes) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        if (dx * dx + dy * dy < (p.r * 1.4) ** 2) {
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
    buildNeighbors();
    raf = requestAnimationFrame(draw);
    window.addEventListener("resize", () => {
      resize();
      buildNeighbors();
    });
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
      className="scope-dark relative overflow-hidden bg-obsidian py-28 md:py-36"
    >
      <div className="relative mx-auto w-full max-w-7xl px-6 md:px-10">
        {/* Top-left labels — TOOLKIT + hover hint */}
        <div className="mb-8 flex flex-col gap-2">
          <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-foreground/50">
            TOOLKIT
          </div>
          <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-foreground/40">
            {"// hover to focus a cluster · click to open"}
          </div>
        </div>

        {/* The constellation canvas with centered heading overlay */}
        <div
          ref={wrapRef}
          className="relative aspect-[16/11] w-full overflow-hidden rounded-3xl border border-hairline bg-obsidian/40 md:aspect-[16/9]"
        >
          <canvas
            ref={canvasRef}
            tabIndex={0}
            className="absolute inset-0 h-full w-full outline-none focus-visible:ring-2 focus-visible:ring-ember/60"
            aria-label="Interactive skill constellation. Hover a logo to see its name; click to open its official page."
            role="img"
          />

          {/* Centered heading — "A constellation, not a checklist." */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-6">
            <h2 className="max-w-2xl text-center font-display text-fluid-xl font-medium leading-[1.05] tracking-tightest text-foreground md:text-fluid-2xl">
              A constellation,{" "}
              <span className="font-italic-accent text-ember">not</span> a
              checklist.
            </h2>
          </div>

          {/* Hover readout — top-right */}
          <div className="pointer-events-none absolute right-4 top-4 flex items-center gap-2 rounded-full border border-hairline bg-obsidian/70 px-3 py-1.5 backdrop-blur">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{
                backgroundColor: active
                  ? "var(--ember)"
                  : "var(--muted-foreground)",
              }}
            />
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              {active ? activeLabel : "hover a logo"}
            </span>
          </div>

          {/* Node count — bottom-right */}
          <div className="pointer-events-none absolute bottom-4 right-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground/50">
            {SKILL_NODES.length} tools
          </div>
        </div>
      </div>
    </section>
  );
}
