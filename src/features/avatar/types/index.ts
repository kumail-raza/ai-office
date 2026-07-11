import type { AnimationClip, Group, Object3D } from "three";

import type { AvatarExpression, AvatarGesture, AvatarState } from "@/features/digital-twin";
import type { Vector3 } from "@/lib/math/vector";

/** A 3-tuple position in three.js world space. */
export type ScenePosition = [x: number, y: number, z: number];

/** Where and how the avatar sits in the room. No coordinates live in components. */
export interface AvatarPlacement {
  position: ScenePosition;
  rotationY: number;
  scale: number;
}

/** A loadable avatar model definition. The registry is the only path owner. */
export interface AvatarSource {
  id: string;
  /** Public URL of the .glb/.gltf file. */
  url: string;
  /** Whether the file is expected to exist in /public today. */
  shipped: boolean;
}

/** A parsed model: its scene graph plus any animation clips it carried. */
export interface LoadedAvatar {
  scene: Group;
  animations: AnimationClip[];
}

/**
 * The minimal skeletal surface an animator drives, decoupled from the model
 * source. A procedural figure, a Ready Player Me / Mixamo GLB, or a MetaHuman
 * export all expose the same rig, so animators are swappable per asset with no
 * vendor lock-in.
 */
export interface AvatarRig {
  /** Whole-body transform (breathing, lean, bob). */
  root: Object3D;
  /** Head transform (tilt, yaw/pitch), or null if the model has no head node. */
  head: Object3D | null;
  /** Right upper-arm transform for waves/gestures, or null. */
  armRight: Object3D | null;
}

/** Per-frame runtime snapshot the adapter hands to the animator. */
export interface AvatarFrame {
  state: AvatarState;
  expression: AvatarExpression;
  gesture: AvatarGesture;
  /** Interpolated head look-at direction from HeadTrackingController. */
  head: Vector3;
  elapsedSec: number;
  deltaSec: number;
}

/**
 * Drives an AvatarRig from per-frame runtime state. The abstraction that keeps
 * the office avatar-source-agnostic: `ProceduralAnimator` animates the fallback
 * figure by hand; `ClipAnimator` plays GLB animation clips (Mixamo / RPM /
 * custom) through an AnimationMixer — future MetaHuman/other rigs add a new
 * implementation without touching callers.
 */
export interface AvatarAnimator {
  update(rig: AvatarRig, frame: AvatarFrame): void;
  dispose(): void;
}
