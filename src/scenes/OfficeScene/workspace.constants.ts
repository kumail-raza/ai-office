/** Explicit workspace lifecycle — no magic strings. */
export enum WorkspacePhase {
  ENTERING = "entering", // fading in from black
  IDLE = "idle", // avatar typing, looking at the monitor
  ENTRANCE = "entrance", // stop typing → turn → eye contact → smile → wait
  GREETING = "greeting", // speaking the greeting
  INTERACTIVE = "interactive", // conversation panel available
}

/** Configurable workspace timings (seconds). */
export const WORKSPACE_TIMING = {
  fadeIn: 0.5,
  idleHold: 1.4,
  turnHead: 0.8,
  smile: 0.45,
  preSpeakWait: 0.4,
  greetingLineStagger: 0.85,
  panelDelay: 0.3,
} as const;

/**
 * Greeting spoken on entrance. `{name}` is replaced with the visitor's name
 * (or a neutral fallback). Revealed one line at a time.
 */
export const GREETING_LINES = [
  "Hello {name}.",
  "Welcome to my workspace.",
  "I'm Kumail.",
  "It's great to meet you.",
  "Whether you're here to hire me,",
  "collaborate,",
  "or simply explore my work,",
  "I'm here to help.",
  "How can I assist you today?",
] as const;

export function buildGreeting(name: string): string[] {
  const safeName = name.trim().length > 0 ? name.trim() : "there";
  return GREETING_LINES.map((line) => line.replace("{name}", safeName));
}
