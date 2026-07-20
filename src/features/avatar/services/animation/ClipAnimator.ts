import { type AnimationAction, type AnimationClip, AnimationMixer } from "three";

import type { AvatarState } from "@/features/digital-twin";

import { ANIMATION_CONFIG } from "../../constants";
import type { AvatarAnimator, AvatarFrame, AvatarRig } from "../../types";

/**
 * Plays a GLB model's own animation clips, crossfading between them as the
 * runtime state changes. Which clip a state wants is the AnimationController's
 * decision (semantic mapping + per-avatar overrides) — this class receives a
 * resolver and activates the first candidate that exists on the model.
 * Vendor-neutral: any rig carrying clips animates through this unchanged.
 */
export class ClipAnimator implements AvatarAnimator {
  private readonly mixer: AnimationMixer;
  private readonly actions = new Map<string, AnimationAction>();
  private current: AnimationAction | null = null;
  private currentState: AvatarState | null = null;

  constructor(
    root: AvatarRig["root"],
    clips: AnimationClip[],
    private readonly resolveCandidates: (state: AvatarState) => readonly string[],
  ) {
    this.mixer = new AnimationMixer(root);
    for (const clip of clips) {
      this.actions.set(clip.name, this.mixer.clipAction(clip));
    }
  }

  update(_rig: AvatarRig, frame: AvatarFrame): void {
    if (frame.state !== this.currentState) {
      this.currentState = frame.state;
      this.crossfadeTo(frame.state);
    }
    this.mixer.update(frame.deltaSec);
  }

  private crossfadeTo(state: AvatarState): void {
    const next = this.resolveAction(state);
    if (!next || next === this.current) return;

    next.reset().fadeIn(ANIMATION_CONFIG.clipFadeSeconds).play();
    this.current?.fadeOut(ANIMATION_CONFIG.clipFadeSeconds);
    this.current = next;
  }

  private resolveAction(state: AvatarState): AnimationAction | null {
    for (const name of this.resolveCandidates(state)) {
      const action = this.actions.get(name);
      if (action) return action;
    }
    return null;
  }

  dispose(): void {
    this.mixer.stopAllAction();
    this.actions.clear();
  }
}
