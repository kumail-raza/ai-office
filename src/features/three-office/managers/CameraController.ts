import { Vector3, type PerspectiveCamera } from "three";

import type { CameraPose, ScenePosition } from "../types";

export interface CameraControllerOptions {
  positionSmoothing: number;
  targetSmoothing: number;
  idleAmplitude: number;
  idleSpeed: number;
}

export interface FocusOptions {
  /** Distance from the focused point to the camera. */
  distance?: number;
  /** Extra height added to the eye position. */
  lift?: number;
}

/**
 * Generic smooth camera driver. Holds desired position/target and eases the
 * real camera toward them each frame, with a subtle idle drift while resting.
 * Deliberately knows nothing about the office — callers pass world positions,
 * so the same controller can later run cinematic paths or project showcases.
 */
export class CameraController {
  private readonly desiredPosition = new Vector3();
  private readonly desiredTarget = new Vector3();
  private readonly currentTarget = new Vector3();
  private readonly homePose: { position: Vector3; target: Vector3 };

  private readonly options: CameraControllerOptions;
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
    this.desiredPosition.copy(this.homePose.position);
    this.desiredTarget.copy(this.homePose.target);
    this.currentTarget.copy(this.homePose.target);
  }

  /** Aim the camera at a world position without moving it. */
  lookAt(target: ScenePosition): void {
    this.desiredTarget.set(...target);
  }

  /** Glide the camera to a new eye position (optionally retargeting). */
  moveTo(position: ScenePosition, target?: ScenePosition): void {
    this.desiredPosition.set(...position);
    if (target) this.desiredTarget.set(...target);
    this.idleEnabled = false;
  }

  /**
   * Frame a world position: aim at it and pull the eye to a pleasant offset
   * between the current viewpoint and the subject.
   */
  focusObject(position: ScenePosition, { distance = 1.8, lift = 0.3 }: FocusOptions = {}): void {
    const subject = this.scratch.set(...position);
    this.scratchDir.copy(this.homePose.position).sub(subject);
    this.scratchDir.y = 0;
    if (this.scratchDir.lengthSq() < 1e-6) this.scratchDir.set(0, 0, 1);
    this.scratchDir.normalize().multiplyScalar(distance);

    this.desiredPosition.copy(subject).add(this.scratchDir);
    this.desiredPosition.y = subject.y + lift;
    this.desiredTarget.copy(subject);
    this.idleEnabled = false;
  }

  /** Return to the resting overview pose and resume idle drift. */
  reset(): void {
    this.desiredPosition.copy(this.homePose.position);
    this.desiredTarget.copy(this.homePose.target);
    this.idleEnabled = true;
  }

  /** Ease the real camera toward the desired pose. Call once per frame. */
  update(deltaMs: number, camera: PerspectiveCamera): void {
    this.elapsedSec += deltaMs / 1000;

    if (!this.initialized) {
      camera.position.copy(this.desiredPosition);
      this.currentTarget.copy(this.desiredTarget);
      this.initialized = true;
    }

    // Normalize smoothing against a 60fps frame so easing is frame-rate stable.
    const frames = deltaMs / (1000 / 60);
    const posAlpha = 1 - (1 - this.options.positionSmoothing) ** frames;
    const targetAlpha = 1 - (1 - this.options.targetSmoothing) ** frames;

    this.scratch.copy(this.desiredPosition);
    if (this.idleEnabled) {
      const t = this.elapsedSec * this.options.idleSpeed * Math.PI * 2;
      this.scratch.x += Math.sin(t) * this.options.idleAmplitude;
      this.scratch.y += Math.sin(t * 1.7) * this.options.idleAmplitude * 0.5;
    }

    camera.position.lerp(this.scratch, posAlpha);
    this.currentTarget.lerp(this.desiredTarget, targetAlpha);
    camera.lookAt(this.currentTarget);
  }
}
