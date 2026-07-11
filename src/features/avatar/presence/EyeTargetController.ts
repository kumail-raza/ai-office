import { lerp } from "@/lib/math/vector";

import type { Gaze } from "../face";
import { PRESENCE_CONFIG, type StatePresence } from "./presenceState";
import { presenceDebug } from "./presenceDebug";

function randRange(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

/**
 * Human eye behaviour: keeps a smoothly-eased gaze on the runtime's look
 * direction, glances away now and then (saccades scaled by the state's
 * restlessness), and blinks on a randomized schedule with the occasional double
 * blink. The randomness is bounded and eased so it reads alive, never robotic.
 */
export class EyeTargetController {
  private gaze: Gaze = { x: 0, y: 0 };
  private saccade: Gaze = { x: 0, y: 0 };
  private saccadeTimer = randRange(0.5, 1.5);

  private blink = 0;
  private blinkTimer = randRange(1, 3);
  private blinkElapsed = 0;
  private blinking = false;
  private queuedDoubleBlink = false;

  /**
   * Advance eye state for this frame. `base` is the runtime/override gaze
   * direction the eyes rest on. Returns the pupil gaze offset + blink weight.
   */
  update(base: Gaze, presence: StatePresence, deltaSec: number): { gaze: Gaze; blink: number } {
    this.updateSaccade(presence, deltaSec);
    this.updateBlink(presence, deltaSec);

    // Ease toward base + current saccade offset (clamped to a sane range).
    const targetX = clamp(base.x + this.saccade.x, -1, 1);
    const targetY = clamp(base.y + this.saccade.y, -1, 1);
    const alpha = 1 - (1 - PRESENCE_CONFIG.saccade.smoothing) ** (deltaSec / (1 / 60));
    this.gaze.x = lerp(this.gaze.x, targetX, alpha);
    this.gaze.y = lerp(this.gaze.y, targetY, alpha);

    return { gaze: this.gaze, blink: this.blink };
  }

  private updateSaccade(presence: StatePresence, deltaSec: number): void {
    this.saccadeTimer -= deltaSec;
    if (this.saccadeTimer > 0) return;

    const { minIntervalSec, maxIntervalSec, amplitude } = PRESENCE_CONFIG.saccade;
    const reach = amplitude * presence.wander;
    this.saccade = {
      x: randRange(-reach, reach),
      y: randRange(-reach * 0.6, reach * 0.6),
    };
    // Restless states glance more frequently.
    const scale = 1 - presence.wander * 0.5;
    this.saccadeTimer = randRange(minIntervalSec, maxIntervalSec) * scale;
  }

  private updateBlink(presence: StatePresence, deltaSec: number): void {
    if (presenceDebug.consumeBlink()) this.startBlink();

    if (this.blinking) {
      this.blinkElapsed += deltaSec;
      const t = this.blinkElapsed / PRESENCE_CONFIG.blink.durationSec;
      if (t >= 1) {
        this.blink = 0;
        this.blinking = false;
        if (this.queuedDoubleBlink) {
          this.queuedDoubleBlink = false;
          this.startBlink();
        }
      } else {
        // Smooth close-then-open over the blink duration.
        this.blink = Math.sin(t * Math.PI);
      }
      return;
    }

    this.blinkTimer -= deltaSec;
    if (this.blinkTimer <= 0) {
      this.startBlink();
      this.queuedDoubleBlink = Math.random() < PRESENCE_CONFIG.blink.doubleBlinkChance;
      const { minIntervalSec, maxIntervalSec } = PRESENCE_CONFIG.blink;
      this.blinkTimer = randRange(minIntervalSec, maxIntervalSec) / Math.max(0.1, presence.blinkScale);
    }
  }

  private startBlink(): void {
    this.blinking = true;
    this.blinkElapsed = 0;
  }
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
