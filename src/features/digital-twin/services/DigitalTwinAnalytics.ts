import { avatarRuntimeEvents } from "../events";
import type { AvatarGesture, AvatarState } from "../types";

export interface DigitalTwinAnalyticsSummary {
  totalEvents: number;
  stateChanges: number;
  stateCounts: Record<string, number>;
  speechStarts: number;
  speechEnds: number;
  gestureCounts: Record<string, number>;
}

/**
 * Session-only analytics for the digital twin. Subscribes to the runtime event
 * bus via `connect()`; nothing persists — `getSummary()` is the seam a future
 * backend can drain.
 */
class DigitalTwinAnalytics {
  private stateChanges = 0;
  private speechStarts = 0;
  private speechEnds = 0;
  private readonly stateCounts: Record<string, number> = {};
  private readonly gestureCounts: Record<string, number> = {};

  private countState(state: AvatarState): void {
    this.stateCounts[state] = (this.stateCounts[state] ?? 0) + 1;
  }

  private countGesture(gesture: AvatarGesture): void {
    this.gestureCounts[gesture] = (this.gestureCounts[gesture] ?? 0) + 1;
  }

  /** Subscribe to runtime events. Returns an unsubscribe function. */
  connect(): () => void {
    const unsubscribers = [
      avatarRuntimeEvents.on("avatar-state-changed", ({ to }) => {
        this.stateChanges += 1;
        this.countState(to);
      }),
      avatarRuntimeEvents.on("speech-started", () => {
        this.speechStarts += 1;
      }),
      avatarRuntimeEvents.on("speech-ended", () => {
        this.speechEnds += 1;
      }),
      avatarRuntimeEvents.on("gesture-started", ({ gesture }) => {
        this.countGesture(gesture);
      }),
    ];
    return () => unsubscribers.forEach((unsubscribe) => unsubscribe());
  }

  getSummary(): DigitalTwinAnalyticsSummary {
    return {
      totalEvents:
        this.stateChanges +
        this.speechStarts +
        this.speechEnds +
        Object.values(this.gestureCounts).reduce((sum, count) => sum + count, 0),
      stateChanges: this.stateChanges,
      stateCounts: { ...this.stateCounts },
      speechStarts: this.speechStarts,
      speechEnds: this.speechEnds,
      gestureCounts: { ...this.gestureCounts },
    };
  }
}

export const digitalTwinAnalytics = new DigitalTwinAnalytics();
