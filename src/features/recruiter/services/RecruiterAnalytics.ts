import type { RecruiterSection } from "../types";

export type RecruiterAnalyticsEventType =
  | "mode_entered"
  | "section_viewed"
  | "resume_download"
  | "contact_click";

export interface RecruiterAnalyticsEvent {
  type: RecruiterAnalyticsEventType;
  detail?: string;
  timestamp: number;
}

export interface RecruiterAnalyticsSummary {
  totalEvents: number;
  modeEnteredCount: number;
  sectionsViewed: Record<string, number>;
  resumeDownloads: number;
  contactClicks: Record<string, number>;
  events: RecruiterAnalyticsEvent[];
}

/**
 * Session-only analytics for Recruiter Mode. No backend, no persistence beyond
 * the current session — `getSummary()` is the seam a future analytics backend
 * can drain.
 */
class RecruiterAnalyticsTracker {
  private readonly events: RecruiterAnalyticsEvent[] = [];

  private record(type: RecruiterAnalyticsEventType, detail?: string): void {
    this.events.push({ type, detail, timestamp: Date.now() });
  }

  trackModeEntered(): void {
    this.record("mode_entered");
  }

  trackSectionViewed(section: RecruiterSection): void {
    this.record("section_viewed", section);
  }

  trackResumeDownload(): void {
    this.record("resume_download");
  }

  trackContactClick(channel: string): void {
    this.record("contact_click", channel);
  }

  getSummary(): RecruiterAnalyticsSummary {
    const sectionsViewed: Record<string, number> = {};
    const contactClicks: Record<string, number> = {};
    let modeEnteredCount = 0;
    let resumeDownloads = 0;

    for (const event of this.events) {
      if (event.type === "mode_entered") modeEnteredCount += 1;
      if (event.type === "resume_download") resumeDownloads += 1;
      if (event.type === "section_viewed" && event.detail) {
        sectionsViewed[event.detail] = (sectionsViewed[event.detail] ?? 0) + 1;
      }
      if (event.type === "contact_click" && event.detail) {
        contactClicks[event.detail] = (contactClicks[event.detail] ?? 0) + 1;
      }
    }

    return {
      totalEvents: this.events.length,
      modeEnteredCount,
      sectionsViewed,
      resumeDownloads,
      contactClicks,
      events: [...this.events],
    };
  }
}

export const recruiterAnalytics = new RecruiterAnalyticsTracker();
