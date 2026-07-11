import { AvatarGesture } from "@/features/digital-twin";
import { lerp } from "@/lib/math/vector";

import { ANIMATION_CONFIG, AVATAR_STATE_POSE } from "../../constants";
import type { AvatarAnimator, AvatarFrame, AvatarRig } from "../../types";

/**
 * Body animator for the procedural fallback figure: eases the state's postural
 * lean and drives a gesture wave on the right arm. Head, face, eyes, breathing
 * and weight-shift are owned by the PresenceSystem's dedicated controllers, so
 * this stays focused on gross body pose. A clip-carrying model uses ClipAnimator
 * instead.
 */
export class ProceduralAnimator implements AvatarAnimator {
  private lean = 0;
  private armAngle: number = ANIMATION_CONFIG.armRestAngle;

  update(rig: AvatarRig, frame: AvatarFrame): void {
    const pose = AVATAR_STATE_POSE[frame.state];
    const s = ANIMATION_CONFIG.postureSmoothing;

    // Ease the postural lean (rotation.x); presence owns position/roll of root.
    this.lean = lerp(this.lean, pose.lean, s);
    rig.root.rotation.x = this.lean;

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
