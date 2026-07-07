import type { OfficeObject, OfficeObjectType } from "../types";

export interface InteractionRecord {
  objectId: string;
  type: OfficeObjectType;
  timestamp: number;
}

export interface OfficeAnalyticsSummary {
  totalInteractions: number;
  byObject: Record<string, number>;
  records: InteractionRecord[];
}

/**
 * Owns the office experience lifecycle and session analytics. It records which
 * objects were opened and how often; `getAnalytics()` is the seam a future
 * backend can drain without changing callers. Session-only — nothing persists.
 */
class OfficeExperienceManager {
  private readonly registry = new Map<string, OfficeObject>();
  private readonly records: InteractionRecord[] = [];

  registerObject(object: OfficeObject): void {
    this.registry.set(object.id, object);
  }

  getRegistered(): OfficeObject[] {
    return [...this.registry.values()];
  }

  openExperience(object: OfficeObject): void {
    this.trackInteraction(object);
  }

  closeExperience(): void {
    // Reserved: dwell-time / close analytics can hook in here later.
  }

  trackInteraction(object: OfficeObject): void {
    this.records.push({ objectId: object.id, type: object.type, timestamp: Date.now() });
  }

  getAnalytics(): OfficeAnalyticsSummary {
    const byObject: Record<string, number> = {};
    for (const record of this.records) {
      byObject[record.objectId] = (byObject[record.objectId] ?? 0) + 1;
    }
    return { totalInteractions: this.records.length, byObject, records: [...this.records] };
  }
}

export const officeExperienceManager = new OfficeExperienceManager();
