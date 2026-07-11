import { TARGET_POSITIONS } from "../../constants";
import { AvatarExpression, AvatarState, EyeTarget } from "../../types";

/**
 * Presentational tuning for the 2D avatar. Kept separate from the runtime so a
 * future 3D view (R3F / Ready Player Me / MetaHuman) can supply its own visual
 * mapping while consuming the exact same state/expression/gesture/eye-target
 * props — no runtime API changes required.
 */

export interface StateVisual {
  /** Accent used for the aura ring + status dot. */
  accent: string;
  /** How strongly the aura pulses (0 = calm, 1 = active). */
  energy: number;
  /** Human-readable label. */
  label: string;
}

export const STATE_VISUAL: Record<AvatarState, StateVisual> = {
  [AvatarState.Idle]: { accent: "#7c8aa5", energy: 0.15, label: "Idle" },
  [AvatarState.Working]: { accent: "#5b8def", energy: 0.4, label: "Working" },
  [AvatarState.LookingAtScreen]: { accent: "#5b8def", energy: 0.3, label: "Looking at screen" },
  [AvatarState.LookingAtVisitor]: { accent: "#4fb286", energy: 0.35, label: "Looking at visitor" },
  [AvatarState.Listening]: { accent: "#4f9df0", energy: 0.7, label: "Listening" },
  [AvatarState.Thinking]: { accent: "#e0a24a", energy: 0.6, label: "Thinking" },
  [AvatarState.Speaking]: { accent: "#3fb6a8", energy: 0.9, label: "Speaking" },
  [AvatarState.Gesturing]: { accent: "#4fb286", energy: 0.6, label: "Gesturing" },
  [AvatarState.Smiling]: { accent: "#4fb286", energy: 0.4, label: "Smiling" },
  [AvatarState.Error]: { accent: "#e0685b", energy: 0.5, label: "Error" },
};

/** Mouth shape per expression (SVG path in the 120×120 face viewBox). */
export const EXPRESSION_MOUTH: Record<AvatarExpression, string> = {
  [AvatarExpression.Neutral]: "M50 82 Q60 86 70 82",
  [AvatarExpression.Happy]: "M48 80 Q60 92 72 80",
  [AvatarExpression.Focused]: "M51 83 L69 83",
  [AvatarExpression.Thinking]: "M52 84 Q58 82 64 84",
  [AvatarExpression.Listening]: "M50 82 Q60 87 70 82",
  [AvatarExpression.Speaking]: "M50 80 Q60 90 70 80",
  [AvatarExpression.Greeting]: "M47 79 Q60 94 73 79",
};

/** Eyebrow vertical offset + tilt (deg) per expression. */
export const EXPRESSION_BROW: Record<AvatarExpression, { y: number; tilt: number }> = {
  [AvatarExpression.Neutral]: { y: 0, tilt: 0 },
  [AvatarExpression.Happy]: { y: -1.5, tilt: 0 },
  [AvatarExpression.Focused]: { y: 2, tilt: 6 },
  [AvatarExpression.Thinking]: { y: -2, tilt: -8 },
  [AvatarExpression.Listening]: { y: -1, tilt: 0 },
  [AvatarExpression.Speaking]: { y: -0.5, tilt: 0 },
  [AvatarExpression.Greeting]: { y: -2, tilt: 0 },
};

/**
 * Pupil offset (in face px) for a given eye target, derived from the shared
 * normalized look-at positions so the 2D eyes and a future 3D head agree.
 */
export function eyeOffset(target: EyeTarget): { x: number; y: number } {
  const p = TARGET_POSITIONS[target];
  const RANGE = 4.5;
  // SVG y grows downward, so invert the world-space y.
  return { x: p.x * RANGE, y: -p.y * RANGE };
}

export const EYE_TARGET_LABEL: Record<EyeTarget, string> = {
  [EyeTarget.Monitor]: "Monitor",
  [EyeTarget.Visitor]: "Visitor",
  [EyeTarget.Window]: "Window",
  [EyeTarget.OfficeObject]: "Office object",
  [EyeTarget.Camera]: "Camera",
  [EyeTarget.None]: "—",
};
