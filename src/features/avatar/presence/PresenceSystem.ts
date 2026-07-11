import type { AnimationClip } from "three";

import { ExpressionManager } from "../expression";
import { FaceShape, type FaceRig, type FaceWeights, type Gaze } from "../face";
import { createAnimator } from "../services/animation/createAnimator";
import type { AvatarAnimator, AvatarFrame, AvatarRig } from "../types";
import { EyeTargetController } from "./EyeTargetController";
import { HeadTargetController } from "./HeadTargetController";
import { PresenceAnimator } from "./PresenceAnimator";
import { VisitorFocus } from "./VisitorFocus";
import { STATE_PRESENCE } from "./presenceState";
import { presenceDebug } from "./presenceDebug";

/**
 * The single per-frame driver that makes the avatar feel alive. It composes:
 *   - a body animator (GLB clips, or procedural lean + arm),
 *   - the expression system (facial blend shapes, crossfaded),
 *   - eye behaviour (gaze + natural blinking),
 *   - head behaviour (look direction + thinking tilt + micro-motion + nod),
 *   - presence (breathing / weight shift for procedural bodies).
 *
 * It reads the runtime through the AvatarFrame the caller supplies (never
 * touching runtime contracts) and honours dev overrides via `presenceDebug`.
 * Gaze direction precedence: debug override > explicit VisitorFocus > runtime.
 */
export class PresenceSystem {
  private readonly expression = new ExpressionManager();
  private readonly eyes = new EyeTargetController();
  private readonly head = new HeadTargetController();
  private readonly presence = new PresenceAnimator();
  private readonly focus = new VisitorFocus();
  private readonly bodyAnimator: AvatarAnimator;
  private readonly hasClips: boolean;

  constructor(
    private readonly rig: AvatarRig,
    private readonly faceRig: FaceRig,
    clips: AnimationClip[],
  ) {
    this.bodyAnimator = createAnimator(rig, clips);
    this.hasClips = clips.length > 0;
  }

  /** The focus manager, so callers can register/aim additional targets. */
  getFocus(): VisitorFocus {
    return this.focus;
  }

  update(frame: AvatarFrame): void {
    const presence = STATE_PRESENCE[frame.state];

    // Expression: honour a dev override, else follow the runtime expression.
    if (presenceDebug.expressionOverride) {
      this.expression.setOverride(presenceDebug.expressionOverride);
    } else {
      this.expression.setOverride(null);
      this.expression.setExpression(frame.expression);
    }
    this.expression.update(frame.deltaSec);

    // Gaze base: debug > explicit focus > runtime look direction.
    const runtimeGaze: Gaze = { x: frame.head.x, y: frame.head.y };
    const baseGaze = presenceDebug.gazeOverride ?? this.focus.getActiveDirection() ?? runtimeGaze;
    const baseHead = presenceDebug.headOverride ?? baseGaze;

    // Body: clips play themselves; the procedural body gets lean/arm + presence.
    this.bodyAnimator.update(this.rig, frame);
    if (!this.hasClips) this.presence.update(this.rig.root, presence, frame);

    // Head (skipped-to-additive when clips already pose it).
    if (this.rig.head) {
      this.head.update(this.rig.head, baseHead, presence, frame, this.hasClips);
    }

    // Eyes → gaze + blink, merged with the expression weights for one write.
    const { gaze, blink } = this.eyes.update(baseGaze, presence, frame.deltaSec);
    const weights: FaceWeights = { ...this.expression.getWeights(), [FaceShape.Blink]: blink };
    this.faceRig.apply(weights, gaze);
  }

  dispose(): void {
    this.bodyAnimator.dispose();
  }
}
