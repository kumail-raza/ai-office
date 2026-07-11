import { avatarManager } from "@/features/digital-twin";

import type { AvatarFrame } from "../types";

/**
 * Read-only bridge between the Digital Twin Runtime and the 3D avatar. It reads
 * the AvatarManager snapshot (state / expression / gesture) and the
 * HeadTrackingController's interpolated orientation each frame, then packages
 * them as an AvatarFrame for the animator.
 *
 * Strictly a consumer — it never calls setState or mutates a controller, so the
 * runtime contracts (AvatarManager, ExpressionController, GestureController,
 * EyeTrackingController, HeadTrackingController) are untouched. The
 * PresenceManager already drives the AvatarManager via the existing
 * PresenceBridge, so presence flows through here for free.
 */
export class AvatarRuntimeAdapter {
  private elapsedSec = 0;

  /** Sample the runtime for this frame. `deltaSec` is the frame delta. */
  sample(deltaSec: number): AvatarFrame {
    this.elapsedSec += deltaSec;

    const snapshot = avatarManager.getSnapshot();
    const head = avatarManager.head.getOrientation();

    return {
      state: snapshot.state,
      expression: snapshot.expression,
      gesture: snapshot.gesture,
      head,
      elapsedSec: this.elapsedSec,
      deltaSec,
    };
  }
}
