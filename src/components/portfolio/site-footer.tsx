"use client";

import { Github, Linkedin, Mail, ArrowUp } from "lucide-react";
import { Magnetic } from "./magnetic-button";
import { PROFILE, NAV_LINKS } from "@/lib/portfolio-data";

export function SiteFooter() {
  const year = new Date().getFullYear();
  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <footer className="relative mt-auto border-t border-border bg-surface/60">
      <div className="mx-auto w-full max-w-7xl px-6 py-14 md:px-10">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          {/* Identity */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-ember-soft font-mono text-xs font-bold text-ember">
                SB
              </span>
              <span className="font-display text-lg font-medium text-foreground">
                {PROFILE.name}
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {PROFILE.signature}
            </p>
            <div className="mt-5 flex items-center gap-1">
              {[
                { icon: Github, href: PROFILE.github, label: "GitHub" },
                { icon: Linkedin, href: PROFILE.linkedin, label: "LinkedIn" },
                { icon: Mail, href: `mailto:${PROFILE.email}`, label: "Email" },
              ].map(({ icon: Icon, href, label }) => (
                <Magnetic
                  key={label}
                  as="a"
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  strength={0.5}
                  cursorLabel={label}
                  className="grid h-10 w-10 place-items-center rounded-full text-muted-foreground transition-colors hover:text-ember"
                  aria-label={label}
                >
                  <Icon className="h-[18px] w-[18px]" />
                </Magnetic>
              ))}
            </div>
          </div>

          {/* Sitemap */}
          <div className="md:col-span-3">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              Sections
            </div>
            <ul className="mt-4 space-y-2">
              {NAV_LINKS.map((l) => (
                <li key={l.id}>
                  <button
                    onClick={() => scrollTo(l.id)}
                    data-cursor
                    data-cursor-label={l.hint}
                    className="text-sm text-muted-foreground transition-colors hover:text-ember"
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Status */}
          <div className="md:col-span-4">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              Status
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm text-foreground">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-signal-pulse rounded-full bg-aurora" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-aurora" />
              </span>
              {PROFILE.availability}
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              {PROFILE.location}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {PROFILE.email}
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 md:flex-row">
          <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            © {year} {PROFILE.name} · designed & built from scratch
          </div>
          <Magnetic
            as="button"
            strength={0.5}
            cursorLabel="top"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-2 rounded-full border border-border px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground transition-colors hover:border-ember/50 hover:text-ember"
          >
            <ArrowUp className="h-3 w-3" />
            back to overture
          </Magnetic>
        </div>
      </div>
    </footer>
  );
}
