import type { AnimationClip } from "three";

import type { AvatarState } from "@/features/digital-twin";

import { ANIMATION_CLIP_CANDIDATES, STATE_ANIMATION } from "../constants";
import { ClipAnimator } from "../services/animation/ClipAnimator";
import { ProceduralAnimator } from "../services/animation/ProceduralAnimator";
import {
  AnimationName,
  type AvatarAnimator,
  type AvatarFrame,
  type AvatarRig,
  type AvatarSource,
} from "../types";

/**
 * The state-driven animation layer. Owns the two decisions the body needs:
 * which animator drives this rig (clips when the model carries them, else
 * procedural), and which semantic animation each runtime state wants — with
 * the avatar's registry clipOverrides consulted before the shared candidate
 * table. Callers only ever hand it a frame; the vendor-specific clip world
 * never leaks past this point.
 */
export class AnimationController {
  private readonly animator: AvatarAnimator;
  private readonly clipDriven: boolean;
  private currentAnimation: AnimationName = AnimationName.Idle;

  constructor(rig: AvatarRig, clips: AnimationClip[], source?: AvatarSource) {
    this.clipDriven = clips.length > 0;
    this.animator = this.clipDriven
      ? new ClipAnimator(rig.root, clips, (state) => this.resolveCandidates(state, source))
      : new ProceduralAnimator();
  }

  /** Whether the model plays its own clips (procedural presence then backs off). */
  isClipDriven(): boolean {
    return this.clipDriven;
  }

  /** The semantic animation currently requested — for dev tooling. */
  getCurrentAnimation(): AnimationName {
    return this.currentAnimation;
  }

  update(rig: AvatarRig, frame: AvatarFrame): void {
    this.currentAnimation = STATE_ANIMATION[frame.state];
    this.animator.update(rig, frame);
  }

  dispose(): void {
    this.animator.dispose();
  }

  private resolveCandidates(state: AvatarState, source?: AvatarSource): readonly string[] {
    const name = STATE_ANIMATION[state];
    const overrides = source?.clipOverrides?.[name];
    const defaults = ANIMATION_CLIP_CANDIDATES[name];
    return overrides ? [...overrides, ...defaults] : defaults;
  }
}
