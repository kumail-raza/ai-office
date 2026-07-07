export type ProjectAnalyticsEventType =
  | "project_viewed"
  | "section_opened"
  | "time_spent"
  | "deep_dive_action";

export interface ProjectAnalyticsEvent {
  type: ProjectAnalyticsEventType;
  projectSlug: string;
  detail?: string;
  durationMs?: number;
  timestamp: number;
}

export interface ProjectAnalyticsSummary {
  totalEvents: number;
  projectsViewed: Record<string, number>;
  sectionsOpened: Record<string, number>;
  deepDiveActions: Record<string, number>;
  totalTimeSpentMs: number;
  events: ProjectAnalyticsEvent[];
}

/**
 * Session-only analytics for the project deep-dive system. No backend, no
 * persistence beyond the session — `getSummary()` is the seam a future
 * analytics backend can drain.
 */
class ProjectAnalyticsTracker {
  private readonly events: ProjectAnalyticsEvent[] = [];
  private viewStartedAt: number | null = null;
  private viewingSlug: string | null = null;

  private record(
    type: ProjectAnalyticsEventType,
    projectSlug: string,
    detail?: string,
    durationMs?: number,
  ): void {
    this.events.push({ type, projectSlug, detail, durationMs, timestamp: Date.now() });
  }

  trackProjectViewed(slug: string): void {
    this.flushTimeSpent();
    this.viewingSlug = slug;
    this.viewStartedAt = Date.now();
    this.record("project_viewed", slug);
  }

  trackSectionOpened(slug: string, section: string): void {
    this.record("section_opened", slug, section);
  }

  trackDeepDiveAction(slug: string, action: string): void {
    this.record("deep_dive_action", slug, action);
  }

  /** Call when leaving a project (closing detail, switching, or navigating away). */
  flushTimeSpent(): void {
    if (this.viewingSlug === null || this.viewStartedAt === null) return;
    const durationMs = Date.now() - this.viewStartedAt;
    this.record("time_spent", this.viewingSlug, undefined, durationMs);
    this.viewingSlug = null;
    this.viewStartedAt = null;
  }

  getSummary(): ProjectAnalyticsSummary {
    const projectsViewed: Record<string, number> = {};
    const sectionsOpened: Record<string, number> = {};
    const deepDiveActions: Record<string, number> = {};
    let totalTimeSpentMs = 0;

    for (const event of this.events) {
      if (event.type === "project_viewed") {
        projectsViewed[event.projectSlug] = (projectsViewed[event.projectSlug] ?? 0) + 1;
      }
      if (event.type === "section_opened" && event.detail) {
        sectionsOpened[event.detail] = (sectionsOpened[event.detail] ?? 0) + 1;
      }
      if (event.type === "deep_dive_action" && event.detail) {
        deepDiveActions[event.detail] = (deepDiveActions[event.detail] ?? 0) + 1;
      }
      if (event.type === "time_spent" && event.durationMs) {
        totalTimeSpentMs += event.durationMs;
      }
    }

    return {
      totalEvents: this.events.length,
      projectsViewed,
      sectionsOpened,
      deepDiveActions,
      totalTimeSpentMs,
      events: [...this.events],
    };
  }
}

export const projectAnalytics = new ProjectAnalyticsTracker();
