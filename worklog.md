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
