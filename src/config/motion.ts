export type Cubic = [number, number, number, number];

export const EASING = {
  standard: [0.4, 0, 0.2, 1] as Cubic,
  emphasized: [0.2, 0, 0, 1] as Cubic,
  entrance: [0, 0, 0.2, 1] as Cubic,
  exit: [0.4, 0, 1, 1] as Cubic,
} as const;

export const DURATION = {
  fast: 0.2,
  base: 0.4,
  slow: 0.6,
  sceneFade: 0.8,
} as const;
