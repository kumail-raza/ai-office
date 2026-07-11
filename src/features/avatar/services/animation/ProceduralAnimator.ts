import { AvatarGesture } from "@/features/digital-twin";
import { lerp } from "@/lib/math/vector";

import { ANIMATION_CONFIG, AVATAR_STATE_POSE } from "../../constants";
import type { AvatarAnimator, AvatarFrame, AvatarRig } from "../../types";

/**
 * Hand-animates the procedural fallback figure from runtime state — no clips.
 * Breathing and a state-driven posture (lean, head tilt, speaking bob) plus a
 * gesture-driven wave, all eased so transitions read smoothly. This is the
 * animator that renders today; a clip-capable model swaps in ClipAnimator with
 * no other changes.
 */
export class ProceduralAnimator implements AvatarAnimator {
  private lean = 0;
  private headTilt = 0;
  private armAngle: number = ANIMATION_CONFIG.armRestAngle;
  private baseRootY: number | null = null;

  update(rig: AvatarRig, frame: AvatarFrame): void {
    const pose = AVATAR_STATE_POSE[frame.state];
    const s = ANIMATION_CONFIG.postureSmoothing;

    if (this.baseRootY === null) this.baseRootY = rig.root.position.y;

    // Ease posture toward the state's target so state changes don't snap.
    this.lean = lerp(this.lean, pose.lean, s);
    this.headTilt = lerp(this.headTilt, pose.headTilt, s);

    // Body: lean + breathing rise + optional speaking bob.
    const breathe = Math.sin(frame.elapsedSec * 1.6) * pose.breatheAmplitude;
    const bob = pose.bobAmplitude > 0 ? Math.sin(frame.elapsedSec * pose.bobSpeed) * pose.bobAmplitude : 0;
    rig.root.rotation.x = this.lean;
    rig.root.position.y = this.baseRootY + breathe + bob;

    // Head: yaw/pitch from the look-at direction + the thinking tilt.
    if (rig.head) {
      rig.head.rotation.y = frame.head.x * ANIMATION_CONFIG.headYawGain;
      rig.head.rotation.x = -frame.head.y * ANIMATION_CONFIG.headPitchGain;
      rig.head.rotation.z = this.headTilt;
    }

    // Right arm: raise + oscillate on a wave/greeting gesture, else rest.
    if (rig.armRight) {
      const waving = frame.gesture === AvatarGesture.Wave || frame.gesture === AvatarGesture.Greeting;
      const target = waving
        ? ANIMATION_CONFIG.armWaveAngle +
          Math.sin(frame.elapsedSec * ANIMATION_CONFIG.waveSpeed) * ANIMATION_CONFIG.waveAmplitude
        : ANIMATION_CONFIG.armRestAngle;
      this.armAngle = lerp(this.armAngle, target, s);
      rig.armRight.rotation.z = this.armAngle;
    }
  }

  dispose(): void {
    // Nothing to release — the animator holds no GPU resources.
  }
}
