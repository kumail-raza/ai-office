import type { QuickAction } from "../types";

export const QUICK_ACTIONS: QuickAction[] = [
  { id: "hire", label: "Hire Me", prompt: "I'd like to hire you. What's your availability and how do we start?" },
  { id: "projects", label: "View Projects", prompt: "Show me your best projects." },
  { id: "architecture", label: "Architecture Consultation", prompt: "I need an architecture consultation." },
  { id: "cloud", label: "Cloud Migration", prompt: "Help me plan a cloud migration." },
  { id: "ai", label: "AI Solutions", prompt: "What AI solutions do you build?" },
  { id: "exploring", label: "Just Exploring", prompt: "I'm just exploring your work." },
];

/**
 * Quick-action prompts shown in the conversation panel. Replies are no longer
 * hardcoded here — they are produced by the knowledge-retrieval API route.
 */
export const PromptService = {
  quickActions: QUICK_ACTIONS,
};
