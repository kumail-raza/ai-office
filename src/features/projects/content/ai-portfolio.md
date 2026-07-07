---
title: AI Portfolio
slug: ai-portfolio
summary: This interactive AI digital-twin portfolio.
role: Designer & Engineer
company: Personal Project
startDate: "2026-01"
endDate: Present
status: in-progress
technologies: [Next.js, TypeScript, Framer Motion, GSAP, Zustand]
businessImpact: A differentiated, memorable candidate experience — visitors meet an AI digital twin instead of reading a static resume.
images: ["/assets/images/loader/portal-glow.png|AI boot sequence"]
links: ["Live Site|#", "Source|#"]
---

## Overview

Rather than another list-of-projects portfolio, this is a single continuous
experience: a landing scene, a door interaction, a cinematic AI boot loader,
and an office where an AI digital twin greets visitors and can hold a real,
grounded conversation about the work behind it — including itself.

## Architecture

### Scene State Machine

The whole journey — landing, loader, office — is a single Zustand-driven state
machine rather than routes, so transitions can be choreographed precisely.

```typescript
export const useAppStore = create<AppState>((set) => ({
  scene: "landing",
  goToLoader: () => set({ scene: "loader" }),
  goToOffice: () => set({ scene: "office" }),
}));
```

### Retrieval-Grounded Conversation

The assistant answers from markdown knowledge via BM25 retrieval and a
provider-independent prompt assembler, not a hardcoded script — swapping the
underlying model requires no changes to retrieval or UI.

## Challenges

- Making cinematic, timeline-driven animation feel intentional rather than gratuitous
- Keeping the AI's answers grounded in real content instead of inventing facts
- Coordinating GSAP timelines, Framer Motion, and raw rAF camera work without fighting each other

## Solutions

- Centralized every timing value in per-scene config so the sequence reads as one script, not scattered magic numbers
- Built a small BM25 retrieval engine over markdown, with citations returned internally, so answers are traceable to source documents
- Gave each animation system a clear domain — GSAP for cinematic timelines, Framer Motion for UI, rAF for camera/physics-like work

## Lessons Learned

- A state machine for scenes is far easier to reason about than ad hoc boolean flags
- Provider-independent architecture (retrieval, prompting, model) pays off the moment you want to swap a piece
- Reduced-motion support is much easier to get right when it's designed in from the first animation, not retrofitted
