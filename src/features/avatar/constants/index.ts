import { AvatarState } from "@/features/digital-twin";

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
 * Candidate clip names per state for GLB-driven avatars, tried in order. Covers
 * common Mixamo / Ready Player Me naming so a dropped-in rig animates with no
 * code changes; the first clip that exists wins, else the model holds its pose.
 */
export const STATE_CLIP_CANDIDATES: Record<AvatarState, string[]> = {
  [AvatarState.Idle]: ["Idle", "idle", "Breathing Idle", "Armature|Idle"],
  [AvatarState.Working]: ["Typing", "Working", "Idle"],
  [AvatarState.LookingAtScreen]: ["Idle", "Looking"],
  [AvatarState.LookingAtVisitor]: ["Idle", "Standing"],
  [AvatarState.Listening]: ["Listening", "Idle", "Standing Idle"],
  [AvatarState.Thinking]: ["Thinking", "Idle"],
  [AvatarState.Speaking]: ["Talking", "Speaking", "Idle"],
  [AvatarState.Gesturing]: ["Waving", "Wave", "Gesture", "Idle"],
  [AvatarState.Smiling]: ["Idle", "Happy"],
  [AvatarState.Error]: ["Idle"],
};
