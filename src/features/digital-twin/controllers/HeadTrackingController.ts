import { FORWARD_VECTOR, lerpVector, type Vector3, vectorEquals } from "@/lib/math/vector";

import { RUNTIME_CONFIG, STATE_EYE_TARGET, TARGET_POSITIONS } from "../constants";
import { type AvatarController, type AvatarState, EyeTarget } from "../types";

/**
 * Head orientation controller. Provides lookAt / returnToNeutral / trackTarget
 * over a smoothly interpolated orientation — the seam future skeletal rigs bind
 * to. Orientation is imperative (per-frame), not React state.
 */
export class HeadTrackingController implements AvatarController {
  readonly id = "head";

  private tracking: EyeTarget | null = EyeTarget.Monitor;
  private desired: Vector3 = TARGET_POSITIONS[EyeTarget.Monitor];
  private orientation: Vector3 = TARGET_POSITIONS[EyeTarget.Monitor];

  constructor(private readonly onChange: () => void) {}

  onStateChange(state: AvatarState): void {
    this.lookAt(STATE_EYE_TARGET[state]);
  }

  lookAt(target: EyeTarget): void {
    this.tracking = target;
    this.desired = TARGET_POSITIONS[target];
    this.onChange();
  }

  /** Continuously follow a target (kept aimed even if its position updates). */
  trackTarget(target: EyeTarget, position?: Vector3): void {
    this.tracking = target;
    this.desired = position ?? TARGET_POSITIONS[target];
    this.onChange();
  }

  returnToNeutral(): void {
    this.tracking = null;
    this.desired = FORWARD_VECTOR;
    this.onChange();
  }

  update(): void {
    if (vectorEquals(this.orientation, this.desired)) return;
    this.orientation = lerpVector(this.orientation, this.desired, RUNTIME_CONFIG.headSmoothing);
  }

  getOrientation(): Vector3 {
    return this.orientation;
  }

  getTracking(): EyeTarget | null {
    return this.tracking;
  }
}
