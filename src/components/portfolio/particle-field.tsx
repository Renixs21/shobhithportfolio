"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface ParticleFieldProps {
  className?: string;
}

interface P {
  x: number;
  y: number;
  vx: number;
  vy: number;
  bx: number; // baseline / home
  by: number;
  r: number;
  hue: number; // 0 = ember, 1 = aurora
  phase: number;
}

/**
 * A living constellation. Particles drift on a gentle flow field,
 * spring toward baseline positions, and are repelled by the cursor —
 * the cursor literally bends the field. Connection lines form between
 * nearby particles, evoking a signal emerging from static.
 */
export function ParticleField({ className }: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let particles: P[] = [];
    let raf = 0;
    let t = 0;
    const mouse = { x: -9999, y: -9999, active: false };
    const start = performance.now();

    const isMobile = () => window.innerWidth < 768;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    const seed = () => {
      const count = isMobile() ? 55 : 120;
      particles = [];
      for (let i = 0; i < count; i++) {
        const bx = Math.random() * w;
        const by = Math.random() * h;
        particles.push({
          x: w / 2 + (Math.random() - 0.5) * w * 0.4,
          y: h / 2 + (Math.random() - 0.5) * h * 0.4,
          vx: 0,
          vy: 0,
          bx,
          by,
          r: Math.random() * 1.6 + 0.5,
          hue: Math.random() < 0.62 ? 0 : 1,
          phase: Math.random() * Math.PI * 2,
        });
      }
    };

    // Cheap pseudo-noise for organic drift
    const flow = (x: number, y: number, time: number) => {
      const s = 0.0016;
      return (
        Math.sin(x * s + time * 0.4) * Math.cos(y * s * 1.3 - time * 0.3) +
        Math.sin((x + y) * s * 0.7 + time * 0.2) * 0.5
      );
    };

    const ember = "255, 138, 76";
    const aurora = "94, 224, 184";

    const draw = (now: number) => {
      t = (now - start) / 1000;
      ctx.clearRect(0, 0, w, h);

      const repelR = isMobile() ? 90 : 150;
      const repelR2 = repelR * repelR;

      // Update
      for (const p of particles) {
        // flow field drift toward baseline
        const ang = flow(p.x, p.y, t) * Math.PI;
        p.vx += Math.cos(ang) * 0.012;
        p.vy += Math.sin(ang) * 0.012;

        // spring to baseline
        p.vx += (p.bx - p.x) * 0.0016;
        p.vy += (p.by - p.y) * 0.0016;

        // cursor repulsion
        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < repelR2 && d2 > 0.01) {
            const d = Math.sqrt(d2);
            const force = (1 - d / repelR) * 2.6;
            p.vx += (dx / d) * force;
            p.vy += (dy / d) * force;
          }
        }

        // damping
        p.vx *= 0.9;
        p.vy *= 0.9;
        p.x += p.vx;
        p.y += p.vy;

        // keep in bounds softly
        if (p.x < -20) p.x = -20;
        if (p.x > w + 20) p.x = w + 20;
        if (p.y < -20) p.y = -20;
        if (p.y > h + 20) p.y = h + 20;
      }

      // Constellation lines
      const linkD = isMobile() ? 70 : 110;
      const linkD2 = linkD * linkD;
      ctx.lineWidth = 0.6;
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < linkD2) {
            const alpha = (1 - d2 / linkD2) * 0.32;
            const col = a.hue === b.hue ? (a.hue === 0 ? ember : aurora) : "180, 180, 170";
            ctx.strokeStyle = `rgba(${col}, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Particles
      for (const p of particles) {
        const tw = 0.7 + Math.sin(t * 1.6 + p.phase) * 0.3;
        const col = p.hue === 0 ? ember : aurora;
        const rr = p.r * (1.2 + (mouse.active ? 0.2 : 0));
        // glow
        ctx.fillStyle = `rgba(${col}, ${0.12 * tw})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, rr * 3.2, 0, Math.PI * 2);
        ctx.fill();
        // core
        ctx.fillStyle = `rgba(${col}, ${0.9 * tw})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, rr, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };
    const onLeave = () => {
      mouse.active = false;
      mouse.x = -9999;
      mouse.y = -9999;
    };
    const onTouch = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.touches[0].clientX - rect.left;
      mouse.y = e.touches[0].clientY - rect.top;
      mouse.active = true;
    };

    resize();
    if (!reduced) {
      raf = requestAnimationFrame(draw);
      window.addEventListener("mousemove", onMove, { passive: true });
      window.addEventListener("mouseout", onLeave);
      window.addEventListener("touchmove", onTouch, { passive: true });
      window.addEventListener("touchend", onLeave);
    } else {
      // reduced motion: draw a single static frame
      draw(performance.now());
      cancelAnimationFrame(raf);
    }
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseout", onLeave);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("touchend", onLeave);
    };
  }, [reduced]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-hidden="true"
      style={{ width: "100%", height: "100%", display: "block" }}
    />
  );
}
