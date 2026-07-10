/**
 * Portfolio content — derived from Shobhith BJ's resume.
 * Single source of truth for all sections.
 */

export type ProjectMode = "immersive" | "spatial" | "grid";

export interface Project {
  id: string;
  index: string;
  name: string;
  tagline: string;
  problem: string;
  process: string;
  architecture: string;
  stack: string[];
  challenges: string;
  impact: string;
  lessons: string;
  metrics: { label: string; value: string }[];
  accent: "ember" | "aurora";
  status: "shipped" | "exploration" | "collaboration";
  year: string;
}

export interface SkillNode {
  id: string;
  label: string;
  group: "language" | "frontend" | "backend" | "ai" | "data" | "tooling";
  level: number; // 1-5, drives node radius
}

export interface SkillEdge {
  from: string;
  to: string;
  weight: number;
}

export interface Milestone {
  id: string;
  era: string;
  period: string;
  title: string;
  org: string;
  kind: "education" | "certification" | "activity" | "project";
  detail: string;
  metric?: string;
  accent: "ember" | "aurora";
}

export interface NavLink {
  id: string;
  label: string;
  hint: string;
}

export const PROFILE = {
  name: "Shobhith BJ",
  firstName: "Shobhith",
  lastName: "BJ",
  role: "Full-Stack Engineer · AI/ML Builder",
  location: "Bangalore, India",
  email: "shobhith272@gmail.com",
  phone: "+91 8618655878",
  availability: "Open to internships & collaboration",
  github: "https://github.com/",
  githubHandle: "github",
  linkedin: "https://linkedin.com/in/",
  linkedinHandle: "linkedin",
  summary:
    "Full-stack, multi-stack engineering student experienced in building responsive frontend interfaces and RESTful APIs, backed by a strong AI/ML foundation. Fast learner comfortable moving across Python backends, modern JS frontends, and CMS platforms — has independently shipped multiple full projects end to end.",
  philosophy:
    "I build intelligent systems that feel magical. The kind that hide a hundred decisions behind a single, inevitable interaction.",
  signature:
    "Signal over noise. Always ship. Learn in public.",
};

export const HERO_STATS = [
  { value: "4+", label: "Shipped projects" },
  { value: "8.5", label: "CGPA · AI & Data Science" },
  { value: "5", label: "Stacks fluent" },
  { value: "∞", label: "Curiosity" },
];

export const NAV_LINKS: NavLink[] = [
  { id: "overture", label: "Overture", hint: "the entrance" },
  { id: "manifesto", label: "Manifesto", hint: "who & why" },
  { id: "constellation", label: "Constellation", hint: "the skill graph" },
  { id: "trajectory", label: "Trajectory", hint: "the timeline" },
  { id: "builds", label: "Builds", hint: "selected work" },
  { id: "transmit", label: "Transmit", hint: "say hello" },
];

export const SKILL_NODES: SkillNode[] = [
  // Languages
  { id: "python", label: "Python", group: "language", level: 5 },
  { id: "javascript", label: "JavaScript", group: "language", level: 4 },
  { id: "java", label: "Java", group: "language", level: 3 },
  { id: "c", label: "C", group: "language", level: 3 },
  { id: "sql", label: "SQL", group: "language", level: 4 },
  { id: "php", label: "PHP", group: "language", level: 2 },
  // Frontend
  { id: "react", label: "React", group: "frontend", level: 5 },
  { id: "nextjs", label: "Next.js", group: "frontend", level: 4 },
  { id: "typescript", label: "TypeScript", group: "frontend", level: 4 },
  { id: "tailwind", label: "Tailwind", group: "frontend", level: 5 },
  { id: "html", label: "HTML5", group: "frontend", level: 5 },
  { id: "css", label: "CSS3", group: "frontend", level: 5 },
  // Backend
  { id: "django", label: "Django", group: "backend", level: 5 },
  { id: "drf", label: "DRF", group: "backend", level: 4 },
  { id: "flask", label: "Flask", group: "backend", level: 4 },
  { id: "rest", label: "REST APIs", group: "backend", level: 5 },
  // AI / ML
  { id: "ml", label: "Machine Learning", group: "ai", level: 4 },
  { id: "dl", label: "Deep Learning", group: "ai", level: 4 },
  { id: "nlp", label: "NLP", group: "ai", level: 4 },
  { id: "genai", label: "Generative AI", group: "ai", level: 4 },
  { id: "pytorch", label: "PyTorch", group: "ai", level: 3 },
  { id: "sklearn", label: "Scikit-learn", group: "ai", level: 4 },
  // Data
  { id: "pandas", label: "Pandas", group: "data", level: 4 },
  { id: "numpy", label: "NumPy", group: "data", level: 4 },
  { id: "viz", label: "Data Viz", group: "data", level: 4 },
  // Tooling
  { id: "git", label: "Git", group: "tooling", level: 4 },
  { id: "mysql", label: "MySQL", group: "tooling", level: 4 },
  { id: "linux", label: "Linux", group: "tooling", level: 4 },
  { id: "wordpress", label: "WordPress", group: "tooling", level: 3 },
  { id: "webflow", label: "Webflow", group: "tooling", level: 3 },
];

export const SKILL_EDGES: SkillEdge[] = [
  { from: "python", to: "django", weight: 3 },
  { from: "python", to: "flask", weight: 3 },
  { from: "python", to: "pytorch", weight: 3 },
  { from: "python", to: "sklearn", weight: 3 },
  { from: "python", to: "pandas", weight: 3 },
  { from: "python", to: "numpy", weight: 3 },
  { from: "django", to: "drf", weight: 3 },
  { from: "django", to: "rest", weight: 3 },
  { from: "flask", to: "rest", weight: 2 },
  { from: "drf", to: "rest", weight: 3 },
  { from: "javascript", to: "react", weight: 3 },
  { from: "react", to: "nextjs", weight: 3 },
  { from: "react", to: "typescript", weight: 2 },
  { from: "react", to: "tailwind", weight: 2 },
  { from: "typescript", to: "nextjs", weight: 2 },
  { from: "html", to: "css", weight: 3 },
  { from: "css", to: "tailwind", weight: 3 },
  { from: "javascript", to: "typescript", weight: 2 },
  { from: "ml", to: "dl", weight: 3 },
  { from: "dl", to: "pytorch", weight: 3 },
  { from: "ml", to: "sklearn", weight: 3 },
  { from: "ml", to: "nlp", weight: 2 },
  { from: "nlp", to: "genai", weight: 2 },
  { from: "pandas", to: "numpy", weight: 3 },
  { from: "pandas", to: "viz", weight: 2 },
  { from: "sklearn", to: "numpy", weight: 2 },
  { from: "sql", to: "mysql", weight: 3 },
  { from: "git", to: "linux", weight: 1 },
  { from: "java", to: "c", weight: 1 },
  { from: "php", to: "wordpress", weight: 2 },
  { from: "wordpress", to: "webflow", weight: 1 },
  { from: "rest", to: "nlp", weight: 1 },
  { from: "genai", to: "rest", weight: 1 },
];

export const PROJECTS: Project[] = [
  {
    id: "myntra",
    index: "01",
    name: "Myntra-Inspired Fashion Commerce",
    tagline: "A pixel-perfect storefront, engineered like a product.",
    problem:
      "Translating a high-fidelity e-commerce concept into a real, responsive interface — without a design system crutch — is where most clones break down. Carts, flows, and states need to feel inevitable.",
    process:
      "Started from wireframes, decomposed the experience into catalog → product → cart → checkout states, and built each as a self-contained, typed component tree. Iterated on motion and spacing until the surface felt like a shipped product, not a demo.",
    architecture:
      "React 18 + TypeScript component architecture with a typed cart state machine. Tailwind for a token-driven design system. Route-level code-splitting so each flow loads only what it renders.",
    stack: ["React 18", "TypeScript", "Tailwind CSS", "Responsive UI"],
    challenges:
      "Keeping cart state consistent across routes while preserving the snappiness of a single-page feel — solved with a lightweight store and optimistic updates.",
    impact:
      "A portfolio-grade storefront that demonstrates end-to-end frontend craftsmanship: from wireframe to a responsive, animated, fully-typed checkout flow.",
    lessons:
      "Design systems aren't files — they're decisions. The earlier you encode spacing and motion as tokens, the faster the surface becomes coherent.",
    metrics: [
      { label: "Flows", value: "4" },
      { label: "Components", value: "30+" },
      { label: "Type coverage", value: "100%" },
    ],
    accent: "ember",
    status: "shipped",
    year: "2024",
  },
  {
    id: "intel",
    index: "02",
    name: "Competitive Intelligence Automation",
    tagline: "An LLM workflow that turns the open web into a briefing.",
    problem:
      "Business intelligence is buried across Reddit, reviews, job listings, and social platforms. Reading it all by hand is impossible; summarizing it badly is worse.",
    process:
      "Designed an LLM-powered backend workflow that ingests signals from multiple sources via REST APIs, normalizes them, and synthesizes structured intelligence reports. Built the pipeline to be source-agnostic so new feeds plug in as adapters.",
    architecture:
      "Python backend with an adapter pattern for data sources. LLM orchestration layer handles extraction → deduplication → synthesis → structured output. REST surface exposes reports to any frontend.",
    stack: ["Python", "LLM APIs", "REST APIs", "Automation"],
    challenges:
      "Noise. Every source speaks a different dialect. The synthesis layer had to be opinionated about what counts as a signal before the LLM ever sees it.",
    impact:
      "Turns hours of manual research into a generated, structured briefing — a working prototype for automating the analyst's first draft.",
    lessons:
      "LLMs are most powerful when you constrain their input sharply. Garbage in is still garbage out — the filter is the product.",
    metrics: [
      { label: "Sources", value: "4+" },
      { label: "Pipeline", value: "4-stage" },
      { label: "Output", value: "Structured" },
    ],
    accent: "aurora",
    status: "shipped",
    year: "2024",
  },
  {
    id: "triage",
    index: "03",
    name: "Triage — AI Medical Assistant",
    tagline: "Symptom analysis with the discipline of a clinician's first pass.",
    problem:
      "People google symptoms and get chaos. A guided, API-driven assistant can offer preliminary structure — not a diagnosis, but a saner first step.",
    process:
      "Built an AI-powered assistant with an API-driven backend for symptom analysis and preliminary healthcare guidance. Integrated frontend inputs with backend inference logic so the conversation feels continuous.",
    architecture:
      "Python inference backend exposing a REST API. Frontend submits structured symptom inputs; backend returns ranked guidance with confidence and disclaimers. Strict separation between inference and presentation.",
    stack: ["Python", "NLP", "REST APIs", "Inference"],
    challenges:
      "Designing outputs that are useful without overstepping — every response carries explicit scope and disclaimers. Safety is a UX problem, not just a model problem.",
    impact:
      "A working prototype for accessible preliminary guidance — a step toward healthcare that meets people where they are.",
    lessons:
      "In high-stakes domains, the disclaimer isn't a footer — it's part of the product's spine. Design the guardrails before the features.",
    metrics: [
      { label: "Modality", value: "Text" },
      { label: "Scope", value: "Preliminary" },
      { label: "Interface", value: "REST" },
    ],
    accent: "ember",
    status: "shipped",
    year: "2024",
  },
  {
    id: "haptic",
    index: "04",
    name: "Smart Haptic Navigation Belt",
    tagline: "Wearable sensing for blind-deaf independence.",
    problem:
      "For blind-deaf individuals, conventional navigation aids fail. Movement needs to be communicated through the one channel that works: touch.",
    process:
      "Collaborated in a multi-disciplinary team to build a wearable navigation system using sensors and haptic feedback. Translated spatial sensing into directional vibration patterns the body can learn.",
    architecture:
      "Embedded sensor array feeding a microcontroller that maps obstacle/direction data to haptic motor zones around the waist. Firmware handles real-time thresholding and motor orchestration.",
    stack: ["Python", "Sensors", "Embedded", "Haptics"],
    challenges:
      "Mapping a continuous 3D sensing problem onto a discrete ring of motors — and doing it in real time on constrained hardware.",
    impact:
      "A proof-of-concept that gives independent movement a new vocabulary — engineering in service of access, not novelty.",
    lessons:
      "The best hardware interfaces are learned by the body, not the manual. Prototype with humans in the loop from day one.",
    metrics: [
      { label: "Form", value: "Wearable" },
      { label: "Team", value: "Multi-disc" },
      { label: "Channel", value: "Haptic" },
    ],
    accent: "aurora",
    status: "collaboration",
    year: "2024",
  },
];

export const MILESTONES: Milestone[] = [
  {
    id: "bgs",
    era: "Now",
    period: "Aug 2023 — Present",
    title: "B.E. Artificial Intelligence & Data Science",
    org: "BGS College of Engineering and Technology",
    kind: "education",
    detail:
      "Building a foundation across machine learning, deep learning, and full-stack engineering. CGPA 8.5 and climbing.",
    metric: "CGPA 8.5",
    accent: "ember",
  },
  {
    id: "kiro",
    era: "Arena",
    period: "2024",
    title: "Hackathon Participant — Kiro Online",
    org: "Online Hackathon hosted by Kiro",
    kind: "activity",
    detail:
      "Shipped under pressure against the clock. Learned to cut scope ruthlessly and keep the demo story tight.",
    accent: "aurora",
  },
  {
    id: "adhvaya",
    era: "Arena",
    period: "2024",
    title: "Hackathon Participant — Adhvaya",
    org: "BGSCET",
    kind: "activity",
    detail:
      "Collaborated with a team to take an idea from prompt to prototype in a weekend. Practice in shipping in public.",
    accent: "ember",
  },
  {
    id: "jpmc",
    era: "Credential",
    period: "2024",
    title: "Software Engineering Job Simulation",
    org: "JPMorgan Chase",
    kind: "certification",
    detail:
      "Worked through a realistic enterprise engineering workflow — interface fixes, data analysis, and stock-price interfacing.",
    accent: "aurora",
  },
  {
    id: "aws",
    era: "Credential",
    period: "2024",
    title: "Introduction to Generative AI",
    org: "AWS",
    kind: "certification",
    detail:
      "Grounded in the fundamentals of generative models, prompt engineering, and the AWS AI service landscape.",
    accent: "ember",
  },
  {
    id: "ccna",
    era: "Credential",
    period: "2024",
    title: "CCNA — Networks, Routing, Security",
    org: "Cisco",
    kind: "certification",
    detail:
      "Introduction to Networks, Switching/Routing/Wireless Essentials, and Enterprise Networking & Security.",
    accent: "aurora",
  },
  {
    id: "pu",
    era: "Origin",
    period: "2021 — 2023",
    title: "PCMB — Pre-University",
    org: "Chaitanya PU College",
    kind: "education",
    detail:
      "Physics, Chemistry, Mathematics, Biology. The quantitative backbone before engineering began.",
    metric: "89.7%",
    accent: "ember",
  },
];

export const SKILL_GROUPS = [
  { id: "language", label: "Languages", accent: "ember" as const },
  { id: "frontend", label: "Frontend", accent: "aurora" as const },
  { id: "backend", label: "Backend & APIs", accent: "ember" as const },
  { id: "ai", label: "AI / ML", accent: "aurora" as const },
  { id: "data", label: "Data", accent: "ember" as const },
  { id: "tooling", label: "Tooling", accent: "aurora" as const },
] as const;
