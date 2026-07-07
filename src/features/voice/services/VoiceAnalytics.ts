export type VoiceAnalyticsEventType =
  | "voice_enabled"
  | "voice_disabled"
  | "speech_started"
  | "speech_completed"
  | "speech_interrupted";

export interface VoiceAnalyticsEvent {
  type: VoiceAnalyticsEventType;
  timestamp: number;
}

export interface VoiceAnalyticsSummary {
  totalEvents: number;
  counts: Record<VoiceAnalyticsEventType, number>;
  events: VoiceAnalyticsEvent[];
}

const EVENT_TYPES: VoiceAnalyticsEventType[] = [
  "voice_enabled",
  "voice_disabled",
  "speech_started",
  "speech_completed",
  "speech_interrupted",
];

/**
 * Session-only analytics for the voice layer. No backend, no persistence —
 * `getSummary()` is the seam a future analytics backend can drain.
 */
class VoiceAnalyticsTracker {
  private readonly events: VoiceAnalyticsEvent[] = [];

  private record(type: VoiceAnalyticsEventType): void {
    this.events.push({ type, timestamp: Date.now() });
  }

  trackVoiceEnabled(): void {
    this.record("voice_enabled");
  }

  trackVoiceDisabled(): void {
    this.record("voice_disabled");
  }

  trackSpeechStarted(): void {
    this.record("speech_started");
  }

  trackSpeechCompleted(): void {
    this.record("speech_completed");
  }

  trackSpeechInterrupted(): void {
    this.record("speech_interrupted");
  }

  getSummary(): VoiceAnalyticsSummary {
    const counts = Object.fromEntries(EVENT_TYPES.map((type) => [type, 0])) as Record<
      VoiceAnalyticsEventType,
      number
    >;
    for (const event of this.events) counts[event.type] += 1;
    return { totalEvents: this.events.length, counts, events: [...this.events] };
  }
}

export const voiceAnalytics = new VoiceAnalyticsTracker();
