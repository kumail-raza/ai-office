import { lerpVector, type Vector3, vectorEquals } from "@/lib/math/vector";

import { RUNTIME_CONFIG, STATE_EYE_TARGET, TARGET_POSITIONS } from "../constants";
import { type AvatarController, type AvatarState, EyeTarget } from "../types";

/**
 * Tracks where the eyes look. The target is discrete (drives React); the
 * position interpolates smoothly each frame and is read imperatively — the seam
 * a future 3D rig / camera-target system reads without triggering React
 * re-renders per frame.
 */
export class EyeTrackingController implements AvatarController {
  readonly id = "eyes";

  private target: EyeTarget = EyeTarget.Monitor;
  private desired: Vector3 = TARGET_POSITIONS[EyeTarget.Monitor];
  private position: Vector3 = TARGET_POSITIONS[EyeTarget.Monitor];
  private smoothing: number = RUNTIME_CONFIG.eyeSmoothing;

  constructor(private readonly onChange: () => void) {}

  onStateChange(state: AvatarState): void {
    this.lookAt(STATE_EYE_TARGET[state]);
  }

  lookAt(target: EyeTarget): void {
    if (target === this.target) return;
    this.target = target;
    this.desired = TARGET_POSITIONS[target];
    this.onChange();
  }

  /** Aim at an explicit position (e.g. a future moving camera target). */
  setTargetPosition(position: Vector3): void {
    this.target = EyeTarget.Camera;
    this.desired = position;
    this.onChange();
  }

  setSmoothing(smoothing: number): void {
    this.smoothing = Math.min(1, Math.max(0, smoothing));
  }

  update(): void {
    if (vectorEquals(this.position, this.desired)) return;
    this.position = lerpVector(this.position, this.desired, this.smoothing);
  }

  getTarget(): EyeTarget {
    return this.target;
  }

  getPosition(): Vector3 {
    return this.position;
  }
}
