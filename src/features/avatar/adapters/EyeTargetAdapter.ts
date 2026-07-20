import type { Gaze } from "../face";
import { VisitorFocus } from "../presence/VisitorFocus";
import type { AvatarPlacement, ScenePosition } from "../types";

/** The named things the office registers for the avatar to look at. */
export enum FocusTargetName {
  Visitor = "visitor",
  Monitor = "monitor",
  Window = "window",
}

/** Eye height on the avatar, in its local space (matches the head group). */
const EYE_HEIGHT = 1.72;

/** Yaw/pitch that map to a full gaze deflection of ±1. */
const MAX_YAW_RAD = Math.PI / 3;
const MAX_PITCH_RAD = Math.PI / 4;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

/**
 * Converts named world positions into normalized gaze directions and manages
 * which one the avatar is attending to. The seam between the room (which knows
 * where the monitor and window are) and the eyes (which only understand
 * normalized gaze): register world targets once, then `look()` by name.
 *
 * Ambient behaviour is preserved — with nothing acquired, getActiveDirection()
 * returns null and the eye/head controllers follow the runtime's own gaze.
 */
export class EyeTargetAdapter {
  private readonly focus = new VisitorFocus();
  private activeName: string | null = null;
  private placement: AvatarPlacement | null = null;

  /** Tell the adapter where the avatar stands so world math is possible. */
  configure(placement: AvatarPlacement): void {
    this.placement = placement;
  }

  /**
   * Register a target by world position. Computes the gaze direction from the
   * avatar's eyes to the target, in the avatar's facing frame. Static rooms
   * register once; a moving target re-registers to update.
   */
  registerWorldTarget(name: string, position: ScenePosition): void {
    if (!this.placement) return;
    this.focus.register({ name, direction: this.toGaze(position) });
  }

  /** Register a target directly as a gaze direction (e.g. "the visitor"). */
  registerDirection(name: string, direction: Gaze): void {
    this.focus.register({ name, direction });
  }

  /** Attend to a registered target (no-op if unknown). */
  look(name: string): void {
    this.focus.acquire(name);
    this.activeName = name;
  }

  /** Return to ambient, runtime-driven gaze. */
  release(): void {
    this.focus.release();
    this.activeName = null;
  }

  /** The active focus direction, or null when ambient. */
  getActiveDirection(): Gaze | null {
    return this.focus.getActiveDirection();
  }

  /** The active focus name for dev tooling, or null when ambient. */
  getActiveName(): string | null {
    return this.activeName;
  }

  /** World position → normalized gaze in the avatar's facing frame. */
  private toGaze(target: ScenePosition): Gaze {
    const placement = this.placement;
    if (!placement) return { x: 0, y: 0 };

    const [ax, ay, az] = placement.position;
    const dx = target[0] - ax;
    const dy = target[1] - (ay + EYE_HEIGHT * placement.scale);
    const dz = target[2] - az;

    // Rotate the world delta into the avatar's local frame (inverse yaw).
    const r = placement.rotationY;
    const localX = dx * Math.cos(r) - dz * Math.sin(r);
    const localZ = dx * Math.sin(r) + dz * Math.cos(r);

    // The face looks along +z local; yaw/pitch normalize to gaze [-1, 1].
    const yaw = Math.atan2(localX, localZ);
    const pitch = Math.atan2(dy, Math.hypot(localX, localZ));

    return {
      x: clamp(yaw / MAX_YAW_RAD, -1, 1),
      y: clamp(pitch / MAX_PITCH_RAD, -1, 1),
    };
  }
}
