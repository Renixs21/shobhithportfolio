"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  ArrowUpRight,
  Check,
  Github,
  Linkedin,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Send,
  Sparkles,
} from "lucide-react";
import { Magnetic } from "./magnetic-button";
import { RevealText } from "./reveal-text";
import { PROFILE } from "@/lib/portfolio-data";
import { EASE, DURATION, SPRING } from "@/lib/motion-tokens";

interface FormState {
  name: string;
  email: string;
  message: string;
}

type Status = "idle" | "sending" | "sent" | "error";

const CONTACT_CHANNELS = [
  { icon: Mail, label: "Email", value: PROFILE.email, href: `mailto:${PROFILE.email}` },
  { icon: Phone, label: "Phone", value: PROFILE.phone, href: `tel:${PROFILE.phone.replace(/\s/g, "")}` },
  { icon: MapPin, label: "Location", value: PROFILE.location, href: undefined },
  { icon: Github, label: "GitHub", value: PROFILE.githubHandle, href: PROFILE.github },
  { icon: Linkedin, label: "LinkedIn", value: PROFILE.linkedinHandle, href: PROFILE.linkedin },
];

function FieldShell({
  label,
  children,
  error,
}: {
  label: string;
  children: React.ReactNode;
  error?: string;
}) {
  return (
    <label className="group block">
      <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
        {label}
      </span>
      {children}
      <AnimatePresence>
        {error && (
          <motion.span
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-1.5 block font-mono text-[11px] text-destructive"
          >
            {error}
          </motion.span>
        )}
      </AnimatePresence>
    </label>
  );
}

export function TransmitSection() {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setErrors({});
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        if (data.errors) {
          const flat: Record<string, string> = {};
          for (const k of Object.keys(data.errors)) {
            flat[k] = data.errors[k]?.[0];
          }
          setErrors(flat);
        }
        setStatus("error");
        return;
      }
      setStatus("sent");
      setTimeout(() => {
        setForm({ name: "", email: "", message: "" });
        setStatus("idle");
      }, 4200);
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="transmit" className="relative overflow-hidden py-28 md:py-36">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-ember-soft opacity-50 blur-[140px]" />

      <div className="relative mx-auto w-full max-w-7xl px-6 md:px-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Left — invitation */}
          <div>
            <div className="font-mono text-xs tracking-widest text-ember">
              05 / TRANSMIT
            </div>
            <h2 className="mt-3 text-fluid-2xl font-medium tracking-tightest text-foreground">
              <RevealText as="span" className="block font-display">
                Let&apos;s build
              </RevealText>
              <RevealText
                as="span"
                delay={0.12}
                className="block font-italic-accent text-signal-gradient"
              >
                something magical.
              </RevealText>
            </h2>
            <p className="mt-5 max-w-md text-muted-foreground">
              Internships, collaborations, or a problem worth solving at
              2am — my inbox is open. I read everything; I reply to what
              matters.
            </p>

            <div className="mt-10 space-y-2">
              {CONTACT_CHANNELS.map((c) => {
                const Icon = c.icon;
                const inner = (
                  <div className="group flex items-center justify-between rounded-2xl border border-border bg-surface/40 px-5 py-4 transition-colors hover:border-ember/40">
                    <div className="flex items-center gap-4">
                      <div className="grid h-9 w-9 place-items-center rounded-xl bg-ember-soft text-ember">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                          {c.label}
                        </div>
                        <div className="text-sm text-foreground">
                          {c.value}
                        </div>
                      </div>
                    </div>
                    {c.href && (
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ember" />
                    )}
                  </div>
                );
                return c.href ? (
                  <Magnetic
                    key={c.label}
                    as="a"
                    href={c.href}
                    strength={0.15}
                    cursorLabel="open"
                  >
                    {inner}
                  </Magnetic>
                ) : (
                  <div key={c.label}>{inner}</div>
                );
              })}
            </div>
          </div>

          {/* Right — the form */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-3xl border border-border bg-surface/40 p-8 backdrop-blur md:p-10">
              <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-aurora-soft opacity-40 blur-3xl" />

              <form onSubmit={handleSubmit} className="relative space-y-6">
                <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-signal-pulse rounded-full bg-aurora" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-aurora" />
                  </span>
                  secure channel · open
                </div>

                <FieldShell label="Your name" error={errors.name}>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    placeholder="Ada Lovelace"
                    className="w-full rounded-xl border border-border bg-surface/60 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 transition-colors focus:border-ember/60 focus:outline-none"
                    disabled={status === "sending" || status === "sent"}
                  />
                </FieldShell>

                <FieldShell label="Email" error={errors.email}>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    placeholder="ada@analytical.engine"
                    className="w-full rounded-xl border border-border bg-surface/60 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 transition-colors focus:border-ember/60 focus:outline-none"
                    disabled={status === "sending" || status === "sent"}
                  />
                </FieldShell>

                <FieldShell label="The signal" error={errors.message}>
                  <textarea
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                    rows={4}
                    placeholder="What are you building, and where do I fit in?"
                    className="w-full resize-none rounded-xl border border-border bg-surface/60 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 transition-colors focus:border-ember/60 focus:outline-none"
                    disabled={status === "sending" || status === "sent"}
                  />
                </FieldShell>

                <Magnetic
                  as="button"
                  strength={0.25}
                  cursorLabel="transmit"
                  className="group relative w-full overflow-hidden rounded-xl bg-foreground px-6 py-4 text-sm font-medium text-obsidian disabled:opacity-60"
                  // type via props on motion button
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {status === "sending" && (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    )}
                    {status === "sent" && <Check className="h-4 w-4" />}
                    {status === "idle" && <Send className="h-4 w-4" />}
                    {status === "error" && <Sparkles className="h-4 w-4" />}
                    {status === "idle" && "Transmit"}
                    {status === "sending" && "Transmitting…"}
                    {status === "sent" && "Signal received"}
                    {status === "error" && "Try again"}
                  </span>
                </Magnetic>
              </form>

              {/* Success celebration overlay */}
              <AnimatePresence>
                {status === "sent" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-20 grid place-items-center rounded-3xl bg-background/90 backdrop-blur"
                  >
                    <div className="relative text-center">
                      {/* burst particles */}
                      {Array.from({ length: 18 }).map((_, i) => {
                        const ang = (i / 18) * Math.PI * 2;
                        const dist = 90 + (i % 3) * 30;
                        const col =
                          i % 2 === 0
                            ? "oklch(0.74 0.2 45)"
                            : "oklch(0.82 0.13 165)";
                        return (
                          <motion.span
                            key={i}
                            initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
                            animate={{
                              x: Math.cos(ang) * dist,
                              y: Math.sin(ang) * dist,
                              opacity: 0,
                              scale: 1,
                            }}
                            transition={{ duration: 1.1, ease: EASE.signal }}
                            className="absolute left-1/2 top-1/2 h-2 w-2 rounded-full"
                            style={{ backgroundColor: col }}
                          />
                        );
                      })}
                      <motion.div
                        initial={{ scale: 0, rotate: -30 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={SPRING.bouncy}
                        className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-aurora/20"
                      >
                        <Check className="h-8 w-8 text-aurora" />
                      </motion.div>
                      <motion.h3
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mt-5 font-display text-xl font-medium text-foreground"
                      >
                        Transmission received.
                      </motion.h3>
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.32 }}
                        className="mt-2 text-sm text-muted-foreground"
                      >
                        I&apos;ll get back to you within a day or two.
                      </motion.p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
