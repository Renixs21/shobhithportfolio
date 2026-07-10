# Portfolio Build Worklog — Shobhith BJ

Project: World-class original developer portfolio (Next.js 16)
Concept: "SIGNAL / STATIC" — a transmission emerging from noise.

Resume source: /home/z/my-project/upload/shobhith-bj-resume.pdf

---
Task ID: 1
Agent: orchestrator (main)
Task: Initialize worklog and start dev server

Work Log:
- Extracted resume content via pdf.py extract.text
- Confirmed Next.js 16 + TS + Tailwind 4 + shadcn/ui + framer-motion available
- Started dev server on port 3000 in background

Stage Summary:
- Resume parsed: Shobhith BJ, Bangalore, full-stack + AI/ML student
- Skills: Python, JS, React, Next.js, Django, Flask, PyTorch, NLP, GenAI
- Projects: Myntra-style e-commerce, Competitive Intelligence (LLM), Triage AI Medical, Haptic Nav Belt
- Education: BGS College of Engineering (B.E. AI & Data Science, CGPA 8.5)
- Certifications: JPMorgan, AWS GenAI, CCNA
- Design concept locked: duotone "ember + aurora" on obsidian, editorial+dark+playground+storytelling synthesis

---
Task ID: 2-14
Agent: orchestrator (main)
Task: Build complete original developer portfolio end-to-end

Work Log:
- Built design system in globals.css: "ember + aurora on obsidian" duotone tokens, fluid type scale, glass utilities, signal-gradient text, noise/grid overlays, keyframe library, reduced-motion guard
- Updated layout.tsx with Space Grotesk display font + portfolio metadata
- Created portfolio-data.ts (profile, skills graph nodes/edges, 4 projects with full case-study fields, 7 milestones, nav links) and motion-tokens.ts (easing/duration/spring/stagger + reveal variants)
- Built hooks: use-media-query (useSyncExternalStore), use-reduced-motion, use-mouse-position (rAF-lerped), use-in-view, use-scroll-spy
- Built shared primitives: CursorFollower (dual-ring, hover-label), Magnetic, RevealText (line + word mask), SectionDivider, ScrollProgress, AnimatedSection, SpotlightCard
- Built OVERTURE hero: canvas particle field with flow-field drift + cursor repulsion + constellation links; editorial name reveal; word-by-word philosophy; magnetic CTAs + socials; stats strip; scroll cue
- Built MANIFESTO: parallax glows, sticky index rail, editorial quote reveal, dual-column summary, philosophy pull-quote
- Built TechMarquee (bidirectional kinetic divider)
- Built CONSTELLATION: canvas force-graph, 29 skill nodes clustered in 6 group rings, 32 edges, cursor hit-testing with neighbor highlighting, breathing physics, reduced-motion static frame
- Built TRAJECTORY: scroll-driven rail fill, alternating milestone cards with kind icons + metrics, mobile-stacked layout
- Built BUILDS: 3 seamless modes (Immersive case-study w/ pagination, Spatial 3D-tilt draggable carousel, Grid w/ expandable cards) via AnimatePresence + layoutId pill
- Built TRANSMIT: magnetic contact form, channel cards, POST /api/contact (zod-validated), success celebration with 18-particle burst
- Built AmbientNav (glass dock, scroll-spy active pill), CommandPalette (Cmd+K, nav + connect actions), KonamiEasterEgg (60-particle confetti + message), SiteFooter (sticky mt-auto)
- Composed page.tsx with SectionDividers between cinematic sections
- Fixed 2 lint errors by migrating setState-in-effect to useSyncExternalStore pattern
- Browser-verified with Agent Browser + VLM: hero, manifesto, constellation graph, trajectory, builds (all 3 modes), contact form submission + celebration, command palette, footer stickiness, mobile (390px) — all render and interact correctly

Stage Summary:
- Lint: clean (0 errors)
- Dev server: running on :3000, all routes 200, POST /api/contact 200
- All 6 sections verified rendering + interactive in browser (desktop + mobile)
- Portfolio is original: "SIGNAL / STATIC" concept, ember/aurora duotone on obsidian, editorial+dark+playground+storytelling synthesis — no copied layouts/animations/palettes

---
Task ID: 15
Agent: orchestrator (main)
Task: Add glassmorphic top navbar with dark/light mode toggle (per reference image)

Work Log:
- Analyzed reference image: frosted glass floating pill nav, logo "Shobhith." with dot accent, centered WORK/ABOUT/SKILLS/PATH/CONTACT links, sun/moon theme toggle on right
- Restructured globals.css: `:root,.dark` = dark tokens (default), added full `.light` token block (warm paper background, tuned ember/aurora for contrast, light glass, light scrollbar)
- Made body atmosphere, ::selection, scrollbar theme-adaptive via `.light` overrides
- Added `.glass-nav` utility (20px blur + saturate, glass-border, inset highlight, theme-aware shadow)
- Made `.grid-lines` use foreground token via color-mix (adapts to both themes)
- Wired next-themes: created ThemeProvider, set attribute="class" defaultTheme="dark" in layout.tsx
- Built ThemeToggle (sun/moon cross-fade rotate via AnimatePresence), used useIsClient hook (useSyncExternalStore) to avoid setState-in-effect lint error
- Built TopNav: floating glass pill, "Shobhith" logo with ember dot, scroll-spy active pill (layoutId), ⌘K trigger, theme toggle, mobile hamburger → glass dropdown sheet
- Removed old AmbientNav (replaced by TopNav), removed redundant hero status bar, added pt-28 to hero to clear nav
- Created color-utils.ts readColorVar() — reads CSS color tokens as RGB strings for canvas
- Refactored ParticleField + Constellation canvas to read --ember/--aurora from theme + re-read on theme change via MutationObserver
- Converted all hardcoded oklch() accent colors to var(--ember)/var(--aurora) across: section-divider, scroll-progress, trajectory rail/badges, builds accentColor/StatusBadge/spatial cards/grid spotlight, constellation legend, cursor-follower, transmit celebration overlay
- Replaced bg-obsidian/40 input/stack backgrounds with bg-surface/60 for light-mode correctness
- Made hero vignette use color-mix(background) instead of hardcoded dark
- Browser-verified: dark navbar glass, toggle→light (paper bg, frosted light navbar, readable text), constellation+builds+contact readable in light, theme persists across reload, mobile hamburger menu works in light, toggle back to dark works

Stage Summary:
- Lint: clean (0 errors)
- Both themes fully functional, toggle persists via next-themes localStorage
- Glassmorphic top nav matches reference aesthetic (frosted pill, logo+dot, centered links, toggle)
- All sections audited for light-mode contrast — no broken/disappearing elements

---
Task ID: 16
Agent: orchestrator (main)
Task: Upgrade to premium serif fonts (Fraunces + Instrument Serif) per reference

Work Log:
- Analyzed reference screenshot: premium humanist SERIF headline with ITALIC emphasis word (the "absurdly" treatment)
- Added Fraunces (variable serif, opsz + SOFT axes) + Instrument Serif (high-contrast italic) via next/font/google in layout.tsx
- Fixed Fraunces config: weight must be "variable" when using custom axes (initial 500 error → resolved)
- Updated globals.css: removed --font-display from @theme inline (was resolving empty, overriding the utility class), kept explicit .font-display utility in @layer utilities pointing to var(--font-fraunces) with font-optical-sizing + variation-settings
- Added .font-italic-accent utility (Instrument Serif italic) for emphasis words
- Tuned fluid type scale line-heights/letter-spacing for serif optical sizing
- Applied fonts globally via existing font-display class (all section headings, nav logo, footer name auto-inherited Fraunces)
- Added italic emphasis: hero last name "BJ" → italic accent; "magical" in philosophy → italic ember; manifesto "Always ship. Learn in public." → italic; philosophy pull-quote → italic; transmit "something magical." → italic gradient
- Debugged font-display utility not applying (computed font was system sans) — root cause: @theme inline --font-display token resolved empty, Tailwind generated conflicting .font-display utility; fixed by removing token from @theme inline
- Browser-verified: hero name "Shobhith" = Fraunces serif, "BJ" = italic serif, "magical" = italic ember, nav logo = serif, manifesto quote + italic line, transmit "something magical." italic — all confirmed in both dark and light mode

Stage Summary:
- Lint: clean (0 errors)
- Premium serif typography (Fraunces) across all headings/name/nav/footer; Instrument Serif italic for emphasis words
- No boring/default fonts remain; editorial magazine feel achieved
- Readable in both dark and light themes

---
Task ID: 17
Agent: orchestrator (main)
Task: Rebuild the post-manifesto marquee as premium alternating outline/fill serif wheel per reference

Work Log:
- Analyzed reference: horizontal scrolling marquee, large serif text, alternating OUTLINE (stroked/hollow) and FILLED words, 4-point star separator between words, dark background, mixed case
- Rewrote tech-marquee.tsx with MarqueeItem[] (Engineering/Intelligence/Interaction/Systems/Machine Learning/Interfaces/Full-Stack/Generative AI)
- Alternating outline (transparent fill + WebkitTextStroke 1.5px light) vs fill (solid light) using Fraunces (font-display)
- Custom SVG 4-point star path (M50 0 L61 39 L100 50...) filled with ember as separator, responsive sizes
- Made band always dark (bg-obsidian) with hardcoded light text — deliberate cinematic divider that works in both themes
- Edge fade gradients in obsidian on both sides
- Added .signal-marquee-track class + prefers-reduced-motion media query to pause animation
- Responsive type scale: text-4xl mobile → text-6xl md → text-7xl lg
- Browser-verified: dark band with alternating outline/fill serif words + ember 4-point stars, scrolling; readable in both dark and light mode (band stays cinematic dark)

Stage Summary:
- Lint: clean
- Marquee now matches reference aesthetic (premium editorial alternating outline/fill + star separators)
- Works in both themes as intentional dark divider

---
Task ID: 18
Agent: orchestrator (main)
Task: Remove logo glow + fix invisible "BJ" and "something magical." gradient text

Work Log:
- Diagnosed "BJ" invisibility: text-signal-gradient (background-clip:text + transparent fill) was on the OUTER RevealText wrapper, but the inner text-bearing motion.span inherited transparent fill with no background → text vanished
- Added innerClassName prop to RevealText so gradient/solid classes can target the inner text element
- Found gradient-on-italic-serif still failed to render even with innerClassName (background-clip:text + Instrument Serif combination unreliable) → switched BJ to solid text-ember (orange) italic, which renders reliably
- Hero "BJ": direct motion.span (bypassing RevealText) with font-italic-accent + text-ember + reveal animation
- Transmit "something magical.": RevealText innerClassName=font-italic-accent text-ember (solid works through innerClassName)
- Removed outer glow halo (rgba col fill at r*2.1) from constellation node drawing — logos now render as clean white badges with accent ring only, no blurred glow
- Browser-verified: BJ visible in orange italic below Shobhith; "something magical." visible in orange; logos clean with no glow

Stage Summary:
- Lint: clean
- BJ + "something magical." now visible (solid ember italic instead of fragile gradient-on-italic)
- Constellation logos de-glowed (clean white badge + ring only)

---
Task ID: 19
Agent: orchestrator (main)
Task: Replace entire Transmit section — clone reference (massive headline + minimalist numbered form)

Work Log:
- Analyzed 2 reference screenshots: massive serif "Let's build something absurdly good." with "absurdly" italic ember, minimalist numbered form (01/02/03) with underline-only fields, dark bg, clean send button
- Rewrote transmit-section.tsx completely: top meta row (availability + email), MASSIVE headline (text-fluid-mega, "Let's build" / "something absurdly good." with italic ember "absurdly"), numbered form (01 Your name / 02 Your email / 03 What are we making?) with underline-only inputs + ember focus underline, "Send it" button with arrow + hover underline, side aside with italic invitation + direct channels (Email/Phone/Based)
- Added text-fluid-mega token to globals.css (clamp up to 11rem, spans viewport like reference)
- Added .scope-dark utility — forces dark-mode foreground/muted/hairline tokens inside the section so it stays a dark band with readable light text in BOTH themes (matches the dark reference)
- Section uses bg-obsidian + scope-dark so it's always a cinematic dark band regardless of theme
- Replaced success celebration overlay with a cleaner inline aurora panel ("Transmission received.")
- Browser-verified: massive headline with italic ember "absurdly" renders, numbered underline form visible, "Send it" button works, form submission shows success panel, section stays dark band in light mode

Stage Summary:
- Lint: clean
- Transmit section now clones the reference: huge serif headline + minimalist numbered form + clean send button, dark cinematic band in both themes

---
Task ID: 20
Agent: orchestrator (main)
Task: Replace entire Trajectory section — clone reference (vertical timeline with ember rail + dots + animation)

Work Log:
- Analyzed reference: vertical timeline, left date column + right content (title + caps tag + description), ember/yellow vertical rail with dots at each entry, dark bg, section heading "A short, deliberate trajectory." with "deliberate" italic ember, scroll-driven rail fill + staggered text reveal
- Updated Milestone interface: added optional `tag` (caps location/mode) and `subtitle` (org · metric) fields
- Rewrote MILESTONES data to reference order (most recent first): 2025 Multiple Full-Stack Shipments (INDEPENDENT), 2024 Adhvaya Hackathon · BGSCET (BANGALORE), 2024 Online Hackathon · Kiro (REMOTE), 2023-PRESENT B.E. AI & Data Science (EDUCATION, CGPA 8.5), 2021-2023 Pre-University · PCMB (EDUCATION, 89.7%)
- Rewrote trajectory-section.tsx: scope-dark dark band, heading "A short, deliberate trajectory." with italic ember "deliberate", vertical timeline with left date column (auto/8rem) + right content, hairline rail + animated ember→aurora gradient fill (scrollYProgress scaleY), ember/aurora dots on rail at each entry, staggered reveal (opacity+y, 0.08s delay per entry)
- Responsive: mobile uses narrower date column + tighter spacing; rail position adapts
- Browser-verified: heading + italic "deliberate", multiple timeline entries (2025/2024/2024/2023-PRESENT/2021-2023) render with rail + dots, dark band in both themes, readable in light mode

Stage Summary:
- Lint: clean
- Trajectory section now clones the reference: vertical ember-rail timeline with dots, staggered scroll reveal, dark cinematic band in both themes

---
Task ID: 21
Agent: orchestrator (main)
Task: Trajectory tweaks — years on right, remove dots, 2025-PRESENT, email beside name

Work Log:
- Updated MILESTONES: changed "2023 — PRESENT" → "2025 – PRESENT" for the B.E. education entry
- Rewrote trajectory-section.tsx layout: content on LEFT, year/date on RIGHT (grid-cols-[1fr_auto] on desktop, stacked on mobile)
- Removed all dots from the rail — now a clean hairline + animated ember→aurora gradient fill only
- Added email (PROFILE.email) beside the name in the heading area, styled as a mono uppercase link with hover→ember
- Kept the simple scroll-driven rail fill animation (scrollYProgress → scaleY)
- Kept scope-dark dark band for both themes
- Browser-verified: heading + italic ember "deliberate", email visible beside name, years (2025, 2024, 2024, 2025-PRESENT, 2021-2023) on right, no dots on rail, clean line, 2025-PRESENT (not 2023)

Stage Summary:
- Lint: clean
- Trajectory: years right, no dots, 2025-PRESENT, email beside name, scroll rail fill kept
