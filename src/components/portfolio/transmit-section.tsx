"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Check, Loader2, Send } from "lucide-react";
import { PROFILE } from "@/lib/portfolio-data";
import { EASE, DURATION, SPRING } from "@/lib/motion-tokens";

interface FormState {
  name: string;
  email: string;
  message: string;
}

type Status = "idle" | "sending" | "sent" | "error";

function NumberedField({
  index,
  label,
  error,
  children,
}: {
  index: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="group block">
      <span className="mb-3 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
        <span className="text-ember">{index}</span>
        <span className="text-muted-foreground/50">•</span>
        {label}
      </span>
      <div className="relative">
        {children}
        <span className="pointer-events-none absolute inset-x-0 -bottom-px h-px scale-x-0 bg-ember transition-transform duration-500 group-focus-within:scale-x-100" />
      </div>
      <AnimatePresence>
        {error && (
          <motion.span
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-2 block font-mono text-[11px] text-destructive"
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
    <section
      id="transmit"
      className="scope-dark relative overflow-hidden bg-obsidian py-28 md:py-40"
    >
      {/* Subtle ember glow at the base */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-ember-soft to-transparent opacity-40" />

      <div className="relative mx-auto w-full max-w-6xl px-6 md:px-10">
        {/* Top row — name (left) + email (right) on one straight line */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: DURATION.normal, ease: EASE.signal }}
          className="mb-16 flex items-baseline justify-between gap-4 border-b border-hairline pb-5"
        >
          <div className="flex items-center gap-2 font-display text-fluid-lg font-medium text-foreground">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-signal-pulse rounded-full bg-ember" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-ember" />
            </span>
            {PROFILE.name}
          </div>
          <a
            href={`mailto:${PROFILE.email}`}
            data-cursor
            data-cursor-label="email"
            className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-ember"
          >
            {PROFILE.email}
          </a>
        </motion.div>

        {/* MASSIVE headline — "Let's build something absurdly good." */}
        <h2 className="font-display font-medium leading-[0.92] tracking-tightest text-foreground">
          <motion.span
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-8% 0px" }}
            transition={{ duration: DURATION.hero, ease: EASE.signal }}
            className="block text-fluid-mega"
          >
            Let&apos;s build
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-8% 0px" }}
            transition={{
              duration: DURATION.hero,
              ease: EASE.signal,
              delay: 0.12,
            }}
            className="block text-fluid-mega"
          >
            something{" "}
            <span className="font-italic-accent text-ember">absurdly</span>{" "}
            good.
          </motion.span>
        </h2>

        {/* Form + side note */}
        <div className="mt-20 grid grid-cols-1 gap-16 lg:grid-cols-12">
          {/* The minimalist numbered form */}
          <form
            onSubmit={handleSubmit}
            className="lg:col-span-7"
            aria-label="Contact form"
          >
            <div className="space-y-10">
              <NumberedField index="01" label="Your name" error={errors.name}>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Ada Lovelace"
                  className="w-full border-0 border-b border-hairline bg-transparent pb-3 text-fluid-base text-foreground placeholder:text-muted-foreground/50 transition-colors focus:border-transparent focus:outline-none"
                  disabled={status === "sending" || status === "sent"}
                  required
                />
              </NumberedField>

              <NumberedField
                index="02"
                label="Your email"
                error={errors.email}
              >
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                  placeholder="ada@analytical.engine"
                  className="w-full border-0 border-b border-hairline bg-transparent pb-3 text-fluid-base text-foreground placeholder:text-muted-foreground/50 transition-colors focus:border-transparent focus:outline-none"
                  disabled={status === "sending" || status === "sent"}
                  required
                />
              </NumberedField>

              <NumberedField
                index="03"
                label="What are we making?"
                error={errors.message}
              >
                <textarea
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                  rows={3}
                  placeholder="A rough idea, a wild bet, or a boring but important system…"
                  className="w-full resize-none border-0 border-b border-hairline bg-transparent pb-3 text-fluid-base text-foreground placeholder:text-muted-foreground/50 transition-colors focus:border-transparent focus:outline-none"
                  disabled={status === "sending" || status === "sent"}
                  required
                />
              </NumberedField>
            </div>

            {/* Submit button — clean, underline-on-hover like the reference */}
            <div className="mt-12 flex items-center gap-6">
              <button
                type="submit"
                disabled={status === "sending" || status === "sent"}
                data-cursor
                data-cursor-label="send"
                className="group relative flex items-center gap-3 font-display text-fluid-lg font-medium text-foreground transition-colors hover:text-ember disabled:opacity-50"
              >
                <span className="relative">
                  {status === "idle" && "Send it"}
                  {status === "sending" && "Sending…"}
                  {status === "sent" && "Sent"}
                  {status === "error" && "Try again"}
                  <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-ember transition-transform duration-500 group-hover:scale-x-100" />
                </span>
                {status === "sending" ? (
                  <Loader2 className="h-5 w-5 animate-spin text-ember" />
                ) : status === "sent" ? (
                  <Check className="h-5 w-5 text-aurora" />
                ) : (
                  <Send className="h-5 w-5 text-ember transition-transform duration-300 group-hover:translate-x-1" />
                )}
              </button>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60">
                {status === "idle" && "→ enter to transmit"}
                {status === "sending" && "transmitting…"}
                {status === "sent" && "signal received"}
                {status === "error" && "something went wrong"}
              </span>
            </div>

            {/* Success celebration */}
            <AnimatePresence>
              {status === "sent" && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: DURATION.normal, ease: EASE.signal }}
                  className="relative mt-8 overflow-hidden rounded-2xl border border-aurora/30 bg-aurora-soft p-6"
                >
                  <div className="relative flex items-center gap-4">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-aurora/20">
                      <Check className="h-5 w-5 text-aurora" />
                    </div>
                    <div>
                      <div className="font-display text-lg font-medium text-foreground">
                        Transmission received.
                      </div>
                      <div className="mt-0.5 text-sm text-muted-foreground">
                        I&apos;ll get back to you within a day or two.
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>

          {/* Side note — the invitation */}
          <motion.aside
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: DURATION.slow, ease: EASE.signal, delay: 0.2 }}
            className="lg:col-span-5 lg:pl-8"
          >
            <p className="font-italic-accent text-fluid-lg leading-snug text-foreground/80">
              Internships, collaborations, or a problem worth solving at 2am —
              my inbox is open.
            </p>
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              I read everything; I reply to what matters. Tell me what
              you&apos;re building and where I fit in — the rougher the idea,
              the better.
            </p>

            {/* Direct channels */}
            <div className="mt-10 space-y-3 border-t border-hairline pt-6">
              {[
                { k: "Email", v: PROFILE.email, href: `mailto:${PROFILE.email}` },
                { k: "Phone", v: PROFILE.phone, href: `tel:${PROFILE.phone.replace(/\s/g, "")}` },
                { k: "Based", v: PROFILE.location, href: undefined },
              ].map((c) => (
                <div
                  key={c.k}
                  className="flex items-baseline justify-between gap-4"
                >
                  <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                    {c.k}
                  </span>
                  {c.href ? (
                    <a
                      href={c.href}
                      data-cursor
                      data-cursor-label="open"
                      className="text-sm text-foreground transition-colors hover:text-ember"
                    >
                      {c.v}
                    </a>
                  ) : (
                    <span className="text-sm text-foreground">{c.v}</span>
                  )}
                </div>
              ))}
            </div>
          </motion.aside>
        </div>
      </div>
    </section>
  );
}
