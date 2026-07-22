import { AvatarState } from "@/features/digital-twin";

import { FocusTargetName } from "../adapters";
import type { Gaze } from "../face";

/**
 * The four visible presence profiles. Every runtime state maps onto one, so
 * behaviour is grouped and legible rather than tied to the 10-way state enum.
 */
export enum BehaviorProfile {
  Idle = "idle",
  Listening = "listening",
  Thinking = "thinking",
  Speaking = "speaking",
}

/** The discrete idle behaviour currently playing (or steady breathing). */
export enum IdleBehavior {
  Steady = "steady",
  Glance = "glance",
  WeightShift = "weight-shift",
}

/** Per-frame nudges the PresenceSystem layers onto its existing motion. */
export interface PresenceModifiers {
  /** Transient additive gaze offset from a random idle glance (normalized). */
  gazeOffset: Gaze;
  /** Transient additive body sway from an idle weight-shift (world units). */
  swayOffset: number;
}

/** Runtime state → presence profile. */
const STATE_PROFILE: Record<AvatarState, BehaviorProfile> = {
  [AvatarState.Idle]: BehaviorProfile.Idle,
  [AvatarState.Working]: BehaviorProfile.Idle,
  [AvatarState.LookingAtScreen]: BehaviorProfile.Idle,
  [AvatarState.LookingAtVisitor]: BehaviorProfile.Listening,
  [AvatarState.Listening]: BehaviorProfile.Listening,
  [AvatarState.Thinking]: BehaviorProfile.Thinking,
  [AvatarState.Speaking]: BehaviorProfile.Speaking,
  [AvatarState.Gesturing]: BehaviorProfile.Speaking,
  [AvatarState.Smiling]: BehaviorProfile.Idle,
  [AvatarState.Error]: BehaviorProfile.Idle,
};

/** Which named target each profile attends to (null = ambient/runtime gaze). */
const PROFILE_FOCUS: Record<BehaviorProfile, FocusTargetName | null> = {
  [BehaviorProfile.Idle]: null,
  [BehaviorProfile.Listening]: FocusTargetName.Visitor,
  [BehaviorProfile.Thinking]: null,
  [BehaviorProfile.Speaking]: FocusTargetName.Visitor,
};

const CONFIG = {
  /** Seconds a profile change stays flagged as "transitioning". */
  transitionSec: 0.6,
  idleEvent: {
    /** Randomized gap between discrete idle events. */
    minIntervalSec: 4,
    maxIntervalSec: 9,
    /** How long one event's ease-in/out envelope lasts. */
    durationSec: 2,
    /** Peak gaze deflection of an idle glance (normalized). */
    glanceAmplitude: 0.4,
    /** Peak lateral body offset of an idle weight-shift (world units). */
    swayAmplitude: 0.022,
  },
} as const;

const ZERO_GAZE: Gaze = { x: 0, y: 0 };
const randRange = (min: number, max: number): number => min + Math.random() * (max - min);

/**
 * The living-presence orchestrator. It sits above the per-frame motion
 * controllers (which it does not duplicate): it selects the active behaviour
 * profile from the runtime state, decides where each profile looks, schedules
 * *random, non-repetitive* idle events (an occasional glance or weight-shift on
 * a randomized timer), tracks blink count, and flags profile transitions.
 *
 * It emits only high-level intents and small additive modifiers — the
 * PresenceSystem applies them through the existing adapters and animators, so
 * the same behaviour drives the placeholder, a Ready Player Me rig, or a future
 * kumail.glb with no mesh-name knowledge anywhere.
 */
export class PresenceController {
  private profile = BehaviorProfile.Idle;
  private transitionTimer = 0;

  private blinkCount = 0;
  private prevBlink = false;

  private behavior = IdleBehavior.Steady;
  private eventTimer = randRange(CONFIG.idleEvent.minIntervalSec, CONFIG.idleEvent.maxIntervalSec);
  private eventElapsed = 0;
  private glanceTarget: Gaze = { x: 0, y: 0 };
  private swaySign = 1;

  // Reused each frame to avoid per-frame allocation.
  private readonly mods: PresenceModifiers = { gazeOffset: { x: 0, y: 0 }, swayOffset: 0 };

  /**
   * Advance the profile state machine and idle-event scheduler for this frame.
   * Returns the additive modifiers to apply (zeroed when nothing is active).
   */
  update(state: AvatarState, deltaSec: number): PresenceModifiers {
    const next = STATE_PROFILE[state];
    if (next !== this.profile) {
      this.profile = next;
      this.transitionTimer = CONFIG.transitionSec;
      this.endIdleEvent(); // a profile change cancels any in-flight idle event
    } else if (this.transitionTimer > 0) {
      this.transitionTimer = Math.max(0, this.transitionTimer - deltaSec);
    }

    this.mods.gazeOffset.x = 0;
    this.mods.gazeOffset.y = 0;
    this.mods.swayOffset = 0;

    if (this.profile === BehaviorProfile.Idle) this.updateIdleEvents(deltaSec);
    else this.behavior = IdleBehavior.Steady;

    return this.mods;
  }

  /** Count a blink on its rising edge. Call once per frame with the blink weight. */
  countBlink(blinkWeight: number): void {
    const active = blinkWeight > 0.5;
    if (active && !this.prevBlink) this.blinkCount += 1;
    this.prevBlink = active;
  }

  getActiveProfile(): BehaviorProfile {
    return this.profile;
  }

  /** The target this profile should look at, or null for ambient gaze. */
  getFocusIntent(): FocusTargetName | null {
    return PROFILE_FOCUS[this.profile];
  }

  getActiveBehavior(): IdleBehavior {
    return this.behavior;
  }

  getBlinkCount(): number {
    return this.blinkCount;
  }

  isTransitioning(): boolean {
    return this.transitionTimer > 0;
  }

  private updateIdleEvents(deltaSec: number): void {
    if (this.behavior === IdleBehavior.Steady) {
      this.eventTimer -= deltaSec;
      if (this.eventTimer <= 0) this.startIdleEvent();
      return;
    }

    this.eventElapsed += deltaSec;
    const t = this.eventElapsed / CONFIG.idleEvent.durationSec;
    if (t >= 1) {
      this.endIdleEvent();
      return;
    }

    // Smooth ease-in/out envelope: 0 → 1 → 0 across the event.
    const env = Math.sin(t * Math.PI);
    if (this.behavior === IdleBehavior.Glance) {
      this.mods.gazeOffset.x = this.glanceTarget.x * env;
      this.mods.gazeOffset.y = this.glanceTarget.y * env;
    } else {
      this.mods.swayOffset = this.swaySign * CONFIG.idleEvent.swayAmplitude * env;
    }
  }

  private startIdleEvent(): void {
    if (Math.random() < 0.5) {
      const a = CONFIG.idleEvent.glanceAmplitude;
      this.behavior = IdleBehavior.Glance;
      this.glanceTarget = { x: randRange(-a, a), y: randRange(-a * 0.5, a * 0.5) };
    } else {
      this.behavior = IdleBehavior.WeightShift;
      this.swaySign = Math.random() < 0.5 ? -1 : 1;
    }
    this.eventElapsed = 0;
  }

  private endIdleEvent(): void {
    this.behavior = IdleBehavior.Steady;
    this.eventElapsed = 0;
    this.glanceTarget = ZERO_GAZE;
    this.eventTimer = randRange(CONFIG.idleEvent.minIntervalSec, CONFIG.idleEvent.maxIntervalSec);
  }
}
