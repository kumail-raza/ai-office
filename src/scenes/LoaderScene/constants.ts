/** Explicit loader lifecycle — no magic booleans. */
export type LoaderPhase = "idle" | "booting" | "loading" | "ready" | "completed";

/** All tunable values for the loader live here (seconds unless noted). */
export const LOADER_CONFIG = {
  /** Total time the loader runs before it begins exiting. */
  BOOT_DURATION: 7,
  /** Time each loading line stays before fading to the next. */
  MESSAGE_INTERVAL: 0.9,
  /** Fade duration for entrances/exits. */
  TRANSITION_DURATION: 0.8,
  /** Per-character speed of the boot line typing effect. */
  TYPING_SPEED: 0.045,
  /** Delay before the visitor welcome fades in. */
  WELCOME_DELAY: 2,
  /** Number of floating background particles. */
  PARTICLE_COUNT: 28,
  /** Number of segments in the progress indicator. */
  PROGRESS_SEGMENTS: 14,
} as const;

/** Typed first, before the loading lines cycle. */
export const BOOT_MESSAGE = "Initializing Kumail AI...";

/** Cycled one at a time after the boot line finishes typing. */
export const LOADING_MESSAGES = [
  "Loading Personality...",
  "Loading Memory...",
  "Loading Workspace...",
  "Loading Voice...",
  "Connecting Intelligence...",
  "Preparing Experience...",
] as const;
