import type { AnimationClip } from "three";

import { EyeTargetAdapter, HeadTrackingAdapter } from "../adapters";
import { ExpressionManager } from "../expression";
import { FaceShape, type FaceRig, type FaceWeights, type Gaze } from "../face";
import { AnimationController } from "../managers/AnimationController";
import type { AvatarFrame, AvatarRig, AvatarSource, RigMetadata } from "../types";
import { EyeTargetController } from "./EyeTargetController";
import { PresenceAnimator } from "./PresenceAnimator";
import { STATE_PRESENCE } from "./presenceState";
import { avatarStatus } from "./avatarStatus";
import { presenceDebug } from "./presenceDebug";

export interface PresenceSystemOptions {
  /** What the RigAdapter learned about this model. */
  metadata?: RigMetadata;
  /** The registry definition, for per-avatar animation overrides. */
  source?: AvatarSource;
}

/**
 * The single per-frame driver that makes the avatar feel alive. It composes:
 *   - the AnimationController (state-driven body animation, clips or procedural),
 *   - the expression system (facial blend shapes, crossfaded),
 *   - eye behaviour (gaze + natural blinking) with named focus targets,
 *   - head behaviour via the HeadTrackingAdapter (subtle movements only),
 *   - presence (breathing / weight shift for procedural bodies).
 *
 * It reads the runtime through the AvatarFrame the caller supplies (never
 * touching runtime contracts), honours dev overrides via `presenceDebug`, and
 * reports a live status snapshot for the dev panel via `avatarStatus`.
 * Gaze direction precedence: debug override > explicit focus target > runtime.
 */
export class PresenceSystem {
  private readonly expression = new ExpressionManager();
  private readonly eyes = new EyeTargetController();
  private readonly eyeTargets = new EyeTargetAdapter();
  private readonly head = new HeadTrackingAdapter();
  private readonly presence = new PresenceAnimator();
  private readonly animation: AnimationController;
  private readonly metadata: RigMetadata | null;

  constructor(
    private readonly rig: AvatarRig,
    private readonly faceRig: FaceRig,
    clips: AnimationClip[],
    options: PresenceSystemOptions = {},
  ) {
    this.animation = new AnimationController(rig, clips, options.source);
    this.metadata = options.metadata ?? null;
  }

  /** Named eye-focus targets, so the room can register/aim world positions. */
  getEyeTargets(): EyeTargetAdapter {
    return this.eyeTargets;
  }

  update(frame: AvatarFrame): void {
    const presence = STATE_PRESENCE[frame.state];

    // Expression: honour a dev override, else follow the runtime expression.
    const activeExpression = presenceDebug.expressionOverride ?? frame.expression;
    if (presenceDebug.expressionOverride) {
      this.expression.setOverride(presenceDebug.expressionOverride);
    } else {
      this.expression.setOverride(null);
      this.expression.setExpression(frame.expression);
    }
    this.expression.update(frame.deltaSec);

    // Gaze base: debug > explicit focus target > runtime look direction.
    const runtimeGaze: Gaze = { x: frame.head.x, y: frame.head.y };
    const baseGaze =
      presenceDebug.gazeOverride ?? this.eyeTargets.getActiveDirection() ?? runtimeGaze;
    const baseHead = presenceDebug.headOverride ?? baseGaze;

    // Body: clips play themselves; the procedural body gets lean/arm + presence.
    const clipDriven = this.animation.isClipDriven();
    this.animation.update(this.rig, frame);
    if (!clipDriven) this.presence.update(this.rig.root, presence, frame);

    // Head (dropped-to-additive when clips already pose it).
    if (this.rig.head) {
      this.head.update(this.rig.head, baseHead, presence, frame, clipDriven);
    }

    // Eyes → gaze + blink, merged with the expression weights for one write.
    const { gaze, blink } = this.eyes.update(baseGaze, presence, frame.deltaSec);
    const weights: FaceWeights = { ...this.expression.getWeights(), [FaceShape.Blink]: blink };
    this.faceRig.apply(weights, gaze);

    // Dev readout — cheap string snapshot; the channel dedupes notifications.
    avatarStatus.report({
      state: frame.state,
      animation: this.animation.getCurrentAnimation(),
      expression: activeExpression,
      focus: this.eyeTargets.getActiveName() ?? "ambient",
      avatarType: this.metadata?.type ?? "procedural",
    });
  }

  dispose(): void {
    this.animation.dispose();
  }
}
