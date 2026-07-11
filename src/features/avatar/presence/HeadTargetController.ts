import type { Object3D } from "three";

import { AvatarGesture } from "@/features/digital-twin";
import { lerp } from "@/lib/math/vector";

import type { Gaze } from "../face";
import type { AvatarFrame } from "../types";
import { PRESENCE_CONFIG, type StatePresence } from "./presenceState";

/**
 * Subtle, believable head motion. Aims the head along the runtime/override look
 * direction (yaw/pitch), eases in the state's thinking-tilt, layers in
 * low-amplitude idle micro-motion so the head is never perfectly still, and
 * nods on a greeting. All eased; all small.
 */
export class HeadTargetController {
  private yaw = 0;
  private pitch = 0;
  private roll = 0;

  /**
   * @param head       the head node to drive
   * @param base       look direction (runtime or focus override)
   * @param presence   the active state's presence modifiers
   * @param frame      runtime frame (gesture, elapsed time)
   * @param additive   true when body clips already pose the head — then only a
   *                   gentle micro-nod is layered on rather than a full look.
   */
  update(
    head: Object3D,
    base: Gaze,
    presence: StatePresence,
    frame: AvatarFrame,
    additive: boolean,
  ): void {
    const cfg = PRESENCE_CONFIG.head;
    const t = frame.elapsedSec;

    // Idle micro-motion — tiny Perlin-ish drift from summed sines.
    const microYaw = Math.sin(t * 0.7) * cfg.microAmplitude * presence.headEnergy;
    const microPitch = Math.sin(t * 0.9 + 1.3) * cfg.microAmplitude * 0.6 * presence.headEnergy;

    // Greeting / wave nod.
    const nodding = frame.gesture === AvatarGesture.Greeting || frame.gesture === AvatarGesture.Wave;
    const nod = nodding ? Math.sin(t * cfg.nodSpeed) * cfg.nodAmplitude : 0;

    const targetYaw = additive ? microYaw : base.x * cfg.yawGain + microYaw;
    const targetPitch = additive ? microPitch + nod : -base.y * cfg.pitchGain + microPitch + nod;
    const targetRoll = additive ? 0 : presence.tilt;

    const alpha = 1 - (1 - cfg.smoothing) ** (frame.deltaSec / (1 / 60));
    this.yaw = lerp(this.yaw, targetYaw, alpha);
    this.pitch = lerp(this.pitch, targetPitch, alpha);
    this.roll = lerp(this.roll, targetRoll, alpha);

    head.rotation.set(this.pitch, this.yaw, this.roll);
  }
}
