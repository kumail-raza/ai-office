import type { ScenePosition } from "../types";
import { interactionEvents } from "../interaction/interactionEvents";
import {
  INTERACTION_ZONE_LIST,
  type InteractionZone,
  type InteractionZoneId,
} from "../interaction/zones";

/**
 * The focus system. A framework-agnostic authority that turns a world-space
 * probe point (a selected object, or later a walking avatar) into the active
 * interaction zone, tracks the focused object, and publishes zone/interaction
 * events — deduplicated so a zone never re-fires while it stays active.
 *
 * Deliberately knows nothing about React, the camera, or the DOM: it emits
 * through the shared `interactionEvents` bus, and callers (the scene, the DOM
 * bridge, analytics) react. This keeps the existing camera controller and every
 * feature contract untouched.
 */
export class InteractionManager {
  private readonly zones: InteractionZone[];
  private activeZoneId: InteractionZoneId | null = null;
  private triggeredZoneId: InteractionZoneId | null = null;
  private focusedObjectId: string | null = null;

  constructor(zones: InteractionZone[] = INTERACTION_ZONE_LIST) {
    this.zones = zones;
  }

  getActiveZone(): InteractionZone | null {
    return this.activeZoneId ? this.zoneById(this.activeZoneId) : null;
  }

  getFocusedObjectId(): string | null {
    return this.focusedObjectId;
  }

  /**
   * Update the probe point (null = nothing focused). Resolves the containing
   * zone and fires enter/leave transitions. Idempotent: re-probing inside the
   * same zone is a no-op, which is what prevents duplicate triggers.
   */
  setProbePoint(point: ScenePosition | null): void {
    const next = point ? this.resolveZoneAt(point) : null;
    const nextId = next?.id ?? null;
    if (nextId === this.activeZoneId) return;

    if (this.activeZoneId) this.leaveActive();

    this.activeZoneId = nextId;
    this.focusedObjectId = next?.targetObjectId ?? null;

    if (next) {
      interactionEvents.emit("zone-entered", {
        zoneId: next.id,
        targetObjectId: next.targetObjectId,
        bridge: next.bridge,
      });
    }
  }

  /**
   * Fire the active zone's interaction (opens its bridged experience). Guarded
   * so one activation triggers at most once — repeated calls while the same
   * zone is active are ignored.
   */
  triggerActive(): void {
    const zone = this.getActiveZone();
    if (!zone || zone.id === this.triggeredZoneId) return;
    this.triggeredZoneId = zone.id;
    interactionEvents.emit("interaction-started", {
      zoneId: zone.id,
      targetObjectId: zone.targetObjectId,
      bridge: zone.bridge,
    });
  }

  /** Clear focus entirely (fires leave/completed for the active zone). */
  clear(): void {
    this.setProbePoint(null);
  }

  private leaveActive(): void {
    const zone = this.getActiveZone();
    if (!zone) return;

    const payload = {
      zoneId: zone.id,
      targetObjectId: zone.targetObjectId,
      bridge: zone.bridge,
    };
    // Completed pairs with a prior started — only emit if this zone triggered.
    if (this.triggeredZoneId === zone.id) {
      interactionEvents.emit("interaction-completed", payload);
      this.triggeredZoneId = null;
    }
    interactionEvents.emit("zone-left", payload);
  }

  /** Nearest zone whose sphere contains the point, or null if none do. */
  private resolveZoneAt(point: ScenePosition): InteractionZone | null {
    let best: InteractionZone | null = null;
    let bestDistSq = Infinity;
    for (const zone of this.zones) {
      const distSq = squaredDistance(point, zone.position);
      if (distSq <= zone.radius * zone.radius && distSq < bestDistSq) {
        best = zone;
        bestDistSq = distSq;
      }
    }
    return best;
  }

  private zoneById(id: InteractionZoneId): InteractionZone | null {
    return this.zones.find((zone) => zone.id === id) ?? null;
  }
}

function squaredDistance(a: ScenePosition, b: ScenePosition): number {
  const dx = a[0] - b[0];
  const dy = a[1] - b[1];
  const dz = a[2] - b[2];
  return dx * dx + dy * dy + dz * dz;
}
