import { interactionEvents } from "./interactionEvents";
import type { InteractionZoneId } from "./zones";

export type InteractionAnalyticsEventType =
  | "zone_entered"
  | "zone_left"
  | "interaction_started"
  | "interaction_completed";

export interface InteractionAnalyticsEvent {
  type: InteractionAnalyticsEventType;
  zoneId: InteractionZoneId;
  timestamp: number;
}

export interface InteractionAnalyticsSummary {
  totalEvents: number;
  zonesEntered: Record<string, number>;
  interactionsStarted: Record<string, number>;
  interactionsCompleted: Record<string, number>;
  events: InteractionAnalyticsEvent[];
}

/**
 * Session-only analytics for office interaction zones, following the same shape
 * as RecruiterAnalytics / the OfficeExperienceManager: no backend, no
 * persistence — `getSummary()` is the seam a future analytics backend drains.
 *
 * It self-subscribes to the `interactionEvents` bus, so tracking happens
 * wherever the InteractionManager runs without any caller wiring.
 */
class InteractionAnalyticsTracker {
  private readonly events: InteractionAnalyticsEvent[] = [];

  constructor() {
    interactionEvents.on("zone-entered", (e) => this.record("zone_entered", e.zoneId));
    interactionEvents.on("zone-left", (e) => this.record("zone_left", e.zoneId));
    interactionEvents.on("interaction-started", (e) => this.record("interaction_started", e.zoneId));
    interactionEvents.on("interaction-completed", (e) =>
      this.record("interaction_completed", e.zoneId),
    );
  }

  private record(type: InteractionAnalyticsEventType, zoneId: InteractionZoneId): void {
    this.events.push({ type, zoneId, timestamp: Date.now() });
  }

  getSummary(): InteractionAnalyticsSummary {
    const zonesEntered: Record<string, number> = {};
    const interactionsStarted: Record<string, number> = {};
    const interactionsCompleted: Record<string, number> = {};

    for (const event of this.events) {
      if (event.type === "zone_entered") {
        zonesEntered[event.zoneId] = (zonesEntered[event.zoneId] ?? 0) + 1;
      }
      if (event.type === "interaction_started") {
        interactionsStarted[event.zoneId] = (interactionsStarted[event.zoneId] ?? 0) + 1;
      }
      if (event.type === "interaction_completed") {
        interactionsCompleted[event.zoneId] = (interactionsCompleted[event.zoneId] ?? 0) + 1;
      }
    }

    return {
      totalEvents: this.events.length,
      zonesEntered,
      interactionsStarted,
      interactionsCompleted,
      events: [...this.events],
    };
  }
}

export const interactionAnalytics = new InteractionAnalyticsTracker();
