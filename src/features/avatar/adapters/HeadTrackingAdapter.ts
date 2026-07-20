import type { Object3D } from "three";

import type { Gaze } from "../face";
import { HeadTargetController } from "../presence/HeadTargetController";
import type { StatePresence } from "../presence/presenceState";
import type { AvatarFrame } from "../types";

/**
 * Hard ceiling on how far the head will turn toward a gaze target. Deliberate:
 * a real person moves their eyes further than their head, and past this the
 * neck pose reads uncanny on every rig we drive.
 */
const MAX_DEFLECTION = 0.8;

const clamp = (value: number) => Math.min(MAX_DEFLECTION, Math.max(-MAX_DEFLECTION, value));

/**
 * The head-motion surface the presence system drives — subtle movements only.
 * Wraps HeadTargetController (easing, micro-motion, thinking tilt, greeting
 * nod) behind a deflection clamp, so no caller — runtime gaze, focus target,
 * or debug override — can command an unnatural head turn.
 */
export class HeadTrackingAdapter {
  private readonly controller = new HeadTargetController();

  update(
    head: Object3D,
    base: Gaze,
    presence: StatePresence,
    frame: AvatarFrame,
    additive: boolean,
  ): void {
    this.controller.update(head, { x: clamp(base.x), y: clamp(base.y) }, presence, frame, additive);
  }
}
