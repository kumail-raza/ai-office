import { AvatarState } from "@/features/digital-twin";

import { AnimationName } from "../types";

/**
 * Procedural posture per avatar state. All angles are radians; amplitudes are
 * world units. Consumed only by the ProceduralAnimator (the fallback figure);
 * clip-driven models ignore these and play their own animations.
 */
export interface StatePose {
  /** Forward lean of the whole body (rot X). Positive = lean toward visitor. */
  lean: number;
  /** Head roll (rot Z) — the "thinking" tilt. */
  headTilt: number;
  /** Vertical bob amplitude (e.g. speaking emphasis). */
  bobAmplitude: number;
  /** Bob cycles per second. */
  bobSpeed: number;
  /** Breathing amplitude (chest rise). */
  breatheAmplitude: number;
}

export const AVATAR_STATE_POSE: Record<AvatarState, StatePose> = {
  [AvatarState.Idle]: { lean: 0, headTilt: 0, bobAmplitude: 0, bobSpeed: 0, breatheAmplitude: 0.012 },
  [AvatarState.Working]: { lean: 0.14, headTilt: 0.02, bobAmplitude: 0, bobSpeed: 0, breatheAmplitude: 0.01 },
  [AvatarState.LookingAtScreen]: { lean: 0.1, headTilt: 0, bobAmplitude: 0, bobSpeed: 0, breatheAmplitude: 0.01 },
  [AvatarState.LookingAtVisitor]: { lean: 0, headTilt: 0, bobAmplitude: 0, bobSpeed: 0, breatheAmplitude: 0.013 },
  [AvatarState.Listening]: { lean: 0.08, headTilt: -0.03, bobAmplitude: 0, bobSpeed: 0, breatheAmplitude: 0.016 },
  [AvatarState.Thinking]: { lean: -0.02, headTilt: 0.16, bobAmplitude: 0, bobSpeed: 0, breatheAmplitude: 0.012 },
  [AvatarState.Speaking]: { lean: 0.03, headTilt: 0, bobAmplitude: 0.02, bobSpeed: 2.6, breatheAmplitude: 0.014 },
  [AvatarState.Gesturing]: { lean: 0.02, headTilt: 0, bobAmplitude: 0.012, bobSpeed: 1.8, breatheAmplitude: 0.013 },
  [AvatarState.Smiling]: { lean: 0, headTilt: -0.02, bobAmplitude: 0, bobSpeed: 0, breatheAmplitude: 0.014 },
  [AvatarState.Error]: { lean: -0.06, headTilt: 0.05, bobAmplitude: 0, bobSpeed: 0, breatheAmplitude: 0.008 },
};

export const ANIMATION_CONFIG = {
  /** How fast posture eases toward its target (0–1 per 60fps frame). */
  postureSmoothing: 0.12,
  /** Head yaw/pitch gain applied to the look-at direction. */
  headYawGain: 0.5,
  headPitchGain: 0.6,
  /** Resting (arm-down) and raised (wave) angles for the right arm, radians. */
  armRestAngle: 0.05,
  armWaveAngle: -2.3,
  /** Wave oscillation speed and amplitude. */
  waveSpeed: 9,
  waveAmplitude: 0.35,
  /** Clip-animator crossfade duration (seconds). */
  clipFadeSeconds: 0.35,
} as const;

/**
 * Runtime state → the semantic animation the body should play. Many states
 * share one animation deliberately — the difference between, say, Working and
 * LookingAtScreen is carried by presence (lean, gaze, expression), not by a
 * separate body clip. Walking has no state yet; it's the locomotion seam.
 */
export const STATE_ANIMATION: Record<AvatarState, AnimationName> = {
  [AvatarState.Idle]: AnimationName.Idle,
  [AvatarState.Working]: AnimationName.Idle,
  [AvatarState.LookingAtScreen]: AnimationName.Idle,
  [AvatarState.LookingAtVisitor]: AnimationName.Idle,
  [AvatarState.Listening]: AnimationName.Listening,
  [AvatarState.Thinking]: AnimationName.Thinking,
  [AvatarState.Speaking]: AnimationName.Speaking,
  [AvatarState.Gesturing]: AnimationName.Greeting,
  [AvatarState.Smiling]: AnimationName.Idle,
  [AvatarState.Error]: AnimationName.Idle,
};

/**
 * Candidate clip names per semantic animation, tried in order. Covers common
 * Mixamo / Ready Player Me naming so a dropped-in rig animates with no code
 * changes; the first clip that exists wins, else the model holds its pose.
 * Idle tails give every animation a graceful floor on single-clip models.
 * Per-avatar oddities go in the registry's clipOverrides, not here.
 */
export const ANIMATION_CLIP_CANDIDATES: Record<AnimationName, string[]> = {
  [AnimationName.Idle]: ["Idle", "idle", "Breathing Idle", "Standing Idle", "Armature|Idle"],
  [AnimationName.Greeting]: ["Waving", "Wave", "Greeting", "Gesture", "Idle"],
  [AnimationName.Listening]: ["Listening", "Standing Idle", "Idle"],
  [AnimationName.Thinking]: ["Thinking", "Idle"],
  [AnimationName.Speaking]: ["Talking", "Speaking", "Idle"],
  [AnimationName.Walking]: ["Walking", "Walk"],
};
