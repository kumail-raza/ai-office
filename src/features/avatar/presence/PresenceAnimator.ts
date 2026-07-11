import type { Object3D } from "three";

import type { AvatarFrame } from "../types";
import { PRESENCE_CONFIG, type StatePresence } from "./presenceState";

/**
 * Keeps the body alive so the avatar never reads as frozen: continuous
 * breathing, a slow weight shift from one side to the other, and a faint sway.
 * Operates on the model root; captured rest offsets keep it grounded. Used only
 * for the procedural body — clip-driven models breathe via their own idle clip.
 */
export class PresenceAnimator {
  private baseY: number | null = null;
  private baseX: number | null = null;

  update(root: Object3D, presence: StatePresence, frame: AvatarFrame): void {
    if (this.baseY === null) this.baseY = root.position.y;
    if (this.baseX === null) this.baseX = root.position.x;

    const cfg = PRESENCE_CONFIG.body;
    const t = frame.elapsedSec;
    const energy = presence.bodyEnergy;

    // Breathing — a small vertical rise/fall.
    const breathe = Math.sin(t * cfg.breatheSpeed) * cfg.breatheAmplitude * energy;

    // Weight shift — very slow lateral lean from foot to foot.
    const shiftPhase = (t / cfg.weightShiftPeriodSec) * Math.PI * 2;
    const shift = Math.sin(shiftPhase) * cfg.weightShiftAmplitude * energy;
    const sway = Math.sin(shiftPhase) * cfg.swayAmplitude * energy;

    root.position.y = this.baseY + breathe;
    root.position.x = this.baseX + shift;
    root.rotation.z = sway;
  }
}
