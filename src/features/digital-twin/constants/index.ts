import type { Vector3 } from "@/lib/math/vector";

import { AvatarExpression, AvatarGesture, AvatarState, EyeTarget } from "../types";

/** State → resting facial expression. */
export const STATE_EXPRESSION: Record<AvatarState, AvatarExpression> = {
  [AvatarState.Idle]: AvatarExpression.Neutral,
  [AvatarState.Working]: AvatarExpression.Focused,
  [AvatarState.LookingAtScreen]: AvatarExpression.Focused,
  [AvatarState.LookingAtVisitor]: AvatarExpression.Happy,
  [AvatarState.Listening]: AvatarExpression.Listening,
  [AvatarState.Thinking]: AvatarExpression.Thinking,
  [AvatarState.Speaking]: AvatarExpression.Speaking,
  [AvatarState.Gesturing]: AvatarExpression.Happy,
  [AvatarState.Smiling]: AvatarExpression.Happy,
  [AvatarState.Error]: AvatarExpression.Neutral,
};

/** State → where the eyes rest. */
export const STATE_EYE_TARGET: Record<AvatarState, EyeTarget> = {
  [AvatarState.Idle]: EyeTarget.Monitor,
  [AvatarState.Working]: EyeTarget.Monitor,
  [AvatarState.LookingAtScreen]: EyeTarget.Monitor,
  [AvatarState.LookingAtVisitor]: EyeTarget.Visitor,
  [AvatarState.Listening]: EyeTarget.Visitor,
  [AvatarState.Thinking]: EyeTarget.Window,
  [AvatarState.Speaking]: EyeTarget.Visitor,
  [AvatarState.Gesturing]: EyeTarget.Visitor,
  [AvatarState.Smiling]: EyeTarget.Visitor,
  [AvatarState.Error]: EyeTarget.Monitor,
};

/** Nominal look-at positions (normalized, 3D-ready) per eye/head target. */
export const TARGET_POSITIONS: Record<EyeTarget, Vector3> = {
  [EyeTarget.Monitor]: { x: -0.2, y: -0.05, z: 1 },
  [EyeTarget.Visitor]: { x: 0, y: 0, z: 1 },
  [EyeTarget.Window]: { x: -0.6, y: 0.15, z: 0.8 },
  [EyeTarget.OfficeObject]: { x: 0.4, y: -0.1, z: 0.9 },
  [EyeTarget.Camera]: { x: 0, y: 0, z: 1 },
  [EyeTarget.None]: { x: 0, y: 0, z: 1 },
};

/** Continuous gesture implied by a state (explicit gestures use playGesture). */
export const STATE_GESTURE: Partial<Record<AvatarState, AvatarGesture>> = {
  [AvatarState.Working]: AvatarGesture.Typing,
  [AvatarState.Thinking]: AvatarGesture.Thinking,
  [AvatarState.Idle]: AvatarGesture.Idle,
};

export const RUNTIME_CONFIG = {
  /** Per-frame interpolation smoothing for eyes/head (0–1; higher = snappier). */
  eyeSmoothing: 0.18,
  headSmoothing: 0.12,
  defaultGestureMs: 1600,
} as const;
