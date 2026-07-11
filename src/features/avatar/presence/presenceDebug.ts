import type { AvatarExpression } from "@/features/digital-twin";

import type { Gaze } from "../face";

/**
 * Dev-only control channel between the (DOM) presence debug panel and the
 * (in-canvas) PresenceSystem. The panel writes overrides; the system reads them
 * each frame. Null everywhere = the avatar behaves autonomously. A singleton so
 * both sides share it without prop-drilling across the R3F boundary.
 */
class PresenceDebug {
  /** Pin a facial expression, or null to let the runtime drive it. */
  expressionOverride: AvatarExpression | null = null;
  /** Force a gaze direction, or null for autonomous gaze. */
  gazeOverride: Gaze | null = null;
  /** Force a head look direction, or null for autonomous head. */
  headOverride: Gaze | null = null;

  private blinkRequested = false;
  private readonly listeners = new Set<() => void>();

  /** Fire a single manual blink on the next frame. */
  requestBlink(): void {
    this.blinkRequested = true;
    this.notify();
  }

  /** PresenceSystem consumes the one-shot blink request. */
  consumeBlink(): boolean {
    const requested = this.blinkRequested;
    this.blinkRequested = false;
    return requested;
  }

  setExpression(expression: AvatarExpression | null): void {
    this.expressionOverride = expression;
    this.notify();
  }

  setGaze(gaze: Gaze | null): void {
    this.gazeOverride = gaze;
    this.notify();
  }

  setHead(head: Gaze | null): void {
    this.headOverride = head;
    this.notify();
  }

  reset(): void {
    this.expressionOverride = null;
    this.gazeOverride = null;
    this.headOverride = null;
    this.notify();
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    this.listeners.forEach((listener) => listener());
  }
}

export const presenceDebug = new PresenceDebug();
