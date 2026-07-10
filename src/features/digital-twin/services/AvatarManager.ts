import {
  ExpressionController,
  EyeTrackingController,
  GestureController,
  HeadTrackingController,
  type LipSyncController,
  NoopLipSyncController,
} from "../controllers";
import { avatarRuntimeEvents, type AvatarRuntimeEventMap } from "../events";
import {
  type AvatarController,
  type AvatarSnapshot,
  AvatarState,
} from "../types";

/**
 * Single source of truth for the digital twin. Owns the state machine and the
 * controllers, dispatches state transitions to every controller, aggregates a
 * render-cheap snapshot for React, and proxies the runtime event bus.
 *
 * Deliberately framework-agnostic and provider-independent — the same instance
 * will drive an SVG placeholder today and a React Three Fiber / GLTF / Ready
 * Player Me / MetaHuman avatar later, without changes here.
 */
class AvatarManager {
  readonly expression: ExpressionController;
  readonly eyes: EyeTrackingController;
  readonly head: HeadTrackingController;
  readonly gesture: GestureController;
  readonly lipSync: LipSyncController;

  private state: AvatarState = AvatarState.Idle;
  private controllers: AvatarController[] = [];
  private readonly listeners = new Set<() => void>();
  private snapshot: AvatarSnapshot;

  constructor() {
    const notify = () => this.publish();
    this.expression = new ExpressionController(notify);
    this.eyes = new EyeTrackingController(notify);
    this.head = new HeadTrackingController(notify);
    this.gesture = new GestureController(notify);
    this.lipSync = new NoopLipSyncController();

    [this.expression, this.eyes, this.head, this.gesture, this.lipSync].forEach((controller) =>
      this.registerController(controller),
    );

    this.snapshot = this.computeSnapshot();
  }

  registerController(controller: AvatarController): void {
    this.controllers.push(controller);
  }

  getState(): AvatarState {
    return this.state;
  }

  setState(next: AvatarState): void {
    if (next === this.state) return;
    const from = this.state;
    this.state = next;

    this.controllers.forEach((controller) => controller.onStateChange(next));

    this.emitAvatarEvent("avatar-state-changed", { from, to: next });
    if (next === AvatarState.Speaking) this.emitAvatarEvent("speech-started", {});
    if (from === AvatarState.Speaking) this.emitAvatarEvent("speech-ended", {});

    this.publish();
  }

  /** Alias for setState — the explicit "transition" verb the runtime uses. */
  transition(next: AvatarState): void {
    this.setState(next);
  }

  emitAvatarEvent<K extends keyof AvatarRuntimeEventMap>(
    type: K,
    event: AvatarRuntimeEventMap[K],
  ): void {
    avatarRuntimeEvents.emit(type, event);
  }

  /** Advance continuous controller interpolation. Driven by a rAF loop. */
  update(deltaMs: number): void {
    this.controllers.forEach((controller) => controller.update?.(deltaMs));
  }

  getSnapshot(): AvatarSnapshot {
    return this.snapshot;
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private computeSnapshot(): AvatarSnapshot {
    return {
      state: this.state,
      expression: this.expression.getExpression(),
      expressionBlend: this.expression.getBlend(),
      eyeTarget: this.eyes.getTarget(),
      gesture: this.gesture.getCurrent(),
    };
  }

  private publish(): void {
    this.snapshot = this.computeSnapshot();
    this.listeners.forEach((listener) => listener());
  }
}

export const avatarManager = new AvatarManager();
