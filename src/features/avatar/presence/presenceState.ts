import { AvatarState } from "@/features/digital-twin";

/**
 * Behavioural modifiers per runtime state — the single source of truth for how
 * a state *feels*, layered on top of the gaze direction the runtime already
 * supplies (via its eye/head targets). Expression comes from the runtime
 * expression; this map only shapes eye/head/body liveliness.
 */
export interface StatePresence {
  /** Eye restlessness: 0 = steady gaze, 1 = glancing around often. */
  wander: number;
  /** Multiplier on the base blink rate. */
  blinkScale: number;
  /** Head micro-motion amplitude. */
  headEnergy: number;
  /** Breathing / weight-shift amplitude. */
  bodyEnergy: number;
  /** Head roll (the "thinking" tilt), radians. */
  tilt: number;
}

export const STATE_PRESENCE: Record<AvatarState, StatePresence> = {
  [AvatarState.Idle]: { wander: 0.7, blinkScale: 1, headEnergy: 1, bodyEnergy: 1, tilt: 0 },
  [AvatarState.Working]: { wander: 0.25, blinkScale: 0.8, headEnergy: 0.6, bodyEnergy: 0.7, tilt: 0.02 },
  [AvatarState.LookingAtScreen]: { wander: 0.2, blinkScale: 0.9, headEnergy: 0.6, bodyEnergy: 0.8, tilt: 0 },
  [AvatarState.LookingAtVisitor]: { wander: 0.15, blinkScale: 1, headEnergy: 0.8, bodyEnergy: 0.9, tilt: 0 },
  [AvatarState.Listening]: { wander: 0.1, blinkScale: 1.15, headEnergy: 0.9, bodyEnergy: 1, tilt: -0.03 },
  [AvatarState.Thinking]: { wander: 0.55, blinkScale: 0.7, headEnergy: 0.7, bodyEnergy: 0.8, tilt: 0.16 },
  [AvatarState.Speaking]: { wander: 0.2, blinkScale: 1, headEnergy: 1.4, bodyEnergy: 1.2, tilt: 0 },
  [AvatarState.Gesturing]: { wander: 0.2, blinkScale: 1, headEnergy: 1.2, bodyEnergy: 1.1, tilt: 0 },
  [AvatarState.Smiling]: { wander: 0.25, blinkScale: 1.1, headEnergy: 0.9, bodyEnergy: 1, tilt: -0.02 },
  [AvatarState.Error]: { wander: 0.4, blinkScale: 0.9, headEnergy: 0.5, bodyEnergy: 0.6, tilt: 0.04 },
};

export const PRESENCE_CONFIG = {
  blink: {
    minIntervalSec: 2.2,
    maxIntervalSec: 6,
    durationSec: 0.13,
    doubleBlinkChance: 0.18,
  },
  saccade: {
    minIntervalSec: 0.9,
    maxIntervalSec: 3.2,
    /** Max pupil offset (normalized) of a glance. */
    amplitude: 0.5,
    smoothing: 0.14,
  },
  head: {
    yawGain: 0.5,
    pitchGain: 0.6,
    /** Micro-motion amplitude (radians) and speeds. */
    microAmplitude: 0.02,
    smoothing: 0.09,
    /** Greeting nod amplitude + speed. */
    nodAmplitude: 0.12,
    nodSpeed: 4,
  },
  body: {
    breatheAmplitude: 0.012,
    breatheSpeed: 1.5,
    weightShiftAmplitude: 0.02,
    weightShiftPeriodSec: 9,
    swayAmplitude: 0.01,
  },
} as const;
