# PROJECT BIBLE — Kumail.dev AI Digital Twin Portfolio

This document is the single source of truth for the project. When in doubt about
intent, structure, or direction, this file wins. Keep it current — update it in
the same PR as any change that alters vision, architecture, or conventions.

---

## Vision

Kumail.dev is not a portfolio site — it's an interactive AI-powered digital
office. A visitor doesn't read pages; they walk up to a door, are greeted by
Kumail's AI digital twin, and have a real conversation grounded in his actual
background. The experience should feel closer to entering a game or a
cinematic product demo than browsing a résumé. Every screen exists to build
trust and curiosity, and every interaction should feel considered, not
templated.

The digital twin is the product: a persistent character, seated in a warm,
believable workspace, who can talk about Kumail's projects, architecture
philosophy, and availability — backed by a real retrieval layer, not
hardcoded scripts.

---

## User Journey

```
Landing Page
  → Enter Name
  → Door Interaction
  → AI Loader
  → Workspace
  → Greeting
  → Conversation
  → Interactive Office        (planned — v0.6)
  → Recruiter Mode            (planned — v0.7)
```

- **Landing Page** — glass profile card, visitor name capture, the Smart Door.
- **Enter Name** — validated (trimmed, min 2 chars), stored in app state only.
- **Door Interaction** — Continue triggers a glowing-arrow → unlock → open
  sequence; the door is the sole gate into the experience.
- **AI Loader** — a cinematic "AI operating system" boot: logo, boot text,
  progress, particles. Not a spinner — a moment.
- **Workspace** — camera enters the office; lights, avatar, and desk resolve.
- **Greeting** — the avatar stops what it's doing, makes eye contact, and
  speaks a personalized welcome.
- **Conversation** — a ChatGPT-style panel opens once the greeting completes;
  the avatar remains visible throughout.
- **Interactive Office / Recruiter Mode** — future phases (see Roadmap).

The journey is linear and stateful (a Zustand-driven scene machine), never
route-driven. There is no back button because there is no "page" to go back to.

---

## Core Principles

- **Experience over pages** — the site is one continuous scene, not a set of
  routes to browse.
- **Storytelling over navigation** — the flow reveals itself in sequence; the
  user is guided, not given a menu.
- **AI-first interactions** — the conversation is the primary way visitors get
  information, not a bolted-on chatbot.
- **Modular architecture** — scenes, features, and engine systems are
  independently replaceable (a placeholder office can become a Three.js scene
  without touching state or conversation logic).
- **Accessibility** — reduced motion is respected everywhere motion exists;
  interactive elements are keyboard-operable and labeled.
- **Performance** — 60fps target for animation, lean bundles (e.g. syntax
  highlighting loads only registered languages, not the full Prism set).
- **Mobile support** — every scene has a stacked/compact layout; nothing
  scrolls or clips destructively.

---

## Architecture Overview

**App Router** (`src/app/`) — Next.js entry point. `page.tsx` mounts the
`AssetPreloader` around the `SceneManager`. Route handlers under `app/api/`
(e.g. `api/chat`) are the only server boundary the client talks to.

**Scenes** (`src/scenes/`) — the stateful, full-viewport experience steps:
`LandingScene`, `TransitionScene`, `LoaderScene`, `OfficeScene`,
`ConversationScene`, orchestrated by `SceneManager`, which reads the active
scene from the app store and cross-fades between them. Each scene owns its own
`components/`, `hooks/`, `animations/`, and `styles/` — nothing bleeds across
scene boundaries.

**Features** (`src/features/`) — reusable, self-contained product features
that scenes compose: `landing` (profile card, visitor panel, smart door,
door-arrow), `conversation` (chat panel, message list, quick actions, services
layer). A feature owns its `components/`, `hooks/`, `config/`, `constants/`,
`services/`, and `context/` as needed — it does not reach into a scene's
internals.

**Engine** (`src/engine/`) — framework-agnostic systems that scenes and
features call into: `managers/` (`AssetManager`, `AudioManager`,
`CameraManager`, `CameraTransitionManager`, `SceneManager` core) plus seams for
`animation/`, `avatar/`, `camera/`, `events/`, `lighting/`, `particles/`,
`physics/`. Managers are plain TypeScript classes/singletons — no React — so
they can be swapped or driven from a future 3D renderer without a rewrite.

**Knowledge Layer** (`src/knowledge/`) — the retrieval-augmented brain behind
the conversation. Markdown documents are the source of truth; the layer loads,
indexes, retrieves, and assembles prompts, entirely provider-independent (see
**Knowledge Brain** below).

**Providers** (`src/providers/`, `src/features/*/context/`) — React context
boundaries. `ConversationProvider` is the canonical example: it owns
conversation state and exposes `useConversation()`, keeping business logic out
of the UI components that consume it.

**UI Components** (`src/components/`) — generic, reusable primitives shared
across scenes/features: `ui/` (`GlassPanel`, `AssetPreloader`,
`AssetLoadingProgress`), `layout/` (`FullscreenLayout`). If a component is only
ever used by one scene, it belongs in that scene's `components/`, not here.

---

## Folder Conventions

| Folder | Purpose |
| --- | --- |
| `src/app/` | Next.js App Router — pages, layout, API routes. Thin; no business logic. |
| `src/scenes/` | Full-viewport experience steps. Each has its own `components/`, `hooks/`, `animations/`, `styles/`. |
| `src/features/` | Self-contained, reusable product features composed by scenes. |
| `src/engine/` | Framework-agnostic managers and systems (asset, audio, camera, scene). No React. |
| `src/knowledge/` | Markdown knowledge base + retrieval engine (loader, index, retriever, prompt assembler, contracts). |
| `src/services/` | Cross-cutting service adapters, e.g. `services/ai` (the active `LLMProvider`). |
| `src/components/` | Generic, reusable UI primitives shared across the app. |
| `src/stores/` | Zustand stores (`app.store` is the scene/door/visitor state machine). |
| `src/config/` | Design tokens and tunables as plain TS (`colors`, `theme`, `motion`, `timings`, `zIndex`, `routes`). |
| `src/hooks/` | App-wide reusable hooks (e.g. `useAnimationFrame`, `useAssetProgress`). |
| `src/types/` | Shared TypeScript types not owned by a specific feature. |
| `public/assets/` | Static media referenced by URL: images, video, audio, lottie — placeholders until real assets land. |
| `knowledge/` (root, legacy) | Superseded by `src/knowledge/` — retained only until fully retired. |
| `docs/` | Numbered architecture/product docs plus `docs/reports/` sprint reports. |

Folders present in the tree but not yet populated (`src/ai`, `src/animations`,
`src/core`, `src/design-system`, `src/lib`, `src/providers`, `src/styles`,
`src/utils`, several `src/features/*` like `avatar`, `door`, `loader`, `office`,
`portfolio`, `admin`, `analytics`) are reserved scaffolding from the initial
architecture pass. Populate them only when a concrete need arises — do not fill
them speculatively.

---

## Design System

**Typography** — system font stack (`system-ui, -apple-system, "Segoe UI",
sans-serif`); no custom webfont loaded yet. Headings are bold and compact;
body copy favors short lines and generous line-height (1.4–1.55) for
readability inside glass panels.

**Spacing** — a fixed scale defined once in `globals.css` custom properties
(`--space-1` through `--space-8`, 0.25rem–4rem) and mirrored in
`src/config/theme.ts` for non-CSS consumers. Components consume the scale, not
literal rem values.

**Glassmorphism** — the signature surface treatment (`GlassPanel`): translucent
white background, subtle border, soft shadow, `backdrop-filter: blur`. Applied
to the profile card, visitor panel, greeting bubble, and conversation panel so
every floating surface reads as one consistent material.

**Animation philosophy** — see **Animation Principles** below.

**Color principles** — a warm, light theme centered on a blue-gray palette for
chrome (`--color-bg`, `--color-text-*`, `--color-surface`) and warm cream/wood
tones for the office environment. Color tokens are centralized in
`globals.css` and `src/config/colors.ts`; components reference variables, not
hardcoded hex values.

---

## Animation Principles

- **Smooth** — eased, never linear-feeling; standard/emphasized/entrance/exit
  curves are centralized in `src/config/motion.ts`.
- **Intentional** — every animation communicates a state change (door
  unlocking, avatar noticing the visitor, message streaming in). Decoration
  without meaning is avoided.
- **Never distracting** — ambient loops (breathing, particles, glow) stay
  subtle in amplitude and speed; they support focus, they don't compete for it.
- **Cinematic transitions** — scene changes are directed moments (fade to
  black, camera walk-in, avatar entrance beats), not instant cuts.
- **Realistic motion** — physical plausibility over flashy easing: a door
  swings on its hinge, a camera "walks" with subtle sway, an avatar's head
  turns before it speaks.
- Reduced-motion is a first-class path, not an afterthought: every scene with
  motion checks `prefers-reduced-motion` and substitutes a direct cut.
- Library choice is deliberate per concern: **Framer Motion** for UI and
  React-driven animation, **GSAP** for cinematic timelines (avatar entrance,
  greeting sequencing), raw **requestAnimationFrame** for camera/physics-style
  work that must stay outside React's render cycle.

---

## Knowledge Brain

The conversation is grounded in markdown, not hardcoded strings or a single
giant prompt. The engine lives entirely in `src/knowledge/` and is
provider-independent — nothing in this layer imports OpenAI, Claude, or any
model SDK.

- **`KnowledgeLoader`** — walks `src/knowledge/**/*.md`, parses YAML-style
  frontmatter (`title`, `category`, `tags`, `summary`), extracts markdown
  headings, and tokenizes content (with title/tag/heading terms weighted above
  body text) into a `KnowledgeDocument`.
- **`KnowledgeIndex`** — builds a BM25-ready index (inverse document
  frequencies + average document length) from the loaded documents. Pure and
  deterministic.
- **`KnowledgeRetriever`** — accepts a user question, tokenizes and stems it,
  scores every document with BM25, and returns the top-K matches with score and
  snippet. Lexical today; the shape is ready for a semantic swap.
- **`KnowledgeProvider`** — the facade: loads, indexes, and retrieves behind
  one small surface. Caches the index in production; rebuilds it on every call
  in development, so editing a markdown file hot-reloads the next answer with
  no restart.
- **`PromptAssembler`** — combines the system prompt, retrieved knowledge,
  conversation history, and the latest user message into one neutral
  `AssembledPrompt`. Model adapters translate this shape into their own
  request format.
- **Contracts** (`src/knowledge/contracts/`) — `EmbeddingProvider`,
  `VectorStore`, `LLMProvider`: interfaces only, intentionally unimplemented.
  They exist so semantic search and a real model can be added later without
  touching retrieval, prompting, or the UI.

**Markdown structure** — one topic per file, organized by category folder:

```
src/knowledge/
├── about/            # who Kumail is
├── experience/        # resume, timeline
├── projects/          # one file per project
├── skills/
├── services/
├── architecture/       # aws, kubernetes, devops, ...
├── certifications/
├── faq/
└── personality/
```

Every file carries frontmatter:

```markdown
---
title: AWS Architecture
category: architecture
tags: [aws, cloud, serverless, migration]
summary: One-line summary used for retrieval context.
---

# Heading

Body content in plain markdown.
```

Adding knowledge means adding or editing a markdown file — never touching
application code.

---

## Future Roadmap

| Version | Milestone |
| --- | --- |
| v0.6 | Interactive Office — clickable objects (whiteboard, monitor, plants) with contextual detail |
| v0.7 | Recruiter Mode — a guided, outcome-oriented path for hiring managers |
| v0.8 | Voice + Lip Sync — spoken responses synced to avatar mouth movement |
| v0.9 | Production Polish — real assets, performance pass, cross-browser QA |
| v1.0 | Launch |

---

## Coding Standards

- **TypeScript** everywhere; strict mode on.
- **No `any`** — if a type is genuinely unknown, model it explicitly or narrow it.
- **Reusable components** — a component used by more than one consumer moves up
  to `src/components/`; a component specific to one scene/feature stays local.
- **Separation of concerns** — business logic lives in services/hooks/context,
  never inline in JSX. UI components render state and call callbacks; they
  don't fetch, stream, or own timelines directly.
- **Accessibility** — semantic elements, `aria-label`/`aria-live` where state
  changes matter, keyboard operability for anything clickable, reduced-motion
  fallbacks.
- **Testing readiness** — pure functions (tokenizers, scorers, formatters) are
  written and located so they're trivially unit-testable, independent of React
  and the DOM.

---

## Definition of Done

Every feature must be:

- **Responsive** — verified at mobile, tablet, and desktop widths.
- **Typed** — no `any`, no implicit `unknown` left unhandled.
- **Accessible** — keyboard and screen-reader reasonable at minimum.
- **Free of console warnings** — a clean console is a merge requirement, not a
  nice-to-have.
- **Free of duplicated code** — shared logic is extracted, not copy-pasted.
- **Reviewed before merge** — a second pass (self- or peer-review) happens
  before work lands on `main`.

---

## Phase History

| Phase | Summary |
| --- | --- |
| Architecture Foundation (v0.1.0) | Repo scaffold, folder structure, tooling, config files. |
| Sprint 2.1 | Landing scene skeleton — placeholder components, App Router default route. |
| Sprint 2.1.1 | Landing architecture refinement — CSS Modules, `landing.config.ts`, feature subfolders. |
| Sprint 2.2 | Real landing UI — glass profile card, visitor panel, smart door placement, responsive layout. |
| GlassPanel | Extracted the reusable glassmorphism component from the landing sprint. |
| Phase 2.2 | Asset loading system — `AssetManager`, Suspense integration, progress UI, lazy secondary assets. |
| Fullscreen & Loader Polish | Removed page scroll, `FullscreenLayout`, cinematic boot sequence, theme tokens. |
| Sprint — Smart Door | Full door interaction: name validation, glowing arrow, unlock, hinge-swing open, Zustand state machine. |
| Sprint 2.4 | Loader → office transition — `CameraTransitionManager`, `useAnimationFrame`, rAF camera walk, `TransitionState` enum. |
| Phase 3 | AI Digital Twin workspace — CSS office environment, animated SVG avatar (GSAP idle + entrance), greeting sequence, interaction panel. |
| Phase 4 | Conversational AI experience — chat panel, markdown + syntax-highlighted code, streaming, quick actions, `ConversationProvider`. |
| Phase 5 (Knowledge Brain) — v0.5 | Retrieval-augmented knowledge layer: `src/knowledge/` engine, BM25 retrieval, prompt assembly, provider-independent contracts. |

---

## Future Ideas

- Recruiter-specific conversation shortcuts (e.g. a one-click "summarize fit
  for this role" flow).
- Session memory across visits (returning-visitor recognition).
- Real avatar assets — replace the SVG placeholder with a rigged, animated
  character or a 3D twin (Three.js / React Three Fiber, already anticipated by
  the `CameraRig` seam).
- Ambient office soundscape and real voice playback once audio assets exist.
- Analytics on which quick actions and topics visitors engage with most.
- A lightweight CMS or authoring UI over the `src/knowledge/` markdown so
  non-technical edits don't require a code change.
- Multi-language support for the conversation and UI copy.
- A "behind the scenes" mode that narrates the architecture of the site itself
  as a live demo of Kumail's work.
