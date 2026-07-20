import { Vector3, type PerspectiveCamera } from "three";

import type { CameraPose, ScenePosition } from "../types";

export interface CameraControllerOptions {
  /** Seconds for a full eased move between vantage points. */
  transitionSeconds: number;
  idleAmplitude: number;
  idleSpeed: number;
}

export interface FocusOptions {
  /** Distance from the focused point to the camera. */
  distance?: number;
  /** Extra height added to the eye position. */
  lift?: number;
}

/** Cubic ease-in-out — accelerates away, decelerates in. No abrupt starts/stops. */
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
}

interface Transition {
  fromPosition: Vector3;
  fromTarget: Vector3;
  toPosition: Vector3;
  toTarget: Vector3;
  elapsed: number;
  duration: number;
}

/**
 * Cinematic camera driver. Every move is a *timed, eased* dolly between two
 * poses rather than an exponential chase, so transitions have a deliberate
 * beginning, middle and end — they accelerate away, glide, and settle. A slow
 * idle breath plays on top while at rest.
 *
 * Deliberately knows nothing about the office: callers pass world positions, so
 * the same controller can later drive cinematic paths or project showcases.
 */
export class CameraController {
  private readonly basePosition = new Vector3();
  private readonly currentTarget = new Vector3();
  private readonly homePose: { position: Vector3; target: Vector3 };

  private readonly options: CameraControllerOptions;
  private transition: Transition | null = null;
  private elapsedSec = 0;
  private idleEnabled = true;
  private initialized = false;

  // Scratch vectors reused every frame to avoid per-frame allocation.
  private readonly scratch = new Vector3();
  private readonly scratchDir = new Vector3();

  constructor(home: CameraPose, options: CameraControllerOptions) {
    this.homePose = {
      position: new Vector3(...home.position),
      target: new Vector3(...home.target),
    };
    this.options = options;
    this.basePosition.copy(this.homePose.position);
    this.currentTarget.copy(this.homePose.target);
  }

  /** Aim the camera at a world position without moving the eye. */
  lookAt(target: ScenePosition): void {
    this.startTransition(this.basePosition, this.scratch.set(...target));
  }

  /** Glide the camera to a new eye position (optionally retargeting). */
  moveTo(position: ScenePosition, target?: ScenePosition): void {
    const to = new Vector3(...position);
    const look = target ? new Vector3(...target) : this.currentTarget.clone();
    this.startTransition(to, look);
    this.idleEnabled = false;
  }

  /**
   * Frame a world position: aim at it and pull the eye to a pleasant offset
   * between the resting viewpoint and the subject.
   */
  focusObject(position: ScenePosition, { distance = 1.8, lift = 0.3 }: FocusOptions = {}): void {
    const subject = new Vector3(...position);
    this.scratchDir.copy(this.homePose.position).sub(subject);
    this.scratchDir.y = 0;
    if (this.scratchDir.lengthSq() < 1e-6) this.scratchDir.set(0, 0, 1);
    this.scratchDir.normalize().multiplyScalar(distance);

    const to = subject.clone().add(this.scratchDir);
    to.y = subject.y + lift;
    this.startTransition(to, subject);
    this.idleEnabled = false;
  }

  /** Return to the resting overview pose and resume the idle breath. */
  reset(): void {
    this.startTransition(this.homePose.position, this.homePose.target);
    this.idleEnabled = true;
  }

  /** Advance the move and write the camera. Call once per frame. */
  update(deltaMs: number, camera: PerspectiveCamera): void {
    const deltaSec = deltaMs / 1000;
    this.elapsedSec += deltaSec;

    if (!this.initialized) {
      camera.position.copy(this.basePosition);
      this.initialized = true;
    }

    if (this.transition) {
      this.transition.elapsed += deltaSec;
      const t = Math.min(1, this.transition.elapsed / this.transition.duration);
      const eased = easeInOutCubic(t);

      this.basePosition.lerpVectors(this.transition.fromPosition, this.transition.toPosition, eased);
      this.currentTarget.lerpVectors(this.transition.fromTarget, this.transition.toTarget, eased);

      if (t >= 1) this.transition = null;
    }

    // A slow, shallow breath layered on top of the settled pose.
    this.scratch.copy(this.basePosition);
    if (this.idleEnabled) {
      const t = this.elapsedSec * this.options.idleSpeed * Math.PI * 2;
      this.scratch.x += Math.sin(t) * this.options.idleAmplitude;
      this.scratch.y += Math.sin(t * 1.7) * this.options.idleAmplitude * 0.5;
    }

    camera.position.copy(this.scratch);
    camera.lookAt(this.currentTarget);
  }

  private startTransition(toPosition: Vector3, toTarget: Vector3): void {
    this.transition = {
      fromPosition: this.basePosition.clone(),
      fromTarget: this.currentTarget.clone(),
      toPosition: toPosition.clone(),
      toTarget: toTarget.clone(),
      elapsed: 0,
      duration: this.options.transitionSeconds,
    };
  }
}
