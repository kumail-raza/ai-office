import type { Vector3 } from "@/lib/math/vector";

export type { Vector3 } from "@/lib/math/vector";

export enum AvatarState {
  Idle = "idle",
  Working = "working",
  LookingAtScreen = "looking-at-screen",
  LookingAtVisitor = "looking-at-visitor",
  Listening = "listening",
  Thinking = "thinking",
  Speaking = "speaking",
  Gesturing = "gesturing",
  Smiling = "smiling",
  Error = "error",
}

export enum AvatarExpression {
  Neutral = "neutral",
  Happy = "happy",
  Focused = "focused",
  Thinking = "thinking",
  Listening = "listening",
  Speaking = "speaking",
  Greeting = "greeting",
}

export enum AvatarGesture {
  Wave = "wave",
  Point = "point",
  Typing = "typing",
  Thinking = "thinking",
  Greeting = "greeting",
  Idle = "idle",
}

export enum EyeTarget {
  Monitor = "monitor",
  Visitor = "visitor",
  Window = "window",
  OfficeObject = "office-object",
  Camera = "camera",
  None = "none",
}

/** A weighted expression, so facial rigs can blend between shapes. */
export interface ExpressionBlend {
  expression: AvatarExpression;
  weight: number;
}

/* ---- Lip sync contracts (provider-independent; no implementation yet) ---- */

export interface Phoneme {
  symbol: string;
  startMs: number;
  endMs: number;
}

export interface Viseme {
  id: string;
  weight: number;
  timeMs: number;
}

export interface SpeechTiming {
  totalMs: number;
  phonemes: Phoneme[];
  visemes: Viseme[];
}

/** Discrete, render-cheap snapshot exposed to React via useAvatar. */
export interface AvatarSnapshot {
  state: AvatarState;
  expression: AvatarExpression;
  expressionBlend: ExpressionBlend[];
  eyeTarget: EyeTarget;
  gesture: AvatarGesture;
}

/**
 * A registered subsystem (expression, eyes, head, gesture, lip sync). Reacts to
 * state transitions and, optionally, advances continuous interpolation each
 * frame via `update`.
 */
export interface AvatarController {
  readonly id: string;
  onStateChange(state: AvatarState): void;
  update?(deltaMs: number): void;
}

export type { Vector3 as AvatarVector3 };
