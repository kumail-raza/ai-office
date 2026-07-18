export type Cubic = [number, number, number, number];

/**
 * Motion easings, mirrored 1:1 with the CSS `--ease-*` design tokens in
 * globals.css so JS (Framer Motion / GSAP) and CSS transitions feel identical.
 */
export const EASING = {
  standard: [0.4, 0, 0.2, 1] as Cubic,
  emphasized: [0.2, 0, 0, 1] as Cubic,
  /** Soft, confident settle — the signature entrance curve. */
  entrance: [0.16, 1, 0.3, 1] as Cubic,
  exit: [0.4, 0, 1, 1] as Cubic,
} as const;

/** Durations (seconds), mirrored with the CSS `--duration-*` tokens. */
export const DURATION = {
  fast: 0.18,
  base: 0.32,
  slow: 0.6,
  sceneFade: 0.8,
} as const;
